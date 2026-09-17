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

// Initial personas: Oficial roster of DIAS EAFIT across the 9 GTs
export const INITIAL_PERSONAS: Persona[] = [
  // GH - Gestión Humana (8 integrantes)
  { id: 'per-gh-1', nombreCompleto: 'Mariana Gómez Ospina', correo: 'mariana.gomez@eafit.edu.co', gtId: 'gt-gh', tipo: 'GT', temporadaId: 'temp-2026-2', activo: true, createdAt: '2026-08-10T10:00:00Z' },
  { id: 'per-gh-2', nombreCompleto: 'Santiago Álvarez Ruiz', correo: 'santiago.alvarez@eafit.edu.co', gtId: 'gt-gh', tipo: 'GT', temporadaId: 'temp-2026-2', activo: true, createdAt: '2026-08-10T10:00:00Z' },
  { id: 'per-gh-3', nombreCompleto: 'Valentina Herrera Mejía', correo: 'valentina.herrera@eafit.edu.co', gtId: 'gt-gh', tipo: 'GT', temporadaId: 'temp-2026-2', activo: true, createdAt: '2026-08-10T10:00:00Z' },
  { id: 'per-gh-4', nombreCompleto: 'David Restrepo Cano', correo: 'david.restrepo@eafit.edu.co', gtId: 'gt-gh', tipo: 'GT', temporadaId: 'temp-2026-2', activo: true, createdAt: '2026-08-10T10:00:00Z' },
  { id: 'per-gh-5', nombreCompleto: 'Camilo Echavarría Londoño', correo: 'camilo.echavarria@eafit.edu.co', gtId: 'gt-gh', tipo: 'GT', temporadaId: 'temp-2026-2', activo: true, createdAt: '2026-08-10T10:00:00Z' },
  { id: 'per-gh-6', nombreCompleto: 'Isabella Toro Sánchez', correo: 'isabella.toro@eafit.edu.co', gtId: 'gt-gh', tipo: 'GT', temporadaId: 'temp-2026-2', activo: true, createdAt: '2026-08-10T10:00:00Z' },
  { id: 'per-gh-7', nombreCompleto: 'Laura Estrada Palacio', correo: 'laura.estrada@eafit.edu.co', gtId: 'gt-gh', tipo: 'GT', temporadaId: 'temp-2026-2', activo: true, createdAt: '2026-08-10T10:00:00Z' },
  { id: 'per-gh-8', nombreCompleto: 'Mateo Jaramillo Botero', correo: 'mateo.jaramillo@eafit.edu.co', gtId: 'gt-gh', tipo: 'GT', temporadaId: 'temp-2026-2', activo: true, createdAt: '2026-08-10T10:00:00Z' },

  // LOGÍSTICA - Operaciones y Montajes (9 integrantes)
  { id: 'per-log-1', nombreCompleto: 'Alejandro Morales Duque', correo: 'alejandro.morales@eafit.edu.co', gtId: 'gt-logistica', tipo: 'GT', temporadaId: 'temp-2026-2', activo: true, createdAt: '2026-08-10T10:00:00Z' },
  { id: 'per-log-2', nombreCompleto: 'Sofía Ramírez Cadavid', correo: 'sofia.ramirez@eafit.edu.co', gtId: 'gt-logistica', tipo: 'GT', temporadaId: 'temp-2026-2', activo: true, createdAt: '2026-08-10T10:00:00Z' },
  { id: 'per-log-3', nombreCompleto: 'Tomás Gaviria Villegas', correo: 'tomas.gaviria@eafit.edu.co', gtId: 'gt-logistica', tipo: 'GT', temporadaId: 'temp-2026-2', activo: true, createdAt: '2026-08-10T10:00:00Z' },
  { id: 'per-log-4', nombreCompleto: 'Valeria Cárdenas Correa', correo: 'valeria.cardenas@eafit.edu.co', gtId: 'gt-logistica', tipo: 'GT', temporadaId: 'temp-2026-2', activo: true, createdAt: '2026-08-10T10:00:00Z' },
  { id: 'per-log-5', nombreCompleto: 'Daniel Uribe Arango', correo: 'daniel.uribe@eafit.edu.co', gtId: 'gt-logistica', tipo: 'GT', temporadaId: 'temp-2026-2', activo: true, createdAt: '2026-08-10T10:00:00Z' },
  { id: 'per-log-6', nombreCompleto: 'Juan Pablo Posada Hoyos', correo: 'juanpablo.posada@eafit.edu.co', gtId: 'gt-logistica', tipo: 'GT', temporadaId: 'temp-2026-2', activo: true, createdAt: '2026-08-10T10:00:00Z' },
  { id: 'per-log-7', nombreCompleto: 'Manuela Londoño Bernal', correo: 'manuela.londono@eafit.edu.co', gtId: 'gt-logistica', tipo: 'GT', temporadaId: 'temp-2026-2', activo: true, createdAt: '2026-08-10T10:00:00Z' },
  { id: 'per-log-8', nombreCompleto: 'Samuel Quintero Roldán', correo: 'samuel.quintero@eafit.edu.co', gtId: 'gt-logistica', tipo: 'GT', temporadaId: 'temp-2026-2', activo: true, createdAt: '2026-08-10T10:00:00Z' },
  { id: 'per-log-9', nombreCompleto: 'Camila Betancur Cano', correo: 'camila.betancur@eafit.edu.co', gtId: 'gt-logistica', tipo: 'GT', temporadaId: 'temp-2026-2', activo: true, createdAt: '2026-08-10T10:00:00Z' },

  // RRPP - Relaciones Públicas y Patrocinios (7 integrantes)
  { id: 'per-rrpp-1', nombreCompleto: 'Paulina Álvarez Vélez', correo: 'paulina.alvarez@eafit.edu.co', gtId: 'gt-rrpp', tipo: 'GT', temporadaId: 'temp-2026-2', activo: true, createdAt: '2026-08-10T10:00:00Z' },
  { id: 'per-rrpp-2', nombreCompleto: 'Nicolás Correa Saldarriaga', correo: 'nicolas.correa@eafit.edu.co', gtId: 'gt-rrpp', tipo: 'GT', temporadaId: 'temp-2026-2', activo: true, createdAt: '2026-08-10T10:00:00Z' },
  { id: 'per-rrpp-3', nombreCompleto: 'Manuela Vélez Henao', correo: 'manuela.velez@eafit.edu.co', gtId: 'gt-rrpp', tipo: 'GT', temporadaId: 'temp-2026-2', activo: true, createdAt: '2026-08-10T10:00:00Z' },
  { id: 'per-rrpp-4', nombreCompleto: 'Felipe Ospina Cardona', correo: 'felipe.ospina@eafit.edu.co', gtId: 'gt-rrpp', tipo: 'GT', temporadaId: 'temp-2026-2', activo: true, createdAt: '2026-08-10T10:00:00Z' },
  { id: 'per-rrpp-5', nombreCompleto: 'Juliana Ríos Zapata', correo: 'juliana.rios@eafit.edu.co', gtId: 'gt-rrpp', tipo: 'GT', temporadaId: 'temp-2026-2', activo: true, createdAt: '2026-08-10T10:00:00Z' },
  { id: 'per-rrpp-6', nombreCompleto: 'Sebastián Henao Arias', correo: 'sebastian.henao@eafit.edu.co', gtId: 'gt-rrpp', tipo: 'GT', temporadaId: 'temp-2026-2', activo: true, createdAt: '2026-08-10T10:00:00Z' },
  { id: 'per-rrpp-7', nombreCompleto: 'Andrea Molina Gil', correo: 'andrea.molina@eafit.edu.co', gtId: 'gt-rrpp', tipo: 'GT', temporadaId: 'temp-2026-2', activo: true, createdAt: '2026-08-10T10:00:00Z' },

  // MERCADEO - Marketing, Contenido y Redes (8 integrantes)
  { id: 'per-mer-1', nombreCompleto: 'Juanita Echeverri Gómez', correo: 'juanita.echeverri@eafit.edu.co', gtId: 'gt-mercadeo', tipo: 'GT', temporadaId: 'temp-2026-2', activo: true, createdAt: '2026-08-10T10:00:00Z' },
  { id: 'per-mer-2', nombreCompleto: 'David Zuluaga Patiño', correo: 'david.zuluaga@eafit.edu.co', gtId: 'gt-mercadeo', tipo: 'GT', temporadaId: 'temp-2026-2', activo: true, createdAt: '2026-08-10T10:00:00Z' },
  { id: 'per-mer-3', nombreCompleto: 'Sara Montoya Peláez', correo: 'sara.montoya@eafit.edu.co', gtId: 'gt-mercadeo', tipo: 'GT', temporadaId: 'temp-2026-2', activo: true, createdAt: '2026-08-10T10:00:00Z' },
  { id: 'per-mer-4', nombreCompleto: 'Lucas Arango Montoya', correo: 'lucas.arango@eafit.edu.co', gtId: 'gt-mercadeo', tipo: 'GT', temporadaId: 'temp-2026-2', activo: true, createdAt: '2026-08-10T10:00:00Z' },
  { id: 'per-mer-5', nombreCompleto: 'Mariana Villa Carvajal', correo: 'mariana.villa@eafit.edu.co', gtId: 'gt-mercadeo', tipo: 'GT', temporadaId: 'temp-2026-2', activo: true, createdAt: '2026-08-10T10:00:00Z' },
  { id: 'per-mer-6', nombreCompleto: 'Jerónimo Bedoya López', correo: 'jeronimo.bedoya@eafit.edu.co', gtId: 'gt-mercadeo', tipo: 'GT', temporadaId: 'temp-2026-2', activo: true, createdAt: '2026-08-10T10:00:00Z' },
  { id: 'per-mer-7', nombreCompleto: 'Paulina Pineda Osorio', correo: 'paulina.pineda@eafit.edu.co', gtId: 'gt-mercadeo', tipo: 'GT', temporadaId: 'temp-2026-2', activo: true, createdAt: '2026-08-10T10:00:00Z' },
  { id: 'per-mer-8', nombreCompleto: 'Simón Franco Castrillón', correo: 'simon.franco@eafit.edu.co', gtId: 'gt-mercadeo', tipo: 'GT', temporadaId: 'temp-2026-2', activo: true, createdAt: '2026-08-10T10:00:00Z' },

  // GENERALES - Coordinación y Comité General (6 integrantes)
  { id: 'per-gen-1', nombreCompleto: 'Esteban Castro Arbeláez', correo: 'esteban.castro@eafit.edu.co', gtId: 'gt-generales', tipo: 'GT', temporadaId: 'temp-2026-2', activo: true, createdAt: '2026-08-10T10:00:00Z' },
  { id: 'per-gen-2', nombreCompleto: 'Daniel Gómez Lopera', correo: 'daniel.gomez@eafit.edu.co', gtId: 'gt-generales', tipo: 'GT', temporadaId: 'temp-2026-2', activo: true, createdAt: '2026-08-10T10:00:00Z' },
  { id: 'per-gen-3', nombreCompleto: 'Carolina Maya Eusse', correo: 'carolina.maya@eafit.edu.co', gtId: 'gt-generales', tipo: 'GT', temporadaId: 'temp-2026-2', activo: true, createdAt: '2026-08-10T10:00:00Z' },
  { id: 'per-gen-4', nombreCompleto: 'Tomás Pérez Gutiérrez', correo: 'tomas.perez@eafit.edu.co', gtId: 'gt-generales', tipo: 'GT', temporadaId: 'temp-2026-2', activo: true, createdAt: '2026-08-10T10:00:00Z' },
  { id: 'per-gen-5', nombreCompleto: 'Natalia Gómez Serna', correo: 'natalia.gomez@eafit.edu.co', gtId: 'gt-generales', tipo: 'GT', temporadaId: 'temp-2026-2', activo: true, createdAt: '2026-08-10T10:00:00Z' },
  { id: 'per-gen-6', nombreCompleto: 'Federico Restrepo Gómez', correo: 'federico.restrepo@eafit.edu.co', gtId: 'gt-generales', tipo: 'GT', temporadaId: 'temp-2026-2', activo: true, createdAt: '2026-08-10T10:00:00Z' },

  // THE GAMES - Torneos y Recreación (7 integrantes)
  { id: 'per-gam-1', nombreCompleto: 'Carlos Mario Cardona', correo: 'carlos.cardona@eafit.edu.co', gtId: 'gt-the-games', tipo: 'GT', temporadaId: 'temp-2026-2', activo: true, createdAt: '2026-08-10T10:00:00Z' },
  { id: 'per-gam-2', nombreCompleto: 'Juan José Orozco Marín', correo: 'juanjose.orozco@eafit.edu.co', gtId: 'gt-the-games', tipo: 'GT', temporadaId: 'temp-2026-2', activo: true, createdAt: '2026-08-10T10:00:00Z' },
  { id: 'per-gam-3', nombreCompleto: 'Sebastián Hoyos Gil', correo: 'sebastian.hoyos@eafit.edu.co', gtId: 'gt-the-games', tipo: 'GT', temporadaId: 'temp-2026-2', activo: true, createdAt: '2026-08-10T10:00:00Z' },
  { id: 'per-gam-4', nombreCompleto: 'Salomé Vargas Jaramillo', correo: 'salome.vargas@eafit.edu.co', gtId: 'gt-the-games', tipo: 'GT', temporadaId: 'temp-2026-2', activo: true, createdAt: '2026-08-10T10:00:00Z' },
  { id: 'per-gam-5', nombreCompleto: 'Julián David Tabares', correo: 'julian.tabares@eafit.edu.co', gtId: 'gt-the-games', tipo: 'GT', temporadaId: 'temp-2026-2', activo: true, createdAt: '2026-08-10T10:00:00Z' },
  { id: 'per-gam-6', nombreCompleto: 'Martín Zapata Correa', correo: 'martin.zapata@eafit.edu.co', gtId: 'gt-the-games', tipo: 'GT', temporadaId: 'temp-2026-2', activo: true, createdAt: '2026-08-10T10:00:00Z' },
  { id: 'per-gam-7', nombreCompleto: 'Ana Sofía Gil Gómez', correo: 'anasofia.gil@eafit.edu.co', gtId: 'gt-the-games', tipo: 'GT', temporadaId: 'temp-2026-2', activo: true, createdAt: '2026-08-10T10:00:00Z' },

  // CARNIVAL - Cultura y Festivales (7 integrantes)
  { id: 'per-car-1', nombreCompleto: 'Valentina Londoño Ruiz', correo: 'valentina.londono@eafit.edu.co', gtId: 'gt-carnival', tipo: 'GT', temporadaId: 'temp-2026-2', activo: true, createdAt: '2026-08-10T10:00:00Z' },
  { id: 'per-car-2', nombreCompleto: 'Matías Barrientos Díaz', correo: 'matias.barrientos@eafit.edu.co', gtId: 'gt-carnival', tipo: 'GT', temporadaId: 'temp-2026-2', activo: true, createdAt: '2026-08-10T10:00:00Z' },
  { id: 'per-car-3', nombreCompleto: 'Susana Gómez Morales', correo: 'susana.gomez@eafit.edu.co', gtId: 'gt-carnival', tipo: 'GT', temporadaId: 'temp-2026-2', activo: true, createdAt: '2026-08-10T10:00:00Z' },
  { id: 'per-car-4', nombreCompleto: 'Jerónimo Morales Cuartas', correo: 'jeronimo.morales@eafit.edu.co', gtId: 'gt-carnival', tipo: 'GT', temporadaId: 'temp-2026-2', activo: true, createdAt: '2026-08-10T10:00:00Z' },
  { id: 'per-car-5', nombreCompleto: 'Manuela Restrepo Pineda', correo: 'manuela.restrepo@eafit.edu.co', gtId: 'gt-carnival', tipo: 'GT', temporadaId: 'temp-2026-2', activo: true, createdAt: '2026-08-10T10:00:00Z' },
  { id: 'per-car-6', nombreCompleto: 'Pablo Andrés Vallejo', correo: 'pablo.vallejo@eafit.edu.co', gtId: 'gt-carnival', tipo: 'GT', temporadaId: 'temp-2026-2', activo: true, createdAt: '2026-08-10T10:00:00Z' },
  { id: 'per-car-7', nombreCompleto: 'María Camila Peña', correo: 'mariacamila.pena@eafit.edu.co', gtId: 'gt-carnival', tipo: 'GT', temporadaId: 'temp-2026-2', activo: true, createdAt: '2026-08-10T10:00:00Z' },

  // FINANZAS - Tesorería y Presupuestos (6 integrantes)
  { id: 'per-fin-1', nombreCompleto: 'Andrés Felipe Serna', correo: 'andres.serna@eafit.edu.co', gtId: 'gt-finanzas', tipo: 'GT', temporadaId: 'temp-2026-2', activo: true, createdAt: '2026-08-10T10:00:00Z' },
  { id: 'per-fin-2', nombreCompleto: 'Gabriela Castro Mejía', correo: 'gabriela.castro@eafit.edu.co', gtId: 'gt-finanzas', tipo: 'GT', temporadaId: 'temp-2026-2', activo: true, createdAt: '2026-08-10T10:00:00Z' },
  { id: 'per-fin-3', nombreCompleto: 'Samuel David Agudelo', correo: 'samuel.agudelo@eafit.edu.co', gtId: 'gt-finanzas', tipo: 'GT', temporadaId: 'temp-2026-2', activo: true, createdAt: '2026-08-10T10:00:00Z' },
  { id: 'per-fin-4', nombreCompleto: 'Sofía Arboleda Ortiz', correo: 'sofia.arboleda@eafit.edu.co', gtId: 'gt-finanzas', tipo: 'GT', temporadaId: 'temp-2026-2', activo: true, createdAt: '2026-08-10T10:00:00Z' },
  { id: 'per-fin-5', nombreCompleto: 'Juan Camilo Berrío', correo: 'juancamilo.berrio@eafit.edu.co', gtId: 'gt-finanzas', tipo: 'GT', temporadaId: 'temp-2026-2', activo: true, createdAt: '2026-08-10T10:00:00Z' },
  { id: 'per-fin-6', nombreCompleto: 'Laura María Builes', correo: 'laura.builes@eafit.edu.co', gtId: 'gt-finanzas', tipo: 'GT', temporadaId: 'temp-2026-2', activo: true, createdAt: '2026-08-10T10:00:00Z' },

  // SEGURIDAD - Control y Protocolos (6 integrantes)
  { id: 'per-seg-1', nombreCompleto: 'Cristian David Parra', correo: 'cristian.parra@eafit.edu.co', gtId: 'gt-seguridad', tipo: 'GT', temporadaId: 'temp-2026-2', activo: true, createdAt: '2026-08-10T10:00:00Z' },
  { id: 'per-seg-2', nombreCompleto: 'Valeria Ortiz Carmona', correo: 'valeria.ortiz@eafit.edu.co', gtId: 'gt-seguridad', tipo: 'GT', temporadaId: 'temp-2026-2', activo: true, createdAt: '2026-08-10T10:00:00Z' },
  { id: 'per-seg-3', nombreCompleto: 'Daniel Botero Palacio', correo: 'daniel.botero@eafit.edu.co', gtId: 'gt-seguridad', tipo: 'GT', temporadaId: 'temp-2026-2', activo: true, createdAt: '2026-08-10T10:00:00Z' },
  { id: 'per-seg-4', nombreCompleto: 'Juan Manuel Echeverry', correo: 'juanmanuel.echeverry@eafit.edu.co', gtId: 'gt-seguridad', tipo: 'GT', temporadaId: 'temp-2026-2', activo: true, createdAt: '2026-08-10T10:00:00Z' },
  { id: 'per-seg-5', nombreCompleto: 'Tomás Saldarriaga Pérez', correo: 'tomas.saldarriaga@eafit.edu.co', gtId: 'gt-seguridad', tipo: 'GT', temporadaId: 'temp-2026-2', activo: true, createdAt: '2026-08-10T10:00:00Z' },
  { id: 'per-seg-6', nombreCompleto: 'Mariana Hincapié Cano', correo: 'mariana.hincapie@eafit.edu.co', gtId: 'gt-seguridad', tipo: 'GT', temporadaId: 'temp-2026-2', activo: true, createdAt: '2026-08-10T10:00:00Z' },
];

