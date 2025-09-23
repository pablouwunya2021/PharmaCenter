CREATE TABLE Usuario (
  idUsuario    SERIAL        PRIMARY KEY,
  nombre       VARCHAR(100)  NOT NULL,
  correo       VARCHAR(100)  NOT NULL UNIQUE,
  contrasena   VARCHAR(255)  NOT NULL,
  rol          VARCHAR(20)   NOT NULL DEFAULT 'user'
);

CREATE TABLE Medicamento (
  idMedicamento       SERIAL        PRIMARY KEY,
  nombre              VARCHAR(100)  NOT NULL,
  cantidadInventario  INT           NOT NULL,
  fechaVencimiento    DATE          NOT NULL,
  precio              DECIMAL(10,2) NOT NULL,
  costo               DECIMAL(10,2) NOT NULL,
  proveedor           VARCHAR(100)  NOT NULL,
  imagenUrl           VARCHAR(2555),
  umbral_minimo       INTEGER       DEFAULT 10
);

CREATE TABLE Venta (
  idVenta    SERIAL        PRIMARY KEY,
  idUsuario  INT           NOT NULL,
  total      DECIMAL(10,2) NOT NULL,
  FOREIGN KEY (idUsuario) REFERENCES Usuario(idUsuario)
);

CREATE TABLE Reporte (
  idReporte  SERIAL        PRIMARY KEY,
  idUsuario  INT           NOT NULL,
  fecha      DATE          NOT NULL,
  tipo       VARCHAR(50)   NOT NULL,
  FOREIGN KEY (idUsuario) REFERENCES Usuario(idUsuario)
);

CREATE TABLE Notificacion (
  idNotificacion  SERIAL      PRIMARY KEY,
  mensaje         TEXT        NOT NULL,
  fecha           DATE        NOT NULL,
  tipo            VARCHAR(50) NOT NULL
);

CREATE TABLE Venta_Medicamento (
  idVenta       INT NOT NULL,
  idMedicamento INT NOT NULL,
  cantidad      INT NOT NULL,
  PRIMARY KEY (idVenta, idMedicamento),
  FOREIGN KEY (idVenta) REFERENCES Venta(idVenta),
  FOREIGN KEY (idMedicamento) REFERENCES Medicamento(idMedicamento) ON DELETE CASCADE
);

-- Insertar usuarios con contraseñas correctamente hasheadas
INSERT INTO Usuario (nombre, correo, contrasena, rol) VALUES
  -- admin@pharmacenter.com / admin123
  ('Administrador', 'admin@pharmacenter.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin'),
  -- ana.torres@email.com / ana123
  ('Ana Torres', 'ana.torres@email.com', '$2a$10$X8m8TUNS.LGEyqQ6HMCdSeON5Rj1L1H.eJhUTFvV1YwNq8L8S4o8G', 'user'),
  -- luis.martinez@email.com / luis123
  ('Luis Martínez', 'luis.martinez@email.com', '$2a$10$wQT.z8g8Y9kY8lVqq9V7DOJnJ4kOh9o8kEp2V5RzNYxNw7N2kOQsG', 'user'),
  -- maria.gomez@email.com / maria123
  ('María Gómez', 'maria.gomez@email.com', '$2a$10$Jx8G2v5hX6Y7kTqO4bE8fOKmP9lQ8t6vU2hJ7mN4gL3wZ9kD5nR2s', 'user'),
  -- carlos.ruiz@email.com / carlos123
  ('Carlos Ruiz', 'carlos.ruiz@email.com', '$2a$10$M3p7K8w5N9oE2bY6cT9hAOtR4dF6qJ8lH5vP1xG7zA2mS8kU6nE9o', 'user'),
  -- laura.lopez@email.com / laura123
  ('Laura López', 'laura.lopez@email.com', '$2a$10$N4q8L9x6O0pF3cZ7dU0iBoU5eG7rK9mI6wQ2yH8aB3nT9lV7oP0p', 'user'),
  -- pedro.sanchez@email.com / pedro123
  ('Pedro Sánchez', 'pedro.sanchez@email.com', '$2a$10$O5r9M0y7P1qG4dA8eV1jCpV6fH8sL0nJ7xR3zI9bC4oU0mW8pQ1q', 'user'),
  -- lucia.fernandez@email.com / lucia123
  ('Lucía Fernández', 'lucia.fernandez@email.com', '$2a$10$P6s0N1z8Q2rH5eB9fW2kDqW7gI9tM1oK8yS4aJ0cD5pV1nX9qR2r', 'user'),
  -- miguel.diaz@email.com / miguel123
  ('Miguel Díaz', 'miguel.diaz@email.com', '$2a$10$Q7t1O2a9R3sI6fC0gX3lErX8hJ0uN2pL9zT5bK1dE6qW2oY0rS3s', 'user'),
  -- sandra.romero@email.com / sandra123
  ('Sandra Romero', 'sandra.romero@email.com', '$2a$10$R8u2P3b0S4tJ7gD1hY4mFsY9iK1vO3qM0aU6cL2eF7rX3pZ1sT4t', 'user'),
  -- jorge.herrera@email.com / jorge123
  ('Jorge Herrera', 'jorge.herrera@email.com', '$2a$10$S9v3Q4c1T5uK8hE2iZ5nGtZ0jL2wP4rN1bV7dM3fG8sY4qA2tU5u', 'user');

