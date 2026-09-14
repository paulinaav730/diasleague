import React, { useState, useMemo } from 'react';
import { useApp } from '../../lib/store';
import {
  Users,
  Calendar,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Check,
  X,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  TrendingUp,
  Percent,
  RefreshCw,
} from 'lucide-react';
import { calcularFactorTamano } from '../../lib/calculator';

export const GtAttendanceSizeSection: React.FC = () => {
  const {
    eventos,
    gts,
    personas,
    asistencias,
    temporadaActiva,
    factorBase,
    actualizarEvento,
    registrarAsistencia,
    eliminarAsistencia,
  } = useApp();

  // Selected event (default to first active event or first event of season)
  const seasonEventos = useMemo(() => {
    return eventos.filter((e) => e.temporadaId === temporadaActiva?.id);
  }, [eventos, temporadaActiva]);

  const [selectedEventoId, setSelectedEventoId] = useState<string>(() => {
    const active = seasonEventos.find((e) => e.estado === 'activo');
    return active?.id || seasonEventos[0]?.id || eventos[0]?.id || '';
  });

  const selectedEvento = eventos.find((e) => e.id === selectedEventoId);

  // Editable base points
  const [basePointsInput, setBasePointsInput] = useState<number>(
    selectedEvento?.puntosAsistencia ?? 15
  );
  const [expandedGtId, setExpandedGtId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  // Keep base points input synchronized when selected event changes
  React.useEffect(() => {
    if (selectedEvento) {
      setBasePointsInput(selectedEvento.puntosAsistencia);
    }
  }, [selectedEventoId, selectedEvento]);

  // Keep selectedEventoId valid if seasonEventos changes
  React.useEffect(() => {
    if (seasonEventos.length > 0 && !seasonEventos.some((e) => e.id === selectedEventoId)) {
      setSelectedEventoId(seasonEventos[0].id);
    }
  }, [seasonEventos, selectedEventoId]);

  const showNotification = (msg: string) => {
    setFeedback(msg);
    setTimeout(() => setFeedback(null), 3500);
  };

  // Calculations per GT for this event
  const gtStats = useMemo(() => {
    if (!selectedEvento) return [];

    const basePts = selectedEvento.puntosAsistencia;

    return gts
      .filter((gt) => gt.activo)
      .map((gt) => {
        const activeMembers = personas.filter((p) => p.gtId === gt.id && p.activo);
        const totalIntegrantes = activeMembers.length;
        const factorTamano = calcularFactorTamano(totalIntegrantes, factorBase);

        // Attendances in this event for this GT (excluding mesa duties)
        const gtAsistencias = asistencias.filter(
          (a) => a.eventoId === selectedEvento.id && a.gtId === gt.id && !a.anulado && !a.esTurnoMesa
        );
        const totalAsistentes = gtAsistencias.length;

        const porcentajeAsistencia =
          totalIntegrantes > 0
            ? Math.round((totalAsistentes / totalIntegrantes) * 100)
            : 0;

        const puntosBrutos = totalAsistentes * basePts;
        const diasPoints = Math.round(puntosBrutos * factorTamano * 100) / 100;

        return {
          gt,
          totalIntegrantes,
          factorTamano,
          totalAsistentes,
          porcentajeAsistencia,
          puntosBrutos,
          diasPoints,
          gtAsistencias,
          activeMembers,
        };
      })
      .sort((a, b) => b.diasPoints - a.diasPoints);
  }, [selectedEvento, gts, personas, asistencias, factorBase]);

  // Handle toggling an individual member attendance
  const handleToggleMember = (personaId: string, gtId: string) => {
    if (!selectedEvento) return;

    const existing = asistencias.find(
      (a) =>
        a.eventoId === selectedEvento.id &&
        a.personaId === personaId &&
        !a.anulado
    );

    if (existing) {
      eliminarAsistencia(existing.id);
      showNotification('Asistencia removida.');
    } else {
      const persona = personas.find((p) => p.id === personaId);
      if (persona) {
        registrarAsistencia({
          eventoId: selectedEvento.id,
          persona: {
            nombreCompleto: persona.nombreCompleto,
            gtId: persona.gtId,
            id: persona.id,
          },
          origen: 'manual_admin',
        });
        showNotification(`Asistencia registrada para ${persona.nombreCompleto}.`);
      }
    }
  };

  // Set bulk attendance count for a GT
  const handleSetBulkCount = (gtId: string, count: number) => {
    if (!selectedEvento) return;

    const gtData = gtStats.find((item) => item.gt.id === gtId);
    if (!gtData) return;

    const targetCount = Math.max(0, Math.min(count, gtData.totalIntegrantes));
    const currentAttendances = gtData.gtAsistencias;
    const currentCount = currentAttendances.length;

    if (targetCount === currentCount) {
      showNotification(`El GT ya tiene ${targetCount} asistentes registrados.`);
      return;
    }

    if (targetCount < currentCount) {
      // Remove excess attendances
      const toRemoveCount = currentCount - targetCount;
      const toRemove = currentAttendances.slice(0, toRemoveCount);
      for (const a of toRemove) {
        eliminarAsistencia(a.id);
      }
      showNotification(`Se ajustó la asistencia de ${gtData.gt.nombre} a ${targetCount} personas.`);
    } else {
      // Add attendances for members without attendance
      const attendedPersonaIds = new Set(currentAttendances.map((a) => a.personaId));
      const unattendedMembers = gtData.activeMembers.filter(
        (m) => !attendedPersonaIds.has(m.id)
      );

      const neededCount = targetCount - currentCount;
      const toAdd = unattendedMembers.slice(0, neededCount);

      for (const member of toAdd) {
        registrarAsistencia({
          eventoId: selectedEvento.id,
          persona: {
            nombreCompleto: member.nombreCompleto,
            gtId: member.gtId,
            id: member.id,
          },
          origen: 'manual_admin',
        });
      }
      showNotification(`Se registraron ${toAdd.length} asistentes en ${gtData.gt.nombre}.`);
    }
  };

  // Quick button: 100% attendance
  const handleSetFullAttendance = (gtId: string) => {
    const gtData = gtStats.find((item) => item.gt.id === gtId);
    if (gtData) {
      handleSetBulkCount(gtId, gtData.totalIntegrantes);
    }
  };

  // Quick button: Clear attendance
  const handleClearAttendance = (gtId: string) => {
    handleSetBulkCount(gtId, 0);
  };

  return (
    <div className="space-y-6">
      {/* Header & Event Selector */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase font-extrabold tracking-wider text-amber-400 bg-amber-500/10 border border-amber-500/30 px-2.5 py-0.5 rounded-full">
                Módulo Administrativo
              </span>
              <span className="text-xs text-slate-400">
                Competencia Justa & Ponderación
              </span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-white mt-1 flex items-center gap-2">
              <Users className="w-6 h-6 text-amber-400" />
              Puntos por Asistencia y Tamaño de GT
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-3xl">
              La asistencia a cada Conectado otorga puntos proporcionales a la cantidad de personas
              que asisten multiplicada por el <strong>Factor de Tamaño (16 / Integrantes)</strong>,
              garantizando que un GT pequeño y un GT grande compitan en total igualdad de condiciones.
            </p>
          </div>

          {/* Event Picker */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 shrink-0 bg-slate-950/70 p-3 rounded-2xl border border-slate-800">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-300">
              <Calendar className="w-4 h-4 text-indigo-400" />
              <span>Conectado / Evento:</span>
            </div>
            <select
              value={selectedEventoId}
              onChange={(e) => setSelectedEventoId(e.target.value)}
              className="bg-slate-850 text-amber-300 font-bold text-xs px-3 py-2 rounded-xl border border-slate-700 focus:ring-2 focus:ring-amber-500"
            >
              {seasonEventos.map((ev) => (
                <option key={ev.id} value={ev.id}>
                  {ev.nombre} ({ev.puntosAsistencia} pts base) — {ev.estado}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Mathematical Formula Banner */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-indigo-950/60 via-slate-900 to-amber-950/40 border border-amber-500/30 text-xs text-slate-300 space-y-2">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="font-extrabold text-amber-300 flex items-center gap-1.5 uppercase tracking-wide text-[11px]">
              <Sparkles className="w-4 h-4 text-amber-400" />
              Fórmula Oficial de Asistencia DIAS League:
            </span>
            <span className="text-[11px] font-mono text-slate-400 bg-slate-950/80 px-2.5 py-1 rounded-lg border border-slate-800">
              DIAS Points = (Asistentes × Puntos Base) × (16 / Integrantes GT)
            </span>
          </div>
          <p className="text-[11px] text-slate-300 leading-relaxed">
            Esta fórmula equivale matemáticamente a:{' '}
            <strong className="text-amber-200">
              Puntos Base × 16 × (% Asistencia del GT)
            </strong>
            . Si el 100% de un GT asiste (sin importar si tiene 5 o 15 integrantes), recibirá
            exactamente el máximo de{' '}
            <strong className="text-amber-300">
              {(selectedEvento?.puntosAsistencia ?? 15) * 16} DIAS Points
            </strong>
            .
          </p>
        </div>

        {/* Edit Base Points Inline */}
        {selectedEvento && (
          <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-slate-850/80 rounded-xl border border-slate-800 text-xs">
            <div className="flex items-center gap-2">
              <span className="text-slate-400">Puntos Base por Asistente para este Conectado:</span>
              <input
                type="number"
                min="1"
                step="5"
                value={basePointsInput}
                onChange={(e) => setBasePointsInput(Number(e.target.value))}
                className="w-20 bg-slate-900 text-amber-300 font-extrabold px-2.5 py-1 rounded-lg border border-slate-700 text-center text-xs"
              />
              <span className="text-slate-400">pts</span>
            </div>

            <button
              onClick={() => {
                actualizarEvento(
                  selectedEvento.id,
                  { puntosAsistencia: basePointsInput },
                  true
                );
                showNotification(
                  `Puntos base de ${selectedEvento.nombre} actualizados a ${basePointsInput} pts y recalculados en todas las asistencias.`
                );
              }}
              className="px-3.5 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs flex items-center gap-1.5 shadow"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Guardar y Recalcular Asistencias
            </button>
          </div>
        )}

        {/* Feedback Alert */}
        {feedback && (
          <div className="p-3 bg-emerald-950/80 border border-emerald-500/50 rounded-xl text-xs text-emerald-300 flex items-center gap-2 animate-fade-in">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{feedback}</span>
          </div>
        )}
      </div>

      {/* GTs Attendance Table & Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {gtStats.map((item) => {
          const isExpanded = expandedGtId === item.gt.id;
          const {
            gt,
            totalIntegrantes,
            factorTamano,
            totalAsistentes,
            porcentajeAsistencia,
            puntosBrutos,
            diasPoints,
            activeMembers,
            gtAsistencias,
          } = item;

          return (
            <div
              key={gt.id}
              className={`rounded-2xl bg-slate-900 border transition-all flex flex-col justify-between ${
                totalAsistentes > 0
                  ? 'border-slate-700 shadow-md'
                  : 'border-slate-800/80 opacity-90'
              }`}
            >
              {/* GT Card Header */}
              <div className="p-4 space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-3 h-3 rounded-full shrink-0"
                      style={{ backgroundColor: gt.color || '#eab308' }}
                    />
                    <div>
                      <h4 className="text-base font-black text-white leading-tight">
                        {gt.nombre}
                      </h4>
                      <span className="text-[10px] uppercase font-bold text-slate-400">
                        {gt.codigo} • {totalIntegrantes} integrantes
                      </span>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-xs font-mono font-black text-indigo-400 bg-indigo-500/10 border border-indigo-500/30 px-2 py-0.5 rounded-lg">
                      x{factorTamano.toFixed(2)} factor
                    </span>
                  </div>
                </div>

                {/* Progress bar of Attendance */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400">
                      Asistieron:{' '}
                      <strong className="text-white font-extrabold">
                        {totalAsistentes}
                      </strong>{' '}
                      de {totalIntegrantes}
                    </span>
                    <span
                      className={`font-black ${
                        porcentajeAsistencia >= 80
                          ? 'text-emerald-400'
                          : porcentajeAsistencia >= 50
                          ? 'text-amber-400'
                          : 'text-slate-400'
                      }`}
                    >
                      {porcentajeAsistencia}%
                    </span>
                  </div>

                  <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${
                        porcentajeAsistencia >= 80
                          ? 'bg-emerald-500'
                          : porcentajeAsistencia >= 50
                          ? 'bg-amber-500'
                          : 'bg-indigo-500'
                      }`}
                      style={{ width: `${Math.min(100, porcentajeAsistencia)}%` }}
                    />
                  </div>
                </div>

                {/* Points Output Box */}
                <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase text-slate-500 font-bold block">
                      Puntos Brutos
                    </span>
                    <span className="text-xs font-bold text-slate-300">
                      {puntosBrutos} pts
                    </span>
                  </div>

                  <ArrowRight className="w-3.5 h-3.5 text-slate-600" />

                  <div className="text-right">
                    <span className="text-[10px] uppercase text-amber-500 font-bold block">
                      DIAS Points Otorgados
                    </span>
                    <span className="text-base font-black text-amber-300">
                      +{diasPoints.toFixed(1)} pts
                    </span>
                  </div>
                </div>

                {/* Bulk Attendance Stepper */}
                <div className="pt-2 border-t border-slate-800/80 space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[11px] font-bold text-slate-400">
                      Carga rápida:
                    </span>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleSetFullAttendance(gt.id)}
                        className="px-2 py-1 rounded bg-emerald-500/15 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-[10px] font-bold"
                        title="Marcar todos los integrantes presentes (100%)"
                      >
                        100%
                      </button>
                      <button
                        onClick={() =>
                          handleSetBulkCount(
                            gt.id,
                            Math.round(totalIntegrantes / 2)
                          )
                        }
                        className="px-2 py-1 rounded bg-amber-500/15 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-[10px] font-bold"
                        title="Marcar 50% de asistencia"
                      >
                        50%
                      </button>
                      <button
                        onClick={() => handleClearAttendance(gt.id)}
                        className="px-2 py-1 rounded bg-slate-800 hover:bg-red-950 text-slate-400 hover:text-red-300 border border-slate-700 text-[10px] font-bold"
                        title="Eliminar asistencias de este GT"
                      >
                        0%
                      </button>
                    </div>
                  </div>

                  {/* Manual Stepper Input */}
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min="0"
                      max={totalIntegrantes}
                      defaultValue={totalAsistentes}
                      key={`${gt.id}-${totalAsistentes}`}
                      id={`input-asist-${gt.id}`}
                      className="w-16 bg-slate-950 text-white font-extrabold text-xs px-2 py-1.5 rounded-lg border border-slate-700 text-center"
                    />
                    <button
                      onClick={() => {
                        const el = document.getElementById(
                          `input-asist-${gt.id}`
                        ) as HTMLInputElement | null;
                        if (el) {
                          handleSetBulkCount(gt.id, Number(el.value));
                        }
                      }}
                      className="flex-1 py-1.5 px-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-lg shadow text-center"
                    >
                      Aplicar Asistentes
                    </button>
                  </div>
                </div>
              </div>

              {/* Collapsible Nominal List of Members */}
              <div className="border-t border-slate-800/90 bg-slate-950/40 rounded-b-2xl">
                <button
                  onClick={() =>
                    setExpandedGtId(isExpanded ? null : gt.id)
                  }
                  className="w-full p-2.5 flex items-center justify-between text-xs text-slate-400 hover:text-white font-bold"
                >
                  <span>
                    Ver integrantes nominales ({activeMembers.length})
                  </span>
                  {isExpanded ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </button>

                {isExpanded && (
                  <div className="p-3 pt-0 space-y-1.5 max-h-56 overflow-y-auto divide-y divide-slate-850">
                    {activeMembers.map((member) => {
                      const isAttending = gtAsistencias.some(
                        (a) => a.personaId === member.id
                      );

                      return (
                        <div
                          key={member.id}
                          onClick={() =>
                            handleToggleMember(member.id, gt.id)
                          }
                          className="pt-1.5 flex items-center justify-between gap-2 text-xs cursor-pointer hover:bg-slate-850/60 p-1.5 rounded-lg"
                        >
                          <span
                            className={`${
                              isAttending
                                ? 'text-white font-bold'
                                : 'text-slate-500'
                            }`}
                          >
                            {member.nombreCompleto}
                          </span>

                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-black uppercase flex items-center gap-1 ${
                              isAttending
                                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                                : 'bg-slate-800 text-slate-500'
                            }`}
                          >
                            {isAttending ? (
                              <>
                                <Check className="w-3 h-3" /> Presente
                              </>
                            ) : (
                              'Ausente'
                            )}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
