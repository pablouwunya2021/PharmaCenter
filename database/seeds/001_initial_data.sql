-- Seeds para datos de prueba de PharmaCenter
-- Este archivo contiene datos de ejemplo para desarrollo y testing

-- Limpiar datos existentes (opcional, descomentar si necesitas reset completo)
-- TRUNCATE TABLE detalleventas, ventas, clientes, medicamentos, usuarios RESTART IDENTITY CASCADE;

-- ============================================
-- USUARIOS DE PRUEBA
-- ============================================

INSERT INTO usuarios (nombreusuario, contrasena, rol, nombre, apellido, email, telefono) VALUES
('admin', '$2b$10$rOvR5B2qQqJzWzr5gN9YLe4OQQJbJVQWzjN4YrN5qV6tT3xV9N7Wa', 'admin', 'Administrador', 'Sistema', 'admin@pharmacenter.com', '555-0001'),
('empleado1', '$2b$10$rOvR5B2qQqJzWzr5gN9YLe4OQQJbJVQWzjN4YrN5qV6tT3xV9N7Wa', 'empleado', 'Juan', 'Pérez', 'juan.perez@pharmacenter.com', '555-0002'),
('empleado2', '$2b$10$rOvR5B2qQqJzWzr5gN9YLe4OQQJbJVQWzjN4YrN5qV6tT3xV9N7Wa', 'empleado', 'María', 'González', 'maria.gonzalez@pharmacenter.com', '555-0003')
ON CONFLICT (nombreusuario) DO NOTHING;

-- ============================================
-- CLIENTES DE PRUEBA
-- ============================================

INSERT INTO clientes (nombre, apellido, telefono, email, direccion, fecha_nacimiento) VALUES
('Carlos', 'Rodríguez', '555-1001', 'carlos.rodriguez@email.com', 'Calle 123, Ciudad', '1985-03-15'),
('Ana', 'Martínez', '555-1002', 'ana.martinez@email.com', 'Avenida 456, Ciudad', '1990-07-22'),
('Luis', 'García', '555-1003', 'luis.garcia@email.com', 'Boulevard 789, Ciudad', '1978-11-08'),
('Carmen', 'López', '555-1004', 'carmen.lopez@email.com', 'Plaza 321, Ciudad', '1995-01-30'),
('Roberto', 'Hernández', '555-1005', 'roberto.hernandez@email.com', 'Callejón 654, Ciudad', '1982-09-12')
ON CONFLICT DO NOTHING;

-- ============================================
-- PROVEEDORES DE PRUEBA
-- ============================================

INSERT INTO proveedores (nombre, contacto, telefono, email, direccion) VALUES
('Farmacias Distribuidora Nacional', 'Juan Carlos Mendez', '555-2001', 'ventas@fdn.com', 'Zona Industrial 1'),
('Laboratorios Unidos SA', 'María Elena Vásquez', '555-2002', 'compras@luisa.com', 'Parque Industrial Norte'),
('Medicamentos Importados SRL', 'Pedro Antonio Ruiz', '555-2003', 'contacto@medimport.com', 'Centro Comercial Sur'),
('Distribuidora Farmacéutica Global', 'Ana Sofía Torres', '555-2004', 'info@dfglobal.com', 'Zona Franca Este')
ON CONFLICT DO NOTHING;

-- ============================================
-- MEDICAMENTOS DE PRUEBA (ADICIONALES)
-- ============================================

INSERT INTO medicamentos (nombre, cantidadinventario, fechavencimiento, precio, costo, proveedor, imagenurl, umbral_minimo, descripcion, categoria, codigo_barras) VALUES
('Aspirina 500mg', 200, '2026-06-30', 2.50, 1.50, 'Farmacias Distribuidora Nacional', 'https://example.com/aspirina.jpg', 20, 'Analgésico y antipirético', 'Analgésicos', '1234567890123'),
('Vitamina C 1000mg', 150, '2026-12-31', 8.75, 5.25, 'Laboratorios Unidos SA', 'https://example.com/vitamina-c.jpg', 15, 'Suplemento vitamínico', 'Vitaminas', '1234567890124'),
('Antibiótico Amoxicilina 875mg', 80, '2025-08-15', 12.00, 7.50, 'Medicamentos Importados SRL', 'https://example.com/amoxicilina.jpg', 10, 'Antibiótico de amplio espectro', 'Antibióticos', '1234567890125'),
('Jarabe para la Tos', 60, '2025-10-20', 6.25, 3.75, 'Distribuidora Farmacéutica Global', 'https://example.com/jarabe.jpg', 12, 'Antitusivo y expectorante', 'Respiratorios', '1234567890126'),
('Antácido Tabletas', 180, '2026-04-10', 3.50, 2.00, 'Farmacias Distribuidora Nacional', 'https://example.com/antacido.jpg', 25, 'Antiácido para acidez estomacal', 'Digestivos', '1234567890127')
ON CONFLICT (codigo_barras) DO NOTHING;

