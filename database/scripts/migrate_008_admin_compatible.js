const { Pool } = require('pg');
const fs = require('fs').promises;
const path = require('path');
const bcrypt = require('bcryptjs');
require('dotenv').config();

/**
 * Script compatible con el sistema de migraciones existente
 * Versión 008: Fix usuario admin definitivo
 */

const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5433,
    database: process.env.DB_NAME || 'pharmacenter_db',
    user: process.env.DB_USER || 'pharma_user',
    password: process.env.DB_PASSWORD || 'pharma_password123',
};

const pool = new Pool(dbConfig);

// Función para verificar si una migración ya fue ejecutada
async function isMigrationExecuted(client, version) {
    const result = await client.query(
        'SELECT version FROM schema_migrations WHERE version = $1',
        [version]
    );
    return result.rows.length > 0;
}

// Función para obtener la próxima versión disponible
async function getNextVersion(client) {
    const result = await client.query(
        'SELECT version FROM schema_migrations ORDER BY version DESC LIMIT 1'
    );
    
    if (result.rows.length === 0) {
        return '001';
    }
    
    const lastVersion = result.rows[0].version;
    const nextNum = parseInt(lastVersion) + 1;
    return String(nextNum).padStart(3, '0');
}

// Migración principal
async function runCompatibleAdminMigration() {
    const client = await pool.connect();
    
    try {
        console.log('🔄 MIGRACIÓN COMPATIBLE CON TU SISTEMA EXISTENTE');
        console.log('═══════════════════════════════════════════════\n');
        
        // 1. Verificar sistema de migraciones existente
        const tableExists = await client.query(`
            SELECT EXISTS (
                SELECT FROM information_schema.tables 
                WHERE table_schema = 'public' 
                AND table_name = 'schema_migrations'
            );
        `);
        
        if (!tableExists.rows[0].exists) {
            throw new Error('Tabla schema_migrations no encontrada. Ejecuta primero las migraciones base.');
        }
        
        console.log('✅ Sistema de migraciones detectado\n');
        
        // 2. Determinar versión a usar
        const targetVersion = '008';
        
        if (await isMigrationExecuted(client, targetVersion)) {
            console.log(`⚠️  Migración ${targetVersion} ya ejecutada. ¿Re-ejecutar?`);
            console.log('🔄 Procediendo con re-ejecución...\n');
        }
        
        // 3. Mostrar estado actual
        console.log('📊 Estado actual del sistema:');
        const currentUsers = await client.query(`
            SELECT COUNT(*) as total, 
                   COUNT(CASE WHEN rol = 'admin' THEN 1 END) as admins
            FROM Usuario
        `);
        
        console.log(`   - Total usuarios: ${currentUsers.rows[0].total}`);
        console.log(`   - Usuarios admin: ${currentUsers.rows[0].admins}\n`);
        
        // 4. Ejecutar migración
        console.log('📄 Ejecutando migración 008...');
        const startTime = Date.now();
        
        const migrationSQL = `
            BEGIN;
            
            -- Crear función de validación
            CREATE OR REPLACE FUNCTION validar_admin_unico()
            RETURNS TRIGGER AS $$
            BEGIN
                IF NEW.rol = 'admin' THEN
                    IF EXISTS (
                        SELECT 1 FROM Usuario 
                        WHERE rol = 'admin' 
                        AND (TG_OP = 'INSERT' OR idusuario != NEW.idusuario)
                        AND correo != 'admin@pharmacenter.com'
                    ) THEN
                        RAISE EXCEPTION 'Solo puede existir un usuario administrador del sistema';
                    END IF;
                    
                    IF NEW.correo = 'admin@pharmacenter.com' THEN
                        NEW.nombre := 'Administrador Sistema';
                    END IF;
                END IF;
                
                RETURN NEW;
            END;
            $$ LANGUAGE plpgsql;
            
            -- Crear trigger
            DROP TRIGGER IF EXISTS trigger_validar_admin_unico ON Usuario;
            CREATE TRIGGER trigger_validar_admin_unico
                BEFORE INSERT OR UPDATE ON Usuario
                FOR EACH ROW
                EXECUTE FUNCTION validar_admin_unico();
            
            -- Limpiar usuarios admin problemáticos
            DELETE FROM Usuario 
            WHERE rol = 'admin' 
               OR correo = 'admin@pharmacenter.com'
               OR correo LIKE '%admin%';
            
            -- Insertar nuevo admin
            INSERT INTO Usuario (nombre, correo, contrasena, rol) VALUES (
                'Administrador Sistema',
                'admin@pharmacenter.com',
                'admin123',
                'admin'
            );
            
            -- Crear función de verificación
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
            
            COMMIT;
        `;
        
        await client.query(migrationSQL);
        const executionTime = Date.now() - startTime;
        console.log(`✅ Migración ejecutada en ${executionTime}ms\n`);
        
        // 5. Registrar migración
        await client.query(`
            INSERT INTO schema_migrations (version, description, checksum, rollback_file) 
            VALUES ($1, $2, $3, $4)
            ON CONFLICT (version) DO UPDATE SET
                executed_at = CURRENT_TIMESTAMP,
                execution_time_ms = $5
        `, [
            targetVersion, 
            'fix usuario admin definitivo', 
            'admin_fix_compatible_2025',
            '008_rollback_fix_usuario_admin_definitivo.sql',
            executionTime
        ]);
        
        console.log('📝 Migración registrada en schema_migrations\n');
        
        // 6. Verificar resultado
        console.log('🔍 Verificando resultado...');
        const adminStatus = await client.query('SELECT * FROM verificar_admin_status()');
        
        if (adminStatus.rows.length === 0) {
            throw new Error('No se encontró usuario administrador después de la migración');
        }
        
        const admin = adminStatus.rows[0];
        console.log('👤 Usuario administrador creado:');
        console.log(`   - ID: ${admin.admin_id}`);
        console.log(`   - Nombre: ${admin.admin_nombre}`);
        console.log(`   - Email: ${admin.admin_correo}`);
        console.log(`   - Estado contraseña: ${admin.password_status}`);
        console.log(`   - Total admins: ${admin.total_admins}\n`);
        
        // 7. Aplicar hash si es necesario
        if (admin.password_status === 'NECESITA_HASH') {
            console.log('🔐 Aplicando hash bcrypt...');
            const hashedPassword = await bcrypt.hash('admin123', 10);
            
            await client.query(
                'UPDATE Usuario SET contrasena = $1 WHERE idusuario = $2',
                [hashedPassword, admin.admin_id]
            );
            
            console.log('✅ Hash aplicado correctamente\n');
        }
        
        // 8. Verificación final
        console.log('🧪 Verificación final...');
        const finalCheck = await client.query(`
            SELECT 
                idusuario,
                correo,
                LENGTH(contrasena) as hash_length,
                CASE 
                    WHEN LENGTH(contrasena) >= 50 THEN 'Hash válido'
                    ELSE 'Problema con hash'
                END as final_status
            FROM Usuario 
            WHERE rol = 'admin'
        `);
        
        const finalAdmin = finalCheck.rows[0];
        console.log(`📊 Estado final: ${finalAdmin.final_status}`);
        console.log(`🔑 Hash length: ${finalAdmin.hash_length} caracteres\n`);
        
        // 9. Mostrar credenciales
        console.log('🎯 CREDENCIALES DE ADMINISTRADOR');
        console.log('═══════════════════════════════════════════════');
        console.log('📧 Email: admin@pharmacenter.com');
        console.log('🔑 Contraseña: admin123');
        console.log('👑 Rol: admin');
        console.log('✅ Estado: Listo para usar');
        console.log('═══════════════════════════════════════════════\n');
        
        console.log('🎉 MIGRACIÓN 008 COMPLETADA EXITOSAMENTE');
        console.log('Tu usuario administrador está configurado y listo.\n');
        
    } catch (error) {
        console.error('❌ Error durante la migración:', error.message);
        throw error;
    } finally {
        client.release();
    }
}

