import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import {
  Temporada,
  GrupoTrabajo,
  Persona,
  Evento,
  Turno,
  Asistencia,
  Reto,
  ParticipacionReto,
  FactorTamanoRango,
  AuditLog,
  GtCalculado,
  PersonaCalculada,
} from '../types';
import {
  INITIAL_TEMPORADAS,
  INITIAL_GTS,
  INITIAL_PERSONAS,
  INITIAL_EVENTOS,
  INITIAL_TURNOS,
  INITIAL_RETOS,
  INITIAL_ASISTENCIAS,
  INITIAL_PARTICIPACION_RETOS,
  INITIAL_FACTORES,
  INITIAL_AUDIT_LOGS,
  TEMPORADA_ACTIVA_ID,
} from './mockData';
import { calcularRankingGts, calcularRankingPersonas } from './calculator';

export type ActiveTab =
  | 'dashboard'
  | 'podio'
  | 'qr-proyector'
  | 'qr_proyector'
  | 'registro'
  | 'gts'
  | 'ranking_gts'
  | 'personas'
  | 'ranking_personas'
  | 'eventos'
  | 'analitica'
  | 'admin';

interface AppContextType {
  // Navigation
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;

  // Core datasets
  temporadas: Temporada[];
  gts: GrupoTrabajo[];
  personas: Persona[];
  eventos: Evento[];
  turnos: Turno[];
  asistencias: Asistencia[];
  retos: Reto[];
  participacionesRetos: ParticipacionReto[];
  factores: FactorTamanoRango[];
  auditLogs: AuditLog[];

  // Active season
  temporadaActiva: Temporada | undefined;
  setTemporadaActivaId: (id: string) => void;

  // Computed Leaderboards
  rankingGts: GtCalculado[];
  podio: GtCalculado[];
  rankingPersonas: PersonaCalculada[];

  // Statistics
  estadisticas: {
    totalGts: number;
    totalPersonas: number;
    totalEventos: number;
    totalParticipaciones: number;
    totalPuntosGenerados: number;
    gtLider: GtCalculado | undefined;
    personaLider: PersonaCalculada | undefined;
    eventoActivo: Evento | undefined;
    ultimoEvento: Evento | undefined;
  };

  // Recent activity
  actividadReciente: Array<{
    id: string;
    tipo: 'asistencia' | 'reto';
    titulo: string;
    descripcion: string;
    puntos: number;
    gtNombre: string;
    gtColor: string;
    fecha: string;
  }>;

  // Actions - Asistencia & QR
  registrarAsistencia: (params: {
    personaId: string;
    eventoId: string;
    turnoId?: string | null;
    origen?: 'qr' | 'manual';
  }) => { success: boolean; message: string; puntos?: number; gtNombre?: string };

  // Actions - GT
  crearGt: (gt: Omit<GrupoTrabajo, 'id' | 'createdAt'>) => void;
  actualizarGt: (id: string, updates: Partial<GrupoTrabajo>) => void;
  toggleGtActivo: (id: string) => void;

  // Actions - Personas
  crearPersona: (persona: Omit<Persona, 'id' | 'createdAt'>) => void;
  actualizarPersona: (id: string, updates: Partial<Persona>) => void;
  cambiarGtPersona: (personaId: string, nuevoGtId: string) => void;
  togglePersonaActiva: (id: string) => void;
  eliminarPersona: (id: string) => void;

  // Actions - Temporadas
  crearTemporada: (temp: Omit<Temporada, 'id' | 'createdAt'>) => void;
  activarTemporada: (id: string) => void;
  cerrarTemporada: (id: string) => void;

  // Actions - Eventos
  crearEvento: (evento: Omit<Evento, 'id' | 'createdAt'>) => void;
  actualizarEvento: (id: string, updates: Partial<Evento>) => void;
  cambiarEstadoEvento: (id: string, nuevoEstado: Evento['estado']) => void;

  // Actions - Turnos
  crearTurno: (turno: Omit<Turno, 'id' | 'createdAt' | 'qrToken'>) => void;
  actualizarTurno: (id: string, updates: Partial<Turno>) => void;
  activarTurno: (id: string) => void;
  cerrarTurno: (id: string) => void;

