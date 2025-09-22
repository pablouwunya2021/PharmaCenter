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

class SeedRunner {
    constructor() {
        this.client = new Client(dbConfig);
        this.seedsDir = path.join(__dirname, '../seeds');
    }

    async connect() {
        try {
            await this.client.connect();
            console.log('✅ Conectado a la base de datos para seeds');
        } catch (error) {
            console.error('❌ Error conectando a la base de datos:', error.message);
            process.exit(1);
        }
    }

    async disconnect() {
        await this.client.end();
        console.log('🔌 Desconectado de la base de datos');
    }

    async runSeeds() {
        await this.connect();
        
        const seedFiles = fs.readdirSync(this.seedsDir)
            .filter(file => file.endsWith('.sql'))
            .sort();

        if (seedFiles.length === 0) {
            console.log('ℹ️ No hay archivos de seed para ejecutar');
            await this.disconnect();
            return;
        }

        console.log(`🌱 Ejecutando ${seedFiles.length} archivo(s) de seed...`);
        
        for (const seedFile of seedFiles) {
            await this.executeSeed(seedFile);
        }
        
        console.log('✨ Seeds ejecutados exitosamente');
        await this.disconnect();
    }

    async executeSeed(seedFile) {
        const seedPath = path.join(this.seedsDir, seedFile);
        const content = fs.readFileSync(seedPath, 'utf-8');
        
        try {
            await this.client.query(content);
            console.log(`✅ Seed ejecutado: ${seedFile}`);
        } catch (error) {
            console.error(`❌ Error ejecutando seed ${seedFile}:`, error.message);
        }
    }
}

const runner = new SeedRunner();
runner.runSeeds();