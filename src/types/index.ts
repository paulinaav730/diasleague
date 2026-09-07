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

export interface Persona {
  id: string;
  nombreCompleto: string;
  gtId: string;
  activo: boolean;
  email?: string;
  codigoEstudiantil?: string;
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
  diasPointsFinal: number;
  participacionesAsistencia: number;
  retosCompletados: number;
  posicion: number;
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