  // Actions - Retos
  crearReto: (reto: Omit<Reto, 'id' | 'createdAt'>) => void;
  actualizarReto: (id: string, updates: Partial<Reto>) => void;
  asignarGanadorReto: (params: {
    retoId: string;
    gtId: string;
    personaId?: string | null;
    puntos: number;
    posicion?: number;
    observacion?: string;
  }) => void;

  // Actions - Factores
  actualizarFactor: (id: string, nuevoFactor: number) => void;
  actualizarRangoFactor: (id: string, min: number, max: number | null, factor: number) => void;

  // Actions - Auditoría y Corrección
  anularAsistencia: (id: string, motivo: string) => void;
  anularParticipacionReto: (id: string) => void;

  // Data reset & test data controls
  restablecerDatosPrueba: () => void;
  limpiarTodosLosDatos: () => void;

  // Admin session
  isAdmin: boolean;
  setIsAdmin: (val: boolean) => void;
}

const STORAGE_KEY = 'dias_league_state_v1';

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Active Navigation Tab
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');

  // Load from LocalStorage or initialize with mock data
  const [temporadas, setTemporadas] = useState<Temporada[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY + '_temporadas');
    return saved ? JSON.parse(saved) : INITIAL_TEMPORADAS;
  });

  const [gts, setGts] = useState<GrupoTrabajo[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY + '_gts');
    return saved ? JSON.parse(saved) : INITIAL_GTS;
  });

  const [personas, setPersonas] = useState<Persona[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY + '_personas');
    return saved ? JSON.parse(saved) : INITIAL_PERSONAS;
  });

  const [eventos, setEventos] = useState<Evento[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY + '_eventos');
    return saved ? JSON.parse(saved) : INITIAL_EVENTOS;
  });

  const [turnos, setTurnos] = useState<Turno[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY + '_turnos');
    return saved ? JSON.parse(saved) : INITIAL_TURNOS;
  });

  const [asistencias, setAsistencias] = useState<Asistencia[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY + '_asistencias');
    return saved ? JSON.parse(saved) : INITIAL_ASISTENCIAS;
  });

  const [retos, setRetos] = useState<Reto[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY + '_retos');
    return saved ? JSON.parse(saved) : INITIAL_RETOS;
  });

  const [participacionesRetos, setParticipacionesRetos] = useState<ParticipacionReto[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY + '_participacionesRetos');
    return saved ? JSON.parse(saved) : INITIAL_PARTICIPACION_RETOS;
  });

  const [factores, setFactores] = useState<FactorTamanoRango[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY + '_factores');
    return saved ? JSON.parse(saved) : INITIAL_FACTORES;
  });

  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY + '_auditLogs');
    return saved ? JSON.parse(saved) : INITIAL_AUDIT_LOGS;
  });

  const [activeTemporadaId, setActiveTemporadaId] = useState<string>(() => {
    const active = temporadas.find((t) => t.activa);
    return active ? active.id : TEMPORADA_ACTIVA_ID;
  });

  const [isAdmin, setIsAdmin] = useState<boolean>(true); // Default true for full exploratory access

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY + '_temporadas', JSON.stringify(temporadas));
  }, [temporadas]);
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY + '_gts', JSON.stringify(gts));
  }, [gts]);
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY + '_personas', JSON.stringify(personas));
  }, [personas]);
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY + '_eventos', JSON.stringify(eventos));
  }, [eventos]);
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY + '_turnos', JSON.stringify(turnos));
  }, [turnos]);
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY + '_asistencias', JSON.stringify(asistencias));
  }, [asistencias]);
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY + '_retos', JSON.stringify(retos));
  }, [retos]);
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY + '_participacionesRetos', JSON.stringify(participacionesRetos));
  }, [participacionesRetos]);
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY + '_factores', JSON.stringify(factores));
  }, [factores]);
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY + '_auditLogs', JSON.stringify(auditLogs));
  }, [auditLogs]);

  // Current active season object
  const temporadaActiva = useMemo(() => {
    return temporadas.find((t) => t.id === activeTemporadaId) || temporadas.find((t) => t.activa) || temporadas[0];
  }, [temporadas, activeTemporadaId]);

  // Add audit log helper
  const addAuditLog = useCallback((accion: string, tipoEntidad: string, entidadId: string, detalles: string) => {
    const newLog: AuditLog = {
      id: 'log-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
      accion,
      tipoEntidad,
      entidadId,
      detalles,
      usuario: isAdmin ? 'Administrador DIAS' : 'Usuario Sistema',
      fecha: new Date().toISOString(),
    };
    setAuditLogs((prev) => [newLog, ...prev]);
  }, [isAdmin]);

  // CALCULATE RANKINGS & PODIUM AUTOMATICALLY
  const rankingGts = useMemo(() => {
    if (!temporadaActiva) return [];
    return calcularRankingGts(
      gts.filter((g) => g.activo),
      personas,
      asistencias,
      participacionesRetos,
      factores,
      temporadaActiva.id
    );
  }, [gts, personas, asistencias, participacionesRetos, factores, temporadaActiva]);

  const podio = useMemo(() => {
    return rankingGts.slice(0, 3);
  }, [rankingGts]);

  const rankingPersonas = useMemo(() => {
    if (!temporadaActiva) return [];
    return calcularRankingPersonas(
      personas,
      gts,
      asistencias,
      participacionesRetos,
      temporadaActiva.id
    );
  }, [personas, gts, asistencias, participacionesRetos, temporadaActiva]);

  // Statistics calculation
  const estadisticas = useMemo(() => {
    const totalGts = gts.filter((g) => g.activo).length;
    const totalPersonas = personas.filter((p) => p.activo).length;
    const totalEventos = eventos.filter((e) => e.temporadaId === temporadaActiva?.id).length;

    const seasonAsistencias = asistencias.filter(
      (a) => a.temporadaId === temporadaActiva?.id && !a.anulado
    );
    const seasonRetos = participacionesRetos.filter(
      (r) => r.temporadaId === temporadaActiva?.id && !r.anulado
    );

    const totalParticipaciones = seasonAsistencias.length + seasonRetos.length;
    const totalPuntosGenerados =
      seasonAsistencias.reduce((sum, a) => sum + a.puntosOtorgados, 0) +
      seasonRetos.reduce((sum, r) => sum + r.puntosOtorgados, 0);

    const gtLider = rankingGts[0];
    const personaLider = rankingPersonas[0];

    const activeSeasonEventos = eventos.filter((e) => e.temporadaId === temporadaActiva?.id);
    const eventoActivo = activeSeasonEventos.find((e) => e.estado === 'activo');
    const ultimoEvento = [...activeSeasonEventos].sort(
      (a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime()
    )[0];

    return {
      totalGts,
      totalPersonas,
      totalEventos,
      totalParticipaciones,
      totalPuntosGenerados,
      gtLider,
      personaLider,
      eventoActivo,
      ultimoEvento,
    };
  }, [gts, personas, eventos, asistencias, participacionesRetos, temporadaActiva, rankingGts, rankingPersonas]);

  // Recent activity stream
  const actividadReciente = useMemo(() => {
    if (!temporadaActiva) return [];
    const items: Array<{
      id: string;
      tipo: 'asistencia' | 'reto';
      titulo: string;
      descripcion: string;
      puntos: number;
      gtNombre: string;
      gtColor: string;
      fecha: string;
    }> = [];

    const gtMap = new Map<string, GrupoTrabajo>(gts.map((g) => [g.id, g]));
    const personaMap = new Map<string, Persona>(personas.map((p) => [p.id, p]));
    const eventoMap = new Map<string, Evento>(eventos.map((e) => [e.id, e]));
    const turnoMap = new Map<string, Turno>(turnos.map((t) => [t.id, t]));

    // Add recent attendances
    asistencias
      .filter((a) => a.temporadaId === temporadaActiva.id && !a.anulado)
      .slice(-15)
      .forEach((a) => {
        const persona = personaMap.get(a.personaId);
        const gt = gtMap.get(a.gtId);
        const evento = eventoMap.get(a.eventoId);
        const turno = a.turnoId ? turnoMap.get(a.turnoId) : null;

        items.push({
          id: a.id,
          tipo: 'asistencia',
          titulo: `${persona ? persona.nombreCompleto : 'Participante'} registró asistencia`,
          descripcion: `${evento ? evento.nombre : 'Evento'}${turno ? ` (${turno.nombre})` : ''}`,
          puntos: a.puntosOtorgados,
          gtNombre: gt ? gt.nombre : 'GT',
          gtColor: gt ? gt.color : '#3B82F6',
          fecha: a.fechaRegistro,
        });
      });

    // Add recent challenges
    participacionesRetos
      .filter((r) => r.temporadaId === temporadaActiva.id && !r.anulado)
      .slice(-10)
      .forEach((r) => {
        const persona = r.personaId ? personaMap.get(r.personaId) : null;
        const gt = gtMap.get(r.gtId);
        const reto = retos.find((ret) => ret.id === r.retoId);

        items.push({
          id: r.id,
          tipo: 'reto',
          titulo: `${gt ? gt.nombre : 'GT'} completó reto`,
          descripcion: `${reto ? reto.nombre : 'Reto'}${persona ? ` por ${persona.nombreCompleto}` : ''}`,
          puntos: r.puntosOtorgados,
          gtNombre: gt ? gt.nombre : 'GT',
          gtColor: gt ? gt.color : '#F59E0B',
          fecha: r.fechaRegistro,
        });
      });

    // Sort descending by date
    return items.sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime()).slice(0, 10);
  }, [asistencias, participacionesRetos, gts, personas, eventos, turnos, retos, temporadaActiva]);

  // =========================================================================
  // ACTIONS: REGISTRAR ASISTENCIA (QR & MANUAL) WITH STRICT DUPLICATE PREVENTION
  // =========================================================================
  const registrarAsistencia = useCallback(
    ({
      personaId,
      eventoId,
      turnoId,
      origen = 'qr',
    }: {
      personaId: string;
      eventoId: string;
      turnoId?: string | null;
      origen?: 'qr' | 'manual';
    }) => {
      if (!temporadaActiva) {
        return { success: false, message: 'No hay ninguna temporada activa.' };
      }

      const persona = personas.find((p) => p.id === personaId);
      if (!persona || !persona.activo) {
        return { success: false, message: 'Persona no encontrada o inactiva en el sistema.' };
      }

      const evento = eventos.find((e) => e.id === eventoId);
      if (!evento) {
        return { success: false, message: 'El evento no existe.' };
      }

      // Check shift if specified
      if (turnoId) {
        const turno = turnos.find((t) => t.id === turnoId);
        if (!turno) {
          return { success: false, message: 'El turno no existe.' };
        }
        if (turno.estado === 'finalizado' || !turno.activo) {
          return { success: false, message: 'Este turno ya finalizó o el QR ha sido cerrado por el administrador.' };
        }
      }

      // STRICT DUPLICATE CHECK:
      // Prevent user from scanning multiple times for the same shift or event
      const yaRegistrado = asistencias.some((a) => {
        if (a.anulado) return false;
        if (a.personaId !== personaId) return false;
        if (a.eventoId !== eventoId) return false;
        if (a.temporadaId !== temporadaActiva.id) return false;

        // If shift is present, compare shift
        if (turnoId) {
          return a.turnoId === turnoId;
        }
        // If event does not use shifts, compare event directly
        return true;
      });

      if (yaRegistrado) {
        return {
          success: false,
          message: 'Ya registraste tu participación en este turno. No puedes volver a recibir puntos.',
        };
      }

      const puntos = evento.puntosAsistencia;
      const gt = gts.find((g) => g.id === persona.gtId);

      const nuevaAsistencia: Asistencia = {
        id: 'asist-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
        personaId,
        eventoId,
        turnoId: turnoId || null,
        temporadaId: temporadaActiva.id,
        gtId: persona.gtId,
        puntosOtorgados: puntos,
        fechaRegistro: new Date().toISOString(),
        origen,
      };

      setAsistencias((prev) => [nuevaAsistencia, ...prev]);

      addAuditLog(
        'REGISTRO_ASISTENCIA',
        'asistencia',
        nuevaAsistencia.id,
        `${persona.nombreCompleto} (${gt?.nombre}) sumó +${puntos} pts en ${evento.nombre}${turnoId ? ' (Turno)' : ''}`
      );

      return {
        success: true,
        message: '¡Participación registrada!',
        puntos,
        gtNombre: gt?.nombre || 'tu GT',
      };
    },
    [temporadaActiva, personas, eventos, turnos, asistencias, gts, addAuditLog]
  );

  // GT CRUD
  const crearGt = useCallback(
    (gtData: Omit<GrupoTrabajo, 'id' | 'createdAt'>) => {
      const nuevoGt: GrupoTrabajo = {
        ...gtData,
        id: 'gt-' + Date.now(),
        createdAt: new Date().toISOString(),
      };
      setGts((prev) => [...prev, nuevoGt]);
      addAuditLog('CREAR_GT', 'gt', nuevoGt.id, `Se creó el GT ${nuevoGt.nombre} (${nuevoGt.codigo})`);
    },
    [addAuditLog]
  );

  const actualizarGt = useCallback(
    (id: string, updates: Partial<GrupoTrabajo>) => {
      setGts((prev) => prev.map((g) => (g.id === id ? { ...g, ...updates } : g)));
      addAuditLog('ACTUALIZAR_GT', 'gt', id, `Modificación en GT: ${JSON.stringify(updates)}`);
    },
    [addAuditLog]
  );

  const toggleGtActivo = useCallback(
    (id: string) => {
      setGts((prev) =>
        prev.map((g) => {
          if (g.id === id) {
            const nextState = !g.activo;
            addAuditLog('TOGGLE_GT', 'gt', id, `GT ${g.nombre} cambiado a ${nextState ? 'Activo' : 'Inactivo'}`);
            return { ...g, activo: nextState };
          }
          return g;
        })
      );
    },
    [addAuditLog]
  );

  // Personas CRUD
  const crearPersona = useCallback(
    (data: Omit<Persona, 'id' | 'createdAt'>) => {
      const nuevaPersona: Persona = {
        ...data,
        id: 'per-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
        createdAt: new Date().toISOString(),
      };
      setPersonas((prev) => [...prev, nuevaPersona]);
      const gt = gts.find((g) => g.id === data.gtId);
      addAuditLog('CREAR_PERSONA', 'persona', nuevaPersona.id, `Se registró a ${nuevaPersona.nombreCompleto} en ${gt?.nombre}`);
    },
    [gts, addAuditLog]
  );

  const actualizarPersona = useCallback(
    (id: string, updates: Partial<Persona>) => {
      setPersonas((prev) => prev.map((p) => (p.id === id ? { ...p, ...updates } : p)));
      addAuditLog('ACTUALIZAR_PERSONA', 'persona', id, `Actualización de datos de persona`);
    },
    [addAuditLog]
  );

  const cambiarGtPersona = useCallback(
    (personaId: string, nuevoGtId: string) => {
      setPersonas((prev) =>
        prev.map((p) => {
          if (p.id === personaId) {
            const gtAnterior = gts.find((g) => g.id === p.gtId)?.nombre;
            const gtNuevo = gts.find((g) => g.id === nuevoGtId)?.nombre;
            addAuditLog('CAMBIO_GT_PERSONA', 'persona', personaId, `${p.nombreCompleto} cambió de ${gtAnterior} a ${gtNuevo}`);
            return { ...p, gtId: nuevoGtId };
          }
          return p;
        })
      );
    },
    [gts, addAuditLog]
  );

  const togglePersonaActiva = useCallback(
    (id: string) => {
      setPersonas((prev) =>
        prev.map((p) => {
          if (p.id === id) {
            const next = !p.activo;
            addAuditLog('TOGGLE_PERSONA', 'persona', id, `${p.nombreCompleto} ahora está ${next ? 'Activo' : 'Inactivo'}`);
            return { ...p, activo: next };
          }
          return p;
        })
      );
    },
    [addAuditLog]
  );

  const eliminarPersona = useCallback(
    (id: string) => {
      const p = personas.find((item) => item.id === id);
      setPersonas((prev) => prev.filter((item) => item.id !== id));
      addAuditLog('ELIMINAR_PERSONA', 'persona', id, `Se eliminó a ${p?.nombreCompleto || id}`);
    },
    [personas, addAuditLog]
  );

  // Temporadas
  const crearTemporada = useCallback(
    (data: Omit<Temporada, 'id' | 'createdAt'>) => {
      const nueva: Temporada = {
        ...data,
        id: 'temp-' + Date.now(),
        createdAt: new Date().toISOString(),
      };
      if (nueva.activa) {
        setTemporadas((prev) => prev.map((t) => ({ ...t, activa: false })).concat(nueva));
        setActiveTemporadaId(nueva.id);
      } else {
        setTemporadas((prev) => [...prev, nueva]);
      }
      addAuditLog('CREAR_TEMPORADA', 'temporada', nueva.id, `Nueva temporada: ${nueva.nombre}`);
    },
    [addAuditLog]
  );

  const activarTemporada = useCallback(
    (id: string) => {
      setTemporadas((prev) =>
        prev.map((t) => ({
          ...t,
          activa: t.id === id,
        }))
      );
      setActiveTemporadaId(id);
      const temp = temporadas.find((t) => t.id === id);
      addAuditLog('ACTIVAR_TEMPORADA', 'temporada', id, `Se activó ${temp?.nombre}`);
    },
    [temporadas, addAuditLog]
  );

  const cerrarTemporada = useCallback(
    (id: string) => {
      setTemporadas((prev) => prev.map((t) => (t.id === id ? { ...t, activa: false } : t)));
      addAuditLog('CERRAR_TEMPORADA', 'temporada', id, `Se cerró la temporada`);
    },
    [addAuditLog]
  );

  // Eventos
  const crearEvento = useCallback(
    (data: Omit<Evento, 'id' | 'createdAt'>) => {
      const nuevo: Evento = {
        ...data,
        id: 'eve-' + Date.now(),
        createdAt: new Date().toISOString(),
      };
      setEventos((prev) => [nuevo, ...prev]);
      addAuditLog('CREAR_EVENTO', 'evento', nuevo.id, `Se creó evento ${nuevo.nombre} (${nuevo.puntosAsistencia} pts)`);
    },
    [addAuditLog]
  );

  const actualizarEvento = useCallback(
    (id: string, updates: Partial<Evento>) => {
      setEventos((prev) => prev.map((e) => (e.id === id ? { ...e, ...updates } : e)));
      addAuditLog('ACTUALIZAR_EVENTO', 'evento', id, `Actualización en evento ${id}`);
    },
    [addAuditLog]
  );

  const cambiarEstadoEvento = useCallback(
    (id: string, nuevoEstado: Evento['estado']) => {
      setEventos((prev) => prev.map((e) => (e.id === id ? { ...e, estado: nuevoEstado } : e)));
      addAuditLog('CAMBIO_ESTADO_EVENTO', 'evento', id, `Evento cambiado a estado ${nuevoEstado}`);
    },
    [addAuditLog]
  );

  // Turnos & QR
  const crearTurno = useCallback(
    (data: Omit<Turno, 'id' | 'createdAt' | 'qrToken'>) => {
      const id = 'tur-' + Date.now();
      const qrToken = `qr-${data.eventoId}-${id}-${Math.random().toString(36).substring(2, 7)}`;
      const nuevo: Turno = {
        ...data,
        id,
        qrToken,
        createdAt: new Date().toISOString(),
      };
      setTurnos((prev) => [...prev, nuevo]);
      addAuditLog('CREAR_TURNO', 'turno', id, `Turno creado: ${nuevo.nombre} (${nuevo.horaInicio} - ${nuevo.horaFin})`);
    },
    [addAuditLog]
  );

  const actualizarTurno = useCallback(
    (id: string, updates: Partial<Turno>) => {
      setTurnos((prev) => prev.map((t) => (t.id === id ? { ...t, ...updates } : t)));
      addAuditLog('ACTUALIZAR_TURNO', 'turno', id, `Actualización de turno`);
    },
    [addAuditLog]
  );

  const activarTurno = useCallback(
    (id: string) => {
      setTurnos((prev) =>
        prev.map((t) => {
          if (t.id === id) {
            addAuditLog('ACTIVAR_TURNO', 'turno', id, `Se activó y abrió el QR del ${t.nombre}`);
            return { ...t, estado: 'activo', activo: true };
          }
          return t;
        })
      );
    },
    [addAuditLog]
  );

  const cerrarTurno = useCallback(
    (id: string) => {
      setTurnos((prev) =>
        prev.map((t) => {
          if (t.id === id) {
            addAuditLog('CERRAR_TURNO', 'turno', id, `Se cerró el turno y su QR: ${t.nombre}`);
            return { ...t, estado: 'finalizado', activo: false };
          }
          return t;
        })
      );
    },
    [addAuditLog]
  );

  // Retos
  const crearReto = useCallback(
    (data: Omit<Reto, 'id' | 'createdAt'>) => {
      const nuevo: Reto = {
        ...data,
        id: 'reto-' + Date.now(),
        createdAt: new Date().toISOString(),
      };
      setRetos((prev) => [...prev, nuevo]);
      addAuditLog('CREAR_RETO', 'reto', nuevo.id, `Nuevo reto: ${nuevo.nombre} (+${nuevo.puntos} pts)`);
    },
    [addAuditLog]
  );

  const actualizarReto = useCallback(
    (id: string, updates: Partial<Reto>) => {
      setRetos((prev) => prev.map((r) => (r.id === id ? { ...r, ...updates } : r)));
      addAuditLog('ACTUALIZAR_RETO', 'reto', id, `Actualización de reto`);
    },
    [addAuditLog]
  );

  const asignarGanadorReto = useCallback(
    ({
      retoId,
      gtId,
      personaId,
      puntos,
      posicion = 1,
      observacion,
    }: {
      retoId: string;
      gtId: string;
      personaId?: string | null;
      puntos: number;
      posicion?: number;
      observacion?: string;
    }) => {
      if (!temporadaActiva) return;
      const reto = retos.find((r) => r.id === retoId);
      const gt = gts.find((g) => g.id === gtId);
      const persona = personaId ? personas.find((p) => p.id === personaId) : null;

      const nuevaParticipacion: ParticipacionReto = {
        id: 'pret-' + Date.now(),
        retoId,
        eventoId: reto?.eventoId || '',
        temporadaId: temporadaActiva.id,
        gtId,
        personaId: personaId || null,
        puntosOtorgados: puntos,
        posicion,
        observacion: observacion || `Puesto #${posicion} en ${reto?.nombre}`,
        fechaRegistro: new Date().toISOString(),
      };

      setParticipacionesRetos((prev) => [nuevaParticipacion, ...prev]);

      addAuditLog(
        'ASIGNAR_RETO',
        'reto',
        retoId,
        `Se asignaron +${puntos} pts a ${gt?.nombre}${persona ? ` (${persona.nombreCompleto})` : ''} por puesto #${posicion}`
      );
    },
    [temporadaActiva, retos, gts, personas, addAuditLog]
  );

  // Factores
  const actualizarFactor = useCallback(
    (id: string, nuevoFactor: number) => {
      setFactores((prev) =>
        prev.map((f) => {
          if (f.id === id) {
            addAuditLog('ACTUALIZAR_FACTOR', 'factor', id, `Factor ${f.descripcion} cambiado a ${nuevoFactor}`);
            return { ...f, factor: nuevoFactor };
          }
          return f;
        })
      );
    },
    [addAuditLog]
  );

  const actualizarRangoFactor = useCallback(
    (id: string, min: number, max: number | null, factor: number) => {
      setFactores((prev) =>
        prev.map((f) =>
          f.id === id ? { ...f, minIntegrantes: min, maxIntegrantes: max, factor } : f
        )
      );
      addAuditLog('ACTUALIZAR_RANGO_FACTOR', 'factor', id, `Rango actualizado: ${min} a ${max ?? 'más'} con factor ${factor}`);
    },
    [addAuditLog]
  );

  // Auditoría y Corrección
  const anularAsistencia = useCallback(
    (id: string, motivo: string) => {
      setAsistencias((prev) =>
        prev.map((a) => {
          if (a.id === id) {
            addAuditLog('ANULAR_ASISTENCIA', 'asistencia', id, `Anulación: ${motivo}`);
            return { ...a, anulado: true, anuladoMotivo: motivo };
          }
          return a;
        })
      );
    },
    [addAuditLog]
  );

  const anularParticipacionReto = useCallback(
    (id: string) => {
      setParticipacionesRetos((prev) =>
        prev.map((r) => {
          if (r.id === id) {
            addAuditLog('ANULAR_RETO_PUNTOS', 'participacion_reto', id, `Puntos de reto anulados`);
            return { ...r, anulado: true };
          }
          return r;
        })
      );
    },
    [addAuditLog]
  );

  // Reset to initial test data
  const restablecerDatosPrueba = useCallback(() => {
    setTemporadas(INITIAL_TEMPORADAS);
    setGts(INITIAL_GTS);
    setPersonas(INITIAL_PERSONAS);
    setEventos(INITIAL_EVENTOS);
    setTurnos(INITIAL_TURNOS);
    setAsistencias(INITIAL_ASISTENCIAS);
    setRetos(INITIAL_RETOS);
    setParticipacionesRetos(INITIAL_PARTICIPACION_RETOS);
    setFactores(INITIAL_FACTORES);
    setAuditLogs(INITIAL_AUDIT_LOGS);
    setActiveTemporadaId(TEMPORADA_ACTIVA_ID);

    localStorage.removeItem(STORAGE_KEY + '_temporadas');
    localStorage.removeItem(STORAGE_KEY + '_gts');
    localStorage.removeItem(STORAGE_KEY + '_personas');
    localStorage.removeItem(STORAGE_KEY + '_eventos');
    localStorage.removeItem(STORAGE_KEY + '_turnos');
    localStorage.removeItem(STORAGE_KEY + '_asistencias');
    localStorage.removeItem(STORAGE_KEY + '_retos');
    localStorage.removeItem(STORAGE_KEY + '_participacionesRetos');
    localStorage.removeItem(STORAGE_KEY + '_factores');
    localStorage.removeItem(STORAGE_KEY + '_auditLogs');

    addAuditLog('RESTABLECER_DATOS', 'sistema', 'all', 'Se restauraron los datos iniciales de prueba de DIAS EAFIT');
  }, [addAuditLog]);

  const limpiarTodosLosDatos = useCallback(() => {
    setPersonas([]);
    setEventos([]);
    setTurnos([]);
    setAsistencias([]);
    setRetos([]);
    setParticipacionesRetos([]);
    addAuditLog('LIMPIAR_DATOS', 'sistema', 'all', 'Se limpiaron todas las personas, eventos y asistencias');
  }, [addAuditLog]);

  const value = useMemo(
    () => ({
      activeTab,
      setActiveTab,
      temporadas,
      gts,
      personas,
      eventos,
      turnos,
      asistencias,
      retos,
      participacionesRetos,
      factores,
      auditLogs,
      temporadaActiva,
      setTemporadaActivaId: setActiveTemporadaId,
      rankingGts,
      podio,
      rankingPersonas,
      estadisticas,
      actividadReciente,
      registrarAsistencia,
      crearGt,
      actualizarGt,
      toggleGtActivo,
      crearPersona,
      actualizarPersona,
      cambiarGtPersona,
      togglePersonaActiva,
      eliminarPersona,
      crearTemporada,
      activarTemporada,
      cerrarTemporada,
      crearEvento,
      actualizarEvento,
      cambiarEstadoEvento,
      crearTurno,
      actualizarTurno,
      activarTurno,
      cerrarTurno,
      crearReto,
      actualizarReto,
      asignarGanadorReto,
      actualizarFactor,
      actualizarRangoFactor,
      anularAsistencia,
      anularParticipacionReto,
      restablecerDatosPrueba,
      limpiarTodosLosDatos,
      isAdmin,
      setIsAdmin,
    }),
    [
      temporadas,
      gts,
      personas,
      eventos,
      turnos,
      asistencias,
      retos,
      participacionesRetos,
      factores,
      auditLogs,
      temporadaActiva,
      rankingGts,
      podio,
      rankingPersonas,
      estadisticas,
      actividadReciente,
      registrarAsistencia,
      crearGt,
      actualizarGt,
      toggleGtActivo,
      crearPersona,
      actualizarPersona,
      cambiarGtPersona,
      togglePersonaActiva,
      eliminarPersona,
      crearTemporada,
      activarTemporada,
      cerrarTemporada,
      crearEvento,
      actualizarEvento,
      cambiarEstadoEvento,
      crearTurno,
      actualizarTurno,
      activarTurno,
      cerrarTurno,
      crearReto,
      actualizarReto,
      asignarGanadorReto,
      actualizarFactor,
      actualizarRangoFactor,
      anularAsistencia,
      anularParticipacionReto,
      restablecerDatosPrueba,
      limpiarTodosLosDatos,
      isAdmin,
      activeTab,
    ]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
