#!/usr/bin/env node

const { Client } = require('pg');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// Configuración de la base de datos
const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5433,
    database: process.env.DB_NAME || 'pharmacenter_db',
    user: process.env.DB_USER || 'pharma_user',
    password: process.env.DB_PASSWORD || 'pharma_password123'
};

class MigrationRunner {
    constructor() {
        this.client = new Client(dbConfig);
        this.migrationsDir = path.join(__dirname, '../migrations');
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

    calculateChecksum(content) {
        return crypto.createHash('sha256').update(content).digest('hex').substring(0, 16);
    }

    async ensureMigrationTable() {
        const migrationTableScript = path.join(this.migrationsDir, '000_create_migration_table.sql');
        
        if (fs.existsSync(migrationTableScript)) {
            const content = fs.readFileSync(migrationTableScript, 'utf-8');
            await this.client.query(content);
            console.log('📋 Tabla de migraciones inicializada');
        }
    }

    async getExecutedMigrations() {
        try {
            const result = await this.client.query(
                'SELECT version FROM schema_migrations ORDER BY version'
            );
            return result.rows.map(row => row.version);
        } catch (error) {
            return []; // La tabla no existe aún
        }
    }

    async getPendingMigrations() {
        const executedMigrations = await this.getExecutedMigrations();
        const allMigrations = fs.readdirSync(this.migrationsDir)
            .filter(file => file.endsWith('.sql') && file !== '000_create_migration_table.sql')
            .sort();

        return allMigrations.filter(file => {
            const version = file.split('_')[0];
            return !executedMigrations.includes(version);
        });
    }

    async executeMigration(migrationFile) {
        const migrationPath = path.join(this.migrationsDir, migrationFile);
        const content = fs.readFileSync(migrationPath, 'utf-8');
        const version = migrationFile.split('_')[0];
        const description = migrationFile.replace(/^\d+_/, '').replace(/\.sql$/, '').replace(/_/g, ' ');
        const checksum = this.calculateChecksum(content);
        
        const startTime = Date.now();
        
        try {
            await this.client.query('BEGIN');
            
            // Ejecutar la migración
            await this.client.query(content);
            
            // Registrar en la tabla de control
            const rollbackFile = `${version}_rollback_${description.replace(/\s+/g, '_')}.sql`;
            await this.client.query(
                `INSERT INTO schema_migrations (version, description, checksum, execution_time_ms, rollback_file) 
                 VALUES ($1, $2, $3, $4, $5)`,
                [version, description, checksum, Date.now() - startTime, rollbackFile]
            );
            
            await this.client.query('COMMIT');
            
            console.log(`✅ Migración ${version} ejecutada: ${description}`);
            return true;
        } catch (error) {
            await this.client.query('ROLLBACK');
            console.error(`❌ Error ejecutando migración ${version}:`, error.message);
            return false;
        }
    }

    async run() {
        await this.connect();
        await this.ensureMigrationTable();
        
        const pendingMigrations = await this.getPendingMigrations();
        
        if (pendingMigrations.length === 0) {
            console.log('✨ No hay migraciones pendientes');
            await this.disconnect();
            return;
        }

        console.log(`🔄 Ejecutando ${pendingMigrations.length} migración(es) pendiente(s)...`);
        
        for (const migration of pendingMigrations) {
            const success = await this.executeMigration(migration);
            if (!success) {
                console.log('⏹️ Proceso de migración detenido debido a errores');
                break;
            }
        }
        
        await this.disconnect();
    }

    async status() {
        await this.connect();
        await this.ensureMigrationTable();
        
        const executedMigrations = await this.getExecutedMigrations();
        const pendingMigrations = await this.getPendingMigrations();
        
        console.log('\n📊 Estado de Migraciones:');
        console.log(`✅ Ejecutadas: ${executedMigrations.length}`);
        console.log(`⏳ Pendientes: ${pendingMigrations.length}`);
        
        if (pendingMigrations.length > 0) {
            console.log('\n📋 Migraciones pendientes:');
            pendingMigrations.forEach(migration => {
                const version = migration.split('_')[0];
                const description = migration.replace(/^\d+_/, '').replace(/\.sql$/, '');
                console.log(`  - ${version}: ${description}`);
            });
        }
        
        await this.disconnect();
    }
}

// Ejecutar según el comando
const command = process.argv[2] || 'run';
const runner = new MigrationRunner();

if (command === 'status') {
    runner.status();
} else {
    runner.run();
}