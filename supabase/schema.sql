-- ====================================================================
-- DIAS LEAGUE - SCHEMA COMPLETO SUPABASE / POSTGRESQL
-- Organización Estudiantil EAFIT - DIAS
-- ====================================================================

-- 1. EXTENSIONES
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. TABLA TEMPORADAS
CREATE TABLE IF NOT EXISTS public.temporadas (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nombre VARCHAR(100) NOT NULL,
    activa BOOLEAN DEFAULT false,
    fecha_inicio DATE NOT NULL,
    fecha_fin DATE NOT NULL,
    descripcion TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Solo una temporada activa a la vez
CREATE UNIQUE INDEX IF NOT EXISTS idx_una_temporada_activa 
ON public.temporadas (activa) 
WHERE activa = true;

-- 3. TABLA GRUPOS DE TRABAJO (GT)
CREATE TABLE IF NOT EXISTS public.gts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nombre VARCHAR(100) NOT NULL UNIQUE,
    codigo VARCHAR(20) NOT NULL UNIQUE,
    descripcion TEXT,
    color VARCHAR(20) NOT NULL,
    icono VARCHAR(50) NOT NULL DEFAULT 'Users',
    activo BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. TABLA FACTORES DE TAMAÑO
CREATE TABLE IF NOT EXISTS public.factores_tamano (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    min_integrantes INT NOT NULL,
    max_integrantes INT, -- NULL significa sin límite superior (ej: 11 o más)
    factor NUMERIC(3, 2) NOT NULL,
    descripcion VARCHAR(255)
);

-- 5. TABLA PERSONAS
CREATE TABLE IF NOT EXISTS public.personas (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nombre_completo VARCHAR(255) NOT NULL,
    gt_id UUID NOT NULL REFERENCES public.gts(id) ON DELETE RESTRICT,
    activo BOOLEAN DEFAULT true,
    email VARCHAR(255),
    codigo_estudiantil VARCHAR(50),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_personas_gt ON public.personas(gt_id);

-- 6. TABLA EVENTOS
CREATE TABLE IF NOT EXISTS public.eventos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    temporada_id UUID NOT NULL REFERENCES public.temporadas(id) ON DELETE CASCADE,
    nombre VARCHAR(255) NOT NULL,
    descripcion TEXT,
    fecha DATE NOT NULL,
    estado VARCHAR(20) NOT NULL DEFAULT 'programado' CHECK (estado IN ('programado', 'activo', 'finalizado')),
    tipo_evento VARCHAR(30) NOT NULL DEFAULT 'asistencia' CHECK (tipo_evento IN ('asistencia', 'turnos_qr', 'retos', 'mixto')),
    puntos_asistencia INT DEFAULT 0,
    utiliza_qr BOOLEAN DEFAULT false,
    utiliza_turnos BOOLEAN DEFAULT false,
    tiene_retos BOOLEAN DEFAULT false,
    lugar VARCHAR(255),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_eventos_temporada ON public.eventos(temporada_id);

-- 7. TABLA TURNOS
CREATE TABLE IF NOT EXISTS public.turnos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    evento_id UUID NOT NULL REFERENCES public.eventos(id) ON DELETE CASCADE,
    temporada_id UUID NOT NULL REFERENCES public.temporadas(id) ON DELETE CASCADE,
    nombre VARCHAR(100) NOT NULL,
    hora_inicio VARCHAR(50) NOT NULL,
    hora_fin VARCHAR(50) NOT NULL,
    estado VARCHAR(20) NOT NULL DEFAULT 'programado' CHECK (estado IN ('programado', 'activo', 'finalizado')),
    qr_token VARCHAR(100) NOT NULL UNIQUE,
    activo BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_turnos_evento ON public.turnos(evento_id);

-- 8. TABLA ASISTENCIAS (CON PREVENCION RIGUROSA DE DUPLICADOS)
CREATE TABLE IF NOT EXISTS public.asistencias (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    persona_id UUID NOT NULL REFERENCES public.personas(id) ON DELETE RESTRICT,
    evento_id UUID NOT NULL REFERENCES public.eventos(id) ON DELETE CASCADE,
    turno_id UUID REFERENCES public.turnos(id) ON DELETE SET NULL,
    temporada_id UUID NOT NULL REFERENCES public.temporadas(id) ON DELETE CASCADE,
    gt_id UUID NOT NULL REFERENCES public.gts(id) ON DELETE RESTRICT,
    puntos_otorgados INT NOT NULL DEFAULT 0,
    origen VARCHAR(20) NOT NULL DEFAULT 'qr' CHECK (origen IN ('qr', 'manual')),
    fecha_registro TIMESTAMPTZ DEFAULT NOW(),
    anulado BOOLEAN DEFAULT false,
    anulado_motivo TEXT
);

-- RESTRICCIÓN DE UNICIDAD: Una persona solo puede registrarse 1 vez por turno (o evento si no hay turno)
CREATE UNIQUE INDEX IF NOT EXISTS idx_unica_asistencia_por_turno 
ON public.asistencias (persona_id, evento_id, turno_id, temporada_id) 
WHERE anulado = false AND turno_id IS NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS idx_unica_asistencia_sin_turno 
ON public.asistencias (persona_id, evento_id, temporada_id) 
WHERE anulado = false AND turno_id IS NULL;

-- 9. TABLA RETOS
CREATE TABLE IF NOT EXISTS public.retos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    evento_id UUID NOT NULL REFERENCES public.eventos(id) ON DELETE CASCADE,
    temporada_id UUID NOT NULL REFERENCES public.temporadas(id) ON DELETE CASCADE,
    nombre VARCHAR(255) NOT NULL,
    descripcion TEXT,
    puntos INT NOT NULL DEFAULT 0,
    tipo_reto VARCHAR(20) NOT NULL DEFAULT 'grupal' CHECK (tipo_reto IN ('individual', 'grupal')),
    estado VARCHAR(20) NOT NULL DEFAULT 'activo' CHECK (estado IN ('activo', 'finalizado')),
    fecha DATE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. TABLA PARTICIPACION RETOS
CREATE TABLE IF NOT EXISTS public.participacion_retos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    reto_id UUID NOT NULL REFERENCES public.retos(id) ON DELETE CASCADE,
    evento_id UUID NOT NULL REFERENCES public.eventos(id) ON DELETE CASCADE,
    temporada_id UUID NOT NULL REFERENCES public.temporadas(id) ON DELETE CASCADE,
    gt_id UUID NOT NULL REFERENCES public.gts(id) ON DELETE RESTRICT,
    persona_id UUID REFERENCES public.personas(id) ON DELETE SET NULL,
    puntos_otorgados INT NOT NULL DEFAULT 0,
    posicion INT,
    observacion TEXT,
    fecha_registro TIMESTAMPTZ DEFAULT NOW(),
    anulado BOOLEAN DEFAULT false
);

-- 11. TABLA AUDIT LOGS
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    accion VARCHAR(100) NOT NULL,
    tipo_entidad VARCHAR(50) NOT NULL,
    entidad_id VARCHAR(100) NOT NULL,
    detalles TEXT NOT NULL,
    usuario VARCHAR(100) DEFAULT 'admin',
    fecha TIMESTAMPTZ DEFAULT NOW()
);

