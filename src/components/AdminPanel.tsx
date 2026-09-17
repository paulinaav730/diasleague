import React, { useState } from 'react';
import { useApp } from '../lib/store';
import { Evento } from '../types';
import { ExcelImportSection } from './admin/ExcelImportSection';
import { ManualPointsSection } from './admin/ManualPointsSection';
import { GtAttendanceSizeSection } from './admin/GtAttendanceSizeSection';
import { ConectadoDetalleModal } from './ConectadoDetalleModal';
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
  Pencil,
  Plus,
  Check,
  X,
  Lock,
  Unlock,
  CheckCircle2,
  Database,
  ExternalLink,
  FileSpreadsheet,
  Award,
  LogOut,
  Tv,
} from 'lucide-react';

type AdminTab =
  | 'asistencia_gt'
  | 'eventos_turnos'
  | 'retos'
  | 'importar_personas'
  | 'registrar_puntos'
  | 'personas'
  | 'factores'
  | 'gts'
  | 'temporadas'
  | 'auditoria'
  | 'datos';

const PRESET_HORARIOS = [
  { label: '08:00 AM - 10:00 AM', inicio: '08:00 AM', fin: '10:00 AM' },
  { label: '10:00 AM - 12:00 PM', inicio: '10:00 AM', fin: '12:00 PM' },
  { label: '12:00 PM - 02:00 PM', inicio: '12:00 PM', fin: '02:00 PM' },
  { label: '02:00 PM - 04:00 PM', inicio: '02:00 PM', fin: '04:00 PM' },
  { label: '04:00 PM - 06:00 PM', inicio: '04:00 PM', fin: '06:00 PM' },
  { label: '06:00 PM - 08:00 PM', inicio: '06:00 PM', fin: '08:00 PM' },
];

