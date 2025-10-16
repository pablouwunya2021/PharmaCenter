-- Migration: 012_mejorar_restricciones_venta_usuario
-- Description: Cambiar restricción de borrado de Usuario en Venta a RESTRICT
-- Date: 2025-10-15
-- Author: PharmaCenter Team

-- ============================================
-- MIGRATION UP - PROTEGER USUARIO CON VENTAS
-- ============================================

-- 1. Eliminar constraint existente
ALTER TABLE venta DROP CONSTRAINT IF EXISTS venta_idusuario_fkey;

-- 2. Agregar constraint con ON DELETE RESTRICT
-- Esto evita borrar usuarios que tienen ventas registradas
ALTER TABLE venta 
ADD CONSTRAINT venta_idusuario_fkey 
FOREIGN KEY (idusuario) REFERENCES usuario(idusuario) ON DELETE RESTRICT;

-- Ahora no se puede eliminar un usuario si tiene ventas asociadas
