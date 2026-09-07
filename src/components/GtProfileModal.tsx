import React from 'react';
import { useApp } from '../lib/store';
import { Evento, Persona, Turno, Reto } from '../types';
import {
  X,
  Users,
  Trophy,
  Scale,
  Calendar,
  Sparkles,
  ArrowRight,
  Shield,
  Clock,
} from 'lucide-react';

interface GtProfileModalProps {
  gtId: string | null;
  onClose: () => void;
  onSelectPersona: (personaId: string) => void;
}

export const GtProfileModal: React.FC<GtProfileModalProps> = ({
  gtId,
  onClose,
  onSelectPersona,
}) => {
  const {
    gts,
    personas,
    asistencias,
    participacionesRetos,
    eventos,
    turnos,
    retos,
    rankingGts,
    temporadaActiva,
  } = useApp();

  if (!gtId) return null;

  const gt = gts.find((g) => g.id === gtId);
  const gtCalc = rankingGts.find((r) => r.gt.id === gtId);

  if (!gt || !gtCalc) return null;

  // Active members in this GT
  const members = personas.filter((p) => p.gtId === gtId && p.activo);

  // Filter attendances for this GT in active season
  const gtAsistencias = asistencias.filter(
    (a) => a.gtId === gtId && a.temporadaId === temporadaActiva?.id && !a.anulado
  );

  // Filter challenges for this GT in active season
  const gtRetos = participacionesRetos.filter(
    (r) => r.gtId === gtId && r.temporadaId === temporadaActiva?.id && !r.anulado
  );

  const eventoMap = new Map<string, Evento>(eventos.map((e) => [e.id, e]));
  const personaMap = new Map<string, Persona>(personas.map((p) => [p.id, p]));
  const turnoMap = new Map<string, Turno>(turnos.map((t) => [t.id, t]));
  const retoMap = new Map<string, Reto>(retos.map((r) => [r.id, r]));

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="w-full max-w-3xl bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl overflow-hidden my-8 animate-fade-in">
        {/* Header with GT color banner */}
        <div
          className="p-6 sm:p-8 text-white relative"
          style={{
            background: `linear-gradient(135deg, ${gt.color}dd 0%, #0f172a 100%)`,
          }}
        >
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-full bg-slate-900/40 hover:bg-slate-900/80 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center font-black text-2xl shadow-xl ring-4 ring-white/20"
                style={{ backgroundColor: gt.color }}
              >
                {gt.codigo}
              </div>
              <div>
                <span className="text-xs uppercase font-extrabold tracking-wider text-white/80">
                  Perfil de Grupo de Trabajo
                </span>
                <h2 className="text-2xl sm:text-3xl font-black">{gt.nombre}</h2>
                <p className="text-xs sm:text-sm text-white/80 mt-0.5">
                  {gt.descripcion || 'Grupo de Trabajo DIAS'}
                </p>
              </div>
            </div>

            {/* Rank badge */}
            <div className="bg-slate-900/80 border border-white/20 rounded-2xl px-5 py-3 text-center shrink-0">
              <span className="text-xs text-slate-400 block font-semibold">
                Posición Actual
              </span>
              <span className="text-3xl font-black text-amber-300">
                #{gtCalc.posicion}
              </span>
            </div>
          </div>
        </div>

        {/* Audit Breakdown Box: PUNTOS BRUTOS * FACTOR = DIAS POINTS */}
        <div className="p-6 bg-slate-900/90 border-b border-slate-800">
          <h4 className="text-xs uppercase font-bold tracking-wider text-amber-400 mb-3 flex items-center gap-1.5">
            <Scale className="w-4 h-4" />
            Cálculo Oficial y Auditoría de Puntos (Principio de Trazabilidad)
          </h4>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-slate-800/80 p-3 rounded-2xl border border-slate-700/60">
              <span className="text-[11px] text-slate-400 block">Puntos Brutos</span>
              <span className="text-xl font-bold text-white">
                {gtCalc.puntosBrutosTotal}
              </span>
              <span className="text-[10px] text-slate-500 block">
                {gtCalc.puntosBrutosAsistencia} asist. + {gtCalc.puntosBrutosRetos} retos
              </span>
            </div>

            <div className="bg-slate-800/80 p-3 rounded-2xl border border-slate-700/60">
              <span className="text-[11px] text-slate-400 block">Integrantes</span>
              <span className="text-xl font-bold text-white">
                {gtCalc.totalIntegrantes}
              </span>
              <span className="text-[10px] text-slate-500 block">miembros activos</span>
            </div>

            <div className="bg-amber-500/10 p-3 rounded-2xl border border-amber-500/30">
              <span className="text-[11px] text-amber-300 block font-semibold">
                Factor de Tamaño
              </span>
              <span className="text-xl font-black text-amber-400">
                {gtCalc.factorTamano}x
              </span>
              <span className="text-[10px] text-amber-300/80 block">
                Ponderación justa
              </span>
            </div>

            <div className="bg-slate-950 p-3 rounded-2xl border border-amber-400/40">
              <span className="text-[11px] text-amber-400 block font-bold">
                DIAS Points Finales
              </span>
              <span className="text-2xl font-black text-amber-300">
                {gtCalc.diasPointsFinal}
              </span>
              <span className="text-[10px] text-slate-400 block">
                Brutos × {gtCalc.factorTamano}
              </span>
            </div>
          </div>
        </div>

        {/* Content Tabs / Sections: Members & Points History */}
        <div className="p-6 space-y-6 max-h-[50vh] overflow-y-auto">
          {/* Members List */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Users className="w-4 h-4 text-indigo-400" />
                Integrantes Activos ({members.length})
              </h4>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {members.map((m) => {
                const memberAsistencias = gtAsistencias.filter(
                  (a) => a.personaId === m.id
                );
                const memberRetos = gtRetos.filter((r) => r.personaId === m.id);
                const personalPts =
                  memberAsistencias.reduce((sum, a) => sum + a.puntosOtorgados, 0) +
                  memberRetos.reduce((sum, r) => sum + r.puntosOtorgados, 0);

                return (
                  <div
                    key={m.id}
                    onClick={() => {
                      onClose();
                      onSelectPersona(m.id);
                    }}
                    className="p-3 rounded-xl bg-slate-800/50 hover:bg-slate-800 border border-slate-700/60 flex items-center justify-between cursor-pointer transition-colors group"
                  >
                    <div>
                      <span className="font-semibold text-white text-sm group-hover:text-amber-300 transition-colors block">
                        {m.nombreCompleto}
                      </span>
                      <span className="text-[11px] text-slate-400">
                        {memberAsistencias.length} eventos asistidos
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-bold text-amber-400 block">
                        {personalPts} pts
                      </span>
                      <span className="text-[10px] text-slate-500">ver perfil →</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Points History (Trazabilidad detallada de dónde salieron los puntos) */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-3 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              Historial de Puntos Otorgados a {gt.nombre}
            </h4>

            <div className="space-y-2">
              {gtAsistencias.map((a) => {
                const p = personaMap.get(a.personaId);
                const e = eventoMap.get(a.eventoId);
                const t = a.turnoId ? turnoMap.get(a.turnoId) : null;

                return (
                  <div
                    key={a.id}
                    className="p-3 rounded-xl bg-slate-800/40 border border-slate-800 flex items-center justify-between text-xs"
                  >
                    <div>
                      <span className="font-bold text-white block">
                        {p?.nombreCompleto || 'Participante'}
                      </span>
                      <span className="text-slate-400">
                        {e?.nombre} {t ? `(${t.nombre})` : ''} • Asistencia QR
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-emerald-400 font-bold text-sm">
                        +{a.puntosOtorgados} pts
                      </span>
                      <span className="text-[10px] text-slate-500 block">
                        {new Date(a.fechaRegistro).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                );
              })}

              {gtRetos.map((r) => {
                const reto = retoMap.get(r.retoId);
                const p = r.personaId ? personaMap.get(r.personaId) : null;

                return (
                  <div
                    key={r.id}
                    className="p-3 rounded-xl bg-amber-950/20 border border-amber-700/30 flex items-center justify-between text-xs"
                  >
                    <div>
                      <span className="font-bold text-amber-300 block">
                        Reto: {reto?.nombre}
                      </span>
                      <span className="text-slate-400">
                        {r.observacion || 'Reto completado'}{' '}
                        {p ? `(por ${p.nombreCompleto})` : ''}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-amber-400 font-bold text-sm">
                        +{r.puntosOtorgados} pts
                      </span>
                      <span className="text-[10px] text-slate-500 block">
                        Puesto #{r.posicion || 1}
                      </span>
                    </div>
                  </div>
                );
              })}

              {gtAsistencias.length === 0 && gtRetos.length === 0 && (
                <div className="py-6 text-center text-slate-500 text-xs">
                  Aún no hay puntos registrados para este GT en la temporada actual.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
