-- Rollback: 015_rollback_agregar_indices_rendimiento
-- Description: Eliminar índices de rendimiento
-- Date: 2025-10-15

-- ============================================
-- MIGRATION DOWN
-- ============================================

DROP INDEX IF EXISTS idx_medicamento_proveedor;
DROP INDEX IF EXISTS idx_venta_fecha;
DROP INDEX IF EXISTS idx_venta_cliente;
DROP INDEX IF EXISTS idx_notificacion_fecha_tipo;
DROP INDEX IF EXISTS idx_notificacion_usuario;
