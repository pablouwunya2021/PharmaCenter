-- Migration: 014_agregar_usuario_a_notificacion
-- Description: Conectar notificaciones con usuarios específicos
-- Date: 2025-10-15
-- Author: PharmaCenter Team

-- ============================================
-- MIGRATION UP - RELACIONAR NOTIFICACION CON USUARIO
-- ============================================

-- 1. Agregar columna idusuario (nullable para notificaciones globales)
ALTER TABLE notificacion 
ADD COLUMN idusuario INT;

-- 2. Agregar clave foránea con CASCADE
-- Si se elimina un usuario, sus notificaciones también se eliminan
ALTER TABLE notificacion 
ADD CONSTRAINT fk_notificacion_usuario 
FOREIGN KEY (idusuario) REFERENCES usuario(idusuario) ON DELETE CASCADE;

-- Nota: idusuario NULL = notificación global para todos los usuarios
-- idusuario específico = notificación para ese usuario solamente