export const INITIAL_EVENTOS: Evento[] = [
  {
    id: 'eve-conecta2-3',
    nombre: 'CONECTADOS #3',
    descripcion: 'Tercer encuentro oficial de la temporada con dinámicas inter-GTs y retos de habilidades.',
    fecha: '2026-09-02',
    temporadaId: 'temp-2026-2',
    estado: 'finalizado', // REALIZADO
    tipoEvento: 'asistencia',
    puntosAsistencia: 30,
    utilizaQr: true,
    utilizaTurnos: false,
    tieneRetos: true,
    lugar: 'Plazoleta del Estudiante EAFIT',
    createdAt: '2026-08-20T09:00:00Z',
  },
  {
    id: 'eve-conecta2-4',
    nombre: 'CONECTADOS #4',
    descripcion: 'Cuarto encuentro de integración con retos grupales y puntuación de asistencia.',
    fecha: '2026-09-16',
    temporadaId: 'temp-2026-2',
    estado: 'programado', // PROGRAMADO
    tipoEvento: 'asistencia',
    puntosAsistencia: 40,
    utilizaQr: true,
    utilizaTurnos: false,
    tieneRetos: true,
    lugar: 'Auditorio Bloque 38 EAFIT',
    createdAt: '2026-08-25T09:00:00Z',
  },
  {
    id: 'eve-expecta-dias',
    nombre: 'EXPECTA DIAS',
    descripcion: 'Evento especial de expectativa por turnos independientes con registro por código QR.',
    fecha: '2026-09-21',
    temporadaId: 'temp-2026-2',
    estado: 'programado', // PROGRAMADO
    tipoEvento: 'turnos_qr',
    puntosAsistencia: 10,
    utilizaQr: true,
    utilizaTurnos: true,
    tieneRetos: false, // NO tiene retos
    lugar: 'Plazoleta Central EAFIT',
    createdAt: '2026-08-15T09:00:00Z',
  },
];

