# PharmaCenter

## tests


---

## ⚙️ 1. Pruebas del Backend (API)

Estas pruebas verifican el comportamiento de los endpoints definidos en `app.js` usando **Jest + Supertest**.

### ✅ Qué se prueba:

- `/ping` responde correctamente.
- `/api/medicamentos` responde con una lista. (marcara siempre error al no estar conectada a la base de datos pero se puede usar como ejemplo)
- `/api/medicamentos` rechaza datos inválidos en un POST.

### ▶️ ¿Cómo se ejecutan?

1. Asegúrate de que el contenedor de base de datos esté en marcha (si no usas mocks).
2. Ejecuta desde la carpeta `backend/`:

bash
# En contenedor:
 npm test


## Frontend

### ✅ Qué se prueba:

que todos los componentes del main esten siendo renderizados

Desde la carpeta raiz del frontend es decir pharmacenter

### Corre todas las pruebas
npx vitest run


