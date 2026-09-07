import {
  Temporada,
  GrupoTrabajo,
  Persona,
  Evento,
  Turno,
  Asistencia,
  Reto,
  ParticipacionReto,
  FactorTamanoRango,
  AuditLog,
} from '../types';

export const TEMPORADA_ACTIVA_ID = 'temp-2026-2';

export const INITIAL_TEMPORADAS: Temporada[] = [
  {
    id: 'temp-2026-2',
    nombre: 'Temporada 2026-2',
    activa: true,
    fechaInicio: '2026-08-01',
    fechaFin: '2026-11-30',
    descripcion: 'Temporada actual en curso de DIAS League - Segundo semestre 2026',
    createdAt: '2026-08-01T08:00:00Z',
  },
  {
    id: 'temp-2026-1',
    nombre: 'Temporada 2026-1',
    activa: false,
    fechaInicio: '2026-02-01',
    fechaFin: '2026-06-15',
    descripcion: 'Temporada inaugural cerrada',
    createdAt: '2026-02-01T08:00:00Z',
  },
];

export const INITIAL_GTS: GrupoTrabajo[] = [
  {
    id: 'gt-gh',
    nombre: 'GH',
    codigo: 'GH',
    descripcion: 'Gestión Humana y Talento',
    color: '#3B82F6', // Blue
    icono: 'Users',
    activo: true,
    createdAt: '2026-08-01T00:00:00Z',
  },
  {
    id: 'gt-logistica',
    nombre: 'LOGÍSTICA',
    codigo: 'LOG',
    descripcion: 'Operaciones, Montajes y Logística de Eventos',
    color: '#10B981', // Emerald
    icono: 'Boxes',
    activo: true,
    createdAt: '2026-08-01T00:00:00Z',
  },
  {
    id: 'gt-rrpp',
    nombre: 'RRPP',
    codigo: 'RRPP',
    descripcion: 'Relaciones Públicas y Patrocinios',
    color: '#8B5CF6', // Purple
    icono: 'Megaphone',
    activo: true,
    createdAt: '2026-08-01T00:00:00Z',
  },
  {
    id: 'gt-mercadeo',
    nombre: 'MERCADEO',
    codigo: 'MER',
    descripcion: 'Mercadeo, Redes, Diseño y Contenido Audiovisual',
    color: '#EC4899', // Pink
    icono: 'Palette',
    activo: true,
    createdAt: '2026-08-01T00:00:00Z',
  },
  {
    id: 'gt-generales',
    nombre: 'GENERALES',
    codigo: 'GEN',
    descripcion: 'Comité General y Coordinación Interdisciplinaria',
    color: '#F59E0B', // Amber
    icono: 'Compass',
    activo: true,
    createdAt: '2026-08-01T00:00:00Z',
  },
  {
    id: 'gt-the-games',
    nombre: 'THE GAMES',
    codigo: 'TG',
    descripcion: 'Torneos, Recreación y Gaming',
    color: '#06B6D4', // Cyan
    icono: 'Gamepad2',
    activo: true,
    createdAt: '2026-08-01T00:00:00Z',
  },
  {
    id: 'gt-carnival',
    nombre: 'CARNIVAL',
    codigo: 'CARN',
    descripcion: 'Cultura, Festivales y Experiencias',
    color: '#F97316', // Orange
    icono: 'Sparkles',
    activo: true,
    createdAt: '2026-08-01T00:00:00Z',
  },
  {
    id: 'gt-finanzas',
    nombre: 'FINANZAS',
    codigo: 'FIN',
    descripcion: 'Presupuestos, Compras y Tesorería',
    color: '#14B8A6', // Teal
    icono: 'BadgeDollarSign',
    activo: true,
    createdAt: '2026-08-01T00:00:00Z',
  },
  {
    id: 'gt-seguridad',
    nombre: 'SEGURIDAD',
    codigo: 'SEG',
    descripcion: 'Control, Protocolos y Primeros Auxilios',
    color: '#EF4444', // Red
    icono: 'ShieldCheck',
    activo: true,
    createdAt: '2026-08-01T00:00:00Z',
  },
];