export const INITIAL_TURNOS: Turno[] = [
  // Día 1: 21 de septiembre de 2026
  {
    id: 'tur-expecta-d1-t1',
    eventoId: 'eve-expecta-dias',
    temporadaId: 'temp-2026-2',
    nombre: '21 Sep • Turno 1 (08:00 AM - 10:00 AM)',
    horaInicio: '08:00 AM',
    horaFin: '10:00 AM',
    estado: 'activo',
    qrToken: 'qr-expecta-2026-09-21-t1',
    activo: true,
    createdAt: '2026-09-01T08:00:00Z',
  },
  {
    id: 'tur-expecta-d1-t2',
    eventoId: 'eve-expecta-dias',
    temporadaId: 'temp-2026-2',
    nombre: '21 Sep • Turno 2 (10:00 AM - 12:00 PM)',
    horaInicio: '10:00 AM',
    horaFin: '12:00 PM',
    estado: 'programado',
    qrToken: 'qr-expecta-2026-09-21-t2',
    activo: false,
    createdAt: '2026-09-01T08:00:00Z',
  },
  {
    id: 'tur-expecta-d1-t3',
    eventoId: 'eve-expecta-dias',
    temporadaId: 'temp-2026-2',
    nombre: '21 Sep • Turno 3 (01:00 PM - 03:00 PM)',
    horaInicio: '01:00 PM',
    horaFin: '03:00 PM',
    estado: 'programado',
    qrToken: 'qr-expecta-2026-09-21-t3',
    activo: false,
    createdAt: '2026-09-01T08:00:00Z',
  },
  {
    id: 'tur-expecta-d1-t4',
    eventoId: 'eve-expecta-dias',
    temporadaId: 'temp-2026-2',
    nombre: '21 Sep • Turno 4 (03:00 PM - 05:00 PM)',
    horaInicio: '03:00 PM',
    horaFin: '05:00 PM',
    estado: 'programado',
    qrToken: 'qr-expecta-2026-09-21-t4',
    activo: false,
    createdAt: '2026-09-01T08:00:00Z',
  },

  // Día 2: 22 de septiembre de 2026
  {
    id: 'tur-expecta-d2-t1',
    eventoId: 'eve-expecta-dias',
    temporadaId: 'temp-2026-2',
    nombre: '22 Sep • Turno 1 (08:00 AM - 10:00 AM)',
    horaInicio: '08:00 AM',
    horaFin: '10:00 AM',
    estado: 'programado',
    qrToken: 'qr-expecta-2026-09-22-t1',
    activo: false,
    createdAt: '2026-09-01T08:00:00Z',
  },
  {
    id: 'tur-expecta-d2-t2',
    eventoId: 'eve-expecta-dias',
    temporadaId: 'temp-2026-2',
    nombre: '22 Sep • Turno 2 (10:00 AM - 12:00 PM)',
    horaInicio: '10:00 AM',
    horaFin: '12:00 PM',
    estado: 'programado',
    qrToken: 'qr-expecta-2026-09-22-t2',
    activo: false,
    createdAt: '2026-09-01T08:00:00Z',
  },
  {
    id: 'tur-expecta-d2-t3',
    eventoId: 'eve-expecta-dias',
    temporadaId: 'temp-2026-2',
    nombre: '22 Sep • Turno 3 (01:00 PM - 03:00 PM)',
    horaInicio: '01:00 PM',
    horaFin: '03:00 PM',
    estado: 'programado',
    qrToken: 'qr-expecta-2026-09-22-t3',
    activo: false,
    createdAt: '2026-09-01T08:00:00Z',
  },
  {
    id: 'tur-expecta-d2-t4',
    eventoId: 'eve-expecta-dias',
    temporadaId: 'temp-2026-2',
    nombre: '22 Sep • Turno 4 (03:00 PM - 05:00 PM)',
    horaInicio: '03:00 PM',
    horaFin: '05:00 PM',
    estado: 'programado',
    qrToken: 'qr-expecta-2026-09-22-t4',
    activo: false,
    createdAt: '2026-09-01T08:00:00Z',
  },

  // Día 3: 23 de septiembre de 2026
  {
    id: 'tur-expecta-d3-t1',
    eventoId: 'eve-expecta-dias',
    temporadaId: 'temp-2026-2',
    nombre: '23 Sep • Turno 1 (08:00 AM - 10:00 AM)',
    horaInicio: '08:00 AM',
    horaFin: '10:00 AM',
    estado: 'programado',
    qrToken: 'qr-expecta-2026-09-23-t1',
    activo: false,
    createdAt: '2026-09-01T08:00:00Z',
  },
  {
    id: 'tur-expecta-d3-t2',
    eventoId: 'eve-expecta-dias',
    temporadaId: 'temp-2026-2',
    nombre: '23 Sep • Turno 2 (10:00 AM - 12:00 PM)',
    horaInicio: '10:00 AM',
    horaFin: '12:00 PM',
    estado: 'programado',
    qrToken: 'qr-expecta-2026-09-23-t2',
    activo: false,
    createdAt: '2026-09-01T08:00:00Z',
  },
  {
    id: 'tur-expecta-d3-t3',
    eventoId: 'eve-expecta-dias',
    temporadaId: 'temp-2026-2',
    nombre: '23 Sep • Turno 3 (01:00 PM - 03:00 PM)',
    horaInicio: '01:00 PM',
    horaFin: '03:00 PM',
    estado: 'programado',
    qrToken: 'qr-expecta-2026-09-23-t3',
    activo: false,
    createdAt: '2026-09-01T08:00:00Z',
  },
  {
    id: 'tur-expecta-d3-t4',
    eventoId: 'eve-expecta-dias',
    temporadaId: 'temp-2026-2',
    nombre: '23 Sep • Turno 4 (03:00 PM - 05:00 PM)',
    horaInicio: '03:00 PM',
    horaFin: '05:00 PM',
    estado: 'programado',
    qrToken: 'qr-expecta-2026-09-23-t4',
    activo: false,
    createdAt: '2026-09-01T08:00:00Z',
  },

  // Día 4: 24 de septiembre de 2026
  {
    id: 'tur-expecta-d4-t1',
    eventoId: 'eve-expecta-dias',
    temporadaId: 'temp-2026-2',
    nombre: '24 Sep • Turno 1 (08:00 AM - 10:00 AM)',
    horaInicio: '08:00 AM',
    horaFin: '10:00 AM',
    estado: 'programado',
    qrToken: 'qr-expecta-2026-09-24-t1',
    activo: false,
    createdAt: '2026-09-01T08:00:00Z',
  },
  {
    id: 'tur-expecta-d4-t2',
    eventoId: 'eve-expecta-dias',
    temporadaId: 'temp-2026-2',
    nombre: '24 Sep • Turno 2 (10:00 AM - 12:00 PM)',
    horaInicio: '10:00 AM',
    horaFin: '12:00 PM',
    estado: 'programado',
    qrToken: 'qr-expecta-2026-09-24-t2',
    activo: false,
    createdAt: '2026-09-01T08:00:00Z',
  },
  {
    id: 'tur-expecta-d4-t3',
    eventoId: 'eve-expecta-dias',
    temporadaId: 'temp-2026-2',
    nombre: '24 Sep • Turno 3 (01:00 PM - 03:00 PM)',
    horaInicio: '01:00 PM',
    horaFin: '03:00 PM',
    estado: 'programado',
    qrToken: 'qr-expecta-2026-09-24-t3',
    activo: false,
    createdAt: '2026-09-01T08:00:00Z',
  },
  {
    id: 'tur-expecta-d4-t4',
    eventoId: 'eve-expecta-dias',
    temporadaId: 'temp-2026-2',
    nombre: '24 Sep • Turno 4 (03:00 PM - 05:00 PM)',
    horaInicio: '03:00 PM',
    horaFin: '05:00 PM',
    estado: 'programado',
    qrToken: 'qr-expecta-2026-09-24-t4',
    activo: false,
    createdAt: '2026-09-01T08:00:00Z',
  },

  // Día 5: 25 de septiembre de 2026
  {
    id: 'tur-expecta-d5-t1',
    eventoId: 'eve-expecta-dias',
    temporadaId: 'temp-2026-2',
    nombre: '25 Sep • Turno 1 (08:00 AM - 10:00 AM)',
    horaInicio: '08:00 AM',
    horaFin: '10:00 AM',
    estado: 'programado',
    qrToken: 'qr-expecta-2026-09-25-t1',
    activo: false,
    createdAt: '2026-09-01T08:00:00Z',
  },
  {
    id: 'tur-expecta-d5-t2',
    eventoId: 'eve-expecta-dias',
    temporadaId: 'temp-2026-2',
    nombre: '25 Sep • Turno 2 (10:00 AM - 12:00 PM)',
    horaInicio: '10:00 AM',
    horaFin: '12:00 PM',
    estado: 'programado',
    qrToken: 'qr-expecta-2026-09-25-t2',
    activo: false,
    createdAt: '2026-09-01T08:00:00Z',
  },
  {
    id: 'tur-expecta-d5-t3',
    eventoId: 'eve-expecta-dias',
    temporadaId: 'temp-2026-2',
    nombre: '25 Sep • Turno 3 (01:00 PM - 03:00 PM)',
    horaInicio: '01:00 PM',
    horaFin: '03:00 PM',
    estado: 'programado',
    qrToken: 'qr-expecta-2026-09-25-t3',
    activo: false,
    createdAt: '2026-09-01T08:00:00Z',
  },
  {
    id: 'tur-expecta-d5-t4',
    eventoId: 'eve-expecta-dias',
    temporadaId: 'temp-2026-2',
    nombre: '25 Sep • Turno 4 (03:00 PM - 05:00 PM)',
    horaInicio: '03:00 PM',
    horaFin: '05:00 PM',
    estado: 'programado',
    qrToken: 'qr-expecta-2026-09-25-t4',
    activo: false,
    createdAt: '2026-09-01T08:00:00Z',
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

// Initial attendances: Registered attendances for CONECTADOS #3 (30 pts per person)
export const INITIAL_ASISTENCIAS: Asistencia[] = [
  // GH (5 asistentes)
  { id: 'asist-gh-1', personaId: 'per-gh-1', gtId: 'gt-gh', eventoId: 'eve-conecta2-3', temporadaId: 'temp-2026-2', metodoRegistro: 'qr', puntosOtorgados: 30, anulado: false, fechaRegistro: '2026-09-02T16:10:00Z', createdAt: '2026-09-02T16:10:00Z' },
  { id: 'asist-gh-2', personaId: 'per-gh-2', gtId: 'gt-gh', eventoId: 'eve-conecta2-3', temporadaId: 'temp-2026-2', metodoRegistro: 'qr', puntosOtorgados: 30, anulado: false, fechaRegistro: '2026-09-02T16:12:00Z', createdAt: '2026-09-02T16:12:00Z' },
  { id: 'asist-gh-3', personaId: 'per-gh-3', gtId: 'gt-gh', eventoId: 'eve-conecta2-3', temporadaId: 'temp-2026-2', metodoRegistro: 'qr', puntosOtorgados: 30, anulado: false, fechaRegistro: '2026-09-02T16:15:00Z', createdAt: '2026-09-02T16:15:00Z' },
  { id: 'asist-gh-4', personaId: 'per-gh-4', gtId: 'gt-gh', eventoId: 'eve-conecta2-3', temporadaId: 'temp-2026-2', metodoRegistro: 'manual', puntosOtorgados: 30, anulado: false, fechaRegistro: '2026-09-02T16:20:00Z', createdAt: '2026-09-02T16:20:00Z' },
  { id: 'asist-gh-5', personaId: 'per-gh-5', gtId: 'gt-gh', eventoId: 'eve-conecta2-3', temporadaId: 'temp-2026-2', metodoRegistro: 'manual', puntosOtorgados: 30, anulado: false, fechaRegistro: '2026-09-02T16:22:00Z', createdAt: '2026-09-02T16:22:00Z' },

  // LOGÍSTICA (6 asistentes)
  { id: 'asist-log-1', personaId: 'per-log-1', gtId: 'gt-logistica', eventoId: 'eve-conecta2-3', temporadaId: 'temp-2026-2', metodoRegistro: 'qr', puntosOtorgados: 30, anulado: false, fechaRegistro: '2026-09-02T16:05:00Z', createdAt: '2026-09-02T16:05:00Z' },
  { id: 'asist-log-2', personaId: 'per-log-2', gtId: 'gt-logistica', eventoId: 'eve-conecta2-3', temporadaId: 'temp-2026-2', metodoRegistro: 'qr', puntosOtorgados: 30, anulado: false, fechaRegistro: '2026-09-02T16:08:00Z', createdAt: '2026-09-02T16:08:00Z' },
  { id: 'asist-log-3', personaId: 'per-log-3', gtId: 'gt-logistica', eventoId: 'eve-conecta2-3', temporadaId: 'temp-2026-2', metodoRegistro: 'qr', puntosOtorgados: 30, anulado: false, fechaRegistro: '2026-09-02T16:09:00Z', createdAt: '2026-09-02T16:09:00Z' },
  { id: 'asist-log-4', personaId: 'per-log-4', gtId: 'gt-logistica', eventoId: 'eve-conecta2-3', temporadaId: 'temp-2026-2', metodoRegistro: 'qr', puntosOtorgados: 30, anulado: false, fechaRegistro: '2026-09-02T16:11:00Z', createdAt: '2026-09-02T16:11:00Z' },
  { id: 'asist-log-5', personaId: 'per-log-5', gtId: 'gt-logistica', eventoId: 'eve-conecta2-3', temporadaId: 'temp-2026-2', metodoRegistro: 'manual', puntosOtorgados: 30, anulado: false, fechaRegistro: '2026-09-02T16:25:00Z', createdAt: '2026-09-02T16:25:00Z' },
  { id: 'asist-log-6', personaId: 'per-log-6', gtId: 'gt-logistica', eventoId: 'eve-conecta2-3', temporadaId: 'temp-2026-2', metodoRegistro: 'manual', puntosOtorgados: 30, anulado: false, fechaRegistro: '2026-09-02T16:28:00Z', createdAt: '2026-09-02T16:28:00Z' },

  // RRPP (5 asistentes)
  { id: 'asist-rrpp-1', personaId: 'per-rrpp-1', gtId: 'gt-rrpp', eventoId: 'eve-conecta2-3', temporadaId: 'temp-2026-2', metodoRegistro: 'qr', puntosOtorgados: 30, anulado: false, fechaRegistro: '2026-09-02T16:14:00Z', createdAt: '2026-09-02T16:14:00Z' },
  { id: 'asist-rrpp-2', personaId: 'per-rrpp-2', gtId: 'gt-rrpp', eventoId: 'eve-conecta2-3', temporadaId: 'temp-2026-2', metodoRegistro: 'qr', puntosOtorgados: 30, anulado: false, fechaRegistro: '2026-09-02T16:15:00Z', createdAt: '2026-09-02T16:15:00Z' },
  { id: 'asist-rrpp-3', personaId: 'per-rrpp-3', gtId: 'gt-rrpp', eventoId: 'eve-conecta2-3', temporadaId: 'temp-2026-2', metodoRegistro: 'qr', puntosOtorgados: 30, anulado: false, fechaRegistro: '2026-09-02T16:18:00Z', createdAt: '2026-09-02T16:18:00Z' },
  { id: 'asist-rrpp-4', personaId: 'per-rrpp-4', gtId: 'gt-rrpp', eventoId: 'eve-conecta2-3', temporadaId: 'temp-2026-2', metodoRegistro: 'manual', puntosOtorgados: 30, anulado: false, fechaRegistro: '2026-09-02T16:22:00Z', createdAt: '2026-09-02T16:22:00Z' },
  { id: 'asist-rrpp-5', personaId: 'per-rrpp-5', gtId: 'gt-rrpp', eventoId: 'eve-conecta2-3', temporadaId: 'temp-2026-2', metodoRegistro: 'manual', puntosOtorgados: 30, anulado: false, fechaRegistro: '2026-09-02T16:24:00Z', createdAt: '2026-09-02T16:24:00Z' },

  // MERCADEO (5 asistentes)
  { id: 'asist-mer-1', personaId: 'per-mer-1', gtId: 'gt-mercadeo', eventoId: 'eve-conecta2-3', temporadaId: 'temp-2026-2', metodoRegistro: 'qr', puntosOtorgados: 30, anulado: false, fechaRegistro: '2026-09-02T16:04:00Z', createdAt: '2026-09-02T16:04:00Z' },
  { id: 'asist-mer-2', personaId: 'per-mer-2', gtId: 'gt-mercadeo', eventoId: 'eve-conecta2-3', temporadaId: 'temp-2026-2', metodoRegistro: 'qr', puntosOtorgados: 30, anulado: false, fechaRegistro: '2026-09-02T16:07:00Z', createdAt: '2026-09-02T16:07:00Z' },
  { id: 'asist-mer-3', personaId: 'per-mer-3', gtId: 'gt-mercadeo', eventoId: 'eve-conecta2-3', temporadaId: 'temp-2026-2', metodoRegistro: 'qr', puntosOtorgados: 30, anulado: false, fechaRegistro: '2026-09-02T16:11:00Z', createdAt: '2026-09-02T16:11:00Z' },
  { id: 'asist-mer-4', personaId: 'per-mer-4', gtId: 'gt-mercadeo', eventoId: 'eve-conecta2-3', temporadaId: 'temp-2026-2', metodoRegistro: 'qr', puntosOtorgados: 30, anulado: false, fechaRegistro: '2026-09-02T16:16:00Z', createdAt: '2026-09-02T16:16:00Z' },
  { id: 'asist-mer-5', personaId: 'per-mer-5', gtId: 'gt-mercadeo', eventoId: 'eve-conecta2-3', temporadaId: 'temp-2026-2', metodoRegistro: 'manual', puntosOtorgados: 30, anulado: false, fechaRegistro: '2026-09-02T16:20:00Z', createdAt: '2026-09-02T16:20:00Z' },

  // GENERALES (4 asistentes)
  { id: 'asist-gen-1', personaId: 'per-gen-1', gtId: 'gt-generales', eventoId: 'eve-conecta2-3', temporadaId: 'temp-2026-2', metodoRegistro: 'qr', puntosOtorgados: 30, anulado: false, fechaRegistro: '2026-09-02T16:13:00Z', createdAt: '2026-09-02T16:13:00Z' },
  { id: 'asist-gen-2', personaId: 'per-gen-2', gtId: 'gt-generales', eventoId: 'eve-conecta2-3', temporadaId: 'temp-2026-2', metodoRegistro: 'qr', puntosOtorgados: 30, anulado: false, fechaRegistro: '2026-09-02T16:17:00Z', createdAt: '2026-09-02T16:17:00Z' },
  { id: 'asist-gen-3', personaId: 'per-gen-3', gtId: 'gt-generales', eventoId: 'eve-conecta2-3', temporadaId: 'temp-2026-2', metodoRegistro: 'manual', puntosOtorgados: 30, anulado: false, fechaRegistro: '2026-09-02T16:21:00Z', createdAt: '2026-09-02T16:21:00Z' },
  { id: 'asist-gen-4', personaId: 'per-gen-4', gtId: 'gt-generales', eventoId: 'eve-conecta2-3', temporadaId: 'temp-2026-2', metodoRegistro: 'manual', puntosOtorgados: 30, anulado: false, fechaRegistro: '2026-09-02T16:26:00Z', createdAt: '2026-09-02T16:26:00Z' },

  // THE GAMES (4 asistentes)
  { id: 'asist-gam-1', personaId: 'per-gam-1', gtId: 'gt-the-games', eventoId: 'eve-conecta2-3', temporadaId: 'temp-2026-2', metodoRegistro: 'qr', puntosOtorgados: 30, anulado: false, fechaRegistro: '2026-09-02T16:08:00Z', createdAt: '2026-09-02T16:08:00Z' },
  { id: 'asist-gam-2', personaId: 'per-gam-2', gtId: 'gt-the-games', eventoId: 'eve-conecta2-3', temporadaId: 'temp-2026-2', metodoRegistro: 'qr', puntosOtorgados: 30, anulado: false, fechaRegistro: '2026-09-02T16:12:00Z', createdAt: '2026-09-02T16:12:00Z' },
  { id: 'asist-gam-3', personaId: 'per-gam-3', gtId: 'gt-the-games', eventoId: 'eve-conecta2-3', temporadaId: 'temp-2026-2', metodoRegistro: 'qr', puntosOtorgados: 30, anulado: false, fechaRegistro: '2026-09-02T16:19:00Z', createdAt: '2026-09-02T16:19:00Z' },
  { id: 'asist-gam-4', personaId: 'per-gam-4', gtId: 'gt-the-games', eventoId: 'eve-conecta2-3', temporadaId: 'temp-2026-2', metodoRegistro: 'manual', puntosOtorgados: 30, anulado: false, fechaRegistro: '2026-09-02T16:23:00Z', createdAt: '2026-09-02T16:23:00Z' },

  // CARNIVAL (5 asistentes)
  { id: 'asist-car-1', personaId: 'per-car-1', gtId: 'gt-carnival', eventoId: 'eve-conecta2-3', temporadaId: 'temp-2026-2', metodoRegistro: 'qr', puntosOtorgados: 30, anulado: false, fechaRegistro: '2026-09-02T16:06:00Z', createdAt: '2026-09-02T16:06:00Z' },
  { id: 'asist-car-2', personaId: 'per-car-2', gtId: 'gt-carnival', eventoId: 'eve-conecta2-3', temporadaId: 'temp-2026-2', metodoRegistro: 'qr', puntosOtorgados: 30, anulado: false, fechaRegistro: '2026-09-02T16:10:00Z', createdAt: '2026-09-02T16:10:00Z' },
  { id: 'asist-car-3', personaId: 'per-car-3', gtId: 'gt-carnival', eventoId: 'eve-conecta2-3', temporadaId: 'temp-2026-2', metodoRegistro: 'qr', puntosOtorgados: 30, anulado: false, fechaRegistro: '2026-09-02T16:13:00Z', createdAt: '2026-09-02T16:13:00Z' },
  { id: 'asist-car-4', personaId: 'per-car-4', gtId: 'gt-carnival', eventoId: 'eve-conecta2-3', temporadaId: 'temp-2026-2', metodoRegistro: 'manual', puntosOtorgados: 30, anulado: false, fechaRegistro: '2026-09-02T16:21:00Z', createdAt: '2026-09-02T16:21:00Z' },
  { id: 'asist-car-5', personaId: 'per-car-5', gtId: 'gt-carnival', eventoId: 'eve-conecta2-3', temporadaId: 'temp-2026-2', metodoRegistro: 'manual', puntosOtorgados: 30, anulado: false, fechaRegistro: '2026-09-02T16:27:00Z', createdAt: '2026-09-02T16:27:00Z' },

  // FINANZAS (4 asistentes)
  { id: 'asist-fin-1', personaId: 'per-fin-1', gtId: 'gt-finanzas', eventoId: 'eve-conecta2-3', temporadaId: 'temp-2026-2', metodoRegistro: 'qr', puntosOtorgados: 30, anulado: false, fechaRegistro: '2026-09-02T16:16:00Z', createdAt: '2026-09-02T16:16:00Z' },
  { id: 'asist-fin-2', personaId: 'per-fin-2', gtId: 'gt-finanzas', eventoId: 'eve-conecta2-3', temporadaId: 'temp-2026-2', metodoRegistro: 'qr', puntosOtorgados: 30, anulado: false, fechaRegistro: '2026-09-02T16:19:00Z', createdAt: '2026-09-02T16:19:00Z' },
  { id: 'asist-fin-3', personaId: 'per-fin-3', gtId: 'gt-finanzas', eventoId: 'eve-conecta2-3', temporadaId: 'temp-2026-2', metodoRegistro: 'manual', puntosOtorgados: 30, anulado: false, fechaRegistro: '2026-09-02T16:24:00Z', createdAt: '2026-09-02T16:24:00Z' },
  { id: 'asist-fin-4', personaId: 'per-fin-4', gtId: 'gt-finanzas', eventoId: 'eve-conecta2-3', temporadaId: 'temp-2026-2', metodoRegistro: 'manual', puntosOtorgados: 30, anulado: false, fechaRegistro: '2026-09-02T16:29:00Z', createdAt: '2026-09-02T16:29:00Z' },

  // SEGURIDAD (4 asistentes)
  { id: 'asist-seg-1', personaId: 'per-seg-1', gtId: 'gt-seguridad', eventoId: 'eve-conecta2-3', temporadaId: 'temp-2026-2', metodoRegistro: 'qr', puntosOtorgados: 30, anulado: false, fechaRegistro: '2026-09-02T16:07:00Z', createdAt: '2026-09-02T16:07:00Z' },
  { id: 'asist-seg-2', personaId: 'per-seg-2', gtId: 'gt-seguridad', eventoId: 'eve-conecta2-3', temporadaId: 'temp-2026-2', metodoRegistro: 'qr', puntosOtorgados: 30, anulado: false, fechaRegistro: '2026-09-02T16:11:00Z', createdAt: '2026-09-02T16:11:00Z' },
  { id: 'asist-seg-3', personaId: 'per-seg-3', gtId: 'gt-seguridad', eventoId: 'eve-conecta2-3', temporadaId: 'temp-2026-2', metodoRegistro: 'manual', puntosOtorgados: 30, anulado: false, fechaRegistro: '2026-09-02T16:20:00Z', createdAt: '2026-09-02T16:20:00Z' },
  { id: 'asist-seg-4', personaId: 'per-seg-4', gtId: 'gt-seguridad', eventoId: 'eve-conecta2-3', temporadaId: 'temp-2026-2', metodoRegistro: 'manual', puntosOtorgados: 30, anulado: false, fechaRegistro: '2026-09-02T16:25:00Z', createdAt: '2026-09-02T16:25:00Z' },
];

// Initial challenge participations: Retos ganados en la temporada
export const INITIAL_PARTICIPACION_RETOS: ParticipacionReto[] = [
  // Reto Rally de Habilidades DIAS (25 pts)
  {
    id: 'part-reto-1',
    retoId: 'reto-conecta2-rally',
    gtId: 'gt-logistica',
    personaId: 'per-log-3', // Tomás Gaviria Villegas
    puntosOtorgados: 25,
    posicion: 1,
    temporadaId: 'temp-2026-2',
    eventoId: 'eve-conecta2-3',
    anulado: false,
    createdAt: '2026-08-26T16:00:00Z',
  },
  {
    id: 'part-reto-2',
    retoId: 'reto-conecta2-rally',
    gtId: 'gt-rrpp',
    personaId: 'per-rrpp-1', // Paulina Álvarez Vélez
    puntosOtorgados: 15,
    posicion: 2,
    temporadaId: 'temp-2026-2',
    eventoId: 'eve-conecta2-3',
    anulado: false,
    createdAt: '2026-08-26T16:05:00Z',
  },
  {
    id: 'part-reto-3',
    retoId: 'reto-conecta2-rally',
    gtId: 'gt-mercadeo',
    personaId: 'per-mer-1', // Juanita Echeverri Gómez
    puntosOtorgados: 10,
    posicion: 3,
    temporadaId: 'temp-2026-2',
    eventoId: 'eve-conecta2-3',
    anulado: false,
    createdAt: '2026-08-26T16:10:00Z',
  },

  // Reto Desafío Multimedia EAFIT (35 pts)
  {
    id: 'part-reto-4',
    retoId: 'reto-creatividad-social',
    gtId: 'gt-mercadeo',
    personaId: 'per-mer-1', // Juanita Echeverri Gómez
    puntosOtorgados: 35,
    posicion: 1,
    temporadaId: 'temp-2026-2',
    eventoId: 'eve-conecta2-3',
    anulado: false,
    createdAt: '2026-09-05T18:00:00Z',
  },
  {
    id: 'part-reto-5',
    retoId: 'reto-creatividad-social',
    gtId: 'gt-carnival',
    personaId: 'per-car-1', // Valentina Londoño Ruiz
    puntosOtorgados: 20,
    posicion: 2,
    temporadaId: 'temp-2026-2',
    eventoId: 'eve-conecta2-3',
    anulado: false,
    createdAt: '2026-09-05T18:05:00Z',
  },
  {
    id: 'part-reto-6',
    retoId: 'reto-creatividad-social',
    gtId: 'gt-gh',
    personaId: 'per-gh-1', // Mariana Gómez Ospina
    puntosOtorgados: 15,
    posicion: 3,
    temporadaId: 'temp-2026-2',
    eventoId: 'eve-conecta2-3',
    anulado: false,
    createdAt: '2026-09-05T18:10:00Z',
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
