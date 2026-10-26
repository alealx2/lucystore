# Entrega de correcciones finales de Via Luci

Fecha de entrega técnica: 26 de octubre de 2026. Referencia: revisión QA del cliente del 23 de octubre.

Se implementaron QA 01–08 en la rama `seo-optimized-final` y se cargaron en un tema nuevo, sin publicar. La validación comprende el storefront renderizado por Shopify, Chromium, WebKit y perfiles móviles emulados. Las pruebas en teléfonos físicos y las comprobaciones de producción que se detallan al final no se presentan como completadas.

## Identificación de la entrega

- Tienda: mcyuvw-rf.myshopify.com, dominio vialuci.com.
- Tema definitivo de esta ronda: **lucystore/seo-optimized-final**.
- ID: **155700854963**, rol **unpublished**.
- Vista previa: https://mcyuvw-rf.myshopify.com/?preview_theme_id=155700854963
- Editor: https://admin.shopify.com/store/mcyuvw-rf/themes/155700854963/editor
- Rama: **seo-optimized-final**, creada desde la revisión local **2bc9ec3**.
- Destinos de código: alealx2/lucystore y el archivo privado solicitado chermes34/via-luci-shopify-archive. El identificador del commit se incluye en el comprobante final de entrega y en la respuesta de cierre.

Los temas antiguos 155274412211 y 155273167027 no son la entrega final. No se eliminó ninguna copia ni se cambió el tema publicado. La configuración final conserva las tres imágenes del hero del tema revisado por el cliente; la rotación automática está disponible mediante su ajuste del editor, cuyo valor original desactivado se conserva. Los videos y perfiles sociales empleados temporalmente para QA se retiraron de esa configuración al terminar.

## QA 01 Rotación automática y medios del hero

**Corrección:** reducedMotion se inicializa en cada SlideshowComponent. Se unificó el control de rotación, foco y hover sin depender de announcementBarSlider. El control de pausa detiene el temporizador y los usuarios con movimiento reducido no reciben reproducción automática. La selección de un bloque en el editor pausa la rotación y muestra ese bloque.

Los videos HTML5 ocultos se pausan y los iframes externos se descargan al ocultarse. La reproducción automática permanece silenciada. Hay controles de reproducción manual, también para un hero de una sola pieza de video. Se eliminó la lógica duplicada de navegación que competía con el componente principal. YouTube y Vimeo se construyen a partir del id y tipo del ajuste video_url, evitando tratar ese ajuste como un objeto externo de producto.

**Pruebas:** 15 comprobaciones sobre configuraciones realmente renderizadas por Shopify: imagen/video cargado, video cargado/video cargado, imagen/MP4 directo, MP4/MP4 e imagen/YouTube, en Chromium de escritorio, Android emulado y WebKit con perfil de iPhone. Se reutilizó temporalmente un video que ya existía en Files; no se subió contenido nuevo al catálogo. Se comprobó rotación, estado de reproducción y silencio. El iframe de YouTube se activó correctamente; las restricciones de red o permisos de reproducción de cada video siguen dependiendo del proveedor.

Otras 33 regresiones controladas del componente verifican imagen/imagen, medios mixtos, pausa, foco, hover, movimiento reducido, indicadores y selección y reemplazo de sección del editor en los tres perfiles. En esas regresiones el iframe se simula; no se utiliza esa simulación como prueba de streaming externo. La rama Vimeo está implementada; no se verificó streaming con un enlace de Vimeo del cliente.

**Evidencia:** shopify-hero-results.json y hero-regression-results.json, además de capturas de las configuraciones temporales. La configuración del hero se restauró y se contrastó con la copia de referencia.

## QA 02 Altura de las imágenes estacionales

**Corrección:** el canvas de escritorio limita la composición a 82 % de la altura del viewport, con techo de 900 px. La imagen completa se escala proporcionalmente, sin recortar su contenido. Los porcentajes de los hotspots se calculan sobre el mismo canvas escalado. Se ajustó también la selección de tamaños de imagen para no solicitar siempre una imagen de ancho completo de pantalla.

**Pruebas:** Christmas Exterior, Christmas Interior, Halloween, Harvest, Patriotic y Everyday a 1280, 1440 y 1920 px de ancho y a 360 px en Chromium. En escritorio con viewport de 900 px de alto, las imágenes quedaron en torno a un máximo de 738 px, frente a los 1898–2248 px señalados. Se verificaron proporciones, posiciones de hotspots y ausencia de desbordamiento horizontal. Las seis temporadas se repitieron con Android emulado, WebKit móvil y WebKit de escritorio, incluyendo abrir y cerrar el panel de producto.

