import React, { useState } from 'react';
import { GtCalculado, PersonaCalculada } from '../types';
import { Crown, Sparkles, Trophy, Users, Scale, ArrowUpRight, UserCheck, Award, Medal } from 'lucide-react';
import { motion } from 'motion/react';
import { useApp } from '../lib/store';

interface PodiumProps {
  podio: GtCalculado[];
  onSelectGt: (gtId: string) => void;
  onSelectPersona?: (personaId: string) => void;
}

export const Podium: React.FC<PodiumProps> = ({ podio, onSelectGt, onSelectPersona }) => {
  const { modoRanking, setModoRanking, factorBase, rankingPersonas } = useApp();
  const [podiumType, setPodiumType] = useState<'gts' | 'personas'>('gts');

  // GT leaders
  const firstGt = podio[0];
  const secondGt = podio[1];
  const thirdGt = podio[2];

  // Persona leaders
  const topPersonas: PersonaCalculada[] = rankingPersonas.slice(0, 3);
  const firstPersona = topPersonas[0];
  const secondPersona = topPersonas[1];
  const thirdPersona = topPersonas[2];

  const hasGtPoints = firstGt && firstGt.diasPointsFinal > 0;
  const hasPersonaPoints = firstPersona && firstPersona.diasPointsTotal > 0;

  if (!hasGtPoints && !hasPersonaPoints) {
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
          <p className="text-xs text-slate-400 mt-1">
            Reconociendo el desempeño tanto por Grupos de Trabajo (GTs) como de los integrantes individuales.
          </p>
        </div>

        <div className="flex flex-col sm:items-end gap-2.5">
          {/* Category switcher: GTs vs Personas */}
          <div className="flex items-center p-1 bg-slate-950/90 rounded-2xl border border-slate-700/80 shadow-lg">
            <button
              id="podio-tab-gts"
              onClick={() => setPodiumType('gts')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 ${
                podiumType === 'gts'
                  ? 'bg-amber-500 text-slate-950 shadow-md scale-[1.02]'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>🏢 GTs (Equipos)</span>
            </button>
            <button
              id="podio-tab-personas"
              onClick={() => setPodiumType('personas')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 ${
                podiumType === 'personas'
                  ? 'bg-amber-500 text-slate-950 shadow-md scale-[1.02]'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>👤 Integrantes (Personas)</span>
              {rankingPersonas.length > 0 && (
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                  podiumType === 'personas' ? 'bg-slate-950/30 text-slate-950' : 'bg-slate-800 text-amber-300'
                }`}>
                  {rankingPersonas.length}
                </span>
              )}
            </button>
          </div>

          {/* View mode toggle (Temporada / Acumulado) */}
          <div className="flex items-center p-1 bg-slate-950/80 rounded-xl border border-slate-800 shadow-inner">
            <button
              onClick={() => setModoRanking('temporada')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                modoRanking === 'temporada'
                  ? 'bg-slate-800 text-amber-300 font-black shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              ⚡ Temporada 2026-2
            </button>
            <button
              onClick={() => setModoRanking('acumulado')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                modoRanking === 'acumulado'
                  ? 'bg-indigo-600 text-white font-black shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              📈 Acumulado
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* PODIUM DISPLAY: GTS                                                      */}
      {/* ========================================================================= */}
      {podiumType === 'gts' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6 items-end justify-center relative z-10 pt-4 pb-2">
          {/* SECOND PLACE (Left on desktop) */}
          {secondGt && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="order-2 md:order-1 flex flex-col items-center"
            >
              <div
                onClick={() => onSelectGt(secondGt.gt.id)}
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
                    style={{ backgroundColor: secondGt.gt.color }}
                  >
                    {secondGt.gt.codigo}
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-lg group-hover:text-slate-200 uppercase tracking-wide">
                      {secondGt.gt.nombre}
                    </h3>
                    <span className="text-xs text-slate-400">
                      {secondGt.gt.descripcion || 'Grupo de Trabajo'}
                    </span>
                  </div>
                </div>

                {/* Points Box */}
                <div className="bg-slate-900/90 rounded-xl p-3 border border-slate-800/80 mb-3">
                  <div className="flex justify-between items-baseline">
                    <span className="text-xs text-slate-400 font-medium">DIAS Points</span>
                    <span className="text-2xl font-black text-slate-100 tracking-tight">
                      {secondGt.diasPointsFinal}
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 mt-2 pt-2 border-t border-slate-800 text-[11px]">
                    <div>
                      <span className="text-slate-500 block">Brutos</span>
                      <span className="font-semibold text-slate-300">{secondGt.puntosBrutosTotal}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Factor</span>
                      <span className="font-semibold text-amber-400">{secondGt.factorTamano}x</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Miembros</span>
                      <span className="font-semibold text-slate-300">{secondGt.totalIntegrantes}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Pedestal Block */}
              <div className="hidden md:flex w-full h-20 bg-gradient-to-t from-slate-800 to-slate-700/60 rounded-t-xl items-center justify-center border-t border-slate-600 mt-3 shadow-inner">
                <span className="text-3xl font-black text-slate-400/40">2</span>
              </div>
            </motion.div>
          )}

          {/* FIRST PLACE (Center - Elevated) */}
          {firstGt && (
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
                onClick={() => onSelectGt(firstGt.gt.id)}
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
                    style={{ backgroundColor: firstGt.gt.color }}
                  >
                    {firstGt.gt.codigo}
                  </div>
                  <div>
                    <h3 className="font-extrabold text-white text-2xl group-hover:text-amber-200 transition-colors uppercase tracking-wide">
                      {firstGt.gt.nombre}
                    </h3>
                    <span className="text-xs text-amber-200/80">
                      {firstGt.gt.descripcion || 'Grupo de Trabajo'}
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
                      {firstGt.diasPointsFinal}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-slate-800 text-xs">
                    <div className="bg-slate-900/60 p-2 rounded-lg text-center">
                      <span className="text-slate-400 text-[10px] block">Puntos Brutos</span>
                      <span className="font-bold text-white">{firstGt.puntosBrutosTotal}</span>
                    </div>
                    <div className="bg-amber-500/10 p-2 rounded-lg text-center border border-amber-500/20">
                      <span className="text-amber-300 text-[10px] block">Factor Tamaño</span>
                      <span className="font-extrabold text-amber-400">{firstGt.factorTamano}x</span>
                    </div>
                    <div className="bg-slate-900/60 p-2 rounded-lg text-center">
                      <span className="text-slate-400 text-[10px] block">Integrantes</span>
                      <span className="font-bold text-white">{firstGt.totalIntegrantes}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
                  <span>{firstGt.participacionesAsistencia} asistencias registradas</span>
                  <span className="text-amber-400 group-hover:underline flex items-center gap-1 font-semibold">
                    Ver Perfil <ArrowUpRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>

              {/* Pedestal Block */}
              <div className="hidden md:flex w-full h-32 bg-gradient-to-t from-amber-600/40 via-amber-500/20 to-slate-800/80 rounded-t-2xl items-center justify-center border-t-2 border-amber-400 mt-3 shadow-inner">
                <span className="text-4xl font-black text-amber-300/40">1</span>
              </div>
            </motion.div>
          )}

          {/* THIRD PLACE (Right on desktop) */}
          {thirdGt && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="order-3 md:order-3 flex flex-col items-center"
            >
              <div
                onClick={() => onSelectGt(thirdGt.gt.id)}
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
                    style={{ backgroundColor: thirdGt.gt.color }}
                  >
                    {thirdGt.gt.codigo}
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-lg group-hover:text-slate-200 uppercase tracking-wide">
                      {thirdGt.gt.nombre}
                    </h3>
                    <span className="text-xs text-slate-400">
                      {thirdGt.gt.descripcion || 'Grupo de Trabajo'}
                    </span>
                  </div>
                </div>

                {/* Points Box */}
                <div className="bg-slate-900/90 rounded-xl p-3 border border-slate-800/80 mb-3">
                  <div className="flex justify-between items-baseline">
                    <span className="text-xs text-slate-400 font-medium">DIAS Points</span>
                    <span className="text-2xl font-black text-amber-400/90 tracking-tight">
                      {thirdGt.diasPointsFinal}
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 mt-2 pt-2 border-t border-slate-800 text-[11px]">
                    <div>
                      <span className="text-slate-500 block">Brutos</span>
                      <span className="font-semibold text-slate-300">{thirdGt.puntosBrutosTotal}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Factor</span>
                      <span className="font-semibold text-amber-400">{thirdGt.factorTamano}x</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Miembros</span>
                      <span className="font-semibold text-slate-300">{thirdGt.totalIntegrantes}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Pedestal Block */}
              <div className="hidden md:flex w-full h-14 bg-gradient-to-t from-amber-950/40 to-slate-800/60 rounded-t-xl items-center justify-center border-t border-amber-800/50 mt-3 shadow-inner">
                <span className="text-3xl font-black text-amber-700/40">3</span>
              </div>
            </motion.div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* PODIUM DISPLAY: PERSONAS (INTEGRANTES)                                    */}
      {/* ========================================================================= */}
      {podiumType === 'personas' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6 items-end justify-center relative z-10 pt-4 pb-2">
          {/* SECOND PLACE PERSONA (Left on desktop) */}
          {secondPersona ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="order-2 md:order-1 flex flex-col items-center"
            >
              <div
                onClick={() => onSelectPersona?.(secondPersona.persona.id)}
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
                    className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-black text-lg shadow-md ring-2 ring-white/10 shrink-0"
                    style={{ backgroundColor: secondPersona.gt?.color || '#475569' }}
                  >
                    {secondPersona.persona.nombreCompleto.charAt(0)}
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-bold text-white text-base group-hover:text-slate-200 truncate">
                      {secondPersona.persona.nombreCompleto}
                    </h3>
                    <span
                      className="inline-block mt-0.5 text-[10px] font-extrabold px-2 py-0.5 rounded-md text-white shadow-sm"
                      style={{ backgroundColor: secondPersona.gt?.color || '#475569' }}
                    >
                      {secondPersona.gt?.nombre || 'General'}
                    </span>
                  </div>
                </div>

                {/* Points Box */}
                <div className="bg-slate-900/90 rounded-xl p-3 border border-slate-800/80 mb-3">
                  <div className="flex justify-between items-baseline">
                    <span className="text-xs text-slate-400 font-medium">DIAS Points</span>
                    <span className="text-2xl font-black text-slate-100 tracking-tight">
                      {secondPersona.diasPointsTotal}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 mt-2 pt-2 border-t border-slate-800 text-[11px]">
                    <div>
                      <span className="text-slate-500 block">Asistencias</span>
                      <span className="font-semibold text-slate-300">+{secondPersona.puntosAsistencia} pts ({secondPersona.totalEventos} ev.)</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Retos</span>
                      <span className="font-semibold text-amber-400">+{secondPersona.puntosRetos} pts</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Pedestal Block */}
              <div className="hidden md:flex w-full h-20 bg-gradient-to-t from-slate-800 to-slate-700/60 rounded-t-xl items-center justify-center border-t border-slate-600 mt-3 shadow-inner">
                <span className="text-3xl font-black text-slate-400/40">2</span>
              </div>
            </motion.div>
          ) : (
            <div className="order-2 md:order-1 flex flex-col items-center opacity-40">
              <div className="w-full bg-slate-800/40 border border-slate-800 rounded-2xl p-6 text-center text-xs text-slate-500">
                Puesto 2 disponible
              </div>
            </div>
          )}

          {/* FIRST PLACE PERSONA (Center - Elevated) */}
          {firstPersona ? (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="order-1 md:order-2 flex flex-col items-center -mt-2 md:-mt-6"
            >
              {/* Crown */}
              <div className="mb-2 flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500 text-slate-950 font-extrabold text-xs shadow-lg shadow-amber-500/30 animate-pulse">
                <Crown className="w-4 h-4 fill-slate-950" />
                LÍDER INDIVIDUAL
              </div>

              <div
                onClick={() => onSelectPersona?.(firstPersona.persona.id)}
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
                      <span className="text-[11px] text-amber-200/70">Máxima puntuación individual</span>
                    </div>
                  </div>
                  <Trophy className="w-5 h-5 text-amber-400" />
                </div>

                <div className="flex items-center gap-3.5 mb-4">
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center text-white font-black text-2xl shadow-xl ring-4 ring-amber-400/20 shrink-0"
                    style={{ backgroundColor: firstPersona.gt?.color || '#f59e0b' }}
                  >
                    {firstPersona.persona.nombreCompleto.charAt(0)}
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-extrabold text-white text-xl group-hover:text-amber-200 transition-colors truncate">
                      {firstPersona.persona.nombreCompleto}
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span
                        className="text-xs font-extrabold px-2.5 py-0.5 rounded-lg text-white shadow-sm"
                        style={{ backgroundColor: firstPersona.gt?.color || '#475569' }}
                      >
                        {firstPersona.gt?.nombre || 'General'}
                      </span>
                      <span className="text-[11px] text-slate-400">
                        {firstPersona.persona.correo}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Points Highlight */}
                <div className="bg-slate-950/80 rounded-2xl p-4 border border-amber-500/30 mb-3 shadow-inner">
                  <div className="flex justify-between items-baseline">
                    <div>
                      <span className="text-xs uppercase font-bold text-amber-400/90 tracking-wider block">
                        Puntos Individuales
                      </span>
                      <span className="text-[11px] text-slate-400">Asistencia + Retos</span>
                    </div>
                    <span className="text-3xl sm:text-4xl font-black text-amber-300 tracking-tight">
                      {firstPersona.diasPointsTotal} pts
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-slate-800 text-xs">
                    <div className="bg-slate-900/60 p-2 rounded-lg text-center">
                      <span className="text-slate-400 text-[10px] block">Asistencias</span>
                      <span className="font-bold text-white">+{firstPersona.puntosAsistencia} pts ({firstPersona.totalEventos} ev.)</span>
                    </div>
                    <div className="bg-amber-500/10 p-2 rounded-lg text-center border border-amber-500/20">
                      <span className="text-amber-300 text-[10px] block">Retos Ganados</span>
                      <span className="font-extrabold text-amber-400">+{firstPersona.puntosRetos} pts</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
                  <span>Puntuación más alta de la temporada</span>
                  <span className="text-amber-400 group-hover:underline flex items-center gap-1 font-semibold">
                    Ver Historial <ArrowUpRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>

              {/* Pedestal Block */}
              <div className="hidden md:flex w-full h-32 bg-gradient-to-t from-amber-600/40 via-amber-500/20 to-slate-800/80 rounded-t-2xl items-center justify-center border-t-2 border-amber-400 mt-3 shadow-inner">
                <span className="text-4xl font-black text-amber-300/40">1</span>
              </div>
            </motion.div>
          ) : (
            <div className="order-1 md:order-2 flex flex-col items-center opacity-40">
              <div className="w-full bg-slate-800/40 border border-slate-800 rounded-3xl p-8 text-center text-sm text-slate-500">
                Puesto 1 disponible
              </div>
            </div>
          )}

          {/* THIRD PLACE PERSONA (Right on desktop) */}
          {thirdPersona ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="order-3 md:order-3 flex flex-col items-center"
            >
              <div
                onClick={() => onSelectPersona?.(thirdPersona.persona.id)}
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
                    className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-black text-lg shadow-md ring-2 ring-white/10 shrink-0"
                    style={{ backgroundColor: thirdPersona.gt?.color || '#475569' }}
                  >
                    {thirdPersona.persona.nombreCompleto.charAt(0)}
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-bold text-white text-base group-hover:text-slate-200 truncate">
                      {thirdPersona.persona.nombreCompleto}
                    </h3>
                    <span
                      className="inline-block mt-0.5 text-[10px] font-extrabold px-2 py-0.5 rounded-md text-white shadow-sm"
                      style={{ backgroundColor: thirdPersona.gt?.color || '#475569' }}
                    >
                      {thirdPersona.gt?.nombre || 'General'}
                    </span>
                  </div>
                </div>

                {/* Points Box */}
                <div className="bg-slate-900/90 rounded-xl p-3 border border-slate-800/80 mb-3">
                  <div className="flex justify-between items-baseline">
                    <span className="text-xs text-slate-400 font-medium">DIAS Points</span>
                    <span className="text-2xl font-black text-amber-400/90 tracking-tight">
                      {thirdPersona.diasPointsTotal}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 mt-2 pt-2 border-t border-slate-800 text-[11px]">
                    <div>
                      <span className="text-slate-500 block">Asistencias</span>
                      <span className="font-semibold text-slate-300">+{thirdPersona.puntosAsistencia} pts ({thirdPersona.totalEventos} ev.)</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Retos</span>
                      <span className="font-semibold text-amber-400">+{thirdPersona.puntosRetos} pts</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Pedestal Block */}
              <div className="hidden md:flex w-full h-14 bg-gradient-to-t from-amber-950/40 to-slate-800/60 rounded-t-xl items-center justify-center border-t border-amber-800/50 mt-3 shadow-inner">
                <span className="text-3xl font-black text-amber-700/40">3</span>
              </div>
            </motion.div>
          ) : (
            <div className="order-3 md:order-3 flex flex-col items-center opacity-40">
              <div className="w-full bg-slate-800/40 border border-slate-800 rounded-2xl p-6 text-center text-xs text-slate-500">
                Puesto 3 disponible
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* COMPLEMENTARY HIGHLIGHT BANNER: Bridges GTs and Personas                   */}
      {/* ========================================================================= */}
      <div className="mt-4 pt-4 border-t border-slate-800/90 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        {podiumType === 'gts' ? (
          <>
            <div className="flex items-center gap-2 text-slate-300">
              <Medal className="w-4 h-4 text-amber-400 shrink-0" />
              <span>
                <strong className="text-white">Líderes Individuales: </strong>
                {topPersonas.length > 0 ? (
                  topPersonas.map((p, i) => (
                    <span key={p.persona.id} className="inline-block mr-2">
                      <span className="text-amber-400 font-bold">#{i + 1}</span> {p.persona.nombreCompleto} ({p.diasPointsTotal} pts)
                      {i < topPersonas.length - 1 ? ' •' : ''}
                    </span>
                  ))
                ) : (
                  <span>Registrando primeros puntos...</span>
                )}
              </span>
            </div>
            <button
              onClick={() => setPodiumType('personas')}
              className="text-amber-400 hover:text-amber-300 font-bold flex items-center gap-1 transition-colors shrink-0"
            >
              <span>Ver Podio de Integrantes</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </>
        ) : (
          <>
            <div className="flex items-center gap-2 text-slate-300">
              <Trophy className="w-4 h-4 text-amber-400 shrink-0" />
              <span>
                <strong className="text-white">Líderes de Grupos de Trabajo: </strong>
                {firstGt && <span><span className="text-amber-400 font-bold">#1</span> {firstGt.gt.nombre} ({firstGt.diasPointsFinal} pts) • </span>}
                {secondGt && <span><span className="text-slate-300 font-bold">#2</span> {secondGt.gt.nombre} ({secondGt.diasPointsFinal} pts) • </span>}
                {thirdGt && <span><span className="text-amber-600 font-bold">#3</span> {thirdGt.gt.nombre} ({thirdGt.diasPointsFinal} pts)</span>}
              </span>
            </div>
            <button
              onClick={() => setPodiumType('gts')}
              className="text-amber-400 hover:text-amber-300 font-bold flex items-center gap-1 transition-colors shrink-0"
            >
              <span>Ver Podio de GTs</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </>
        )}
      </div>
    </div>
  );
};
