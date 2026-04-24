-- SCRIPT: ACTUALIZACIÓN DE CATEGORÍAS Y EVENTOS

-- 1. Asegurarnos que la tabla categorias tiene los campos correctos (probablemente ya existan)
CREATE TABLE IF NOT EXISTS public.categorias (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    nombre text NOT NULL,
    icono text,
    created_at timestamp with time zone DEFAULT now()
);

-- Si la tabla ya existía de antes, nos aseguramos de que el campo "icono" se añada
ALTER TABLE public.categorias ADD COLUMN IF NOT EXISTS icono text;

-- Habilitamos políticas (si hiciera falta, para que sea pública en lectura)
ALTER TABLE categorias ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Categorias publicas" ON categorias;
CREATE POLICY "Categorias publicas" ON categorias FOR SELECT USING (true);


-- 2. Limpiar categorías anteriores e insertar el Master Pack definitivo (ordenado lógicamente para nosotros, pero luego React lo ordenará alfanuméricamente)
TRUNCATE TABLE categorias CASCADE;

INSERT INTO categorias (nombre, icono_emoji, icono) VALUES 
('Concierto',               '🎤', 'FaMicrophone'),
('DJ Set / Sesión',         '🎧', 'FaHeadphones'),
('Música en Directo',       '🎸', 'FaGuitar'),
('Festival',                '🎪', 'FaTicketAlt'),
('Karaoke',                 '🎵', 'FaMicrophoneAlt'),
('Fiesta Temática',         '🥂', 'FaGlassCheers'),
('Tardeo',                  '🍹', 'FaCocktail'),
('Happy Hour / Promo',      '🍺', 'FaBeer'),
('Degustación / Cata',      '🍷', 'FaWineGlassAlt'),
('Jornada Gastronómica',    '🍽️', 'FaUtensils'),
('Cena Espectáculo',        '⭐', 'FaStar'),
('Monólogo / Comedia',      '😂', 'FaTheaterMasks'),
('Teatro / Artes Escénicas','🎭', 'FaMask'),
('Magia / Ilusionismo',     '🎩', 'FaMagic'),
('Danza / Baile',           '💃', 'FaChild'),
('Quedada / Meetup',        '👥', 'FaUsers'),
('Intercambio de Idiomas',  '🌍', 'FaLanguage'),
('Networking / Afterwork',  '🤝', 'FaHandshake'),
('Torneo / Trivial',        '🎲', 'FaDice'),
('Visita Cultural',         '🏛️', 'FaMapMarkedAlt'),
('Exposición / Arte',       '🎨', 'FaPalette'),
('Senderismo / Aire Libre', '🥾', 'FaHiking'),
('Presentación',            '📖', 'FaBookOpen'),
('Taller / Masterclass',    '💡', 'FaLightbulb'),
('Mercadillo / Pop-up Store','🛒', 'FaStoreAlt'),
('Otros / Varios',          '✳️', 'FaAsterisk');


-- 3. Actualizar la tabla de Eventos con los nuevos campos
ALTER TABLE eventos 
ADD COLUMN IF NOT EXISTS categoria_id uuid REFERENCES categorias(id),
ADD COLUMN IF NOT EXISTS entidad_amenizador_id uuid REFERENCES entidades(id),
ADD COLUMN IF NOT EXISTS amenizador text,
ADD COLUMN IF NOT EXISTS promotor text;

-- Igualar el Histórico (Análisis) para que soporte estos campos al versionar
ALTER TABLE eventos_analisis 
ADD COLUMN IF NOT EXISTS categoria_id uuid REFERENCES categorias(id),
ADD COLUMN IF NOT EXISTS entidad_amenizador_id uuid REFERENCES entidades(id),
ADD COLUMN IF NOT EXISTS amenizador text,
ADD COLUMN IF NOT EXISTS promotor text;
