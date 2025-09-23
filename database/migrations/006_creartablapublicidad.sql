-- Migration: 006_crear_tabla_publicidad
-- Description: Crear tabla de publicidad para gestionar anuncios y promociones de la farmacia
-- Date: 2025-09-23
-- Author: PharmaCenter Team

-- ============================================
-- MIGRATION UP - CREAR TABLA PUBLICIDAD
-- ============================================

-- Crear tabla de publicidad
CREATE TABLE IF NOT EXISTS publicidad (
    idpublicidad SERIAL PRIMARY KEY,
    titulo VARCHAR(200) NOT NULL,
    descripcion TEXT,
    tipo_publicidad VARCHAR(50) NOT NULL CHECK (tipo_publicidad IN ('banner', 'promocion', 'descuento', 'oferta_especial', 'evento', 'informativa')),
    imagen_url TEXT,
    fecha_inicio DATE NOT NULL,
    fecha_fin DATE NOT NULL,
    activo BOOLEAN DEFAULT TRUE,
    posicion INTEGER DEFAULT 0,
    url_enlace TEXT,
    descuento_porcentaje DECIMAL(5,2) CHECK (descuento_porcentaje >= 0 AND descuento_porcentaje <= 100),
    productos_aplicables TEXT[], -- Array de IDs de medicamentos aplicables
    codigo_promocional VARCHAR(50) UNIQUE,
    limite_usos INTEGER DEFAULT NULL,
    usos_actuales INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by INTEGER REFERENCES usuarios(idusuario),
    
    -- Constraint para validar fechas
    CONSTRAINT check_fechas_validas CHECK (fecha_fin >= fecha_inicio)
);

-- ============================================
-- ÍNDICES PARA OPTIMIZACIÓN
-- ============================================

-- Índice para búsquedas por tipo de publicidad
CREATE INDEX IF NOT EXISTS idx_publicidad_tipo ON publicidad(tipo_publicidad);

-- Índice para consultas de publicidad activa
CREATE INDEX IF NOT EXISTS idx_publicidad_activo ON publicidad(activo);

-- Índice para búsquedas por fechas (publicidad vigente)
CREATE INDEX IF NOT EXISTS idx_publicidad_fechas ON publicidad(fecha_inicio, fecha_fin);

-- Índice para ordenamiento por posición
CREATE INDEX IF NOT EXISTS idx_publicidad_posicion ON publicidad(posicion);

-- Índice para código promocional
CREATE INDEX IF NOT EXISTS idx_publicidad_codigo ON publicidad(codigo_promocional);

-- Índice para título (búsquedas de texto)
CREATE INDEX IF NOT EXISTS idx_publicidad_titulo ON publicidad(titulo);

-- ============================================
-- TRIGGERS PARA AUDIT TRAIL
-- ============================================

-- Trigger para actualizar updated_at automáticamente
CREATE TRIGGER update_publicidad_updated_at 
BEFORE UPDATE ON publicidad
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- FUNCIÓN AUXILIAR
-- ============================================

-- Función para obtener publicidad vigente
CREATE OR REPLACE FUNCTION obtener_publicidad_vigente(tipo_pub VARCHAR DEFAULT NULL)
RETURNS TABLE(
    id INTEGER,
    titulo VARCHAR,
    descripcion TEXT,
    tipo VARCHAR,
    imagen_url TEXT,
    descuento_porcentaje DECIMAL,
    codigo_promocional VARCHAR,
    url_enlace TEXT,
    posicion INTEGER
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        p.idpublicidad,
        p.titulo,
        p.descripcion,
        p.tipo_publicidad,
        p.imagen_url,
        p.descuento_porcentaje,
        p.codigo_promocional,
        p.url_enlace,
        p.posicion
    FROM publicidad p
    WHERE p.activo = TRUE
    AND CURRENT_DATE BETWEEN p.fecha_inicio AND p.fecha_fin
    AND (tipo_pub IS NULL OR p.tipo_publicidad = tipo_pub)
    ORDER BY p.posicion ASC, p.created_at DESC;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- COMENTARIOS DE DOCUMENTACIÓN
-- ============================================

COMMENT ON TABLE publicidad IS 'Tabla para gestionar publicidad, promociones y ofertas de la farmacia';
COMMENT ON COLUMN publicidad.titulo IS 'Título del anuncio o promoción';
COMMENT ON COLUMN publicidad.descripcion IS 'Descripción detallada de la publicidad';
COMMENT ON COLUMN publicidad.tipo_publicidad IS 'Tipo de publicidad: banner, promocion, descuento, etc.';
COMMENT ON COLUMN publicidad.imagen_url IS 'URL de la imagen del anuncio';
COMMENT ON COLUMN publicidad.fecha_inicio IS 'Fecha de inicio de vigencia';
COMMENT ON COLUMN publicidad.fecha_fin IS 'Fecha de fin de vigencia';
COMMENT ON COLUMN publicidad.activo IS 'Si la publicidad está activa o no';
COMMENT ON COLUMN publicidad.posicion IS 'Orden de visualización (menor = mayor prioridad)';
COMMENT ON COLUMN publicidad.url_enlace IS 'URL de destino cuando se hace clic en el anuncio';
COMMENT ON COLUMN publicidad.descuento_porcentaje IS 'Porcentaje de descuento para promociones';
COMMENT ON COLUMN publicidad.productos_aplicables IS 'Array de IDs de medicamentos donde aplica la promoción';
COMMENT ON COLUMN publicidad.codigo_promocional IS 'Código promocional único para descuentos';
COMMENT ON COLUMN publicidad.limite_usos IS 'Número máximo de usos del código promocional';
COMMENT ON COLUMN publicidad.usos_actuales IS 'Número actual de usos del código promocional';

-- Insertar registro de migración
INSERT INTO schema_migrations (version, description, checksum, rollback_file) 
VALUES ('006', 'crear tabla publicidad', 'pendiente', '006_rollback_creartablapublicidad.sql')
ON CONFLICT (version) DO NOTHING;