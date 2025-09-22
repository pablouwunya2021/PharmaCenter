-- Migration: 001_initial_schema
-- Description: Esquema inicial de PharmaCenter con todas las tablas existentes
-- Date: 2025-09-22
-- Author: PharmaCenter Team

-- ============================================
-- MIGRATION UP - ESQUEMA INICIAL
-- ============================================

-- Tabla de usuarios
CREATE TABLE IF NOT EXISTS usuarios (
    idusuario SERIAL PRIMARY KEY,
    nombreusuario VARCHAR(50) UNIQUE NOT NULL,
    contrasena VARCHAR(255) NOT NULL,
    rol VARCHAR(20) NOT NULL CHECK (rol IN ('admin', 'empleado')),
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    telefono VARCHAR(15),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de medicamentos
CREATE TABLE IF NOT EXISTS medicamentos (
    idmedicamento SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    cantidadinventario INTEGER NOT NULL DEFAULT 0,
    fechavencimiento DATE NOT NULL,
    precio DECIMAL(10,2) NOT NULL,
    costo DECIMAL(10,2) NOT NULL,
    proveedor VARCHAR(100) NOT NULL,
    imagenurl TEXT,
    umbral_minimo INTEGER DEFAULT 10,
    descripcion TEXT,
    categoria VARCHAR(50),
    ubicacion VARCHAR(50),
    codigo_barras VARCHAR(50) UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de clientes
CREATE TABLE IF NOT EXISTS clientes (
    idcliente SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    telefono VARCHAR(15),
    email VARCHAR(100),
    direccion TEXT,
    fecha_nacimiento DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de ventas
CREATE TABLE IF NOT EXISTS ventas (
    idventa SERIAL PRIMARY KEY,
    idcliente INTEGER REFERENCES clientes(idcliente),
    idusuario INTEGER REFERENCES usuarios(idusuario) NOT NULL,
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    total DECIMAL(10,2) NOT NULL,
    metodo_pago VARCHAR(20) DEFAULT 'efectivo' CHECK (metodo_pago IN ('efectivo', 'tarjeta', 'transferencia')),
    estado VARCHAR(20) DEFAULT 'completada' CHECK (estado IN ('pendiente', 'completada', 'cancelada')),
    descuento DECIMAL(10,2) DEFAULT 0,
    impuestos DECIMAL(10,2) DEFAULT 0,
    notas TEXT
);

-- Tabla de detalles de venta
CREATE TABLE IF NOT EXISTS detalleventas (
    iddetalleventa SERIAL PRIMARY KEY,
    idventa INTEGER REFERENCES ventas(idventa) ON DELETE CASCADE,
    idmedicamento INTEGER REFERENCES medicamentos(idmedicamento),
    cantidad INTEGER NOT NULL,
    precio_unitario DECIMAL(10,2) NOT NULL,
    subtotal DECIMAL(10,2) NOT NULL,
    descuento_item DECIMAL(10,2) DEFAULT 0
);

-- Tabla de proveedores
CREATE TABLE IF NOT EXISTS proveedores (
    idproveedor SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    contacto VARCHAR(100),
    telefono VARCHAR(15),
    email VARCHAR(100),
    direccion TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de compras a proveedores
CREATE TABLE IF NOT EXISTS compras (
    idcompra SERIAL PRIMARY KEY,
    idproveedor INTEGER REFERENCES proveedores(idproveedor),
    idusuario INTEGER REFERENCES usuarios(idusuario) NOT NULL,
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    total DECIMAL(10,2) NOT NULL,
    estado VARCHAR(20) DEFAULT 'pendiente' CHECK (estado IN ('pendiente', 'recibida', 'cancelada')),
    numero_factura VARCHAR(50),
    notas TEXT
);

-- Tabla de detalles de compra
CREATE TABLE IF NOT EXISTS detallecompras (
    iddetallecompra SERIAL PRIMARY KEY,
    idcompra INTEGER REFERENCES compras(idcompra) ON DELETE CASCADE,
    idmedicamento INTEGER REFERENCES medicamentos(idmedicamento),
    cantidad INTEGER NOT NULL,
    costo_unitario DECIMAL(10,2) NOT NULL,
    subtotal DECIMAL(10,2) NOT NULL
);

-- ============================================
-- ÍNDICES PARA OPTIMIZACIÓN
-- ============================================

-- Índices para búsquedas frecuentes
CREATE INDEX IF NOT EXISTS idx_medicamentos_nombre ON medicamentos(nombre);
CREATE INDEX IF NOT EXISTS idx_medicamentos_categoria ON medicamentos(categoria);
CREATE INDEX IF NOT EXISTS idx_medicamentos_vencimiento ON medicamentos(fechavencimiento);
CREATE INDEX IF NOT EXISTS idx_medicamentos_inventario ON medicamentos(cantidadinventario);

CREATE INDEX IF NOT EXISTS idx_ventas_fecha ON ventas(fecha);
CREATE INDEX IF NOT EXISTS idx_ventas_cliente ON ventas(idcliente);
CREATE INDEX IF NOT EXISTS idx_ventas_usuario ON ventas(idusuario);

CREATE INDEX IF NOT EXISTS idx_clientes_nombre ON clientes(nombre, apellido);
CREATE INDEX IF NOT EXISTS idx_clientes_telefono ON clientes(telefono);

CREATE INDEX IF NOT EXISTS idx_usuarios_username ON usuarios(nombreusuario);
CREATE INDEX IF NOT EXISTS idx_usuarios_email ON usuarios(email);

CREATE INDEX IF NOT EXISTS idx_compras_fecha ON compras(fecha);
CREATE INDEX IF NOT EXISTS idx_compras_proveedor ON compras(idproveedor);

-- ============================================
-- TRIGGERS PARA AUDIT TRAIL
-- ============================================

-- Función para actualizar timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers para actualizar updated_at
CREATE TRIGGER update_usuarios_updated_at BEFORE UPDATE ON usuarios
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_medicamentos_updated_at BEFORE UPDATE ON medicamentos
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_clientes_updated_at BEFORE UPDATE ON clientes
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_proveedores_updated_at BEFORE UPDATE ON proveedores
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- COMENTARIOS DE DOCUMENTACIÓN
-- ============================================

COMMENT ON TABLE usuarios IS 'Tabla de usuarios del sistema (administradores y empleados)';
COMMENT ON TABLE medicamentos IS 'Catálogo de medicamentos con inventario y precios';
COMMENT ON TABLE clientes IS 'Registro de clientes de la farmacia';
COMMENT ON TABLE ventas IS 'Registro de ventas realizadas';
COMMENT ON TABLE detalleventas IS 'Detalle de productos vendidos en cada venta';
COMMENT ON TABLE proveedores IS 'Catálogo de proveedores de medicamentos';
COMMENT ON TABLE compras IS 'Registro de compras a proveedores';
COMMENT ON TABLE detallecompras IS 'Detalle de productos comprados a proveedores';

-- Insertar registro de migración
INSERT INTO schema_migrations (version, description, checksum, rollback_file) 
VALUES ('001', 'initial schema', 'abc123def456', '001_rollback_initial_schema.sql')
ON CONFLICT (version) DO NOTHING;