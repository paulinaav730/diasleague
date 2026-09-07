-- ====================================================================
-- DIAS LEAGUE - SEED DE DATOS INICIALES PARA SUPABASE
-- Organización Estudiantil EAFIT - DIAS
-- ====================================================================

-- 1. INSERTAR TEMPORADA 2026-2
INSERT INTO public.temporadas (id, nombre, activa, fecha_inicio, fecha_fin, descripcion)
VALUES 
('11111111-1111-1111-1111-111111111111', 'Temporada 2026-2', true, '2026-08-01', '2026-11-30', 'Temporada actual de DIAS League - Semestre 2026-2')
ON CONFLICT (id) DO NOTHING;

-- 2. INSERTAR GRUPOS DE TRABAJO (9 GTs)
INSERT INTO public.gts (id, nombre, codigo, descripcion, color, icono, activo) VALUES
('22222222-2222-2222-2222-000000000001', 'GH', 'GH', 'Gestión Humana y Talento', '#3B82F6', 'Users', true),
('22222222-2222-2222-2222-000000000002', 'Logística', 'LOG', 'Operaciones, Montajes y Logística', '#10B981', 'Boxes', true),
('22222222-2222-2222-2222-000000000003', 'RRPP', 'RRPP', 'Relaciones Públicas y Patrocinios', '#8B5CF6', 'Megaphone', true),
('22222222-2222-2222-2222-000000000004', 'Publicidad', 'PUB', 'Diseño Gráfico, Contenido y Redes', '#EC4899', 'Palette', true),
('22222222-2222-2222-2222-000000000005', 'Generales', 'GEN', 'Comité General y Coordinación', '#F59E0B', 'Compass', true),
('22222222-2222-2222-2222-000000000006', 'The Games', 'TG', 'Torneos y Recreación', '#06B6D4', 'Gamepad2', true),
('22222222-2222-2222-2222-000000000007', 'Carnival', 'CARN', 'Cultura y Festivales', '#F97316', 'Sparkles', true),
('22222222-2222-2222-2222-000000000008', 'Finanzas', 'FIN', 'Presupuestos y Tesorería', '#14B8A6', 'BadgeDollarSign', true),
('22222222-2222-2222-2222-000000000009', 'Seguridad', 'SEG', 'Control y Protocolos', '#EF4444', 'ShieldCheck', true)
ON CONFLICT (id) DO NOTHING;

-- 3. INSERTAR FACTORES DE TAMAÑO
INSERT INTO public.factores_tamano (min_integrantes, max_integrantes, factor, descripcion) VALUES
(1, 5, 1.30, 'Equipos de 1 a 5 integrantes (Factor 1.3)'),
(6, 10, 1.10, 'Equipos de 6 a 10 integrantes (Factor 1.1)'),
(11, NULL, 1.00, 'Equipos de 11 o más integrantes (Factor 1.0)')
ON CONFLICT DO NOTHING;

-- 4. INSERTAR EVENTOS
INSERT INTO public.eventos (id, temporada_id, nombre, descripcion, fecha, estado, tipo_evento, puntos_asistencia, utiliza_qr, utiliza_turnos, tiene_retos, lugar) VALUES
('33333333-3333-3333-3333-000000000001', '11111111-1111-1111-1111-111111111111', 'EXPECTA DIAS', 'Gran jornada de expectativa con turnos y QR', '2026-09-10', 'activo', 'turnos_qr', 10, true, true, false, 'Plazoleta Central EAFIT'),
('33333333-3333-3333-3333-000000000002', '11111111-1111-1111-1111-111111111111', 'CONECTA2 (1)', 'Primer encuentro formativo', '2026-08-12', 'finalizado', 'asistencia', 10, false, false, false, 'Auditorio 38-101'),
('33333333-3333-3333-3333-000000000003', '11111111-1111-1111-1111-111111111111', 'CONECTA2 (2)', 'Segunda jornada formativa', '2026-08-19', 'finalizado', 'asistencia', 20, false, false, false, 'Bloque 19'),
('33333333-3333-3333-3333-000000000004', '11111111-1111-1111-1111-111111111111', 'RETO DIAS', 'Desafío inter-GTs', '2026-08-26', 'finalizado', 'retos', 0, false, false, true, 'Canchas EAFIT'),
('33333333-3333-3333-3333-000000000005', '11111111-1111-1111-1111-111111111111', 'CONECTA2 (3)', 'Tercer encuentro', '2026-09-02', 'finalizado', 'asistencia', 30, false, false, false, 'Plazoleta del Estudiante'),
('33333333-3333-3333-3333-000000000006', '11111111-1111-1111-1111-111111111111', 'CONECTA2 (4)', 'Cuarto encuentro final', '2026-09-18', 'programado', 'asistencia', 40, false, false, false, 'Hall Bloque 38')
ON CONFLICT (id) DO NOTHING;

-- 5. INSERTAR TURNOS DE EXPECTA DIAS
INSERT INTO public.turnos (id, evento_id, temporada_id, nombre, hora_inicio, hora_fin, estado, qr_token, activo) VALUES
('44444444-4444-4444-4444-000000000001', '33333333-3333-3333-3333-000000000001', '11111111-1111-1111-1111-111111111111', 'Turno 1', '08:00 AM', '10:00 AM', 'activo', 'qr-expecta-t1-8am-dias', true),
('44444444-4444-4444-4444-000000000002', '33333333-3333-3333-3333-000000000001', '11111111-1111-1111-1111-111111111111', 'Turno 2', '10:00 AM', '12:00 PM', 'programado', 'qr-expecta-t2-10am-dias', false),
('44444444-4444-4444-4444-000000000003', '33333333-3333-3333-3333-000000000001', '11111111-1111-1111-1111-111111111111', 'Turno 3', '01:00 PM', '03:00 PM', 'programado', 'qr-expecta-t3-1pm-dias', false),
('44444444-4444-4444-4444-000000000004', '33333333-3333-3333-3333-000000000001', '11111111-1111-1111-1111-111111111111', 'Turno 4', '03:00 PM', '05:00 PM', 'programado', 'qr-expecta-t4-3pm-dias', false)
ON CONFLICT (id) DO NOTHING;
