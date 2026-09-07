import React, { useState } from 'react';
import { GtCalculado } from '../types';
import { Trophy, Users, Search, ArrowUpDown, ChevronRight, Info } from 'lucide-react';

interface GtRankingTableProps {
  ranking: GtCalculado[];
  onSelectGt: (gtId: string) => void;
}

export const GtRankingTable: React.FC<GtRankingTableProps> = ({ ranking, onSelectGt }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showFactorExplanation, setShowFactorExplanation] = useState(false);

  const filteredRanking = ranking.filter(
    (item) =>
      item.gt.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.gt.codigo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPuntos = ranking.reduce((acc, item) => acc + item.diasPointsFinal, 0);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-7 shadow-xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
              <Trophy className="w-5 h-5 text-amber-400" />
              Tabla General de Grupos de Trabajo (GTs)
            </h3>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Ranking oficial actualizado en tiempo real con ponderación por factor de tamaño
          </p>
        </div>

        {/* Search bar & factor help */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              id="input-buscar-gt"
              type="text"
              placeholder="Buscar GT..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-slate-800/90 text-xs sm:text-sm text-white pl-9 pr-3 py-1.5 rounded-xl border border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 w-36 sm:w-48 placeholder-slate-500"
            />
          </div>

          <button
            onClick={() => setShowFactorExplanation(!showFactorExplanation)}
            className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl border border-slate-700 text-xs flex items-center gap-1"
            title="¿Cómo funciona el factor de tamaño?"
          >
            <Info className="w-4 h-4 text-amber-400" />
            <span className="hidden sm:inline">Fórmula</span>
          </button>
        </div>
      </div>

      {/* Factor formula banner if toggled */}
      {showFactorExplanation && (
        <div className="mb-6 p-4 bg-slate-800/70 border border-amber-500/30 rounded-2xl text-xs text-slate-300">
          <div className="flex items-start gap-2">
            <Info className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" />
            <div>
              <span className="font-bold text-amber-300 text-sm block mb-1">
                Fórmula de Competencia Justa:
              </span>
              <p className="mb-1 text-slate-200">
                <code className="bg-slate-900 px-2 py-0.5 rounded text-amber-300 font-mono font-bold">
                  DIAS POINTS = PUNTOS BRUTOS × FACTOR DE TAMAÑO
                </code>
              </p>
              <p className="text-slate-400">
                Debido a que los GTs tienen diferente número de miembros (ej. Finanzas 3 vs Generales 15),
                el factor de tamaño equilibra el esfuerzo:
                <span className="text-slate-200 ml-1">
                  1-5 integrantes (1.3x) • 6-10 integrantes (1.1x) • 11+ integrantes (1.0x).
                </span>
              </p>
            </div>
          </div>
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
                        <span className="font-bold text-white group-hover:text-amber-300 transition-colors block">
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
