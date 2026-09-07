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
    nombre: 'Logística',
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
    id: 'gt-publicidad',
    nombre: 'Publicidad',
    codigo: 'PUB',
    descripcion: 'Diseño Gráfico, Contenido y Audiovisuales',
    color: '#EC4899', // Pink
    icono: 'Palette',
    activo: true,
    createdAt: '2026-08-01T00:00:00Z',
  },
  {
    id: 'gt-generales',
    nombre: 'Generales',
    codigo: 'GEN',
    descripcion: 'Comité General y Coordinación Interdisciplinaria',
    color: '#F59E0B', // Amber
    icono: 'Compass',
    activo: true,
    createdAt: '2026-08-01T00:00:00Z',
  },
  {
    id: 'gt-the-games',
    nombre: 'The Games',
    codigo: 'TG',
    descripcion: 'Torneos, Recreación y Gaming',
    color: '#06B6D4', // Cyan
    icono: 'Gamepad2',
    activo: true,
    createdAt: '2026-08-01T00:00:00Z',
  },
  {
    id: 'gt-carnival',
    nombre: 'Carnival',
    codigo: 'CARN',
    descripcion: 'Cultura, Festivales y Experiencias',
    color: '#F97316', // Orange
    icono: 'Sparkles',
    activo: true,
    createdAt: '2026-08-01T00:00:00Z',
  },
  {
    id: 'gt-finanzas',
    nombre: 'Finanzas',
    codigo: 'FIN',
    descripcion: 'Presupuestos, Compras y Tesorería',
    color: '#14B8A6', // Teal
    icono: 'BadgeDollarSign',
    activo: true,
    createdAt: '2026-08-01T00:00:00Z',
  },
  {
    id: 'gt-seguridad',
    nombre: 'Seguridad',
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

// Initial mock people respecting the specific team member counts from Section 38
export const INITIAL_PERSONAS: Persona[] = [
  // GH: 5 integrantes
  { id: 'per-gh-1', nombreCompleto: 'Laura Rodríguez', gtId: 'gt-gh', activo: true, createdAt: '2026-08-01T10:00:00Z' },
  { id: 'per-gh-2', nombreCompleto: 'Mateo Mejía', gtId: 'gt-gh', activo: true, createdAt: '2026-08-01T10:00:00Z' },
  { id: 'per-gh-3', nombreCompleto: 'Valentina Cano', gtId: 'gt-gh', activo: true, createdAt: '2026-08-01T10:00:00Z' },
  { id: 'per-gh-4', nombreCompleto: 'Daniel Bedoya', gtId: 'gt-gh', activo: true, createdAt: '2026-08-01T10:00:00Z' },
  { id: 'per-gh-5', nombreCompleto: 'Sofía Morales', gtId: 'gt-gh', activo: true, createdAt: '2026-08-01T10:00:00Z' },

  // Logística: 12 integrantes
  { id: 'per-log-1', nombreCompleto: 'Juan Gómez', gtId: 'gt-logistica', activo: true, createdAt: '2026-08-01T10:00:00Z' },
  { id: 'per-log-2', nombreCompleto: 'Camila Restrepo', gtId: 'gt-logistica', activo: true, createdAt: '2026-08-01T10:00:00Z' },
  { id: 'per-log-3', nombreCompleto: 'Alejandro Ruiz', gtId: 'gt-logistica', activo: true, createdAt: '2026-08-01T10:00:00Z' },
  { id: 'per-log-4', nombreCompleto: 'Mariana Vélez', gtId: 'gt-logistica', activo: true, createdAt: '2026-08-01T10:00:00Z' },
  { id: 'per-log-5', nombreCompleto: 'Felipe Cardona', gtId: 'gt-logistica', activo: true, createdAt: '2026-08-01T10:00:00Z' },
  { id: 'per-log-6', nombreCompleto: 'Valeria Osorio', gtId: 'gt-logistica', activo: true, createdAt: '2026-08-01T10:00:00Z' },
  { id: 'per-log-7', nombreCompleto: 'Tomás Arango', gtId: 'gt-logistica', activo: true, createdAt: '2026-08-01T10:00:00Z' },
  { id: 'per-log-8', nombreCompleto: 'Manuela Pérez', gtId: 'gt-logistica', activo: true, createdAt: '2026-08-01T10:00:00Z' },
  { id: 'per-log-9', nombreCompleto: 'Santiago Henao', gtId: 'gt-logistica', activo: true, createdAt: '2026-08-01T10:00:00Z' },
  { id: 'per-log-10', nombreCompleto: 'Isabella Díaz', gtId: 'gt-logistica', activo: true, createdAt: '2026-08-01T10:00:00Z' },
  { id: 'per-log-11', nombreCompleto: 'Esteban Londoño', gtId: 'gt-logistica', activo: true, createdAt: '2026-08-01T10:00:00Z' },
  { id: 'per-log-12', nombreCompleto: 'Sara Quintero', gtId: 'gt-logistica', activo: true, createdAt: '2026-08-01T10:00:00Z' },

  // RRPP: 7 integrantes
  { id: 'per-rrpp-1', nombreCompleto: 'María Pérez', gtId: 'gt-rrpp', activo: true, createdAt: '2026-08-01T10:00:00Z' },
  { id: 'per-rrpp-2', nombreCompleto: 'Lucas Giraldo', gtId: 'gt-rrpp', activo: true, createdAt: '2026-08-01T10:00:00Z' },
  { id: 'per-rrpp-3', nombreCompleto: 'Carolina Jaramillo', gtId: 'gt-rrpp', activo: true, createdAt: '2026-08-01T10:00:00Z' },
  { id: 'per-rrpp-4', nombreCompleto: 'Julián Castro', gtId: 'gt-rrpp', activo: true, createdAt: '2026-08-01T10:00:00Z' },
  { id: 'per-rrpp-5', nombreCompleto: 'Andrea Duque', gtId: 'gt-rrpp', activo: true, createdAt: '2026-08-01T10:00:00Z' },
  { id: 'per-rrpp-6', nombreCompleto: 'David Correa', gtId: 'gt-rrpp', activo: true, createdAt: '2026-08-01T10:00:00Z' },
  { id: 'per-rrpp-7', nombreCompleto: 'Gabriela Silva', gtId: 'gt-rrpp', activo: true, createdAt: '2026-08-01T10:00:00Z' },

  // Publicidad: 8 integrantes
  { id: 'per-pub-1', nombreCompleto: 'Nicolás Ortiz', gtId: 'gt-publicidad', activo: true, createdAt: '2026-08-01T10:00:00Z' },
  { id: 'per-pub-2', nombreCompleto: 'Paula Zapata', gtId: 'gt-publicidad', activo: true, createdAt: '2026-08-01T10:00:00Z' },
  { id: 'per-pub-3', nombreCompleto: 'Samuel Echeverri', gtId: 'gt-publicidad', activo: true, createdAt: '2026-08-01T10:00:00Z' },
  { id: 'per-pub-4', nombreCompleto: 'Melissa Gómez', gtId: 'gt-publicidad', activo: true, createdAt: '2026-08-01T10:00:00Z' },
  { id: 'per-pub-5', nombreCompleto: 'Andrés Botero', gtId: 'gt-publicidad', activo: true, createdAt: '2026-08-01T10:00:00Z' },
  { id: 'per-pub-6', nombreCompleto: 'Paulina Ríos', gtId: 'gt-publicidad', activo: true, createdAt: '2026-08-01T10:00:00Z' },
  { id: 'per-pub-7', nombreCompleto: 'Gabriel Montoya', gtId: 'gt-publicidad', activo: true, createdAt: '2026-08-01T10:00:00Z' },
  { id: 'per-pub-8', nombreCompleto: 'Natalia Franco', gtId: 'gt-publicidad', activo: true, createdAt: '2026-08-01T10:00:00Z' },

  // Generales: 15 integrantes
  { id: 'per-gen-1', nombreCompleto: 'Diego Álvarez', gtId: 'gt-generales', activo: true, createdAt: '2026-08-01T10:00:00Z' },
  { id: 'per-gen-2', nombreCompleto: 'Ana María Toro', gtId: 'gt-generales', activo: true, createdAt: '2026-08-01T10:00:00Z' },
  { id: 'per-gen-3', nombreCompleto: 'Carlos Mario Uribe', gtId: 'gt-generales', activo: true, createdAt: '2026-08-01T10:00:00Z' },
  { id: 'per-gen-4', nombreCompleto: 'Juliana Ramírez', gtId: 'gt-generales', activo: true, createdAt: '2026-08-01T10:00:00Z' },
  { id: 'per-gen-5', nombreCompleto: 'Sebastián Betancur', gtId: 'gt-generales', activo: true, createdAt: '2026-08-01T10:00:00Z' },
  { id: 'per-gen-6', nombreCompleto: 'Laura Villa', gtId: 'gt-generales', activo: true, createdAt: '2026-08-01T10:00:00Z' },
  { id: 'per-gen-7', nombreCompleto: 'Pablo Saldarriaga', gtId: 'gt-generales', activo: true, createdAt: '2026-08-01T10:00:00Z' },
  { id: 'per-gen-8', nombreCompleto: 'Daniela Higuita', gtId: 'gt-generales', activo: true, createdAt: '2026-08-01T10:00:00Z' },
  { id: 'per-gen-9', nombreCompleto: 'Simón Gallego', gtId: 'gt-generales', activo: true, createdAt: '2026-08-01T10:00:00Z' },
  { id: 'per-gen-10', nombreCompleto: 'Luisa Restrepo', gtId: 'gt-generales', activo: true, createdAt: '2026-08-01T10:00:00Z' },
  { id: 'per-gen-11', nombreCompleto: 'Juan Diego Marín', gtId: 'gt-generales', activo: true, createdAt: '2026-08-01T10:00:00Z' },
  { id: 'per-gen-12', nombreCompleto: 'Mariana Cárdenas', gtId: 'gt-generales', activo: true, createdAt: '2026-08-01T10:00:00Z' },
  { id: 'per-gen-13', nombreCompleto: 'Camilo Ochoa', gtId: 'gt-generales', activo: true, createdAt: '2026-08-01T10:00:00Z' },
  { id: 'per-gen-14', nombreCompleto: 'Alejandra Serna', gtId: 'gt-generales', activo: true, createdAt: '2026-08-01T10:00:00Z' },
  { id: 'per-gen-15', nombreCompleto: 'Martín Guzmán', gtId: 'gt-generales', activo: true, createdAt: '2026-08-01T10:00:00Z' },

  // The Games: 4 integrantes
  { id: 'per-tg-1', nombreCompleto: 'Tomás Henao', gtId: 'gt-the-games', activo: true, createdAt: '2026-08-01T10:00:00Z' },
  { id: 'per-tg-2', nombreCompleto: 'Natalia Vargas', gtId: 'gt-the-games', activo: true, createdAt: '2026-08-01T10:00:00Z' },
  { id: 'per-tg-3', nombreCompleto: 'Juan José Lopera', gtId: 'gt-the-games', activo: true, createdAt: '2026-08-01T10:00:00Z' },
  { id: 'per-tg-4', nombreCompleto: 'Valeria Agudelo', gtId: 'gt-the-games', activo: true, createdAt: '2026-08-01T10:00:00Z' },

  // Carnival: 9 integrantes
  { id: 'per-carn-1', nombreCompleto: 'Sebastián Peláez', gtId: 'gt-carnival', activo: true, createdAt: '2026-08-01T10:00:00Z' },
  { id: 'per-carn-2', nombreCompleto: 'Mariana Botero', gtId: 'gt-carnival', activo: true, createdAt: '2026-08-01T10:00:00Z' },
  { id: 'per-carn-3', nombreCompleto: 'Jerónimo Molina', gtId: 'gt-carnival', activo: true, createdAt: '2026-08-01T10:00:00Z' },
  { id: 'per-carn-4', nombreCompleto: 'Vanessa Gil', gtId: 'gt-carnival', activo: true, createdAt: '2026-08-01T10:00:00Z' },
  { id: 'per-carn-5', nombreCompleto: 'Samuel Ospina', gtId: 'gt-carnival', activo: true, createdAt: '2026-08-01T10:00:00Z' },
  { id: 'per-carn-6', nombreCompleto: 'Sofía Herrera', gtId: 'gt-carnival', activo: true, createdAt: '2026-08-01T10:00:00Z' },
  { id: 'per-carn-7', nombreCompleto: 'Cristian Pineda', gtId: 'gt-carnival', activo: true, createdAt: '2026-08-01T10:00:00Z' },
  { id: 'per-carn-8', nombreCompleto: 'Laura Flórez', gtId: 'gt-carnival', activo: true, createdAt: '2026-08-01T10:00:00Z' },
  { id: 'per-carn-9', nombreCompleto: 'Felipe Arias', gtId: 'gt-carnival', activo: true, createdAt: '2026-08-01T10:00:00Z' },

  // Finanzas: 3 integrantes
  { id: 'per-fin-1', nombreCompleto: 'Santiago Posada', gtId: 'gt-finanzas', activo: true, createdAt: '2026-08-01T10:00:00Z' },
  { id: 'per-fin-2', nombreCompleto: 'Manuela Gómez', gtId: 'gt-finanzas', activo: true, createdAt: '2026-08-01T10:00:00Z' },
  { id: 'per-fin-3', nombreCompleto: 'Andrés Felipe Mesa', gtId: 'gt-finanzas', activo: true, createdAt: '2026-08-01T10:00:00Z' },

  // Seguridad: 6 integrantes
  { id: 'per-seg-1', nombreCompleto: 'Carlos Mario Vélez', gtId: 'gt-seguridad', activo: true, createdAt: '2026-08-01T10:00:00Z' },
  { id: 'per-seg-2', nombreCompleto: 'Isabella Salazar', gtId: 'gt-seguridad', activo: true, createdAt: '2026-08-01T10:00:00Z' },
  { id: 'per-seg-3', nombreCompleto: 'Daniel Arbeláez', gtId: 'gt-seguridad', activo: true, createdAt: '2026-08-01T10:00:00Z' },
  { id: 'per-seg-4', nombreCompleto: 'Camila Tabares', gtId: 'gt-seguridad', activo: true, createdAt: '2026-08-01T10:00:00Z' },
  { id: 'per-seg-5', nombreCompleto: 'Juan Esteban Maya', gtId: 'gt-seguridad', activo: true, createdAt: '2026-08-01T10:00:00Z' },
  { id: 'per-seg-6', nombreCompleto: 'Valentina Puerta', gtId: 'gt-seguridad', activo: true, createdAt: '2026-08-01T10:00:00Z' },
];

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
    tieneRetos: false,
    lugar: 'Plazoleta Central EAFIT',
    createdAt: '2026-08-15T09:00:00Z',
  },
  {
    id: 'eve-conecta2-1',
    nombre: 'CONECTA2 (1)',
    descripcion: 'Primer encuentro de integración y dinámicas inter-GTs.',
    fecha: '2026-08-12',
    temporadaId: 'temp-2026-2',
    estado: 'finalizado',
    tipoEvento: 'asistencia',
    puntosAsistencia: 10,
    utilizaQr: false,
    utilizaTurnos: false,
    tieneRetos: false,
    lugar: 'Auditorio 38-101',
    createdAt: '2026-08-05T09:00:00Z',
  },
  {
    id: 'eve-conecta2-2',
    nombre: 'CONECTA2 (2)',
    descripcion: 'Segunda jornada formativa y de trabajo en equipo.',
    fecha: '2026-08-19',
    temporadaId: 'temp-2026-2',
    estado: 'finalizado',
    tipoEvento: 'asistencia',
    puntosAsistencia: 20,
    utilizaQr: false,
    utilizaTurnos: false,
    tieneRetos: false,
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
    utilizaQr: false,
    utilizaTurnos: false,
    tieneRetos: true,
    lugar: 'Canchas EAFIT',
    createdAt: '2026-08-15T09:00:00Z',
  },
  {
    id: 'eve-conecta2-3',
    nombre: 'CONECTA2 (3)',
    descripcion: 'Tercer encuentro con dinámicas avanzadas y evaluación de medio semestre.',
    fecha: '2026-09-02',
    temporadaId: 'temp-2026-2',
    estado: 'finalizado',
    tipoEvento: 'asistencia',
    puntosAsistencia: 30,
    utilizaQr: false,
    utilizaTurnos: false,
    tieneRetos: false,
    lugar: 'Plazoleta del Estudiante',
    createdAt: '2026-08-20T09:00:00Z',
  },
  {
    id: 'eve-conecta2-4',
    nombre: 'CONECTA2 (4)',
    descripcion: 'Cuarta jornada con máxima puntuación individual y de grupo.',
    fecha: '2026-09-18',
    temporadaId: 'temp-2026-2',
    estado: 'programado',
    tipoEvento: 'asistencia',
    puntosAsistencia: 40,
    utilizaQr: false,
    utilizaTurnos: false,
    tieneRetos: false,
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

// Initial realistic participations matching the exact formula test case in prompt:
// GH has CONECTA2 (1) = 4 * 10 = 40, CONECTA2 (2) = 2 * 20 = 40, RETO = 25, CONECTA2 (3) = 1 * 30 = 30 -> 135 pts brutos!
export const INITIAL_ASISTENCIAS: Asistencia[] = [
  // GH in CONECTA2 (1) - 4 personas (40 pts)
  { id: 'asist-gh-c1-1', personaId: 'per-gh-1', eventoId: 'eve-conecta2-1', temporadaId: 'temp-2026-2', gtId: 'gt-gh', puntosOtorgados: 10, fechaRegistro: '2026-08-12T14:15:00Z', origen: 'manual' },
  { id: 'asist-gh-c1-2', personaId: 'per-gh-2', eventoId: 'eve-conecta2-1', temporadaId: 'temp-2026-2', gtId: 'gt-gh', puntosOtorgados: 10, fechaRegistro: '2026-08-12T14:16:00Z', origen: 'manual' },
  { id: 'asist-gh-c1-3', personaId: 'per-gh-3', eventoId: 'eve-conecta2-1', temporadaId: 'temp-2026-2', gtId: 'gt-gh', puntosOtorgados: 10, fechaRegistro: '2026-08-12T14:17:00Z', origen: 'manual' },
  { id: 'asist-gh-c1-4', personaId: 'per-gh-4', eventoId: 'eve-conecta2-1', temporadaId: 'temp-2026-2', gtId: 'gt-gh', puntosOtorgados: 10, fechaRegistro: '2026-08-12T14:18:00Z', origen: 'manual' },

  // GH in CONECTA2 (2) - 2 personas (40 pts)
  { id: 'asist-gh-c2-1', personaId: 'per-gh-1', eventoId: 'eve-conecta2-2', temporadaId: 'temp-2026-2', gtId: 'gt-gh', puntosOtorgados: 20, fechaRegistro: '2026-08-19T14:20:00Z', origen: 'manual' },
  { id: 'asist-gh-c2-2', personaId: 'per-gh-5', eventoId: 'eve-conecta2-2', temporadaId: 'temp-2026-2', gtId: 'gt-gh', puntosOtorgados: 20, fechaRegistro: '2026-08-19T14:22:00Z', origen: 'manual' },

  // GH in CONECTA2 (3) - 1 persona (30 pts)
  { id: 'asist-gh-c3-1', personaId: 'per-gh-1', eventoId: 'eve-conecta2-3', temporadaId: 'temp-2026-2', gtId: 'gt-gh', puntosOtorgados: 30, fechaRegistro: '2026-09-02T15:10:00Z', origen: 'manual' },

  // RRPP in EXPECTA DIAS (Turno 1) - 5 personas (50 pts)
  { id: 'asist-rrpp-exp-1', personaId: 'per-rrpp-1', eventoId: 'eve-expecta-dias', turnoId: 'tur-expecta-1', temporadaId: 'temp-2026-2', gtId: 'gt-rrpp', puntosOtorgados: 10, fechaRegistro: '2026-09-07T08:15:00Z', origen: 'qr' },
  { id: 'asist-rrpp-exp-2', personaId: 'per-rrpp-2', eventoId: 'eve-expecta-dias', turnoId: 'tur-expecta-1', temporadaId: 'temp-2026-2', gtId: 'gt-rrpp', puntosOtorgados: 10, fechaRegistro: '2026-09-07T08:16:00Z', origen: 'qr' },
  { id: 'asist-rrpp-exp-3', personaId: 'per-rrpp-3', eventoId: 'eve-expecta-dias', turnoId: 'tur-expecta-1', temporadaId: 'temp-2026-2', gtId: 'gt-rrpp', puntosOtorgados: 10, fechaRegistro: '2026-09-07T08:18:00Z', origen: 'qr' },
  { id: 'asist-rrpp-exp-4', personaId: 'per-rrpp-4', eventoId: 'eve-expecta-dias', turnoId: 'tur-expecta-1', temporadaId: 'temp-2026-2', gtId: 'gt-rrpp', puntosOtorgados: 10, fechaRegistro: '2026-09-07T08:22:00Z', origen: 'qr' },
  { id: 'asist-rrpp-exp-5', personaId: 'per-rrpp-5', eventoId: 'eve-expecta-dias', turnoId: 'tur-expecta-1', temporadaId: 'temp-2026-2', gtId: 'gt-rrpp', puntosOtorgados: 10, fechaRegistro: '2026-09-07T08:25:00Z', origen: 'qr' },

  // RRPP in CONECTA2 (1 & 2)
  { id: 'asist-rrpp-c1-1', personaId: 'per-rrpp-1', eventoId: 'eve-conecta2-1', temporadaId: 'temp-2026-2', gtId: 'gt-rrpp', puntosOtorgados: 10, fechaRegistro: '2026-08-12T14:20:00Z', origen: 'manual' },
  { id: 'asist-rrpp-c1-2', personaId: 'per-rrpp-6', eventoId: 'eve-conecta2-1', temporadaId: 'temp-2026-2', gtId: 'gt-rrpp', puntosOtorgados: 10, fechaRegistro: '2026-08-12T14:22:00Z', origen: 'manual' },
  { id: 'asist-rrpp-c2-1', personaId: 'per-rrpp-1', eventoId: 'eve-conecta2-2', temporadaId: 'temp-2026-2', gtId: 'gt-rrpp', puntosOtorgados: 20, fechaRegistro: '2026-08-19T14:25:00Z', origen: 'manual' },
  { id: 'asist-rrpp-c3-1', personaId: 'per-rrpp-1', eventoId: 'eve-conecta2-3', temporadaId: 'temp-2026-2', gtId: 'gt-rrpp', puntosOtorgados: 30, fechaRegistro: '2026-09-02T15:20:00Z', origen: 'manual' },

  // Logística in EXPECTA DIAS & CONECTA2 (high member count)
  { id: 'asist-log-exp-1', personaId: 'per-log-1', eventoId: 'eve-expecta-dias', turnoId: 'tur-expecta-1', temporadaId: 'temp-2026-2', gtId: 'gt-logistica', puntosOtorgados: 10, fechaRegistro: '2026-09-07T08:30:00Z', origen: 'qr' },
  { id: 'asist-log-exp-2', personaId: 'per-log-2', eventoId: 'eve-expecta-dias', turnoId: 'tur-expecta-1', temporadaId: 'temp-2026-2', gtId: 'gt-logistica', puntosOtorgados: 10, fechaRegistro: '2026-09-07T08:31:00Z', origen: 'qr' },
  { id: 'asist-log-exp-3', personaId: 'per-log-3', eventoId: 'eve-expecta-dias', turnoId: 'tur-expecta-1', temporadaId: 'temp-2026-2', gtId: 'gt-logistica', puntosOtorgados: 10, fechaRegistro: '2026-09-07T08:32:00Z', origen: 'qr' },
  { id: 'asist-log-c1-1', personaId: 'per-log-1', eventoId: 'eve-conecta2-1', temporadaId: 'temp-2026-2', gtId: 'gt-logistica', puntosOtorgados: 10, fechaRegistro: '2026-08-12T14:25:00Z', origen: 'manual' },
  { id: 'asist-log-c1-2', personaId: 'per-log-4', eventoId: 'eve-conecta2-1', temporadaId: 'temp-2026-2', gtId: 'gt-logistica', puntosOtorgados: 10, fechaRegistro: '2026-08-12T14:26:00Z', origen: 'manual' },
  { id: 'asist-log-c1-3', personaId: 'per-log-5', eventoId: 'eve-conecta2-1', temporadaId: 'temp-2026-2', gtId: 'gt-logistica', puntosOtorgados: 10, fechaRegistro: '2026-08-12T14:27:00Z', origen: 'manual' },
  { id: 'asist-log-c2-1', personaId: 'per-log-1', eventoId: 'eve-conecta2-2', temporadaId: 'temp-2026-2', gtId: 'gt-logistica', puntosOtorgados: 20, fechaRegistro: '2026-08-19T14:30:00Z', origen: 'manual' },
  { id: 'asist-log-c2-2', personaId: 'per-log-2', eventoId: 'eve-conecta2-2', temporadaId: 'temp-2026-2', gtId: 'gt-logistica', puntosOtorgados: 20, fechaRegistro: '2026-08-19T14:31:00Z', origen: 'manual' },
  { id: 'asist-log-c2-3', personaId: 'per-log-6', eventoId: 'eve-conecta2-2', temporadaId: 'temp-2026-2', gtId: 'gt-logistica', puntosOtorgados: 20, fechaRegistro: '2026-08-19T14:32:00Z', origen: 'manual' },
  { id: 'asist-log-c3-1', personaId: 'per-log-1', eventoId: 'eve-conecta2-3', temporadaId: 'temp-2026-2', gtId: 'gt-logistica', puntosOtorgados: 30, fechaRegistro: '2026-09-02T15:25:00Z', origen: 'manual' },
  { id: 'asist-log-c3-2', personaId: 'per-log-7', eventoId: 'eve-conecta2-3', temporadaId: 'temp-2026-2', gtId: 'gt-logistica', puntosOtorgados: 30, fechaRegistro: '2026-09-02T15:26:00Z', origen: 'manual' },

  // Publicidad in CONECTA2
  { id: 'asist-pub-c1-1', personaId: 'per-pub-1', eventoId: 'eve-conecta2-1', temporadaId: 'temp-2026-2', gtId: 'gt-publicidad', puntosOtorgados: 10, fechaRegistro: '2026-08-12T14:30:00Z', origen: 'manual' },
  { id: 'asist-pub-c2-1', personaId: 'per-pub-1', eventoId: 'eve-conecta2-2', temporadaId: 'temp-2026-2', gtId: 'gt-publicidad', puntosOtorgados: 20, fechaRegistro: '2026-08-19T14:35:00Z', origen: 'manual' },
  { id: 'asist-pub-c2-2', personaId: 'per-pub-2', eventoId: 'eve-conecta2-2', temporadaId: 'temp-2026-2', gtId: 'gt-publicidad', puntosOtorgados: 20, fechaRegistro: '2026-08-19T14:36:00Z', origen: 'manual' },
  { id: 'asist-pub-c3-1', personaId: 'per-pub-3', eventoId: 'eve-conecta2-3', temporadaId: 'temp-2026-2', gtId: 'gt-publicidad', puntosOtorgados: 30, fechaRegistro: '2026-09-02T15:30:00Z', origen: 'manual' },

  // Generales in CONECTA2
  { id: 'asist-gen-c1-1', personaId: 'per-gen-1', eventoId: 'eve-conecta2-1', temporadaId: 'temp-2026-2', gtId: 'gt-generales', puntosOtorgados: 10, fechaRegistro: '2026-08-12T14:40:00Z', origen: 'manual' },
  { id: 'asist-gen-c1-2', personaId: 'per-gen-2', eventoId: 'eve-conecta2-1', temporadaId: 'temp-2026-2', gtId: 'gt-generales', puntosOtorgados: 10, fechaRegistro: '2026-08-12T14:41:00Z', origen: 'manual' },
  { id: 'asist-gen-c2-1', personaId: 'per-gen-3', eventoId: 'eve-conecta2-2', temporadaId: 'temp-2026-2', gtId: 'gt-generales', puntosOtorgados: 20, fechaRegistro: '2026-08-19T14:45:00Z', origen: 'manual' },
  { id: 'asist-gen-c3-1', personaId: 'per-gen-4', eventoId: 'eve-conecta2-3', temporadaId: 'temp-2026-2', gtId: 'gt-generales', puntosOtorgados: 30, fechaRegistro: '2026-09-02T15:35:00Z', origen: 'manual' },

  // The Games in CONECTA2
  { id: 'asist-tg-c1-1', personaId: 'per-tg-1', eventoId: 'eve-conecta2-1', temporadaId: 'temp-2026-2', gtId: 'gt-the-games', puntosOtorgados: 10, fechaRegistro: '2026-08-12T14:50:00Z', origen: 'manual' },
  { id: 'asist-tg-c2-1', personaId: 'per-tg-2', eventoId: 'eve-conecta2-2', temporadaId: 'temp-2026-2', gtId: 'gt-the-games', puntosOtorgados: 20, fechaRegistro: '2026-08-19T14:50:00Z', origen: 'manual' },
  { id: 'asist-tg-c3-1', personaId: 'per-tg-1', eventoId: 'eve-conecta2-3', temporadaId: 'temp-2026-2', gtId: 'gt-the-games', puntosOtorgados: 30, fechaRegistro: '2026-09-02T15:40:00Z', origen: 'manual' },

  // Carnival in CONECTA2
  { id: 'asist-carn-c1-1', personaId: 'per-carn-1', eventoId: 'eve-conecta2-1', temporadaId: 'temp-2026-2', gtId: 'gt-carnival', puntosOtorgados: 10, fechaRegistro: '2026-08-12T14:55:00Z', origen: 'manual' },
  { id: 'asist-carn-c2-1', personaId: 'per-carn-2', eventoId: 'eve-conecta2-2', temporadaId: 'temp-2026-2', gtId: 'gt-carnival', puntosOtorgados: 20, fechaRegistro: '2026-08-19T14:55:00Z', origen: 'manual' },

  // Finanzas in CONECTA2
  { id: 'asist-fin-c1-1', personaId: 'per-fin-1', eventoId: 'eve-conecta2-1', temporadaId: 'temp-2026-2', gtId: 'gt-finanzas', puntosOtorgados: 10, fechaRegistro: '2026-08-12T15:00:00Z', origen: 'manual' },
  { id: 'asist-fin-c2-1', personaId: 'per-fin-2', eventoId: 'eve-conecta2-2', temporadaId: 'temp-2026-2', gtId: 'gt-finanzas', puntosOtorgados: 20, fechaRegistro: '2026-08-19T15:00:00Z', origen: 'manual' },

  // Seguridad in CONECTA2
  { id: 'asist-seg-c1-1', personaId: 'per-seg-1', eventoId: 'eve-conecta2-1', temporadaId: 'temp-2026-2', gtId: 'gt-seguridad', puntosOtorgados: 10, fechaRegistro: '2026-08-12T15:05:00Z', origen: 'manual' },
  { id: 'asist-seg-c2-1', personaId: 'per-seg-2', eventoId: 'eve-conecta2-2', temporadaId: 'temp-2026-2', gtId: 'gt-seguridad', puntosOtorgados: 20, fechaRegistro: '2026-08-19T15:05:00Z', origen: 'manual' },
];

export const INITIAL_PARTICIPACION_RETOS: ParticipacionReto[] = [
  // GH won Rally de Habilidades (+25 puntos for GT and Laura Rodríguez)
  {
    id: 'pret-1',
    retoId: 'reto-conecta2-rally',
    eventoId: 'eve-reto-special',
    temporadaId: 'temp-2026-2',
    gtId: 'gt-gh',
    personaId: 'per-gh-1', // Laura Rodríguez
    puntosOtorgados: 25,
    posicion: 1,
    observacion: 'Primer puesto en circuito de pistas',
    fechaRegistro: '2026-08-26T16:30:00Z',
  },
  // RRPP 2nd place in Rally (+15 pts)
  {
    id: 'pret-2',
    retoId: 'reto-conecta2-rally',
    eventoId: 'eve-reto-special',
    temporadaId: 'temp-2026-2',
    gtId: 'gt-rrpp',
    personaId: 'per-rrpp-1', // María Pérez
    puntosOtorgados: 15,
    posicion: 2,
    observacion: 'Segundo puesto en rally',
    fechaRegistro: '2026-08-26T16:35:00Z',
  },
];

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
