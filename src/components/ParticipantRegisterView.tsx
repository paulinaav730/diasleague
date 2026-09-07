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
  ArrowRight,
  Search,
  Users,
  Shield,
  PlusCircle,
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
  onViewGt,
}) => {
  const {
    eventos,
    turnos,
    personas,
    gts,
    temporadaActiva,
    registrarAsistencia,
    asistencias,
    crearPersona,
  } = useApp();

  // Find active event and shift
  const defaultEvent =
    eventos.find((e) => e.id === initialEventoId) ||
    eventos.find((e) => e.estado === 'activo' && e.utilizaQr) ||
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

  // Person identification state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPersonaId, setSelectedPersonaId] = useState<string>('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // New member creation state if not in list
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newNombre, setNewNombre] = useState('');
  const [newGtId, setNewGtId] = useState(gts[0]?.id || '');

  // Result and feedback states
  const [submitted, setSubmitted] = useState(false);
  const [resultData, setResultData] = useState<{
    success: boolean;
    message: string;
    puntos?: number;
    gtNombre?: string;
    gtId?: string;
  } | null>(null);

  const selectedPersona = personas.find((p) => p.id === selectedPersonaId);
  const selectedGt = gts.find((g) => g.id === selectedPersona?.gtId);

  // Filtered personas
  const filteredPersonas = useMemo(() => {
    if (!searchQuery.trim()) {
      return personas.filter((p) => p.activo).slice(0, 10);
    }
    return personas
      .filter((p) => p.activo && p.nombreCompleto.toLowerCase().includes(searchQuery.toLowerCase()))
      .slice(0, 15);
  }, [personas, searchQuery]);

  // DUPLICATE PARTICIPATION CHECK IN REAL-TIME
  const duplicateStatus = useMemo(() => {
    if (!selectedPersonaId || !activeEvento || !temporadaActiva) return null;

    const existing = asistencias.find((a) => {
      if (a.anulado) return false;
      if (a.personaId !== selectedPersonaId) return false;
      if (a.eventoId !== activeEvento.id) return false;
      if (a.temporadaId !== temporadaActiva.id) return false;

      if (activeEvento.utilizaTurnos && activeTurno) {
        return a.turnoId === activeTurno.id;
      }
      return true;
    });

    return existing;
  }, [selectedPersonaId, activeEvento, activeTurno, temporadaActiva, asistencias]);

  const handleSelectPersona = (id: string, nombre: string) => {
    setSelectedPersonaId(id);
    setSearchQuery(nombre);
    setIsDropdownOpen(false);
    setSubmitted(false);
    setResultData(null);
  };

  const handleCreateAndSelect = () => {
    if (!newNombre.trim()) return;
    const newId = 'per-' + Date.now();
    crearPersona({
      nombreCompleto: newNombre.trim(),
      gtId: newGtId,
      activo: true,
    });
    setSelectedPersonaId(newId);
    setSearchQuery(newNombre.trim());
    setIsAddingNew(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedPersonaId) {
      alert('Por favor selecciona o ingresa tu nombre.');
      return;
    }

    if (!activeEvento) {
      alert('Evento no seleccionado.');
      return;
    }

    const res = registrarAsistencia({
      personaId: selectedPersonaId,
      eventoId: activeEvento.id,
      turnoId: activeTurno?.id,
      origen: 'qr',
    });

    setResultData({
      ...res,
      gtId: selectedPersona?.gtId,
    });
    setSubmitted(true);

    if (res.success) {
      // Fire vibrant celebration confetti
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#F59E0B', '#10B981', '#6366F1', '#EC4899', '#3B82F6'],
      });
    }
  };

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
                Registro Express de Participación
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
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 block">
                Evento Identificado
              </span>
              <h2 className="text-xl font-black text-white">
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

          {/* Shift selector toggle if needed */}
          {availableTurnos.length > 1 && (
            <div className="mt-3 pt-3 border-t border-slate-700/60 flex items-center gap-2 text-xs">
              <span className="text-slate-400">Cambiar turno:</span>
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
                    {t.nombre} ({t.horaInicio} - {t.horaFin})
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
                    ¡Participación Registrada!
                  </h3>
                  <p className="text-base text-amber-300 font-bold mt-1">
                    Has ganado +{resultData.puntos} DIAS Points individuales
                  </p>
                  <p className="text-sm text-slate-300 mt-1">
                    Tu Grupo de Trabajo ({resultData.gtNombre}) también suma puntos brutos y se actualiza en el podio.
                  </p>
                </div>

                <div className="p-4 bg-slate-800/80 rounded-2xl border border-slate-700 max-w-sm mx-auto text-left text-xs space-y-1 text-slate-300">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Integrante:</span>
                    <span className="font-bold text-white">{selectedPersona?.nombreCompleto}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Grupo de Trabajo (GT):</span>
                    <span className="font-bold text-amber-400">{resultData.gtNombre}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Evento:</span>
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
                    Ver Podio y Rankings
                  </button>
                  <button
                    onClick={() => {
                      setSubmitted(false);
                      setSelectedPersonaId('');
                      setSearchQuery('');
                    }}
                    className="w-full sm:w-auto px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-semibold"
                  >
                    Registrar a otra persona
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
          /* REGISTRATION FORM */
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Person Search & Autocomplete */}
            <div className="relative">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                Identifícate con tu nombre completo
              </label>

              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  id="input-persona-nombre"
                  type="text"
                  placeholder="Escribe tu nombre para buscar..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setIsDropdownOpen(true);
                    setSelectedPersonaId('');
                  }}
                  onFocus={() => setIsDropdownOpen(true)}
                  className="w-full bg-slate-800 text-white pl-10 pr-4 py-3 rounded-2xl border border-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm placeholder-slate-500 font-medium"
                  required
                />
              </div>

              {/* Autocomplete Dropdown */}
              {isDropdownOpen && filteredPersonas.length > 0 && !selectedPersonaId && (
                <div className="absolute z-30 left-0 right-0 mt-1 bg-slate-800 border border-slate-700 rounded-2xl shadow-2xl max-h-56 overflow-y-auto divide-y divide-slate-700/60">
                  {filteredPersonas.map((p) => {
                    const gt = gts.find((g) => g.id === p.gtId);
                    return (
                      <div
                        key={p.id}
                        onClick={() => handleSelectPersona(p.id, p.nombreCompleto)}
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

            {/* Selected Person Card Preview */}
            {selectedPersona && selectedGt && (
              <div className="p-4 rounded-2xl bg-slate-800/90 border border-indigo-500/40 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-black text-sm shadow"
                    style={{ backgroundColor: selectedGt.color }}
                  >
                    {selectedGt.codigo}
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-sm">
                      {selectedPersona.nombreCompleto}
                    </h4>
                    <span className="text-xs text-indigo-300 font-medium">
                      GT: {selectedGt.nombre}
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedPersonaId('');
                    setSearchQuery('');
                  }}
                  className="text-xs text-slate-400 hover:text-white underline"
                >
                  Cambiar
                </button>
              </div>
            )}

            {/* DUPLICATE WARNING */}
            {duplicateStatus && (
              <div className="p-4 bg-red-950/40 border-2 border-red-500/60 rounded-2xl flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-red-200 text-sm">
                    Ya registraste tu participación en este turno
                  </h4>
                  <p className="text-xs text-red-300/80 mt-0.5">
                    El sistema protege la integridad de la liga impidiendo registros duplicados para una misma persona y turno. No puedes volver a recibir puntos en este turno.
                  </p>
                </div>
              </div>
            )}

            {/* Option to create person if not in mock list */}
            {!selectedPersonaId && (
              <div className="text-right">
                <button
                  type="button"
                  onClick={() => setIsAddingNew(!isAddingNew)}
                  className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold inline-flex items-center gap-1"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  ¿No estás en la lista? Regístrate aquí
                </button>
              </div>
            )}

            {/* Quick Registration Form for New Person */}
            {isAddingNew && !selectedPersonaId && (
              <div className="p-4 bg-slate-800/90 border border-slate-700 rounded-2xl space-y-3">
                <h5 className="font-bold text-white text-xs uppercase tracking-wider">
                  Nuevo Integrante
                </h5>
                <div>
                  <input
                    type="text"
                    placeholder="Tu nombre completo..."
                    value={newNombre}
                    onChange={(e) => setNewNombre(e.target.value)}
                    className="w-full bg-slate-900 text-white text-xs p-2.5 rounded-xl border border-slate-700"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <label className="text-xs text-slate-400 shrink-0">Tu GT:</label>
                  <select
                    value={newGtId}
                    onChange={(e) => setNewGtId(e.target.value)}
                    className="w-full bg-slate-900 text-white text-xs p-2 rounded-xl border border-slate-700"
                  >
                    {gts.map((gt) => (
                      <option key={gt.id} value={gt.id}>
                        {gt.nombre}
                      </option>
                    ))}
                  </select>
                </div>
                <button
                  type="button"
                  onClick={handleCreateAndSelect}
                  className="w-full py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold"
                >
                  Agregarme y Seleccionar
                </button>
              </div>
            )}

            {/* Action Button */}
            <div className="pt-2">
              <button
                id="btn-confirmar-asistencia"
                type="submit"
                disabled={!selectedPersonaId || !!duplicateStatus}
                className={`w-full py-3.5 px-6 rounded-2xl font-black text-base shadow-xl flex items-center justify-center gap-2 transition-all ${
                  duplicateStatus
                    ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                    : selectedPersonaId
                    ? 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 shadow-amber-500/25 hover:scale-[1.01]'
                    : 'bg-slate-800 text-slate-400 border border-slate-700 cursor-not-allowed'
                }`}
              >
                <CheckCircle2 className="w-5 h-5" />
                <span>Confirmar Mi Asistencia (+{activeEvento?.puntosAsistencia} pts)</span>
              </button>
            </div>
          </form>
        )}

        {/* Security and Transparency Footer */}
        <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500">
          <span className="flex items-center gap-1">
            <Shield className="w-3.5 h-3.5 text-slate-400" />
            Validación anti-duplicados activa
          </span>
          <span>DIAS LEAGUE 2026</span>
        </div>
      </div>
    </div>
  );
};
