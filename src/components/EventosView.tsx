import React, { useState } from 'react';
import { useApp } from '../lib/store';
import { Evento, Turno, Reto } from '../types';
import { ConectadoDetalleModal } from './ConectadoDetalleModal';
import {
  Calendar,
  Clock,
  QrCode,
  Sparkles,
  Trophy,
  Users,
  CheckCircle2,
  AlertCircle,
  Plus,
  Tv,
  ArrowRight,
  Trash2,
} from 'lucide-react';

interface EventosViewProps {
  onOpenQrProjector: (eventoId: string, turnoId?: string) => void;
  onOpenRegister: (eventoId: string, turnoId?: string) => void;
}

export const EventosView: React.FC<EventosViewProps> = ({
  onOpenQrProjector,
  onOpenRegister,
}) => {
  const {
    eventos,
    turnos,
    retos,
    asistencias,
    participacionesRetos,
    temporadaActiva,
    isAdmin,
    crearEvento,
    eliminarEvento,
    cambiarEstadoEvento,
  } = useApp();

  const [selectedEventoId, setSelectedEventoId] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // New Event Form State
  const [newNombre, setNewNombre] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newFecha, setNewFecha] = useState('2026-09-25');
  const [newPuntos, setNewPuntos] = useState(15);
  const [newTipo, setNewTipo] = useState<Evento['tipoEvento']>('asistencia');
  const [newUsaQr, setNewUsaQr] = useState(true);
  const [newUsaTurnos, setNewUsaTurnos] = useState(false);
  const [newTieneRetos, setNewTieneRetos] = useState(false);

  const seasonEvents = eventos.filter(
    (e) => e.temporadaId === temporadaActiva?.id
  );

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!temporadaActiva || !newNombre.trim()) return;

    crearEvento({
      nombre: newNombre.trim(),
      descripcion: newDesc.trim() || 'Evento de la DIAS League',
      fecha: newFecha,
      temporadaId: temporadaActiva.id,
      estado: 'programado',
      tipoEvento: newTipo,
      puntosAsistencia: Number(newPuntos),
      utilizaQr: newUsaQr,
      utilizaTurnos: newUsaTurnos,
      tieneRetos: newTieneRetos,
      lugar: 'Campus EAFIT',
    });

    setShowCreateModal(false);
    setNewNombre('');
    setNewDesc('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-xl">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase font-extrabold tracking-wider text-amber-400 bg-amber-500/10 border border-amber-500/30 px-2.5 py-0.5 rounded-full">
              Calendario Competitivo
            </span>
            <span className="text-xs text-slate-400 font-medium">
              {temporadaActiva?.nombre}
            </span>
          </div>
          <h2 className="text-2xl font-black text-white mt-1">
            Eventos y Retos Oficiales
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Cada evento genera puntos para participantes individuales y para sus Grupos de Trabajo (GTs)
          </p>
        </div>

        {isAdmin && (
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs sm:text-sm shadow-lg shadow-indigo-600/25 shrink-0"
          >
            <Plus className="w-4 h-4" />
            Crear Nuevo Evento
          </button>
        )}
      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {seasonEvents.map((evento) => {
          const eventoTurnos = turnos.filter((t) => t.eventoId === evento.id);
          const eventoRetos = retos.filter((r) => r.eventoId === evento.id);
          const eventoAsistencias = asistencias.filter(
            (a) => a.eventoId === evento.id && !a.anulado
          );

          const isActive = evento.estado === 'activo';
          const isDone = evento.estado === 'finalizado';

          return (
            <div
              key={evento.id}
              className={`bg-slate-900 border rounded-3xl p-6 shadow-lg flex flex-col justify-between transition-all duration-200 hover:-translate-y-1 ${
                isActive
                  ? 'border-amber-500/50 shadow-amber-500/10 ring-1 ring-amber-500/20'
                  : isDone
                  ? 'border-slate-800'
                  : 'border-slate-800/80'
              }`}
            >
              <div>
                {/* Status and Points Badge */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span
                    className={`text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${
                      isActive
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 animate-pulse'
                        : isDone
                        ? 'bg-slate-800 text-slate-400 border-slate-700'
                        : 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30'
                    }`}
                  >
                    {isActive ? '🟢 En Curso / Activo' : isDone ? 'Finalizado' : 'Programado'}
                  </span>

                  <span className="text-xs font-black px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    +{evento.puntosAsistencia} pts/asist.
                  </span>
                </div>

                {/* Title and Description */}
                <h3 className="text-xl font-extrabold text-white">{evento.nombre}</h3>
                <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                  {evento.descripcion}
                </p>

                {/* Details list */}
                <div className="mt-4 space-y-2 text-xs text-slate-300 border-t border-slate-800 pt-3">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" /> Fecha:
                    </span>
                    <span className="font-semibold text-slate-200">{evento.fecha}</span>
                  </div>

                  {evento.utilizaTurnos && (
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" /> Turnos QR:
                      </span>
                      <span className="font-bold text-amber-400">
                        {eventoTurnos.length} turnos configurados
                      </span>
                    </div>
                  )}

                  {evento.tieneRetos && (
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500 flex items-center gap-1">
                        <Sparkles className="w-3.5 h-3.5" /> Retos asociados:
                      </span>
                      <span className="font-bold text-purple-400">
                        {eventoRetos.length} retos
                      </span>
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 flex items-center gap-1">
                      <Users className="w-3.5 h-3.5" /> Asistencias registradas:
                    </span>
                    <span className="font-bold text-white">
                      {eventoAsistencias.length} participantes
                    </span>
                  </div>
                </div>

                {/* Shift Badges if any */}
                {eventoTurnos.length > 0 && (
                  <div className="mt-3 pt-2">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                      Turnos disponibles:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {eventoTurnos.map((t) => (
                        <span
                          key={t.id}
                          className={`text-[10px] px-2 py-0.5 rounded-md border font-medium ${
                            t.activo
                              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                              : 'bg-slate-800 text-slate-400 border-slate-700'
                          }`}
                        >
                          {t.nombre} ({t.horaInicio})
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="mt-6 pt-3 border-t border-slate-800 space-y-2">
                <button
                  onClick={() => setSelectedEventoId(evento.id)}
                  className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-black flex items-center justify-center gap-1.5 shadow-md shadow-indigo-600/20 transition-transform active:scale-[0.99]"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  <span>Gestionar Conectado, Retos y Calificación</span>
                </button>

                <div className="flex items-center gap-2">
                  {evento.utilizaQr && (
                    <button
                      onClick={() => onOpenQrProjector(evento.id)}
                      className="flex-1 py-2 px-3 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow"
                      title="Proyectar QR en pantalla grande"
                    >
                      <Tv className="w-3.5 h-3.5" />
                      <span>Ver QR</span>
                    </button>
                  )}

                  <button
                    onClick={() => onOpenRegister(evento.id)}
                    className="flex-1 py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 hover:text-white text-xs font-semibold flex items-center justify-center gap-1"
                  >
                    <span>Registrar</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => {
                      if (
                        window.confirm(
                          `¿Eliminar el evento "${evento.nombre}"?\n\nEsta acción eliminará el evento, sus turnos, asistencias y TODOS los retos y puntos vinculados.`
                        )
                      ) {
                        eliminarEvento(evento.id);
                      }
                    }}
                    className="p-2 rounded-xl bg-red-950/40 hover:bg-red-900 border border-red-800/80 text-red-400 hover:text-white transition-colors"
                    title="Eliminar evento y sus retos asociados"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal for Conectado Details, Challenges and Score Sheet */}
      {selectedEventoId && (
        <ConectadoDetalleModal
          eventoId={selectedEventoId}
          onClose={() => setSelectedEventoId(null)}
          onOpenQrProjector={onOpenQrProjector}
          onOpenRegister={onOpenRegister}
        />
      )}

      {/* Create Event Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-700 rounded-3xl p-6 shadow-2xl space-y-4 animate-fade-in">
            <h3 className="text-xl font-bold text-white">Crear Nuevo Evento</h3>

            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-400 mb-1">
                  Nombre del Evento
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej: EXPECTA DIAS, CONECTA2 (5)..."
                  value={newNombre}
                  onChange={(e) => setNewNombre(e.target.value)}
                  className="w-full bg-slate-800 text-white p-2.5 rounded-xl border border-slate-700 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-400 mb-1">
                  Descripción
                </label>
                <textarea
                  placeholder="Detalles de la actividad..."
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  rows={2}
                  className="w-full bg-slate-800 text-white p-2.5 rounded-xl border border-slate-700 text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-400 mb-1">
                    Fecha
                  </label>
                  <input
                    type="date"
                    required
                    value={newFecha}
                    onChange={(e) => setNewFecha(e.target.value)}
                    className="w-full bg-slate-800 text-white p-2 rounded-xl border border-slate-700 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-400 mb-1">
                    Puntos por Asistencia
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="5"
                    required
                    value={newPuntos}
                    onChange={(e) => setNewPuntos(Number(e.target.value))}
                    className="w-full bg-slate-800 text-white p-2 rounded-xl border border-slate-700 text-sm"
                  />
                </div>
              </div>

              {/* Toggles */}
              <div className="space-y-2 pt-2 border-t border-slate-800">
                <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newUsaQr}
                    onChange={(e) => setNewUsaQr(e.target.checked)}
                    className="rounded text-indigo-600"
                  />
                  <span>Utiliza código QR para asistencia</span>
                </label>

                <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newUsaTurnos}
                    onChange={(e) => setNewUsaTurnos(e.target.checked)}
                    className="rounded text-indigo-600"
                  />
                  <span>Utiliza turnos de asistencia (cada turno con QR diferente)</span>
                </label>

                <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newTieneRetos}
                    onChange={(e) => setNewTieneRetos(e.target.checked)}
                    className="rounded text-indigo-600"
                  />
                  <span>Tiene retos o desafíos adicionales</span>
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold"
                >
                  Guardar Evento
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