-- ====================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ====================================================================
ALTER TABLE public.temporadas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.personas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.factores_tamano ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.eventos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.turnos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.asistencias ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.retos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.participacion_retos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Acceso de lectura público para ranking y visualización
CREATE POLICY "Lectura pública de temporadas" ON public.temporadas FOR SELECT USING (true);
CREATE POLICY "Lectura pública de gts" ON public.gts FOR SELECT USING (true);
CREATE POLICY "Lectura pública de personas" ON public.personas FOR SELECT USING (true);
CREATE POLICY "Lectura pública de factores" ON public.factores_tamano FOR SELECT USING (true);
CREATE POLICY "Lectura pública de eventos" ON public.eventos FOR SELECT USING (true);
CREATE POLICY "Lectura pública de turnos" ON public.turnos FOR SELECT USING (true);
CREATE POLICY "Lectura pública de asistencias" ON public.asistencias FOR SELECT USING (true);
CREATE POLICY "Lectura pública de retos" ON public.retos FOR SELECT USING (true);
CREATE POLICY "Lectura pública de participacion_retos" ON public.participacion_retos FOR SELECT USING (true);
CREATE POLICY "Lectura de audit logs" ON public.audit_logs FOR SELECT USING (true);

-- Inserción de asistencia permitida desde el flujo de QR
CREATE POLICY "Permitir registro de asistencia" ON public.asistencias 
FOR INSERT WITH CHECK (true);

