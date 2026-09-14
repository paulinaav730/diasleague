export interface Temporada {
  id: string;
  nombre: string; // e.g. "Temporada 2026-2"
  activa: boolean;
  fechaInicio: string;
  fechaFin: string;
  descripcion?: string;
  createdAt: string;
}

export interface GrupoTrabajo {
  id: string;
  nombre: string; // e.g. "GH", "LOGÍSTICA", "RRPP", "MERCADEO", "GENERALES", "THE GAMES", "CARNIVAL", "FINANZAS", "SEGURIDAD"
  codigo: string;
  descripcion?: string;
  color: string;
  icono: string;
  activo: boolean;
  createdAt: string;
}

export type PersonaTipo = 'GT' | 'MESA' | 'GAP';

export interface Persona {
  id: string;
  nombreCompleto: string;
  gtId: string;
  tipo: PersonaTipo;
  temporadaId: string;
  activo: boolean;
  email?: string;
  codigoEstudiantil?: string;
  turnosMesa?: string[];
  createdAt: string;
}

export type EventoEstado = 'programado' | 'activo' | 'finalizado';

export interface Evento {
  id: string;
  nombre: string;
  descripcion: string;
  fecha: string;
  temporadaId: string;
  estado: EventoEstado;
  tipoEvento: 'asistencia' | 'turnos_qr' | 'retos' | 'mixto';
  puntosAsistencia: number;
  utilizaQr: boolean;
  utilizaTurnos: boolean;
  tieneRetos: boolean;
  lugar?: string;
  createdAt: string;
}

export type TurnoEstado = 'programado' | 'activo' | 'finalizado';

export interface Turno {
  id: string;
  eventoId: string;
  temporadaId: string;
  nombre: string; // e.g. "Turno 1"
  horaInicio: string; // e.g. "08:00 AM"
  horaFin: string; // e.g. "10:00 AM"
  estado: TurnoEstado;
  qrToken: string;
  activo: boolean;
  createdAt: string;
}

export interface Asistencia {
  id: string;
  personaId: string;
  eventoId: string;
  turnoId?: string | null;
  temporadaId: string;
  gtId: string;
  puntosOtorgados: number;
  fechaRegistro: string;
  origen: 'qr' | 'manual';
  esTurnoMesa?: boolean; // When true, MESA person on duty -> personal points granted, GT points 0
  actividadTipo?: string;
  anulado?: boolean;
  anuladoMotivo?: string;
}

export type RetoTipo = 'individual' | 'grupal';
export type RetoEstado = 'activo' | 'finalizado';

export interface Reto {
  id: string;
  eventoId: string;
  temporadaId: string;
  nombre: string;
  descripcion: string;
  puntos: number;
  tipoReto: RetoTipo;
  estado: RetoEstado;
  fecha: string;
  createdAt: string;
}

export interface ParticipacionReto {
  id: string;
  retoId: string;
  eventoId: string;
  temporadaId: string;
  gtId: string;
  personaId?: string | null;
  puntosOtorgados: number;
  posicion?: number; // 1 = 1er puesto, etc.
  observacion?: string;
  fechaRegistro: string;
  anulado?: boolean;
}

export interface FactorTamanoRango {
  id: string;
  minIntegrantes: number;
  maxIntegrantes: number | null; // null means and above
  factor: number;
  descripcion?: string;
}

export interface AuditLog {
  id: string;
  accion: string;
  tipoEntidad: string;
  entidadId: string;
  detalles: string;
  usuario: string;
  fecha: string;
}

// Derived/Calculated types
export interface GtCalculado {
  gt: GrupoTrabajo;
  totalIntegrantes: number;
  factorTamano: number;
  puntosBrutosAsistencia: number;
  puntosBrutosRetos: number;
  puntosBrutosTotal: number;
  diasPointsTemporada: number; // DIAS Points generated in active season (2026-2)
  diasPoints2026_1: number; // Historical 2026-1 frozen points
  diasPointsAcumulado: number; // diasPoints2026_1 + diasPointsTemporada
  diasPointsFinal: number; // Display points depending on view
  participacionesAsistencia: number;
  retosCompletados: number;
  posicion: number;
  posicionAcumulado?: number;
  posicion2026_2?: number;
  posicionAnterior?: number;
}

export interface PersonaCalculada {
  persona: Persona;
  gt: GrupoTrabajo | undefined;
  puntosAsistencia: number;
  puntosRetos: number;
  diasPointsTotal: number;
  totalEventos: number;
  posicion: number;
}

export interface HistoricoGt2026_1 {
  gtCodigo: string;
  gtNombre: string;
  integrantes: number;
  puntosBrutos: number;
  factor: number;
  diasPoints: number;
}

// Historical frozen results from DIAS LEAGUE 2026-1 (Prompt spec #6)
export const HISTORIAL_REAL_2026_1: Record<
  string,
  { integrantes: number; puntosBrutos: number; factor: number; diasPoints: number }
> = {
  GH: { integrantes: 10, puntosBrutos: 250, factor: 1.6, diasPoints: 400 },
  LOGÍSTICA: { integrantes: 14, puntosBrutos: 360, factor: 1.14, diasPoints: 410.4 },
  RRPP: { integrantes: 7, puntosBrutos: 130, factor: 2.29, diasPoints: 297.7 },
  MERCADEO: { integrantes: 10, puntosBrutos: 110, factor: 1.6, diasPoints: 176 },
  GENERALES: { integrantes: 8, puntosBrutos: 110, factor: 2.0, diasPoints: 220 },
  'THE GAMES': { integrantes: 8, puntosBrutos: 190, factor: 2.0, diasPoints: 380 },
  CARNIVAL: { integrantes: 14, puntosBrutos: 230, factor: 1.14, diasPoints: 262.2 },
  FINANZAS: { integrantes: 6, puntosBrutos: 140, factor: 2.67, diasPoints: 373.8 },
  SEGURIDAD: { integrantes: 11, puntosBrutos: 380, factor: 1.45, diasPoints: 551 },
};

export interface RetoDetalleConectado {
  retoId: string;
  retoNombre: string;
  puntos: number;
  posicion?: number;
  personaNombre?: string;
}

export interface ResultadoConectadoGt {
  gt: GrupoTrabajo;
  totalIntegrantes: number;
  asistentes: number;
  porcentajeAsistencia: number;
  factorTamano: number;
  puntosAsistenciaBrutos: number;
  puntosAsistenciaAjustados: number;
  puntosRetos: number;
  retosGanados: RetoDetalleConectado[];
  resultadoGeneral: number;
  posicion: number;
}
