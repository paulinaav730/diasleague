import React, { useState, useRef } from 'react';
import { useApp } from '../../lib/store';
import {
  descargarPlantillaExcelMaestro,
  validarYParsearExcel,
  ExcelValidationResult,
  PersonaImportada,
} from '../../lib/excelUtils';
import {
  FileSpreadsheet,
  Download,
  UploadCloud,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  FileCheck,
  Users,
  RefreshCw,
} from 'lucide-react';

interface ExcelImportSectionProps {
  onSuccess?: () => void;
}

export const ExcelImportSection: React.FC<ExcelImportSectionProps> = ({ onSuccess }) => {
  const { gts, personas, importarPersonasMasivo } = useApp();

  const [archivo, setArchivo] = useState<File | null>(null);
  const [cargando, setCargando] = useState(false);
  const [resultado, setResultado] = useState<ExcelValidationResult | null>(null);
  const [feedback, setFeedback] = useState<{ tipo: 'success' | 'error'; mensaje: string } | null>(
    null
  );
  const [importando, setImportando] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (file: File) => {
    setArchivo(file);
    setCargando(true);
    setResultado(null);
    setFeedback(null);

    try {
      const res = await validarYParsearExcel(file, gts, personas);
      setResultado(res);
    } catch (err: any) {
      setFeedback({
        tipo: 'error',
        mensaje: err.message || 'Error al procesar el archivo Excel.',
      });
    } finally {
      setCargando(false);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const handleConfirmarImportacion = async () => {
    if (!resultado || !resultado.isValid || resultado.personas.length === 0) return;

    setImportando(true);
    try {
      const datos = resultado.personas.map((f) => ({
        nombreCompleto: f.nombre,
        gtId: f.gtId,
      }));

      const res = await importarPersonasMasivo(datos);
      if (res.success) {
        setFeedback({
          tipo: 'success',
          mensaje: `¡Importación completada con éxito! Se cargaron ${res.count} personas a la DIAS LEAGUE.`,
        });
        setArchivo(null);
        setResultado(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
        if (onSuccess) {
          setTimeout(onSuccess, 1500);
        }
      }
    } catch (err: any) {
      setFeedback({
        tipo: 'error',
        mensaje: err.message || 'Error al guardar las personas importadas.',
      });
    } finally {
      setImportando(false);
    }
  };

  const handleReset = () => {
    setArchivo(null);
    setResultado(null);
    setFeedback(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="space-y-6">
      {/* Header & Instructions */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-7 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <FileSpreadsheet className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-black text-white tracking-tight">
                Importar Personas desde Excel
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-xl">
              Carga masivamente los integrantes reales de la Organización Estudiantil DIAS EAFIT.
              El archivo debe tener exactamente las columnas <code className="text-emerald-400 font-bold bg-slate-800 px-1.5 py-0.5 rounded">NOMBRE</code> y <code className="text-emerald-400 font-bold bg-slate-800 px-1.5 py-0.5 rounded">GT</code>.
            </p>
          </div>

          {/* Download Template Button */}
          <button
            onClick={() => descargarPlantillaExcelMaestro(gts)}
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/20 transition-all shrink-0 cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Descargar Plantilla Excel Maestro</span>
          </button>
        </div>

        {/* Requirements info card */}
        <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="p-3 bg-slate-800/60 border border-slate-700/60 rounded-xl">
            <span className="font-bold text-slate-200 block mb-1">1. Encabezados requeridos</span>
            <span className="text-slate-400">Fila 1: Columna A: <strong className="text-emerald-300">NOMBRE</strong> | Columna B: <strong className="text-emerald-300">GT</strong></span>
          </div>
          <div className="p-3 bg-slate-800/60 border border-slate-700/60 rounded-xl">
            <span className="font-bold text-slate-200 block mb-1">2. GTs Válidos ({gts.length})</span>
            <span className="text-slate-400 font-medium">
              {gts.map((g) => g.nombre.toUpperCase()).join(', ')}
            </span>
          </div>
          <div className="p-3 bg-slate-800/60 border border-slate-700/60 rounded-xl">
            <span className="font-bold text-slate-200 block mb-1">3. Validación previa</span>
            <span className="text-slate-400">El sistema detecta duplicados y filas erróneas antes de guardar nada.</span>
          </div>
        </div>
      </div>

      {/* Feedback Message */}
      {feedback && (
        <div
          className={`p-4 rounded-2xl border text-xs sm:text-sm flex items-center justify-between gap-3 ${
            feedback.tipo === 'success'
              ? 'bg-emerald-950/60 border-emerald-500 text-emerald-200'
              : 'bg-rose-950/60 border-rose-500 text-rose-200'
          }`}
        >
          <div className="flex items-center gap-2.5">
            {feedback.tipo === 'success' ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            ) : (
              <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0" />
            )}
            <span>{feedback.mensaje}</span>
          </div>
          <button
            onClick={() => setFeedback(null)}
            className="text-xs opacity-70 hover:opacity-100 font-bold cursor-pointer"
          >
            Cerrar
          </button>
        </div>
      )}

      {/* Drop zone / Upload box */}
      {!resultado && (
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          className="bg-slate-900/90 border-2 border-dashed border-slate-700 hover:border-emerald-500/70 rounded-3xl p-8 sm:p-12 text-center transition-all cursor-pointer group"
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".xlsx, .xls"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                handleFileChange(e.target.files[0]);
              }
            }}
            className="hidden"
          />

          <div className="w-16 h-16 rounded-2xl bg-slate-800 group-hover:bg-emerald-500/10 border border-slate-700 group-hover:border-emerald-500/30 flex items-center justify-center mx-auto mb-4 text-slate-400 group-hover:text-emerald-400 transition-all">
            {cargando ? (
              <RefreshCw className="w-8 h-8 animate-spin text-emerald-400" />
            ) : (
              <UploadCloud className="w-8 h-8" />
            )}
          </div>

          <h4 className="text-lg font-bold text-white mb-1">
            {cargando ? 'Validando archivo Excel...' : 'Selecciona o arrastra tu archivo Excel'}
          </h4>
          <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto mb-4">
            Formatos compatibles: <strong className="text-slate-200">.xlsx</strong> o <strong className="text-slate-200">.xls</strong> con columnas NOMBRE y GT.
          </p>

          <button
            type="button"
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-600 text-slate-200 rounded-xl text-xs font-semibold cursor-pointer"
          >
            Examinar archivos...
          </button>
        </div>
      )}

      {/* Validation Results & Preview */}
      {resultado && (
        <div className="space-y-6">
          {/* Summary Status Bar */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    resultado.isValid
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                  }`}
                >
                  {resultado.isValid ? <FileCheck className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
                </div>
                <div>
                  <h4 className="text-base font-bold text-white flex items-center gap-2">
                    {archivo?.name}
                    {resultado.isValid ? (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                        Válido para importar
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                        Requiere corrección
                      </span>
                    )}
                  </h4>
                  <p className="text-xs text-slate-400">
                    {resultado.totalFilas} registros de personas procesados
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleReset}
                  className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 border border-slate-700 cursor-pointer"
                >
                  Cambiar archivo
                </button>

                <button
                  onClick={handleConfirmarImportacion}
                  disabled={!resultado.isValid || resultado.personas.length === 0 || importando}
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 disabled:cursor-not-allowed text-xs font-black text-white shadow-lg shadow-emerald-600/30 flex items-center gap-2 cursor-pointer"
                >
                  {importando ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Importando...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Confirmar e Importar {resultado.personas.length} Personas</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Metrics Counter */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-4">
              <div className="p-3 bg-slate-800/40 rounded-xl border border-slate-800">
                <span className="text-[11px] text-slate-400 uppercase font-semibold block">Total Personas</span>
                <span className="text-xl font-black text-white">{resultado.totalFilas}</span>
              </div>
              <div className="p-3 bg-emerald-950/20 rounded-xl border border-emerald-500/30">
                <span className="text-[11px] text-emerald-400 uppercase font-semibold block">Personas Válidas</span>
                <span className="text-xl font-black text-emerald-300">{resultado.personas.length}</span>
              </div>
              <div className="p-3 bg-rose-950/20 rounded-xl border border-rose-500/30">
                <span className="text-[11px] text-rose-400 uppercase font-semibold block">Errores Encontrados</span>
                <span className="text-xl font-black text-rose-300">{resultado.errors.length}</span>
              </div>
            </div>
          </div>

          {/* Errors list if any */}
          {resultado.errors.length > 0 && (
            <div className="bg-rose-950/30 border border-rose-500/40 rounded-3xl p-5 space-y-3">
              <div className="flex items-center gap-2 text-rose-300 font-bold text-sm">
                <XCircle className="w-4 h-4" />
                <span>Errores detectados ({resultado.errors.length})</span>
              </div>
              <div className="space-y-1.5 pr-2">
                {resultado.errors.map((err, i) => (
                  <div
                    key={i}
                    className="p-2.5 bg-slate-900/80 border border-rose-900/60 rounded-xl text-xs flex items-center justify-between text-slate-300"
                  >
                    <span>{err}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Preview Table of Valid Rows */}
          {resultado.personas.length > 0 && (
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-base font-bold text-white flex items-center gap-2">
                  <Users className="w-4 h-4 text-emerald-400" />
                  Vista Previa de Personas a Importar ({resultado.personas.length})
                </h4>
                <span className="text-xs text-slate-400">
                  Se vincularán a su GT y el factor de tamaño se recalculará automáticamente.
                </span>
              </div>

              <div className="max-h-72 overflow-y-auto overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-slate-800/80 text-slate-400 uppercase font-bold sticky top-0">
                    <tr>
                      <th className="py-2.5 px-3">#</th>
                      <th className="py-2.5 px-3">Nombre Completo</th>
                      <th className="py-2.5 px-3">GT Asignado</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {resultado.personas.map((item, idx) => (
                      <tr key={idx} className="hover:bg-slate-800/40">
                        <td className="py-2 px-3 text-slate-500">{idx + 1}</td>
                        <td className="py-2 px-3 font-semibold text-white">{item.nombre}</td>
                        <td className="py-2 px-3 text-slate-300">
                          <span className="px-2 py-0.5 rounded bg-slate-800 font-medium text-emerald-400 border border-slate-700">
                            {item.gtNombre}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
