import React, { useState, useMemo, useEffect } from 'react';
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
  Calendar,
  CalendarDays,
  Check,
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

  // Read URL query params immediately and safely
  const urlParams = useMemo(() => {
    if (typeof window !== 'undefined') {
      return new URLSearchParams(window.location.search);
    }
    return null;
  }, []);

  const urlEventoId = urlParams?.get('eventoId');
  const urlTurnoId = urlParams?.get('turnoId');

  const resolvedInitialEventoId = useMemo(() => {
    if (initialEventoId && initialEventoId !== 'undefined' && initialEventoId !== 'null') {
      return initialEventoId;
    }
    if (urlEventoId && urlEventoId !== 'undefined' && urlEventoId !== 'null') {
      return urlEventoId;
    }
    return undefined;
  }, [initialEventoId, urlEventoId]);

  const resolvedInitialTurnoId = useMemo(() => {
    if (initialTurnoId && initialTurnoId !== 'undefined' && initialTurnoId !== 'null') {
      return initialTurnoId;
    }
    if (urlTurnoId && urlTurnoId !== 'undefined' && urlTurnoId !== 'null') {
      return urlTurnoId;
    }
    return undefined;
  }, [initialTurnoId, urlTurnoId]);

  // Find active event - prioritize EXPECTA DIAS
  const defaultEvent = useMemo(() => {
    if (resolvedInitialEventoId) {
      const found = eventos.find((e) => e.id === resolvedInitialEventoId);
      if (found) return found;
    }
    const expecta = eventos.find((e) => e.id === 'eve-expecta-dias');
    if (expecta) return expecta;

    const eventWithActiveTurno = turnos.find((t) => t.activo)?.eventoId;
    if (eventWithActiveTurno) {
      const found = eventos.find((e) => e.id === eventWithActiveTurno);
      if (found) return found;
    }
    return (
      eventos.find((e) => e.estado === 'activo') ||
      eventos[0]
    );
  }, [resolvedInitialEventoId, eventos, turnos]);

  const [selectedEventoId, setSelectedEventoId] = useState<string>(
    defaultEvent?.id || ''
  );

  // Sync selectedEventoId when resolvedInitialEventoId changes
  useEffect(() => {
    if (resolvedInitialEventoId && eventos.some((e) => e.id === resolvedInitialEventoId)) {
      setSelectedEventoId(resolvedInitialEventoId);
    }
  }, [resolvedInitialEventoId, eventos]);

  const activeEvento = eventos.find((e) => e.id === selectedEventoId) || defaultEvent;
  const availableTurnos = useMemo(() => {
    return turnos.filter((t) => t.eventoId === activeEvento?.id);
  }, [turnos, activeEvento?.id]);

  const defaultTurno = useMemo(() => {
    if (resolvedInitialTurnoId) {
      const found = availableTurnos.find((t) => t.id === resolvedInitialTurnoId);
      if (found) return found;
    }
    return (
      availableTurnos.find((t) => t.activo) ||
      availableTurnos[0]
    );
  }, [resolvedInitialTurnoId, availableTurnos]);

  const [selectedTurnoId, setSelectedTurnoId] = useState<string>(
    defaultTurno?.id || ''
  );

  // Sync selectedTurnoId when resolvedInitialTurnoId changes or availableTurnos changes
  useEffect(() => {
    if (resolvedInitialTurnoId && availableTurnos.some((t) => t.id === resolvedInitialTurnoId)) {
      setSelectedTurnoId(resolvedInitialTurnoId);
      return;
    }
    const active = availableTurnos.find((t) => t.activo);
    if (active) {
      setSelectedTurnoId(active.id);
    } else if (availableTurnos.length > 0) {
      setSelectedTurnoId(availableTurnos[0].id);
    } else {
      setSelectedTurnoId('');
    }
  }, [resolvedInitialTurnoId, availableTurnos, selectedEventoId]);

  const activeTurno =
    availableTurnos.find((t) => t.id === selectedTurnoId) || defaultTurno;

  // Day filter for events with multiple days like EXPECTA DIAS
  const [selectedDiaFilter, setSelectedDiaFilter] = useState<string>('todos');

  // Extract distinct days from available turnos
  const distinctDias = useMemo(() => {
    if (!availableTurnos.length) return [];
    const set = new Set<string>();
    availableTurnos.forEach((t) => {
      const parts = t.nombre.split('•');
      if (parts[0]) set.add(parts[0].trim());
    });
    return Array.from(set);
  }, [availableTurnos]);

  const filteredTurnos = useMemo(() => {
    if (selectedDiaFilter === 'todos') return availableTurnos;
    return availableTurnos.filter((t) => t.nombre.startsWith(selectedDiaFilter));
  }, [availableTurnos, selectedDiaFilter]);

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

  // Shifts already attended by this person in this event
  const personaShiftsInEvent = useMemo(() => {
    if (!nombre.trim() || !selectedGtId || !activeEvento) return new Set<string>();
    const cleanName = nombre.trim().toLowerCase();
    const existingPersona = personas.find(
      (p) => p.gtId === selectedGtId && p.nombreCompleto.trim().toLowerCase() === cleanName
    );
    if (!existingPersona) return new Set<string>();

    const set = new Set<string>();
    asistencias
      .filter((a) => !a.anulado && a.personaId === existingPersona.id && a.eventoId === activeEvento.id)
      .forEach((a) => {
        if (a.turnoId) set.add(a.turnoId);
      });
    return set;
  }, [nombre, selectedGtId, activeEvento, personas, asistencias]);

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
                Registro Express de Asistencia
              </span>
            </div>
          </div>
          <span className="text-xs px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 font-semibold border border-slate-700">
            {temporadaActiva?.nombre}
          </span>
        </div>

        {/* STEP 1: EVENT SELECTOR */}
        <div className="mb-6">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
            Paso 1: Selecciona el Evento
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {eventos.map((ev) => {
              const isSelected = ev.id === activeEvento?.id;
              const isExpecta = ev.id === 'eve-expecta-dias' || ev.utilizaTurnos;
              return (
                <button
                  key={ev.id}
                  type="button"
                  onClick={() => {
                    setSelectedEventoId(ev.id);
                    setSubmitted(false);
                  }}
                  className={`p-3 rounded-2xl border text-left transition-all cursor-pointer relative overflow-hidden ${
                    isSelected
                      ? 'bg-gradient-to-br from-amber-500/20 to-orange-500/10 border-amber-500 ring-2 ring-amber-500/30 shadow-lg shadow-amber-500/10'
                      : 'bg-slate-800/80 hover:bg-slate-800 border-slate-700 text-slate-300 hover:border-slate-600'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span
                      className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full ${
                        isExpecta
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                          : ev.estado === 'activo'
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                          : 'bg-slate-700 text-slate-400'
                      }`}
                    >
                      {isExpecta ? '⚡ Turnos QR' : ev.estado}
                    </span>
                    <span className="text-[11px] font-black text-amber-400">
                      +{ev.puntosAsistencia} pts
                    </span>
                  </div>
                  <h4 className={`text-sm font-black truncate ${isSelected ? 'text-white' : 'text-slate-200'}`}>
                    {ev.nombre}
                  </h4>
                  <p className="text-[11px] text-slate-400 mt-0.5 truncate">
                    {isExpecta ? '5 días • Varios turnos' : ev.fecha}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* STEP 2: SHIFT SELECTOR (FOR EVENTS WITH TURNOS, LIKE EXPECTA DIAS) */}
        {activeEvento?.utilizaTurnos && availableTurnos.length > 0 && (
          <div className="mb-6 bg-slate-850/90 border border-slate-700/80 rounded-2xl p-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-amber-400">
                  Paso 2: Selecciona el Turno al que Asististe
                </label>
                <p className="text-[11px] text-slate-400">
                  {activeTurno
                    ? `Turno actual: ${activeTurno.nombre} (${activeTurno.horaInicio} - ${activeTurno.horaFin})`
                    : 'Selecciona tu turno de asistencia'}
                </p>
              </div>

              {/* Day Quick Filters */}
              {distinctDias.length > 1 && (
                <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0">
                  <button
                    type="button"
                    onClick={() => setSelectedDiaFilter('todos')}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer shrink-0 ${
                      selectedDiaFilter === 'todos'
                        ? 'bg-amber-500 text-slate-950 shadow-sm shadow-amber-500/20'
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    Todos
                  </button>
                  {distinctDias.map((d) => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => setSelectedDiaFilter(d)}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer shrink-0 ${
                        selectedDiaFilter === d
                          ? 'bg-amber-500 text-slate-950 shadow-sm shadow-amber-500/20'
                          : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                      }`}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Turnos Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-56 overflow-y-auto pr-1">
              {filteredTurnos.map((t) => {
                const isSelected = t.id === activeTurno?.id;
                const hasAttendedThis = personaShiftsInEvent.has(t.id);
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => {
                      setSelectedTurnoId(t.id);
                      setSubmitted(false);
                    }}
                    className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between ${
                      isSelected
                        ? 'bg-amber-500/20 border-amber-400 text-white ring-2 ring-amber-500/30'
                        : 'bg-slate-800/80 hover:bg-slate-800 border-slate-700/60 text-slate-300'
                    }`}
                  >
                    <div className="truncate mr-2">
                      <div className="flex items-center gap-1.5">
                        <Clock className={`w-3.5 h-3.5 shrink-0 ${isSelected ? 'text-amber-400' : 'text-slate-400'}`} />
                        <span className="font-bold text-xs truncate">{t.nombre}</span>
                      </div>
                      <span className="text-[10px] text-slate-400 block ml-5">
                        {t.horaInicio} - {t.horaFin}
                      </span>
                    </div>

                    <div className="shrink-0 flex items-center gap-1">
                      {hasAttendedThis && (
                        <span className="text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-1.5 py-0.5 rounded">
                          Registrado ✓
                        </span>
                      )}
                      {isSelected && (
                        <span className="w-5 h-5 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center font-black text-xs">
                          ✓
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

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
              <div className="p-4 bg-amber-950/40 border-2 border-amber-500/70 rounded-2xl flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-amber-200 text-sm">
                    {activeEvento?.utilizaTurnos
                      ? `Ya tienes asistencia registrada para ${activeTurno?.nombre}`
                      : 'Ya registraste tu asistencia para este Conectado'}
                  </h4>
                  <p className="text-xs text-amber-300/90 mt-0.5">
                    {activeEvento?.utilizaTurnos
                      ? 'Si participaste en otro turno de EXPECTA DIAS, puedes seleccionarlo en el Paso 2 arriba para registrar esa asistencia.'
                      : 'El sistema protege la integridad de la liga impidiendo registros duplicados para una misma persona y evento.'}
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
                <span>
                  Confirmar Asistencia en {activeEvento?.nombre}
                  {activeTurno ? ` (${activeTurno.nombre})` : ''} (+{activeEvento?.puntosAsistencia} pts)
                </span>
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
