import React from 'react';
import { useApp } from '../lib/store';
import {
  Trophy,
  QrCode,
  Users,
  Calendar,
  BarChart3,
  Shield,
  ShieldAlert,
  UserCheck,
} from 'lucide-react';

export type ActiveTab =
  | 'dashboard'
  | 'qr-proyector'
  | 'registro'
  | 'gts'
  | 'personas'
  | 'eventos'
  | 'analitica'
  | 'admin';

interface NavbarProps {
  activeTab?: ActiveTab;
  setActiveTab?: (tab: ActiveTab) => void;
  onOpenQrScanner?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab: propActiveTab, setActiveTab: propSetActiveTab }) => {
  const {
    temporadaActiva,
    temporadas,
    setTemporadaActivaId,
    isAdmin,
    setIsAdmin,
    activeTab: contextActiveTab,
    setActiveTab: contextSetActiveTab,
  } = useApp();

  const activeTab = propActiveTab ?? contextActiveTab ?? 'dashboard';
  const setActiveTab = propSetActiveTab ?? contextSetActiveTab;

  return (
    <header className="sticky top-0 z-40 w-full bg-slate-900/95 backdrop-blur border-b border-slate-800 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand & Logo */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('dashboard')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 via-red-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-500/20 ring-1 ring-white/20">
              <Trophy className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold tracking-wider text-xl bg-clip-text text-transparent bg-gradient-to-r from-amber-400 via-orange-300 to-yellow-200">
                  DIAS LEAGUE
                </span>
                <span className="text-[10px] uppercase font-bold tracking-widest bg-blue-500/20 text-blue-300 border border-blue-400/30 px-2 py-0.5 rounded-full">
                  EAFIT
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                Organización Estudiantil DIAS
              </p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2 text-sm font-medium">
            <button
              id="nav-btn-dashboard"
              onClick={() => setActiveTab('dashboard')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg transition-colors ${
                activeTab === 'dashboard'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Trophy className="w-4 h-4" />
              <span>Podio & Ranking</span>
            </button>

            <button
              id="nav-btn-qr-proyector"
              onClick={() => setActiveTab('qr-proyector')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg transition-colors ${
                activeTab === 'qr-proyector'
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <QrCode className="w-4 h-4 text-amber-400" />
              <span>QR del Turno</span>
            </button>

            <button
              id="nav-btn-registro"
              onClick={() => setActiveTab('registro')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg transition-colors ${
                activeTab === 'registro'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <UserCheck className="w-4 h-4 text-emerald-400" />
              <span>Registrar Asistencia</span>
            </button>

            <button
              id="nav-btn-eventos"
              onClick={() => setActiveTab('eventos')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg transition-colors ${
                activeTab === 'eventos'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Calendar className="w-4 h-4" />
              <span>Eventos & Retos</span>
            </button>

            <button
              id="nav-btn-personas"
              onClick={() => setActiveTab('personas')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg transition-colors ${
                activeTab === 'personas'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Integrantes</span>
            </button>

            <button
              id="nav-btn-analitica"
              onClick={() => setActiveTab('analitica')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg transition-colors ${
                activeTab === 'analitica'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              <span>Gráficas</span>
            </button>
          </nav>

          {/* Right actions: Season Selector & Admin Mode Toggle */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Season Selector */}
            <div className="relative">
              <select
                id="select-temporada-header"
                value={temporadaActiva?.id}
                onChange={(e) => setTemporadaActivaId(e.target.value)}
                className="bg-slate-800 text-xs text-amber-300 font-semibold border border-slate-700 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-amber-500 cursor-pointer"
              >
                {temporadas.map((t) => (
                  <option key={t.id} value={t.id} className="bg-slate-900 text-white">
                    {t.nombre} {t.activa ? '★ (Activa)' : ''}
                  </option>
                ))}
              </select>
            </div>

            {/* Admin Panel Button */}
            <button
              id="btn-nav-admin"
              onClick={() => setActiveTab('admin')}
              className={`flex items-center space-x-1 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'admin'
                  ? 'bg-purple-600 text-white ring-2 ring-purple-400/50'
                  : 'bg-slate-800 text-purple-300 hover:bg-slate-700 border border-purple-500/30'
              }`}
              title="Panel Administrativo DIAS"
            >
              <Shield className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Admin</span>
            </button>

            {/* Admin Toggle switch */}
            <button
              id="btn-toggle-admin-role"
              onClick={() => setIsAdmin(!isAdmin)}
              className={`px-2 py-1 rounded text-[10px] font-bold uppercase transition-all ${
                isAdmin
                  ? 'bg-purple-900/60 text-purple-200 border border-purple-500/40'
                  : 'bg-slate-800 text-slate-400 border border-slate-700'
              }`}
              title="Alternar entre rol Administrador y Participante"
            >
              {isAdmin ? (
                <span className="flex items-center gap-1 text-purple-300">
                  <ShieldAlert className="w-3 h-3" />
                  Admin
                </span>
              ) : (
                <span className="flex items-center gap-1 text-slate-400">
                  <Users className="w-3 h-3" />
                  User
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Secondary Menu */}
      <div className="md:hidden flex items-center justify-around border-t border-slate-800 px-2 py-2 overflow-x-auto text-xs bg-slate-950/60">
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`px-2.5 py-1 rounded whitespace-nowrap ${
            activeTab === 'dashboard' ? 'bg-indigo-600 text-white' : 'text-slate-300'
          }`}
        >
          Podio
        </button>
        <button
          onClick={() => setActiveTab('qr-proyector')}
          className={`px-2.5 py-1 rounded whitespace-nowrap ${
            activeTab === 'qr-proyector' ? 'bg-amber-600 text-white' : 'text-amber-400'
          }`}
        >
          QR Turno
        </button>
        <button
          onClick={() => setActiveTab('registro')}
          className={`px-2.5 py-1 rounded whitespace-nowrap ${
            activeTab === 'registro' ? 'bg-emerald-600 text-white' : 'text-emerald-400'
          }`}
        >
          Registrar
        </button>
        <button
          onClick={() => setActiveTab('eventos')}
          className={`px-2.5 py-1 rounded whitespace-nowrap ${
            activeTab === 'eventos' ? 'bg-indigo-600 text-white' : 'text-slate-300'
          }`}
        >
          Eventos
        </button>
        <button
          onClick={() => setActiveTab('personas')}
          className={`px-2.5 py-1 rounded whitespace-nowrap ${
            activeTab === 'personas' ? 'bg-indigo-600 text-white' : 'text-slate-300'
          }`}
        >
          Integrantes
        </button>
        <button
          onClick={() => setActiveTab('analitica')}
          className={`px-2.5 py-1 rounded whitespace-nowrap ${
            activeTab === 'analitica' ? 'bg-indigo-600 text-white' : 'text-slate-300'
          }`}
        >
          Gráficas
        </button>
      </div>
    </header>
  );
};
