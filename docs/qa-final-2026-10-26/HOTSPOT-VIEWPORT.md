# Hotspots: ajuste del viewport — 26 octubre 2026

Solicitud posterior a la entrega: rellenar el ancho y la altura disponibles en la pantalla inicial, incluyendo móvil, sin franjas laterales.

Se sustituye el límite anterior de 82svh/900px y el escalado para mostrar la composición completa. El nuevo contenedor ocupa el ancho disponible y descuenta el espacio superior de la pantalla. Las imágenes mantienen su proporción mediante un recorte centrado (`object-fit: cover`), sin deformación. El resto del contenido de la página sigue accesible al hacer scroll; la imagen no excede la primera pantalla.

Los hotspots se recalculan desde las coordenadas porcentuales de la imagen para compensar el recorte. Los puntos cuyo producto quede fuera del encuadre no se muestran ni reciben foco invisible. Se conserva el selector de imagen móvil con fallback a escritorio y las coordenadas configuradas en Shopify. Al sustituir la composición de una fotografía deben revisarse esas coordenadas en el editor.

Se actualiza el tamaño responsivo de escritorio a `100vw`, con variantes hasta 3200 px según la resolución del original. No se reemplazan imágenes ni configuraciones guardadas en el tema remoto.

Prueba reproducible: `tests/hotspot-viewport.cjs`. Evidencia: `hotspot-viewport-results.json`. Comprueba seis páginas, Chromium y WebKit, resoluciones 1440×900, 1920×1080, 390×844 y 360×656; ancho completo, borde inferior en el viewport, ausencia de desbordamiento horizontal, correspondencia de puntos con el recorte y apertura/cierre del panel. Son navegadores automatizados, no pruebas en teléfonos físicos.

Despliegue limitado a `assets/custom-hotspot.css`, `assets/hotspot-viewport.js` y `sections/custom-hotspot.liquid` en el tema 155700854963, `lucystore/seo-optimized-final`, sin publicar.