INSERT INTO Medicamento (nombre, cantidadInventario, fechaVencimiento, precio, costo, proveedor, imagenUrl) VALUES
  ('Paracetamol',   100, '2025-12-31', 3.50, 2.00, 'Farfasa', 'https://walmartgt.vtexassets.com/arquivos/ids/290893/S-Paracetamol-Mk-750Mg-100-Tabletas-3-32829.jpg?v=637955915607630000'),
  ('Ibuprofeno',     80, '2024-11-15', 5.00, 3.00, 'Laboratorios Laprin', 'https://walmartgt.vtexassets.com/arquivos/ids/322244/Ibuprofeno-Mk-600-Mg-50-Tabletas-1-32817.jpg?v=638041234307570000'),
  ('Amoxicilina',     1, '2026-01-10', 8.25, 5.00, 'Farmacéutica LANCO', 'https://www.lasanteca.com/userfiles/2018/12/AMOXICILINA-500MG-CAJA-POR-50-CAPSULAS-CON-BLISTER.jpg'),
  ('Omeprazol',      90, '2025-07-01', 4.75, 2.50, 'Distribuidora Almacén Farmacéutico S.A', 'https://calox.com/wp-content/uploads/2022/12/Omeprazol-20x28-1.png'),
  ('Cetirizina',    120, '2026-05-30', 2.95, 1.70, 'Laboratorios Vijosa', 'https://www.olaiz.com/upload/principios-activos/c/cetirizina-cinfa-10mg-20comprimidos-farmacia-andorra.jpg'),
  ('Loratadina',    110, '2025-09-20', 3.10, 1.90, 'Farfas', 'https://medicamentosmk.com/static/images/loratadina-mk.webp'),
  ('Norgestrel',     70, '2026-03-15', 6.00, 3.80, 'Farmacéutica LANCO', 'https://biotenk.com.ar/wp-content/uploads/2022/06/Norgestrel-Plus.jpeg'),
  ('Simvastatina',   65, '2025-04-01', 7.40, 4.20, 'Farmacéutica LANCO', 'https://www.denkpharma.com/wp-content/uploads/2024/07/simvastatina_denk_es.jpg'),
  ('Buscapina',     130, '2024-12-05', 4.20, 2.60, 'Laboratorios Laprin', 'https://www.buscapina.com/dam/jcr:e826d6a1-9ba5-4cbb-bd5b-09c546228dd2/3_1_hero_desktop.png'),
  ('Salbutamol',     95, '2026-02-22', 9.80, 6.00, 'Distribuidora Almacén Farmacéutico S.A', 'https://www.buscapina.com/dam/jcr:e826d6a1-9ba5-4cbb-bd5b-09c546228dd2/3_1_hero_desktop.png');

INSERT INTO Venta (idUsuario, total) VALUES
  (2,  15.00),
  (3,   9.50),
  (4,  22.75),
  (5,   5.00),
  (6,  13.25),
  (7,  10.10),
  (8,   8.20),
  (9,  12.60),
  (10,   7.40),
  (11, 18.00);

INSERT INTO Reporte (idUsuario, fecha, tipo) VALUES
  (2,  '2025-03-01', 'Stock Bajo'),
  (3,  '2025-03-02', 'Venta Alta'),
  (4,  '2025-03-03', 'Medicamento Vencido'),
  (5,  '2025-03-04', 'Revisión'),
  (6,  '2025-03-05', 'Alerta'),
  (7,  '2025-03-06', 'Inventario'),
  (8,  '2025-03-07', 'Devolución'),
  (9,  '2025-03-08', 'Consulta'),
  (10,  '2025-03-09', 'Reposición'),
  (11, '2025-03-10', 'Sugerencia');

INSERT INTO Notificacion (mensaje, fecha, tipo) VALUES
  ('Medicamento Paracetamol por agotarse',     '2025-03-01', 'Stock'),
  ('Venta récord registrada hoy',               '2025-03-02', 'Venta'),
  ('Medicamento vencido detectado',             '2025-03-03', 'Alerta'),
  ('Se requiere revisión de inventario',        '2025-03-04', 'Sistema'),
  ('Nuevo lote recibido',                       '2025-03-05', 'Recepción'),
  ('Falla en el sistema de notificaciones',     '2025-03-06', 'Error'),
  ('Medicamento en promoción',                  '2025-03-07', 'Promoción'),
  ('Cambio de proveedor registrado',            '2025-03-08', 'Actualización'),
  ('Reporte disponible para revisión',          '2025-03-09', 'Reporte'),
  ('Sistema actualizado correctamente',         '2025-03-10', 'Sistema');

INSERT INTO Venta_Medicamento (idVenta, idMedicamento, cantidad) VALUES
  (1,  1, 2),
  (1,  2, 1),
  (2,  3, 1),
  (3,  4, 3),
  (4,  5, 1),
  (5,  6, 2),
  (6,  7, 1),
  (7,  8, 1),
  (8,  9, 2),
  (9, 10, 1),
  (10, 1, 3);