export const INITIAL_FACTORES: FactorTamanoRango[] = [
  {
    id: 'factor-1',
    minIntegrantes: 1,
    maxIntegrantes: 5,
    factor: 1.3,
    descripcion: 'Equipos pequeños (1 a 5 integrantes) - Factor 1.3',
  },
  {
    id: 'factor-2',
    minIntegrantes: 6,
    maxIntegrantes: 10,
    factor: 1.1,
    descripcion: 'Equipos medianos (6 a 10 integrantes) - Factor 1.1',
  },
  {
    id: 'factor-3',
    minIntegrantes: 11,
    maxIntegrantes: null,
    factor: 1.0,
    descripcion: 'Equipos grandes (11 o más integrantes) - Factor 1.0',
  },
];

// Initial personas: Clean empty state for real DIAS data upload
export const INITIAL_PERSONAS: Persona[] = [];

export const INITIAL_EVENTOS: Evento[] = [
  {
    id: 'eve-expecta-dias',
    nombre: 'EXPECTA DIAS',
    descripcion: 'Gran jornada de expectativa y bienvenida con turnos escalonados y registro por código QR.',
    fecha: '2026-09-10',
    temporadaId: 'temp-2026-2',
    estado: 'activo',
    tipoEvento: 'turnos_qr',
    puntosAsistencia: 10,
    utilizaQr: true,
    utilizaTurnos: true,
    tieneRetos: true,
    lugar: 'Plazoleta Central EAFIT',
    createdAt: '2026-08-15T09:00:00Z',
  },
  {
    id: 'eve-conecta2-1',
    nombre: 'CONECTA2 (1)',
    descripcion: 'Primer encuentro de integración, dinámicas inter-GTs y retos de apertura.',
    fecha: '2026-08-12',
    temporadaId: 'temp-2026-2',
    estado: 'finalizado',
    tipoEvento: 'asistencia',
    puntosAsistencia: 10,
    utilizaQr: true,
    utilizaTurnos: false,
    tieneRetos: true,
    lugar: 'Auditorio 38-101',
    createdAt: '2026-08-05T09:00:00Z',
  },
  {
    id: 'eve-conecta2-2',
    nombre: 'CONECTA2 (2)',
    descripcion: 'Segunda jornada formativa, trabajo en equipo y retos temáticos.',
    fecha: '2026-08-19',
    temporadaId: 'temp-2026-2',
    estado: 'finalizado',
    tipoEvento: 'asistencia',
    puntosAsistencia: 20,
    utilizaQr: true,
    utilizaTurnos: false,
    tieneRetos: true,
    lugar: 'Bloque 19',
    createdAt: '2026-08-10T09:00:00Z',
  },
  {
    id: 'eve-reto-special',
    nombre: 'RETO DIAS',
    descripcion: 'Desafío especial de creatividad, estrategia y velocidad entre Grupos de Trabajo.',
    fecha: '2026-08-26',
    temporadaId: 'temp-2026-2',
    estado: 'finalizado',
    tipoEvento: 'retos',
    puntosAsistencia: 0,
    utilizaQr: true,
    utilizaTurnos: false,
    tieneRetos: true,
    lugar: 'Canchas EAFIT',
    createdAt: '2026-08-15T09:00:00Z',
  },
  {
    id: 'eve-conecta2-3',
    nombre: 'CONECTA2 (3)',
    descripcion: 'Tercer encuentro con dinámicas avanzadas y retos de medio semestre.',
    fecha: '2026-09-02',
    temporadaId: 'temp-2026-2',
    estado: 'finalizado',
    tipoEvento: 'asistencia',
    puntosAsistencia: 30,
    utilizaQr: true,
    utilizaTurnos: false,
    tieneRetos: true,
    lugar: 'Plazoleta del Estudiante',
    createdAt: '2026-08-20T09:00:00Z',
  },
  {
    id: 'eve-conecta2-4',
    nombre: 'CONECTA2 (4)',
    descripcion: 'Cuarta jornada con máxima puntuación individual, asistencia ponderada y retos especiales.',
    fecha: '2026-09-18',
    temporadaId: 'temp-2026-2',
    estado: 'programado',
    tipoEvento: 'asistencia',
    puntosAsistencia: 40,
    utilizaQr: true,
    utilizaTurnos: false,
    tieneRetos: true,
    lugar: 'Hall Bloque 38',
    createdAt: '2026-08-25T09:00:00Z',
  },
];

