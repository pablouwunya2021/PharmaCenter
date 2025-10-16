<div align="center">

# 💊 PharmaCenter

### Sistema de Gestión Integral para Farmacias

[![React](https://img.shields.io/badge/React-18.x-61DAFB?logo=react&logoColor=white)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-20.x-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1?logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?logo=docker&logoColor=white)](https://www.docker.com/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

*Plataforma moderna para la gestión eficiente de inventario, ventas, compras y clientes en farmacias*

[Características](#-características-principales) • [Instalación](#-instalación-rápida) • [Documentación](#-documentación) • [Contribuir](#-contribuir)

</div>

---

## 📋 Tabla de Contenidos

- [Características Principales](#-características-principales)
- [Tecnologías](#-tecnologías)
- [Instalación Rápida](#-instalación-rápida)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Uso](#-uso)
- [Testing](#-testing)
- [Documentación](#-documentación)
- [Contribuir](#-contribuir)
- [Licencia](#-licencia)

---

## ✨ Características Principales

### 🏥 Gestión de Inventario
- ✅ Control de stock en tiempo real
- ✅ Alertas de medicamentos por vencer
- ✅ Umbral mínimo de inventario
- ✅ Historial de movimientos

### 💰 Módulo de Ventas
- ✅ Punto de venta intuitivo
- ✅ Registro de ventas con detalles
- ✅ Historial de transacciones
- ✅ Conexión con clientes

### 📦 Gestión de Proveedores
- ✅ Administración de proveedores
- ✅ Control de compras
- ✅ Seguimiento de pedidos
- ✅ Relación medicamento-proveedor

### 👥 Administración de Usuarios
- ✅ Sistema de roles (admin/user)
- ✅ Autenticación segura (JWT)
- ✅ Protección de rutas
- ✅ Auditoría de acciones

### 📊 Reportes y Estadísticas
- ✅ Dashboards visuales
- ✅ Reportes personalizados
- ✅ Análisis de ventas
- ✅ Métricas de rendimiento

### 🔔 Sistema de Notificaciones
- ✅ Notificaciones en tiempo real
- ✅ Alertas personalizadas por usuario
- ✅ Filtros por tipo y fecha

---

## 🛠️ Tecnologías

### Frontend
- **React 18** - Biblioteca UI moderna
- **Vite** - Build tool ultrarrápido
- **TailwindCSS** - Framework CSS utility-first
- **React Router** - Enrutamiento SPA
- **Axios** - Cliente HTTP

### Backend
- **Node.js 20** - Runtime JavaScript
- **Express** - Framework web minimalista
- **PostgreSQL 16** - Base de datos relacional
- **JWT** - Autenticación basada en tokens
- **Bcrypt** - Hash de contraseñas

### DevOps
- **Docker & Docker Compose** - Contenedores
- **Jest & Supertest** - Testing backend
- **Vitest** - Testing frontend
- **ESLint** - Linter de código

---

## 🚀 Instalación Rápida

### Prerequisitos

- [Docker](https://www.docker.com/get-started) & Docker Compose
- [Node.js](https://nodejs.org/) 20.x o superior
- [Git](https://git-scm.com/)

### 1️⃣ Clonar el Repositorio

```bash
git clone https://github.com/pablouwunya2021/PharmaCenter.git
cd PharmaCenter
```

### 2️⃣ Levantar con Docker

```bash
# Iniciar todos los servicios (PostgreSQL, Backend, Frontend)
docker-compose up -d

# Esperar 30 segundos para que PostgreSQL inicie
timeout /t 30  # Windows
sleep 30       # Linux/Mac
```

### 3️⃣ Ejecutar Migraciones

```bash
# Sincronizar base de datos
cd database/scripts
node migrate-up.js
cd ../..
```

### 4️⃣ (Opcional) Agregar Datos de Prueba

```bash
cd database/scripts
node seed.js
cd ../..
```

### 5️⃣ Acceder a la Aplicación

- **Frontend:** http://localhost:8081
- **Backend API:** http://localhost:3000
- **Base de Datos:** `localhost:5433`

**Credenciales por defecto:**
- **Usuario:** admin@pharmacenter.com
- **Contraseña:** admin123

---

## 📁 Estructura del Proyecto

```
PharmaCenter/
├── 📂 backend/              # API REST (Node.js + Express)
│   ├── src/
│   │   ├── controllers/     # Lógica de negocio
│   │   ├── middlewares/     # Autenticación, validación
│   │   ├── models/          # Conexión BD
│   │   ├── routes/          # Definición de rutas
│   │   └── utils/           # Utilidades
│   └── Dockerfile
│
├── 📂 pharmacenter/         # Frontend (React + Vite)
│   ├── src/
│   │   ├── components/      # Componentes reutilizables
│   │   ├── pages/           # Vistas principales
│   │   ├── hooks/           # Custom hooks
│   │   └── utils/           # Helpers
│   └── Dockerfile
│
├── 📂 database/             # Esquema y migraciones
│   ├── migrations/          # Migraciones SQL
│   ├── rollbacks/           # Rollbacks
│   ├── scripts/             # Scripts de gestión
│   └── init.sql             # Esquema inicial
│
├── 📂 tests/                # Tests E2E y de integración
│   ├── api/                 # Tests de API
│   ├── e2e/                 # Tests end-to-end
│   └── frontend/            # Tests de componentes
│
├── docker-compose.yml       # Orquestación de servicios
├── SINCRONIZAR_BASE_DATOS.md  # Guía de sincronización
└── README.md                # Este archivo
```

---

## 💻 Uso

### Desarrollo Local (sin Docker)

#### Backend
```bash
cd backend
npm install
npm run dev
```

#### Frontend
```bash
cd pharmacenter
npm install
npm run dev
```

#### Base de Datos
```bash
# Iniciar solo PostgreSQL
docker-compose up -d postgres

# Ejecutar migraciones
cd database/scripts
node migrate-up.js
```

### Comandos Útiles

```bash
# Ver logs de servicios
docker-compose logs -f

# Detener servicios (sin borrar datos)
docker-compose stop

# Reiniciar servicios
docker-compose restart

# Eliminar servicios y volúmenes
docker-compose down -v

# Reconstruir imagen del frontend
docker-compose build --no-cache frontend
```

---

## 🧪 Testing

## 🧪 Testing

### Backend (Jest + Supertest)

```bash
cd backend
npm test
```

**Cobertura:**
- ✅ Endpoints de autenticación
- ✅ CRUD de medicamentos
- ✅ Operaciones de venta
- ✅ Validación de datos

### Frontend (Vitest)

```bash
cd pharmacenter
npx vitest run
```

**Cobertura:**
- ✅ Renderizado de componentes principales
- ✅ Navegación entre rutas
- ✅ Manejo de estados

### Ejecutar Todos los Tests

```bash
# Desde la raíz del proyecto
npm test
```

---

## 📚 Documentación

### Guías Disponibles

- **[SINCRONIZAR_BASE_DATOS.md](SINCRONIZAR_BASE_DATOS.md)** - Guía para sincronizar la base de datos después de `git pull`
- **[database/README.md](database/README.md)** - Información sobre migraciones y esquema
- **[database/TABLA_PUBLICIDAD.md](database/TABLA_PUBLICIDAD.md)** - Documentación de la tabla de publicidad

### Migraciones de Base de Datos

El proyecto usa un sistema de migraciones versionadas:

```bash
# Ejecutar migraciones pendientes
cd database/scripts
node migrate-up.js

# Revertir última migración
node migrate-down.js

# Crear nueva migración
node create-migration.js nombre_de_migracion
```

**Migraciones disponibles:**
- `001-008` - Esquema inicial y tablas básicas
- `009` - Relación Medicamento ↔ Proveedores
- `010` - Relación Venta ↔ Cliente
- `011` - Precios en detalle de venta
- `012-013` - Restricciones de integridad
- `014` - Notificaciones por usuario
- `015` - Índices de rendimiento
- `016` - Auditoría con timestamps

### API Endpoints

#### Autenticación
```http
POST /api/auth/register  # Registrar usuario
POST /api/auth/login     # Iniciar sesión
GET  /api/auth/me        # Obtener usuario actual
```

#### Medicamentos
```http
GET    /api/medicamentos       # Listar todos
GET    /api/medicamentos/:id   # Obtener por ID
POST   /api/medicamentos       # Crear nuevo
PUT    /api/medicamentos/:id   # Actualizar
DELETE /api/medicamentos/:id   # Eliminar
```

#### Ventas
```http
GET  /api/ventas          # Listar todas
POST /api/ventas          # Registrar venta
GET  /api/ventas/:id      # Detalle de venta
```

---

##  Licencia

Este proyecto está bajo la licencia MIT. Ver el archivo [LICENSE](LICENSE) para más detalles.

---

<div align="center">

**[⬆ Volver arriba](#-pharmacenter)**

Made with ❤️ using React, Node.js & PostgreSQL

</div>


