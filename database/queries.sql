-- Consultas para explorar y modificar la base de datos PharmaCenter
-- Para ejecutar: selecciona la consulta y presiona Ctrl+Shift+E (o usa la extensión PostgreSQL)

-- 1. Ver todas las tablas
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public';

-- 2. Ver todos los medicamentos
SELECT * FROM medicamento ORDER BY nombre;

-- 3. Ver todos los usuarios
SELECT idusuario, nombre, correo, rol, fecha_registro 
FROM usuario ORDER BY fecha_registro DESC;

-- 4. Ver inventario con medicamentos próximos a vencer
SELECT nombre, cantidadinventario, fechavencimiento
FROM medicamento 
WHERE fechavencimiento <= CURRENT_DATE + INTERVAL '30 days'
ORDER BY fechavencimiento;

-- 5. Ver medicamentos con stock bajo (menos de 10)
SELECT nombre, cantidadinventario, proveedor
FROM medicamento 
WHERE cantidadinventario < 10;

-- 6. Agregar un nuevo medicamento (ejemplo)
INSERT INTO medicamento (nombre, cantidadinventario, fechavencimiento, precio, costo, proveedor, imagenurl)
VALUES ('Ibuprofeno', 50, '2026-06-30', 4.25, 2.50, 'Laboratorios XYZ', 'https://example.com/ibuprofeno.jpg');

-- 7. Actualizar stock de un medicamento
UPDATE medicamento 
SET cantidadinventario = cantidadinventario - 5
WHERE idmedicamento = 1;

-- 8. Ver estructura de una tabla específica
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'medicamento';

-- 9. Ver ventas del día actual
SELECT v.idventa, u.nombre as cliente, v.fechaventa, v.total
FROM venta v
JOIN usuario u ON v.idusuario = u.idusuario
WHERE DATE(v.fechaventa) = CURRENT_DATE;

-- 10. Eliminar un medicamento (cuidado con esta consulta)
-- DELETE FROM medicamento WHERE idmedicamento = ?;
