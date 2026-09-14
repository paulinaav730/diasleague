import * as XLSX from 'xlsx';
import { GrupoTrabajo, Persona } from '../types';

export interface PersonaImportada {
  nombre: string;
  gtNombre: string;
  gtId: string;
  tipo: 'GT' | 'MESA' | 'GAP';
  fila?: number;
}

export interface ExcelValidationResult {
  isValid: boolean;
  errors: string[];
  totalFilas: number;
  totalNuevas: number;
  totalDuplicados: number;
  totalInvalidos: number;
  totalIncompletos: number;
  personas: PersonaImportada[];
}

/**
 * Generates and downloads the official DIAS LEAGUE - EXCEL MAESTRO.xlsx template.
 * - Primary sheet "Personas" with only three columns: NOMBRE | GT | TIPO
 * - Secondary reference sheet "GTs" with available GTs and "TIPOS"
 */
export function descargarPlantillaExcelMaestro(gts: GrupoTrabajo[]) {
  const wb = XLSX.utils.book_new();

  // Hoja principal: únicamente NOMBRE, GT y TIPO
  const wsMainData = [
    ['NOMBRE', 'GT', 'TIPO'],
    ['María Pérez', 'RRPP', 'GT'],
    ['Juan Gómez', 'LOGÍSTICA', 'MESA'],
    ['Laura Rodríguez', 'GH', 'GAP'],
  ];
  const wsMain = XLSX.utils.aoa_to_sheet(wsMainData);
  wsMain['!cols'] = [{ wch: 32 }, { wch: 22 }, { wch: 16 }];
  XLSX.utils.book_append_sheet(wb, wsMain, 'Personas');

  // Hoja secundaria de referencia: GTs disponibles
  const gtsList =
    gts && gts.length > 0
      ? gts
      : [
          { nombre: 'GH', codigo: 'GH' },
          { nombre: 'LOGÍSTICA', codigo: 'LOG' },
          { nombre: 'RRPP', codigo: 'RRPP' },
          { nombre: 'MERCADEO', codigo: 'MER' },
          { nombre: 'GENERALES', codigo: 'GEN' },
          { nombre: 'THE GAMES', codigo: 'TG' },
          { nombre: 'CARNIVAL', codigo: 'CARN' },
          { nombre: 'FINANZAS', codigo: 'FIN' },
          { nombre: 'SEGURIDAD', codigo: 'SEG' },
        ];

  const gtsData = [
    ['GT DISPONIBLE (9 OFICIALES)', 'CÓDIGO'],
    ...gtsList.map((g) => [g.nombre.toUpperCase(), g.codigo.toUpperCase()]),
  ];
  const wsGts = XLSX.utils.aoa_to_sheet(gtsData);
  wsGts['!cols'] = [{ wch: 32 }, { wch: 16 }];
  XLSX.utils.book_append_sheet(wb, wsGts, 'GTs');

  // Hoja terciaria: Tipos de personas permitidos
  const tiposData = [
    ['TIPO PERMITIDO', 'DESCRIPCIÓN'],
    ['GT', 'Integrante normal de su GT (suma puntos para la persona y para el GT)'],
    ['MESA', 'Miembro de la mesa directiva (en turno de mesa no suma al GT; como participante sí)'],
    ['GAP', 'Integrante de apoyo / staff (participa en dinámicas con filtro en reportes)'],
  ];
  const wsTipos = XLSX.utils.aoa_to_sheet(tiposData);
  wsTipos['!cols'] = [{ wch: 20 }, { wch: 70 }];
  XLSX.utils.book_append_sheet(wb, wsTipos, 'Tipos');

  // Descarga del archivo
  XLSX.writeFile(wb, 'DIAS_LEAGUE_EXCEL_MAESTRO.xlsx');
}

