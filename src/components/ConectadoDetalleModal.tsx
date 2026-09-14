import React, { useState, useMemo } from 'react';
import { useApp } from '../lib/store';
import { calcularResultadoConectado } from '../lib/calculator';
import {
  Trophy,
  Calendar,
  Sparkles,
  Users,
  Settings,
  Plus,
  Trash2,
  CheckCircle2,
  X,
  Clock,
  Medal,
  Award,
  AlertCircle,
  FileSpreadsheet,
  Pencil,
  Search,
  UserPlus,
  ChevronDown,
  ChevronUp,
  Check,
} from 'lucide-react';
import { Evento, Reto } from '../types';

interface ConectadoDetalleModalProps {
  eventoId: string;
  onClose: () => void;
  onOpenQrProjector?: (eventoId: string) => void;
  onOpenRegister?: (eventoId: string) => void;
}

export const ConectadoDetalleModal: React.FC<ConectadoDetalleModalProps> = ({
  eventoId,
  onClose,
  onOpenQrProjector,
  onOpenRegister,
}) => {
  const {
    eventos,
    gts,
    personas,
    asistencias,
    retos,
    participacionesRetos,
    factores,
    actualizarEvento,
    eliminarEvento,
    cambiarEstadoEvento,
    crearReto,
    actualizarReto,
    eliminarReto,
    actualizarParticipacionReto,
    asignarGanadorReto,
    anularAsistencia,
    actualizarAsistencia,
    eliminarAsistencia,
    eliminarParticipacionReto,
    registrarAsistencia,
    temporadaActiva,
    factorBase,
  } = useApp();

  const evento = eventos.find((e) => e.id === eventoId);

  // Tab selection
  const [activeTab, setActiveTab] = useState<
    'calificacion' | 'retos' | 'editar' | 'asistencias'
  >('calificacion');

  // Edit Event Form State
  const [editNombre, setEditNombre] = useState(evento?.nombre || '');
  const [editDesc, setEditDesc] = useState(evento?.descripcion || '');
  const [editFecha, setEditFecha] = useState(evento?.fecha || '');
  const [editLugar, setEditLugar] = useState(evento?.lugar || '');
  const [editPuntos, setEditPuntos] = useState(evento?.puntosAsistencia ?? 10);
  const [editRetroactivo, setEditRetroactivo] = useState(true);
  const [editSuccessMsg, setEditSuccessMsg] = useState<string | null>(null);
  const [editEstado, setEditEstado] = useState<Evento['estado']>(
    evento?.estado || 'programado'
  );
  const [editUsaQr, setEditUsaQr] = useState(evento?.utilizaQr ?? true);
  const [editUsaTurnos, setEditUsaTurnos] = useState(evento?.utilizaTurnos ?? false);

  // New Reto Form State
  const [showAddReto, setShowAddReto] = useState(false);
  const [newRetoNombre, setNewRetoNombre] = useState('');
  const [newRetoDesc, setNewRetoDesc] = useState('');
  const [newRetoPuntos, setNewRetoPuntos] = useState(100);
  const [newRetoTipo, setNewRetoTipo] = useState<'grupal' | 'individual'>('grupal');

  // Edit Reto Form State
  const [editingRetoId, setEditingRetoId] = useState<string | null>(null);
  const [editRetoNombre, setEditRetoNombre] = useState('');
  const [editRetoDesc, setEditRetoDesc] = useState('');
  const [editRetoPuntos, setEditRetoPuntos] = useState(100);
  const [editRetoRetroactivo, setEditRetoRetroactivo] = useState(true);

  // Edit Individual Attendance / Reto Participation State
  const [editingAsistId, setEditingAsistId] = useState<string | null>(null);
  const [editingAsistPuntos, setEditingAsistPuntos] = useState<number>(15);
  const [editingPartId, setEditingPartId] = useState<string | null>(null);
  const [editingPartPuntos, setEditingPartPuntos] = useState<number>(100);

  // Assign Winner Form State
  const [assigningRetoId, setAssigningRetoId] = useState<string | null>(null);
  const [winnerGtId, setWinnerGtId] = useState<string>(gts[0]?.id || '');
  const [winnerPosicion, setWinnerPosicion] = useState<number>(1);
  const [winnerPuntos, setWinnerPuntos] = useState<number>(100);

  // Quick Manual Attendance State
  const [manualNombre, setManualNombre] = useState('');
  const [manualGtId, setManualGtId] = useState<string>(gts[0]?.id || '');
  const [manualFeedback, setManualFeedback] = useState<string | null>(null);

  // Roll call and search state for this Conectado
  const [asistenciaSubTab, setAsistenciaSubTab] = useState<'rapido' | 'pase_lista'>('rapido');
  const [searchAsistentes, setSearchAsistentes] = useState('');
  const [expandedGtPaseId, setExpandedGtPaseId] = useState<string | null>(null);
  const [inlineGtNewMember, setInlineGtNewMember] = useState<{ [gtId: string]: string }>({});

  // Auto-suggestions for manual attendance input
  const manualNameSuggestions = useMemo(() => {
    if (!manualNombre.trim() || manualNombre.length < 2) return [];
    const query = manualNombre.toLowerCase();
    return personas
      .filter((p) => p.nombreCompleto.toLowerCase().includes(query))
      .slice(0, 5);
  }, [manualNombre, personas]);

  // Toggle single member attendance in this Conectado
  const handleTogglePersonaAttendance = (personaId: string, gtId: string) => {
    const existing = asistencias.find(
      (a) => a.eventoId === evento.id && a.personaId === personaId && !a.anulado
    );
    if (existing) {
      eliminarAsistencia(existing.id);
      setManualFeedback('Asistencia removida.');
    } else {
      const persona = personas.find((p) => p.id === personaId);
      if (persona) {
        const res = registrarAsistencia({
          eventoId: evento.id,
          personaId: persona.id,
          nombreCompleto: persona.nombreCompleto,
          gtId: persona.gtId,
          origen: 'manual',
        });
        setManualFeedback(res.message);
      }
    }
    setTimeout(() => setManualFeedback(null), 3000);
  };

  // Add a new member directly to a GT and mark present in this Conectado
  const handleAddMemberToGtAndAttend = (gtId: string) => {
    const name = (inlineGtNewMember[gtId] || '').trim();
    if (!name) return;

    const res = registrarAsistencia({
      eventoId: evento.id,
      nombreCompleto: name,
      gtId: gtId,
      origen: 'manual',
    });

    setManualFeedback(res.message);
    if (res.success) {
      setInlineGtNewMember((prev) => ({ ...prev, [gtId]: '' }));
    }
    setTimeout(() => setManualFeedback(null), 3000);
  };

  // Mark all GT members present (100%)
  const handleSetGtFullAttendance = (gtId: string) => {
    const gtMembers = personas.filter((p) => p.gtId === gtId && p.activo);
    const attendedIds = new Set(
      asistencias
        .filter((a) => a.eventoId === evento.id && a.gtId === gtId && !a.anulado)
        .map((a) => a.personaId)
    );

    let added = 0;
    for (const m of gtMembers) {
      if (!attendedIds.has(m.id)) {
        registrarAsistencia({
          eventoId: evento.id,
          personaId: m.id,
          nombreCompleto: m.nombreCompleto,
          gtId: m.gtId,
          origen: 'manual',
        });
        added++;
      }
    }
    const gtObj = gts.find((g) => g.id === gtId);
    setManualFeedback(`Se marcaron ${added} nuevos asistentes en ${gtObj?.nombre}.`);
    setTimeout(() => setManualFeedback(null), 3000);
  };

  // Clear all attendances for a GT in this Conectado
  const handleClearGtAttendance = (gtId: string) => {
    const toRemove = asistencias.filter(
      (a) => a.eventoId === evento.id && a.gtId === gtId && !a.anulado
    );
    for (const a of toRemove) {
      eliminarAsistencia(a.id);
    }
    const gtObj = gts.find((g) => g.id === gtId);
    setManualFeedback(`Se eliminaron las asistencias de ${gtObj?.nombre}.`);
    setTimeout(() => setManualFeedback(null), 3000);
  };

  // Calculate General Result of this Conectado (Attendance based on GT size + Retos)
  const resultadoConectado = useMemo(() => {
    if (!evento) return [];
    return calcularResultadoConectado(
      evento.id,
      gts,
      personas,
      asistencias,
      retos,
      participacionesRetos,
      factores,
      evento,
      factorBase
    );
  }, [evento, gts, personas, asistencias, retos, participacionesRetos, factores, factorBase]);

  // Retos belonging to this Conectado
  const retosConectado = useMemo(() => {
    return retos.filter((r) => r.eventoId === eventoId);
  }, [retos, eventoId]);

  // Attendances for this Conectado
  const asistenciasConectado = useMemo(() => {
    return asistencias.filter((a) => a.eventoId === eventoId && !a.anulado);
  }, [asistencias, eventoId]);

  if (!evento) return null;

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    actualizarEvento(
      evento.id,
      {
        nombre: editNombre.trim(),
        descripcion: editDesc.trim(),
        fecha: editFecha,
        lugar: editLugar.trim(),
        puntosAsistencia: Number(editPuntos),
        estado: editEstado,
        utilizaQr: editUsaQr,
        utilizaTurnos: editUsaTurnos,
        tieneRetos: true,
      },
      editRetroactivo
    );
    setEditSuccessMsg(
      `¡Conectado actualizado con éxito! ${editRetroactivo ? `(Valor de +${editPuntos} pts aplicado retroactivamente a todas las asistencias registradas)` : ''}`
    );
    setTimeout(() => setEditSuccessMsg(null), 4000);
  };

  const handleDeleteEvento = () => {
    if (
      window.confirm(
        `¿Estás seguro de eliminar el conectado "${evento.nombre}"? Esta acción borrará sus retos y asistencias asociadas.`
      )
    ) {
      eliminarEvento(evento.id);
      onClose();
    }
  };

  const handleCreateReto = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRetoNombre.trim()) return;

    crearReto({
      nombre: newRetoNombre.trim(),
      descripcion: newRetoDesc.trim() || `Reto especial de ${evento.nombre}`,
      puntos: Number(newRetoPuntos),
      tipoReto: newRetoTipo,
      estado: 'activo',
      fecha: evento.fecha,
      eventoId: evento.id,
      temporadaId: evento.temporadaId || temporadaActiva?.id || '',
    });

    setNewRetoNombre('');
    setNewRetoDesc('');
    setShowAddReto(false);
  };

  const handleAssignWinner = (reto: Reto) => {
    asignarGanadorReto({
      retoId: reto.id,
      gtId: winnerGtId,
      puntos: Number(winnerPuntos),
      posicion: winnerPosicion,
      observacion: `Ganador puesto #${winnerPosicion} en ${reto.nombre}`,
    });
    setAssigningRetoId(null);
  };

  const handleQuickManualAttendance = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualNombre.trim()) return;

    const res = registrarAsistencia({
      nombreCompleto: manualNombre.trim(),
      gtId: manualGtId,
      eventoId: evento.id,
      origen: 'manual',
    });

    setManualFeedback(res.message);
    if (res.success) {
      setManualNombre('');
    }
    setTimeout(() => setManualFeedback(null), 3000);
  };

  const top3 = resultadoConectado.slice(0, 3);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-5xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden animate-fade-in">
        {/* Header Bar */}
        <div className="p-6 bg-slate-850 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center font-black text-xl shrink-0 shadow-lg shadow-amber-500/10">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase font-extrabold tracking-wider text-amber-400 bg-amber-500/10 border border-amber-500/30 px-2.5 py-0.5 rounded-full">
                  Gestión Oficial de Conectado
                </span>
                <span
                  className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                    evento.estado === 'activo'
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                      : evento.estado === 'finalizado'
                      ? 'bg-slate-800 text-slate-400 border-slate-700'
                      : 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30'
                  }`}
                >
                  {evento.estado.toUpperCase()}
                </span>
              </div>
              <h2 className="text-2xl font-black text-white mt-1">
                {evento.nombre}
              </h2>
              <div className="flex items-center gap-3 text-xs text-slate-400 mt-0.5">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  {evento.fecha}
                </span>
                <span>•</span>
                <span>+{evento.puntosAsistencia} pts/asistente</span>
                <span>•</span>
                <span>{asistenciasConectado.length} asistentes</span>
                <span>•</span>
                <span>{retosConectado.length} retos</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {onOpenQrProjector && (
              <button
                onClick={() => {
                  onClose();
                  onOpenQrProjector(evento.id);
                }}
                className="px-3 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs flex items-center gap-1.5 shadow"
              >
                <Clock className="w-4 h-4" />
                Proyectar QR
              </button>
            )}

            {onOpenRegister && (
              <button
                onClick={() => {
                  onClose();
                  onOpenRegister(evento.id);
                }}
                className="px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 shadow"
              >
                <Users className="w-4 h-4" />
                Registrar Asistencia
              </button>
            )}

            <button
              onClick={onClose}
              className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Navigation Tabs */}
        <div className="flex items-center px-6 border-b border-slate-800 bg-slate-900/80 overflow-x-auto gap-2 py-2.5">
          <button
            onClick={() => setActiveTab('calificacion')}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold flex items-center gap-2 transition-all shrink-0 ${
              activeTab === 'calificacion'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Trophy className="w-4 h-4 text-amber-300" />
            <span>Resultado General del Conectado</span>
          </button>

          <button
            onClick={() => setActiveTab('retos')}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold flex items-center gap-2 transition-all shrink-0 ${
              activeTab === 'retos'
                ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Sparkles className="w-4 h-4 text-purple-300" />
            <span>Retos de este Conectado ({retosConectado.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('editar')}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold flex items-center gap-2 transition-all shrink-0 ${
              activeTab === 'editar'
                ? 'bg-slate-700 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>Modificar Conectado</span>
          </button>

          <button
            onClick={() => setActiveTab('asistencias')}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold flex items-center gap-2 transition-all shrink-0 ${
              activeTab === 'asistencias'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Asistencias ({asistenciasConectado.length})</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* ========================================================================= */}
          {/* TAB 1: RESULTADO GENERAL DEL CONECTADO                                    */}
          {/* ========================================================================= */}
          {activeTab === 'calificacion' && (
            <div className="space-y-6">
              {/* Top Podio for this Conectado */}
              <div className="bg-slate-850 border border-slate-800 p-5 rounded-2xl">
                <h3 className="text-xs uppercase font-extrabold text-amber-400 tracking-wider mb-4 flex items-center gap-2">
                  <Medal className="w-4 h-4" />
                  Podio de Honor — {evento.nombre}
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {top3.map((gtRes, idx) => {
                    const isFirst = idx === 0;
                    return (
                      <div
                        key={gtRes.gtId}
                        className={`p-4 rounded-2xl border flex flex-col justify-between transition-all ${
                          isFirst
                            ? 'bg-gradient-to-b from-amber-500/20 to-slate-900 border-amber-500/50 ring-1 ring-amber-500/30 shadow-lg shadow-amber-500/10'
                            : 'bg-slate-800/80 border-slate-700'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span
                            className={`w-7 h-7 rounded-full flex items-center justify-center font-black text-xs ${
                              isFirst
                                ? 'bg-amber-400 text-slate-950 shadow'
                                : idx === 1
                                ? 'bg-slate-300 text-slate-950'
                                : 'bg-amber-700 text-white'
                            }`}
                          >
                            #{gtRes.posicion}
                          </span>
                          <span
                            className="px-2 py-0.5 rounded text-[10px] font-bold text-white"
                            style={{ backgroundColor: gtRes.color }}
                          >
                            {gtRes.codigo}
                          </span>
                        </div>

                        <div>
                          <h4 className="font-extrabold text-white text-base uppercase tracking-wide">
                            {gtRes.gtNombre}
                          </h4>
                          <p className="text-xs text-slate-400 mt-0.5">
                            {gtRes.asistentes} de {gtRes.totalIntegrantes} asistieron ({gtRes.porcentajeAsistencia.toFixed(0)}%)
                          </p>
                        </div>

                        <div className="mt-3 pt-2 border-t border-slate-700/60 flex items-end justify-between">
                          <span className="text-[11px] text-slate-400">Puntaje Total:</span>
                          <span className="text-xl font-black text-amber-300">
                            {gtRes.resultadoGeneral.toFixed(1)} pts
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Comprehensive Leaderboard Table for this Conectado */}
              <div className="bg-slate-850 border border-slate-800 rounded-2xl overflow-hidden">
                <div className="p-4 border-b border-slate-800 flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-black text-white">
                      Tabla de Calificación del Conectado
                    </h3>
                    <p className="text-xs text-slate-400">
                      Asistencia calificada según integrantes (con factor de tamaño) + Retos disputados en el Conectado
                    </p>
                  </div>
                  <span className="text-xs px-2.5 py-1 rounded-lg bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-bold">
                    Total: 9 GTs
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-900 text-slate-400 font-bold uppercase tracking-wider text-[10px] border-b border-slate-800">
                      <tr>
                        <th className="py-3 px-3 text-center">Pos</th>
                        <th className="py-3 px-3">Grupo de Trabajo (GT)</th>
                        <th className="py-3 px-3 text-center">Asistencia</th>
                        <th className="py-3 px-3 text-center">Factor Tam.</th>
                        <th className="py-3 px-3 text-right">Pts Asistencia</th>
                        <th className="py-3 px-3 text-right">Pts Retos</th>
                        <th className="py-3 px-4 text-right">RESULTADO GENERAL</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800 font-medium">
                      {resultadoConectado.map((item) => {
                        return (
                          <tr
                            key={item.gtId}
                            className="hover:bg-slate-800/60 transition-colors"
                          >
                            <td className="py-3 px-3 text-center font-black">
                              <span
                                className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs ${
                                  item.posicion === 1
                                    ? 'bg-amber-400 text-slate-950 font-black shadow'
                                    : item.posicion === 2
                                    ? 'bg-slate-300 text-slate-950 font-black'
                                    : item.posicion === 3
                                    ? 'bg-amber-700 text-white font-black'
                                    : 'text-slate-400'
                                }`}
                              >
                                {item.posicion}
                              </span>
                            </td>

                            <td className="py-3 px-3">
                              <div className="flex items-center gap-2">
                                <span
                                  className="w-3 h-3 rounded-full shrink-0"
                                  style={{ backgroundColor: item.color }}
                                />
                                <div>
                                  <span className="font-bold text-white block uppercase tracking-wide">
                                    {item.gtNombre}
                                  </span>
                                  {item.retosGanados.length > 0 && (
                                    <span className="text-[10px] text-purple-400">
                                      Ganó: {item.retosGanados.map((r) => r.retoNombre).join(', ')}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </td>

                            <td className="py-3 px-3 text-center">
                              <span className="font-bold text-slate-200">
                                {item.asistentes} / {item.totalIntegrantes}
                              </span>
                              <span className="text-[10px] text-slate-500 block">
                                ({item.porcentajeAsistencia.toFixed(0)}%)
                              </span>
                            </td>

                            <td className="py-3 px-3 text-center text-slate-300 font-mono">
                              x{item.factorTamano.toFixed(2)}
                            </td>

                            <td className="py-3 px-3 text-right text-emerald-400 font-bold">
                              +{item.puntosAsistenciaAjustados.toFixed(1)}
                            </td>

                            <td className="py-3 px-3 text-right text-purple-400 font-bold">
                              +{item.puntosRetos.toFixed(1)}
                            </td>

                            <td className="py-3 px-4 text-right">
                              <span className="font-black text-amber-400 text-sm">
                                {item.resultadoGeneral.toFixed(1)} pts
                              </span>
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
          {/* TAB 2: RETOS DE ESTE CONECTADO                                            */}
          {/* ========================================================================= */}
          {activeTab === 'retos' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-black text-white">
                    Retos asociados a {evento.nombre}
                  </h3>
                  <p className="text-xs text-slate-400">
                    Los retos suman puntos adicionales al GT y forman parte del Resultado General del Conectado.
                  </p>
                </div>

                <button
                  onClick={() => setShowAddReto(!showAddReto)}
                  className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center gap-1.5 shadow"
                >
                  <Plus className="w-4 h-4" />
                  Agregar Reto
                </button>
              </div>

              {/* Form to add a new Reto */}
              {showAddReto && (
                <form
                  onSubmit={handleCreateReto}
                  className="p-5 bg-slate-800/90 border border-purple-500/40 rounded-2xl space-y-4 animate-fade-in"
                >
                  <h4 className="font-black text-sm text-purple-300">
                    Nuevo Reto en este Conectado
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs text-slate-300 font-bold mb-1">
                        Nombre del Reto
                      </label>
                      <input
                        type="text"
                        placeholder="Ej. Rally de Integración, Desafío Creativo..."
                        value={newRetoNombre}
                        onChange={(e) => setNewRetoNombre(e.target.value)}
                        className="w-full bg-slate-900 text-white px-3 py-2 rounded-xl border border-slate-700 text-xs"
                        required
                      />
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="block text-xs text-slate-300 font-bold">
                          Puntos que otorga (+pts)
                        </label>
                        <span className="text-[10px] text-amber-400 font-bold">Valores altos:</span>
                      </div>
                      <input
                        type="number"
                        min="1"
                        step="5"
                        value={newRetoPuntos}
                        onChange={(e) => setNewRetoPuntos(Number(e.target.value))}
                        className="w-full bg-slate-900 text-amber-300 px-3 py-2 rounded-xl border border-slate-700 text-xs font-black"
                        required
                      />
                      <div className="flex flex-wrap items-center gap-1 mt-1.5">
                        {[50, 100, 150, 200, 300, 500].map((pts) => (
                          <button
                            key={pts}
                            type="button"
                            onClick={() => setNewRetoPuntos(pts)}
                            className={`px-2 py-0.5 rounded text-[10px] font-bold cursor-pointer ${
                              newRetoPuntos === pts
                                ? 'bg-amber-500 text-slate-950 shadow'
                                : 'bg-slate-900 text-amber-300 hover:bg-slate-700 border border-slate-700'
                            }`}
                          >
                            +{pts}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs text-slate-300 font-bold mb-1">
                      Descripción del Reto
                    </label>
                    <textarea
                      placeholder="Reglas, objetivo o dinámica del reto..."
                      value={newRetoDesc}
                      onChange={(e) => setNewRetoDesc(e.target.value)}
                      rows={2}
                      className="w-full bg-slate-900 text-white px-3 py-2 rounded-xl border border-slate-700 text-xs"
                    />
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowAddReto(false)}
                      className="px-4 py-2 rounded-xl bg-slate-700 text-slate-300 text-xs font-bold"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-black shadow"
                    >
                      Crear Reto
                    </button>
                  </div>
                </form>
              )}

              {/* Challenges list */}
              {retosConectado.length === 0 ? (
                <div className="p-8 text-center bg-slate-850 rounded-2xl border border-slate-800 text-slate-400 text-xs space-y-2">
                  <Sparkles className="w-8 h-8 text-slate-600 mx-auto" />
                  <p>Aún no hay retos creados dentro de este Conectado.</p>
                  <p className="text-slate-500">
                    Crea retos que sumen puntos adicionales a los GTs ganadores durante la jornada.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {retosConectado.map((reto) => {
                    const participaciones = participacionesRetos.filter(
                      (p) => p.retoId === reto.id
                    );

                    return (
                      <div
                        key={reto.id}
                        className="p-5 bg-slate-850 border border-slate-800 rounded-2xl space-y-3"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="font-extrabold text-white text-base">
                                {reto.nombre}
                              </h4>
                              <span className="text-xs px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/40 font-bold">
                                +{reto.puntos} pts
                              </span>
                            </div>
                            <p className="text-xs text-slate-400 mt-1">
                              {reto.descripcion}
                            </p>
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => {
                                setEditingRetoId(reto.id);
                                setEditRetoNombre(reto.nombre);
                                setEditRetoDesc(reto.descripcion || '');
                                setEditRetoPuntos(reto.puntos);
                                setEditRetoRetroactivo(true);
                              }}
                              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold flex items-center gap-1.5 shadow"
                              title="Modificar valor de puntos y reglas de este reto"
                            >
                              <Pencil className="w-3.5 h-3.5 text-amber-400" />
                              Modificar Valor
                            </button>

                            <button
                              onClick={() => {
                                setAssigningRetoId(reto.id);
                                setWinnerPuntos(reto.puntos);
                              }}
                              className="px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold flex items-center gap-1 shadow"
                            >
                              <Award className="w-3.5 h-3.5" />
                              Asignar Ganador
                            </button>

                            <button
                              onClick={() => {
                                if (window.confirm(`¿Eliminar reto "${reto.nombre}"?`)) {
                                  eliminarReto(reto.id);
                                }
                              }}
                              className="p-2 rounded-xl bg-slate-800 hover:bg-red-950 text-slate-400 hover:text-red-400 border border-slate-700"
                              title="Eliminar reto"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        {/* Inline Edit Reto Form */}
                        {editingRetoId === reto.id && (
                          <form
                            onSubmit={(e) => {
                              e.preventDefault();
                              actualizarReto(
                                reto.id,
                                {
                                  nombre: editRetoNombre.trim(),
                                  descripcion: editRetoDesc.trim(),
                                  puntos: Number(editRetoPuntos),
                                },
                                editRetoRetroactivo
                              );
                              setEditingRetoId(null);
                            }}
                            className="p-4 bg-slate-900/90 border border-purple-500/50 rounded-xl space-y-3 animate-fade-in"
                          >
                            <h5 className="font-bold text-xs text-purple-300 flex items-center gap-1.5">
                              <Pencil className="w-3.5 h-3.5 text-amber-400" /> Modificar Valores y Puntos del Reto
                            </h5>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                              <div>
                                <label className="block text-[11px] text-slate-400 font-bold mb-1">
                                  Nombre del Reto
                                </label>
                                <input
                                  type="text"
                                  value={editRetoNombre}
                                  onChange={(e) => setEditRetoNombre(e.target.value)}
                                  className="w-full bg-slate-800 text-white text-xs p-2 rounded-lg border border-slate-700"
                                  required
                                />
                              </div>

                              <div>
                                <div className="flex items-center justify-between mb-1">
                                  <label className="block text-[11px] text-slate-400 font-bold">
                                    Puntos que otorga (+pts)
                                  </label>
                                  <span className="text-[10px] text-amber-400 font-bold">Valores altos:</span>
                                </div>
                                <input
                                  type="number"
                                  min="1"
                                  step="5"
                                  value={editRetoPuntos}
                                  onChange={(e) => setEditRetoPuntos(Number(e.target.value))}
                                  className="w-full bg-slate-800 text-amber-400 font-extrabold text-xs p-2 rounded-lg border border-slate-700"
                                  required
                                />
                                <div className="flex flex-wrap items-center gap-1 mt-1">
                                  {[50, 100, 150, 200, 300, 500].map((pts) => (
                                    <button
                                      key={pts}
                                      type="button"
                                      onClick={() => setEditRetoPuntos(pts)}
                                      className={`px-2 py-0.5 rounded text-[10px] font-bold cursor-pointer ${
                                        editRetoPuntos === pts
                                          ? 'bg-amber-500 text-slate-950 shadow'
                                          : 'bg-slate-900 text-amber-300 hover:bg-slate-700 border border-slate-700'
                                      }`}
                                    >
                                      +{pts}
                                    </button>
                                  ))}
                                </div>
                              </div>
                            </div>

                            <div>
                              <label className="block text-[11px] text-slate-400 font-bold mb-1">
                                Descripción / Dinámica
                              </label>
                              <textarea
                                rows={2}
                                value={editRetoDesc}
                                onChange={(e) => setEditRetoDesc(e.target.value)}
                                className="w-full bg-slate-800 text-white text-xs p-2 rounded-lg border border-slate-700"
                              />
                            </div>

                            <label className="flex items-center gap-2 cursor-pointer text-xs text-amber-300 bg-amber-500/10 p-2.5 rounded-xl border border-amber-500/30">
                              <input
                                type="checkbox"
                                checked={editRetoRetroactivo}
                                onChange={(e) => setEditRetoRetroactivo(e.target.checked)}
                                className="rounded bg-slate-800 border-amber-400 text-amber-500 focus:ring-amber-500"
                              />
                              <span>
                                <strong>Actualizar retroactivamente:</strong> Aplicar el nuevo valor de {editRetoPuntos} pts a los GTs ya registrados como ganadores en este reto.
                              </span>
                            </label>

                            <div className="flex items-center justify-end gap-2 pt-1">
                              <button
                                type="button"
                                onClick={() => setEditingRetoId(null)}
                                className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 text-xs font-bold"
                              >
                                Cancelar
                              </button>
                              <button
                                type="submit"
                                className="px-4 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-black text-xs shadow"
                              >
                                Guardar Valor del Reto
                              </button>
                            </div>
                          </form>
                        )}

                        {/* Assign Winner Inline Form */}
                        {assigningRetoId === reto.id && (
                          <div className="p-4 bg-slate-900 border border-amber-500/50 rounded-xl space-y-3 animate-fade-in">
                            <h5 className="font-bold text-xs text-amber-400">
                              Asignar GT Ganador para "{reto.nombre}"
                            </h5>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                              <div>
                                <label className="block text-[11px] text-slate-400 mb-1">
                                  GT Ganador
                                </label>
                                <select
                                  value={winnerGtId}
                                  onChange={(e) => setWinnerGtId(e.target.value)}
                                  className="w-full bg-slate-800 text-white text-xs p-2 rounded-lg border border-slate-700 font-bold"
                                >
                                  {gts.map((gt) => (
                                    <option key={gt.id} value={gt.id}>
                                      {gt.nombre} ({gt.codigo})
                                    </option>
                                  ))}
                                </select>
                              </div>

                              <div>
                                <label className="block text-[11px] text-slate-400 mb-1">
                                  Puntos a otorgar (+pts)
                                </label>
                                <input
                                  type="number"
                                  min="1"
                                  step="5"
                                  value={winnerPuntos}
                                  onChange={(e) => setWinnerPuntos(Number(e.target.value))}
                                  className="w-full bg-slate-800 text-amber-300 font-black text-xs p-2 rounded-lg border border-slate-700"
                                />
                              </div>
                            </div>

                            <div className="flex items-center justify-end gap-2">
                              <button
                                type="button"
                                onClick={() => setAssigningRetoId(null)}
                                className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 text-xs"
                              >
                                Cancelar
                              </button>
                              <button
                                type="button"
                                onClick={() => handleAssignWinner(reto)}
                                className="px-4 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs shadow"
                              >
                                Confirmar y Sumar Puntos
                              </button>
                            </div>
                          </div>
                        )}

                        {/* List of winners for this challenge */}
                        {participaciones.length > 0 && (
                          <div className="mt-2 pt-2 border-t border-slate-800 flex flex-wrap gap-2 items-center">
                            <span className="text-[11px] text-slate-400">
                              Ganadores registrados:
                            </span>
                            {participaciones.map((pr) => {
                              const gt = gts.find((g) => g.id === pr.gtId);
                              const isEditingThisPart = editingPartId === pr.id;

                              if (isEditingThisPart) {
                                return (
                                  <div
                                    key={pr.id}
                                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs bg-slate-900 border border-amber-500/60"
                                  >
                                    <span className="font-bold text-white">{gt?.nombre}:</span>
                                    <input
                                      type="number"
                                      className="w-16 bg-slate-800 text-amber-400 px-1.5 py-0.5 rounded border border-slate-600 font-bold text-xs"
                                      value={editingPartPuntos}
                                      onChange={(e) => setEditingPartPuntos(Number(e.target.value))}
                                    />
                                    <button
                                      onClick={() => {
                                        actualizarParticipacionReto(pr.id, {
                                          puntosOtorgados: Number(editingPartPuntos),
                                        });
                                        setEditingPartId(null);
                                      }}
                                      className="px-2 py-0.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded font-bold text-[11px]"
                                    >
                                      ✓
                                    </button>
                                    <button
                                      onClick={() => setEditingPartId(null)}
                                      className="px-1.5 py-0.5 bg-slate-700 text-slate-300 rounded text-[11px]"
                                    >
                                      ✕
                                    </button>
                                  </div>
                                );
                              }

                              return (
                                <span
                                  key={pr.id}
                                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs bg-slate-900 border border-slate-700 text-white font-bold group"
                                >
                                  <Award className="w-3.5 h-3.5 text-amber-400" />
                                  <span>{gt?.nombre}</span>
                                  <span className="text-amber-400 font-black">+{pr.puntosOtorgados} pts</span>
                                  <span className="text-slate-500 text-[10px]">
                                    (#{pr.posicion || 1})
                                  </span>
                                  <button
                                    onClick={() => {
                                      setEditingPartId(pr.id);
                                      setEditingPartPuntos(pr.puntosOtorgados);
                                    }}
                                    className="text-slate-400 hover:text-amber-300 text-[10px] ml-1 opacity-60 group-hover:opacity-100"
                                    title="Modificar puntos de este ganador"
                                  >
                                    <Pencil className="w-3 h-3" />
                                  </button>
                                  <button
                                    onClick={() => {
                                      if (window.confirm(`¿Eliminar puntos de ${gt?.nombre} en este reto?`)) {
                                        eliminarParticipacionReto(pr.id);
                                      }
                                    }}
                                    className="text-slate-500 hover:text-red-400 text-[10px] ml-0.5 opacity-60 group-hover:opacity-100"
                                    title="Eliminar asignación de puntos"
                                  >
                                    <X className="w-3 h-3" />
                                  </button>
                                </span>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 3: MODIFICAR CONECTADO (EDICIÓN COMPLETA)                             */}
          {/* ========================================================================= */}
          {activeTab === 'editar' && (
            <form onSubmit={handleSaveEdit} className="space-y-5 max-w-2xl">
              <div>
                <h3 className="text-base font-black text-white">
                  Editar Parámetros de {evento.nombre}
                </h3>
                <p className="text-xs text-slate-400">
                  Modifica las propiedades del Conectado, puntos por asistencia y estado.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Nombre del Conectado
                  </label>
                  <input
                    type="text"
                    value={editNombre}
                    onChange={(e) => setEditNombre(e.target.value)}
                    className="w-full bg-slate-800 text-white px-3.5 py-2.5 rounded-xl border border-slate-700 text-xs font-bold"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Fecha
                  </label>
                  <input
                    type="date"
                    value={editFecha}
                    onChange={(e) => setEditFecha(e.target.value)}
                    className="w-full bg-slate-800 text-white px-3.5 py-2.5 rounded-xl border border-slate-700 text-xs"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Lugar / Bloque
                  </label>
                  <input
                    type="text"
                    value={editLugar}
                    onChange={(e) => setEditLugar(e.target.value)}
                    className="w-full bg-slate-800 text-white px-3.5 py-2.5 rounded-xl border border-slate-700 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Puntos por Asistencia (+pts)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="200"
                    value={editPuntos}
                    onChange={(e) => setEditPuntos(Number(e.target.value))}
                    className="w-full bg-slate-800 text-amber-400 font-extrabold px-3.5 py-2.5 rounded-xl border border-slate-700 text-xs"
                    required
                  />
                  <label className="flex items-start gap-2 mt-2 cursor-pointer text-[11px] text-amber-300 bg-amber-500/10 p-2 rounded-lg border border-amber-500/30">
                    <input
                      type="checkbox"
                      checked={editRetroactivo}
                      onChange={(e) => setEditRetroactivo(e.target.checked)}
                      className="rounded bg-slate-800 border-amber-400 text-amber-500 focus:ring-amber-500 mt-0.5"
                    />
                    <span>
                      <strong>Recalcular retroactivo:</strong> Aplicar el nuevo valor de {editPuntos} pts a todas las asistencias ya registradas en este evento.
                    </span>
                  </label>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Estado del Conectado
                  </label>
                  <select
                    value={editEstado}
                    onChange={(e) =>
                      setEditEstado(e.target.value as Evento['estado'])
                    }
                    className="w-full bg-slate-800 text-white px-3.5 py-2.5 rounded-xl border border-slate-700 text-xs font-bold"
                  >
                    <option value="programado">Programado</option>
                    <option value="activo">🟢 En Curso / Activo</option>
                    <option value="finalizado">Finalizado</option>
                  </select>
                </div>
              </div>

              {editSuccessMsg && (
                <div className="p-3 bg-emerald-950/70 border border-emerald-500/50 text-emerald-300 text-xs rounded-xl flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>{editSuccessMsg}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Descripción
                </label>
                <textarea
                  value={editDesc}
                  onChange={(e) => setEditDesc(e.target.value)}
                  rows={3}
                  className="w-full bg-slate-800 text-white px-3.5 py-2.5 rounded-xl border border-slate-700 text-xs"
                />
              </div>

              <div className="flex flex-wrap gap-4 pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300">
                  <input
                    type="checkbox"
                    checked={editUsaQr}
                    onChange={(e) => setEditUsaQr(e.target.checked)}
                    className="rounded bg-slate-800 border-slate-700 text-amber-500 focus:ring-amber-500"
                  />
                  <span>Permitir escaneo de QR para registrar asistencia</span>
                </label>
              </div>

              <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                <button
                  type="button"
                  onClick={handleDeleteEvento}
                  className="px-4 py-2.5 rounded-xl bg-red-950/60 hover:bg-red-900 text-red-300 border border-red-800 text-xs font-bold flex items-center gap-1.5"
                >
                  <Trash2 className="w-4 h-4" />
                  Eliminar este Conectado
                </button>

                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs shadow-lg shadow-indigo-600/30"
                >
                  Guardar Cambios
                </button>
              </div>
            </form>
          )}

          {/* ========================================================================= */}
          {/* TAB 4: ASISTENCIAS REGISTRADAS EN ESTE CONECTADO                          */}
          {/* ========================================================================= */}
          {activeTab === 'asistencias' && (
            <div className="space-y-5">
              {/* Mode Switcher */}
              <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-850 p-2 rounded-2xl border border-slate-800">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setAsistenciaSubTab('rapido')}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                      asistenciaSubTab === 'rapido'
                        ? 'bg-amber-600 text-white shadow-md'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800'
                    }`}
                  >
                    <UserPlus className="w-3.5 h-3.5" />
                    Entrada Rápida Manual
                  </button>

                  <button
                    type="button"
                    onClick={() => setAsistenciaSubTab('pase_lista')}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                      asistenciaSubTab === 'pase_lista'
                        ? 'bg-amber-600 text-white shadow-md'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800'
                    }`}
                  >
                    <Users className="w-3.5 h-3.5" />
                    Pase de Lista por GT (Nominal)
                  </button>
                </div>

                <div className="text-xs text-slate-400 pr-2">
                  Total Asistencias: <strong className="text-white">{asistenciasConectado.length}</strong>
                </div>
              </div>

              {/* Feedback alert */}
              {manualFeedback && (
                <div className="p-3 bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 text-xs rounded-xl flex items-center gap-2 animate-fade-in">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>{manualFeedback}</span>
                </div>
              )}

              {/* SUBTAB 1: Quick Manual Entry Bar */}
              {asistenciaSubTab === 'rapido' && (
                <form
                  onSubmit={handleQuickManualAttendance}
                  className="p-4 bg-slate-850 border border-slate-800 rounded-2xl flex flex-col sm:flex-row items-end gap-3"
                >
                  <div className="flex-1 w-full relative">
                    <label className="block text-[11px] font-bold text-slate-300 mb-1">
                      Nombre Completo del Asistente:
                    </label>
                    <input
                      type="text"
                      placeholder="Escribe el nombre del integrante..."
                      value={manualNombre}
                      onChange={(e) => setManualNombre(e.target.value)}
                      className="w-full bg-slate-900 text-white text-xs px-3.5 py-2.5 rounded-xl border border-slate-700 focus:outline-none focus:border-amber-500"
                      required
                    />
                    {/* Live suggestions */}
                    {manualNameSuggestions.length > 0 && (
                      <div className="absolute top-full left-0 right-0 z-30 mt-1 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl overflow-hidden divide-y divide-slate-800">
                        {manualNameSuggestions.map((sug) => {
                          const sugGt = gts.find((g) => g.id === sug.gtId);
                          return (
                            <button
                              key={sug.id}
                              type="button"
                              onClick={() => {
                                setManualNombre(sug.nombreCompleto);
                                setManualGtId(sug.gtId);
                              }}
                              className="w-full px-3 py-2 text-left hover:bg-slate-800 flex items-center justify-between text-xs"
                            >
                              <span className="font-bold text-white">{sug.nombreCompleto}</span>
                              <span className="text-[10px] text-amber-400 font-bold bg-amber-500/10 px-2 py-0.5 rounded">
                                {sugGt?.nombre || 'GT'}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  <div className="w-full sm:w-48">
                    <label className="block text-[11px] font-bold text-slate-300 mb-1">
                      GT:
                    </label>
                    <select
                      value={manualGtId}
                      onChange={(e) => setManualGtId(e.target.value)}
                      className="w-full bg-slate-900 text-amber-300 font-bold text-xs px-3.5 py-2.5 rounded-xl border border-slate-700 focus:outline-none focus:border-amber-500"
                    >
                      {gts.map((g) => (
                        <option key={g.id} value={g.id}>
                          {g.nombre} ({g.codigo})
                        </option>
                      ))}
                    </select>
                  </div>

                  <button
                    type="submit"
                    className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shrink-0 shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Check className="w-4 h-4" />
                    <span>+ Cargar Asistencia (+{evento.puntosAsistencia} pts)</span>
                  </button>
                </form>
              )}

              {/* SUBTAB 2: Roll call checklist by GT */}
              {asistenciaSubTab === 'pase_lista' && (
                <div className="space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {gts.map((gt) => {
                      const members = personas.filter((p) => p.gtId === gt.id && p.activo);
                      const gtAsists = asistenciasConectado.filter((a) => a.gtId === gt.id);
                      const isExpanded = expandedGtPaseId === gt.id;

                      return (
                        <div
                          key={gt.id}
                          className="bg-slate-850 border border-slate-800 rounded-2xl p-3.5 space-y-3 flex flex-col justify-between"
                        >
                          <div>
                            <div className="flex items-center justify-between gap-2 mb-2">
                              <div className="flex items-center gap-2">
                                <span
                                  className="w-3 h-3 rounded-full shrink-0"
                                  style={{ backgroundColor: gt.color || '#f59e0b' }}
                                />
                                <div>
                                  <h5 className="font-bold text-xs text-white leading-tight">
                                    {gt.nombre}
                                  </h5>
                                  <span className="text-[10px] text-slate-400">
                                    {gtAsists.length} de {members.length} presentes
                                  </span>
                                </div>
                              </div>

                              {/* Action pills */}
                              <div className="flex items-center gap-1">
                                <button
                                  type="button"
                                  onClick={() => handleSetGtFullAttendance(gt.id)}
                                  className="px-2 py-0.5 rounded bg-slate-800 hover:bg-emerald-600/30 text-emerald-400 text-[10px] font-bold border border-slate-700"
                                  title="Marcar todos los integrantes presentes"
                                >
                                  100%
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleClearGtAttendance(gt.id)}
                                  className="px-2 py-0.5 rounded bg-slate-800 hover:bg-red-600/30 text-red-400 text-[10px] font-bold border border-slate-700"
                                  title="Limpiar asistencias de este GT"
                                >
                                  0%
                                </button>
                              </div>
                            </div>

                            {/* Collapsible member list */}
                            <button
                              type="button"
                              onClick={() =>
                                setExpandedGtPaseId(isExpanded ? null : gt.id)
                              }
                              className="w-full py-1 px-2 rounded-lg bg-slate-900/60 hover:bg-slate-900 text-[11px] text-slate-400 hover:text-white flex items-center justify-between font-bold"
                            >
                              <span>Ver integrantes ({members.length})</span>
                              {isExpanded ? (
                                <ChevronUp className="w-3.5 h-3.5" />
                              ) : (
                                <ChevronDown className="w-3.5 h-3.5" />
                              )}
                            </button>

                            {isExpanded && (
                              <div className="mt-2 space-y-1 max-h-48 overflow-y-auto pr-1">
                                {members.map((member) => {
                                  const isAttending = gtAsists.some(
                                    (a) => a.personaId === member.id
                                  );

                                  return (
                                    <div
                                      key={member.id}
                                      onClick={() =>
                                        handleTogglePersonaAttendance(member.id, gt.id)
                                      }
                                      className="flex items-center justify-between p-1.5 rounded-lg text-xs cursor-pointer hover:bg-slate-800/80 transition-colors"
                                    >
                                      <span
                                        className={
                                          isAttending
                                            ? 'text-white font-bold'
                                            : 'text-slate-500'
                                        }
                                      >
                                        {member.nombreCompleto}
                                      </span>

                                      <span
                                        className={`px-2 py-0.5 rounded text-[10px] font-black uppercase flex items-center gap-1 ${
                                          isAttending
                                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                                            : 'bg-slate-800 text-slate-500'
                                        }`}
                                      >
                                        {isAttending ? (
                                          <>
                                            <Check className="w-3 h-3" /> Presente
                                          </>
                                        ) : (
                                          'Ausente'
                                        )}
                                      </span>
                                    </div>
                                  );
                                })}

                                {/* Inline add to this GT */}
                                <div className="pt-2 mt-2 border-t border-slate-800 flex items-center gap-1">
                                  <input
                                    type="text"
                                    placeholder={`+ Persona en ${gt.codigo}...`}
                                    value={inlineGtNewMember[gt.id] || ''}
                                    onChange={(e) =>
                                      setInlineGtNewMember((prev) => ({
                                        ...prev,
                                        [gt.id]: e.target.value,
                                      }))
                                    }
                                    onKeyDown={(e) => {
                                      if (e.key === 'Enter') {
                                        e.preventDefault();
                                        handleAddMemberToGtAndAttend(gt.id);
                                      }
                                    }}
                                    className="flex-1 bg-slate-900 text-white text-[11px] px-2 py-1 rounded-lg border border-slate-700 placeholder-slate-500"
                                  />
                                  <button
                                    type="button"
                                    onClick={() => handleAddMemberToGtAndAttend(gt.id)}
                                    className="px-2 py-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[10px] rounded-lg"
                                  >
                                    + Presente
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Attendances List */}
              <div className="bg-slate-850 border border-slate-800 rounded-2xl overflow-hidden">
                <div className="p-4 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h4 className="font-bold text-xs text-white uppercase tracking-wider">
                      Lista de Asistentes ({asistenciasConectado.length})
                    </h4>
                    <span className="text-[11px] text-slate-400 font-medium">
                      +{evento.puntosAsistencia} pts otorgados a cada participante
                    </span>
                  </div>

                  {/* Filter Attendees Search */}
                  <div className="relative w-full sm:w-60">
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Filtrar asistente o GT..."
                      value={searchAsistentes}
                      onChange={(e) => setSearchAsistentes(e.target.value)}
                      className="w-full bg-slate-900 text-white text-xs pl-8 pr-3 py-1.5 rounded-xl border border-slate-700 placeholder-slate-500 focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                {asistenciasConectado.length === 0 ? (
                  <div className="p-8 text-center text-slate-500 text-xs">
                    No hay asistencias registradas aún en este Conectado.
                  </div>
                ) : (
                  <div className="max-h-80 overflow-y-auto divide-y divide-slate-800">
                    {asistenciasConectado
                      .filter((asist) => {
                        if (!searchAsistentes.trim()) return true;
                        const q = searchAsistentes.toLowerCase().trim();
                        const persona = personas.find((p) => p.id === asist.personaId);
                        const gt = gts.find((g) => g.id === asist.gtId);
                        const matchPersona =
                          persona?.nombreCompleto.toLowerCase().includes(q) || false;
                        const matchGt =
                          gt?.nombre.toLowerCase().includes(q) ||
                          gt?.codigo.toLowerCase().includes(q) ||
                          false;
                        return matchPersona || matchGt;
                      })
                      .map((asist) => {
                        const persona = personas.find((p) => p.id === asist.personaId);
                        const gt = gts.find((g) => g.id === asist.gtId);

                        return (
                          <div
                            key={asist.id}
                            className="p-3 hover:bg-slate-800/50 flex items-center justify-between text-xs"
                          >
                            <div className="flex items-center gap-3">
                              <span
                                className="w-2.5 h-2.5 rounded-full"
                                style={{ backgroundColor: gt?.color || '#94a3b8' }}
                              />
                              <div>
                                <span className="font-bold text-white block">
                                  {persona?.nombreCompleto || 'Participante'}
                                </span>
                                <span className="text-[10px] text-slate-400">
                                  GT: {gt?.nombre} • {new Date(asist.fechaRegistro).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                              </div>
                            </div>

                            <div className="flex items-center gap-2">
                              {editingAsistId === asist.id ? (
                                <div className="flex items-center gap-1.5 bg-slate-900 px-2 py-1 rounded-lg border border-amber-500/50">
                                  <input
                                    type="number"
                                    className="w-16 bg-slate-800 text-amber-400 font-bold px-1.5 py-0.5 rounded text-xs border border-slate-700"
                                    value={editingAsistPuntos}
                                    onChange={(e) => setEditingAsistPuntos(Number(e.target.value))}
                                  />
                                  <button
                                    onClick={() => {
                                      actualizarAsistencia(asist.id, {
                                        puntosOtorgados: Number(editingAsistPuntos),
                                      });
                                      setEditingAsistId(null);
                                    }}
                                    className="px-2 py-0.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded font-bold text-[11px]"
                                  >
                                    ✓
                                  </button>
                                  <button
                                    onClick={() => setEditingAsistId(null)}
                                    className="px-1.5 py-0.5 bg-slate-700 text-slate-300 rounded text-[11px]"
                                  >
                                    ✕
                                  </button>
                                </div>
                              ) : (
                                <>
                                  <span className="text-emerald-400 font-bold">
                                    +{asist.puntosOtorgados} pts
                                  </span>
                                  <button
                                    onClick={() => {
                                      setEditingAsistId(asist.id);
                                      setEditingAsistPuntos(asist.puntosOtorgados);
                                    }}
                                    className="text-slate-400 hover:text-amber-300 text-xs p-1"
                                    title="Editar puntos de esta asistencia"
                                  >
                                    <Pencil className="w-3.5 h-3.5" />
                                  </button>
                                </>
                              )}
                              <button
                                onClick={() => {
                                  if (window.confirm('¿Eliminar definitivamente este registro de asistencia?')) {
                                    eliminarAsistencia(asist.id);
                                  }
                                }}
                                className="text-slate-500 hover:text-red-400 text-xs p-1"
                                title="Eliminar asistencia"
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
        </div>
      </div>
    </div>
  );
};
