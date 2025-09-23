-- Seeds adicionales para la tabla publicidad
-- Datos de ejemplo para promociones y anuncios

-- Limpiar datos existentes de publicidad (opcional)
-- DELETE FROM publicidad;

-- ============================================
-- PUBLICIDAD ADICIONAL DE EJEMPLO
-- ============================================

INSERT INTO publicidad (
    titulo, 
    descripcion, 
    tipo_publicidad, 
    imagen_url, 
    fecha_inicio, 
    fecha_fin, 
    activo, 
    posicion, 
    url_enlace,
    descuento_porcentaje, 
    codigo_promocional, 
    limite_usos,
    productos_aplicables
) VALUES 

-- Banners principales
('Gran Apertura Nueva Sucursal', 
 'Te invitamos a conocer nuestra nueva sucursal en el centro de la ciudad', 
 'banner', 
 'https://example.com/nueva-sucursal.jpg', 
 '2025-09-25', 
 '2025-10-25', 
 true, 
 0, 
 '/sucursales/nueva',
 NULL, 
 NULL, 
 NULL,
 NULL
),

-- Ofertas especiales
('Mes del Corazón - Descuento en Cardiológicos', 
 'Cuida tu corazón con 15% de descuento en medicamentos cardiológicos durante septiembre', 
 'descuento', 
 'https://example.com/cardio-promo.jpg', 
 '2025-09-01', 
 '2025-09-30', 
 true, 
 1, 
 '/categorias/cardiologicos',
 15.00, 
 'CORAZON15', 
 50,
 '{1,4,8}' -- IDs de medicamentos aplicables
),

-- Promociones temporales
('Black Friday Farmacia', 
 'Descuentos increíbles en medicamentos seleccionados - Solo por tiempo limitado', 
 'oferta_especial', 
 'https://example.com/black-friday.jpg', 
 '2025-11-24', 
 '2025-11-26', 
 false, 
 1, 
 '/ofertas/black-friday',
 25.00, 
 'BLACKFRIDAY25', 
 1000,
 '{1,2,3,4,5,6,7,8,9,10}'
),

-- Eventos y campañas
('Campaña de Vacunación Gratuita', 
 'Únete a nuestra campaña de vacunación contra la influenza - Completamente gratuita', 
 'evento', 
 'https://example.com/vacunacion.jpg', 
 '2025-10-01', 
 '2025-11-30', 
 true, 
 2, 
 '/servicios/vacunacion',
 NULL, 
 NULL, 
 NULL,
 NULL
),

-- Banners informativos
('Consulta Farmacéutica Gratuita', 
 'Nuestros farmacéuticos están disponibles para resolver tus dudas sin costo', 
 'informativa', 
 'https://example.com/consulta-gratis.jpg', 
 '2025-09-01', 
 '2026-09-01', 
 true, 
 4, 
 '/servicios/consulta',
 NULL, 
 NULL, 
 NULL,
 NULL
),

-- Descuentos por fidelidad
('Club de Fidelidad - 10% Extra', 
 'Únete a nuestro club de fidelidad y recibe 10% adicional en todas tus compras', 
 'promocion', 
 'https://example.com/club-fidelidad.jpg', 
 '2025-09-23', 
 '2026-09-23', 
 true, 
 3, 
 '/club/registro',
 10.00, 
 'CLUB10', 
 500,
 NULL
),

-- Promoción para adultos mayores
('Descuento Tercera Edad', 
 'Adultos mayores de 65 años reciben 20% de descuento en medicamentos recetados', 
 'descuento', 
 'https://example.com/tercera-edad.jpg', 
 '2025-09-01', 
 '2026-09-01', 
 true, 
 5, 
 '/descuentos/tercera-edad',
 20.00, 
 'TERCERAEDAD20', 
 NULL,
 NULL
)

ON CONFLICT (codigo_promocional) DO NOTHING;

-- ============================================
-- ACTUALIZAR CONTADORES
-- ============================================

-- Simular algunos usos de códigos promocionales
UPDATE publicidad 
SET usos_actuales = 25 
WHERE codigo_promocional = 'VITAMINAS20';

UPDATE publicidad 
SET usos_actuales = 15 
WHERE codigo_promocional = '3X2BASICOS';

UPDATE publicidad 
SET usos_actuales = 8 
WHERE codigo_promocional = 'CORAZON15';

-- ============================================
-- MENSAJE DE CONFIRMACIÓN
-- ============================================

DO $$
BEGIN
    RAISE NOTICE '🎯 Seeds de publicidad ejecutados correctamente';
    RAISE NOTICE '   - % anuncios/promociones creados', (SELECT COUNT(*) FROM publicidad);
    RAISE NOTICE '   - % promociones activas', (SELECT COUNT(*) FROM publicidad WHERE activo = true);
    RAISE NOTICE '   - % promociones vigentes hoy', (SELECT COUNT(*) FROM publicidad WHERE activo = true AND CURRENT_DATE BETWEEN fecha_inicio AND fecha_fin);
END $$;