export const CANONICAL_GTS: GrupoTrabajo[] = [
  {
    id: 'gt-mercadeo',
    nombre: 'MERCADEO',
    codigo: 'MER',
    descripcion: 'Mercadeo, Redes, Diseño y Contenido Audiovisual',
    color: '#EC4899',
    icono: 'Palette',
    activo: true,
    createdAt: '2026-08-01T00:00:00Z',
  },
  {
    id: 'gt-logistica',
    nombre: 'LOGÍSTICA',
    codigo: 'LOG',
    descripcion: 'Operaciones, Montajes y Logística de Eventos',
    color: '#10B981',
    icono: 'Boxes',
    activo: true,
    createdAt: '2026-08-01T00:00:00Z',
  },
  {
    id: 'gt-gh',
    nombre: 'GH',
    codigo: 'GH',
    descripcion: 'Gestión Humana y Talento',
    color: '#3B82F6',
    icono: 'Users',
    activo: true,
    createdAt: '2026-08-01T00:00:00Z',
  },
  {
    id: 'gt-rrpp',
    nombre: 'RRPP',
    codigo: 'RRPP',
    descripcion: 'Relaciones Públicas y Patrocinios',
    color: '#8B5CF6',
    icono: 'Megaphone',
    activo: true,
    createdAt: '2026-08-01T00:00:00Z',
  },
  {
    id: 'gt-generales',
    nombre: 'GENERALES',
    codigo: 'GEN',
    descripcion: 'Comité General y Coordinación Interdisciplinaria',
    color: '#F59E0B',
    icono: 'Compass',
    activo: true,
    createdAt: '2026-08-01T00:00:00Z',
  },
  {
    id: 'gt-the-games',
    nombre: 'THE GAMES',
    codigo: 'TG',
    descripcion: 'Torneos, Recreación y Gaming',
    color: '#06B6D4',
    icono: 'Gamepad2',
    activo: true,
    createdAt: '2026-08-01T00:00:00Z',
  },
  {
    id: 'gt-carnival',
    nombre: 'CARNIVAL',
    codigo: 'CARN',
    descripcion: 'Cultura, Festivales y Experiencias',
    color: '#F97316',
    icono: 'Sparkles',
    activo: true,
    createdAt: '2026-08-01T00:00:00Z',
  },
  {
    id: 'gt-finanzas',
    nombre: 'FINANZAS',
    codigo: 'FIN',
    descripcion: 'Presupuestos, Compras y Tesorería',
    color: '#14B8A6',
    icono: 'BadgeDollarSign',
    activo: true,
    createdAt: '2026-08-01T00:00:00Z',
  },
  {
    id: 'gt-seguridad',
    nombre: 'SEGURIDAD',
    codigo: 'SEG',
    descripcion: 'Control, Protocolos y Primeros Auxilios',
    color: '#EF4444',
    icono: 'ShieldCheck',
    activo: true,
    createdAt: '2026-08-01T00:00:00Z',
  },
];

/**
 * Normalizes text for lenient matching (removes accents, trims, lowercases, removes punctuation & spaces)
 */
export function normalizeCleanText(str: any): string {
  if (str == null) return '';
  return String(str)
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]/g, '');
}

/**
 * Resolves any GT reference from text (MERCADEO, MECADEO, Publicidad, MER, LOG, etc.)
 */
