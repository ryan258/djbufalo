# 101 prompts para usar esto, para la joda y para la guita

Qué es "esto": el sitio de DJ Bufalo. Hugo, copy bilingüe ES/EN manejado con `data-i18n`,
contenido en YAML adentro de `data/`, un design system cerrado con llave
(`design-system.md`, `style-guide.md`), un player de audio hecho a mano en
`assets/js/main.js`, y un deploy a GitHub Pages que vive colgado de un subpath y pasa sí o
sí por `node main.test.js` y `./scripts/check-subpath.sh`.

Cómo se usa: copiás uno y lo pegás en Claude Code parado en la raíz del repo. Lo que está
entre `<corchetes angulares>` lo cambiás vos. Van de a uno: si le tirás cuatro cosas
juntas, una que toca el design system te sale para atrás.

---

## A. Contenido y data (1–12)

1. Metele una fecha nueva en `data/fechas.yaml` para `<venue>` el `<fecha>`, y su `content/fechas/<slug>.md` calcado de la forma de `content/fechas/galpon-12.md`.
2. Poné la fecha `<slug>` como agotada y fijate que el cartel AGOTADO / SOLD OUT aparezca posta en `layouts/partials/fechas.html` y en `layouts/fechas/list.html`.
3. Partí `data/fechas.yaml` en fechas que vienen y fechas que ya pasaron, en tiempo de render, y las viejas mandalas a una sección plegada abajo de todo.
4. Sumá un set a `data/sets.yaml` con id, título bilingüe, duración y BPM, y enganchale su clip de preview en `static/audio/`.
5. Ordená los sets por fecha, del más nuevo al más viejo, al renderizar — no confiemos en el orden en que quedaron tipeados en el YAML.
6. Agregale un campo `tracklist` a cada set en `data/sets.yaml` y mostralo como lista desplegable en `layouts/sets/single.html`.
7. Cargá un release en `data/releases.yaml` con número de catálogo, sello y links de streaming, sin perder el trato mono de la metadata.
8. Sumá `stock` a `data/merch.yaml` y dale un estado propio a lo que está en cero.
9. Armá un rider imprimible de una carilla desde `data/rider.yaml`, con su `@media print`.
10. Pasá por todos los archivos de `data/` y decime dónde falta la pareja bilingüe: cualquier `*_es` que se quedó sin su `*_en`. Archivo y línea.
11. Creá `data/prensa.yaml` con citas de prensa y armá una tira de frases destacadas en la página de bio.
12. Escribí un shortcode de Hugo para la línea de metadata seca (BPM / duración / coordenadas) que pueda tirar en cualquier markdown.

## B. Bilingüe (13–20)

13. Buscame todo string en castellano hardcodeado en `layouts/` que no tenga su `data-i18n` al lado. Listalo por archivo y línea.
14. Agregá portugués como tercer idioma sin convertir el toggle en un dropdown — con tres todavía es un toggle.
15. Guardá el idioma elegido en `localStorage` y aplicalo antes del primer pintado, así el que lee en inglés no se come el flash en castellano.
16. Verificá que el `<html lang>` cambie de verdad al togglear, y que un lector de pantalla agarre el idioma correcto en cada bloque.
17. Sacá los strings de i18n de los atributos inline y llevalos a `i18n/es.toml` y `i18n/en.toml`, usando la función `i18n` de Hugo donde el string ya se conoce en build.
18. Poné alternates `hreflang` para las versiones ES y EN de cada página.
19. Marcame todo `title_en` idéntico letra por letra a su `title_es` y decime cuáles son nombres propios y cuáles quedaron sin traducir nomás.
20. Sumá un chequeo en `main.test.js` que reviente si algún elemento con `data-i18n` se quedó sin su texto en inglés.

## C. Design system (21–30)

21. Auditá `assets/sass/` contra `design-system.md` y cantame todo color literal que no sea uno de los cinco tokens cerrados.
22. Medí cuánto ámbar y cuánto violeta hay realmente en el home renderizado y decime si aguanta la proporción 85 / 12 / 3.
23. Encontrá todas las intervenciones en violeta del sitio y marcame cualquier sección de viewport que se mandó con más de una.
24. Confirmá que ningún texto renderizado baje de 10px y que el cuerpo se mantenga en 13–14px como piso.
25. Pasá los espaciados que quedaron hardcodeados en `_layout.scss` a la escala numérica de `design-system.md`.
26. Armá una página `/styleguide` con todos los tokens, todos los pasos tipográficos y todos los componentes juntos, y dejala afuera del sitemap.
27. Revisá cómo se usa el mascota en todas las páginas contra la regla de `style-guide.md` — su presencia no se explica — y marcá todo lo que lo explique de más.
28. El sitio es oscuro por diseño: confirmá que no se rompe nada si el usuario fuerza `prefers-color-scheme: light`.
29. Cambiá toda sombra o degradé que huela a flyer de boliche genérico por el trato plano de archivo que pide el style guide.
30. Comparé la tipografía renderizada contra la tabla de baseline desktop de `style-guide.md` y decime cuánto se corrió.

