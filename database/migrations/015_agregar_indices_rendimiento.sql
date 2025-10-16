-- Migration: 015_agregar_indices_rendimiento
-- Description: Agregar índices para mejorar rendimiento de consultas frecuentes
-- Date: 2025-10-15
-- Author: PharmaCenter Team

-- ============================================
-- MIGRATION UP - INDICES PARA MEJOR RENDIMIENTO
-- ============================================

-- 1. Índice en medicamento por proveedor (para filtrar por proveedor)
CREATE INDEX IF NOT EXISTS idx_medicamento_proveedor 
ON medicamento(idproveedor);

-- 2. Índice en venta por fecha (para reportes por rango de fechas)
CREATE INDEX IF NOT EXISTS idx_venta_fecha 
ON venta(fecha);

-- 3. Índice en venta por cliente (para historial de compras)
CREATE INDEX IF NOT EXISTS idx_venta_cliente 
ON venta(idcliente);

-- 4. Índice en notificacion por fecha y tipo (para filtrar notificaciones)
CREATE INDEX IF NOT EXISTS idx_notificacion_fecha_tipo 
ON notificacion(fecha, tipo);

-- 5. Índice en notificacion por usuario (para notificaciones de un usuario)
CREATE INDEX IF NOT EXISTS idx_notificacion_usuario 
ON notificacion(idusuario);

-- Estos índices aceleran las consultas más comunes
