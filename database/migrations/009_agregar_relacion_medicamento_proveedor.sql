-- Migration: 009_agregar_relacion_medicamento_proveedor
-- Description: Conectar tabla medicamento con proveedores mediante clave foránea
-- Date: 2025-10-15
-- Author: PharmaCenter Team

-- ============================================
-- MIGRATION UP - RELACIONAR MEDICAMENTO CON PROVEEDORES
-- ============================================

-- 1. Agregar columna idproveedor a medicamento
ALTER TABLE medicamento 
ADD COLUMN idproveedor INT;

-- 2. Poblar proveedores si no existen
INSERT INTO proveedores (nombre, contacto, telefono, email, direccion) VALUES
  ('Farfasa', 'Contacto Farfasa', '2222-3333', 'ventas@farfasa.com', 'Ciudad de Guatemala'),
  ('Laboratorios Laprin', 'Contacto Laprin', '3333-4444', 'info@laprin.com', 'Zona 10, Guatemala'),
  ('Farmacéutica LANCO', 'Contacto LANCO', '4444-5555', 'contacto@lanco.com', 'Zona 12, Guatemala'),
  ('Distribuidora Almacén Farmacéutico S.A', 'Contacto DAF', '5555-6666', 'daf@farmaceutico.com', 'Mixco, Guatemala'),
  ('Laboratorios Vijosa', 'Contacto Vijosa', '6666-7777', 'ventas@vijosa.com', 'Villa Nueva, Guatemala')
ON CONFLICT DO NOTHING;

-- 3. Migrar datos: asignar idproveedor según el nombre del proveedor
UPDATE medicamento SET idproveedor = (
  SELECT idproveedor FROM proveedores WHERE nombre = 'Farfasa' LIMIT 1
) WHERE proveedor = 'Farfasa' OR proveedor = 'Farfas';

UPDATE medicamento SET idproveedor = (
  SELECT idproveedor FROM proveedores WHERE nombre = 'Laboratorios Laprin' LIMIT 1
) WHERE proveedor = 'Laboratorios Laprin';

UPDATE medicamento SET idproveedor = (
  SELECT idproveedor FROM proveedores WHERE nombre = 'Farmacéutica LANCO' LIMIT 1
) WHERE proveedor = 'Farmacéutica LANCO';

UPDATE medicamento SET idproveedor = (
  SELECT idproveedor FROM proveedores WHERE nombre = 'Distribuidora Almacén Farmacéutico S.A' LIMIT 1
) WHERE proveedor = 'Distribuidora Almacén Farmacéutico S.A';

UPDATE medicamento SET idproveedor = (
  SELECT idproveedor FROM proveedores WHERE nombre = 'Laboratorios Vijosa' LIMIT 1
) WHERE proveedor = 'Laboratorios Vijosa';

-- Asignar proveedor por defecto a medicamentos sin proveedor
UPDATE medicamento SET idproveedor = (
  SELECT idproveedor FROM proveedores LIMIT 1
) WHERE idproveedor IS NULL;

-- 4. Hacer la columna NOT NULL
ALTER TABLE medicamento 
ALTER COLUMN idproveedor SET NOT NULL;

-- 5. Agregar clave foránea con restricción
ALTER TABLE medicamento 
ADD CONSTRAINT fk_medicamento_proveedor 
FOREIGN KEY (idproveedor) REFERENCES proveedores(idproveedor) ON DELETE RESTRICT;

-- 6. Eliminar columna proveedor antigua (VARCHAR)
ALTER TABLE medicamento DROP COLUMN proveedor;
