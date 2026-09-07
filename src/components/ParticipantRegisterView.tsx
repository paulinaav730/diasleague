import React, { useState, useMemo } from 'react';
import confetti from 'canvas-confetti';
import { useApp } from '../lib/store';
import {
  UserCheck,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Sparkles,
  Trophy,
  Users,
  Shield,
  Search,
} from 'lucide-react';

interface ParticipantRegisterViewProps {
  initialEventoId?: string;
  initialTurnoId?: string;
  initialToken?: string;
  onViewRanking: () => void;
  onViewGt: (gtId: string) => void;
}

export const ParticipantRegisterView: React.FC<ParticipantRegisterViewProps> = ({
  initialEventoId,
  initialTurnoId,
  onViewRanking,
}) => {
  const {
    eventos,
    turnos,
    personas,
    gts,
    temporadaActiva,
    registrarAsistencia,
    asistencias,
  } = useApp();

  // Find active event and shift
  const defaultEvent =
    eventos.find((e) => e.id === initialEventoId) ||
    eventos.find((e) => e.estado === 'activo' && e.utilizaQr) ||
    eventos.find((e) => e.estado === 'activo') ||
    eventos[0];

  const [selectedEventoId, setSelectedEventoId] = useState<string>(
    defaultEvent?.id || ''
  );

  const activeEvento = eventos.find((e) => e.id === selectedEventoId) || defaultEvent;
  const availableTurnos = turnos.filter((t) => t.eventoId === activeEvento?.id);

  const defaultTurno =
    availableTurnos.find((t) => t.id === initialTurnoId) ||
    availableTurnos.find((t) => t.activo) ||
    availableTurnos[0];

  const [selectedTurnoId, setSelectedTurnoId] = useState<string>(
    defaultTurno?.id || ''
  );

  const activeTurno =
    availableTurnos.find((t) => t.id === selectedTurnoId) || defaultTurno;

  // Simple Name + GT Form State
  const [nombre, setNombre] = useState('');
  const [selectedGtId, setSelectedGtId] = useState<string>(gts[0]?.id || '');
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Result and feedback states
  const [submitted, setSubmitted] = useState(false);
  const [resultData, setResultData] = useState<{
    success: boolean;
    message: string;
    puntos?: number;
    gtNombre?: string;
    personaNombre?: string;
  } | null>(null);

  // Autocomplete matching names from database for ease of typing
  const matchingPersonas = useMemo(() => {
    if (!nombre.trim() || nombre.trim().length < 2) return [];
    const q = nombre.toLowerCase().trim();
    return personas
      .filter((p) => p.activo && p.nombreCompleto.toLowerCase().includes(q))
      .slice(0, 5);
  }, [personas, nombre]);

  // DUPLICATE PARTICIPATION CHECK IN REAL-TIME
  const duplicateStatus = useMemo(() => {
    if (!nombre.trim() || !selectedGtId || !activeEvento || !temporadaActiva) return null;

    const cleanName = nombre.trim().toLowerCase();
    const existingPersona = personas.find(
      (p) => p.gtId === selectedGtId && p.nombreCompleto.trim().toLowerCase() === cleanName
    );

    if (!existingPersona) return null;

    const existingAsist = asistencias.find((a) => {
      if (a.anulado) return false;
      if (a.personaId !== existingPersona.id) return false;
      if (a.eventoId !== activeEvento.id) return false;
      if (a.temporadaId !== temporadaActiva.id) return false;

      if (activeEvento.utilizaTurnos && activeTurno) {
        return a.turnoId === activeTurno.id;
      }
      return true;
    });

    return existingAsist;
  }, [nombre, selectedGtId, activeEvento, activeTurno, temporadaActiva, personas, asistencias]);

  const handleSelectSuggestion = (p: typeof personas[0]) => {
    setNombre(p.nombreCompleto);
    setSelectedGtId(p.gtId);
    setShowSuggestions(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!nombre.trim()) {
      alert('Por favor ingresa tu nombre completo.');
      return;
    }

    if (!selectedGtId) {
      alert('Por favor selecciona tu Grupo de Trabajo (GT).');
      return;
    }

    if (!activeEvento) {
      alert('No hay un evento seleccionado.');
      return;
    }

    const res = registrarAsistencia({
      nombreCompleto: nombre.trim(),
      gtId: selectedGtId,
      eventoId: activeEvento.id,
      turnoId: activeTurno?.id || null,
      origen: 'qr',
    });

    setResultData(res);
    setSubmitted(true);

    if (res.success) {
      // Vibrant celebration confetti
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#F59E0B', '#10B981', '#6366F1', '#EC4899', '#3B82F6'],
      });
    }
  };

  const selectedGt = gts.find((g) => g.id === selectedGtId);

  return (
    <div className="w-full max-w-2xl mx-auto py-4 px-4 sm:px-6">
      {/* Container Card */}
      <div className="bg-slate-900 border-2 border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        {/* Glow ambient */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Brand Bar */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-amber-500 text-slate-950 flex items-center justify-center font-black text-sm">
              DL
            </span>
            <div>
              <span className="text-xs font-black tracking-wider uppercase text-amber-400 block">
                DIAS LEAGUE • EAFIT
              </span>
              <span className="text-[11px] text-slate-400">
                Registro Express por QR (Solo Nombre y GT)
              </span>
            </div>
          </div>
          <span className="text-xs px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 font-semibold border border-slate-700">
            {temporadaActiva?.nombre}
          </span>
        </div>

        {/* Event & Shift Auto-Detected Summary Box */}
        <div className="bg-gradient-to-r from-slate-800/90 to-slate-800/50 border border-slate-700 rounded-2xl p-4 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 block">
                  Conectado / Evento
                </span>
                {eventos.length > 1 && (
                  <select
                    value={selectedEventoId}
                    onChange={(e) => {
                      setSelectedEventoId(e.target.value);
                      setSubmitted(false);
                    }}
                    className="bg-slate-900 text-slate-300 text-[11px] font-semibold border border-slate-700 rounded px-2 py-0.5"
                  >
                    {eventos.map((ev) => (
                      <option key={ev.id} value={ev.id}>
                        {ev.nombre} ({ev.puntosAsistencia} pts)
                      </option>
                    ))}
                  </select>
                )}
              </div>
              <h2 className="text-xl font-black text-white mt-0.5">
                {activeEvento?.nombre}
              </h2>
              {activeTurno && (
                <div className="flex items-center gap-2 mt-1 text-xs text-slate-300">
                  <span className="font-bold text-amber-300">{activeTurno.nombre}</span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    {activeTurno.horaInicio} - {activeTurno.horaFin}
                  </span>
                </div>
              )}
            </div>

            {/* Points Award Badge */}
            <div className="flex items-center gap-2 bg-amber-500/20 border border-amber-500/40 rounded-xl px-3.5 py-2 shrink-0">
              <Sparkles className="w-5 h-5 text-amber-400" />
              <div>
                <span className="text-xs text-amber-200 block font-semibold">Otorga</span>
                <span className="text-lg font-black text-amber-300">
                  +{activeEvento?.puntosAsistencia} DIAS Points
                </span>
              </div>
            </div>
          </div>

          {/* Shift selector toggle if multiple shifts */}
          {availableTurnos.length > 1 && (
            <div className="mt-3 pt-3 border-t border-slate-700/60 flex items-center gap-2 text-xs">
              <span className="text-slate-400">Turno activo:</span>
              <select
                value={activeTurno?.id}
                onChange={(e) => {
                  setSelectedTurnoId(e.target.value);
                  setSubmitted(false);
                }}
                className="bg-slate-900 text-slate-200 border border-slate-700 rounded-lg px-2 py-1 text-xs"
              >
                {availableTurnos.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.nombre} ({t.horaInicio} - {t.horaFin}) {t.activo ? '🟢' : ''}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* SUBMISSION RESULT CELEBRATION */}
        {submitted && resultData ? (
          <div className="text-center py-6 animate-fade-in">
            {resultData.success ? (
              <div className="space-y-4">
                <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 rounded-2xl flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20">
                  <CheckCircle2 className="w-10 h-10" />
                </div>

                <div>
                  <h3 className="text-2xl font-black text-white">
                    ¡Asistencia Registrada!
                  </h3>
                  <p className="text-base text-amber-300 font-bold mt-1">
                    +{resultData.puntos} DIAS Points sumados a tu GT
                  </p>
                  <p className="text-sm text-slate-300 mt-1">
                    Tu participación se ha contabilizado para la asistencia y el Resultado General del Conectado.
                  </p>
                </div>

                <div className="p-4 bg-slate-800/80 rounded-2xl border border-slate-700 max-w-sm mx-auto text-left text-xs space-y-1 text-slate-300">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Integrante:</span>
                    <span className="font-bold text-white">{resultData.personaNombre || nombre}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Grupo de Trabajo (GT):</span>
                    <span className="font-bold text-amber-400">{resultData.gtNombre || selectedGt?.nombre}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Conectado / Evento:</span>
                    <span>{activeEvento?.nombre}</span>
                  </div>
                  {activeTurno && (
                    <div className="flex justify-between">
                      <span className="text-slate-400">Turno:</span>
                      <span>{activeTurno.nombre}</span>
                    </div>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
                  <button
                    onClick={onViewRanking}
                    className="w-full sm:w-auto px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2"
                  >
                    <Trophy className="w-4 h-4 text-amber-300" />
                    Ver Podio y Resultados
                  </button>
                  <button
                    onClick={() => {
                      setSubmitted(false);
                      setNombre('');
                    }}
                    className="w-full sm:w-auto px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-semibold"
                  >
                    Registrar a otro integrante
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="w-16 h-16 bg-red-500/20 text-red-400 border border-red-500/40 rounded-2xl flex items-center justify-center mx-auto">
                  <AlertTriangle className="w-10 h-10" />
                </div>
                <h3 className="text-xl font-black text-white">
                  No se pudo registrar
                </h3>
                <p className="text-sm text-red-300 max-w-md mx-auto">
                  {resultData.message}
                </p>
                <div className="pt-2">
                  <button
                    onClick={() => setSubmitted(false)}
                    className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-sm font-semibold"
                  >
                    Reintentar
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          /* SIMPLIFIED FORM: NAME + GT ONLY */
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Field 1: Name with smart suggestion */}
            <div className="relative">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                1. Tu Nombre Completo
              </label>

              <div className="relative">
                <input
                  id="input-persona-nombre"
                  type="text"
                  placeholder="Ej. Sofia Gomez, Juan David Perez..."
                  value={nombre}
                  onChange={(e) => {
                    setNombre(e.target.value);
                    setShowSuggestions(true);
                  }}
                  onFocus={() => setShowSuggestions(true)}
                  className="w-full bg-slate-800 text-white px-4 py-3.5 rounded-2xl border border-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-500 text-base font-medium placeholder-slate-500 shadow-inner"
                  required
                />
              </div>

              {/* Suggestions dropdown if matches known member */}
              {showSuggestions && matchingPersonas.length > 0 && (
                <div className="absolute z-30 left-0 right-0 mt-1.5 bg-slate-800 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden divide-y divide-slate-700/60">
                  <div className="px-3 py-1.5 bg-slate-850 text-[11px] font-bold text-slate-400">
                    Sugerencias de integrantes:
                  </div>
                  {matchingPersonas.map((p) => {
                    const gt = gts.find((g) => g.id === p.gtId);
                    return (
                      <div
                        key={p.id}
                        onClick={() => handleSelectSuggestion(p)}
                        className="p-3 hover:bg-slate-700 cursor-pointer flex items-center justify-between transition-colors"
                      >
                        <span className="font-semibold text-white text-sm">
                          {p.nombreCompleto}
                        </span>
                        <span
                          className="text-xs px-2.5 py-0.5 rounded-full text-white font-bold"
                          style={{ backgroundColor: gt?.color || '#475569' }}
                        >
                          {gt?.nombre}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Field 2: GT Selection */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                2. Selecciona tu Grupo de Trabajo (GT)
              </label>

              {/* GT Grid buttons for instant 1-tap selection on mobile or desktop */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {gts.map((gt) => {
                  const isSelected = selectedGtId === gt.id;
                  return (
                    <button
                      key={gt.id}
                      type="button"
                      onClick={() => setSelectedGtId(gt.id)}
                      className={`p-3 rounded-2xl border text-left transition-all flex items-center gap-2.5 ${
                        isSelected
                          ? 'bg-slate-800 ring-2 ring-amber-400 border-amber-400/80 shadow-lg scale-[1.02]'
                          : 'bg-slate-800/60 border-slate-700/80 hover:bg-slate-800 hover:border-slate-600'
                      }`}
                    >
                      <div
                        className="w-8 h-8 rounded-xl flex items-center justify-center text-white font-black text-xs shrink-0 shadow"
                        style={{ backgroundColor: gt.color }}
                      >
                        {gt.codigo}
                      </div>
                      <div className="min-w-0">
                        <span className="text-xs font-extrabold text-white block truncate uppercase tracking-wide">
                          {gt.nombre}
                        </span>
                        <span className="text-[10px] text-slate-400 block">
                          {gt.totalIntegrantes} miembros
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Selected GT Confirmation Banner */}
            {selectedGt && (
              <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700 flex items-center justify-between text-xs">
                <span className="text-slate-300">
                  GT seleccionado:{' '}
                  <strong className="text-white font-black uppercase tracking-wide">{selectedGt.nombre}</strong>
                </span>
                <span
                  className="px-2.5 py-0.5 rounded-full text-white text-[11px] font-extrabold"
                  style={{ backgroundColor: selectedGt.color }}
                >
                  {selectedGt.codigo}
                </span>
              </div>
            )}

            {/* DUPLICATE WARNING */}
            {duplicateStatus && (
              <div className="p-4 bg-red-950/50 border-2 border-red-500/70 rounded-2xl flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-red-200 text-sm">
                    Ya registraste tu asistencia para este Conectado
                  </h4>
                  <p className="text-xs text-red-300/90 mt-0.5">
                    El sistema protege la integridad de la liga impidiendo registros duplicados para una misma persona y evento.
                  </p>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <div className="pt-2">
              <button
                id="btn-confirmar-asistencia"
                type="submit"
                disabled={!nombre.trim() || !selectedGtId || !!duplicateStatus}
                className={`w-full py-4 px-6 rounded-2xl font-black text-base shadow-xl flex items-center justify-center gap-2 transition-all ${
                  duplicateStatus
                    ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                    : nombre.trim() && selectedGtId
                    ? 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 shadow-amber-500/25 hover:scale-[1.01] cursor-pointer'
                    : 'bg-slate-800 text-slate-400 border border-slate-700 cursor-not-allowed'
                }`}
              >
                <CheckCircle2 className="w-5 h-5" />
                <span>Confirmar Mi Asistencia (+{activeEvento?.puntosAsistencia} pts)</span>
              </button>
            </div>
          </form>
        )}

        {/* Security Footer */}
        <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500">
          <span className="flex items-center gap-1">
            <Shield className="w-3.5 h-3.5 text-slate-400" />
            Sin necesidad de contraseña • Sistema de Integridad DIAS LEAGUE
          </span>
          <span>EAFIT 2026</span>
        </div>
      </div>
    </div>
  );
};
