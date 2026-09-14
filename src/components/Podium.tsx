import React from 'react';
import { GtCalculado } from '../types';
import { Crown, Sparkles, Trophy, Users, Scale, ArrowUpRight } from 'lucide-react';
import { motion } from 'motion/react';
import { useApp } from '../lib/store';

interface PodiumProps {
  podio: GtCalculado[];
  onSelectGt: (gtId: string) => void;
}

export const Podium: React.FC<PodiumProps> = ({ podio, onSelectGt }) => {
  const { modoRanking, setModoRanking, factorBase } = useApp();
  const first = podio[0];
  const second = podio[1];
  const third = podio[2];

  if (!first || first.diasPointsFinal === 0) {
    return (
      <div className="w-full bg-slate-900/80 border border-slate-800 rounded-3xl p-8 text-center relative overflow-hidden shadow-xl">
        <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mx-auto mb-4 text-amber-400">
          <Trophy className="w-8 h-8 opacity-80" />
        </div>
        <h3 className="text-xl font-bold text-white mb-2">El ranking todavía no tiene puntos.</h3>
        <p className="text-sm text-slate-400 max-w-md mx-auto">
          El podio y los líderes oficiales se mostrarán automáticamente una vez se registren las primeras participaciones o asistencias reales.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full bg-gradient-to-b from-slate-900 via-slate-900/90 to-slate-950 p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-2xl relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -top-10 left-10 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-10 right-10 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-center justify-between mb-8 relative z-10 gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30">
              <Sparkles className="w-3.5 h-3.5" />
              {modoRanking === 'temporada' ? 'Podio Oficial Temporada 2026-2' : 'Podio Histórico Acumulado'}
            </span>
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-slate-800 text-amber-400 border border-slate-700">
              Factor Base {factorBase}x
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white mt-1.5 tracking-tight">
            Líderes de la DIAS LEAGUE
          </h2>
        </div>

        <div className="flex flex-col sm:items-end gap-2">
          {/* View mode toggle */}
          <div className="flex items-center p-1 bg-slate-950/80 rounded-xl border border-slate-800 shadow-inner">
            <button
              onClick={() => setModoRanking('temporada')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                modoRanking === 'temporada'
                  ? 'bg-amber-500 text-slate-950 font-black shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              ⚡ Temporada 2026-2
            </button>
            <button
              onClick={() => setModoRanking('acumulado')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                modoRanking === 'acumulado'
                  ? 'bg-indigo-600 text-white font-black shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              📈 Acumulado
            </button>
          </div>
          <p className="text-xs text-slate-400 text-center sm:text-right">
            Nivelado con <span className="text-amber-300 font-bold">Fórmula {factorBase} / N</span>
          </p>
        </div>
      </div>

      {/* Podium Visual Layout */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6 items-end justify-center relative z-10 pt-4 pb-2">
        {/* SECOND PLACE (Left on desktop) */}
        {second && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="order-2 md:order-1 flex flex-col items-center"
          >
            <div
              onClick={() => onSelectGt(second.gt.id)}
              className="w-full bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 hover:border-slate-500 rounded-2xl p-5 cursor-pointer transition-all duration-300 shadow-lg group hover:-translate-y-1"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-xl bg-slate-700 border border-slate-500 flex items-center justify-center font-black text-slate-200 text-lg shadow">
                    2
                  </div>
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    🥈 Segundo Lugar
                  </span>
                </div>
                <ArrowUpRight className="w-4 h-4 text-slate-500 group-hover:text-slate-300 transition-colors" />
              </div>

              <div className="flex items-center gap-3 mb-3">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-black text-xl shadow-md ring-2 ring-white/10"
                  style={{ backgroundColor: second.gt.color }}
                >
                  {second.gt.codigo}
                </div>
                <div>
                  <h3 className="font-bold text-white text-lg group-hover:text-slate-200 uppercase tracking-wide">
                    {second.gt.nombre}
                  </h3>
                  <span className="text-xs text-slate-400">
                    {second.gt.descripcion || 'Grupo de Trabajo'}
                  </span>
                </div>
              </div>

              {/* Points Box */}
              <div className="bg-slate-900/90 rounded-xl p-3 border border-slate-800/80 mb-3">
                <div className="flex justify-between items-baseline">
                  <span className="text-xs text-slate-400 font-medium">DIAS Points</span>
                  <span className="text-2xl font-black text-slate-100 tracking-tight">
                    {second.diasPointsFinal}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2 mt-2 pt-2 border-t border-slate-800 text-[11px]">
                  <div>
                    <span className="text-slate-500 block">Brutos</span>
                    <span className="font-semibold text-slate-300">{second.puntosBrutosTotal}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Factor</span>
                    <span className="font-semibold text-amber-400">{second.factorTamano}x</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Miembros</span>
                    <span className="font-semibold text-slate-300">{second.totalIntegrantes}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Pedestal Block for visual podium effect */}
            <div className="hidden md:flex w-full h-20 bg-gradient-to-t from-slate-800 to-slate-700/60 rounded-t-xl items-center justify-center border-t border-slate-600 mt-3 shadow-inner">
              <span className="text-3xl font-black text-slate-400/40">2</span>
            </div>
          </motion.div>
        )}

        {/* FIRST PLACE (Center - Elevated) */}
        {first && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="order-1 md:order-2 flex flex-col items-center -mt-2 md:-mt-6"
          >
            {/* Crown */}
            <div className="mb-2 flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500 text-slate-950 font-extrabold text-xs shadow-lg shadow-amber-500/30 animate-pulse">
              <Crown className="w-4 h-4 fill-slate-950" />
              LÍDER DE LA LIGA
            </div>

            <div
              onClick={() => onSelectGt(first.gt.id)}
              className="w-full bg-gradient-to-b from-amber-950/40 via-slate-800/95 to-slate-800 border-2 border-amber-400/70 hover:border-amber-400 rounded-3xl p-6 cursor-pointer transition-all duration-300 shadow-2xl shadow-amber-500/10 group hover:-translate-y-1 ring-1 ring-amber-400/30"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-yellow-300 text-slate-950 flex items-center justify-center font-black text-xl shadow-lg">
                    1
                  </div>
                  <div>
                    <span className="text-xs font-black uppercase tracking-wider text-amber-300 block">
                      🥇 Primer Lugar
                    </span>
                    <span className="text-[11px] text-amber-200/70">Máxima puntuación</span>
                  </div>
                </div>
                <Trophy className="w-5 h-5 text-amber-400" />
              </div>

              <div className="flex items-center gap-3.5 mb-4">
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center text-white font-black text-2xl shadow-xl ring-4 ring-amber-400/20"
                  style={{ backgroundColor: first.gt.color }}
                >
                  {first.gt.codigo}
                </div>
                <div>
                  <h3 className="font-extrabold text-white text-2xl group-hover:text-amber-200 transition-colors uppercase tracking-wide">
                    {first.gt.nombre}
                  </h3>
                  <span className="text-xs text-amber-200/80">
                    {first.gt.descripcion || 'Grupo de Trabajo'}
                  </span>
                </div>
              </div>

              {/* Points Highlight */}
              <div className="bg-slate-950/80 rounded-2xl p-4 border border-amber-500/30 mb-3 shadow-inner">
                <div className="flex justify-between items-baseline">
                  <div>
                    <span className="text-xs uppercase font-bold text-amber-400/90 tracking-wider block">
                      DIAS Points Finales
                    </span>
                    <span className="text-[11px] text-slate-400">Puntos Brutos × Factor</span>
                  </div>
                  <span className="text-3xl sm:text-4xl font-black text-amber-300 tracking-tight">
                    {first.diasPointsFinal}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-slate-800 text-xs">
                  <div className="bg-slate-900/60 p-2 rounded-lg text-center">
                    <span className="text-slate-400 text-[10px] block">Puntos Brutos</span>
                    <span className="font-bold text-white">{first.puntosBrutosTotal}</span>
                  </div>
                  <div className="bg-amber-500/10 p-2 rounded-lg text-center border border-amber-500/20">
                    <span className="text-amber-300 text-[10px] block">Factor Tamaño</span>
                    <span className="font-extrabold text-amber-400">{first.factorTamano}x</span>
                  </div>
                  <div className="bg-slate-900/60 p-2 rounded-lg text-center">
                    <span className="text-slate-400 text-[10px] block">Integrantes</span>
                    <span className="font-bold text-white">{first.totalIntegrantes}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
                <span>{first.participacionesAsistencia} asistencias registradas</span>
                <span className="text-amber-400 group-hover:underline flex items-center gap-1 font-semibold">
                  Ver Perfil <ArrowUpRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>

            {/* Pedestal Block for visual podium effect */}
            <div className="hidden md:flex w-full h-32 bg-gradient-to-t from-amber-600/40 via-amber-500/20 to-slate-800/80 rounded-t-2xl items-center justify-center border-t-2 border-amber-400 mt-3 shadow-inner">
              <span className="text-4xl font-black text-amber-300/40">1</span>
            </div>
          </motion.div>
        )}

        {/* THIRD PLACE (Right on desktop) */}
        {third && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="order-3 md:order-3 flex flex-col items-center"
          >
            <div
              onClick={() => onSelectGt(third.gt.id)}
              className="w-full bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 hover:border-amber-800/60 rounded-2xl p-5 cursor-pointer transition-all duration-300 shadow-lg group hover:-translate-y-1"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-xl bg-amber-900/60 border border-amber-700/50 text-amber-300 flex items-center justify-center font-black text-lg shadow">
                    3
                  </div>
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-500/90">
                    🥉 Tercer Lugar
                  </span>
                </div>
                <ArrowUpRight className="w-4 h-4 text-slate-500 group-hover:text-amber-400 transition-colors" />
              </div>

              <div className="flex items-center gap-3 mb-3">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-black text-xl shadow-md ring-2 ring-white/10"
                  style={{ backgroundColor: third.gt.color }}
                >
                  {third.gt.codigo}
                </div>
                <div>
                  <h3 className="font-bold text-white text-lg group-hover:text-slate-200 uppercase tracking-wide">
                    {third.gt.nombre}
                  </h3>
                  <span className="text-xs text-slate-400">
                    {third.gt.descripcion || 'Grupo de Trabajo'}
                  </span>
                </div>
              </div>

              {/* Points Box */}
              <div className="bg-slate-900/90 rounded-xl p-3 border border-slate-800/80 mb-3">
                <div className="flex justify-between items-baseline">
                  <span className="text-xs text-slate-400 font-medium">DIAS Points</span>
                  <span className="text-2xl font-black text-amber-400/90 tracking-tight">
                    {third.diasPointsFinal}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2 mt-2 pt-2 border-t border-slate-800 text-[11px]">
                  <div>
                    <span className="text-slate-500 block">Brutos</span>
                    <span className="font-semibold text-slate-300">{third.puntosBrutosTotal}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Factor</span>
                    <span className="font-semibold text-amber-400">{third.factorTamano}x</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Miembros</span>
                    <span className="font-semibold text-slate-300">{third.totalIntegrantes}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Pedestal Block for visual podium effect */}
            <div className="hidden md:flex w-full h-14 bg-gradient-to-t from-amber-950/40 to-slate-800/60 rounded-t-xl items-center justify-center border-t border-amber-800/50 mt-3 shadow-inner">
              <span className="text-3xl font-black text-amber-700/40">3</span>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};