-- Modificación y administración protegida
CREATE POLICY "Admin total temporadas" ON public.temporadas FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin total gts" ON public.gts FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin total personas" ON public.personas FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin total factores" ON public.factores_tamano FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin total eventos" ON public.eventos FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin total turnos" ON public.turnos FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin total retos" ON public.retos FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin total asistencias" ON public.asistencias FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Admin total participacion_retos" ON public.participacion_retos FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin total audit logs" ON public.audit_logs FOR INSERT WITH CHECK (true);

-- ====================================================================
-- FUNCION PARA VALIDAR ASISTENCIA SIN DUPLICADOS
-- ====================================================================
CREATE OR REPLACE FUNCTION public.registrar_asistencia_qr(
    p_persona_id UUID,
    p_turno_id UUID
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_turno RECORD;
    v_persona RECORD;
    v_evento RECORD;
    v_temporada_activa RECORD;
    v_asistencia_existente RECORD;
    v_asistencia_id UUID;
BEGIN
    -- 1. Verificar turno
    SELECT * INTO v_turno FROM public.turnos WHERE id = p_turno_id;
    IF NOT FOUND THEN
        RETURN jsonb_build_object('success', false, 'error', 'Turno no encontrado.');
    END IF;

    IF v_turno.estado != 'activo' OR v_turno.activo = false THEN
        RETURN jsonb_build_object('success', false, 'error', 'Este turno ya finalizó o no está activo.');
    END IF;

    -- 2. Verificar temporada activa
    SELECT * INTO v_temporada_activa FROM public.temporadas WHERE id = v_turno.temporada_id AND activa = true;
    IF NOT FOUND THEN
        RETURN jsonb_build_object('success', false, 'error', 'La temporada de este evento no está activa.');
    END IF;

    -- 3. Verificar evento
    SELECT * INTO v_evento FROM public.eventos WHERE id = v_turno.evento_id;
    IF NOT FOUND THEN
        RETURN jsonb_build_object('success', false, 'error', 'Evento no encontrado.');
    END IF;

    -- 4. Verificar persona
    SELECT * INTO v_persona FROM public.personas WHERE id = p_persona_id AND activo = true;
    IF NOT FOUND THEN
        RETURN jsonb_build_object('success', false, 'error', 'Persona no encontrada o inactiva.');
    END IF;

    -- 5. Verificar duplicado
    SELECT id INTO v_asistencia_existente 
    FROM public.asistencias 
    WHERE persona_id = p_persona_id 
      AND evento_id = v_turno.evento_id 
      AND turno_id = p_turno_id 
      AND anulado = false;

    IF FOUND THEN
        RETURN jsonb_build_object(
            'success', false, 
            'error', 'Ya registraste tu participación en este turno.'
        );
    END IF;

    -- 6. Insertar asistencia
    INSERT INTO public.asistencias (
        persona_id,
        evento_id,
        turno_id,
        temporada_id,
        gt_id,
        puntos_otorgados,
        origen
    ) VALUES (
        p_persona_id,
        v_turno.evento_id,
        p_turno_id,
        v_turno.temporada_id,
        v_persona.gt_id,
        v_evento.puntos_asistencia,
        'qr'
    ) RETURNING id INTO v_asistencia_id;

    RETURN jsonb_build_object(
        'success', true,
        'asistencia_id', v_asistencia_id,
        'puntos', v_evento.puntos_asistencia,
        'mensaje', '¡Participación registrada con éxito!'
    );
END;
$$;
