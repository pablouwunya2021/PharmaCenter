-- Migration: 008_fix_usuario_admin_definitivo
-- Description: Crear usuario administrador único y funcional para el sistema
-- Date: 2025-10-15
-- Author: PharmaCenter Team
-- Reason: Resolver problemas con usuario admin y garantizar funcionamiento

-- ============================================
-- MIGRATION UP - FIX USUARIO ADMIN
-- ============================================

BEGIN;

-- 1. Crear función para validar admin único si no existe
CREATE OR REPLACE FUNCTION validar_admin_unico()
RETURNS TRIGGER AS $$
BEGIN
    -- Si se está insertando/actualizando un rol admin
    IF NEW.rol = 'admin' THEN
        -- Verificar que no existe otro admin diferente al que se está insertando/actualizando
        IF EXISTS (
            SELECT 1 FROM Usuario 
            WHERE rol = 'admin' 
            AND (TG_OP = 'INSERT' OR idusuario != NEW.idusuario)
            AND correo != 'admin@pharmacenter.com'
        ) THEN
            RAISE EXCEPTION 'Solo puede existir un usuario administrador del sistema';
        END IF;
        
        -- Si es el admin del sistema, normalizar datos
        IF NEW.correo = 'admin@pharmacenter.com' THEN
            NEW.nombre := 'Administrador Sistema';
        END IF;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 2. Crear trigger para validación si no existe
DROP TRIGGER IF EXISTS trigger_validar_admin_unico ON Usuario;
CREATE TRIGGER trigger_validar_admin_unico
    BEFORE INSERT OR UPDATE ON Usuario
    FOR EACH ROW
    EXECUTE FUNCTION validar_admin_unico();

-- 3. Limpiar usuarios admin problemáticos (mantener datos de otros usuarios)
-- Eliminar cualquier admin que pueda tener problemas
DELETE FROM Usuario 
WHERE rol = 'admin' 
   OR correo = 'admin@pharmacenter.com'
   OR correo LIKE '%admin%';

-- 4. Insertar usuario administrador con contraseña temporal
-- Esta será hasheada por tu script hashExistingPasswords()
INSERT INTO Usuario (nombre, correo, contrasena, rol) VALUES (
    'Administrador Sistema',
    'admin@pharmacenter.com',
    'admin123',  -- Contraseña temporal que será hasheada
    'admin'
);

-- 5. Crear función para verificar estado del admin
CREATE OR REPLACE FUNCTION verificar_admin_status()
RETURNS TABLE (
    admin_id INTEGER,
    admin_nombre VARCHAR,
    admin_correo VARCHAR,
    password_length INTEGER,
    password_status TEXT,
    total_admins BIGINT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        u.idusuario,
        u.nombre,
        u.correo,
        LENGTH(u.contrasena),
        CASE 
            WHEN LENGTH(u.contrasena) < 50 THEN 'NECESITA_HASH'
            WHEN u.contrasena LIKE '$2a$%' THEN 'HASH_BCRYPT_VALIDO'
            WHEN u.contrasena LIKE '$2b$%' THEN 'HASH_BCRYPT_VALIDO'
            ELSE 'HASH_PRESENTE_VERIFICAR'
        END,
        (SELECT COUNT(*) FROM Usuario WHERE rol = 'admin')
    FROM Usuario u
    WHERE u.rol = 'admin'
    ORDER BY u.idusuario;
END;
$$ LANGUAGE plpgsql;

-- 6. Crear vista para monitoreo fácil
CREATE OR REPLACE VIEW v_admin_status AS
SELECT 
    'ADMIN_STATUS' as check_type,
    idusuario as admin_id,
    nombre as admin_name,
    correo as admin_email,
    LENGTH(contrasena) as password_length,
    CASE 
        WHEN LENGTH(contrasena) < 50 THEN 'PENDIENTE: Ejecutar hashExistingPasswords()'
        WHEN contrasena LIKE '$2a$%' THEN 'OK: Hash bcrypt válido'
        WHEN contrasena LIKE '$2b$%' THEN 'OK: Hash bcrypt válido'
        ELSE 'REVISAR: Hash presente pero formato desconocido'
    END as status,
    CURRENT_TIMESTAMP as verificado_en
FROM Usuario 
WHERE rol = 'admin';

-- 7. Verificación inmediata
DO $$
DECLARE
    admin_record RECORD;
    admin_count INTEGER;
BEGIN
    -- Contar usuarios admin
    SELECT COUNT(*) INTO admin_count FROM Usuario WHERE rol = 'admin';
    
    RAISE NOTICE '==========================================';
    RAISE NOTICE 'RESULTADO DE MIGRACIÓN 008';
    RAISE NOTICE '==========================================';
    
    IF admin_count = 0 THEN
        RAISE EXCEPTION 'ERROR: No se creó el usuario administrador';
    ELSIF admin_count > 1 THEN
        RAISE WARNING 'ADVERTENCIA: Múltiples usuarios admin detectados';
    END IF;
    
    -- Obtener información del admin
    SELECT * INTO admin_record FROM verificar_admin_status() LIMIT 1;
    
    RAISE NOTICE 'Admin ID: %', admin_record.admin_id;
    RAISE NOTICE 'Admin Email: %', admin_record.admin_correo;
    RAISE NOTICE 'Estado contraseña: %', admin_record.password_status;
    RAISE NOTICE 'Total admins: %', admin_record.total_admins;
    
    IF admin_record.password_status = 'NECESITA_HASH' THEN
        RAISE NOTICE '==========================================';
        RAISE NOTICE 'SIGUIENTE PASO REQUERIDO:';
        RAISE NOTICE 'Ejecutar tu script: hashExistingPasswords()';
        RAISE NOTICE 'Credenciales temporales:';
        RAISE NOTICE 'Email: admin@pharmacenter.com';
        RAISE NOTICE 'Password: admin123';
        RAISE NOTICE '==========================================';
    ELSE
        RAISE NOTICE '==========================================';
        RAISE NOTICE 'MIGRACIÓN COMPLETA: Admin listo para usar';
        RAISE NOTICE '==========================================';
    END IF;
END $$;

COMMIT;

-- Insertar registro de migración
INSERT INTO schema_migrations (version, description, checksum, rollback_file) 
VALUES ('008', 'fix usuario admin definitivo', 'admin_fix_2025', '008_rollback_fix_usuario_admin_definitivo.sql')
ON CONFLICT (version) DO NOTHING;