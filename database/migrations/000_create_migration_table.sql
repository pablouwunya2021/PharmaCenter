-- Migration Control Table
-- Esta tabla mantiene registro de todas las migraciones ejecutadas

CREATE TABLE IF NOT EXISTS schema_migrations (
    version VARCHAR(50) PRIMARY KEY,
    description TEXT NOT NULL,
    executed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    checksum VARCHAR(64) NOT NULL,
    execution_time_ms INTEGER DEFAULT 0,
    rollback_file VARCHAR(100)
);

-- Índices para mejorar rendimiento
CREATE INDEX IF NOT EXISTS idx_schema_migrations_executed_at 
ON schema_migrations(executed_at);

-- Comentarios de la tabla
COMMENT ON TABLE schema_migrations IS 'Tabla de control para el sistema de migraciones de PharmaCenter';
COMMENT ON COLUMN schema_migrations.version IS 'Número de versión de la migración (ej: 001, 002, etc.)';
COMMENT ON COLUMN schema_migrations.description IS 'Descripción del cambio realizado en la migración';
COMMENT ON COLUMN schema_migrations.executed_at IS 'Timestamp de cuando se ejecutó la migración';
COMMENT ON COLUMN schema_migrations.checksum IS 'Checksum del archivo de migración para verificar integridad';
COMMENT ON COLUMN schema_migrations.execution_time_ms IS 'Tiempo de ejecución en milisegundos';
COMMENT ON COLUMN schema_migrations.rollback_file IS 'Nombre del archivo de rollback correspondiente';