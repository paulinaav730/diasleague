import React from 'react';
import { useApp } from '../lib/store';
import { Evento } from '../types';
import {
  X,
  Award,
  Calendar,
  Sparkles,
  Trophy,
  CheckCircle2,
} from 'lucide-react';

interface PersonaProfileModalProps {
  personaId: string | null;
  onClose: () => void;
  onSelectGt?: (gtId: string) => void;
}

export const PersonaProfileModal: React.FC<PersonaProfileModalProps> = ({
  personaId,
  onClose,
  onSelectGt,
}) => {
  const {
    personas,
    gts,
    asistencias,
    participacionesRetos,
    eventos,
    rankingPersonas,
    temporadaActiva,
  } = useApp();

  if (!personaId) return null;

  const persona = personas.find((p) => p.id === personaId);
  const pCalc = rankingPersonas.find((r) => r.persona.id === personaId);
  const gt = gts.find((g) => g.id === persona?.gtId);

  if (!persona || !pCalc) return null;

  // Personal attendances
  const pAsistencias = asistencias.filter(
    (a) => a.personaId === personaId && a.temporadaId === temporadaActiva?.id && !a.anulado
  );

  // Personal challenges
  const pRetos = participacionesRetos.filter(
    (r) => r.personaId === personaId && r.temporadaId === temporadaActiva?.id && !r.anulado
  );

  const eventoMap = new Map<string, Evento>(eventos.map((e) => [e.id, e]));

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="w-full max-w-xl bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl overflow-hidden my-8 animate-fade-in">
        {/* Header */}
        <div className="p-6 sm:p-7 bg-gradient-to-tr from-slate-900 via-indigo-950/50 to-slate-900 border-b border-slate-800 relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-full bg-slate-800/80 hover:bg-slate-700 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3 mb-2">
            <span
              className="text-xs px-3 py-1 rounded-full text-white font-bold"
              style={{ backgroundColor: gt?.color || '#6366F1' }}
            >
              GT {gt?.nombre || 'DIAS'}
            </span>
            <span className="text-xs text-slate-400 font-medium">
              {temporadaActiva?.nombre}
            </span>
          </div>

          <h2 className="text-2xl font-black text-white">
            {persona.nombreCompleto}
          </h2>

          {/* Quick stats pills */}
          <div className="grid grid-cols-3 gap-3 mt-4">
            <div className="bg-slate-800/80 p-3 rounded-2xl border border-slate-700/60 text-center">
              <span className="text-[10px] text-slate-400 uppercase font-bold block">
                Posición
              </span>
              <span className="text-2xl font-black text-amber-300">
                #{pCalc.posicion}
              </span>
            </div>

            <div className="bg-slate-800/80 p-3 rounded-2xl border border-slate-700/60 text-center">
              <span className="text-[10px] text-slate-400 uppercase font-bold block">
                DIAS Points
              </span>
              <span className="text-2xl font-black text-white">
                {pCalc.diasPointsTotal}
              </span>
            </div>

            <div className="bg-slate-800/80 p-3 rounded-2xl border border-slate-700/60 text-center">
              <span className="text-[10px] text-slate-400 uppercase font-bold block">
                Eventos
              </span>
              <span className="text-2xl font-black text-indigo-400">
                {pCalc.totalEventos}
              </span>
            </div>
          </div>
        </div>

        {/* Breakdown of personal activity */}
        <div className="p-6 space-y-5 max-h-[50vh] overflow-y-auto">
          <div>
            <h4 className="text-xs uppercase font-bold tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-indigo-400" />
              Historial de Asistencias a Eventos ({pAsistencias.length})
            </h4>

            <div className="space-y-2">
              {pAsistencias.map((a) => {
                const e = eventoMap.get(a.eventoId);
                return (
                  <div
                    key={a.id}
                    className="p-3 rounded-xl bg-slate-800/50 border border-slate-800 flex items-center justify-between text-xs"
                  >
                    <div>
                      <span className="font-bold text-white block">
                        {e?.nombre || 'Evento'}
                      </span>
                      <span className="text-slate-400">
                        Registro {a.origen === 'qr' ? 'por QR de Turno' : 'Manual'} • {new Date(a.fechaRegistro).toLocaleDateString()}
                      </span>
                    </div>
                    <span className="text-emerald-400 font-bold text-sm">
                      +{a.puntosOtorgados} pts
                    </span>
                  </div>
                );
              })}

              {pAsistencias.length === 0 && (
                <div className="py-4 text-center text-slate-500 text-xs">
                  Sin asistencias registradas aún.
                </div>
              )}
            </div>
          </div>

          {/* Challenges Breakdown */}
          {pRetos.length > 0 && (
            <div>
              <h4 className="text-xs uppercase font-bold tracking-wider text-amber-400 mb-3 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4" />
                Retos y Desafíos Completados ({pRetos.length})
              </h4>

              <div className="space-y-2">
                {pRetos.map((r) => (
                  <div
                    key={r.id}
                    className="p-3 rounded-xl bg-amber-950/20 border border-amber-800/30 flex items-center justify-between text-xs"
                  >
                    <div>
                      <span className="font-bold text-amber-300 block">
                        {r.observacion || 'Desafío superado'}
                      </span>
                      <span className="text-slate-400">
                        Puesto #{r.posicion || 1} • {new Date(r.fechaRegistro).toLocaleDateString()}
                      </span>
                    </div>
                    <span className="text-amber-400 font-bold text-sm">
                      +{r.puntosOtorgados} pts
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex justify-between items-center">
          {gt && onSelectGt && (
            <button
              onClick={() => {
                onClose();
                onSelectGt(gt.id);
              }}
              className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold"
            >
              Ver Grupo de Trabajo {gt.nombre} →
            </button>
          )}
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold ml-auto"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
