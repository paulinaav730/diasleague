import * as XLSX from 'xlsx';
import { GrupoTrabajo, Persona } from '../types';

export interface PersonaImportada {
  nombre: string;
  gtNombre: string;
  gtId: string;
}

export interface ExcelValidationResult {
  isValid: boolean;
  errors: string[];
  totalFilas: number;
  personas: PersonaImportada[];
}

/**
 * Generates and downloads the official DIAS LEAGUE - EXCEL MAESTRO.xlsx template.
 * - Primary sheet "Personas" with only two columns: NOMBRE | GT
 * - Secondary reference sheet "GTs" with available GTs
 */
export function descargarPlantillaExcelMaestro(gts: GrupoTrabajo[]) {
  const wb = XLSX.utils.book_new();

  // Hoja principal: únicamente NOMBRE y GT
  const wsMain = XLSX.utils.aoa_to_sheet([['NOMBRE', 'GT']]);
  wsMain['!cols'] = [{ wch: 32 }, { wch: 22 }];
  XLSX.utils.book_append_sheet(wb, wsMain, 'Personas');

  // Hoja secundaria de referencia: GTs disponibles
  const gtsList = gts && gts.length > 0
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
    ['GT DISPONIBLE', 'CÓDIGO'],
    ...gtsList.map((g) => [g.nombre, g.codigo]),
  ];
  const wsGts = XLSX.utils.aoa_to_sheet(gtsData);
  wsGts['!cols'] = [{ wch: 26 }, { wch: 16 }];
  XLSX.utils.book_append_sheet(wb, wsGts, 'GTs');

  // Descarga del archivo
  XLSX.writeFile(wb, 'DIAS_LEAGUE_EXCEL_MAESTRO.xlsx');
}

/**
 * Normalizes text for lenient matching (removes accents, trims, lowercases)
 */
function normalizeString(str: string): string {
  return (str || '')
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

/**
 * Parses and validates the uploaded Excel file according to exact prompt specifications.
 */
export async function validarYParsearExcel(
  file: File,
  gtsDisponibles: GrupoTrabajo[],
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
        personas: [],
      };
    }

    // 1. Identify headers in first row
    const headerRow = (rawData[0] || []).map((h) => String(h || '').trim());
    const colNombreIdx = headerRow.findIndex(
      (h) => normalizeString(h) === 'nombre' || normalizeString(h) === 'nombres'
    );
    const colGtIdx = headerRow.findIndex(
      (h) => normalizeString(h) === 'gt' || normalizeString(h) === 'grupo' || normalizeString(h) === 'grupodetrabajo'
    );

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
        personas: [],
      };
    }

    // Prepare GT lookup map
    const gtLookup = new Map<string, GrupoTrabajo>();
    gtsDisponibles.forEach((gt) => {
      gtLookup.set(normalizeString(gt.nombre), gt);
      gtLookup.set(normalizeString(gt.codigo), gt);
      // If this is MERCADEO, also map aliases like mecadeo, publicidad, pub
      if (
        normalizeString(gt.nombre).includes('mercadeo') ||
        normalizeString(gt.codigo) === 'mer' ||
        gt.id === 'gt-mercadeo' ||
        gt.id === 'gt-publicidad'
      ) {
        gtLookup.set('mecadeo', gt);
        gtLookup.set('mercadeo', gt);
        gtLookup.set('publicidad', gt);
        gtLookup.set('pub', gt);
      }
    });

    const personasParsed: PersonaImportada[] = [];
    const seenNamesInFile = new Set<string>();
    let hasMissingName = false;
    let hasMissingGt = false;
    let hasDuplicates = false;
    const invalidGtsSet = new Set<string>();

    const existingNamesSet = new Set<string>(
      personasExistentes.map((p) => normalizeString(p.nombreCompleto))
    );

    // Iterate data rows (starting at row 1, 0-indexed)
    for (let r = 1; r < rawData.length; r++) {
      const row = rawData[r];
      if (!row || row.length === 0) continue;

      const rawNombre = row[colNombreIdx] != null ? String(row[colNombreIdx]).trim() : '';
      const rawGt = row[colGtIdx] != null ? String(row[colGtIdx]).trim() : '';

      // Ignore empty trailing rows
      if (!rawNombre && !rawGt) {
        continue;
      }

      // Rule 3: Que no falte el nombre
      if (!rawNombre) {
        hasMissingName = true;
      }

      // Rule 4: Que no falte el GT
      if (!rawGt) {
        hasMissingGt = true;
      }

      // If either is missing, we record the error and continue
      if (!rawNombre || !rawGt) {
        continue;
      }

      // Rule 5: Que el GT exista en la base de datos
      const matchedGt = gtLookup.get(normalizeString(rawGt));
      if (!matchedGt) {
        invalidGtsSet.add(rawGt);
      }

      // Rule 6: Que no existan personas duplicadas
      const normName = normalizeString(rawNombre);
      if (seenNamesInFile.has(normName) || existingNamesSet.has(normName)) {
        hasDuplicates = true;
      } else {
        seenNamesInFile.add(normName);
      }

      if (matchedGt) {
        personasParsed.push({
          nombre: rawNombre,
          gtNombre: matchedGt.nombre,
          gtId: matchedGt.id,
        });
      }
    }

    // Construct precise required error messages from prompt:
    if (invalidGtsSet.size > 0) {
      invalidGtsSet.forEach((invalidGt) => {
        errors.push(`El GT ${invalidGt} no existe. Revisa el archivo antes de continuar.`);
      });
    }

    if (hasMissingName) {
      errors.push('Hay personas sin nombre.');
    }

    if (hasMissingGt) {
      errors.push('Hay personas sin GT.');
    }

    if (hasDuplicates) {
      errors.push('Se encontraron personas duplicadas.');
    }

    if (personasParsed.length === 0 && errors.length === 0) {
      errors.push('El archivo no contiene filas de personas para importar.');
    }

    return {
      isValid: errors.length === 0,
      errors,
      totalFilas: personasParsed.length,
      personas: personasParsed,
    };
  } catch (err: any) {
    return {
      isValid: false,
      errors: [`Error al procesar el archivo Excel: ${err?.message || 'Formato no soportado'}`],
      totalFilas: 0,
      personas: [],
    };
  }
}
