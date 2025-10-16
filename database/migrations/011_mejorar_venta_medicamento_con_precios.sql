-- Migration: 011_mejorar_venta_medicamento_con_precios
-- Description: Agregar precio unitario y subtotal a detalle de venta
-- Date: 2025-10-15
-- Author: PharmaCenter Team

-- ============================================
-- MIGRATION UP - AGREGAR PRECIOS A DETALLE DE VENTA
-- ============================================

-- 1. Agregar columna precio_unitario
ALTER TABLE venta_medicamento 
ADD COLUMN precio_unitario DECIMAL(10,2);

-- 2. Poblar precio_unitario con el precio actual del medicamento
UPDATE venta_medicamento vm
SET precio_unitario = (
  SELECT precio FROM medicamento WHERE idmedicamento = vm.idmedicamento
);

-- 3. Hacer NOT NULL la columna
ALTER TABLE venta_medicamento 
ALTER COLUMN precio_unitario SET NOT NULL;

-- 4. Agregar columna subtotal calculada
ALTER TABLE venta_medicamento 
ADD COLUMN subtotal DECIMAL(10,2) GENERATED ALWAYS AS (cantidad * precio_unitario) STORED;

-- Nota: Ahora guardamos el precio al momento de la venta, 
-- no dependemos del precio actual del medicamento