## D. Player de audio (31–40)

31. Atajo de teclado global: la barra espaciadora play/pausa el track actual, salvo que el foco esté adentro de un campo de formulario.
32. Sumá barra de progreso arrastrable con el tiempo transcurrido / restante en la mono de utilidad.
33. Que el set sonando y su posición sobrevivan al cambio de página, usando `sessionStorage`.
34. Poné anterior/siguiente en la barra del player, caminando `data/sets.yaml` en orden de render.
35. Que la barra del player se achique a una tira fina al bajar y se despliegue al subir, sin mover el layout.
36. Generá una miniatura de forma de onda en build desde los WAV de `static/audio/` y ponela atrás de la barra de progreso.
37. Precargá solamente el primer clip; el resto que cargue recién cuando el tipo toca algo.
38. Auditá el camino del sintetizador de respaldo: confirmá que nunca suena arriba de un clip real y que corta limpio al pausar.
39. Control de volumen que se acuerde de dónde quedó y que respete las políticas de autoplay y movimiento reducido del sistema.
40. Chequeá que el `aria-label` del botón de play alterne entre reproducir y pausar con el título del track adentro, en los dos idiomas.

## E. Performance y assets (41–50)

41. Generá variantes `srcset` responsive para toda imagen de `static/images/` y actualizá los templates para usarlas.
42. Pasá las miniaturas de sets a AVIF con WebP de respaldo y decime cuántos bytes ahorramos.
43. Decime el peso total de transferencia del home y rankeame los cinco assets más pesados.
44. Ponele `width` y `height` a cada `<img>` para que no salte nada mientras carga.
45. Meté el CSS crítico del hero inline y diferí el resto.
46. Revisá `main.js` buscando todo lo que corre antes del primer pintado y corré lo que se pueda para después.
47. Fingerprint y gzip para todos los assets en build, y confirmá que el fingerprint cambia de verdad cuando cambia el fuente.
48. Encontrá cualquier archivo de fuente que se esté cargando y que ninguna página renderizada use realmente.
49. Buscá toda imagen que el navegador esté achicando más de 2x — eso son bytes tirados a la basura.
50. Que el build se caiga si algún asset suelto pasa los 200KB sin estar en una lista de excepciones explícita.

## F. SEO y redes (51–59)

51. Generá un `sitemap.xml` que deje afuera la página de EPK y todo lo que esté en borrador.
52. Sumá datos estructurados JSON-LD `MusicGroup` y `Event` alimentados desde `data/fechas.yaml`.
53. Escribí `description` en el front matter de cada página de `content/`, en castellano, acorde al locale `es-AR`.
54. Verificá que la imagen de Open Graph sea 1200x630 y que nada importante quede en los márgenes que se recortan.
55. Agregá los meta de Twitter card y validá el set de tags contra la especificación vigente.
56. Poné un link `canonical` en cada página que respete el subpath de GitHub Pages.
57. Generá un RSS solamente para la sección de fechas.
58. Revisá que `static/robots.txt` no esté bloqueando nada que necesiten los crawlers de preview social.
59. Auditá todo link saliente por `rel="noopener"` y comportamiento correcto de target.

## G. Accesibilidad (60–67)

60. Chequeá el contraste de cada par texto/fondo del sitio renderizado contra WCAG AA y listame las que no pasan, con el ratio medido.
61. Recorré todo el sitio con Tab y cantame cualquier trampa de foco, anillo de foco invisible u orden de tabulación mal puesto.
62. Verificá que el skip link mueva el foco de verdad, no solamente el scroll.
63. Confirmá que todo elemento interactivo se pueda operar solo con teclado — botones de play y toggle de idioma incluidos.
64. Sumá manejo de `prefers-reduced-motion` a cada animación y transición de `_components.scss`.
65. Revisá todas las regiones `aria-live` por anuncio de más: el player no tiene que estar hablando en cada tick.
66. Ponele alt a cada imagen describiendo qué se ve, no para qué está, y dejá vacío el alt de las decorativas.
67. Cargá el sitio con las imágenes desactivadas y confirmá que el contenido se sigue leyendo.

