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
  HISTORIAL_REAL_2026_1,
} from '../types';

/**
 * Calculates the size factor based on the active member count of the GT.
 * Formula: FACTOR BASE / CANTIDAD DE INTEGRANTES DEL GT (Temporada 2026-2)
 * Default FACTOR BASE = 14 (Ajustado al tamaño del GT más grande para evitar inflación)
 *
 * Examples (Base 14):
 * 14 integrantes: 14 / 14 = 1.00 (Base neutral 1.0x para el grupo más numeroso)
 * 11 integrantes: 14 / 11 = 1.27
 * 10 integrantes: 14 / 10 = 1.40
 * 8 integrantes:  14 / 8  = 1.75
 * 7 integrantes:  14 / 7  = 2.00
 * 6 integrantes:  14 / 6  = 2.33
 */
export function calcularFactorTamano(
  integrantes: number,
  factorBase: number = 14
): number {
  if (integrantes <= 0) {
    return Math.round((factorBase / 10) * 100) / 100;
  }
  const raw = factorBase / integrantes;
  return Math.round(raw * 100) / 100;
}

/**
 * Backward compatibility wrapper for getFactorForIntegrantes
 */
export function getFactorForIntegrantes(
  count: number,
  factores?: FactorTamanoRango[],
  factorBase: number = 14
): number {
  return calcularFactorTamano(count, factorBase);
}

/**
 * Normalizes GT code or name to match HISTORIAL_REAL_2026_1 keys
 */
export function resolverHistorico2026_1(gt: GrupoTrabajo) {
  const normName = gt.nombre
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toUpperCase()
    .trim();
  const normCode = gt.codigo.toUpperCase().trim();

  for (const [key, data] of Object.entries(HISTORIAL_REAL_2026_1)) {
    const normKey = key
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toUpperCase()
      .trim();
    if (
      normKey === normName ||
      normKey === normCode ||
      (normKey === 'LOGISTICA' && (normName.includes('LOGISTICA') || normCode === 'LOG')) ||
      (normKey === 'MERCADEO' && (normName.includes('MERCADEO') || normCode === 'MER' || normName.includes('PUBLICIDAD'))) ||
      (normKey === 'THE GAMES' && (normName.includes('GAMES') || normCode === 'TG')) ||
      (normKey === 'GENERALES' && (normName.includes('GENERAL') || normCode === 'GEN'))
    ) {
      return data;
    }
  }

  return { integrantes: 10, puntosBrutos: 0, factor: 1.6, diasPoints: 0 };
}

/**
 * Calculates GT rankings based on all verified attendances and challenges in the given season.
 * Formula:
 * PUNTOS BRUTOS = Sum of individual attendance points for this GT (excluding MESA in duty) + Sum of GT challenge points
 * DIAS POINTS 2026-2 = PUNTOS BRUTOS * FACTOR DE TAMAÑO (16 / integrantes)
 * DIAS POINTS ACUMULADO = DIAS POINTS 2026-1 + DIAS POINTS 2026-2
 */
export function calcularRankingGts(
  gts: GrupoTrabajo[],
  personas: Persona[],
  asistencias: Asistencia[],
  participacionesRetos: ParticipacionReto[],
  factores: FactorTamanoRango[] | undefined,
  temporadaId: string,
  factorBase: number = 14,
  modoRanking: 'acumulado' | 'temporada' = 'temporada'
): GtCalculado[] {
  // Filter active asistencias and retos for this season
  const seasonAsistencias = asistencias.filter(
    (a) => a.temporadaId === temporadaId && !a.anulado
  );
  const seasonRetos = participacionesRetos.filter(
    (r) => r.temporadaId === temporadaId && !r.anulado
  );

  const rawResults = gts.map((gt) => {
    // Count active members in this GT in 2026-2
    const activeMembers = personas.filter((p) => p.gtId === gt.id && p.activo);
    const totalIntegrantes = activeMembers.length;

    // Size Factor: 16 / totalIntegrantes
    const factorTamano = calcularFactorTamano(totalIntegrantes, factorBase);

    // Points from attendance (Rule 10: If persona is MESA and currently on mesa duty, does NOT sum to GT)
    const gtAsistencias = seasonAsistencias.filter(
      (a) => a.gtId === gt.id && !a.esTurnoMesa
    );
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

    // Gross points 2026-2
    const puntosBrutosTotal = puntosBrutosAsistencia + puntosBrutosRetos;

    // 2026-2 DIAS Points calculation: PUNTOS BRUTOS * FACTOR
    const rawDiasPoints = puntosBrutosTotal * factorTamano;
    const diasPointsTemporada = Math.round(rawDiasPoints * 100) / 100;

    // 2026-1 Historical frozen points
    const hist = resolverHistorico2026_1(gt);
    const diasPoints2026_1 = hist ? hist.diasPoints : 0;

    // Total Acumulado = 2026-1 + 2026-2
    const diasPointsAcumulado =
      Math.round((diasPoints2026_1 + diasPointsTemporada) * 100) / 100;

    const diasPointsFinal =
      modoRanking === 'temporada' ? diasPointsTemporada : diasPointsAcumulado;

    return {
      gt,
      totalIntegrantes,
      factorTamano,
      puntosBrutosAsistencia,
      puntosBrutosRetos,
      puntosBrutosTotal,
      diasPointsTemporada,
      diasPoints2026_1,
      diasPointsAcumulado,
      diasPointsFinal,
      participacionesAsistencia: gtAsistencias.length,
      retosCompletados: gtRetos.length,
      posicion: 0,
      posicionAcumulado: 0,
      posicion2026_2: 0,
    };
  });

  // Calculate Acumulado positions
  const sortedByAcumulado = [...rawResults].sort((a, b) => {
    if (b.diasPointsAcumulado !== a.diasPointsAcumulado) {
      return b.diasPointsAcumulado - a.diasPointsAcumulado;
    }
    if (b.puntosBrutosTotal !== a.puntosBrutosTotal) {
      return b.puntosBrutosTotal - a.puntosBrutosTotal;
    }
    return a.gt.nombre.localeCompare(b.gt.nombre);
  });
  sortedByAcumulado.forEach((item, index) => {
    item.posicionAcumulado = index + 1;
  });

  // Calculate 2026-2 positions
  const sortedBy2026_2 = [...rawResults].sort((a, b) => {
    if (b.diasPointsTemporada !== a.diasPointsTemporada) {
      return b.diasPointsTemporada - a.diasPointsTemporada;
    }
    if (b.puntosBrutosTotal !== a.puntosBrutosTotal) {
      return b.puntosBrutosTotal - a.puntosBrutosTotal;
    }
    return a.gt.nombre.localeCompare(b.gt.nombre);
  });
  sortedBy2026_2.forEach((item, index) => {
    item.posicion2026_2 = index + 1;
  });

  // Final list sorted based on active ranking mode
  const finalResults = modoRanking === 'temporada' ? sortedBy2026_2 : sortedByAcumulado;

  finalResults.forEach((item, index) => {
    item.posicion = index + 1;
  });

  return finalResults;
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
  evento?: Evento,
  factorBase: number = 14
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
    const factorTamano = calcularFactorTamano(totalIntegrantes, factorBase);

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
