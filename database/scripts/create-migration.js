#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

class MigrationCreator {
    constructor() {
        this.migrationsDir = path.join(__dirname, '../migrations');
        this.rollbacksDir = path.join(__dirname, '../rollbacks');
    }

    getNextVersion() {
        const migrations = fs.readdirSync(this.migrationsDir)
            .filter(file => file.endsWith('.sql') && file !== '000_create_migration_table.sql')
            .map(file => parseInt(file.split('_')[0]))
            .filter(num => !isNaN(num))
            .sort((a, b) => a - b);

        const lastVersion = migrations.length > 0 ? migrations[migrations.length - 1] : 0;
        return String(lastVersion + 1).padStart(3, '0');
    }

    sanitizeDescription(description) {
        return description
            .toLowerCase()
            .replace(/[^a-z0-9\s]/g, '')
            .replace(/\s+/g, '_')
            .substring(0, 50);
    }

    createMigrationTemplate(version, description) {
        const date = new Date().toISOString().split('T')[0];
        
        return `-- Migration: ${version}_${description}
-- Description: ${description.replace(/_/g, ' ')}
-- Date: ${date}
-- Author: PharmaCenter Team

-- ============================================
-- MIGRATION UP
-- ============================================

-- Agregar tus cambios de esquema aquí
-- Ejemplo:
-- CREATE TABLE nueva_tabla (
--     id SERIAL PRIMARY KEY,
--     nombre VARCHAR(100) NOT NULL,
--     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
-- );

-- ALTER TABLE tabla_existente 
-- ADD COLUMN nueva_columna VARCHAR(50);

-- CREATE INDEX idx_nueva_tabla_nombre ON nueva_tabla(nombre);

-- ============================================
-- NOTAS
-- ============================================
-- Recuerda:
-- 1. Crear el archivo de rollback correspondiente
-- 2. Probar la migración en entorno de desarrollo
-- 3. Verificar que los cambios sean compatibles hacia atrás si es posible
-- 4. Documentar cualquier cambio que afecte la aplicación

-- Insertar registro de migración
INSERT INTO schema_migrations (version, description, checksum, rollback_file) 
VALUES ('${version}', '${description.replace(/_/g, ' ')}', 'pendiente', '${version}_rollback_${description}.sql')
ON CONFLICT (version) DO NOTHING;`;
    }

    createRollbackTemplate(version, description) {
        const date = new Date().toISOString().split('T')[0];
        
        return `-- Rollback: ${version}_${description}
-- Description: Rollback for ${description.replace(/_/g, ' ')}
-- Date: ${date}
-- Author: PharmaCenter Team

-- ============================================
-- ROLLBACK (REVERTIR CAMBIOS)
-- ============================================

-- Revertir los cambios de la migración ${version}
-- IMPORTANTE: Escribir estos comandos en orden INVERSO a la migración

-- Ejemplo (inverso de la migración):
-- DROP INDEX IF EXISTS idx_nueva_tabla_nombre;
-- ALTER TABLE tabla_existente DROP COLUMN IF EXISTS nueva_columna;
-- DROP TABLE IF EXISTS nueva_tabla;

-- ============================================
-- NOTAS DE ROLLBACK
-- ============================================
-- ATENCIÓN:
-- 1. Este rollback puede causar pérdida de datos
-- 2. Asegúrate de hacer backup antes de ejecutar
-- 3. Verificar dependencias antes de eliminar objetos
-- 4. Testear el rollback en entorno de desarrollo

-- Remover registro de migración (esto se hace automáticamente por el script)`;
    }

    create(description) {
        if (!description) {
            console.error('❌ Error: Debes proporcionar una descripción para la migración');
            console.log('Uso: npm run migrate:create "descripcion_de_la_migracion"');
            process.exit(1);
        }

        const version = this.getNextVersion();
        const sanitizedDescription = this.sanitizeDescription(description);
        const migrationFileName = `${version}_${sanitizedDescription}.sql`;
        const rollbackFileName = `${version}_rollback_${sanitizedDescription}.sql`;

        // Crear archivo de migración
        const migrationPath = path.join(this.migrationsDir, migrationFileName);
        const migrationContent = this.createMigrationTemplate(version, sanitizedDescription);
        fs.writeFileSync(migrationPath, migrationContent);

        // Crear archivo de rollback
        const rollbackPath = path.join(this.rollbacksDir, rollbackFileName);
        const rollbackContent = this.createRollbackTemplate(version, sanitizedDescription);
        fs.writeFileSync(rollbackPath, rollbackContent);

        console.log('✅ Migración creada exitosamente:');
        console.log(`   📄 Migración: ${migrationFileName}`);
        console.log(`   🔄 Rollback: ${rollbackFileName}`);
        console.log('');
        console.log('📝 Próximos pasos:');
        console.log('   1. Editar el archivo de migración con tus cambios SQL');
        console.log('   2. Editar el archivo de rollback con los comandos inversos');
        console.log('   3. Probar la migración: npm run migrate:up');
        console.log('   4. Si hay errores, hacer rollback: npm run migrate:down');
    }
}

// Obtener la descripción del argumento de línea de comandos
const description = process.argv[2];
const creator = new MigrationCreator();
creator.create(description);