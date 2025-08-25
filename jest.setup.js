require('@testing-library/jest-dom');

// Solo cargar jest-dom en entorno Jest
if (typeof global.expect !== 'undefined') {
  // Ya está en entorno Jest, jest-dom ya se cargó
}
