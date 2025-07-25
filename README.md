# PharmaCenter

PharmaCenter es una aplicación diseñada para la gestión eficiente de farmacias, permitiendo el control de inventario, ventas, compras y clientes de manera sencilla y centralizada.

## Características principales

- Gestión de productos e inventario
- Registro y control de ventas y compras
- Administración de clientes y proveedores
- Reportes y estadísticas
- Interfaz intuitiva y fácil de usar

## Instalación

1. Clona este repositorio:
   ```bash
   git clone https://github.com/tuusuario/PharmaCenter.git
   ```
2. Accede al directorio del proyecto:
   ```bash
   cd PharmaCenter
   ```
3. Instala las dependencias:
   ```bash
   npm install
   ```
4. Configura las variables de entorno según sea necesario.

## Uso

Inicia la aplicación con el siguiente comando:

```bash
npm start
```

Luego, abre tu navegador y accede a `http://localhost:3000` para comenzar a utilizar PharmaCenter.

## Contribuciones

¡Las contribuciones son bienvenidas! Por favor, abre un issue o envía un pull request para sugerencias y mejoras.

## Licencia

Este proyecto está bajo la licencia MIT.

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


