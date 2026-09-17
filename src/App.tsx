import React, { useState, useEffect } from 'react';
import { AppProvider, useApp } from './lib/store';
import { Navbar } from './components/Navbar';
import { Podium } from './components/Podium';
import { GtRankingTable } from './components/GtRankingTable';
import { IndividualRanking } from './components/IndividualRanking';
import { ProjectorQrView } from './components/ProjectorQrView';
import { ParticipantRegisterView } from './components/ParticipantRegisterView';
import { EventosView } from './components/EventosView';
import { AnalyticsView } from './components/AnalyticsView';
import { AdminPanel } from './components/AdminPanel';
import { GtProfileModal } from './components/GtProfileModal';
import { PersonaProfileModal } from './components/PersonaProfileModal';
import { ConectadoDetalleModal } from './components/ConectadoDetalleModal';
import { AdminLoginCard } from './components/AdminLoginCard';
import { Sparkles, Trophy, QrCode, Shield, CheckCircle2, Calendar, Award } from 'lucide-react';

function AppContent() {
  const {
    activeTab,
    setActiveTab,
    podio,
    rankingGts,
    rankingPersonas,
    temporadaActiva,
    eventos,
    retos,
    asistencias,
    isAdmin,
  } = useApp();

  // Modal inspection states
  const [selectedGtId, setSelectedGtId] = useState<string | null>(null);
  const [selectedPersonaId, setSelectedPersonaId] = useState<string | null>(null);
  const [selectedConectadoId, setSelectedConectadoId] = useState<string | null>(null);

  // Preselected event/shift for QR registration flow
  const [targetEventoId, setTargetEventoId] = useState<string | undefined>();
  const [targetTurnoId, setTargetTurnoId] = useState<string | undefined>();
  const [targetToken, setTargetToken] = useState<string | undefined>();

  // Check URL parameters on mount (for QR code scan detection)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const tabParam = params.get('tab');
      const eventoIdParam = params.get('eventoId');
      const turnoIdParam = params.get('turnoId');
      const tokenParam = params.get('token');

      if (tabParam === 'registro' || tokenParam) {
        setActiveTab('registro');
        if (eventoIdParam) setTargetEventoId(eventoIdParam);
        if (turnoIdParam) setTargetTurnoId(turnoIdParam);
        if (tokenParam) setTargetToken(tokenParam);
      }
    }
  }, [setActiveTab]);

  const handleSimulateScan = (token: string, turnoId: string, eventoId: string) => {
    setTargetToken(token);
    setTargetTurnoId(turnoId);
    setTargetEventoId(eventoId);
    setActiveTab('registro');
  };

  const handleOpenQrProjectorForEvent = (eventoId: string, turnoId?: string) => {
    setActiveTab('qr-proyector');
  };

  const handleOpenRegisterForEvent = (eventoId: string, turnoId?: string) => {
    setTargetEventoId(eventoId);
    setTargetTurnoId(turnoId);
    setActiveTab('registro');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-amber-500 selection:text-slate-950">
      {/* Top Navigation */}
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
        {/* ========================================================================= */}
        {/* TAB: PODIO & GENERAL OVERVIEW                                             */}
        {/* ========================================================================= */}
        {(activeTab === 'dashboard' || activeTab === 'podio') && (
          <div className="space-y-8">
            {/* Visual Animated Podium */}
            <Podium
              podio={podio}
              onSelectGt={(gtId) => setSelectedGtId(gtId)}
              onSelectPersona={(personaId) => setSelectedPersonaId(personaId)}
            />

            {/* Showcase: Calificación y Retos por Conectado */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-7 shadow-xl space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs uppercase font-extrabold tracking-wider text-amber-400 bg-amber-500/10 border border-amber-500/30 px-2.5 py-0.5 rounded-full">
                      Jornadas Competitivas
                    </span>
                    <span className="text-xs text-slate-400">
                      Asistencia por tamaño de GT + Retos acumulados
                    </span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black text-white mt-1 flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-amber-400" />
                    Calificación y Retos por Conectado
                  </h3>
                </div>

                <button
                  onClick={() => setActiveTab('eventos')}
                  className="text-xs font-bold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 shrink-0"
                >
                  Ver todos en Eventos ➔
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-1">
                {eventos.map((ev) => {
                  const evAsist = asistencias.filter(
                    (a) => a.eventoId === ev.id && !a.anulado
                  ).length;
                  const evRetos = retos.filter((r) => r.eventoId === ev.id).length;

                  return (
                    <div
                      key={ev.id}
                      onClick={() => setSelectedConectadoId(ev.id)}
                      className="p-4 rounded-2xl bg-slate-850/80 border border-slate-800 hover:border-amber-500/50 hover:bg-slate-800/90 transition-all cursor-pointer group flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-2">
                          <span
                            className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                              ev.estado === 'activo'
                                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                                : ev.estado === 'finalizado'
                                ? 'bg-slate-800 text-slate-400 border-slate-700'
                                : 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30'
                            }`}
                          >
                            {ev.estado}
                          </span>
                          <span className="text-xs font-black text-amber-300">
                            +{ev.puntosAsistencia} pts base
                          </span>
                        </div>

                        <h4 className="text-base font-extrabold text-white group-hover:text-amber-300 transition-colors">
                          {ev.nombre}
                        </h4>

                        <div className="mt-2 text-xs text-slate-400 space-y-1">
                          <div className="flex justify-between">
                            <span>Asistentes registrados:</span>
                            <span className="font-bold text-white">{evAsist}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Retos en este Conectado:</span>
                            <span className="font-bold text-purple-400">{evRetos}</span>
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs font-bold text-amber-400 group-hover:translate-x-0.5 transition-transform">
                        <span>Ver Resultado y Retos</span>
                        <span>➔</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* General GT Leaderboard Table */}
            <GtRankingTable
              ranking={rankingGts}
              onSelectGt={(gtId) => setSelectedGtId(gtId)}
            />

            {/* Individual Leaderboard preview */}
            <IndividualRanking
              ranking={rankingPersonas}
              onSelectPersona={(personaId) => setSelectedPersonaId(personaId)}
            />
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB: RANKING EXCLUSIVO GTS                                                */}
        {/* ========================================================================= */}
        {(activeTab === 'gts' || activeTab === 'ranking_gts') && (
          <div className="space-y-6">
            <GtRankingTable
              ranking={rankingGts}
              onSelectGt={(gtId) => setSelectedGtId(gtId)}
            />
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB: RANKING EXCLUSIVO PERSONAS                                           */}
        {/* ========================================================================= */}
        {(activeTab === 'personas' || activeTab === 'ranking_personas') && (
          <div className="space-y-6">
            <IndividualRanking
              ranking={rankingPersonas}
              onSelectPersona={(personaId) => setSelectedPersonaId(personaId)}
            />
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB: QR PROYECTOR (PANTALLA DE PROYECCIÓN)                                */}
        {/* ========================================================================= */}
        {(activeTab === 'qr-proyector' || activeTab === 'qr_proyector') && (
          <div className="space-y-6">
            <ProjectorQrView onSimulateScan={handleSimulateScan} />
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB: REGISTRO DE PARTICIPANTE                                             */}
        {/* ========================================================================= */}
        {activeTab === 'registro' && (
          <div className="space-y-6">
            <ParticipantRegisterView
              initialEventoId={targetEventoId}
              initialTurnoId={targetTurnoId}
              initialToken={targetToken}
              onViewRanking={() => setActiveTab('dashboard')}
              onViewGt={(gtId) => setSelectedGtId(gtId)}
            />
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB: EVENTOS & RETOS                                                      */}
        {/* ========================================================================= */}
        {activeTab === 'eventos' && (
          <EventosView
            onOpenQrProjector={handleOpenQrProjectorForEvent}
            onOpenRegister={handleOpenRegisterForEvent}
          />
        )}

        {/* ========================================================================= */}
        {/* TAB: ANALÍTICA Y COMPARATIVAS                                             */}
        {/* ========================================================================= */}
        {activeTab === 'analitica' && <AnalyticsView />}

        {/* ========================================================================= */}
        {/* TAB: PANEL DE ADMINISTRACIÓN                                              */}
        {/* ========================================================================= */}
        {activeTab === 'admin' && (
          isAdmin ? <AdminPanel /> : <AdminLoginCard />
        )}
      </main>

      {/* Global Modals for GT and Person Profiles */}
      {selectedGtId && (
        <GtProfileModal
          gtId={selectedGtId}
          onClose={() => setSelectedGtId(null)}
          onSelectPersona={(personaId) => setSelectedPersonaId(personaId)}
        />
      )}

      {selectedPersonaId && (
        <PersonaProfileModal
          personaId={selectedPersonaId}
          onClose={() => setSelectedPersonaId(null)}
          onSelectGt={(gtId) => setSelectedGtId(gtId)}
        />
      )}

      {/* Global Conectado Inspection Modal */}
      {selectedConectadoId && (
        <ConectadoDetalleModal
          eventoId={selectedConectadoId}
          onClose={() => setSelectedConectadoId(null)}
          onOpenQrProjector={handleOpenQrProjectorForEvent}
          onOpenRegister={handleOpenRegisterForEvent}
        />
      )}

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/80 py-8 px-4 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="w-5 h-5 rounded-md bg-amber-500 text-slate-950 font-black text-[10px] flex items-center justify-center">
              DL
            </span>
            <span className="text-slate-400 font-semibold">
              DIAS LEAGUE — Organización Estudiantil DIAS
            </span>
          </div>
          <p className="text-slate-500">
            Universidad EAFIT • Medellín, Colombia • Gamificación & Competencia Justa
          </p>
          <div className="flex items-center gap-3 text-slate-400">
            <span>{temporadaActiva?.nombre}</span>
            <span>•</span>
            <button
              onClick={() => setActiveTab('qr-proyector')}
              className="hover:text-amber-400 underline"
            >
              Modo Proyector
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
