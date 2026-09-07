import {
  GrupoTrabajo,
  Persona,
  Asistencia,
  ParticipacionReto,
  Reto,
  Evento,
  FactorTamanoRango,
  GtCalculado,
  PersonaCalculada,
  ResultadoConectadoGt,
  RetoDetalleConectado,
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

/**
 * Calculates the individual and combined results for a specific Conectado (Event):
 * 1. Asistencia de acuerdo al número de integrantes de cada GT (% asistencia y factor tamaño).
 * 2. Retos realizados dentro de este Conectado que suman puntos adicionales.
 * 3. Resultado General del Conectado = Asistencia ponderada + Retos del Conectado.
 */
export function calcularResultadoConectado(
  eventoId: string,
  gts: GrupoTrabajo[],
  personas: Persona[],
  asistencias: Asistencia[],
  retos: Reto[],
  participacionesRetos: ParticipacionReto[],
  factores: FactorTamanoRango[],
  evento?: Evento
): ResultadoConectadoGt[] {
  // Filter attendances for this specific Conectado
  const evAsistencias = asistencias.filter(
    (a) => a.eventoId === eventoId && !a.anulado
  );

  // Retos belonging to this Conectado
  const evRetos = retos.filter((r) => r.eventoId === eventoId);
  const evRetoIds = new Set(evRetos.map((r) => r.id));

  // Challenge awards for this Conectado (either matched by eventoId or by retoId)
  const evParticipaciones = participacionesRetos.filter(
    (pr) => (!pr.anulado && (pr.eventoId === eventoId || evRetoIds.has(pr.retoId)))
  );

  const personasMap = new Map<string, Persona>();
  personas.forEach((p) => personasMap.set(p.id, p));

  const retosMap = new Map<string, Reto>();
  retos.forEach((r) => retosMap.set(r.id, r));

  const results: ResultadoConectadoGt[] = gts.map((gt) => {
    const activeMembers = personas.filter((p) => p.gtId === gt.id && p.activo);
    const totalIntegrantes = activeMembers.length;
    const factorTamano = getFactorForIntegrantes(totalIntegrantes, factores);

    // Attendees for this GT in this Conectado (unique participants)
    const gtAsistencias = evAsistencias.filter((a) => a.gtId === gt.id);
    const asistentes = gtAsistencias.length;

    const porcentajeAsistencia =
      totalIntegrantes > 0
        ? Math.min(100, Math.round((asistentes / totalIntegrantes) * 1000) / 10)
        : 0;

    // Gross attendance points
    const puntosAsistenciaBrutos = gtAsistencias.reduce(
      (sum, a) => sum + (a.puntosOtorgados || (evento?.puntosAsistencia || 10)),
      0
    );

    // Adjusted attendance points with Size Factor
    const rawAjustados = puntosAsistenciaBrutos * factorTamano;
    const puntosAsistenciaAjustados = Math.round(rawAjustados * 10) / 10;

    // Challenges points for this GT in this Conectado
    const gtParticipaciones = evParticipaciones.filter((pr) => pr.gtId === gt.id);
    const puntosRetos = gtParticipaciones.reduce(
      (sum, pr) => sum + (pr.puntosOtorgados || 0),
      0
    );

    const retosGanados: RetoDetalleConectado[] = gtParticipaciones.map((pr) => {
      const r = retosMap.get(pr.retoId);
      const per = pr.personaId ? personasMap.get(pr.personaId) : undefined;
      return {
        retoId: pr.retoId,
        retoNombre: r?.nombre || 'Reto del Conectado',
        puntos: pr.puntosOtorgados,
        posicion: pr.posicion,
        personaNombre: per?.nombreCompleto,
      };
    });

    // Resultado General del Conectado = Asistencia Ajustada + Retos
    const resultadoGeneral = Math.round((puntosAsistenciaAjustados + puntosRetos) * 10) / 10;

    return {
      gt,
      totalIntegrantes,
      asistentes,
      porcentajeAsistencia,
      factorTamano,
      puntosAsistenciaBrutos,
      puntosAsistenciaAjustados,
      puntosRetos,
      retosGanados,
      resultadoGeneral,
      posicion: 0,
    };
  });

  // Sort by Conectado General Result descending
  results.sort((a, b) => {
    if (b.resultadoGeneral !== a.resultadoGeneral) {
      return b.resultadoGeneral - a.resultadoGeneral;
    }
    if (b.porcentajeAsistencia !== a.porcentajeAsistencia) {
      return b.porcentajeAsistencia - a.porcentajeAsistencia;
    }
    return a.gt.nombre.localeCompare(b.gt.nombre);
  });

  results.forEach((r, idx) => {
    r.posicion = idx + 1;
  });

  return results;
}