**Evidencia:** storefront-results.json, mobile-storefront-results.json y capturas de las seis temporadas en escritorio y móvil. Mantener la composición completa deja márgenes laterales en las fotografías verticales; es intencional para conservar imagen y hotspots.

## QA 03 Encabezados de las seis temporadas

**Corrección:** custom-hotspot incorpora un control de encabezado principal con el título de la página. Está activado en las seis plantillas estacionales; no depende del campo opcional de título del hotspot ni de introducir HTML en el contenido.

**Pruebas:** un H1 no vacío por página en los tamaños y motores anteriores. La sección main-page permanece desactivada en estas plantillas para no duplicar el encabezado ni desplazar la composición.

**Evidencia:** las matrices de storefront y móvil registran los títulos y dimensiones renderizados.

## QA 04 Capa del menú sin desenfoque

**Corrección:** se retiraron backdrop-filter y su variante WebKit de todas las reglas de la capa del menú, incluidas las que sobrescribían estilos anteriores. Se conserva la capa translúcida, su transición de opacidad y la integración con el borde inferior del menú.

**Pruebas:** el estilo computado devuelve none en Chromium y WebKit de escritorio al abrir Shop. La navegación del drawer se comprobó con los perfiles de Android y iPhone. No se ha ejecutado una prueba en Safari de un iPhone físico.

## QA 05 Compatibilidad de X y Twitter

**Corrección:** twitter:site admite x.com y twitter.com, con normalización de www, barra final, parámetros y fragmentos. Solo se emite un usuario válido de hasta 15 caracteres con letras, números o guion bajo. Se omiten dominios ajenos, rutas de estado, rutas reservadas, valores vacíos y nombres inválidos.

**Pruebas:** 11 entradas válidas e inválidas renderizadas con la plantilla real de metadatos. Otras cuatro comprobaciones sobre el HTML servido por Shopify probaron X con parámetros, Twitter con barra final, un nombre inválido y un valor vacío. El ajuste social original quedó restaurado. No se modificó la cuenta social.

**Evidencia:** liquid-results.json y shopify-social-results.json.

## QA 06 Correspondencia entre página y contenido

**Corrección:** la plantilla predeterminada muestra page.title y page.content. La sección fija de garantía queda guardada pero desactivada allí; seguimiento y devoluciones ya no heredan el texto de garantía. Se añadió un fondo de color de esquema para que el texto resulte legible. La plantilla de contacto conserva su formulario y permite mostrar el título y cuerpo propios. La plantilla dedicada de garantía utiliza el título y cuerpo de su página mediante un ajuste explícito.

**Pruebas:** se inspeccionaron seguimiento, devoluciones, contacto y garantía. Seguimiento muestra su texto real y no el texto de garantía. Una regresión Liquid verifica que cambiar el contenido del recurso cambia el HTML sin tocar la plantilla. Las capturas posteriores a la corrección de contraste se incluyen en la evidencia.

**Contenido pendiente:** devoluciones y garantía tienen el cuerpo de página vacío en la muestra inspeccionada. El formulario de contacto sí permanece disponible. No se inventaron textos ni se copiaron condiciones legales a páginas que no les corresponden. El texto antiguo de garantía permanece en los ajustes de su sección, pero no sustituye automáticamente un cuerpo de página vacío cuando está activado el uso del contenido real.

## QA 07 Cierre con Escape

**Corrección:** Escape cierra el menú en una fase de captura que evita competir con los controladores de Dawn. Cancela aperturas y cierres pendientes, retira las clases de capa y bloqueo de scroll, restablece aria-expanded y devuelve el foco a Shop. Se evitó que el foco restaurado o un hover todavía activo reabrieran el menú inmediatamente.

Se corrigió además un error de inicialización del scroll en móvil y se retiró una regla que quitaba indiscriminadamente el foco de los enlaces y botones al hacer clic.

**Pruebas:** apertura, Escape, foco en SUMMARY, ausencia de detalles abiertos y clases de bloqueo, y nueva apertura. Pasaron en Chromium y WebKit de escritorio. Se probaron también navegación móvil y cierre de paneles de hotspots y de su modal de producto.

## QA 08 Counter y otros indicadores

**Corrección:** se restauraron las etiquetas de diapositiva actual y total. El mismo componente actualiza Counter, Dots y Numbers, sin un segundo controlador de navegación.

