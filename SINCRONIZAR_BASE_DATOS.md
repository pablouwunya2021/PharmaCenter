# 🔄 Sincronización de Base de Datos - PharmaCenter

## 📋 ¿Cuándo usar esta guía?
- Acabas de hacer `git pull` y hay cambios en la base de datos
- Acabas de clonar el proyecto por primera vez
- Tu base de datos está desactualizada
- Alguien del equipo agregó nuevas tablas/columnas

---

## 🚀 Pasos para Sincronizar la Base de Datos

### **1. Actualizar código**
```powershell
git pull 
```

### **2. Detener contenedores**
```powershell
docker-compose down
```

### **3. Limpiar base de datos vieja**
```powershell
Remove-Item -Recurse -Force .\postgres_data
```

### **4. Levantar servicios**
```powershell
docker-compose up -d
```

### **5. Esperar 30 segundos**
```powershell
timeout /t 30
```

### **6. Sincronizar base de datos (ejecutar migraciones)**
```powershell
cd database/scripts; node migrate-up.js; cd ../..
```

### **7. (Opcional) Agregar datos de prueba**
```powershell
cd database/scripts; node seed.js; cd ../..
```

---

## ✅ Verificar que funciona

```powershell
docker exec -it postgres psql -U pharma_user -d pharmacenter_db -c "\dt"
```

Deberías ver las tablas sin duplicados: `usuario`, `medicamento`, `venta`, `publicidad`, etc.

---

## ❓ Problemas Comunes

### Error: "duplicate key violates unique constraint"
```powershell
docker exec -it postgres psql -U pharma_user -d pharmacenter_db -c "DELETE FROM schema_migrations;"; cd database/scripts; node migrate-up.js; cd ../..
```

### Error: "El token '&&' no es válido"
**Solución:** Usa `;` en PowerShell o ejecuta los comandos uno por uno.

### Error: "role pharma_user does not exist"
**Solución:** Espera 30 segundos después de `docker-compose up -d`

### El frontend no muestra cambios
```powershell
docker-compose build --no-cache frontend
docker-compose up -d
```
Luego en el navegador: `Ctrl + Shift + R`
