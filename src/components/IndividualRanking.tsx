import React, { useState } from 'react';
import { PersonaCalculada, GrupoTrabajo } from '../types';
import { Trophy, Search, Filter, ArrowUpRight, Award } from 'lucide-react';

interface IndividualRankingProps {
  ranking: PersonaCalculada[];
  onSelectPersona: (personaId: string) => void;
}

export const IndividualRanking: React.FC<IndividualRankingProps> = ({
  ranking,
  onSelectPersona,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGtFilter, setSelectedGtFilter] = useState<string>('all');

  const gtsList: GrupoTrabajo[] = Array.from(
    new Map<string, GrupoTrabajo>(
      ranking
        .map((r) => r.gt)
        .filter((gt): gt is GrupoTrabajo => Boolean(gt))
        .map((gt) => [gt.id, gt])
    ).values()
  );

  const filtered = ranking.filter((item) => {
    const matchesSearch =
      item.persona.nombreCompleto.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.gt?.nombre.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesGt =
      selectedGtFilter === 'all' || item.gt?.id === selectedGtFilter;

    return matchesSearch && matchesGt;
  });

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-7 shadow-xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
              <Award className="w-5 h-5 text-indigo-400" />
              Ranking Individual de Participantes
            </h3>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Puntos personales acumulados por asistencia y retos individuales (sin factor de tamaño)
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Search */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar integrante..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-slate-800/90 text-xs sm:text-sm text-white pl-9 pr-3 py-1.5 rounded-xl border border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 w-36 sm:w-44 placeholder-slate-500"
            />
          </div>

          {/* GT Filter */}
          <select
            value={selectedGtFilter}
            onChange={(e) => setSelectedGtFilter(e.target.value)}
            className="bg-slate-800/90 text-xs sm:text-sm text-slate-200 py-1.5 px-3 rounded-xl border border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
          >
            <option value="all">Todos los GTs</option>
            {gtsList.map((gt) => (
              <option key={gt?.id} value={gt?.id}>
                {gt?.nombre}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Leaderboard list */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {filtered.slice(0, 18).map((item) => {
          const isTop1 = item.posicion === 1;
          const isTop2 = item.posicion === 2;
          const isTop3 = item.posicion === 3;

          return (
            <div
              key={item.persona.id}
              onClick={() => onSelectPersona(item.persona.id)}
              className={`p-4 rounded-2xl border transition-all duration-200 cursor-pointer group hover:-translate-y-0.5 ${
                isTop1
                  ? 'bg-amber-950/20 border-amber-500/40 hover:border-amber-400'
                  : isTop2
                  ? 'bg-slate-800/70 border-slate-600/60 hover:border-slate-400'
                  : isTop3
                  ? 'bg-amber-900/10 border-amber-700/40 hover:border-amber-600'
                  : 'bg-slate-800/40 border-slate-800 hover:border-slate-700 hover:bg-slate-800/70'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {/* Position Badge */}
                  <div
                    className={`w-8 h-8 rounded-xl flex items-center justify-center font-black text-xs shrink-0 ${
                      isTop1
                        ? 'bg-amber-400 text-slate-950 shadow-md shadow-amber-500/20'
                        : isTop2
                        ? 'bg-slate-300 text-slate-950'
                        : isTop3
                        ? 'bg-amber-700 text-amber-100'
                        : 'bg-slate-800 text-slate-400 border border-slate-700'
                    }`}
                  >
                    #{item.posicion}
                  </div>

                  {/* Name and GT */}
                  <div>
                    <h4 className="font-bold text-white text-sm group-hover:text-indigo-300 transition-colors">
                      {item.persona.nombreCompleto}
                    </h4>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: item.gt?.color || '#94A3B8' }}
                      />
                      <span className="text-xs text-slate-400 font-medium">
                        GT {item.gt?.nombre || 'General'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Points */}
                <div className="text-right">
                  <span className="text-base font-black text-amber-300 block">
                    {item.diasPointsTotal}
                  </span>
                  <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">
                    pts
                  </span>
                </div>
              </div>

              {/* Event & Challenge stats footer */}
              <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                <span>{item.totalEventos} eventos</span>
                <span>+{item.puntosAsistencia} asist. / +{item.puntosRetos} retos</span>
              </div>
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="py-12 text-center text-slate-500 text-sm">
          No se encontraron integrantes con los filtros seleccionados.
        </div>
      )}
    </div>
  );
};
