import React, { useState, useMemo, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { useApp } from '../lib/store';
import {
  Calendar,
  Clock,
  CheckCircle2,
  Lock,
  Unlock,
  Copy,
  Check,
  Maximize2,
  Tv,
  Sparkles,
  Zap,
  Tag,
  AlertCircle,
} from 'lucide-react';

interface ProjectorQrViewProps {
  initialEventoId?: string;
  initialTurnoId?: string;
  onSimulateScan: (token: string, turnoId: string, eventoId: string) => void;
}

export const ProjectorQrView: React.FC<ProjectorQrViewProps> = ({
  initialEventoId,
  initialTurnoId,
  onSimulateScan,
}) => {
  const {
    eventos,
    turnos,
    temporadaActiva,
    activarTurno,
    cerrarTurno,
    cambiarEstadoEvento,
  } = useApp();

  // All events that can use QR (prioritizing active and with shifts)
  const qrEvents = useMemo(() => {
    return eventos.filter((e) => e.utilizaQr || e.utilizaTurnos);
  }, [eventos]);

  // Determine smart default event:
  // 1. initialEventoId if valid
  // 2. Event with an active shift (turnos.find(t => t.activo))
  // 3. Event that uses turnos (e.g., EXPECTA DIAS)
  // 4. Active event
  // 5. First QR event
  const smartDefaultEventoId = useMemo(() => {
    if (initialEventoId && eventos.some((e) => e.id === initialEventoId)) {
      return initialEventoId;
    }
    const eventWithActiveTurno = turnos.find((t) => t.activo)?.eventoId;
    if (eventWithActiveTurno && eventos.some((e) => e.id === eventWithActiveTurno)) {
      return eventWithActiveTurno;
    }
    const eventWithTurnos = eventos.find((e) => e.utilizaTurnos);
    if (eventWithTurnos) return eventWithTurnos.id;
    const activeQrEvent = eventos.find((e) => e.estado === 'activo' && e.utilizaQr);
    if (activeQrEvent) return activeQrEvent.id;
    return qrEvents[0]?.id || eventos[0]?.id || '';
  }, [initialEventoId, turnos, eventos, qrEvents]);

  const [selectedEventoId, setSelectedEventoId] = useState<string>(smartDefaultEventoId);

  // Sync if initialEventoId changes from outside
  useEffect(() => {
    if (initialEventoId && eventos.some((e) => e.id === initialEventoId)) {
      setSelectedEventoId(initialEventoId);
    }
  }, [initialEventoId, eventos]);

  const activeEvento = eventos.find((e) => e.id === selectedEventoId) || eventos[0];
  const eventoTurnos = useMemo(() => {
    return turnos.filter((t) => t.eventoId === activeEvento?.id);
  }, [turnos, activeEvento?.id]);

  const hasTurnos = (activeEvento?.utilizaTurnos || eventoTurnos.length > 0) && eventoTurnos.length > 0;

  // Smart default shift:
  // 1. initialTurnoId if in this event
  // 2. Currently active shift in this event
  // 3. First shift in this event
  const smartDefaultTurnoId = useMemo(() => {
    if (initialTurnoId && eventoTurnos.some((t) => t.id === initialTurnoId)) {
      return initialTurnoId;
    }
    const active = eventoTurnos.find((t) => t.activo);
    if (active) return active.id;
    return eventoTurnos[0]?.id || '';
  }, [initialTurnoId, eventoTurnos]);

  const [selectedTurnoId, setSelectedTurnoId] = useState<string>(smartDefaultTurnoId);

  // When event changes or initialTurnoId changes, sync shift
  useEffect(() => {
    if (initialTurnoId && eventoTurnos.some((t) => t.id === initialTurnoId)) {
      setSelectedTurnoId(initialTurnoId);
      return;
    }
    const active = eventoTurnos.find((t) => t.activo);
    if (active) {
      setSelectedTurnoId(active.id);
    } else if (eventoTurnos.length > 0) {
      setSelectedTurnoId(eventoTurnos[0].id);
    } else {
      setSelectedTurnoId('');
    }
  }, [selectedEventoId, eventoTurnos, initialTurnoId]);

  const activeTurno = eventoTurnos.find((t) => t.id === selectedTurnoId) || (hasTurnos ? eventoTurnos[0] : undefined);

  // Global active shift across ANY event for the quick jump button
  const globalActiveTurno = useMemo(() => {
    return turnos.find((t) => t.activo);
  }, [turnos]);

  const [copied, setCopied] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Generate registration URL strictly without 'undefined' literals
  const registrationUrl = useMemo(() => {
    if (typeof window === 'undefined') {
      return 'https://diasleague.vercel.app/?tab=registro';
    }
    const origin = window.location.origin;
    if (!activeEvento) return `${origin}/?tab=registro`;

    if (hasTurnos && activeTurno) {
      return `${origin}/?tab=registro&eventoId=${encodeURIComponent(activeEvento.id)}&turnoId=${encodeURIComponent(activeTurno.id)}&token=${encodeURIComponent(activeTurno.qrToken || '')}`;
    }
    return `${origin}/?tab=registro&eventoId=${encodeURIComponent(activeEvento.id)}`;
  }, [activeEvento, hasTurnos, activeTurno]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(registrationUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Is registration currently accepting check-ins?
  const isRegistrationOpen = hasTurnos
    ? !!activeTurno?.activo
    : activeEvento?.estado === 'activo';

  return (
    <div
      className={`w-full ${
        isFullscreen
          ? 'fixed inset-0 z-50 bg-slate-950 p-6 sm:p-12 overflow-y-auto flex flex-col justify-center items-center'
          : 'space-y-6'
      }`}
    >
      {/* Top Banner with Controls */}
      <div className="w-full max-w-5xl mx-auto flex flex-col gap-4 bg-slate-900 border border-slate-800 p-5 rounded-3xl shadow-xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-600 flex items-center justify-center text-white shadow-lg shadow-amber-500/20">
              <Tv className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase font-extrabold tracking-wider text-amber-400 bg-amber-500/10 border border-amber-500/30 px-2.5 py-0.5 rounded-full">
                  Modo Proyector / Pantalla
                </span>
                <span className="text-xs text-slate-400 font-medium">
                  {temporadaActiva?.nombre}
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white mt-0.5">
                Proyección de QR para Asistencia
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            {/* Quick jump to active shift if another event or shift is open */}
            {globalActiveTurno && (
              <button
                type="button"
                onClick={() => {
                  setSelectedEventoId(globalActiveTurno.eventoId);
                  setSelectedTurnoId(globalActiveTurno.id);
                }}
                className={`text-xs px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 transition-all shadow cursor-pointer ${
                  selectedTurnoId === globalActiveTurno.id
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 ring-2 ring-emerald-500/20'
                    : 'bg-emerald-600 hover:bg-emerald-500 text-white animate-pulse'
                }`}
                title="Ir al turno que está actualmente abierto en vivo"
              >
                <Zap className="w-3.5 h-3.5" />
                <span>Turno Abierto en Vivo</span>
              </button>
            )}

            {/* Fullscreen Button */}
            <button
              type="button"
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
              title={isFullscreen ? 'Salir de pantalla completa' : 'Pantalla Completa para Proyector'}
            >
              <Maximize2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* SELECTORS ROW: Event Selector & Shift Selector */}
        <div className="pt-3 border-t border-slate-800/80 grid grid-cols-1 md:grid-cols-2 gap-3">
          {/* 1. SELECTOR DE EVENTO / CONECTADO */}
          <div className="space-y-1">
            <label className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5 text-amber-400" />
              1. Selecciona el Evento a Proyectar:
            </label>
            <select
              value={activeEvento?.id}
              onChange={(e) => {
                setSelectedEventoId(e.target.value);
              }}
              className="w-full bg-slate-850 text-white font-bold border border-slate-700 hover:border-amber-500/50 text-xs sm:text-sm rounded-xl px-3 py-2.5 focus:ring-2 focus:ring-amber-500 cursor-pointer shadow-inner"
            >
              {eventos.map((ev) => {
                const turnosCount = turnos.filter((t) => t.eventoId === ev.id).length;
                const hasActiveShift = turnos.some((t) => t.eventoId === ev.id && t.activo);
                return (
                  <option key={ev.id} value={ev.id}>
                    {ev.nombre} • (+{ev.puntosAsistencia} pts)
                    {turnosCount > 0 ? ` [${turnosCount} Turnos]` : ' [General]'}
                    {hasActiveShift ? ' 🟢 (Turno Activo)' : ev.estado === 'activo' ? ' 🟢 (Activo)' : ''}
                  </option>
                );
              })}
            </select>
          </div>

          {/* 2. SELECTOR DE TURNO (SI APLICA) */}
          <div className="space-y-1">
            <label className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              2. Turno / Horario:
            </label>

            {hasTurnos ? (
              <select
                value={activeTurno?.id}
                onChange={(e) => setSelectedTurnoId(e.target.value)}
                className="w-full bg-slate-850 text-amber-300 font-extrabold border border-slate-700 hover:border-amber-500/50 text-xs sm:text-sm rounded-xl px-3 py-2.5 focus:ring-2 focus:ring-amber-500 cursor-pointer shadow-inner"
              >
                {eventoTurnos.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.nombre} ({t.horaInicio} - {t.horaFin}) {t.activo ? '🟢 QR ABIERTO' : '⚪ Cerrado'}
                  </option>
                ))}
              </select>
            ) : (
              <div className="px-3 py-2.5 bg-slate-850 border border-slate-800 rounded-xl text-xs text-slate-400 flex items-center justify-between">
                <span>Asistencia General (Sin turnos horarios)</span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  activeEvento?.estado === 'activo'
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                    : 'bg-slate-800 text-slate-400 border border-slate-700'
                }`}>
                  {activeEvento?.estado === 'activo' ? '🟢 Evento Activo' : '⚪ No Activo'}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Projector Card */}
      <div className="w-full max-w-4xl mx-auto bg-gradient-to-b from-slate-900 via-slate-900/95 to-slate-950 border-2 border-amber-500/40 rounded-3xl p-6 sm:p-12 shadow-2xl relative overflow-hidden text-center">
        {/* Ambient Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Event & Shift Header */}
        <div className="relative z-10 mb-6">
          <span className="text-xs uppercase font-extrabold tracking-widest text-amber-400 bg-amber-400/10 px-3 py-1 rounded-full border border-amber-400/30 inline-block mb-3">
            Organización Estudiantil DIAS • EAFIT
          </span>

          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight uppercase">
            {activeEvento?.nombre}
          </h1>

          {/* Shift & Time Pill */}
          {hasTurnos && activeTurno ? (
            <div className="inline-flex flex-wrap items-center justify-center gap-2 sm:gap-3 mt-4 px-5 py-2.5 rounded-2xl bg-slate-800/95 border border-slate-700/80 shadow-lg">
              <span className="text-lg sm:text-2xl font-black text-amber-300">
                {activeTurno.nombre}
              </span>
              <span className="text-slate-500 text-lg hidden sm:inline">•</span>
              <span className="flex items-center gap-1.5 text-sm sm:text-base font-bold text-slate-200">
                <Clock className="w-4 h-4 text-amber-400" />
                {activeTurno.horaInicio} — {activeTurno.horaFin}
              </span>
            </div>
          ) : (
            <div className="inline-flex items-center gap-2 mt-4 px-4 py-1.5 rounded-xl bg-slate-800/80 border border-slate-700 text-xs sm:text-sm font-semibold text-slate-300">
              <Calendar className="w-4 h-4 text-amber-400" />
              <span>Registro de Asistencia General • {activeEvento?.fecha}</span>
            </div>
          )}

          <p className="text-xs sm:text-sm text-slate-300 mt-3 max-w-lg mx-auto">
            {activeEvento?.descripcion}
          </p>
        </div>

        {/* Big QR Code Display */}
        <div className="relative z-10 flex flex-col items-center justify-center my-4">
          <div
            className={`p-6 sm:p-8 rounded-3xl border-4 transition-all duration-300 ${
              isRegistrationOpen
                ? 'bg-white border-amber-400 shadow-2xl shadow-amber-500/25 ring-4 ring-amber-400/20'
                : 'bg-slate-200 border-red-500 opacity-60'
            }`}
          >
            <QRCodeSVG
              value={registrationUrl}
              size={280}
              level="H"
              includeMargin={true}
              className="w-56 h-56 sm:w-72 sm:h-72"
            />
          </div>

          {/* Registration Status Tag */}
          <div className="mt-5">
            {isRegistrationOpen ? (
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs sm:text-sm font-black animate-pulse">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                <span>QR ABIERTO • LISTO PARA ESCANEAR CON LA CÁMARA</span>
              </div>
            ) : (
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-500/20 text-red-300 border border-red-500/40 text-xs sm:text-sm font-bold">
                <Lock className="w-4 h-4 text-red-400" />
                <span>QR CERRADO / NO ACEPTA REGISTROS EN ESTE MOMENTO</span>
              </div>
            )}
          </div>

          {/* Destination Clarity Badge */}
          <div className="mt-4 p-3 bg-slate-950/80 border border-slate-800 rounded-2xl max-w-md w-full text-center">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-1">
              Al escanear este QR se registrará en:
            </span>
            <div className="text-sm font-black text-white flex items-center justify-center gap-2 flex-wrap">
              <span className="text-amber-400">{activeEvento?.nombre}</span>
              {hasTurnos && activeTurno && (
                <>
                  <span className="text-slate-500">•</span>
                  <span className="text-emerald-300">{activeTurno.nombre} ({activeTurno.horaInicio})</span>
                </>
              )}
              <span className="text-slate-500">•</span>
              <span className="text-amber-300 font-extrabold">+{activeEvento?.puntosAsistencia} pts</span>
            </div>
          </div>

          {/* Instructions */}
          <p className="text-sm sm:text-base font-bold text-slate-200 mt-4 max-w-lg">
            Apunta la cámara de tu celular para registrar tu participación y sumar{' '}
            <span className="text-amber-400 font-black">
              +{activeEvento?.puntosAsistencia} DIAS Points
            </span>{' '}
            para ti y tu GT.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="relative z-10 pt-6 border-t border-slate-800 flex flex-wrap items-center justify-center gap-3">
          {hasTurnos && activeTurno ? (
            isRegistrationOpen ? (
              <button
                id="btn-cerrar-turno"
                type="button"
                onClick={() => cerrarTurno(activeTurno.id)}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs sm:text-sm shadow-lg shadow-red-600/20 transition-all hover:scale-105 cursor-pointer"
              >
                <Lock className="w-4 h-4" />
                Cerrar Turno (Bloquear QR)
              </button>
            ) : (
              <button
                id="btn-abrir-turno"
                type="button"
                onClick={() => activarTurno(activeTurno.id)}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm shadow-lg shadow-emerald-600/20 transition-all hover:scale-105 cursor-pointer"
              >
                <Unlock className="w-4 h-4" />
                Abrir Turno (Activar QR)
              </button>
            )
          ) : (
            activeEvento?.estado === 'activo' ? (
              <button
                type="button"
                onClick={() => cambiarEstadoEvento(activeEvento.id, 'finalizado')}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs sm:text-sm shadow-lg shadow-red-600/20 transition-all cursor-pointer"
              >
                <Lock className="w-4 h-4" />
                Finalizar Evento (Cerrar QR)
              </button>
            ) : (
              <button
                type="button"
                onClick={() => cambiarEstadoEvento(activeEvento.id, 'activo')}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm shadow-lg shadow-emerald-600/20 transition-all cursor-pointer"
              >
                <Unlock className="w-4 h-4" />
                Activar Evento (Abrir QR)
              </button>
            )
          )}

          {/* Simulator button for instant in-browser test */}
          <button
            id="btn-simular-escaneo"
            type="button"
            onClick={() => {
              if (!activeEvento) return;
              const token = activeTurno?.qrToken || '';
              const turnoId = activeTurno?.id || '';
              onSimulateScan(token, turnoId, activeEvento.id);
            }}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs sm:text-sm shadow-lg shadow-indigo-600/20 transition-all hover:scale-105 cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            Probar Escaneo (Simulador)
          </button>

          {/* Copy Link button */}
          <button
            type="button"
            onClick={handleCopyLink}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 text-xs sm:text-sm font-semibold transition-colors cursor-pointer"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            {copied ? '¡Enlace copiado!' : 'Copiar Enlace'}
          </button>
        </div>

        {/* Direct Link Footer */}
        <div className="mt-5 text-[11px] text-slate-500 font-mono break-all max-w-xl mx-auto">
          Enlace codificado en el QR:{' '}
          <span className="text-slate-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
            {registrationUrl}
          </span>
        </div>
      </div>
    </div>
  );
};
