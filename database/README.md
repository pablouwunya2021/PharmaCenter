# Sistema de Migraciones PharmaCenter

Sistema completo de migraciones para la base de datos PostgreSQL de PharmaCenter.

## 📁 Estructura

```
database/
├── migrations/           # Archivos de migración SQL
├── rollbacks/           # Archivos de rollback SQL
├── seeds/               # Datos iniciales y de prueba
└── scripts/             # Scripts Node.js de utilidad
```

## 🚀 Comandos Disponibles

### Comandos de Migración

```bash
# Ver estado de migraciones
npm run migrate:status

# Ejecutar migraciones pendientes
npm run migrate:up

# Hacer rollback de la última migración
npm run migrate:down

# Hacer rollback hasta una versión específica
npm run migrate:down:to 003

# Crear una nueva migración
npm run migrate:create "descripcion_del_cambio"

# Reset completo (rollback todo y migrar de nuevo)
npm run migrate:reset
```

### Comandos de Base de Datos

```bash
# Ejecutar seeds (datos de prueba)
npm run db:seed

# Reset completo con seeds
npm run db:reset
```

## 📝 Crear Nueva Migración

1. **Crear archivos de migración:**
   ```bash
   npm run migrate:create "agregar_tabla_inventario"
   ```

2. **Esto genera:**
   - `migrations/004_agregar_tabla_inventario.sql`
   - `rollbacks/004_rollback_agregar_tabla_inventario.sql`

3. **Editar el archivo de migración** con tus cambios SQL

4. **Editar el archivo de rollback** con los comandos inversos

5. **Probar localmente:**
   ```bash
   npm run migrate:up
   ```

6. **Si hay errores, hacer rollback:**
   ```bash
   npm run migrate:down
   ```

## 🔄 Flujo de Trabajo

### Desarrollo Local

1. **Crear nueva migración:**
   ```bash
   npm run migrate:create "mi_cambio"
   ```

2. **Editar archivos SQL generados**

3. **Probar migración:**
   ```bash
   npm run migrate:up
   ```

4. **Probar rollback:**
   ```bash
   npm run migrate:down
   npm run migrate:up
   ```

5. **Commit a Git:**
   ```bash
   git add database/
   git commit -m "feat: agregar migración para mi_cambio"
   ```

### Despliegue en Producción

1. **Hacer backup de la base de datos**

2. **Ejecutar migraciones:**
   ```bash
   npm run migrate:up
   ```

3. **Verificar que todo funcione correctamente**

## 📋 Tabla de Control

El sistema mantiene una tabla `schema_migrations` que registra:

- `version`: Número de versión de la migración
- `description`: Descripción del cambio
- `executed_at`: Timestamp de ejecución
- `checksum`: Hash del archivo para verificar integridad
- `execution_time_ms`: Tiempo de ejecución
- `rollback_file`: Archivo de rollback correspondiente

## 🔧 Configuración

### Variables de Entorno

Crear archivo `.env` en la raíz del proyecto:

```env
DB_HOST=localhost
DB_PORT=5433
DB_NAME=pharmacenter_db
DB_USER=pharma_user
DB_PASSWORD=pharma_password123
```

### Configuración por Defecto

Si no se especifican variables de entorno, se usan estos valores:
- Host: localhost
- Puerto: 5433
- Base de datos: pharmacenter_db
- Usuario: pharma_user
- Contraseña: pharma_password123

## 📚 Buenas Prácticas

### Al Crear Migraciones

1. **Usar nombres descriptivos:**
   ```bash
   npm run migrate:create "agregar_indice_email_usuarios"
   npm run migrate:create "crear_tabla_categorias"
   ```

2. **Una migración = un cambio lógico**
   - No mezclar múltiples cambios no relacionados
   - Mantener migraciones pequeñas y enfocadas

3. **Siempre crear rollbacks:**
   - Cada migración debe tener su rollback correspondiente
   - Probar que el rollback funcione correctamente

4. **Usar transacciones:**
   - Las migraciones se ejecutan en transacciones automáticamente
   - Si algo falla, se hace rollback automático

### Al Escribir SQL

1. **Usar IF EXISTS/IF NOT EXISTS:**
   ```sql
   CREATE TABLE IF NOT EXISTS nueva_tabla (...);
   ALTER TABLE tabla ADD COLUMN IF NOT EXISTS nueva_columna VARCHAR(50);
   DROP INDEX IF EXISTS idx_viejo;
   ```

2. **Ser explícito con tipos de datos:**
   ```sql
   -- Bueno
   ALTER TABLE usuarios ADD COLUMN telefono VARCHAR(15);
   
   -- Evitar
   ALTER TABLE usuarios ADD COLUMN telefono TEXT;
   ```

3. **Incluir comentarios:**
   ```sql
   -- Agregar índice para mejorar búsquedas por email
   CREATE INDEX idx_usuarios_email ON usuarios(email);
   ```

## 🆘 Solución de Problemas

### Migración Falló

1. **Ver el error específico** en la consola
2. **Hacer rollback** si es necesario:
   ```bash
   npm run migrate:down
   ```
3. **Corregir el SQL** en el archivo de migración
4. **Intentar de nuevo:**
   ```bash
   npm run migrate:up
   ```

### Estado Inconsistente

1. **Verificar estado:**
   ```bash
   npm run migrate:status
   ```

2. **Reset completo si es necesario:**
   ```bash
   npm run migrate:reset
   ```

### Error de Conexión

1. **Verificar que Docker esté corriendo:**
   ```bash
   docker-compose up -d
   ```

2. **Verificar variables de entorno**

3. **Verificar que la base de datos exista**

## 📖 Ejemplos

### Agregar Nueva Columna

**Migración (005_agregar_email_clientes.sql):**
```sql
-- Agregar email a tabla clientes
ALTER TABLE clientes 
ADD COLUMN IF NOT EXISTS email VARCHAR(100) UNIQUE;

-- Agregar índice para búsquedas
CREATE INDEX IF NOT EXISTS idx_clientes_email ON clientes(email);
```

**Rollback (005_rollback_agregar_email_clientes.sql):**
```sql
-- Remover índice y columna email
DROP INDEX IF EXISTS idx_clientes_email;
ALTER TABLE clientes DROP COLUMN IF EXISTS email;
```

### Crear Nueva Tabla

**Migración (006_crear_tabla_categorias.sql):**
```sql
-- Crear tabla de categorías de medicamentos
CREATE TABLE IF NOT EXISTS categorias (
    idcategoria SERIAL PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL UNIQUE,
    descripcion TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Agregar datos iniciales
INSERT INTO categorias (nombre, descripcion) VALUES
('Analgésicos', 'Medicamentos para el dolor'),
('Antibióticos', 'Medicamentos contra infecciones'),
('Vitaminas', 'Suplementos vitamínicos');
```

**Rollback (006_rollback_crear_tabla_categorias.sql):**
```sql
-- Eliminar tabla categorias
DROP TABLE IF EXISTS categorias;
```

## 🔒 Seguridad

1. **Nunca incluir credenciales** en los archivos de migración
2. **Usar variables de entorno** para configuración sensible
3. **Hacer backup** antes de ejecutar migraciones en producción
4. **Probar migraciones** en entorno de desarrollo primero
5. **Revisar permisos** de base de datos antes de desplegar

## 📞 Soporte

Si tienes problemas con las migraciones:

1. Revisar logs de error
2. Verificar estado con `npm run migrate:status`
3. Consultar esta documentación
4. Hacer rollback si es necesario
5. Contactar al equipo de desarrollo