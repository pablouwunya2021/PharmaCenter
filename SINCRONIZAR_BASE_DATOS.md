# 🔄 Sincronización de Base de Datos - PharmaCenter

## 📋 ¿Cuándo usar esta guía?
- No tienes la tabla `publicidad` en tu base de datos
- Acabas de clonar el proyecto
- Tu base de datos está desactualizada

## 🚀 Pasos Rápidos (Solo 3 comandos)

### 1. Iniciar Docker
```powershell
docker-compose up -d
```

### 2. Ejecutar Migraciones

#### 🪟 **Windows (PowerShell)**
```powershell
cd database/scripts; node migrate-up.js
```

#### 🐧 **Linux / 🍎 Mac (Terminal)**
```bash
cd database/scripts && node migrate-up.js
```

#### ⚠️ **Alternativa universal (cualquier sistema)**
```bash
cd database/scripts
node migrate-up.js
```

### 3. Agregar Datos de Ejemplo (Opcional)
```powershell
node seed.js
```

## ✅ Verificación
Ejecuta esto para confirmar que todo está bien:
```powershell
docker exec -it postgres psql -U pharma_user -d pharmacenter_db -c "SELECT COUNT(*) FROM publicidad;"
```

**Resultado esperado:** `10` registros

## ❗ Si tienes errores

### Error: "duplicate key value violates unique constraint schema_migrations_pkey"
- **Problema:** Las migraciones ya están registradas pero el script intenta ejecutarlas otra vez
- **Solución:** Limpiar y volver a registrar las migraciones

#### 🔧 **Solución paso a paso:**

**1. Limpiar registros de migraciones:**
```powershell
docker exec -it postgres psql -U pharma_user -d pharmacenter_db -c "DELETE FROM schema_migrations;"
```

**2. Volver a ejecutar migraciones:**
```powershell
cd database/scripts; node migrate-up.js
```

**3. Verificar que funciona:**
```powershell
docker exec -it postgres psql -U pharma_user -d pharmacenter_db -c "SELECT COUNT(*) FROM publicidad;"
```

**📋 Explicación del problema:** Alguien ejecutó las migraciones de otra forma (manualmente o con otro script) y quedaron las tablas creadas, pero la tabla `schema_migrations` tiene registros duplicados o conflictivos.

### Error: "El token '&&' no es válido"
- **Problema:** Usas PowerShell en Windows
- **Solución:** Usa `;` en lugar de `&&` o ejecuta los comandos por separado

#### 📋 **Comandos por Sistema Operativo:**

| Sistema | Separador | Comando |
|---------|-----------|---------|
| **Windows PowerShell** | `;` | `cd database/scripts; node migrate-up.js` |
| **Linux/Mac Terminal** | `&&` | `cd database/scripts && node migrate-up.js` |
| **Universal** | (separado) | `cd database/scripts` → `node migrate-up.js` |

### Error: "role pharma_user does not exist" 
- **Problema:** Docker no está corriendo
- **Solución:** Ejecuta `docker-compose up -d` y espera 30 segundos

### Error: "No such file migrate-up.js"
- **Problema:** No estás en la carpeta correcta
- **Solución:** Asegúrate de estar en la carpeta raíz del proyecto

## 💡 ¿Por qué necesito ejecutar comandos si hice git pull?

### **Git solo transporta archivos, NO datos de base de datos**

**Lo que Git SÍ sincroniza:**
- ✅ Archivos de migración (`.sql`)
- ✅ Scripts (`.js`) 
- ✅ Código fuente
- ✅ Documentación

**Lo que Git NO sincroniza:**
- ❌ Tablas creadas (como `publicidad`)
- ❌ Datos insertados
- ❌ Índices, restricciones, funciones
- ❌ Cambios en tu base de datos local

### **El flujo es así:**
1. **Compañero** crea migración → Git detecta archivo `.sql`
2. **Tú** haces `git pull` → obtienes archivo `.sql` 
3. **Tú** ejecutas `node migrate-up.js` → se aplican cambios a TU base de datos
4. **Cada persona** debe ejecutar las migraciones en su propia base de datos

**🎯 Resumen:** Git transporta las "instrucciones", pero cada desarrollador debe "ejecutar" esas instrucciones localmente.

---
**¡Listo!** Tu base de datos estará sincronizada con la tabla `publicidad` y todos los datos necesarios.