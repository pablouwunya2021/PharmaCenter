-- Rollback: 008_fix_usuario_admin_definitivo
-- Description: Rollback para migración de fix usuario admin
-- Date: 2025-10-15
-- Author: PharmaCenter Team

-- ============================================
-- ROLLBACK - REVERTIR FIX USUARIO ADMIN
-- ============================================

BEGIN;

-- 1. Eliminar vista de monitoreo
DROP VIEW IF EXISTS v_admin_status;

-- 2. Eliminar función de verificación
DROP FUNCTION IF EXISTS verificar_admin_status();

-- 3. Eliminar trigger
DROP TRIGGER IF EXISTS trigger_validar_admin_unico ON Usuario;

-- 4. Eliminar función de validación
DROP FUNCTION IF EXISTS validar_admin_unico();

-- 5. Eliminar usuario admin creado por esta migración
DELETE FROM Usuario WHERE correo = 'admin@pharmacenter.com';

-- 6. Verificar rollback
DO $$
DECLARE
    admin_count INTEGER;
    function_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO admin_count FROM Usuario WHERE rol = 'admin';
    
    SELECT COUNT(*) INTO function_count 
    FROM pg_proc 
    WHERE proname IN ('validar_admin_unico', 'verificar_admin_status');
    
    RAISE NOTICE '==========================================';
    RAISE NOTICE 'RESULTADO DEL ROLLBACK 008';
    RAISE NOTICE '==========================================';
    RAISE NOTICE 'Usuarios admin restantes: %', admin_count;
    RAISE NOTICE 'Funciones eliminadas: %', function_count = 0;
    
    IF admin_count = 0 AND function_count = 0 THEN
        RAISE NOTICE 'ROLLBACK EXITOSO: Cambios revertidos completamente';
    ELSE
        RAISE WARNING 'ROLLBACK INCOMPLETO: Revisar manualmente';
    END IF;
    RAISE NOTICE '==========================================';
END $$;

COMMIT;

-- Nota: No eliminar el registro de schema_migrations aquí
-- El sistema de migraciones se encarga de eso automáticamente