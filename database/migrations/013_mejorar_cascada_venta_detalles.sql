-- Migration: 013_mejorar_cascada_venta_detalles
-- Description: Asegurar que detalles de venta se borren al eliminar venta
-- Date: 2025-10-15
-- Author: PharmaCenter Team

-- ============================================
-- MIGRATION UP - CASCADE DELETE EN VENTA_MEDICAMENTO
-- ============================================

-- 1. Eliminar constraint existente
ALTER TABLE venta_medicamento DROP CONSTRAINT IF EXISTS venta_medicamento_idventa_fkey;

-- 2. Agregar constraint con ON DELETE CASCADE
-- Si se elimina una venta, sus detalles también se eliminan automáticamente
ALTER TABLE venta_medicamento 
ADD CONSTRAINT venta_medicamento_idventa_fkey 
FOREIGN KEY (idventa) REFERENCES venta(idventa) ON DELETE CASCADE;

-- Esto asegura integridad referencial: no quedan detalles huérfanos
