# Tabla Publicidad - PharmaCenter

## 📋 Descripción

La tabla `publicidad` gestiona anuncios, promociones, descuentos y ofertas especiales de la farmacia PharmaCenter.

## 🗂️ Estructura de la Tabla

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `idpublicidad` | SERIAL PRIMARY KEY | ID único del anuncio |
| `titulo` | VARCHAR(200) | Título del anuncio o promoción |
| `descripcion` | TEXT | Descripción detallada |
| `tipo_publicidad` | VARCHAR(50) | Tipo: banner, promocion, descuento, oferta_especial, evento, informativa |
| `imagen_url` | TEXT | URL de la imagen del anuncio |
| `fecha_inicio` | DATE | Fecha de inicio de vigencia |
| `fecha_fin` | DATE | Fecha de fin de vigencia |
| `activo` | BOOLEAN | Si está activa (true/false) |
| `posicion` | INTEGER | Orden de visualización (menor = mayor prioridad) |
| `url_enlace` | TEXT | URL de destino del anuncio |
| `descuento_porcentaje` | DECIMAL(5,2) | Porcentaje de descuento (0-100) |
| `productos_aplicables` | TEXT[] | Array de IDs de medicamentos aplicables |
| `codigo_promocional` | VARCHAR(50) | Código promocional único |
| `limite_usos` | INTEGER | Número máximo de usos del código |
| `usos_actuales` | INTEGER | Número actual de usos |
| `created_at` | TIMESTAMP | Fecha de creación |
| `updated_at` | TIMESTAMP | Fecha de última actualización |
| `created_by` | INTEGER | ID del usuario que creó el anuncio |

## 🏷️ Tipos de Publicidad

- **banner**: Banners principales de la página
- **promocion**: Promociones generales (3x2, etc.)
- **descuento**: Descuentos por porcentaje
- **oferta_especial**: Ofertas especiales por tiempo limitado
- **evento**: Eventos y campañas especiales
- **informativa**: Información general para clientes

## 📊 Consultas Útiles

### Ver publicidad vigente
```sql
SELECT * FROM obtener_publicidad_vigente();
```

### Ver publicidad vigente por tipo
```sql
SELECT * FROM obtener_publicidad_vigente('promocion');
```

### Ver promociones con descuento activas
```sql
SELECT 
    titulo,
    descuento_porcentaje,
    codigo_promocional,
    fecha_inicio,
    fecha_fin
FROM publicidad 
WHERE activo = true 
    AND CURRENT_DATE BETWEEN fecha_inicio AND fecha_fin
    AND descuento_porcentaje IS NOT NULL
ORDER BY descuento_porcentaje DESC;
```

### Ver estadísticas por tipo
```sql
SELECT 
    tipo_publicidad,
    COUNT(*) as total,
    COUNT(CASE WHEN activo = true THEN 1 END) as activos,
    COUNT(CASE WHEN activo = true AND CURRENT_DATE BETWEEN fecha_inicio AND fecha_fin THEN 1 END) as vigentes
FROM publicidad 
GROUP BY tipo_publicidad
ORDER BY tipo_publicidad;
```

### Ver códigos promocionales más usados
```sql
SELECT 
    codigo_promocional,
    titulo,
    usos_actuales,
    limite_usos,
    CASE 
        WHEN limite_usos IS NULL THEN 0
        ELSE ROUND((usos_actuales::DECIMAL / limite_usos) * 100, 2)
    END as porcentaje_uso
FROM publicidad 
WHERE codigo_promocional IS NOT NULL
    AND usos_actuales > 0
ORDER BY usos_actuales DESC;
```

## 🔧 Funciones Auxiliares

### obtener_publicidad_vigente()

Obtiene toda la publicidad que está activa y vigente en la fecha actual.

```sql
-- Toda la publicidad vigente
SELECT * FROM obtener_publicidad_vigente();

-- Solo promociones vigentes
SELECT * FROM obtener_publicidad_vigente('promocion');

-- Solo banners vigentes
SELECT * FROM obtener_publicidad_vigente('banner');
```

## 📝 Ejemplos de Uso

### Crear nueva promoción
```sql
INSERT INTO publicidad (
    titulo, 
    descripcion, 
    tipo_publicidad, 
    fecha_inicio, 
    fecha_fin, 
    descuento_porcentaje, 
    codigo_promocional,
    limite_usos
) VALUES (
    'Descuento Medicamentos Básicos',
    'Descuento del 15% en medicamentos básicos',
    'descuento',
    '2025-10-01',
    '2025-10-31',
    15.00,
    'BASICOS15',
    100
);
```

### Actualizar uso de código promocional
```sql
-- Incrementar uso de código promocional
UPDATE publicidad 
SET usos_actuales = usos_actuales + 1 
WHERE codigo_promocional = 'BASICOS15';
```

### Desactivar promoción vencida
```sql
UPDATE publicidad 
SET activo = false 
WHERE fecha_fin < CURRENT_DATE 
    AND activo = true;
```

## 🚨 Validaciones y Constraints

- **Fechas válidas**: `fecha_fin >= fecha_inicio`
- **Descuento válido**: `descuento_porcentaje BETWEEN 0 AND 100`
- **Código promocional único**: No pueden existir códigos duplicados
- **Tipos válidos**: Solo se permiten los tipos definidos en el CHECK constraint

## 📈 Índices de Rendimiento

- `idx_publicidad_tipo`: Búsquedas por tipo de publicidad
- `idx_publicidad_activo`: Filtros por estado activo
- `idx_publicidad_fechas`: Consultas por rango de fechas
- `idx_publicidad_posicion`: Ordenamiento por posición
- `idx_publicidad_codigo`: Búsquedas por código promocional
- `idx_publicidad_titulo`: Búsquedas de texto en título

## 💡 Mejores Prácticas

1. **Gestión de fechas**: Siempre verificar que las fechas sean lógicas
2. **Códigos promocionales**: Usar códigos descriptivos y únicos
3. **Posicionamiento**: Usar números bajos para mayor prioridad
4. **Límites de uso**: Definir límites para evitar abuso
5. **Imágenes**: Usar URLs válidas y optimizadas
6. **Tipos claros**: Usar el tipo más específico para cada anuncio

## 🔄 Mantenimiento

### Limpieza automática de publicidad vencida
```sql
-- Desactivar publicidad vencida (ejecutar periódicamente)
UPDATE publicidad 
SET activo = false 
WHERE fecha_fin < CURRENT_DATE 
    AND activo = true;
```

### Reporte de uso de códigos promocionales
```sql
SELECT 
    codigo_promocional,
    titulo,
    usos_actuales,
    limite_usos,
    fecha_inicio,
    fecha_fin,
    CASE 
        WHEN fecha_fin < CURRENT_DATE THEN 'Vencida'
        WHEN limite_usos IS NOT NULL AND usos_actuales >= limite_usos THEN 'Agotada'
        ELSE 'Disponible'
    END as estado
FROM publicidad 
WHERE codigo_promocional IS NOT NULL
ORDER BY usos_actuales DESC;
```