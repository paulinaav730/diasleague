import React, { useState } from 'react';
import { GtCalculado } from '../types';
import { Trophy, Users, Search, ArrowUpDown, ChevronRight, Info, Scale, Sparkles } from 'lucide-react';
import { useApp } from '../lib/store';

interface GtRankingTableProps {
  ranking: GtCalculado[];
  onSelectGt: (gtId: string) => void;
}

export const GtRankingTable: React.FC<GtRankingTableProps> = ({ ranking, onSelectGt }) => {
  const { modoRanking, setModoRanking, factorBase } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [showFactorExplanation, setShowFactorExplanation] = useState(false);

  const filteredRanking = ranking.filter(
    (item) =>
      item.gt.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.gt.codigo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPuntos = ranking.reduce((acc, item) => acc + item.diasPointsFinal, 0);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-7 shadow-xl space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
              <Trophy className="w-5 h-5 text-amber-400" />
              Tabla General de Grupos de Trabajo (GTs)
            </h3>
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
              Base {factorBase}x
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            {modoRanking === 'temporada'
              ? 'Puntuación oficial de la Temporada 2026-2 nivelada por factor de tamaño.'
              : 'Puntuación histórica acumulada oficial (Semestre 2026-1 + Temporada 2026-2).'}
          </p>
        </div>

        {/* View Mode Toggle & Search */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Season Switcher */}
          <div className="flex items-center p-1 bg-slate-950 rounded-xl border border-slate-800 shadow-inner">
            <button
              id="ranking-toggle-temporada"
              onClick={() => setModoRanking('temporada')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                modoRanking === 'temporada'
                  ? 'bg-amber-500 text-slate-950 font-black shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <span>⚡ Temporada 2026-2</span>
            </button>
            <button
              id="ranking-toggle-acumulado"
              onClick={() => setModoRanking('acumulado')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                modoRanking === 'acumulado'
                  ? 'bg-indigo-600 text-white font-black shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <span>📈 Acumulado</span>
            </button>
          </div>

          {/* Search bar */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              id="input-buscar-gt"
              type="text"
              placeholder="Buscar GT..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-slate-800/90 text-xs sm:text-sm text-white pl-9 pr-3 py-1.5 rounded-xl border border-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-500 w-36 sm:w-44 placeholder-slate-500"
            />
          </div>

          <button
            onClick={() => setShowFactorExplanation(!showFactorExplanation)}
            className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl border border-slate-700 text-xs flex items-center gap-1.5"
            title="¿Cómo se calcula el factor de tamaño?"
          >
            <Scale className="w-4 h-4 text-amber-400" />
            <span className="hidden sm:inline font-bold">Fórmula {factorBase}</span>
          </button>
        </div>
      </div>

      {/* Factor formula banner if toggled */}
      {showFactorExplanation && (
        <div className="p-4 bg-slate-800/80 border border-amber-500/40 rounded-2xl text-xs text-slate-300 space-y-2">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2">
              <Scale className="w-4 h-4 text-amber-400 shrink-0" />
              <span className="font-black text-amber-300 text-sm">
                Fórmula de Competencia Justa Calibrada (2026-2):
              </span>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 text-amber-400 border border-amber-500/30">
              Factor Base: {factorBase}
            </span>
          </div>

          <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800 font-mono text-xs flex flex-wrap items-center gap-3">
            <span className="text-amber-300 font-bold">
              DIAS POINTS = PUNTOS BRUTOS × ({factorBase} / INTEGRANTES)
            </span>
          </div>

          <p className="text-slate-400 leading-relaxed">
            Cada GT tiene un factor calculado exactamente como{' '}
            <strong className="text-white">{factorBase} dividido entre su número de integrantes</strong>.
            Con Base 14, el grupo más numeroso (14 integrantes) tiene factor <strong>1.00x</strong> (sin inflación artificial),
            mientras un grupo de 10 tiene <strong>1.40x</strong> y uno de 7 tiene <strong>2.00x</strong>.
            Así, si dos grupos asisten al 100%, ambos ganan exactamente la misma cantidad de DIAS Points.
          </p>
        </div>
      )}

      {/* Zero points notification banner */}
      {totalPuntos === 0 && (
        <div className="mb-5 p-3.5 bg-slate-800/60 border border-slate-700/60 rounded-2xl flex items-center justify-between gap-3 text-xs text-slate-400">
          <div className="flex items-center gap-2.5">
            <Trophy className="w-4 h-4 text-amber-400/80 shrink-0" />
            <span className="font-semibold text-slate-200">El ranking todavía no tiene puntos.</span>
          </div>
          <span className="text-[11px] text-slate-500 hidden sm:inline">
            Todos los GTs inician en 0 puntos a la espera del registro de participaciones reales.
          </span>
        </div>
      )}

      {/* Table container */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-slate-300">
          <thead className="bg-slate-800/60 text-slate-400 uppercase text-[11px] font-bold tracking-wider border-b border-slate-800">
            <tr>
              <th className="py-3 px-4 rounded-l-xl">Posición</th>
              <th className="py-3 px-4">Grupo de Trabajo (GT)</th>
              <th className="py-3 px-4 text-center">Integrantes</th>
              <th className="py-3 px-4 text-center">Factor</th>
              <th className="py-3 px-4 text-right">Puntos Brutos</th>
              <th className="py-3 px-4 text-right">DIAS Points</th>
              <th className="py-3 px-4 text-center rounded-r-xl">Acción</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {filteredRanking.map((item) => {
              const hasPoints = item.diasPointsFinal > 0;
              const isFirst = hasPoints && item.posicion === 1;
              const isSecond = hasPoints && item.posicion === 2;
              const isThird = hasPoints && item.posicion === 3;

              return (
                <tr
                  key={item.gt.id}
                  onClick={() => onSelectGt(item.gt.id)}
                  className={`hover:bg-slate-800/50 cursor-pointer transition-colors group ${
                    isFirst ? 'bg-amber-500/5' : ''
                  }`}
                >
                  {/* Position */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <div className="flex items-center gap-2 font-black">
                      {isFirst && (
                        <span className="w-7 h-7 rounded-lg bg-amber-400 text-slate-950 flex items-center justify-center text-xs shadow-md shadow-amber-500/30">
                          🥇 1
                        </span>
                      )}
                      {isSecond && (
                        <span className="w-7 h-7 rounded-lg bg-slate-300 text-slate-950 flex items-center justify-center text-xs shadow">
                          🥈 2
                        </span>
                      )}
                      {isThird && (
                        <span className="w-7 h-7 rounded-lg bg-amber-700 text-amber-100 flex items-center justify-center text-xs shadow">
                          🥉 3
                        </span>
                      )}
                      {!isFirst && !isSecond && !isThird && (
                        <span className="w-7 h-7 rounded-lg bg-slate-800 text-slate-400 flex items-center justify-center text-xs border border-slate-700 font-medium">
                          {hasPoints ? `#${item.posicion}` : '-'}
                        </span>
                      )}
                    </div>
                  </td>

                  {/* GT Info */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-black text-sm shadow-sm ring-1 ring-white/20"
                        style={{ backgroundColor: item.gt.color }}
                      >
                        {item.gt.codigo}
                      </div>
                      <div>
                        <span className="font-bold text-white group-hover:text-amber-300 transition-colors block uppercase tracking-wide">
                          {item.gt.nombre}
                        </span>
                        <span className="text-[11px] text-slate-400">
                          {item.participacionesAsistencia} asistencias • {item.retosCompletados} retos
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* Members */}
                  <td className="py-3.5 px-4 text-center whitespace-nowrap">
                    <span className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 border border-slate-700/60 font-medium">
                      <Users className="w-3 h-3 text-slate-400" />
                      {item.totalIntegrantes}
                    </span>
                  </td>

                  {/* Factor */}
                  <td className="py-3.5 px-4 text-center whitespace-nowrap">
                    <span
                      className={`text-xs px-2.5 py-0.5 rounded-full font-bold border ${
                        item.factorTamano > 1.1
                          ? 'bg-blue-500/20 text-blue-300 border-blue-500/30'
                          : item.factorTamano > 1.0
                          ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30'
                          : 'bg-slate-800 text-slate-400 border-slate-700'
                      }`}
                    >
                      {item.factorTamano}x
                    </span>
                  </td>

                  {/* Gross points */}
                  <td className="py-3.5 px-4 text-right whitespace-nowrap">
                    <span className="font-semibold text-slate-300 text-sm">
                      {item.puntosBrutosTotal}
                    </span>
                    <span className="text-[10px] text-slate-500 block">
                      ({item.puntosBrutosAsistencia} asist. + {item.puntosBrutosRetos} retos)
                    </span>
                  </td>

                  {/* DIAS Points */}
                  <td className="py-3.5 px-4 text-right whitespace-nowrap">
                    <span
                      className={`text-lg font-black tracking-tight ${
                        isFirst
                          ? 'text-amber-400 text-xl'
                          : isSecond
                          ? 'text-slate-100'
                          : isThird
                          ? 'text-amber-500'
                          : 'text-white'
                      }`}
                    >
                      {item.diasPointsFinal}
                    </span>
                    <span className="text-[10px] text-slate-400 block font-medium">
                      DIAS Points
                    </span>
                  </td>

                  {/* Action */}
                  <td className="py-3.5 px-4 text-center whitespace-nowrap">
                    <button
                      className="p-1.5 rounded-lg bg-slate-800 group-hover:bg-indigo-600 text-slate-400 group-hover:text-white transition-colors"
                      title="Ver Perfil Completo del GT"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
