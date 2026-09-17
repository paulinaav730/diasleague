import React, { useState, useMemo } from 'react';
import { PersonaCalculada, GrupoTrabajo } from '../types';
import { Search, ArrowUpRight, Award, User, ChevronDown, ChevronUp, Sparkles, CheckCircle2 } from 'lucide-react';
import { useApp } from '../lib/store';

interface IndividualRankingProps {
  ranking: PersonaCalculada[];
  onSelectPersona: (personaId: string) => void;
}

export const IndividualRanking: React.FC<IndividualRankingProps> = ({
  ranking,
  onSelectPersona,
}) => {
  const { currentPersona } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGtFilter, setSelectedGtFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'puntos' | 'asistencias' | 'retos' | 'nombre'>('puntos');
  const [limitCount, setLimitCount] = useState<number>(24);

  const gtsList: GrupoTrabajo[] = useMemo(() => {
    return Array.from(
      new Map<string, GrupoTrabajo>(
        ranking
          .map((r) => r.gt)
          .filter((gt): gt is GrupoTrabajo => Boolean(gt))
          .map((gt) => [gt.id, gt])
      ).values()
    );
  }, [ranking]);

  const filteredAndSorted = useMemo(() => {
    const list = ranking.filter((item) => {
      const matchesSearch =
        item.persona.nombreCompleto.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.persona.correo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.gt?.nombre || '').toLowerCase().includes(searchTerm.toLowerCase());

      const matchesGt =
        selectedGtFilter === 'all' || item.gt?.id === selectedGtFilter;

      return matchesSearch && matchesGt;
    });

    return list.sort((a, b) => {
      if (sortBy === 'puntos') {
        return b.diasPointsTotal - a.diasPointsTotal;
      }
      if (sortBy === 'asistencias') {
        return b.totalEventos - a.totalEventos;
      }
      if (sortBy === 'retos') {
        return b.puntosRetos - a.puntosRetos;
      }
      if (sortBy === 'nombre') {
        return a.persona.nombreCompleto.localeCompare(b.persona.nombreCompleto);
      }
      return 0;
    });
  }, [ranking, searchTerm, selectedGtFilter, sortBy]);

  const visibleList = filteredAndSorted.slice(0, limitCount);
  const hasMore = filteredAndSorted.length > limitCount;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-7 shadow-xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
              <Award className="w-5 h-5 text-indigo-400" />
              Ranking Individual de Integrantes
            </h3>
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-slate-800 text-indigo-300 border border-slate-700">
              {ranking.length} personas registradas
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Puntos personales acumulados por asistencia a Conectados y retos individuales ganados.
          </p>
        </div>

        {/* Filters and Search */}
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

          {/* Sort selector */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="bg-slate-800/90 text-xs sm:text-sm text-slate-200 py-1.5 px-3 rounded-xl border border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
          >
            <option value="puntos">Mayor Puntuación</option>
            <option value="asistencias">Más Asistencias</option>
            <option value="retos">Más Puntos Retos</option>
            <option value="nombre">Nombre A-Z</option>
          </select>
        </div>
      </div>

      {/* Leaderboard list */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {visibleList.map((item) => {
          const isTop1 = item.posicion === 1;
          const isTop2 = item.posicion === 2;
          const isTop3 = item.posicion === 3;
          const isCurrentLoggedIn = currentPersona?.id === item.persona.id;

          return (
            <div
              key={item.persona.id}
              onClick={() => onSelectPersona(item.persona.id)}
              className={`p-4 rounded-2xl border transition-all duration-200 cursor-pointer group hover:-translate-y-0.5 relative overflow-hidden ${
                isCurrentLoggedIn
                  ? 'bg-indigo-950/40 border-indigo-500/80 shadow-md shadow-indigo-500/10 ring-1 ring-indigo-500/40'
                  : isTop1
                  ? 'bg-amber-950/20 border-amber-500/40 hover:border-amber-400'
                  : isTop2
                  ? 'bg-slate-800/70 border-slate-600/60 hover:border-slate-400'
                  : isTop3
                  ? 'bg-amber-900/10 border-amber-700/40 hover:border-amber-600'
                  : 'bg-slate-800/40 border-slate-800 hover:border-slate-700 hover:bg-slate-800/70'
              }`}
            >
              {isCurrentLoggedIn && (
                <div className="absolute top-0 right-0 bg-indigo-600 text-white text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-bl-lg flex items-center gap-1">
                  <Sparkles className="w-2.5 h-2.5" /> Tu Perfil
                </div>
              )}

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 min-w-0">
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
                  <div className="min-w-0">
                    <h4 className="font-bold text-white text-sm group-hover:text-indigo-300 transition-colors truncate">
                      {item.persona.nombreCompleto}
                    </h4>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span
                        className="w-2 h-2 rounded-full shrink-0"
                        style={{ backgroundColor: item.gt?.color || '#94A3B8' }}
                      />
                      <span className="text-xs text-slate-400 font-medium truncate">
                        {item.gt?.nombre || 'General'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Points */}
                <div className="text-right shrink-0 pl-2">
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
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                  {item.totalEventos} {item.totalEventos === 1 ? 'evento' : 'eventos'}
                </span>
                <span>+{item.puntosAsistencia} asist. / +{item.puntosRetos} retos</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Pagination / Expand control */}
      {filteredAndSorted.length > 24 && (
        <div className="mt-6 text-center">
          {hasMore ? (
            <button
              onClick={() => setLimitCount((prev) => prev + 24)}
              className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs border border-slate-700 transition-all inline-flex items-center gap-1.5 shadow"
            >
              <span>Mostrar más integrantes ({filteredAndSorted.length - visibleList.length} restantes)</span>
              <ChevronDown className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={() => setLimitCount(24)}
              className="px-5 py-2 rounded-xl bg-slate-800/60 hover:bg-slate-800 text-slate-300 font-semibold text-xs border border-slate-700/60 transition-all inline-flex items-center gap-1.5"
            >
              <span>Mostrar menos (Ver primeros 24)</span>
              <ChevronUp className="w-4 h-4" />
            </button>
          )}
        </div>
      )}

      {ranking.length === 0 ? (
        <div className="py-14 text-center border border-dashed border-slate-800 rounded-2xl bg-slate-900/40">
          <div className="w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center mx-auto mb-3 text-slate-400">
            <Award className="w-6 h-6 opacity-60" />
          </div>
          <p className="text-base font-bold text-slate-300">No hay personas registradas todavía.</p>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Puedes importar la lista oficial en Excel o agregar participantes manualmente desde el Panel de Administración.
          </p>
        </div>
      ) : filteredAndSorted.length === 0 ? (
        <div className="py-12 text-center text-slate-500 text-sm">
          No se encontraron integrantes con los filtros seleccionados.
        </div>
      ) : null}
    </div>
  );
};