-- ============================================
-- COMPRAS DE PRUEBA
-- ============================================

INSERT INTO compras (idproveedor, idusuario, total, estado, numero_factura, notas) VALUES
(1, 1, 1500.00, 'recibida', 'FAC-001-2025', 'Compra mensual de medicamentos básicos'),
(2, 1, 2300.50, 'recibida', 'FAC-002-2025', 'Pedido especial de vitaminas'),
(3, 2, 850.75, 'pendiente', 'FAC-003-2025', 'Antibióticos de temporada'),
(4, 1, 1200.00, 'recibida', 'FAC-004-2025', 'Medicamentos para el sistema respiratorio')
ON CONFLICT DO NOTHING;

-- ============================================
-- VENTAS DE PRUEBA
-- ============================================

INSERT INTO ventas (idcliente, idusuario, total, metodo_pago, estado, descuento, notas) VALUES
(1, 2, 45.75, 'efectivo', 'completada', 0, 'Venta regular'),
(2, 2, 128.50, 'tarjeta', 'completada', 5.00, 'Cliente frecuente - descuento aplicado'),
(3, 3, 67.25, 'efectivo', 'completada', 0, 'Medicamentos para tratamiento'),
(NULL, 2, 23.00, 'efectivo', 'completada', 0, 'Venta sin cliente registrado'),
(4, 3, 156.75, 'transferencia', 'completada', 10.00, 'Compra mayor - descuento por volumen')
ON CONFLICT DO NOTHING;

-- ============================================
-- DETALLES DE VENTA DE PRUEBA
-- ============================================

-- Para venta 1 (ID puede variar, ajustar según sea necesario)
INSERT INTO detalleventas (idventa, idmedicamento, cantidad, precio_unitario, subtotal) VALUES
(1, 1, 2, 3.50, 7.00),
(1, 4, 1, 4.75, 4.75);

-- Para venta 2
INSERT INTO detalleventas (idventa, idmedicamento, cantidad, precio_unitario, subtotal) VALUES
(2, 2, 3, 5.00, 15.00),
(2, 5, 2, 2.95, 5.90),
(2, 8, 1, 7.40, 7.40);

-- Para venta 3
INSERT INTO detalleventas (idventa, idmedicamento, cantidad, precio_unitario, subtotal) VALUES
(3, 3, 1, 8.25, 8.25),
(3, 6, 2, 3.10, 6.20);

-- Para venta 4
INSERT INTO detalleventas (idventa, idmedicamento, cantidad, precio_unitario, subtotal) VALUES
(4, 7, 1, 6.00, 6.00),
(4, 9, 2, 4.20, 8.40);

-- Para venta 5
INSERT INTO detalleventas (idventa, idmedicamento, cantidad, precio_unitario, subtotal) VALUES
(5, 1, 5, 3.50, 17.50),
(5, 10, 1, 9.80, 9.80),
(5, 2, 4, 5.00, 20.00);

-- ============================================
-- NOTIFICACIONES Y MENSAJES
-- ============================================

-- Crear secuencias para IDs si no existen
-- (Esto maneja el caso donde las tablas ya tienen datos)

SELECT setval('usuarios_idusuario_seq', (SELECT COALESCE(MAX(idusuario), 0) + 1 FROM usuarios), false);
SELECT setval('clientes_idcliente_seq', (SELECT COALESCE(MAX(idcliente), 0) + 1 FROM clientes), false);
SELECT setval('medicamentos_idmedicamento_seq', (SELECT COALESCE(MAX(idmedicamento), 0) + 1 FROM medicamentos), false);
SELECT setval('proveedores_idproveedor_seq', (SELECT COALESCE(MAX(idproveedor), 0) + 1 FROM proveedores), false);
SELECT setval('ventas_idventa_seq', (SELECT COALESCE(MAX(idventa), 0) + 1 FROM ventas), false);
SELECT setval('compras_idcompra_seq', (SELECT COALESCE(MAX(idcompra), 0) + 1 FROM compras), false);

-- ============================================
-- MENSAJE DE CONFIRMACIÓN
-- ============================================

DO $$
BEGIN
    RAISE NOTICE '🌱 Seeds ejecutados correctamente para PharmaCenter';
    RAISE NOTICE '   - % usuarios creados', (SELECT COUNT(*) FROM usuarios);
    RAISE NOTICE '   - % clientes creados', (SELECT COUNT(*) FROM clientes);
    RAISE NOTICE '   - % medicamentos en inventario', (SELECT COUNT(*) FROM medicamentos);
    RAISE NOTICE '   - % proveedores registrados', (SELECT COUNT(*) FROM proveedores);
    RAISE NOTICE '   - % ventas de ejemplo', (SELECT COUNT(*) FROM ventas);
    RAISE NOTICE '   - % compras de ejemplo', (SELECT COUNT(*) FROM compras);
END $$;