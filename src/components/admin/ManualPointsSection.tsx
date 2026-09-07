import React, { useState, useEffect } from 'react';
import { useApp } from '../../lib/store';
import {
  Award,
  Users,
  Trophy,
  CheckCircle2,
  AlertTriangle,
  PlusCircle,
  Calendar,
  Sparkles,
  Info,
  RotateCcw,
  Trash2,
} from 'lucide-react';

export const ManualPointsSection: React.FC = () => {
  const {
    personas,
    gts,
    eventos,
    asistencias,
    participacionesRetos,
    registrarPuntosPersonaManual,
    registrarPuntosGtManual,
    anularAsistencia,
    anularParticipacionReto,
  } = useApp();

  const [mode, setMode] = useState<'persona' | 'gt'>('persona');

  // Form states - Persona mode
  const [selectedPersonaId, setSelectedPersonaId] = useState<string>(personas[0]?.id || '');
  const [selectedEventoId, setSelectedEventoId] = useState<string>(eventos[0]?.id || '');
  const [pointsValue, setPointsValue] = useState<number>(10);
  const [motivo, setMotivo] = useState<string>('Participación oficial');

  // Form states - Direct GT mode
  const [selectedGtId, setSelectedGtId] = useState<string>(gts[0]?.id || '');

  // Search filter for persona
  const [personaSearch, setPersonaSearch] = useState('');

  // Feedback
  const [feedback, setFeedback] = useState<{ tipo: 'success' | 'error'; mensaje: string } | null>(
    null
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Selected persona details
  const currentPersona = personas.find((p) => p.id === selectedPersonaId) || personas[0];
  const currentGt = gts.find((g) => g.id === (mode === 'persona' ? currentPersona?.gtId : selectedGtId));
  const currentEvento = eventos.find((e) => e.id === selectedEventoId) || eventos[0];

  // Auto-fill suggested points based on selected event rules:
  // CONECTA2 (1) -> 10, (2) -> 20, (3) -> 30, (4) -> 40, RETO -> 25
  useEffect(() => {
    if (!currentEvento) return;
    const name = currentEvento.nombre.toUpperCase();
    if (name.includes('CONECTA2') && name.includes('1')) {
      setPointsValue(10);
    } else if (name.includes('CONECTA2') && name.includes('2')) {
      setPointsValue(20);
    } else if (name.includes('CONECTA2') && name.includes('3')) {
      setPointsValue(30);
    } else if (name.includes('CONECTA2') && name.includes('4')) {
      setPointsValue(40);
    } else if (name.includes('RETO')) {
      setPointsValue(25);
    } else if (currentEvento.puntosAsistencia) {
      setPointsValue(currentEvento.puntosAsistencia);
    }
  }, [selectedEventoId, currentEvento]);

  // Keep selectedPersonaId valid if personas change
  useEffect(() => {
    if (personas.length > 0 && !personas.some((p) => p.id === selectedPersonaId)) {
      setSelectedPersonaId(personas[0].id);
    }
  }, [personas, selectedPersonaId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback(null);
    setIsSubmitting(true);

    try {
      if (mode === 'persona') {
        if (!selectedPersonaId) {
          throw new Error('Selecciona una persona para asignarle puntos.');
        }
        if (!currentPersona) {
          throw new Error('La persona seleccionada no es válida.');
        }
        if (!selectedEventoId) {
          throw new Error('Selecciona un evento.');
        }

        const res = await registrarPuntosPersonaManual({
          personaId: selectedPersonaId,
          gtId: currentPersona.gtId,
          eventoId: selectedEventoId,
          puntos: Number(pointsValue) || 0,
          motivo,
        });

        setFeedback({ tipo: 'success', mensaje: res.message });
      } else {
        if (!selectedGtId) {
          throw new Error('Selecciona un GT.');
        }
        if (!selectedEventoId) {
          throw new Error('Selecciona un evento.');
        }

        const res = await registrarPuntosGtManual({
          gtId: selectedGtId,
          eventoId: selectedEventoId,
          puntos: Number(pointsValue) || 0,
          motivo,
        });

        setFeedback({ tipo: 'success', mensaje: res.message });
      }
    } catch (err: any) {
      setFeedback({ tipo: 'error', mensaje: err.message || 'Error al registrar los puntos.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredPersonas = personas.filter((p) => {
    if (!personaSearch) return true;
    const q = personaSearch.toLowerCase();
    const gt = gts.find((g) => g.id === p.gtId);
    return (
      p.nombreCompleto.toLowerCase().includes(q) ||
      gt?.nombre.toLowerCase().includes(q) ||
      gt?.codigo.toLowerCase().includes(q)
    );
  });

  // Recent recorded points (both manual asistencias and GT challenge participations)
  const recentPoints = [
    ...asistencias
      .filter((a) => !a.anulado)
      .slice(0, 15)
      .map((a) => {
        const p = personas.find((per) => per.id === a.personaId);
        const g = gts.find((gt) => gt.id === a.gtId);
        const ev = eventos.find((e) => e.id === a.eventoId);
        return {
          id: a.id,
          tipo: 'asistencia' as const,
          titulo: p?.nombreCompleto || 'Persona',
          subtitulo: `GT ${g?.nombre || 'General'}`,
          gtColor: g?.color,
          eventoNombre: ev?.nombre || 'Evento',
          puntos: a.puntosOtorgados,
          fecha: a.fechaRegistro,
          origen: a.origen,
          motivo: a.anuladoMotivo,
        };
      }),
    ...participacionesRetos
      .filter((pr) => !pr.anulado)
      .slice(0, 15)
      .map((pr) => {
        const g = gts.find((gt) => gt.id === pr.gtId);
        const ev = eventos.find((e) => e.id === pr.eventoId);
        const p = pr.personaId ? personas.find((per) => per.id === pr.personaId) : null;
        return {
          id: pr.id,
          tipo: 'reto' as const,
          titulo: `GT ${g?.nombre || 'Grupo'}`,
          subtitulo: p ? `Individual (${p.nombreCompleto})` : 'Bonificación directa GT',
          gtColor: g?.color,
          eventoNombre: ev?.nombre || 'Evento / Reto',
          puntos: pr.puntosOtorgados,
          fecha: pr.fechaRegistro,
          origen: 'manual',
          motivo: pr.observacion,
        };
      }),
  ].sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-7 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                <Award className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-black text-white tracking-tight">
                Registrar Puntos Manualmente
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-xl">
              Asigna puntos a una persona (sumará a su ranking personal y al de su GT) o directamente a un GT completo.
              La tabla de posiciones y el podio se recalculan de inmediato.
            </p>
          </div>

          {/* Mode Switcher */}
          <div className="flex items-center p-1 bg-slate-800/80 rounded-2xl border border-slate-700/80 shrink-0">
            <button
              type="button"
              onClick={() => setMode('persona')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                mode === 'persona'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>Por Persona</span>
            </button>
            <button
              type="button"
              onClick={() => setMode('gt')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                mode === 'gt'
                  ? 'bg-amber-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Trophy className="w-3.5 h-3.5" />
              <span>Directo a GT</span>
            </button>
          </div>
        </div>
      </div>

      {/* Feedback alert */}
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
            className="text-xs opacity-70 hover:opacity-100 font-bold"
          >
            Cerrar
          </button>
        </div>
      )}

      {/* Main Form Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Registration Form (2 cols) */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-7 shadow-xl lg:col-span-2 space-y-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* MODE PERSONA: Select Persona & show auto-filled GT */}
            {mode === 'persona' ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-indigo-400" />
                    1. Seleccionar Persona
                  </label>
                  {personas.length === 0 && (
                    <span className="text-xs text-amber-400 font-medium">
                      No hay personas registradas todavía.
                    </span>
                  )}
                </div>

                {personas.length > 0 ? (
                  <div className="space-y-2">
                    <input
                      type="text"
                      placeholder="Filtrar por nombre o GT..."
                      value={personaSearch}
                      onChange={(e) => setPersonaSearch(e.target.value)}
                      className="w-full bg-slate-800/90 text-xs text-white px-3.5 py-2 rounded-xl border border-slate-700 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />

                    <select
                      id="select-persona-puntos"
                      value={selectedPersonaId}
                      onChange={(e) => setSelectedPersonaId(e.target.value)}
                      className="w-full bg-slate-800 text-sm text-white px-3.5 py-2.5 rounded-xl border border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      {filteredPersonas.map((p) => {
                        const gt = gts.find((g) => g.id === p.gtId);
                        return (
                          <option key={p.id} value={p.id}>
                            {p.nombreCompleto} — GT {gt?.nombre || 'General'}
                          </option>
                        );
                      })}
                    </select>

                    {/* Auto-filled GT display badge */}
                    {currentPersona && currentGt && (
                      <div className="p-3 bg-slate-800/60 rounded-xl border border-slate-700/70 flex items-center justify-between text-xs">
                        <span className="text-slate-400">Grupo de Trabajo vinculado:</span>
                        <div className="flex items-center gap-2">
                          <span
                            className="w-2.5 h-2.5 rounded-full"
                            style={{ backgroundColor: currentGt.color }}
                          />
                          <strong className="text-white font-bold">{currentGt.nombre}</strong>
                          <span className="px-1.5 py-0.5 rounded bg-slate-900 font-mono text-[10px] text-slate-300">
                            {currentGt.codigo}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="p-4 bg-slate-800/40 rounded-2xl border border-dashed border-slate-700 text-center text-xs text-slate-400">
                    Importa personas desde la pestaña <strong className="text-emerald-400">Importar personas</strong> o crea una en <strong className="text-indigo-400">Integrantes</strong> para comenzar a asignar puntos.
                  </div>
                )}
              </div>
            ) : (
              /* MODE GT: Select GT directly */
              <div className="space-y-3">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Trophy className="w-3.5 h-3.5 text-amber-400" />
                  1. Seleccionar Grupo de Trabajo (GT)
                </label>
                <select
                  id="select-gt-puntos"
                  value={selectedGtId}
                  onChange={(e) => setSelectedGtId(e.target.value)}
                  className="w-full bg-slate-800 text-sm text-white px-3.5 py-2.5 rounded-xl border border-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-500"
                >
                  {gts.map((gt) => (
                    <option key={gt.id} value={gt.id}>
                      {gt.nombre} ({gt.codigo})
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Event Selection */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-purple-400" />
                2. Evento o Actividad
              </label>
              <select
                id="select-evento-puntos"
                value={selectedEventoId}
                onChange={(e) => setSelectedEventoId(e.target.value)}
                className="w-full bg-slate-800 text-sm text-white px-3.5 py-2.5 rounded-xl border border-slate-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                {eventos.map((ev) => (
                  <option key={ev.id} value={ev.id}>
                    {ev.nombre} ({ev.fecha})
                  </option>
                ))}
              </select>
            </div>

            {/* Points & Quick Pre-fills */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  3. Puntos a Asignar
                </label>
                <span className="text-[11px] text-slate-400">Regla oficial DIAS LEAGUE</span>
              </div>

              {/* Quick prefill buttons */}
              <div className="flex flex-wrap items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setPointsValue(10)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold border transition-colors ${
                    pointsValue === 10
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/50'
                      : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'
                  }`}
                >
                  10 pts (CONECTA2 1 / EXPECTA)
                </button>
                <button
                  type="button"
                  onClick={() => setPointsValue(20)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold border transition-colors ${
                    pointsValue === 20
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/50'
                      : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'
                  }`}
                >
                  20 pts (CONECTA2 2)
                </button>
                <button
                  type="button"
                  onClick={() => setPointsValue(25)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold border transition-colors ${
                    pointsValue === 25
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/50'
                      : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'
                  }`}
                >
                  25 pts (RETO)
                </button>
                <button
                  type="button"
                  onClick={() => setPointsValue(30)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold border transition-colors ${
                    pointsValue === 30
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/50'
                      : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'
                  }`}
                >
                  30 pts (CONECTA2 3)
                </button>
                <button
                  type="button"
                  onClick={() => setPointsValue(40)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold border transition-colors ${
                    pointsValue === 40
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/50'
                      : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'
                  }`}
                >
                  40 pts (CONECTA2 4)
                </button>
              </div>

              <input
                id="input-puntos-valor"
                type="number"
                min="1"
                max="500"
                value={pointsValue}
                onChange={(e) => setPointsValue(Number(e.target.value))}
                className="w-full bg-slate-800 text-xl font-black text-amber-300 px-4 py-2.5 rounded-xl border border-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            {/* Motivo / Observación */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                4. Motivo u Observación (Opcional)
              </label>
              <input
                type="text"
                placeholder="Ej. Asistencia oficial, Ganador de dinámica..."
                value={motivo}
                onChange={(e) => setMotivo(e.target.value)}
                className="w-full bg-slate-800 text-xs text-white px-3.5 py-2.5 rounded-xl border border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Submit Button */}
            <button
              id="btn-guardar-puntos"
              type="submit"
              disabled={isSubmitting || (mode === 'persona' && personas.length === 0)}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 disabled:opacity-40 disabled:cursor-not-allowed text-slate-950 font-black text-sm shadow-xl shadow-amber-500/20 flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <CheckCircle2 className="w-5 h-5" />
              <span>
                {mode === 'persona'
                  ? `Guardar +${pointsValue} Puntos a la Persona y a su GT`
                  : `Guardar +${pointsValue} Puntos Directos al GT`}
              </span>
            </button>
          </form>
        </div>

        {/* Rule explanation & Live Factor preview (1 col) */}
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
            <h4 className="text-base font-bold text-white flex items-center gap-2">
              <Info className="w-4 h-4 text-amber-400" />
              Impacto en el Ranking
            </h4>

            <div className="space-y-3 text-xs text-slate-300">
              <div className="p-3 bg-slate-800/60 rounded-xl border border-slate-700/60">
                <span className="font-bold text-amber-300 block mb-1">Para el GT:</span>
                <p className="text-slate-400">
                  Los puntos sumados incrementan los Puntos Brutos del GT y se multiplican por su <strong className="text-slate-200">Factor de Tamaño</strong> para definir los <strong className="text-amber-300">DIAS Points</strong> oficiales.
                </p>
              </div>

              {mode === 'persona' && (
                <div className="p-3 bg-slate-800/60 rounded-xl border border-slate-700/60">
                  <span className="font-bold text-indigo-300 block mb-1">Para la Persona:</span>
                  <p className="text-slate-400">
                    Suma directamente a sus puntos personales para el <strong className="text-slate-200">Ranking Individual</strong> (sin factor de tamaño).
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Recent Points Registered History */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-7 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-base font-bold text-white flex items-center gap-2">
            <Award className="w-4 h-4 text-amber-400" />
            Historial Reciente de Puntos Registrados ({recentPoints.length})
          </h4>
          <span className="text-xs text-slate-500">
            {recentPoints.length === 0 ? 'No hay participaciones registradas todavía.' : 'Últimos registros'}
          </span>
        </div>

        {recentPoints.length === 0 ? (
          <div className="py-10 text-center border border-dashed border-slate-800 rounded-2xl">
            <p className="text-xs text-slate-500">No hay participaciones registradas todavía.</p>
          </div>
        ) : (
          <div className="max-h-72 overflow-y-auto divide-y divide-slate-800/80">
            {recentPoints.map((item) => (
              <div
                key={item.id}
                className="py-3 flex items-center justify-between gap-3 text-xs"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-3 h-3 rounded-full shrink-0"
                    style={{ backgroundColor: item.gtColor || '#F59E0B' }}
                  />
                  <div>
                    <span className="font-bold text-white block">{item.titulo}</span>
                    <span className="text-slate-400 text-[11px]">
                      {item.subtitulo} • {item.eventoNombre}
                      {item.motivo ? ` (${item.motivo})` : ''}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="font-black text-sm text-amber-300">
                    +{item.puntos} pts
                  </span>
                  <button
                    onClick={() => {
                      if (window.confirm('¿Deseas anular estos puntos asignados?')) {
                        if (item.tipo === 'asistencia') {
                          anularAsistencia(item.id, 'Anulación manual desde historial');
                        } else {
                          anularParticipacionReto(item.id);
                        }
                      }
                    }}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-950/30 transition-colors"
                    title="Anular puntos"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
