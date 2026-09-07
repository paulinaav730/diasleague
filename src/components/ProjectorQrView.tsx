import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { useApp } from '../lib/store';
import {
  QrCode,
  Calendar,
  Clock,
  CheckCircle2,
  Lock,
  Unlock,
  ExternalLink,
  Copy,
  Check,
  Maximize2,
  Tv,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

interface ProjectorQrViewProps {
  onSimulateScan: (token: string, turnoId: string, eventoId: string) => void;
}

export const ProjectorQrView: React.FC<ProjectorQrViewProps> = ({ onSimulateScan }) => {
  const { eventos, turnos, temporadaActiva, activarTurno, cerrarTurno, isAdmin } = useApp();

  // Find events that use shifts and QR (like EXPECTA DIAS)
  const qrEvents = eventos.filter((e) => e.utilizaQr);
  const [selectedEventoId, setSelectedEventoId] = useState<string>(
    qrEvents[0]?.id || 'eve-expecta-dias'
  );

  const activeEvento = eventos.find((e) => e.id === selectedEventoId) || qrEvents[0];
  const eventoTurnos = turnos.filter((t) => t.eventoId === activeEvento?.id);

  const [selectedTurnoId, setSelectedTurnoId] = useState<string>(
    eventoTurnos[0]?.id || ''
  );

  const activeTurno =
    eventoTurnos.find((t) => t.id === selectedTurnoId) || eventoTurnos[0];

  const [copied, setCopied] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Generate registration URL based on current origin or fallback
  const registrationUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/?tab=registro&eventoId=${activeEvento?.id}&turnoId=${activeTurno?.id}&token=${activeTurno?.qrToken}`
    : `https://dias-league.eafit.edu.co/registro?token=${activeTurno?.qrToken}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(registrationUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isShiftActive = activeTurno?.estado === 'activo' && activeTurno?.activo;

  return (
    <div
      className={`w-full ${
        isFullscreen
          ? 'fixed inset-0 z-50 bg-slate-950 p-6 sm:p-12 overflow-y-auto flex flex-col justify-center items-center'
          : 'space-y-6'
      }`}
    >
      {/* Top Banner with Controls */}
      <div className="w-full max-w-5xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-xl">
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
              QR Oficial del Turno
            </h2>
          </div>
        </div>

        {/* Turno selector & Fullscreen toggle */}
        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          {/* Shift Select */}
          <select
            value={activeTurno?.id}
            onChange={(e) => setSelectedTurnoId(e.target.value)}
            className="bg-slate-800 text-slate-200 border border-slate-700 text-xs sm:text-sm rounded-xl px-3 py-2 font-medium focus:ring-2 focus:ring-amber-500 cursor-pointer"
          >
            {eventoTurnos.map((t) => (
              <option key={t.id} value={t.id}>
                {t.nombre} ({t.horaInicio} - {t.horaFin}) {t.activo ? '🟢 ACTIVO' : '⚪'}
              </option>
            ))}
          </select>

          {/* Fullscreen Button */}
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-white transition-colors"
            title={isFullscreen ? 'Salir de pantalla completa' : 'Pantalla Completa para Proyector'}
          >
            <Maximize2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Projector Card */}
      <div className="w-full max-w-4xl mx-auto bg-gradient-to-b from-slate-900 via-slate-900/95 to-slate-950 border-2 border-amber-500/30 rounded-3xl p-8 sm:p-12 shadow-2xl relative overflow-hidden text-center">
        {/* Ambient Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />

        {/* Event & Shift Header */}
        <div className="relative z-10 mb-8">
          <span className="text-xs uppercase font-extrabold tracking-widest text-amber-400 bg-amber-400/10 px-3 py-1 rounded-full border border-amber-400/30 inline-block mb-3">
            Organización Estudiantil DIAS • EAFIT
          </span>

          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight uppercase">
            {activeEvento?.nombre}
          </h1>

          {/* Shift & Time Pill */}
          <div className="inline-flex items-center gap-3 mt-4 px-5 py-2.5 rounded-2xl bg-slate-800/90 border border-slate-700/80 shadow-lg">
            <span className="text-xl sm:text-2xl font-extrabold text-amber-300">
              {activeTurno?.nombre}
            </span>
            <span className="text-slate-500 text-lg">•</span>
            <span className="flex items-center gap-1.5 text-sm sm:text-base font-semibold text-slate-200">
              <Clock className="w-4 h-4 text-amber-400" />
              {activeTurno?.horaInicio} — {activeTurno?.horaFin}
            </span>
          </div>

          <p className="text-sm sm:text-base text-slate-300 mt-3 max-w-md mx-auto">
            {activeEvento?.descripcion}
          </p>
        </div>

        {/* Big QR Code Display */}
        <div className="relative z-10 flex flex-col items-center justify-center my-6">
          <div
            className={`p-6 sm:p-8 rounded-3xl border-4 transition-all duration-300 ${
              isShiftActive
                ? 'bg-white border-amber-400 shadow-2xl shadow-amber-500/20 ring-4 ring-amber-400/20'
                : 'bg-slate-200 border-red-500 opacity-60'
            }`}
          >
            {activeTurno ? (
              <QRCodeSVG
                value={registrationUrl}
                size={280}
                level="H"
                includeMargin={true}
                className="w-56 h-56 sm:w-72 sm:h-72"
              />
            ) : (
              <div className="w-64 h-64 flex items-center justify-center text-slate-400">
                Selecciona un turno
              </div>
            )}
          </div>

          {/* Shift Status Tag */}
          <div className="mt-5">
            {isShiftActive ? (
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-sm font-bold animate-pulse">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                TURNO ACTIVO • QR LISTO PARA ESCANEAR
              </div>
            ) : (
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-500/20 text-red-300 border border-red-500/40 text-sm font-bold">
                <Lock className="w-4 h-4 text-red-400" />
                TURNO CERRADO / NO ACEPTA REGISTROS
              </div>
            )}
          </div>

          {/* Instructions */}
          <p className="text-base sm:text-lg font-bold text-slate-200 mt-4 max-w-lg">
            Apunta la cámara de tu celular para registrar tu participación y sumar{' '}
            <span className="text-amber-400 font-extrabold">
              +{activeEvento?.puntosAsistencia} DIAS Points
            </span>{' '}
            para ti y tu GT.
          </p>
        </div>

        {/* Shift Control Buttons (Admin controls) */}
        <div className="relative z-10 pt-6 border-t border-slate-800 flex flex-wrap items-center justify-center gap-3">
          {isShiftActive ? (
            <button
              id="btn-cerrar-turno"
              onClick={() => activeTurno && cerrarTurno(activeTurno.id)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-sm shadow-lg shadow-red-600/20 transition-all hover:scale-105"
            >
              <Lock className="w-4 h-4" />
              Cerrar Turno (Bloquear QR)
            </button>
          ) : (
            <button
              id="btn-abrir-turno"
              onClick={() => activeTurno && activarTurno(activeTurno.id)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-lg shadow-emerald-600/20 transition-all hover:scale-105"
            >
              <Unlock className="w-4 h-4" />
              Abrir Turno (Activar QR)
            </button>
          )}

          {/* Simulator button for instant in-browser test */}
          <button
            id="btn-simular-escaneo"
            onClick={() =>
              activeTurno &&
              activeEvento &&
              onSimulateScan(activeTurno.qrToken, activeTurno.id, activeEvento.id)
            }
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-lg shadow-indigo-600/20 transition-all hover:scale-105"
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            Probar Escaneo (Simulador de Participante)
          </button>

          {/* Copy Link button */}
          <button
            onClick={handleCopyLink}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 text-sm font-semibold transition-colors"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            {copied ? '¡Enlace copiado!' : 'Copiar Enlace'}
          </button>
        </div>

        {/* Token Info Footer */}
        <div className="mt-6 text-xs text-slate-500">
          Token de seguridad del turno:{' '}
          <code className="text-slate-400 font-mono bg-slate-950 px-2 py-0.5 rounded">
            {activeTurno?.qrToken}
          </code>
        </div>
      </div>
    </div>
  );
};