export const INITIAL_TURNOS: Turno[] = [
  {
    id: 'tur-expecta-1',
    eventoId: 'eve-expecta-dias',
    temporadaId: 'temp-2026-2',
    nombre: 'Turno 1',
    horaInicio: '08:00 AM',
    horaFin: '10:00 AM',
    estado: 'activo', // Currently open for demonstration!
    qrToken: 'qr-expecta-t1-8am-dias',
    activo: true,
    createdAt: '2026-09-07T08:00:00Z',
  },
  {
    id: 'tur-expecta-2',
    eventoId: 'eve-expecta-dias',
    temporadaId: 'temp-2026-2',
    nombre: 'Turno 2',
    horaInicio: '10:00 AM',
    horaFin: '12:00 PM',
    estado: 'programado',
    qrToken: 'qr-expecta-t2-10am-dias',
    activo: false,
    createdAt: '2026-09-07T08:00:00Z',
  },
  {
    id: 'tur-expecta-3',
    eventoId: 'eve-expecta-dias',
    temporadaId: 'temp-2026-2',
    nombre: 'Turno 3',
    horaInicio: '01:00 PM',
    horaFin: '03:00 PM',
    estado: 'programado',
    qrToken: 'qr-expecta-t3-1pm-dias',
    activo: false,
    createdAt: '2026-09-07T08:00:00Z',
  },
  {
    id: 'tur-expecta-4',
    eventoId: 'eve-expecta-dias',
    temporadaId: 'temp-2026-2',
    nombre: 'Turno 4',
    horaInicio: '03:00 PM',
    horaFin: '05:00 PM',
    estado: 'programado',
    qrToken: 'qr-expecta-t4-3pm-dias',
    activo: false,
    createdAt: '2026-09-07T08:00:00Z',
  },
];

export const INITIAL_RETOS: Reto[] = [
  {
    id: 'reto-conecta2-rally',
    eventoId: 'eve-reto-special',
    temporadaId: 'temp-2026-2',
    nombre: 'Rally de Habilidades DIAS',
    descripcion: 'Circuito de velocidad y resolución de pistas por el campus universitario.',
    puntos: 25,
    tipoReto: 'grupal',
    estado: 'finalizado',
    fecha: '2026-08-26',
    createdAt: '2026-08-20T10:00:00Z',
  },
  {
    id: 'reto-creatividad-social',
    eventoId: 'eve-reto-special',
    temporadaId: 'temp-2026-2',
    nombre: 'Desafío Multimedia EAFIT',
    descripcion: 'Creación de reel viral de mayor impacto institucional.',
    puntos: 35,
    tipoReto: 'grupal',
    estado: 'activo',
    fecha: '2026-09-05',
    createdAt: '2026-08-28T10:00:00Z',
  },
];

// Initial attendances: Clean empty state for production and manual point loading
export const INITIAL_ASISTENCIAS: Asistencia[] = [];

// Initial challenge participations: Clean empty state
export const INITIAL_PARTICIPACION_RETOS: ParticipacionReto[] = [];

export const INITIAL_AUDIT_LOGS: AuditLog[] = [
  {
    id: 'log-1',
    accion: 'CREAR_TEMPORADA',
    tipoEntidad: 'temporada',
    entidadId: 'temp-2026-2',
    detalles: 'Se inició la Temporada 2026-2 con 9 GTs',
    usuario: 'Administrador DIAS',
    fecha: '2026-08-01T08:00:00Z',
  },
  {
    id: 'log-2',
    accion: 'CREAR_EVENTO',
    tipoEntidad: 'evento',
    entidadId: 'eve-expecta-dias',
    detalles: 'Se configuró EXPECTA DIAS con 4 turnos QR (10 pts/asistencia)',
    usuario: 'Administrador DIAS',
    fecha: '2026-08-15T09:00:00Z',
  },
  {
    id: 'log-3',
    accion: 'ACTIVAR_TURNO',
    tipoEntidad: 'turno',
    entidadId: 'tur-expecta-1',
    detalles: 'Apertura de Turno 1 (08:00 AM - 10:00 AM) para registro QR',
    usuario: 'Administrador DIAS',
    fecha: '2026-09-07T08:00:00Z',
  },
];