**Pruebas:** secuencia 1 → 2 → 1 en el hero real y comprobaciones de los tres estilos de indicador en Chromium, Android emulado y WebKit móvil. Las flechas siguen funcionando y el indicador activo cambia correctamente.

## Comprobaciones complementarias

- **Revisión estática:** Theme Check con 0 errores y 15 advertencias preexistentes o no bloqueantes. Pasaron la comprobación de sintaxis JavaScript y git diff --check. El diagnóstico completo se incluye en theme-check-final.json.
- **Producto y galería:** Cascade genera datos ProductGroup/Product y ofertas, conserva la canónica del producto y permite cambiar imágenes de galería.
- **Búsqueda:** la búsqueda de Cascade muestra resultados en el storefront.
- **Carrito:** se añadió y retiró una línea de prueba en un navegador aislado. No se utilizó el carrito ni la sesión de compra del usuario y no se realizó checkout.
- **Variantes y actualizaciones de catálogo:** el catálogo público muestreado no ofreció un producto con múltiples variantes para repetir la prueba real en esta ronda. Las pruebas del 8 de octubre con el producto QA en borrador no se presentan como una repetición actual. Queda por repetir cambios de precio, imagen y disponibilidad y selección múltiple con una muestra autorizada y disponible.
- **Dispositivos:** Android y iPhone son perfiles emulados. WebKit prueba ese motor, pero no certifica Safari en un teléfono físico ni una versión concreta instalada por el cliente.

## Rendimiento móvil y SEO público

Se ejecutó Lighthouse sobre el preview local autenticado con emulación móvil. En la medición con throttling de DevTools se obtuvieron rendimiento 73, accesibilidad 95, buenas prácticas 73 y SEO 92; LCP 4,8 s, TBT 20 ms y CLS 0. La corrida con simulación Lantern dio rendimiento 62 y LCP 48,8 s. Se conservan ambas para mostrar la variación del entorno y no seleccionar solo el resultado favorable.

Estas mediciones incluyen el proxy de desarrollo, HTTP local, aplicaciones de terceros y contenido actual. No equivalen a una certificación de producción ni a datos de usuarios reales. Permanecen oportunidades de peso de imágenes, recursos no utilizados y scripts externos. El LCP no está aprobado como objetivo de producción; debe medirse nuevamente sobre la URL y tema definitivos, con caché y condiciones de lanzamiento. INP requiere interacciones representativas o datos de campo y no se da por validado con estas corridas.

La comprobación pública del 26 de octubre obtuvo HTTP 200 en el dominio principal, sitemap y robots. El sitemap nativo es XML válido y sus cinco mapas secundarios respondieron 200. Se identificaron 62 URLs en el mapa de productos, 18 de páginas, 28 de colecciones, una de blogs y una de descubrimiento agentic; las imágenes de Shopify CDN se comprobaron separadamente como entradas de imagen, no como páginas fuera del dominio. No apareció el handle del producto QA ni URLs de preview en esos mapas. robots declara https://vialuci.com/sitemap.xml. No se creó un sitemap manual ni se modificó robots o Search Console.

**Observación de protección:** el dominio principal ya respondió públicamente, sin redirigir a contraseña, en esta revisión. No se alteró esa configuración durante el trabajo. El tema final sigue sin publicar, pero eso no implica que la tienda principal esté privada. Si debe mantenerse cerrada hasta la aprobación, el responsable debe reactivar y comprobar la protección desde Shopify.

## Estado de las pruebas y dependencias finales

Las seis matrices de evidencia suman 75 comprobaciones contra storefront o configuraciones reales de Shopify y 45 regresiones controladas, todas aprobadas al cierre. Los archivos JSON distinguen las suites y sus condiciones; no equivalen a 120 pruebas en dispositivos físicos.

Antes de aprobar el lanzamiento quedan las pruebas en iPhone y Android físicos, la muestra actual de producto con varias variantes y actualizaciones de catálogo, el streaming de un enlace Vimeo si se utilizará, la medición de rendimiento de producción y la decisión sobre protección de la tienda. Los textos comerciales pendientes siguen siendo responsabilidad del cliente. No se enviaron correos, no se hizo checkout, no se publicó el tema y no se sustituyó el tema activo.

La carpeta qa-final-2026-10-26 contiene matrices JSON, capturas y las dos corridas Lighthouse. La carpeta tests incluye los scripts y sus instrucciones, con restauración de la configuración temporal.