export function resolverGtDesdeTexto(rawGt: any, gtsDisponibles: GrupoTrabajo[] = []): GrupoTrabajo | null {
  const clean = normalizeCleanText(rawGt);
  if (!clean) return null;

  // Build merged pool of available GTs and canonical ones
  const pool = [...gtsDisponibles];
  for (const c of CANONICAL_GTS) {
    if (!pool.some((g) => g.id === c.id || normalizeCleanText(g.nombre) === normalizeCleanText(c.nombre))) {
      pool.push(c);
    }
  }

  // Find Mercadeo reference in pool
  const mercadeoGt =
    pool.find((g) => g.id === 'gt-mercadeo' || normalizeCleanText(g.nombre).includes('mercadeo')) ||
    pool.find((g) => g.id === 'gt-publicidad' || normalizeCleanText(g.nombre).includes('publicidad')) ||
    CANONICAL_GTS[0];

  // 1. Direct check against Mercadeo aliases and variants
  if (
    clean === 'mercadeo' ||
    clean === 'mecadeo' ||
    clean === 'mer' ||
    clean === 'mkt' ||
    clean === 'marketing' ||
    clean === 'publicidad' ||
    clean === 'pub' ||
    clean.includes('mercadeo') ||
    clean.includes('mecadeo') ||
    clean.includes('publicidad') ||
    clean.includes('marketing') ||
    clean === 'gtmercadeo' ||
    clean === 'gtmecadeo' ||
    clean === 'gtpublicidad'
  ) {
    return {
      ...mercadeoGt,
      nombre: 'MERCADEO',
      codigo: 'MER',
      id: mercadeoGt.id === 'gt-publicidad' ? 'gt-mercadeo' : mercadeoGt.id,
    };
  }

  // 2. Direct exact check on names and codes
  for (const gt of pool) {
    const normNom = normalizeCleanText(gt.nombre);
    const normCod = normalizeCleanText(gt.codigo);
    if (clean === normNom || clean === normCod || clean === normalizeCleanText(gt.id)) {
      return gt.id === 'gt-publicidad' ? { ...gt, id: 'gt-mercadeo', nombre: 'MERCADEO', codigo: 'MER' } : gt;
    }
  }

  // 3. Smart pattern matching for other GTs
  if (clean.includes('logistica') || clean === 'log' || clean.includes('operaciones')) {
    return pool.find((g) => g.id === 'gt-logistica' || normalizeCleanText(g.nombre).includes('logistica')) || CANONICAL_GTS[1];
  }

  if (clean === 'gh' || clean.includes('gestionhumana') || clean.includes('gestion') || clean.includes('humana') || clean.includes('talento')) {
    return pool.find((g) => g.id === 'gt-gh' || normalizeCleanText(g.nombre) === 'gh') || CANONICAL_GTS[2];
  }

  if (clean === 'rrpp' || clean.includes('relacionespublicas') || clean.includes('relaciones') || clean.includes('patrocinio')) {
    return pool.find((g) => g.id === 'gt-rrpp' || normalizeCleanText(g.nombre) === 'rrpp') || CANONICAL_GTS[3];
  }

  if (clean.includes('generales') || clean === 'gen' || clean.includes('general') || clean.includes('coordinacion')) {
    return pool.find((g) => g.id === 'gt-generales' || normalizeCleanText(g.nombre).includes('generales')) || CANONICAL_GTS[4];
  }

  if (clean.includes('thegames') || clean.includes('games') || clean === 'tg' || clean.includes('juegos') || clean.includes('gaming')) {
    return pool.find((g) => g.id === 'gt-the-games' || normalizeCleanText(g.nombre).includes('thegames')) || CANONICAL_GTS[5];
  }

  if (clean.includes('carnival') || clean.includes('carnaval') || clean === 'carn' || clean.includes('cultura')) {
    return pool.find((g) => g.id === 'gt-carnival' || normalizeCleanText(g.nombre).includes('carnival')) || CANONICAL_GTS[6];
  }

  if (clean.includes('finanzas') || clean === 'fin' || clean.includes('tesoreria') || clean.includes('presupuesto')) {
    return pool.find((g) => g.id === 'gt-finanzas' || normalizeCleanText(g.nombre).includes('finanzas')) || CANONICAL_GTS[7];
  }

  if (clean.includes('seguridad') || clean === 'seg' || clean.includes('protocolo') || clean.includes('auxilio')) {
    return pool.find((g) => g.id === 'gt-seguridad' || normalizeCleanText(g.nombre).includes('seguridad')) || CANONICAL_GTS[8];
  }

  return null;
}

/**
 * Parses and validates the uploaded Excel file according to exact prompt specifications.
 */