// Función para verificar estado de migraciones
async function checkMigrationStatus() {
    const client = await pool.connect();
    
    try {
        console.log('📊 ESTADO DE TU SISTEMA DE MIGRACIONES');
        console.log('═══════════════════════════════════════════\n');
        
        // Mostrar migraciones ejecutadas
        const migrations = await client.query(`
            SELECT version, description, executed_at, execution_time_ms 
            FROM schema_migrations 
            ORDER BY version
        `);
        
        console.log('📋 Migraciones ejecutadas:');
        migrations.rows.forEach(migration => {
            console.log(`   ${migration.version}: ${migration.description}`);
            console.log(`      Ejecutada: ${migration.executed_at}`);
            if (migration.execution_time_ms) {
                console.log(`      Tiempo: ${migration.execution_time_ms}ms`);
            }
            console.log('');
        });
        
        // Estado del admin
        const adminCheck = await client.query(`
            SELECT 
                COUNT(*) as admin_count,
                STRING_AGG(correo, ', ') as admin_emails
            FROM Usuario WHERE rol = 'admin'
        `);
        
        console.log(`👑 Usuarios admin: ${adminCheck.rows[0].admin_count}`);
        if (adminCheck.rows[0].admin_emails) {
            console.log(`📧 Emails: ${adminCheck.rows[0].admin_emails}`);
        }
        
        // Verificar si la migración 008 existe
        const migration008 = await client.query(`
            SELECT * FROM schema_migrations WHERE version = '008'
        `);
        
        console.log(`\n🔧 Migración 008: ${migration008.rows.length > 0 ? 'EJECUTADA' : 'PENDIENTE'}`);
        
    } catch (error) {
        console.error('❌ Error verificando estado:', error.message);
    } finally {
        client.release();
    }
}

// Interfaz de línea de comandos
async function main() {
    const command = process.argv[2];
    
    try {
        switch (command) {
            case 'up':
            case 'migrate':
                await runCompatibleAdminMigration();
                break;
                
            case 'status':
                await checkMigrationStatus();
                break;
                
            default:
                console.log('🛠️  MIGRACIÓN 008 - USUARIO ADMIN COMPATIBLE');
                console.log('═══════════════════════════════════════════════\n');
                console.log('Compatible con tu sistema de migraciones existente');
                console.log('Versión objetivo: 008\n');
                console.log('Comandos disponibles:');
                console.log('  node migrate_008_admin_compatible.js up      - Ejecutar migración');
                console.log('  node migrate_008_admin_compatible.js status  - Ver estado\n');
                console.log('💡 Esta migración es compatible con tus migraciones 001-007');
                break;
        }
    } catch (error) {
        console.error('\n💥 Error fatal:', error.message);
        process.exit(1);
    } finally {
        await pool.end();
    }
}

// Ejecutar si es llamado directamente
if (require.main === module) {
    main();
}

module.exports = { runCompatibleAdminMigration, checkMigrationStatus };