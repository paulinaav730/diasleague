import {
  GrupoTrabajo,
  Persona,
  Asistencia,
  ParticipacionReto,
  FactorTamanoRango,
  GtCalculado,
  PersonaCalculada,
} from '../types';

/**
 * Calculates the size factor based on the active member count of the GT.
 * Default rules:
 * 1 to 5 members  -> 1.3
 * 6 to 10 members -> 1.1
 * 11+ members     -> 1.0
 */
export function getFactorForIntegrantes(
  count: number,
  factores: FactorTamanoRango[]
): number {
  if (count <= 0) return 1.0;
  
  // Sort factors to evaluate ranges accurately
  const sorted = [...factores].sort((a, b) => a.minIntegrantes - b.minIntegrantes);
  
  for (const rango of sorted) {
    if (count >= rango.minIntegrantes) {
      if (rango.maxIntegrantes === null || count <= rango.maxIntegrantes) {
        return rango.factor;
      }
    }
  }
  
  // Fallback defaults
  if (count <= 5) return 1.3;
  if (count <= 10) return 1.1;
  return 1.0;
}

/**
 * Calculates GT rankings based on all verified attendances and challenges in the given season.
 * Formula:
 * PUNTOS BRUTOS = Sum of individual attendance points for this GT + Sum of GT challenge points
 * DIAS POINTS = PUNTOS BRUTOS * FACTOR DE TAMAÑO (rounded to 1 decimal)
 */
export function calcularRankingGts(
  gts: GrupoTrabajo[],
  personas: Persona[],
  asistencias: Asistencia[],
  participacionesRetos: ParticipacionReto[],
  factores: FactorTamanoRango[],
  temporadaId: string
): GtCalculado[] {
  // Filter active asistencias and retos for this season
  const seasonAsistencias = asistencias.filter(
    (a) => a.temporadaId === temporadaId && !a.anulado
  );
  const seasonRetos = participacionesRetos.filter(
    (r) => r.temporadaId === temporadaId && !r.anulado
  );

  const results: GtCalculado[] = gts.map((gt) => {
    // Count active members in this GT
    const activeMembers = personas.filter((p) => p.gtId === gt.id && p.activo);
    const totalIntegrantes = activeMembers.length;

    // Size Factor
    const factorTamano = getFactorForIntegrantes(totalIntegrantes, factores);

    // Points from attendance
    const gtAsistencias = seasonAsistencias.filter((a) => a.gtId === gt.id);
    const puntosBrutosAsistencia = gtAsistencias.reduce(
      (sum, a) => sum + (a.puntosOtorgados || 0),
      0
    );

    // Points from challenges
    const gtRetos = seasonRetos.filter((r) => r.gtId === gt.id);
    const puntosBrutosRetos = gtRetos.reduce(
      (sum, r) => sum + (r.puntosOtorgados || 0),
      0
    );

    // Gross points
    const puntosBrutosTotal = puntosBrutosAsistencia + puntosBrutosRetos;

    // DIAS Points calculation: PUNTOS BRUTOS * FACTOR
    // Round to 1 decimal place for clean display
    const rawDiasPoints = puntosBrutosTotal * factorTamano;
    const diasPointsFinal = Math.round(rawDiasPoints * 10) / 10;

    return {
      gt,
      totalIntegrantes,
      factorTamano,
      puntosBrutosAsistencia,
      puntosBrutosRetos,
      puntosBrutosTotal,
      diasPointsFinal,
      participacionesAsistencia: gtAsistencias.length,
      retosCompletados: gtRetos.length,
      posicion: 0, // Assigned below after sorting
    };
  });

  // Sort descending by DIAS Points. If tied, sort by gross points, then name.
  results.sort((a, b) => {
    if (b.diasPointsFinal !== a.diasPointsFinal) {
      return b.diasPointsFinal - a.diasPointsFinal;
    }
    if (b.puntosBrutosTotal !== a.puntosBrutosTotal) {
      return b.puntosBrutosTotal - a.puntosBrutosTotal;
    }
    return a.gt.nombre.localeCompare(b.gt.nombre);
  });

  // Assign 1-indexed position
  results.forEach((item, index) => {
    item.posicion = index + 1;
  });

  return results;
}

/**
 * Calculates individual member rankings based on their personal participation.
 * Notice: Size Factor DOES NOT apply to personal points!
 * PUNTOS PERSONALES = Sum of attendance points + Sum of individual challenges
 */
export function calcularRankingPersonas(
  personas: Persona[],
  gts: GrupoTrabajo[],
  asistencias: Asistencia[],
  participacionesRetos: ParticipacionReto[],
  temporadaId: string
): PersonaCalculada[] {
  const seasonAsistencias = asistencias.filter(
    (a) => a.temporadaId === temporadaId && !a.anulado
  );
  const seasonRetos = participacionesRetos.filter(
    (r) => r.temporadaId === temporadaId && !r.anulado && r.personaId
  );

  const gtMap = new Map<string, GrupoTrabajo>();
  gts.forEach((gt) => gtMap.set(gt.id, gt));

  const results: PersonaCalculada[] = personas
    .filter((p) => p.activo)
    .map((persona) => {
      const gt = gtMap.get(persona.gtId);

      // Personal attendance points
      const pAsistencias = seasonAsistencias.filter((a) => a.personaId === persona.id);
      const puntosAsistencia = pAsistencias.reduce(
        (sum, a) => sum + (a.puntosOtorgados || 0),
        0
      );

      // Personal challenge points
      const pRetos = seasonRetos.filter((r) => r.personaId === persona.id);
      const puntosRetos = pRetos.reduce(
        (sum, r) => sum + (r.puntosOtorgados || 0),
        0
      );

      const diasPointsTotal = puntosAsistencia + puntosRetos;

      // Unique events attended
      const uniqueEvents = new Set(pAsistencias.map((a) => a.eventoId));

      return {
        persona,
        gt,
        puntosAsistencia,
        puntosRetos,
        diasPointsTotal,
        totalEventos: uniqueEvents.size,
        posicion: 0,
      };
    });

  // Sort descending by total DIAS Points
  results.sort((a, b) => {
    if (b.diasPointsTotal !== a.diasPointsTotal) {
      return b.diasPointsTotal - a.diasPointsTotal;
    }
    return a.persona.nombreCompleto.localeCompare(b.persona.nombreCompleto);
  });

  results.forEach((item, index) => {
    item.posicion = index + 1;
  });

  return results;
}
