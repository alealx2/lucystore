# Pruebas de la entrega final

Ejecutar desde la raíz del tema. Requieren Node y Playwright con Chromium y WebKit, y LiquidJS para las pruebas de render. Las dependencias de QA se instalaron fuera del repositorio en `/tmp/lucystore-qa-tools`; el proyecto no necesita dependencias JavaScript para funcionar en Shopify.

Iniciar un preview autenticado **del borrador de pruebas**, nunca del tema publicado:

```sh
shopify theme dev --store mcyuvw-rf.myshopify.com --theme 155700854963 --port 9293 --live-reload off
```

Suites:

- `qa-final.cjs`: storefront real, seis temporadas a 1280/1440/1920/360 px, encabezados, hotspots, menú, páginas, producto, búsqueda y carrito aislado. Solo la línea de carrito marcada `_qa=seo-optimized-final` se elimina al terminar.
- `mobile-storefront.cjs`: seis temporadas, paneles y navegación en Android emulado, iPhone emulado con WebKit y WebKit de escritorio.
- `hero-regression.cjs`: regresión del componente de producción con fixtures controlados, contador/dots/numbers, movimiento reducido, foco, hover y recarga de sección. El iframe externo se simula aquí; la integración real se comprueba por separado.
- `liquid-regression.cjs`: render de la plantilla real de metadatos con perfiles válidos/inválidos y actualización del cuerpo de página.
- `shopify-config-regression.cjs`: cambia temporalmente `templates/index.json` en el borrador conectado, prueba medios realmente renderizados por Shopify y restaura el archivo. Lee la referencia de video existente desde `/tmp/lucystore-live-reference-20261026/templates/index.json`. Se obtiene con `shopify theme pull` del tema 155637121203 a esa carpeta temporal, solo `templates/index.json`.
- `social-config-regression.cjs`: cambia temporalmente el ajuste social del borrador y verifica el HTML real; restaura el archivo al terminar. No cambia la cuenta social ni la configuración del tema publicado.

Resolver Playwright y LiquidJS mediante `NODE_PATH`, por ejemplo:

```sh
NODE_PATH=/ruta/a/node_modules node tests/qa-final.cjs
NODE_PATH=/ruta/a/node_modules node tests/mobile-storefront.cjs
NODE_PATH=/ruta/a/node_modules node tests/hero-regression.cjs
NODE_PATH=/ruta/a/node_modules node tests/liquid-regression.cjs
NODE_PATH=/ruta/a/node_modules node tests/shopify-config-regression.cjs
node tests/social-config-regression.cjs
```

La regresión del hero espera un MP4 de prueba en `/tmp/lucystore-qa-flower.mp4`. Se usó el clip CC0 de MDN: `https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4`. No se subió al catálogo ni quedó configurado en el tema final.

Los scripts de configuración restauran sus archivos en `finally` y al recibir SIGINT/SIGTERM. No ejecutar esas dos suites simultáneamente ni editar sus archivos de configuración durante la prueba. Si el proceso se mata forzosamente, revisar y restaurar la configuración antes de subir el tema.

Las pruebas con perfiles de dispositivo son emulaciones, no pruebas en teléfonos físicos. El proxy local introduce diferencias de caché y red; Lighthouse sobre este proxy no equivale a métricas de producción.