## H. Build, CI y deploy (68–77)

68. Sumá un verificador de links a CI que reviente ante cualquier link interno roto en `public/`.
69. Estirá `scripts/check-subpath.sh` para que también cace violaciones adentro de bloques `<style>` inline y de strings en JS.
70. Agregá un paso de validación de HTML a `.github/workflows/deploy.yml`.
71. Cacheá el binario de Hugo y `resources/` en CI, y decime el tiempo de build antes y después.
72. Armá un deploy de preview para los pull requests, colgado de otro path.
73. Que el build se caiga si `hugo` tira aunque sea una sola advertencia.
74. Dejá listo el dominio propio: `static/CNAME`, cambiar `baseURL` en `hugo.toml`, y decime exactamente qué registros DNS hay que crear.
75. Verificá que cada archivo de `static/audio/` esté realmente referenciado por algún archivo de data, y marcá los huérfanos.
76. Escribí un hook de pre-commit que corra `node main.test.js` y `./scripts/check-subpath.sh`.
77. Medí el build en frío y decime qué es lo lento de verdad antes de tocar una sola cosa.

## I. Revender la plantilla (78–89)

78. Sacá todo lo que es específico del artista a `data/` y `content/`, hasta que esto sea una plantilla reusable y no quede ni un "Bufalo" hardcodeado en `layouts/`.
79. Escribí un `SETUP.md` que lleve a un artista nuevo de clonar el repo a tener el sitio arriba en menos de media hora.
80. Armá una segunda piel — solo tokens de color y combinación tipográfica — que demuestre que el layout aguanta un rebranding entero.
81. Hacé un scaffold de un solo comando que cambie nombre, paleta, fuentes e imágenes desde un único archivo de configuración.
82. Escribí el copy de la página de venta de esto como plantilla paga, parándote contra Squarespace y las páginas de Bandcamp.
83. Sumá el archivo de licencia y una frase clara de qué puede y qué no puede revender el que la compra.
84. Dejá una build demo con contenido de relleno que pueda hostear como preview en vivo.
85. Hacé la versión para un club en vez de para un artista: salas, noches residentes, capacidad y un modelo de datos para eventos que se repiten.
86. Hacé la versión para un sello: roster, catálogo, links de distribución y una página por release.
87. Escribí una secuencia de cinco mails de bienvenida para el que compra la plantilla.
88. Armá una variante que cambie los archivos de data de Hugo por un CMS headless, así un artista sin código se carga las fechas solo.
89. Sacá cuentas de hosting, dominio y mail para un cliente corriendo esto, y tirame un número mensual para cotizar.

## J. Booking, merch y newsletter (90–96)

90. Reemplazá el stub de newsletter en localStorage por una integración real con un proveedor, manteniendo los mensajes de estado bilingües y el fallback sin JS.
91. Sumá un formulario de consulta de booking que postee a un servicio de formularios, con fecha, ciudad, rango de presupuesto y duración del set.
92. Instrumentá los botones de descarga del EPK para poder ver qué material se llevan realmente los productores.
93. Armá una variante del EPK no listada, con clave, para material exclusivo.
94. Enganchá los productos de merch a links de checkout reales, con un estado de sin stock que igual capture el interés.
95. Poné un flujo de "pedí este set" en cada página de set, que mande mail a booking con el id del set ya cargado.
96. Escribí el copy del EPK en el registro seco de Manzia, para un productor que nunca en su vida escuchó hablar de él.

## K. Puro fierro (97–101)

97. Meté un easter egg escondido con el código konami: cuatro segundos de patrón de bombo y un sticker violeta que aparece en pantalla.
98. Generá una discografía trucha de veinte años en `data/releases.yaml`, coherente por dentro, con números de catálogo que sigan un solo esquema.
99. Poné un lector de "BPM actual" en el footer que derive despacio entre 124 y 127 todo el día. Fuente mono. Sin explicar nada.
100. Armá una tabla de posiciones de sets ordenada por duración desde `data/sets.yaml`, y al más largo ponele NUNCA APURA LA BAJADA.
101. Que la línea del 404 cambie según la hora de Buenos Aires: educada antes de las doce, ya sin ganas después.
