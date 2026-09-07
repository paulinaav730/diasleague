import React from 'react';
import { useApp } from '../lib/store';
import {
  BarChart3,
  TrendingUp,
  Scale,
  Users,
  Trophy,
  PieChart,
  Layers,
} from 'lucide-react';

export const AnalyticsView: React.FC = () => {
  const { rankingGts, eventos, asistencias, temporadaActiva } = useApp();

  const maxDiasPoints = Math.max(...rankingGts.map((r) => r.diasPointsFinal), 100);
  const maxGrossPoints = Math.max(...rankingGts.map((r) => r.puntosBrutosTotal), 100);
  const maxMembers = Math.max(...rankingGts.map((r) => r.totalIntegrantes), 15);

  const seasonEvents = eventos.filter((e) => e.temporadaId === temporadaActiva?.id);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-xl">
        <div className="flex items-center gap-2">
          <span className="text-xs uppercase font-extrabold tracking-wider text-indigo-400 bg-indigo-500/10 border border-indigo-500/30 px-2.5 py-0.5 rounded-full">
            Inteligencia Competitiva
          </span>
          <span className="text-xs text-slate-400 font-medium">
            {temporadaActiva?.nombre}
          </span>
        </div>
        <h2 className="text-2xl font-black text-white mt-1">
          Analítica de Rendimiento y Comparativas
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
          Visualización del impacto del factor de tamaño, asistencia intergrupal y distribución de puntos
        </p>
      </div>

      {/* Main Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* CHART 1: DIAS Points Finales Ranking */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Trophy className="w-4 h-4 text-amber-400" />
                DIAS Points Finales (Competencia Oficial)
              </h3>
              <p className="text-xs text-slate-400">Puntaje ponderado con factor de tamaño</p>
            </div>
            <span className="text-xs font-mono font-bold text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded">
              Líder: {rankingGts[0]?.gt.nombre} ({rankingGts[0]?.diasPointsFinal} pts)
            </span>
          </div>

          <div className="space-y-3 pt-2">
            {rankingGts.map((item, idx) => {
              const widthPct = Math.max(5, (item.diasPointsFinal / maxDiasPoints) * 100);
              return (
                <div key={item.gt.id} className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-slate-300 flex items-center gap-1.5">
                      <span className="text-slate-500 font-mono text-[10px]">#{idx + 1}</span>
                      <span
                        className="w-2.5 h-2.5 rounded-full"
                        style={{ backgroundColor: item.gt.color }}
                      />
                      {item.gt.nombre} ({item.totalIntegrantes} integrantes)
                    </span>
                    <span className="text-amber-400 font-bold">{item.diasPointsFinal} pts</span>
                  </div>
                  <div className="w-full bg-slate-800 h-3 rounded-full overflow-hidden flex">
                    <div
                      className="h-full rounded-full transition-all duration-700 ease-out"
                      style={{
                        width: `${widthPct}%`,
                        backgroundColor: item.gt.color,
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* CHART 2: Comparativa PUNTOS BRUTOS vs FACTOR DE TAMAÑO */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Scale className="w-4 h-4 text-emerald-400" />
                Equidad: Puntos Brutos vs DIAS Points
              </h3>
              <p className="text-xs text-slate-400">
                Visualiza cómo el factor equilibra a los equipos pequeños vs grandes
              </p>
            </div>
          </div>

          <div className="space-y-4 pt-2">
            {rankingGts.slice(0, 6).map((item) => {
              const grossWidth = Math.max(5, (item.puntosBrutosTotal / maxGrossPoints) * 100);
              const diasWidth = Math.max(5, (item.diasPointsFinal / maxDiasPoints) * 100);

              return (
                <div key={item.gt.id} className="p-3 rounded-2xl bg-slate-800/40 border border-slate-800">
                  <div className="flex justify-between items-center text-xs mb-1.5">
                    <span className="font-bold text-white flex items-center gap-1.5">
                      <span
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: item.gt.color }}
                      />
                      {item.gt.nombre}
                    </span>
                    <span className="text-[11px] text-slate-400">
                      Factor: <strong className="text-amber-400">{item.factorTamano}x</strong> ({item.totalIntegrantes} miembros)
                    </span>
                  </div>

                  {/* Dual bar comparison */}
                  <div className="space-y-1 text-[10px]">
                    <div className="flex items-center gap-2">
                      <span className="w-16 text-slate-400 shrink-0">Brutos: {item.puntosBrutosTotal}</span>
                      <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-slate-500 rounded-full"
                          style={{ width: `${grossWidth}%` }}
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="w-16 text-amber-400 font-bold shrink-0">Final: {item.diasPointsFinal}</span>
                      <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-amber-400 rounded-full"
                          style={{ width: `${diasWidth}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* CHART 3: Distribución de Integrantes por GT */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Users className="w-4 h-4 text-indigo-400" />
                Cantidad de Integrantes y Factor Asignado
              </h3>
              <p className="text-xs text-slate-400">
                1-5 (1.3x) • 6-10 (1.1x) • 11+ (1.0x)
              </p>
            </div>
          </div>

          <div className="space-y-2.5">
            {rankingGts.map((item) => {
              const width = Math.max(8, (item.totalIntegrantes / maxMembers) * 100);
              return (
                <div key={item.gt.id} className="flex items-center gap-3 text-xs">
                  <span className="w-24 text-slate-300 font-semibold truncate shrink-0">
                    {item.gt.nombre}
                  </span>
                  <div className="flex-1 bg-slate-800 h-2.5 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${width}%`,
                        backgroundColor: item.gt.color,
                      }}
                    />
                  </div>
                  <span className="w-12 text-right font-mono text-slate-200 shrink-0">
                    {item.totalIntegrantes} pax
                  </span>
                  <span className="w-12 text-right font-bold text-amber-400 shrink-0 text-[11px]">
                    {item.factorTamano}x
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* CHART 4: Asistencias registradas por Evento */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Layers className="w-4 h-4 text-purple-400" />
                Participación Acumulada por Evento
              </h3>
              <p className="text-xs text-slate-400">Asistencias registradas en la temporada activa</p>
            </div>
          </div>

          <div className="space-y-3">
            {seasonEvents.map((e) => {
              const count = asistencias.filter(
                (a) => a.eventoId === e.id && !a.anulado
              ).length;
              const pointsGenerated = count * e.puntosAsistencia;

              return (
                <div
                  key={e.id}
                  className="p-3 rounded-2xl bg-slate-800/40 border border-slate-800 flex items-center justify-between"
                >
                  <div>
                    <span className="font-bold text-white text-sm block">{e.nombre}</span>
                    <span className="text-[11px] text-slate-400">
                      +{e.puntosAsistencia} pts/asist. • {e.fecha}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-base font-black text-amber-400 block">
                      {count} personas
                    </span>
                    <span className="text-[10px] text-slate-400">
                      {pointsGenerated} pts generados
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