export async function validarYParsearExcel(
  file: File,
  gtsDisponibles: GrupoTrabajo[] = [],
  personasExistentes: Persona[] = []
): Promise<ExcelValidationResult> {
  const errors: string[] = [];

  try {
    const arrayBuffer = await file.arrayBuffer();
    const wb = XLSX.read(arrayBuffer, { type: 'array' });

    if (!wb.SheetNames || wb.SheetNames.length === 0) {
      return {
        isValid: false,
        errors: ['El archivo de Excel está vacío o no contiene hojas legibles.'],
        totalFilas: 0,
        totalNuevas: 0,
        totalDuplicados: 0,
        totalInvalidos: 0,
        totalIncompletos: 0,
        personas: [],
      };
    }

    // Use the first sheet
    const firstSheetName = wb.SheetNames[0];
    const ws = wb.Sheets[firstSheetName];

    // Read as array of arrays
    const rawData: any[][] = XLSX.utils.sheet_to_json(ws, { header: 1, blankrows: false });

    if (!rawData || rawData.length === 0) {
      return {
        isValid: false,
        errors: ['El archivo está completamente vacío.'],
        totalFilas: 0,
        totalNuevas: 0,
        totalDuplicados: 0,
        totalInvalidos: 0,
        totalIncompletos: 0,
        personas: [],
      };
    }

    // Identify headers in first row (flexible match)
    const headerRow = (rawData[0] || []).map((h) => String(h || '').trim());
    let colNombreIdx = headerRow.findIndex((h) => {
      const clean = normalizeCleanText(h);
      return clean.includes('nombre') || clean.includes('integrante') || clean.includes('persona') || clean.includes('participante');
    });

    let colGtIdx = headerRow.findIndex((h) => {
      const clean = normalizeCleanText(h);
      return clean === 'gt' || clean.includes('grupo') || clean.includes('comite') || clean.includes('equipo');
    });

    let colTipoIdx = headerRow.findIndex((h) => {
      const clean = normalizeCleanText(h);
      return clean === 'tipo' || clean.includes('rol') || clean.includes('cargo') || clean.includes('estatus');
    });

    let startRow = 1;

    // Fallback: If no clear headers found, but row 0 looks like data with 2 or 3 columns:
    if (colNombreIdx === -1 || colGtIdx === -1) {
      if (headerRow.length >= 2) {
        const potentialGtCol0 = resolverGtDesdeTexto(headerRow[0], gtsDisponibles);
        const potentialGtCol1 = resolverGtDesdeTexto(headerRow[1], gtsDisponibles);

        if (potentialGtCol1) {
          colNombreIdx = 0;
          colGtIdx = 1;
          colTipoIdx = headerRow.length >= 3 ? 2 : -1;
          startRow = 0; // The first row was actually data
        } else if (potentialGtCol0) {
          colNombreIdx = 1;
          colGtIdx = 0;
          colTipoIdx = headerRow.length >= 3 ? 2 : -1;
          startRow = 0;
        } else {
          // Default fallback to Col 0 = Nombre, Col 1 = GT, Col 2 = Tipo
          if (colNombreIdx === -1) colNombreIdx = 0;
          if (colGtIdx === -1) colGtIdx = 1;
          if (colTipoIdx === -1 && headerRow.length >= 3) colTipoIdx = 2;
        }
      }
    }

    if (colTipoIdx === -1 && headerRow.length >= 3 && colNombreIdx !== 2 && colGtIdx !== 2) {
      colTipoIdx = 2;
    }

    // Rule 1: Que exista la columna NOMBRE
    if (colNombreIdx === -1) {
      errors.push('No se encontró la columna NOMBRE en el archivo. Revisa los encabezados.');
    }

    // Rule 2: Que exista la columna GT
    if (colGtIdx === -1) {
      errors.push('No se encontró la columna GT en el archivo. Revisa los encabezados.');
    }

    if (errors.length > 0) {
      return {
        isValid: false,
        errors,
        totalFilas: 0,
        totalNuevas: 0,
        totalDuplicados: 0,
        totalInvalidos: 0,
        totalIncompletos: 0,
        personas: [],
      };
    }

    const personasParsed: PersonaImportada[] = [];
    const seenNamesInFile = new Set<string>();
    let totalDuplicados = 0;
    let totalInvalidos = 0;
    let totalIncompletos = 0;

    const existingNamesSet = new Set<string>(
      personasExistentes.map((p) => normalizeCleanText(p.nombreCompleto))
    );

    // Iterate data rows
    for (let r = startRow; r < rawData.length; r++) {
      const row = rawData[r];
      if (!row || row.length === 0) continue;

      const rawNombre = row[colNombreIdx] != null ? String(row[colNombreIdx]).trim() : '';
      const rawGt = row[colGtIdx] != null ? String(row[colGtIdx]).trim() : '';
      const rawTipo = colTipoIdx !== -1 && row[colTipoIdx] != null ? String(row[colTipoIdx]).trim().toUpperCase() : 'GT';

      // Ignore completely empty trailing rows
      if (!rawNombre && !rawGt && (!rawTipo || rawTipo === 'GT')) {
        continue;
      }

      const filaNum = r + 1;
      let filaValida = true;

      // Rule 3: Que no falte el nombre
      if (!rawNombre) {
        errors.push(`Fila ${filaNum}: El nombre es obligatorio.`);
        totalIncompletos++;
        filaValida = false;
      }

      // Rule 4: Que no falte el GT
      if (!rawGt) {
        errors.push(`Fila ${filaNum}: El GT es obligatorio.`);
        totalIncompletos++;
        filaValida = false;
      }

      // Rule 5: Tipo válido (únicamente GT, MESA, GAP)
      const cleanTipo = (rawTipo || 'GT').toUpperCase().trim();
      if (cleanTipo !== 'GT' && cleanTipo !== 'MESA' && cleanTipo !== 'GAP') {
        errors.push(`Fila ${filaNum}: Tipo "${rawTipo}" no válido. Debe ser GT, MESA o GAP.`);
        totalInvalidos++;
        filaValida = false;
      }

      if (!filaValida) {
        continue;
      }

      // Rule 6: Que el GT exista en los 9 GTs oficiales
      const matchedGt = resolverGtDesdeTexto(rawGt, gtsDisponibles);
      if (!matchedGt) {
        errors.push(`Fila ${filaNum}: El GT "${rawGt}" no existe. Debe ser uno de los 9 GTs oficiales (ej: MERCADEO, LOGÍSTICA, etc.).`);
        totalInvalidos++;
        continue;
      }

      // Rule 7: Que no existan personas duplicadas
      const normName = normalizeCleanText(rawNombre);
      if (seenNamesInFile.has(normName) || existingNamesSet.has(normName)) {
        errors.push(`Fila ${filaNum}: La persona "${rawNombre}" está duplicada.`);
        totalDuplicados++;
        continue;
      } else {
        seenNamesInFile.add(normName);
      }

      personasParsed.push({
        nombre: rawNombre,
        gtNombre: matchedGt.nombre.toUpperCase(),
        gtId: matchedGt.id,
        tipo: (cleanTipo as 'GT' | 'MESA' | 'GAP') || 'GT',
        fila: filaNum,
      });
    }

    if (personasParsed.length === 0 && errors.length === 0) {
      errors.push('El archivo no contiene filas de personas válidas para importar.');
    }

    return {
      isValid: errors.length === 0,
      errors,
      totalFilas: rawData.length - startRow,
      totalNuevas: personasParsed.length,
      totalDuplicados,
      totalInvalidos,
      totalIncompletos,
      personas: personasParsed,
    };
  } catch (err: any) {
    return {
      isValid: false,
      errors: [`Error al procesar el archivo Excel: ${err?.message || 'Formato no soportado'}`],
      totalFilas: 0,
      totalNuevas: 0,
      totalDuplicados: 0,
      totalInvalidos: 0,
      totalIncompletos: 0,
      personas: [],
    };
  }
}

