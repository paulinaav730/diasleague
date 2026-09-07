import React, { useState } from 'react';
import { useApp } from '../lib/store';
import { Evento } from '../types';
import {
  Shield,
  Trophy,
  Users,
  Calendar,
  Clock,
  QrCode,
  Sparkles,
  Scale,
  FileText,
  AlertTriangle,
  RotateCcw,
  Trash2,
  Edit2,
  Plus,
  Check,
  X,
  Lock,
  Unlock,
  CheckCircle2,
  Database,
  ExternalLink,
} from 'lucide-react';

type AdminTab =
  | 'temporadas'
  | 'gts'
  | 'personas'
  | 'eventos_turnos'
  | 'retos'
  | 'factores'
  | 'auditoria'
  | 'datos';

export const AdminPanel: React.FC = () => {
  const {
    temporadas,
    gts,
    personas,
    eventos,
    turnos,
    retos,
    asistencias,
    participacionesRetos,
    factores,
    auditLogs,
    temporadaActiva,
    crearTemporada,
    activarTemporada,
    cerrarTemporada,
    crearGt,
    actualizarGt,
    toggleGtActivo,
    crearPersona,
    actualizarPersona,
    cambiarGtPersona,
    togglePersonaActiva,
    eliminarPersona,
    crearEvento,
    actualizarEvento,
    cambiarEstadoEvento,
    crearTurno,
    actualizarTurno,
    activarTurno,
    cerrarTurno,
    crearReto,
    asignarGanadorReto,
    actualizarFactor,
    actualizarRangoFactor,
    anularAsistencia,
    anularParticipacionReto,
    restablecerDatosPrueba,
    limpiarTodosLosDatos,
  } = useApp();

  const [activeAdminTab, setActiveAdminTab] = useState<AdminTab>('eventos_turnos');

  // Season creation state
  const [newTempName, setNewTempName] = useState('');
  const [newTempStart, setNewTempStart] = useState('2027-02-01');
  const [newTempEnd, setNewTempEnd] = useState('2027-06-30');

  // Person creation state
  const [newPersonaNombre, setNewPersonaNombre] = useState('');
  const [newPersonaGtId, setNewPersonaGtId] = useState(gts[0]?.id || '');

  // Challenge winner assignment state
  const [selectedRetoId, setSelectedRetoId] = useState(retos[0]?.id || '');
  const [selectedGtId, setSelectedGtId] = useState(gts[0]?.id || '');
  const [selectedPersonaId, setSelectedPersonaId] = useState('');
  const [retoPointsToAward, setRetoPointsToAward] = useState(25);
  const [retoPosition, setRetoPosition] = useState(1);
  const [retoObs, setRetoObs] = useState('Ganador del desafío');

  // Audit void state
  const [voidReason, setVoidReason] = useState('');

  // Notifications
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);

  const showFeedback = (msg: string) => {
    setFeedbackMsg(msg);
    setTimeout(() => setFeedbackMsg(null), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Admin Panel Header */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-purple-600/20">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase font-extrabold tracking-wider text-purple-400 bg-purple-500/10 border border-purple-500/30 px-2.5 py-0.5 rounded-full">
                  Centro de Control Oficial
                </span>
                <span className="text-xs text-slate-400 font-medium">
                  {temporadaActiva?.nombre} (Activa)
                </span>
              </div>
              <h2 className="text-2xl font-black text-white mt-0.5">
                Panel de Administración DIAS LEAGUE
              </h2>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                if (window.confirm('¿Deseas restaurar todos los datos de prueba iniciales de la Organización Estudiantil DIAS EAFIT?')) {
                  restablecerDatosPrueba();
                  showFeedback('¡Datos iniciales de prueba restaurados con éxito!');
                }
              }}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs text-amber-300 font-bold transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Restablecer Datos EAFIT
            </button>
          </div>
        </div>

        {/* Feedback Alert */}
        {feedbackMsg && (
          <div className="mt-4 p-3 bg-emerald-950/60 border border-emerald-500/50 rounded-xl text-xs text-emerald-300 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>{feedbackMsg}</span>
          </div>
        )}

        {/* Secondary Admin Navigation Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pt-6 border-t border-slate-800/80 mt-6 text-xs font-semibold">
          <button
            onClick={() => setActiveAdminTab('eventos_turnos')}
            className={`px-3.5 py-2 rounded-xl whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              activeAdminTab === 'eventos_turnos'
                ? 'bg-purple-600 text-white shadow'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Eventos & Turnos QR</span>
          </button>

          <button
            onClick={() => setActiveAdminTab('retos')}
            className={`px-3.5 py-2 rounded-xl whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              activeAdminTab === 'retos'
                ? 'bg-purple-600 text-white shadow'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Retos & Desafíos</span>
          </button>

          <button
            onClick={() => setActiveAdminTab('factores')}
            className={`px-3.5 py-2 rounded-xl whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              activeAdminTab === 'factores'
                ? 'bg-purple-600 text-white shadow'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Scale className="w-3.5 h-3.5" />
            <span>Factores de Tamaño</span>
          </button>

          <button
            onClick={() => setActiveAdminTab('personas')}
            className={`px-3.5 py-2 rounded-xl whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              activeAdminTab === 'personas'
                ? 'bg-purple-600 text-white shadow'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Integrantes</span>
          </button>

          <button
            onClick={() => setActiveAdminTab('gts')}
            className={`px-3.5 py-2 rounded-xl whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              activeAdminTab === 'gts'
                ? 'bg-purple-600 text-white shadow'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Trophy className="w-3.5 h-3.5" />
            <span>Grupos de Trabajo (GT)</span>
          </button>

          <button
            onClick={() => setActiveAdminTab('temporadas')}
            className={`px-3.5 py-2 rounded-xl whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              activeAdminTab === 'temporadas'
                ? 'bg-purple-600 text-white shadow'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Temporadas</span>
          </button>

          <button
            onClick={() => setActiveAdminTab('auditoria')}
            className={`px-3.5 py-2 rounded-xl whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              activeAdminTab === 'auditoria'
                ? 'bg-purple-600 text-white shadow'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Auditoría & Corrección</span>
          </button>

          <button
            onClick={() => setActiveAdminTab('datos')}
            className={`px-3.5 py-2 rounded-xl whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              activeAdminTab === 'datos'
                ? 'bg-purple-600 text-white shadow'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            <span>Supabase & Producción</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* TAB: EVENTOS & TURNOS QR                                                  */}
      {/* ========================================================================= */}
      {activeAdminTab === 'eventos_turnos' && (
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-indigo-400" />
              Gestión de Eventos y Configuración de Puntos
            </h3>

            <div className="divide-y divide-slate-800">
              {eventos.map((e) => {
                const eventoTurnos = turnos.filter((t) => t.eventoId === e.id);

                return (
                  <div key={e.id} className="py-4 first:pt-0 last:pb-0 space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-base font-bold text-white">{e.nombre}</h4>
                          <span
                            className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded border ${
                              e.estado === 'activo'
                                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                                : e.estado === 'finalizado'
                                ? 'bg-slate-800 text-slate-400 border-slate-700'
                                : 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30'
                            }`}
                          >
                            {e.estado}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 mt-0.5">{e.descripcion}</p>
                      </div>

                      {/* State and Points changer */}
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1 text-xs text-slate-300 bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-700">
                          <span>Puntos:</span>
                          <input
                            type="number"
                            min="0"
                            step="5"
                            value={e.puntosAsistencia}
                            onChange={(ev) =>
                              actualizarEvento(e.id, {
                                puntosAsistencia: Number(ev.target.value),
                              })
                            }
                            className="w-16 bg-slate-900 text-amber-300 font-bold px-1.5 py-0.5 rounded border border-slate-700 text-right"
                          />
                        </div>

                        <select
                          value={e.estado}
                          onChange={(ev) =>
                            cambiarEstadoEvento(
                              e.id,
                              ev.target.value as Evento['estado']
                            )
                          }
                          className="bg-slate-800 text-xs text-slate-200 border border-slate-700 rounded-xl px-2.5 py-1.5"
                        >
                          <option value="programado">Programado</option>
                          <option value="activo">🟢 Activo</option>
                          <option value="finalizado">Finalizado</option>
                        </select>
                      </div>
                    </div>

                    {/* Shifts (Turnos) within this Event */}
                    {e.utilizaTurnos && (
                      <div className="pl-4 border-l-2 border-slate-800 space-y-2 mt-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs uppercase font-bold text-amber-400 flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5" />
                            Turnos de {e.nombre} ({eventoTurnos.length})
                          </span>
                          <button
                            onClick={() => {
                              const turnoNum = eventoTurnos.length + 1;
                              crearTurno({
                                eventoId: e.id,
                                temporadaId: e.temporadaId,
                                nombre: `Turno ${turnoNum}`,
                                horaInicio: '08:00 AM',
                                horaFin: '10:00 AM',
                                estado: 'programado',
                                activo: false,
                              });
                              showFeedback(`Turno ${turnoNum} creado para ${e.nombre}`);
                            }}
                            className="text-[11px] text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1"
                          >
                            <Plus className="w-3 h-3" /> Agregar Turno
                          </button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
                          {eventoTurnos.map((t) => (
                            <div
                              key={t.id}
                              className={`p-3 rounded-xl border text-xs flex flex-col justify-between ${
                                t.activo
                                  ? 'bg-emerald-950/20 border-emerald-500/40'
                                  : 'bg-slate-800/40 border-slate-800'
                              }`}
                            >
                              <div className="flex justify-between items-start mb-2">
                                <span className="font-bold text-white">{t.nombre}</span>
                                <span
                                  className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${
                                    t.activo
                                      ? 'bg-emerald-500/20 text-emerald-300'
                                      : 'bg-slate-800 text-slate-500'
                                  }`}
                                >
                                  {t.activo ? 'QR Activo' : 'Cerrado'}
                                </span>
                              </div>
                              <span className="text-[11px] text-slate-400 mb-2">
                                {t.horaInicio} - {t.horaFin}
                              </span>

                              <div className="pt-2 border-t border-slate-800/80 flex justify-between items-center">
                                {t.activo ? (
                                  <button
                                    onClick={() => {
                                      cerrarTurno(t.id);
                                      showFeedback(`QR de ${t.nombre} cerrado.`);
                                    }}
                                    className="px-2 py-1 bg-red-600/80 hover:bg-red-600 text-white rounded text-[10px] font-bold flex items-center gap-1"
                                  >
                                    <Lock className="w-3 h-3" /> Cerrar QR
                                  </button>
                                ) : (
                                  <button
                                    onClick={() => {
                                      activarTurno(t.id);
                                      showFeedback(`QR de ${t.nombre} activado.`);
                                    }}
                                    className="px-2 py-1 bg-emerald-600/80 hover:bg-emerald-600 text-white rounded text-[10px] font-bold flex items-center gap-1"
                                  >
                                    <Unlock className="w-3 h-3" /> Abrir QR
                                  </button>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB: RETOS & DESAFÍOS                                                     */}
      {/* ========================================================================= */}
      {activeAdminTab === 'retos' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Award points to winner */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl lg:col-span-1 space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              Asignar Puntos de Reto
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 uppercase font-bold mb-1">
                  Reto
                </label>
                <select
                  value={selectedRetoId}
                  onChange={(e) => setSelectedRetoId(e.target.value)}
                  className="w-full bg-slate-800 text-white p-2.5 rounded-xl border border-slate-700"
                >
                  {retos.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.nombre} (+{r.puntos} pts)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-400 uppercase font-bold mb-1">
                  Grupo de Trabajo Ganador (GT)
                </label>
                <select
                  value={selectedGtId}
                  onChange={(e) => {
                    setSelectedGtId(e.target.value);
                    setSelectedPersonaId('');
                  }}
                  className="w-full bg-slate-800 text-white p-2.5 rounded-xl border border-slate-700"
                >
                  {gts.map((gt) => (
                    <option key={gt.id} value={gt.id}>
                      {gt.nombre}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-400 uppercase font-bold mb-1">
                  Integrante Específico (Opcional)
                </label>
                <select
                  value={selectedPersonaId}
                  onChange={(e) => setSelectedPersonaId(e.target.value)}
                  className="w-full bg-slate-800 text-white p-2.5 rounded-xl border border-slate-700"
                >
                  <option value="">Todo el GT (Reto Grupal)</option>
                  {personas
                    .filter((p) => p.gtId === selectedGtId && p.activo)
                    .map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.nombreCompleto}
                      </option>
                    ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-400 uppercase font-bold mb-1">
                    Puntos a Otorgar
                  </label>
                  <input
                    type="number"
                    min="5"
                    step="5"
                    value={retoPointsToAward}
                    onChange={(e) => setRetoPointsToAward(Number(e.target.value))}
                    className="w-full bg-slate-800 text-white p-2 rounded-xl border border-slate-700 font-bold text-amber-300"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 uppercase font-bold mb-1">
                    Posición
                  </label>
                  <select
                    value={retoPosition}
                    onChange={(e) => setRetoPosition(Number(e.target.value))}
                    className="w-full bg-slate-800 text-white p-2 rounded-xl border border-slate-700"
                  >
                    <option value={1}>🥇 1er Puesto</option>
                    <option value={2}>🥈 2do Puesto</option>
                    <option value={3}>🥉 3er Puesto</option>
                    <option value={4}>4to Puesto</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-400 uppercase font-bold mb-1">
                  Observación
                </label>
                <input
                  type="text"
                  value={retoObs}
                  onChange={(e) => setRetoObs(e.target.value)}
                  placeholder="Detalle o justificación..."
                  className="w-full bg-slate-800 text-white p-2 rounded-xl border border-slate-700"
                />
              </div>

              <button
                onClick={() => {
                  asignarGanadorReto({
                    retoId: selectedRetoId,
                    gtId: selectedGtId,
                    personaId: selectedPersonaId || null,
                    puntos: Number(retoPointsToAward),
                    posicion: retoPosition,
                    observacion: retoObs,
                  });
                  showFeedback('¡Puntos de reto asignados exitosamente!');
                }}
                className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs shadow-lg shadow-amber-500/20"
              >
                Otorgar Puntos de Reto
              </button>
            </div>
          </div>

          {/* List of challenges and awarded points */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl lg:col-span-2">
            <h3 className="text-base font-bold text-white mb-4">
              Historial de Retos Otorgados
            </h3>

            <div className="space-y-2">
              {participacionesRetos.map((pr) => {
                const reto = retos.find((r) => r.id === pr.retoId);
                const gt = gts.find((g) => g.id === pr.gtId);
                const persona = pr.personaId
                  ? personas.find((p) => p.id === pr.personaId)
                  : null;

                return (
                  <div
                    key={pr.id}
                    className={`p-3 rounded-2xl border text-xs flex items-center justify-between ${
                      pr.anulado
                        ? 'bg-slate-800/30 border-slate-800 opacity-50 line-through'
                        : 'bg-slate-800/60 border-slate-700'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-amber-300">
                          {reto?.nombre || 'Reto'}
                        </span>
                        <span className="text-slate-400">• Puesto #{pr.posicion}</span>
                      </div>
                      <span className="text-slate-300">
                        Otorgado a: <strong className="text-white">{gt?.nombre}</strong>{' '}
                        {persona ? `(${persona.nombreCompleto})` : '(Grupal)'}
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-amber-400 font-bold text-sm">
                        +{pr.puntosOtorgados} pts
                      </span>
                      {!pr.anulado && (
                        <button
                          onClick={() => {
                            if (window.confirm('¿Anular esta asignación de reto?')) {
                              anularParticipacionReto(pr.id);
                              showFeedback('Puntos anulados.');
                            }
                          }}
                          className="text-red-400 hover:text-red-300 p-1"
                          title="Anular"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB: FACTORES DE TAMAÑO                                                   */}
      {/* ========================================================================= */}
      {activeAdminTab === 'factores' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-5">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Scale className="w-5 h-5 text-amber-400" />
              Configuración Dinámica de Factores de Tamaño
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Modifica los multiplicadores utilizados para equilibrar los puntos de los Grupos de Trabajo (GTs)
              según su número de integrantes.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {factores.map((f) => (
              <div
                key={f.id}
                className="p-5 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-3"
              >
                <div className="flex justify-between items-center">
                  <span className="text-xs uppercase font-bold text-amber-400">
                    {f.minIntegrantes} a {f.maxIntegrantes ?? 'más'} integrantes
                  </span>
                  <span className="text-lg font-black text-white">
                    {f.factor}x
                  </span>
                </div>

                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">
                    Multiplicador (Factor):
                  </label>
                  <input
                    type="number"
                    step="0.05"
                    min="0.5"
                    max="2.5"
                    value={f.factor}
                    onChange={(e) =>
                      actualizarFactor(f.id, Number(e.target.value))
                    }
                    className="w-full bg-slate-900 text-amber-300 font-bold text-sm p-2 rounded-xl border border-slate-700 text-center"
                  />
                </div>

                <p className="text-[11px] text-slate-400">
                  {f.descripcion || 'Ponderación de equilibrio'}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB: INTEGRANTES (PERSONAS)                                               */}
      {/* ========================================================================= */}
      {activeAdminTab === 'personas' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Users className="w-5 h-5 text-indigo-400" />
                Administración de Integrantes ({personas.length})
              </h3>
              <p className="text-xs text-slate-400">
                Cambio de GT, altas, bajas y activación
              </p>
            </div>

            {/* Quick add person form */}
            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Nombre completo..."
                value={newPersonaNombre}
                onChange={(e) => setNewPersonaNombre(e.target.value)}
                className="bg-slate-800 text-xs text-white px-3 py-2 rounded-xl border border-slate-700"
              />
              <select
                value={newPersonaGtId}
                onChange={(e) => setNewPersonaGtId(e.target.value)}
                className="bg-slate-800 text-xs text-slate-200 px-2.5 py-2 rounded-xl border border-slate-700"
              >
                {gts.map((gt) => (
                  <option key={gt.id} value={gt.id}>
                    {gt.nombre}
                  </option>
                ))}
              </select>
              <button
                onClick={() => {
                  if (newPersonaNombre.trim()) {
                    crearPersona({
                      nombreCompleto: newPersonaNombre.trim(),
                      gtId: newPersonaGtId,
                      activo: true,
                    });
                    setNewPersonaNombre('');
                    showFeedback('Integrante creado.');
                  }
                }}
                className="px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shrink-0"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="max-h-96 overflow-y-auto divide-y divide-slate-800">
            {personas.map((p) => {
              const gt = gts.find((g) => g.id === p.gtId);

              return (
                <div
                  key={p.id}
                  className="py-3 flex items-center justify-between gap-3 text-xs"
                >
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-2 h-2 rounded-full ${
                        p.activo ? 'bg-emerald-400' : 'bg-red-400'
                      }`}
                    />
                    <span className="font-semibold text-white">
                      {p.nombreCompleto}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* GT Switcher */}
                    <select
                      value={p.gtId}
                      onChange={(e) => cambiarGtPersona(p.id, e.target.value)}
                      className="bg-slate-800 text-xs text-slate-300 border border-slate-700 rounded-lg px-2 py-1"
                    >
                      {gts.map((gtItem) => (
                        <option key={gtItem.id} value={gtItem.id}>
                          {gtItem.nombre}
                        </option>
                      ))}
                    </select>

                    <button
                      onClick={() => togglePersonaActiva(p.id)}
                      className={`px-2 py-1 rounded text-[10px] font-bold ${
                        p.activo
                          ? 'bg-emerald-500/20 text-emerald-300'
                          : 'bg-red-500/20 text-red-300'
                      }`}
                    >
                      {p.activo ? 'Activo' : 'Inactivo'}
                    </button>

                    <button
                      onClick={() => {
                        if (window.confirm(`¿Eliminar a ${p.nombreCompleto}?`)) {
                          eliminarPersona(p.id);
                        }
                      }}
                      className="p-1 text-slate-500 hover:text-red-400"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB: AUDITORÍA & CORRECCIÓN DE PUNTOS                                      */}
      {/* ========================================================================= */}
      {activeAdminTab === 'auditoria' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-6">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <FileText className="w-5 h-5 text-indigo-400" />
              Auditoría y Corrección de Registros (Trazabilidad)
            </h3>
            <p className="text-xs text-slate-400">
              Visualiza cada registro de asistencia y anula si hubo un error sin borrar el historial
            </p>
          </div>

          <div className="space-y-2 max-h-96 overflow-y-auto">
            {asistencias.map((a) => {
              const p = personas.find((item) => item.id === a.personaId);
              const gt = gts.find((item) => item.id === a.gtId);
              const e = eventos.find((item) => item.id === a.eventoId);

              return (
                <div
                  key={a.id}
                  className={`p-3 rounded-2xl border text-xs flex items-center justify-between ${
                    a.anulado
                      ? 'bg-red-950/20 border-red-900/40 opacity-60'
                      : 'bg-slate-800/40 border-slate-800'
                  }`}
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white">
                        {p?.nombreCompleto || 'Persona'}
                      </span>
                      <span className="text-amber-400 font-medium">
                        ({gt?.nombre})
                      </span>
                      {a.anulado && (
                        <span className="text-[10px] bg-red-500/20 text-red-300 px-1.5 py-0.5 rounded font-bold">
                          ANULADO: {a.anuladoMotivo}
                        </span>
                      )}
                    </div>
                    <span className="text-slate-400 text-[11px]">
                      {e?.nombre} • Origen: {a.origen} • {new Date(a.fechaRegistro).toLocaleString()}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="font-bold text-emerald-400">
                      +{a.puntosOtorgados} pts
                    </span>
                    {!a.anulado && (
                      <button
                        onClick={() => {
                          const motivo = window.prompt(
                            'Ingresa el motivo de la anulación para la auditoría:'
                          );
                          if (motivo) {
                            anularAsistencia(a.id, motivo);
                            showFeedback('Asistencia anulada con registro en auditoría.');
                          }
                        }}
                        className="px-2 py-1 bg-red-600/20 hover:bg-red-600 text-red-300 hover:text-white rounded text-[10px] font-bold"
                      >
                        Anular
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Audit Logs Trail */}
          <div className="pt-4 border-t border-slate-800">
            <h4 className="text-xs uppercase font-bold text-slate-400 mb-2">
              Bitácora de Eventos de Seguridad (Audit Logs)
            </h4>
            <div className="space-y-1.5 max-h-48 overflow-y-auto font-mono text-[11px]">
              {auditLogs.slice(0, 15).map((log) => (
                <div
                  key={log.id}
                  className="p-2 bg-slate-950/60 rounded border border-slate-800 flex justify-between"
                >
                  <span className="text-amber-400">{log.accion}:</span>
                  <span className="text-slate-300 truncate max-w-md">{log.detalles}</span>
                  <span className="text-slate-500 shrink-0">
                    {new Date(log.fecha).toLocaleTimeString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB: SUPABASE & PRODUCCIÓN                                                */}
      {/* ========================================================================= */}
      {activeAdminTab === 'datos' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-5">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Database className="w-5 h-5 text-emerald-400" />
              Integración Supabase, PostgreSQL y Vercel
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Scripts SQL listos para producción, configuración de Row Level Security (RLS) y variables de entorno.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700 text-xs space-y-2">
              <span className="font-bold text-white block">Archivo de Schema SQL:</span>
              <p className="text-slate-400">
                Ubicado en <code className="bg-slate-900 px-2 py-0.5 rounded text-amber-300">/supabase/schema.sql</code> con
                tablas para temporadas, gts, personas, eventos, turnos, asistencias con restricción UNIQUE anti-duplicados, retos y auditoría.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700 text-xs space-y-2">
              <span className="font-bold text-white block">Seed de Datos Iniciales:</span>
              <p className="text-slate-400">
                Ubicado en <code className="bg-slate-900 px-2 py-0.5 rounded text-amber-300">/supabase/seed.sql</code> con
                los 9 GTs de DIAS, factores de tamaño y eventos de prueba.
              </p>
            </div>
          </div>

          {/* Clean test data for real production button */}
          <div className="p-4 bg-red-950/30 border border-red-800/50 rounded-2xl flex items-center justify-between gap-4">
            <div>
              <span className="font-bold text-red-200 text-xs block">
                Modo Producción: Limpieza de Datos de Prueba
              </span>
              <span className="text-[11px] text-red-300/70">
                Limpia todas las asistencias y personas de prueba para empezar la temporada con datos 100% reales.
              </span>
            </div>
            <button
              onClick={() => {
                if (window.confirm('¿Seguro que deseas limpiar las personas y asistencias de prueba?')) {
                  limpiarTodosLosDatos();
                  showFeedback('Datos de prueba eliminados. Sistema limpio para producción.');
                }
              }}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl shrink-0"
            >
              Limpiar Datos de Prueba
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB: TEMPORADAS                                                           */}
      {/* ========================================================================= */}
      {activeAdminTab === 'temporadas' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Clock className="w-5 h-5 text-amber-400" />
                Temporadas de la DIAS League
              </h3>
              <p className="text-xs text-slate-400">
                Solo una temporada debe estar activa a la vez para recibir registros
              </p>
            </div>

            {/* Quick create season */}
            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Ej: Temporada 2027-1"
                value={newTempName}
                onChange={(e) => setNewTempName(e.target.value)}
                className="bg-slate-800 text-xs text-white p-2 rounded-xl border border-slate-700"
              />
              <button
                onClick={() => {
                  if (newTempName.trim()) {
                    crearTemporada({
                      nombre: newTempName.trim(),
                      activa: false,
                      fechaInicio: newTempStart,
                      fechaFin: newTempEnd,
                    });
                    setNewTempName('');
                    showFeedback('Nueva temporada creada.');
                  }
                }}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl"
              >
                Crear Temporada
              </button>
            </div>
          </div>

          <div className="space-y-3">
            {temporadas.map((t) => (
              <div
                key={t.id}
                className="p-4 rounded-2xl bg-slate-800/50 border border-slate-700 flex items-center justify-between"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white">{t.nombre}</span>
                    {t.activa && (
                      <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2 py-0.5 rounded font-bold">
                        ★ ACTIVA ACTUAL
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-slate-400">
                    {t.fechaInicio} hasta {t.fechaFin}
                  </span>
                </div>

                {!t.activa && (
                  <button
                    onClick={() => {
                      activarTemporada(t.id);
                      showFeedback(`Se activó ${t.nombre}.`);
                    }}
                    className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl"
                  >
                    Activar esta Temporada
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB: GRUPOS DE TRABAJO (GT)                                               */}
      {/* ========================================================================= */}
      {activeAdminTab === 'gts' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-5">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-400" />
            Configuración de los 9 Grupos de Trabajo (GTs)
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {gts.map((gt) => (
              <div
                key={gt.id}
                className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700 flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-black text-sm shadow"
                    style={{ backgroundColor: gt.color }}
                  >
                    {gt.codigo}
                  </div>
                  <div>
                    <span className="font-bold text-white text-sm block">
                      {gt.nombre}
                    </span>
                    <span className="text-[11px] text-slate-400">
                      {gt.descripcion || 'Grupo de Trabajo'}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => toggleGtActivo(gt.id)}
                  className={`text-[10px] font-bold px-2 py-1 rounded ${
                    gt.activo
                      ? 'bg-emerald-500/20 text-emerald-300'
                      : 'bg-red-500/20 text-red-300'
                  }`}
                >
                  {gt.activo ? 'Activo' : 'Inactivo'}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