interface AdminPanelProps {
  onOpenQrProjector?: (eventoId: string, turnoId?: string) => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ onOpenQrProjector }) => {
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
    factorBase,
    setFactorBase,
    modoRanking,
    setModoRanking,
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
    eliminarEvento,
    cambiarEstadoEvento,
    crearTurno,
    actualizarTurno,
    activarTurno,
    cerrarTurno,
    eliminarTurno,
    crearReto,
    actualizarReto,
    eliminarReto,
    actualizarParticipacionReto,
    eliminarParticipacionReto,
    asignarGanadorReto,
    actualizarFactor,
    actualizarRangoFactor,
    anularAsistencia,
    anularParticipacionReto,
    restablecerDatosPrueba,
    limpiarTodosLosDatos,
    limpiarDatosPrueba,
    logoutAdmin,
    setActiveTab,
  } = useApp();

  const [activeAdminTab, setActiveAdminTab] = useState<AdminTab>('asistencia_gt');

  // Selected Conectado Modal for deep inspection/scoring
  const [selectedConectadoModalId, setSelectedConectadoModalId] = useState<string | null>(null);

  // New Event Modal State
  const [showCreateEventoModal, setShowCreateEventoModal] = useState(false);
  const [newEventoNombre, setNewEventoNombre] = useState('');
  const [newEventoDesc, setNewEventoDesc] = useState('');
  const [newEventoFecha, setNewEventoFecha] = useState(new Date().toISOString().split('T')[0]);
  const [newEventoPuntos, setNewEventoPuntos] = useState(15);
  const [newEventoTipo, setNewEventoTipo] = useState<Evento['tipoEvento']>('conectado');
  const [newEventoUsaQr, setNewEventoUsaQr] = useState(true);
  const [newEventoUsaTurnos, setNewEventoUsaTurnos] = useState(false);

  // New Reto Modal State (High points by default)
  const [showCreateRetoModal, setShowCreateRetoModal] = useState(false);
  const [newRetoEventoId, setNewRetoEventoId] = useState('');
  const [newRetoNombre, setNewRetoNombre] = useState('');
  const [newRetoDesc, setNewRetoDesc] = useState('');
  const [newRetoPuntos, setNewRetoPuntos] = useState(100);
  const [newRetoTipo, setNewRetoTipo] = useState<'grupal' | 'individual'>('grupal');

  // Reto editing state
  const [editingRetoId, setEditingRetoId] = useState<string | null>(null);
  const [editRetoNombre, setEditRetoNombre] = useState('');
  const [editRetoPuntos, setEditRetoPuntos] = useState(25);
  const [editRetoRetroactivo, setEditRetoRetroactivo] = useState(true);

  // Participation points editing state
  const [editingPrId, setEditingPrId] = useState<string | null>(null);
  const [editPrPuntos, setEditPrPuntos] = useState<number>(25);

  // Turno (shift) editing and creation state
  const [editingTurnoId, setEditingTurnoId] = useState<string | null>(null);
  const [editTurnoNombre, setEditTurnoNombre] = useState('');
  const [editTurnoHoraInicio, setEditTurnoHoraInicio] = useState('');
  const [editTurnoHoraFin, setEditTurnoHoraFin] = useState('');

  const [showAddTurnoModal, setShowAddTurnoModal] = useState(false);
  const [addTurnoEventoId, setAddTurnoEventoId] = useState<string | null>(null);
  const [newTurnoNombre, setNewTurnoNombre] = useState('');
  const [newTurnoHoraInicio, setNewTurnoHoraInicio] = useState('08:00 AM');
  const [newTurnoHoraFin, setNewTurnoHoraFin] = useState('10:00 AM');

  // Season creation state
  const [newTempName, setNewTempName] = useState('');
  const [newTempStart, setNewTempStart] = useState('2027-02-01');
  const [newTempEnd, setNewTempEnd] = useState('2027-06-30');

  // Person creation state
  const [newPersonaNombre, setNewPersonaNombre] = useState('');
  const [newPersonaGtId, setNewPersonaGtId] = useState(gts[0]?.id || '');
  const [personaFilterText, setPersonaFilterText] = useState('');

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
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={async () => {
                if (
                  window.confirm(
                    '¿Deseas realizar la limpieza de datos de prueba?\n\nEsta acción eliminará todas las personas, asistencias y participaciones de prueba para que puedas cargar los datos reales.\n\nLos GTs, eventos, temporadas, retos y factores permanecerán INTACTOS.'
                  )
                ) {
                  await limpiarDatosPrueba();
                  showFeedback('¡Limpieza completada! Personas y puntos en 0. GTs y eventos preservados.');
                }
              }}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-rose-950/40 hover:bg-rose-900/60 border border-rose-500/40 text-xs text-rose-300 font-bold transition-colors cursor-pointer"
              title="Elimina datos de prueba y deja personas y puntos en 0"
            >
              <Trash2 className="w-3.5 h-3.5 text-rose-400" />
              Limpieza Datos de Prueba
            </button>

            <button
              onClick={() => {
                if (window.confirm('¿Deseas restaurar todos los datos de prueba iniciales de la Organización Estudiantil DIAS EAFIT?')) {
                  restablecerDatosPrueba();
                  showFeedback('¡Datos iniciales de prueba restaurados con éxito!');
                }
              }}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs text-amber-300 font-bold transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Restablecer Datos EAFIT
            </button>

            <button
              id="btn-admin-panel-lock"
              onClick={() => {
                logoutAdmin();
                setActiveTab('dashboard');
              }}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-purple-950/60 hover:bg-purple-900/80 border border-purple-500/40 text-xs text-purple-200 hover:text-white font-bold transition-colors cursor-pointer"
              title="Cerrar sesión de administrador y bloquear el panel"
            >
              <LogOut className="w-3.5 h-3.5 text-purple-300" />
              <span>Bloquear / Salir</span>
            </button>
          </div>
        </div>

        {/* Feedback Alert */}
        {feedbackMsg && (
          <div className="mt-4 p-3 bg-emerald-950/60 border border-emerald-500/50 rounded-xl text-xs text-emerald-300 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{feedbackMsg}</span>
          </div>
        )}

        {/* Secondary Admin Navigation Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pt-6 border-t border-slate-800/80 mt-6 text-xs font-semibold">
          <button
            onClick={() => setActiveAdminTab('asistencia_gt')}
            className={`px-3.5 py-2 rounded-xl whitespace-nowrap transition-colors flex items-center gap-1.5 cursor-pointer ${
              activeAdminTab === 'asistencia_gt'
                ? 'bg-amber-600 text-white shadow ring-2 ring-amber-400/50'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Users className="w-3.5 h-3.5 text-amber-400" />
            <span>Asistencia x Tamaño GT</span>
          </button>

          <button
            onClick={() => setActiveAdminTab('eventos_turnos')}
            className={`px-3.5 py-2 rounded-xl whitespace-nowrap transition-colors flex items-center gap-1.5 cursor-pointer ${
              activeAdminTab === 'eventos_turnos'
                ? 'bg-indigo-600 text-white shadow ring-2 ring-indigo-400/50'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Eventos & Conectados ({eventos.length})</span>
          </button>

          <button
            onClick={() => setActiveAdminTab('retos')}
            className={`px-3.5 py-2 rounded-xl whitespace-nowrap transition-colors flex items-center gap-1.5 cursor-pointer ${
              activeAdminTab === 'retos'
                ? 'bg-purple-600 text-white shadow ring-2 ring-purple-400/50'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-purple-300" />
            <span>Retos & Desafíos ({retos.length})</span>
          </button>

          <button
            onClick={() => setActiveAdminTab('importar_personas')}
            className={`px-3.5 py-2 rounded-xl whitespace-nowrap transition-colors flex items-center gap-1.5 cursor-pointer ${
              activeAdminTab === 'importar_personas'
                ? 'bg-emerald-600 text-white shadow'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>Importar personas (Excel)</span>
          </button>

          <button
            onClick={() => setActiveAdminTab('registrar_puntos')}
            className={`px-3.5 py-2 rounded-xl whitespace-nowrap transition-colors flex items-center gap-1.5 cursor-pointer ${
              activeAdminTab === 'registrar_puntos'
                ? 'bg-amber-600 text-white shadow'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            <span>Registrar puntos</span>
          </button>

          <button
            onClick={() => setActiveAdminTab('personas')}
            className={`px-3.5 py-2 rounded-xl whitespace-nowrap transition-colors flex items-center gap-1.5 cursor-pointer ${
              activeAdminTab === 'personas'
                ? 'bg-purple-600 text-white shadow'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Integrantes ({personas.length})</span>
          </button>

          <button
            onClick={() => setActiveAdminTab('factores')}
            className={`px-3.5 py-2 rounded-xl whitespace-nowrap transition-colors flex items-center gap-1.5 cursor-pointer ${
              activeAdminTab === 'factores'
                ? 'bg-purple-600 text-white shadow'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Scale className="w-3.5 h-3.5" />
            <span>Factores de Tamaño</span>
          </button>

          <button
            onClick={() => setActiveAdminTab('gts')}
            className={`px-3.5 py-2 rounded-xl whitespace-nowrap transition-colors flex items-center gap-1.5 cursor-pointer ${
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
            className={`px-3.5 py-2 rounded-xl whitespace-nowrap transition-colors flex items-center gap-1.5 cursor-pointer ${
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
            className={`px-3.5 py-2 rounded-xl whitespace-nowrap transition-colors flex items-center gap-1.5 cursor-pointer ${
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
            className={`px-3.5 py-2 rounded-xl whitespace-nowrap transition-colors flex items-center gap-1.5 cursor-pointer ${
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
      {/* TAB: ASISTENCIA X TAMAÑO DE GT (PONDERACIÓN JUSTA)                        */}
      {/* ========================================================================= */}
      {activeAdminTab === 'asistencia_gt' && <GtAttendanceSizeSection />}

      {/* ========================================================================= */}
      {/* TAB: IMPORTAR PERSONAS (EXCEL MAESTRO)                                     */}
      {/* ========================================================================= */}
      {activeAdminTab === 'importar_personas' && (
        <ExcelImportSection onSuccess={() => setActiveAdminTab('personas')} />
      )}

      {/* ========================================================================= */}
      {/* TAB: REGISTRAR PUNTOS                                                     */}
      {/* ========================================================================= */}
      {activeAdminTab === 'registrar_puntos' && <ManualPointsSection />}

      {/* ========================================================================= */}
      {/* TAB: EVENTOS & TURNOS QR                                                  */}
      {/* ========================================================================= */}
      {activeAdminTab === 'eventos_turnos' && (
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-indigo-400" />
                  Gestión de Eventos y Configuración de Puntos
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Crea, gestiona o elimina eventos y Conectados. Cada evento contiene sus retos internos y asistencias.
                </p>
              </div>

              <button
                onClick={() => setShowCreateEventoModal(true)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 shrink-0 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Crear Nuevo Evento / Conectado</span>
              </button>
            </div>

            <div className="divide-y divide-slate-800">
              {eventos.map((e) => {
                const eventoTurnos = turnos.filter((t) => t.eventoId === e.id);
                const retosDelEvento = retos.filter((r) => r.eventoId === e.id);

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
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-500/15 text-purple-300 border border-purple-500/30">
                            {retosDelEvento.length} retos
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 mt-0.5">{e.descripcion}</p>
                      </div>

                      {/* State and Points changer */}
                      <div className="flex flex-wrap items-center gap-2">
                        <div className="flex items-center gap-1.5 text-xs text-slate-300 bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-700">
                          <span className="font-semibold text-slate-300">Puntos Asist:</span>
                          <input
                            type="number"
                            min="0"
                            step="5"
                            value={e.puntosAsistencia}
                            onChange={(ev) => {
                              const newVal = Number(ev.target.value);
                              actualizarEvento(e.id, {
                                puntosAsistencia: newVal,
                              });
                            }}
                            className="w-16 bg-slate-900 text-amber-300 font-extrabold px-1.5 py-0.5 rounded border border-slate-700 text-right"
                          />
                          <button
                            onClick={() => {
                              actualizarEvento(
                                e.id,
                                { puntosAsistencia: Number(e.puntosAsistencia) },
                                true
                              );
                              showFeedback(`Puntos de ${e.nombre} recalculados retroactivamente en todas sus asistencias.`);
                            }}
                            className="text-[10px] px-2 py-0.5 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30 font-bold"
                            title="Actualizar y recalcular el nuevo puntaje para todas las asistencias históricas ya registradas en este evento"
                          >
                            Recalcular Todas
                          </button>
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

                        <button
                          type="button"
                          onClick={() => {
                            actualizarEvento(e.id, { utilizaTurnos: !e.utilizaTurnos });
                            showFeedback(
                              e.utilizaTurnos
                                ? `Turnos deshabilitados para ${e.nombre}`
                                : `Turnos habilitados para ${e.nombre}. Ahora puedes configurar sus horarios.`
                            );
                          }}
                          className={`px-2.5 py-1.5 rounded-xl text-xs font-bold border transition-colors cursor-pointer flex items-center gap-1.5 ${
                            e.utilizaTurnos
                              ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 hover:bg-amber-500/30'
                              : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'
                          }`}
                          title="Habilitar o deshabilitar múltiples turnos horarios para este evento"
                        >
                          <Clock className="w-3.5 h-3.5" />
                          <span>{e.utilizaTurnos ? 'Con Turnos' : '+ Turnos'}</span>
                        </button>

                        {onOpenQrProjector && (
                          <button
                            type="button"
                            onClick={() => onOpenQrProjector(e.id)}
                            className="px-2.5 py-1.5 rounded-xl bg-amber-600/90 hover:bg-amber-500 text-white font-bold text-xs flex items-center gap-1 shadow cursor-pointer transition-colors"
                            title="Proyectar QR en pantalla para este evento"
                          >
                            <Tv className="w-3.5 h-3.5" />
                            <span>Proyectar QR</span>
                          </button>
                        )}

                        <button
                          onClick={() => setSelectedConectadoModalId(e.id)}
                          className="px-3 py-1.5 rounded-xl bg-purple-600/80 hover:bg-purple-600 text-white font-bold text-xs flex items-center gap-1 shadow cursor-pointer"
                          title="Gestionar retos internos y calificar Conectado"
                        >
                          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                          <span>Retos & Detalle</span>
                        </button>

                        <button
                          onClick={() => {
                            if (
                              window.confirm(
                                `¿Eliminar el evento "${e.nombre}"?\n\nEsta acción eliminará el evento, todos sus turnos, sus asistencias y TODOS los retos y puntos vinculados a este evento.`
                              )
                            ) {
                              eliminarEvento(e.id);
                              showFeedback(`Evento "${e.nombre}" eliminado correctamente.`);
                            }
                          }}
                          className="p-2 rounded-xl bg-red-950/40 hover:bg-red-900 border border-red-800 text-red-400 hover:text-white transition-colors cursor-pointer"
                          title="Eliminar este evento y sus retos asociados"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Shifts (Turnos) within this Event */}
                    {e.utilizaTurnos && (
                      <div className="pl-4 border-l-2 border-amber-500/30 space-y-3 mt-3">
                        <div className="flex items-center justify-between">
                          <span className="text-xs uppercase font-bold text-amber-400 flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5" />
                            Turnos y Horarios de {e.nombre} ({eventoTurnos.length})
                          </span>
                          <button
                            type="button"
                            onClick={() => {
                              const turnoNum = eventoTurnos.length + 1;
                              let defaultInicio = '08:00 AM';
                              let defaultFin = '10:00 AM';
                              if (eventoTurnos.length > 0) {
                                const lastTurno = eventoTurnos[eventoTurnos.length - 1];
                                if (lastTurno.horaFin) {
                                  defaultInicio = lastTurno.horaFin;
                                  const match = PRESET_HORARIOS.find((p) => p.inicio === lastTurno.horaFin);
                                  defaultFin = match ? match.fin : '12:00 PM';
                                }
                              }
                              setAddTurnoEventoId(e.id);
                              setNewTurnoNombre(`Turno ${turnoNum}`);
                              setNewTurnoHoraInicio(defaultInicio);
                              setNewTurnoHoraFin(defaultFin);
                              setShowAddTurnoModal(true);
                            }}
                            className="text-xs text-amber-300 hover:text-amber-200 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/40 px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 cursor-pointer transition-all shadow"
                          >
                            <Plus className="w-3.5 h-3.5" /> Agregar Turno
                          </button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                          {eventoTurnos.map((t) => {
                            const isEditing = editingTurnoId === t.id;

                            if (isEditing) {
                              return (
                                <div
                                  key={t.id}
                                  className="p-3.5 rounded-2xl border-2 border-amber-500/80 bg-slate-900 shadow-xl space-y-3 text-xs"
                                >
                                  <div className="flex items-center justify-between pb-1.5 border-b border-slate-800">
                                    <span className="font-extrabold text-amber-300 flex items-center gap-1.5">
                                      <Pencil className="w-3.5 h-3.5" /> Modificar Horario
                                    </span>
                                    <button
                                      type="button"
                                      onClick={() => setEditingTurnoId(null)}
                                      className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 cursor-pointer"
                                    >
                                      <X className="w-3.5 h-3.5" />
                                    </button>
                                  </div>

                                  {/* Nombre input */}
                                  <div>
                                    <label className="block text-[11px] font-bold text-slate-300 mb-1">
                                      Nombre del Turno:
                                    </label>
                                    <input
                                      type="text"
                                      value={editTurnoNombre}
                                      onChange={(ev) => setEditTurnoNombre(ev.target.value)}
                                      className="w-full bg-slate-800 text-white font-bold px-2.5 py-1.5 rounded-lg border border-slate-700 text-xs focus:ring-2 focus:ring-amber-500"
                                      placeholder="Ej: Turno 1"
                                    />
                                  </div>

                                  {/* Horas Inicio y Fin */}
                                  <div className="grid grid-cols-2 gap-2">
                                    <div>
                                      <label className="block text-[10px] font-bold text-slate-400 mb-1">
                                        Hora Inicio:
                                      </label>
                                      <input
                                        type="text"
                                        value={editTurnoHoraInicio}
                                        onChange={(ev) => setEditTurnoHoraInicio(ev.target.value)}
                                        className="w-full bg-slate-800 text-amber-300 font-extrabold px-2 py-1.5 rounded-lg border border-slate-700 text-xs text-center focus:ring-2 focus:ring-amber-500"
                                        placeholder="08:00 AM"
                                      />
                                    </div>
                                    <div>
                                      <label className="block text-[10px] font-bold text-slate-400 mb-1">
                                        Hora Fin:
                                      </label>
                                      <input
                                        type="text"
                                        value={editTurnoHoraFin}
                                        onChange={(ev) => setEditTurnoHoraFin(ev.target.value)}
                                        className="w-full bg-slate-800 text-amber-300 font-extrabold px-2 py-1.5 rounded-lg border border-slate-700 text-xs text-center focus:ring-2 focus:ring-amber-500"
                                        placeholder="10:00 AM"
                                      />
                                    </div>
                                  </div>

                                  {/* Quick Presets */}
                                  <div>
                                    <span className="text-[10px] text-slate-400 font-semibold block mb-1">
                                      Horarios sugeridos (1 clic):
                                    </span>
                                    <div className="flex flex-wrap gap-1">
                                      {PRESET_HORARIOS.map((p) => (
                                        <button
                                          key={p.label}
                                          type="button"
                                          onClick={() => {
                                            setEditTurnoHoraInicio(p.inicio);
                                            setEditTurnoHoraFin(p.fin);
                                          }}
                                          className={`text-[9px] px-1.5 py-0.5 rounded font-bold transition-colors cursor-pointer ${
                                            editTurnoHoraInicio === p.inicio && editTurnoHoraFin === p.fin
                                              ? 'bg-amber-500 text-slate-950 font-black shadow'
                                              : 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700/60'
                                          }`}
                                        >
                                          {p.inicio.replace(':00', '')} - {p.fin.replace(':00', '')}
                                        </button>
                                      ))}
                                    </div>
                                  </div>

                                  {/* Save & Cancel */}
                                  <div className="pt-2 border-t border-slate-800 flex items-center justify-between gap-1.5">
                                    <button
                                      type="button"
                                      onClick={() => {
                                        if (window.confirm(`¿Eliminar el "${t.nombre}"?`)) {
                                          eliminarTurno(t.id);
                                          setEditingTurnoId(null);
                                          showFeedback(`Turno "${t.nombre}" eliminado.`);
                                        }
                                      }}
                                      className="p-1.5 rounded-lg bg-red-950/50 hover:bg-red-900/80 text-red-400 border border-red-800/80 text-xs cursor-pointer"
                                      title="Eliminar este turno"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>

                                    <div className="flex items-center gap-1.5">
                                      <button
                                        type="button"
                                        onClick={() => setEditingTurnoId(null)}
                                        className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs cursor-pointer"
                                      >
                                        Cancelar
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() => {
                                          const nuevoNombre = editTurnoNombre.trim() || t.nombre;
                                          const nuevaInicio = editTurnoHoraInicio.trim() || t.horaInicio;
                                          const nuevaFin = editTurnoHoraFin.trim() || t.horaFin;
                                          actualizarTurno(t.id, {
                                            nombre: nuevoNombre,
                                            horaInicio: nuevaInicio,
                                            horaFin: nuevaFin,
                                          });
                                          setEditingTurnoId(null);
                                          showFeedback(`¡Horario actualizado! ${nuevoNombre}: ${nuevaInicio} - ${nuevaFin}`);
                                        }}
                                        className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1 shadow cursor-pointer"
                                      >
                                        <Check className="w-3 h-3" /> Guardar
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              );
                            }

                            return (
                              <div
                                key={t.id}
                                className={`p-3.5 rounded-2xl border text-xs flex flex-col justify-between transition-all ${
                                  t.activo
                                    ? 'bg-emerald-950/30 border-emerald-500/50 shadow-lg shadow-emerald-950/20'
                                    : 'bg-slate-850/90 border-slate-800 hover:border-slate-700'
                                }`}
                              >
                                <div>
                                  <div className="flex justify-between items-start mb-2">
                                    <span className="font-bold text-white text-sm">{t.nombre}</span>
                                    <span
                                      className={`text-[10px] px-2 py-0.5 rounded-full font-extrabold ${
                                        t.activo
                                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                                          : 'bg-slate-800 text-slate-400 border border-slate-700'
                                      }`}
                                    >
                                      {t.activo ? 'QR Activo' : 'Cerrado'}
                                    </span>
                                  </div>

                                  {/* Prominent Hours Display */}
                                  <div className="flex items-center gap-2 text-amber-300 font-extrabold bg-slate-900/90 px-3 py-2 rounded-xl border border-slate-800 mb-3">
                                    <Clock className="w-4 h-4 text-amber-400 shrink-0" />
                                    <span className="tracking-wide text-xs">
                                      {t.horaInicio} - {t.horaFin}
                                    </span>
                                  </div>
                                </div>

                                {/* Actions Toolbar */}
                                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between gap-1.5">
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setEditingTurnoId(t.id);
                                      setEditTurnoNombre(t.nombre);
                                      setEditTurnoHoraInicio(t.horaInicio);
                                      setEditTurnoHoraFin(t.horaFin);
                                    }}
                                    className="px-2.5 py-1.5 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 hover:text-amber-200 rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors"
                                    title="Modificar nombre y horarios de este turno"
                                  >
                                    <Pencil className="w-3 h-3" /> Editar
                                  </button>

                                  <div className="flex items-center gap-1.5">
                                    {onOpenQrProjector && (
                                      <button
                                        type="button"
                                        onClick={() => onOpenQrProjector(e.id, t.id)}
                                        className="px-2 py-1 bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 rounded-lg text-[10px] font-bold flex items-center gap-1 cursor-pointer transition-colors"
                                        title="Proyectar QR específico de este turno"
                                      >
                                        <Tv className="w-3 h-3" /> Proyectar
                                      </button>
                                    )}

                                    {t.activo ? (
                                      <button
                                        type="button"
                                        onClick={() => {
                                          cerrarTurno(t.id);
                                          showFeedback(`QR de ${t.nombre} cerrado.`);
                                        }}
                                        className="px-2 py-1 bg-red-600/80 hover:bg-red-600 text-white rounded-lg text-[10px] font-bold flex items-center gap-1 cursor-pointer"
                                      >
                                        <Lock className="w-3 h-3" /> Cerrar QR
                                      </button>
                                    ) : (
                                      <button
                                        type="button"
                                        onClick={() => {
                                          activarTurno(t.id);
                                          showFeedback(`QR de ${t.nombre} activado.`);
                                        }}
                                        className="px-2 py-1 bg-emerald-600/80 hover:bg-emerald-600 text-white rounded-lg text-[10px] font-bold flex items-center gap-1 cursor-pointer"
                                      >
                                        <Unlock className="w-3 h-3" /> Abrir QR
                                      </button>
                                    )}

                                    <button
                                      type="button"
                                      onClick={() => {
                                        if (window.confirm(`¿Eliminar el turno "${t.nombre}"?`)) {
                                          eliminarTurno(t.id);
                                          showFeedback(`Turno "${t.nombre}" eliminado.`);
                                        }
                                      }}
                                      className="p-1 rounded-lg bg-slate-800 hover:bg-red-950/60 text-slate-400 hover:text-red-400 border border-slate-700/60 cursor-pointer"
                                      title="Eliminar turno"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
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
        <div className="space-y-6">
          {/* Section: Catálogo y Edición de Valores de Retos */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Award className="w-5 h-5 text-amber-400" />
                  Catálogo de Retos y Modificación de Valores
                </h3>
                <p className="text-xs text-slate-400">
                  Crea retos con valores altos (+50, +100, +200, +500 pts), edita sus puntos retroactivamente o elimínalos.
                </p>
              </div>

              <button
                onClick={() => {
                  setNewRetoEventoId(eventos[0]?.id || '');
                  setShowCreateRetoModal(true);
                }}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-lg shadow-purple-600/30 shrink-0 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Crear Nuevo Reto (+pts altos)</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 pt-2">
              {retos.map((r) => {
                const eventoRel = eventos.find((e) => e.id === r.eventoId);
                const isEditing = editingRetoId === r.id;

                return (
                  <div
                    key={r.id}
                    className="p-4 rounded-2xl bg-slate-850 border border-slate-800 flex flex-col justify-between gap-3"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <span className="text-[11px] font-bold text-slate-400 truncate">
                          {eventoRel?.nombre || 'Evento'}
                        </span>
                        <span className="text-xs font-black text-amber-400 bg-amber-500/15 border border-amber-500/30 px-2 py-0.5 rounded-md">
                          +{r.puntos} pts
                        </span>
                      </div>
                      <h4 className="font-extrabold text-white text-sm">{r.nombre}</h4>
                      {r.descripcion && (
                        <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                          {r.descripcion}
                        </p>
                      )}
                    </div>

                    {isEditing ? (
                      <div className="p-3 bg-slate-900 rounded-xl border border-amber-500/50 space-y-2.5 text-xs">
                        <div>
                          <label className="block text-[11px] font-bold text-slate-300 mb-1">
                            Nombre del Reto:
                          </label>
                          <input
                            type="text"
                            value={editRetoNombre}
                            onChange={(e) => setEditRetoNombre(e.target.value)}
                            className="w-full bg-slate-800 text-white px-2 py-1 rounded border border-slate-700 text-xs"
                          />
                        </div>

                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <label className="block text-[11px] font-bold text-slate-300">
                              Nuevo Valor (+pts):
                            </label>
                            <span className="text-[10px] text-amber-400 font-bold">Valores altos:</span>
                          </div>
                          <input
                            type="number"
                            min="1"
                            step="5"
                            value={editRetoPuntos}
                            onChange={(e) => setEditRetoPuntos(Number(e.target.value))}
                            className="w-full bg-slate-800 text-amber-300 font-extrabold px-2 py-1 rounded border border-slate-700 text-xs"
                          />
                          <div className="flex flex-wrap items-center gap-1 mt-1.5">
                            {[50, 100, 150, 200, 300, 500].map((val) => (
                              <button
                                key={val}
                                type="button"
                                onClick={() => setEditRetoPuntos(val)}
                                className={`px-1.5 py-0.5 rounded text-[10px] font-bold cursor-pointer ${
                                  editRetoPuntos === val
                                    ? 'bg-amber-500 text-slate-950 font-black'
                                    : 'bg-slate-800 text-amber-300 hover:bg-slate-700 border border-slate-700'
                                }`}
                              >
                                +{val}
                              </button>
                            ))}
                          </div>
                        </div>

                        <label className="flex items-start gap-2 cursor-pointer text-[11px] text-amber-300 bg-amber-500/10 p-2 rounded border border-amber-500/20">
                          <input
                            type="checkbox"
                            checked={editRetoRetroactivo}
                            onChange={(e) => setEditRetoRetroactivo(e.target.checked)}
                            className="rounded bg-slate-800 border-amber-400 text-amber-500 mt-0.5"
                          />
                          <span>Recalcular retroactivo a todos los ganadores ya registrados</span>
                        </label>

                        <div className="flex gap-2 pt-1">
                          <button
                            onClick={() => {
                              actualizarReto(
                                r.id,
                                {
                                  nombre: editRetoNombre.trim() || r.nombre,
                                  puntos: Number(editRetoPuntos),
                                },
                                editRetoRetroactivo
                              );
                              setEditingRetoId(null);
                              showFeedback(`Reto "${r.nombre}" actualizado a ${editRetoPuntos} pts.`);
                            }}
                            className="flex-1 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg text-xs"
                          >
                            Guardar
                          </button>
                          <button
                            onClick={() => setEditingRetoId(null)}
                            className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-lg text-xs"
                          >
                            Cancelar
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between pt-2 border-t border-slate-800">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              setEditingRetoId(r.id);
                              setEditRetoNombre(r.nombre);
                              setEditRetoPuntos(r.puntos);
                              setEditRetoRetroactivo(true);
                            }}
                            className="text-xs font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1 cursor-pointer"
                          >
                            <Edit2 className="w-3.5 h-3.5" /> Modificar
                          </button>

                          <button
                            onClick={() => {
                              if (
                                window.confirm(
                                  `¿Estás seguro de eliminar el reto "${r.nombre}"?\n\nSe eliminarán las participaciones y puntos asignados a los ganadores de este reto.`
                                )
                              ) {
                                eliminarReto(r.id);
                                showFeedback(`Reto "${r.nombre}" eliminado correctamente.`);
                              }
                            }}
                            className="p-1 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-950/40 border border-transparent hover:border-red-900 transition-colors cursor-pointer"
                            title="Eliminar este reto y sus puntos"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <span className="text-[11px] text-slate-500">
                          {participacionesRetos.filter((p) => p.retoId === r.id && !p.anulado).length} ganadores
                        </span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

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
                    onChange={(e) => {
                      const id = e.target.value;
                      setSelectedRetoId(id);
                      const r = retos.find((item) => item.id === id);
                      if (r) setRetoPointsToAward(r.puntos);
                    }}
                    className="w-full bg-slate-800 text-white p-2.5 rounded-xl border border-slate-700 font-medium"
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
                    className="w-full bg-slate-800 text-white p-2.5 rounded-xl border border-slate-700 font-medium"
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
                    className="w-full bg-slate-800 text-white p-2.5 rounded-xl border border-slate-700 font-medium"
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

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-slate-400 uppercase font-bold">
                      Puntos a Otorgar (+pts)
                    </label>
                    <span className="text-[10px] text-amber-400 font-bold">Valores altos:</span>
                  </div>
                  <input
                    type="number"
                    min="1"
                    step="5"
                    value={retoPointsToAward}
                    onChange={(e) => setRetoPointsToAward(Number(e.target.value))}
                    className="w-full bg-slate-800 text-white p-2.5 rounded-xl border border-slate-700 font-black text-amber-300 text-sm"
                  />
                  <div className="flex flex-wrap items-center gap-1 mt-1.5">
                    {[50, 100, 150, 200, 300, 500].map((val) => (
                      <button
                        key={val}
                        type="button"
                        onClick={() => setRetoPointsToAward(val)}
                        className={`px-2 py-0.5 rounded text-[10px] font-bold cursor-pointer ${
                          retoPointsToAward === val
                            ? 'bg-amber-500 text-slate-950 font-black shadow'
                            : 'bg-slate-800 text-amber-300 hover:bg-slate-700 border border-slate-700'
                        }`}
                      >
                        +{val}
                      </button>
                    ))}
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
                Historial de Retos Otorgados ({participacionesRetos.length})
              </h3>

              <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
                {participacionesRetos.map((pr) => {
                  const reto = retos.find((r) => r.id === pr.retoId);
                  const gt = gts.find((g) => g.id === pr.gtId);
                  const persona = pr.personaId
                    ? personas.find((p) => p.id === pr.personaId)
                    : null;
                  const isEditingPr = editingPrId === pr.id;

                  return (
                    <div
                      key={pr.id}
                      className={`p-3 rounded-2xl border text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2 ${
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

                      <div className="flex items-center gap-2">
                        {isEditingPr ? (
                          <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-lg border border-amber-500/50">
                            <input
                              type="number"
                              className="w-16 bg-slate-800 text-amber-300 font-bold px-1.5 py-0.5 rounded text-xs border border-slate-600"
                              value={editPrPuntos}
                              onChange={(e) => setEditPrPuntos(Number(e.target.value))}
                            />
                            <button
                              onClick={() => {
                                actualizarParticipacionReto(pr.id, {
                                  puntosOtorgados: Number(editPrPuntos),
                                });
                                setEditingPrId(null);
                                showFeedback('Puntos de participación actualizados.');
                              }}
                              className="px-2 py-0.5 bg-emerald-600 text-white rounded font-bold text-[11px]"
                            >
                              ✓
                            </button>
                            <button
                              onClick={() => setEditingPrId(null)}
                              className="px-1.5 py-0.5 bg-slate-700 text-slate-300 rounded text-[11px]"
                            >
                              ✕
                            </button>
                          </div>
                        ) : (
                          <>
                            <span className="text-amber-400 font-bold text-sm">
                              +{pr.puntosOtorgados} pts
                            </span>
                            {!pr.anulado && (
                              <button
                                onClick={() => {
                                  setEditingPrId(pr.id);
                                  setEditPrPuntos(pr.puntosOtorgados);
                                }}
                                className="text-slate-400 hover:text-amber-300 p-1"
                                title="Editar puntos"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </>
                        )}

                        {!pr.anulado && (
                          <button
                            onClick={() => {
                              if (window.confirm('¿Eliminar definitivamente este registro de reto?')) {
                                eliminarParticipacionReto(pr.id);
                                showFeedback('Puntos eliminados.');
                              }
                            }}
                            className="text-red-400 hover:text-red-300 p-1"
                            title="Eliminar registro"
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
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB: FACTORES DE TAMAÑO & CALIBRACIÓN 2026-2                              */}
      {/* ========================================================================= */}
      {activeAdminTab === 'factores' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-7">
          {/* Header */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-slate-800">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase font-extrabold tracking-wider text-amber-400 bg-amber-500/10 border border-amber-500/30 px-3 py-0.5 rounded-full">
                  Temporada Activa: 2026-2
                </span>
                <span className="text-xs text-slate-400">
                  Calibración de Equidad Matemática
                </span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-white mt-1.5 flex items-center gap-2.5">
                <Scale className="w-6 h-6 text-amber-400" />
                Ajuste del Factor de Tamaño (Temporada 2026-2)
              </h3>
              <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-3xl">
                El Factor de Tamaño equilibra la competencia entre GTs pequeños y grandes mediante la fórmula oficial:{' '}
                <strong className="text-amber-300">Factor = Factor Base / Integrantes</strong>.
                Todos los puntos de asistencia y ranking de 2026-2 se recalculan instantáneamente con este valor.
              </p>
            </div>

            {/* Quick Mode Toggle */}
            <div className="flex flex-col items-start lg:items-end gap-2 shrink-0 bg-slate-950/80 p-4 rounded-2xl border border-slate-800">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Visualización Predeterminada del Ranking:
              </span>
              <div className="flex items-center p-1 bg-slate-900 rounded-xl border border-slate-700">
                <button
                  type="button"
                  onClick={() => {
                    setModoRanking('temporada');
                    showFeedback('✓ Modo ranking establecido en Solo Temporada 2026-2');
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    modoRanking === 'temporada'
                      ? 'bg-amber-500 text-slate-950 shadow-md font-black'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  ⚡ Solo Temporada 2026-2
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setModoRanking('acumulado');
                    showFeedback('✓ Modo ranking establecido en Historial Acumulado (2026-1 + 2026-2)');
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    modoRanking === 'acumulado'
                      ? 'bg-indigo-600 text-white shadow-md font-black'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  📈 Acumulado Total
                </button>
              </div>
            </div>
          </div>

          {/* Factor Base Controls */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Controller Card */}
            <div className="lg:col-span-2 bg-slate-950/60 border border-slate-800 rounded-2xl p-6 space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h4 className="text-base font-bold text-white flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
                    Valor Actual del Factor Base
                  </h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Define el numerador de la división. Recomendamos <strong>14</strong> (el tamaño del GT más grande de 2026-2).
                  </p>
                </div>
                <div className="flex items-center gap-3 bg-slate-900 px-4 py-2.5 rounded-2xl border border-slate-700 shadow-inner">
                  <span className="text-xs text-slate-400 font-medium">Base:</span>
                  <span className="text-3xl font-black text-amber-400 tracking-tight">
                    {factorBase}
                  </span>
                </div>
              </div>

              {/* Presets */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-300 block">
                  Ajustes Rápidos Recomendados:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setFactorBase(14);
                      showFeedback('✓ Factor Base ajustado a 14 (Recomendado 2026-2)');
                    }}
                    className={`p-3.5 rounded-xl border text-left transition-all relative overflow-hidden ${
                      factorBase === 14
                        ? 'bg-amber-500/15 border-amber-500/60 ring-2 ring-amber-500/30 text-amber-200'
                        : 'bg-slate-900/90 border-slate-700/80 hover:border-slate-500 text-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-black">Base 14</span>
                      <span className="text-[10px] uppercase font-extrabold px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300">
                        Óptimo 2026-2
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1">
                      Alineado al GT más grande. El grupo de 14 tiene factor 1.00x sin inflación artificial.
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setFactorBase(12);
                      showFeedback('✓ Factor Base ajustado a 12 (Escala Compacta)');
                    }}
                    className={`p-3.5 rounded-xl border text-left transition-all ${
                      factorBase === 12
                        ? 'bg-indigo-500/15 border-indigo-500/60 ring-2 ring-indigo-500/30 text-indigo-200'
                        : 'bg-slate-900/90 border-slate-700/80 hover:border-slate-500 text-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-black">Base 12</span>
                      <span className="text-[10px] uppercase font-bold text-slate-400">
                        Compacto
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1">
                      Comprime las diferencias de factor, reduciendo la ventaja de grupos pequeños.
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setFactorBase(16);
                      showFeedback('✓ Factor Base ajustado a 16 (Histórico 2026-1)');
                    }}
                    className={`p-3.5 rounded-xl border text-left transition-all ${
                      factorBase === 16
                        ? 'bg-purple-500/15 border-purple-500/60 ring-2 ring-purple-500/30 text-purple-200'
                        : 'bg-slate-900/90 border-slate-700/80 hover:border-slate-500 text-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-black">Base 16</span>
                      <span className="text-[10px] uppercase font-bold text-slate-400">
                        Histórico
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1">
                      Fórmula original utilizada en el semestre 2026-1. Multiplicadores más altos.
                    </p>
                  </button>
                </div>
              </div>

              {/* Slider & manual adjustment */}
              <div className="pt-2">
                <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                  <span>Ajuste Manual Fino:</span>
                  <span className="font-mono text-amber-300 font-bold">{factorBase} / N</span>
                </div>
                <div className="flex items-center gap-4">
                  <input
                    type="range"
                    min="8"
                    max="22"
                    step="1"
                    value={factorBase}
                    onChange={(e) => setFactorBase(Number(e.target.value))}
                    className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
                  />
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      type="button"
                      onClick={() => setFactorBase(Math.max(8, factorBase - 1))}
                      className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 font-black text-white text-base flex items-center justify-center"
                    >
                      -
                    </button>
                    <input
                      type="number"
                      min="8"
                      max="30"
                      value={factorBase}
                      onChange={(e) => setFactorBase(Math.max(1, Number(e.target.value)))}
                      className="w-14 bg-slate-900 text-amber-300 font-black text-center text-sm py-1 rounded-lg border border-slate-700"
                    />
                    <button
                      type="button"
                      onClick={() => setFactorBase(Math.min(30, factorBase + 1))}
                      className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 font-black text-white text-base flex items-center justify-center"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Formula Explanation Card */}
            <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between space-y-4">
              <div>
                <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-2 text-amber-400">
                  ¿Por qué se ajusta a 14 en 2026-2?
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed space-y-2">
                  En 2026-1, con Base 16, un GT de 14 personas recibía factor <strong>1.14x</strong> (se inflaban sus puntos),
                  mientras que con <strong>Base 14</strong>:
                </p>
                <ul className="text-xs text-slate-400 mt-3 space-y-1.5 list-disc pl-4">
                  <li>El GT más numeroso (14 miembros) recibe exactamente <strong>1.00x</strong> (puntos netos sin distorsión).</li>
                  <li>Un GT mediano de 10 miembros recibe <strong>1.40x</strong>.</li>
                  <li>Un GT pequeño de 7 miembros recibe <strong>2.00x</strong>.</li>
                </ul>
              </div>

              <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl text-xs text-amber-200">
                <span className="font-bold block mb-0.5">Equidad al 100%:</span>
                Si cualquier GT asiste con el 100% de su gente a un Conectado de 30 pts, todos obtienen exactamente{' '}
                <strong>{30 * factorBase} DIAS Points</strong>.
              </div>
            </div>
          </div>

          {/* Real-time simulation table for all 9 GTs */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Users className="w-4 h-4 text-indigo-400" />
                Simulación en Tiempo Real para los 9 GTs (Base {factorBase})
              </h4>
              <span className="text-xs text-slate-400">
                Conectado de prueba: 30 pts base por asistente
              </span>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-950/50">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-900 text-slate-400 uppercase text-[10px] font-extrabold tracking-wider border-b border-slate-800">
                  <tr>
                    <th className="py-3 px-4">Grupo de Trabajo</th>
                    <th className="py-3 px-4 text-center">Integrantes Activos</th>
                    <th className="py-3 px-4 text-center">Fórmula Aplicada</th>
                    <th className="py-3 px-4 text-center">Factor Resultante</th>
                    <th className="py-3 px-4 text-right">Pts por 1 Asistente</th>
                    <th className="py-3 px-4 text-right">Pts al 100% Asistencia</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {gts.map((gt) => {
                    const activeCount = personas.filter((p) => p.gtId === gt.id && p.activo).length || 10;
                    const factorCalc = Math.round((factorBase / activeCount) * 100) / 100;
                    const pts1 = Math.round(30 * factorCalc * 10) / 10;
                    const pts100 = Math.round(activeCount * 30 * factorCalc);

                    return (
                      <tr key={gt.id} className="hover:bg-slate-900/40 transition-colors">
                        <td className="py-3 px-4 whitespace-nowrap">
                          <div className="flex items-center gap-2.5">
                            <div
                              className="w-7 h-7 rounded-lg flex items-center justify-center text-white font-black text-xs ring-1 ring-white/20"
                              style={{ backgroundColor: gt.color }}
                            >
                              {gt.codigo}
                            </div>
                            <span className="font-bold text-white uppercase">{gt.nombre}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-center whitespace-nowrap">
                          <span className="px-2.5 py-0.5 rounded-full bg-slate-800 border border-slate-700 font-bold text-slate-200">
                            {activeCount} personas
                          </span>
                        </td>
                        <td className="py-3 px-4 text-center whitespace-nowrap font-mono text-slate-400">
                          {factorBase} / {activeCount}
                        </td>
                        <td className="py-3 px-4 text-center whitespace-nowrap">
                          <span
                            className={`px-2.5 py-0.5 rounded-full font-black text-xs border ${
                              factorCalc >= 2.0
                                ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                                : factorCalc > 1.2
                                ? 'bg-blue-500/20 text-blue-300 border-blue-500/30'
                                : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                            }`}
                          >
                            {factorCalc.toFixed(2)}x
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right whitespace-nowrap font-medium text-slate-300">
                          +{pts1} pts
                        </td>
                        <td className="py-3 px-4 text-right whitespace-nowrap font-bold text-amber-300">
                          {pts100} pts
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB: INTEGRANTES (PERSONAS)                                               */}
      {/* ========================================================================= */}
      {activeAdminTab === 'personas' && (
        <div className="space-y-6">
          {/* Card: Formulario + Agregar Persona */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-7 shadow-xl space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Plus className="w-5 h-5 text-indigo-400" />
                  + Agregar Persona Manualmente
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Registra individualmente a un miembro y asígnalo a su Grupo de Trabajo (GT).
                </p>
              </div>

              <button
                type="button"
                onClick={() => setActiveAdminTab('importar_personas')}
                className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-emerald-400 border border-emerald-500/30 shrink-0 cursor-pointer"
              >
                <FileSpreadsheet className="w-3.5 h-3.5" />
                <span>¿Tienes muchas? Cargar desde Excel</span>
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (newPersonaNombre.trim()) {
                  crearPersona({
                    nombreCompleto: newPersonaNombre.trim(),
                    gtId: newPersonaGtId || gts[0]?.id || '',
                    activo: true,
                  });
                  setNewPersonaNombre('');
                  showFeedback(`¡Persona "${newPersonaNombre.trim()}" agregada con éxito!`);
                }
              }}
              className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-end bg-slate-800/40 p-4 rounded-2xl border border-slate-700/60"
            >
              {/* Campo NOMBRE */}
              <div className="sm:col-span-6 space-y-1.5">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                  NOMBRE:
                </label>
                <input
                  id="input-nombre-persona"
                  type="text"
                  placeholder="Ej. Juan Pérez, Valentina Gómez..."
                  value={newPersonaNombre}
                  onChange={(e) => setNewPersonaNombre(e.target.value)}
                  className="w-full bg-slate-900 text-xs sm:text-sm text-white px-3.5 py-2.5 rounded-xl border border-slate-700 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>

              {/* Selector GT */}
              <div className="sm:col-span-4 space-y-1.5">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                  GT (Grupo de Trabajo):
                </label>
                <select
                  id="select-gt-persona"
                  value={newPersonaGtId || gts[0]?.id}
                  onChange={(e) => setNewPersonaGtId(e.target.value)}
                  className="w-full bg-slate-900 text-xs sm:text-sm text-slate-200 px-3 py-2.5 rounded-xl border border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  {gts.map((gt) => (
                    <option key={gt.id} value={gt.id}>
                      {gt.nombre} ({gt.codigo})
                    </option>
                  ))}
                </select>
              </div>

              {/* Botón GUARDAR PERSONA */}
              <div className="sm:col-span-2">
                <button
                  id="btn-guardar-persona"
                  type="submit"
                  disabled={!newPersonaNombre.trim()}
                  className="w-full py-2.5 px-3 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold text-xs rounded-xl shadow-lg shadow-indigo-600/20 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>GUARDAR PERSONA</span>
                </button>
              </div>
            </form>
          </div>

          {/* Listado y Administración de Integrantes */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-7 shadow-xl space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Users className="w-4 h-4 text-indigo-400" />
                  Integrantes Registrados ({personas.length})
                </h3>
                <p className="text-xs text-slate-400">
                  Edita el GT asignado o activa/desactiva participantes
                </p>
              </div>

              {personas.length > 0 && (
                <div className="w-full sm:w-64">
                  <input
                    type="text"
                    placeholder="Buscar por nombre o GT..."
                    value={personaFilterText}
                    onChange={(e) => setPersonaFilterText(e.target.value)}
                    className="w-full bg-slate-800 text-xs text-white px-3 py-2 rounded-xl border border-slate-700 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              )}
            </div>

            {/* Empty state if personas is 0 */}
            {personas.length === 0 ? (
              <div className="py-12 text-center border border-dashed border-slate-800 rounded-2xl bg-slate-900/40 space-y-3">
                <Users className="w-10 h-10 text-slate-600 mx-auto" />
                <div>
                  <p className="text-sm font-bold text-slate-300">
                    No hay personas registradas todavía.
                  </p>
                  <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                    Los datos de prueba han sido limpiados. Agrega integrantes con el formulario superior o importa el archivo Excel.
                  </p>
                </div>
                <button
                  onClick={() => setActiveAdminTab('importar_personas')}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-emerald-600/20 cursor-pointer"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5" />
                  <span>Importar Personas desde Excel</span>
                </button>
              </div>
            ) : (
              <div className="max-h-96 overflow-y-auto divide-y divide-slate-800">
                {personas
                  .filter((p) => {
                    if (!personaFilterText) return true;
                    const q = personaFilterText.toLowerCase();
                    const gt = gts.find((g) => g.id === p.gtId);
                    return (
                      p.nombreCompleto.toLowerCase().includes(q) ||
                      gt?.nombre.toLowerCase().includes(q) ||
                      gt?.codigo.toLowerCase().includes(q)
                    );
                  })
                  .map((p) => {
                    const gt = gts.find((g) => g.id === p.gtId);

                    return (
                      <div
                        key={p.id}
                        className="py-3 flex items-center justify-between gap-3 text-xs"
                      >
                        <div className="flex items-center gap-2.5">
                          <span
                            className={`w-2.5 h-2.5 rounded-full shrink-0 ${
                              p.activo ? 'bg-emerald-400' : 'bg-red-400'
                            }`}
                          />
                          <div>
                            <span className="font-semibold text-white block">
                              {p.nombreCompleto}
                            </span>
                            <span className="text-[11px] text-slate-400">
                              GT actual: <strong className="text-slate-200">{gt?.nombre || 'Sin GT'}</strong>
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          {/* GT Switcher */}
                          <select
                            value={p.gtId}
                            onChange={(e) => {
                              cambiarGtPersona(p.id, e.target.value);
                              showFeedback(`GT actualizado para ${p.nombreCompleto}.`);
                            }}
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
                            className={`px-2 py-1 rounded text-[10px] font-bold cursor-pointer ${
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
                                showFeedback(`Persona eliminada.`);
                              }
                            }}
                            className="p-1.5 text-slate-500 hover:text-red-400 rounded-lg hover:bg-rose-950/30 transition-colors cursor-pointer"
                            title="Eliminar"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
              </div>
            )}
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
              onClick={async () => {
                if (
                  window.confirm(
                    '¿Seguro que deseas limpiar las personas y asistencias de prueba?\n\nLos GTs, eventos, temporadas y factores de tamaño permanecerán intactos.'
                  )
                ) {
                  await limpiarDatosPrueba();
                  showFeedback('¡Datos de prueba eliminados! Sistema listo con personas y puntos en 0.');
                }
              }}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl shrink-0 cursor-pointer"
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
                    <span className="font-bold text-white text-sm block uppercase tracking-wide">
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

      {/* ========================================================================= */}
      {/* MODAL: DETALLE Y RETOS DEL CONECTADO (ConectadoDetalleModal)              */}
      {/* ========================================================================= */}
      {selectedConectadoModalId && (
        <ConectadoDetalleModal
          eventoId={selectedConectadoModalId}
          onClose={() => setSelectedConectadoModalId(null)}
          onOpenQrProjector={onOpenQrProjector}
        />
      )}

      {/* ========================================================================= */}
      {/* MODAL: CREAR NUEVO EVENTO / CONECTADO                                     */}
      {/* ========================================================================= */}
      {showCreateEventoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl">
            <div className="p-6 border-b border-slate-800 flex items-center justify-between">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Calendar className="w-5 h-5 text-indigo-400" />
                Crear Nuevo Evento / Conectado
              </h3>
              <button
                onClick={() => setShowCreateEventoModal(false)}
                className="p-1 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!newEventoNombre.trim()) return;
                const nuevoEvento = crearEvento({
                  nombre: newEventoNombre.trim(),
                  descripcion: newEventoDesc.trim(),
                  fecha: newEventoFecha,
                  tipoEvento: newEventoTipo,
                  puntosAsistencia: Number(newEventoPuntos),
                  utilizaQr: newEventoUsaQr,
                  utilizaTurnos: newEventoUsaTurnos,
                  temporadaId: temporadaActiva?.id || temporadas[0]?.id || 'temp-2026-1',
                });
                setShowCreateEventoModal(false);
                setNewEventoNombre('');
                setNewEventoDesc('');
                showFeedback(`Evento "${nuevoEvento.nombre}" creado exitosamente.`);
              }}
              className="p-6 space-y-4 text-xs"
            >
              <div>
                <label className="block text-slate-300 font-bold mb-1">
                  Nombre del Evento *
                </label>
                <input
                  type="text"
                  placeholder="Ej: Conectado 4: Alabanza y Adoración"
                  value={newEventoNombre}
                  onChange={(e) => setNewEventoNombre(e.target.value)}
                  className="w-full bg-slate-800 text-white p-2.5 rounded-xl border border-slate-700 focus:border-indigo-500 font-medium"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">
                    Fecha del Evento
                  </label>
                  <input
                    type="date"
                    value={newEventoFecha}
                    onChange={(e) => setNewEventoFecha(e.target.value)}
                    className="w-full bg-slate-800 text-white p-2.5 rounded-xl border border-slate-700"
                    required
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">
                    Tipo de Evento
                  </label>
                  <select
                    value={newEventoTipo}
                    onChange={(e) => setNewEventoTipo(e.target.value as Evento['tipoEvento'])}
                    className="w-full bg-slate-800 text-white p-2.5 rounded-xl border border-slate-700"
                  >
                    <option value="conectado">Conectado Oficial</option>
                    <option value="taller">Taller / Especial</option>
                    <option value="expectativa">Expectativa</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">
                  Puntos Base por Asistencia
                </label>
                <input
                  type="number"
                  min="0"
                  step="5"
                  value={newEventoPuntos}
                  onChange={(e) => setNewEventoPuntos(Number(e.target.value))}
                  className="w-full bg-slate-800 text-amber-300 font-extrabold p-2.5 rounded-xl border border-slate-700"
                  required
                />
                <p className="text-[11px] text-slate-400 mt-1">
                  * Recuerda que la asistencia real en Conectados se pondera automáticamente por el tamaño del GT (16 / totalIntegrantes).
                </p>
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">
                  Descripción (Opcional)
                </label>
                <textarea
                  placeholder="Detalles sobre el evento, dinámica o programa..."
                  value={newEventoDesc}
                  onChange={(e) => setNewEventoDesc(e.target.value)}
                  rows={2}
                  className="w-full bg-slate-800 text-white p-2.5 rounded-xl border border-slate-700"
                />
              </div>

              <div className="flex gap-4 pt-1">
                <label className="flex items-center gap-2 cursor-pointer text-slate-300 font-medium">
                  <input
                    type="checkbox"
                    checked={newEventoUsaQr}
                    onChange={(e) => setNewEventoUsaQr(e.target.checked)}
                    className="rounded bg-slate-800 border-slate-700 text-indigo-500"
                  />
                  <span>Permitir escaneo QR</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-slate-300 font-medium">
                  <input
                    type="checkbox"
                    checked={newEventoUsaTurnos}
                    onChange={(e) => setNewEventoUsaTurnos(e.target.checked)}
                    className="rounded bg-slate-800 border-slate-700 text-indigo-500"
                  />
                  <span>Habilitar turnos</span>
                </label>
              </div>

              <div className="pt-4 border-t border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowCreateEventoModal(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-bold cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl shadow-lg shadow-indigo-600/30 cursor-pointer"
                >
                  Crear Evento
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: CREAR NUEVO RETO CON PUNTOS ALTOS                                   */}
      {/* ========================================================================= */}
      {showCreateRetoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl">
            <div className="p-6 border-b border-slate-800 flex items-center justify-between">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-purple-400" />
                Crear Nuevo Reto (+pts altos)
              </h3>
              <button
                onClick={() => setShowCreateRetoModal(false)}
                className="p-1 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!newRetoNombre.trim() || !newRetoEventoId) return;
                const nuevo = crearReto({
                  eventoId: newRetoEventoId,
                  temporadaId: temporadaActiva?.id || temporadas[0]?.id || 'temp-2026-1',
                  nombre: newRetoNombre.trim(),
                  descripcion: newRetoDesc.trim(),
                  tipoReto: newRetoTipo,
                  puntos: Number(newRetoPuntos),
                });
                setShowCreateRetoModal(false);
                setNewRetoNombre('');
                setNewRetoDesc('');
                showFeedback(`Reto "${nuevo.nombre}" (+${nuevo.puntos} pts) creado.`);
              }}
              className="p-6 space-y-4 text-xs"
            >
              <div>
                <label className="block text-slate-300 font-bold mb-1">
                  Evento o Conectado al que Pertenece *
                </label>
                <select
                  value={newRetoEventoId}
                  onChange={(e) => setNewRetoEventoId(e.target.value)}
                  className="w-full bg-slate-800 text-white p-2.5 rounded-xl border border-slate-700 font-medium"
                  required
                >
                  {eventos.map((ev) => (
                    <option key={ev.id} value={ev.id}>
                      {ev.nombre} ({ev.fecha})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">
                  Nombre del Reto / Desafío *
                </label>
                <input
                  type="text"
                  placeholder="Ej: Reto de Porras y Coreografía"
                  value={newRetoNombre}
                  onChange={(e) => setNewRetoNombre(e.target.value)}
                  className="w-full bg-slate-800 text-white p-2.5 rounded-xl border border-slate-700 focus:border-purple-500 font-medium"
                  required
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-slate-300 font-bold">
                    Puntos que otorga (+pts) *
                  </label>
                  <span className="text-[11px] text-amber-400 font-bold">Presets altos:</span>
                </div>
                <input
                  type="number"
                  min="1"
                  step="5"
                  value={newRetoPuntos}
                  onChange={(e) => setNewRetoPuntos(Number(e.target.value))}
                  className="w-full bg-slate-800 text-amber-300 font-black text-sm p-2.5 rounded-xl border border-slate-700"
                  required
                />
                <div className="flex flex-wrap items-center gap-1.5 mt-2">
                  {[50, 100, 150, 200, 300, 500].map((val) => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => setNewRetoPuntos(val)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-black cursor-pointer ${
                        newRetoPuntos === val
                          ? 'bg-amber-500 text-slate-950 shadow'
                          : 'bg-slate-800 text-amber-300 hover:bg-slate-700 border border-slate-700'
                      }`}
                    >
                      +{val} pts
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">
                  Tipo de Reto
                </label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer text-slate-300">
                    <input
                      type="radio"
                      name="retoTipo"
                      value="grupal"
                      checked={newRetoTipo === 'grupal'}
                      onChange={() => setNewRetoTipo('grupal')}
                      className="text-purple-600"
                    />
                    <span>Grupal (Puntos para todo el GT)</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer text-slate-300">
                    <input
                      type="radio"
                      name="retoTipo"
                      value="individual"
                      checked={newRetoTipo === 'individual'}
                      onChange={() => setNewRetoTipo('individual')}
                      className="text-purple-600"
                    />
                    <span>Individual (Puntos para un integrante)</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">
                  Descripción / Reglas
                </label>
                <textarea
                  placeholder="Objetivo, dinámica, materiales necesarios..."
                  value={newRetoDesc}
                  onChange={(e) => setNewRetoDesc(e.target.value)}
                  rows={2}
                  className="w-full bg-slate-800 text-white p-2.5 rounded-xl border border-slate-700"
                />
              </div>

              <div className="pt-4 border-t border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowCreateRetoModal(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-bold cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl shadow-lg shadow-purple-600/30 cursor-pointer"
                >
                  Crear Reto (+{newRetoPuntos} pts)
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: AGREGAR NUEVO TURNO A UN EVENTO CON HORARIO DEFINIDO              */}
      {/* ========================================================================= */}
      {showAddTurnoModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-white">
                    Nuevo Turno de Asistencia
                  </h3>
                  <p className="text-xs text-slate-400">Configura el nombre y horario del turno</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowAddTurnoModal(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-300 mb-1">
                  Nombre del Turno:
                </label>
                <input
                  type="text"
                  value={newTurnoNombre}
                  onChange={(e) => setNewTurnoNombre(e.target.value)}
                  className="w-full bg-slate-800 text-white font-bold p-2.5 rounded-xl border border-slate-700 text-xs focus:ring-2 focus:ring-amber-500"
                  placeholder="Ej: Turno 2"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-300 mb-1">
                    Hora Inicio:
                  </label>
                  <input
                    type="text"
                    value={newTurnoHoraInicio}
                    onChange={(e) => setNewTurnoHoraInicio(e.target.value)}
                    className="w-full bg-slate-800 text-amber-300 font-extrabold p-2.5 rounded-xl border border-slate-700 text-xs text-center focus:ring-2 focus:ring-amber-500"
                    placeholder="08:00 AM"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-300 mb-1">
                    Hora Fin:
                  </label>
                  <input
                    type="text"
                    value={newTurnoHoraFin}
                    onChange={(e) => setNewTurnoHoraFin(e.target.value)}
                    className="w-full bg-slate-800 text-amber-300 font-extrabold p-2.5 rounded-xl border border-slate-700 text-xs text-center focus:ring-2 focus:ring-amber-500"
                    placeholder="10:00 AM"
                  />
                </div>
              </div>

              <div>
                <span className="text-[11px] font-bold text-slate-400 block mb-1.5">
                  Horarios sugeridos (1 clic):
                </span>
                <div className="grid grid-cols-2 gap-1.5">
                  {PRESET_HORARIOS.map((p) => (
                    <button
                      key={p.label}
                      type="button"
                      onClick={() => {
                        setNewTurnoHoraInicio(p.inicio);
                        setNewTurnoHoraFin(p.fin);
                      }}
                      className={`p-2 rounded-xl text-[10px] font-bold border transition-colors cursor-pointer text-left ${
                        newTurnoHoraInicio === p.inicio && newTurnoHoraFin === p.fin
                          ? 'bg-amber-500 text-slate-950 border-amber-400 font-black shadow'
                          : 'bg-slate-800 text-slate-300 hover:bg-slate-700 border-slate-700/80'
                      }`}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowAddTurnoModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={() => {
                  if (!addTurnoEventoId || !temporadaActiva) return;
                  crearTurno({
                    eventoId: addTurnoEventoId,
                    temporadaId: temporadaActiva.id,
                    nombre: newTurnoNombre.trim() || 'Turno',
                    horaInicio: newTurnoHoraInicio.trim() || '08:00 AM',
                    horaFin: newTurnoHoraFin.trim() || '10:00 AM',
                    estado: 'programado',
                    activo: false,
                  });
                  setShowAddTurnoModal(false);
                  showFeedback(`Turno "${newTurnoNombre}" creado con horario ${newTurnoHoraInicio} - ${newTurnoHoraFin}`);
                }}
                className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs shadow-lg shadow-amber-500/20 cursor-pointer"
              >
                Crear Turno
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
