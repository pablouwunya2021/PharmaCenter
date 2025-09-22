#!/usr/bin/env node

const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

// Configuración de la base de datos
const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5433,
    database: process.env.DB_NAME || 'pharmacenter_db',
    user: process.env.DB_USER || 'pharma_user',
    password: process.env.DB_PASSWORD || 'pharma_password123'
};

class RollbackRunner {
    constructor() {
        this.client = new Client(dbConfig);
        this.rollbacksDir = path.join(__dirname, '../rollbacks');
    }

    async connect() {
        try {
            await this.client.connect();
            console.log('✅ Conectado a la base de datos');
        } catch (error) {
            console.error('❌ Error conectando a la base de datos:', error.message);
            process.exit(1);
        }
    }

    async disconnect() {
        await this.client.end();
        console.log('🔌 Desconectado de la base de datos');
    }

    async getLastMigration() {
        try {
            const result = await this.client.query(
                'SELECT version, description, rollback_file FROM schema_migrations ORDER BY executed_at DESC LIMIT 1'
            );
            return result.rows[0] || null;
        } catch (error) {
            console.error('❌ Error obteniendo última migración:', error.message);
            return null;
        }
    }

    async executeRollback(version, rollbackFile, description) {
        const rollbackPath = path.join(this.rollbacksDir, rollbackFile);
        
        if (!fs.existsSync(rollbackPath)) {
            console.error(`❌ Archivo de rollback no encontrado: ${rollbackFile}`);
            return false;
        }

        const content = fs.readFileSync(rollbackPath, 'utf-8');
        
        try {
            await this.client.query('BEGIN');
            
            // Ejecutar el rollback
            await this.client.query(content);
            
            // Remover de la tabla de control
            await this.client.query(
                'DELETE FROM schema_migrations WHERE version = $1',
                [version]
            );
            
            await this.client.query('COMMIT');
            
            console.log(`✅ Rollback ${version} ejecutado: ${description}`);
            return true;
        } catch (error) {
            await this.client.query('ROLLBACK');
            console.error(`❌ Error ejecutando rollback ${version}:`, error.message);
            return false;
        }
    }

    async rollbackLast() {
        await this.connect();
        
        const lastMigration = await this.getLastMigration();
        
        if (!lastMigration) {
            console.log('ℹ️ No hay migraciones para hacer rollback');
            await this.disconnect();
            return;
        }

        console.log(`🔄 Haciendo rollback de la migración: ${lastMigration.version} - ${lastMigration.description}`);
        
        const success = await this.executeRollback(
            lastMigration.version,
            lastMigration.rollback_file,
            lastMigration.description
        );
        
        if (success) {
            console.log('✨ Rollback completado exitosamente');
        } else {
            console.log('❌ Rollback falló');
        }
        
        await this.disconnect();
    }

    async rollbackTo(targetVersion) {
        await this.connect();
        
        const result = await this.client.query(
            'SELECT version, description, rollback_file FROM schema_migrations WHERE version > $1 ORDER BY executed_at DESC',
            [targetVersion]
        );
        
        const migrationsToRollback = result.rows;
        
        if (migrationsToRollback.length === 0) {
            console.log(`ℹ️ No hay migraciones después de la versión ${targetVersion} para hacer rollback`);
            await this.disconnect();
            return;
        }

        console.log(`🔄 Haciendo rollback de ${migrationsToRollback.length} migración(es)...`);
        
        for (const migration of migrationsToRollback) {
            const success = await this.executeRollback(
                migration.version,
                migration.rollback_file,
                migration.description
            );
            
            if (!success) {
                console.log('⏹️ Proceso de rollback detenido debido a errores');
                break;
            }
        }
        
        await this.disconnect();
    }
}

// Ejecutar según el comando
const command = process.argv[2] || 'last';
const runner = new RollbackRunner();

if (command === 'to' && process.argv[3]) {
    runner.rollbackTo(process.argv[3]);
} else {
    runner.rollbackLast();
}