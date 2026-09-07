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
import { Sparkles, Trophy, QrCode, Shield, CheckCircle2 } from 'lucide-react';

function AppContent() {
  const {
    activeTab,
    setActiveTab,
    podio,
    rankingGts,
    rankingPersonas,
    temporadaActiva,
    eventos,
  } = useApp();

  // Modal inspection states
  const [selectedGtId, setSelectedGtId] = useState<string | null>(null);
  const [selectedPersonaId, setSelectedPersonaId] = useState<string | null>(null);

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
            />

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
        {activeTab === 'admin' && <AdminPanel />}
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
