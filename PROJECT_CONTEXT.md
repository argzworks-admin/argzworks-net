# ARGZWORKS — PROJECT CONTEXT & TECHNICAL AUDIT (FASE 0)

> **Documento maestro de persistencia técnica:** `PROJECT_CONTEXT.md`  
> **Versión:** 1.1.0 (Completada Fase 0: Inicialización y Auditoría)  
> **Fecha de actualización:** 2026-11-01  
> **Entorno:** Local (Google Antigravity IDE / macOS)  
> **Repositorio local:** `argzworks-net`  
> **Repositorio remoto:** `https://github.com/argzworks-admin/argzworks-net.git` (rama `main`)  
> **Dominios oficiales adquiridos:** `argzworks.com`, `argzworks.es` (estado de conexión a hosting: pendiente de configuración)

---

## CONVENCIÓN DE ESTADOS Y TAXONOMÍA

Para asegurar la coherencia técnica e histórica en todas las sesiones, cada elemento se categoriza bajo una de las cuatro etiquetas:

- **[CONFIRMADO]:** Parámetros empresariales, estratégicos y restricciones técnicas ratificados formalmente por la dirección de ARGZWORKS.
- **[EXISTENTE]:** Componentes, archivos, marcado HTML, estilos CSS, librerías y lógica JavaScript presentes y verificados físicamente en el repositorio.
- **[PROPUESTO]:** Soluciones de diseño, optimizaciones arquitectónicas y mejoras técnicas planteadas para el plan de desarrollo.
- **[PENDIENTE]:** Decisiones estratégicas, activos corporativos oficiales (branding definitivo) o servicios externos por autorizar y conectar.

---

## 1. IDENTIDAD Y MODELO EMPRESARIAL

- **[CONFIRMADO] Denominación:** **ARGZWORKS**.
- **[CONFIRMADO] Objeto comercial:** Desarrollo de soluciones físicas y objetos funcionales a medida con alto valor de diseño, orientados a empresas y profesionales.
- **[CONFIRMADO] Modelo de negocio:** Exclusivamente B2B. No es una tienda generalista de comercio electrónico ni cuenta con pasarelas de pago automatizadas.
- **[CONFIRMADO] Restricciones operativas:**
  - Proyecto en fase de desarrollo y validación.
  - Prohibido afirmar la posesión de plantas industriales propias, maquinaria específica, plantilla contratada no verificada o cartera de clientes cerrada.
  - Prohibido implementar carritos de compra o checkout transaccional sin autorización expresa.
- **[CONFIRMADO] Valores angulares de marca:**
  1. *Diseño:* Cuidado estético superior con enfoque industrial y contemporáneo.
  2. *Personalización:* Ajuste completo a la identidad corporativa y operativa del cliente.
  3. *Versatilidad:* Exploración multicriterio de soluciones y alternativas productivas.
  4. *Precisión:* Rigor en dimensiones, materiales, tolerancias y experiencia de uso.
- **[CONFIRMADO] Hipótesis de segmentos objetivo:**
  - *Restauración y Hostelería:* Portacartas, expositores de carta, organizadores de mesa y soportes QR.
  - *Comercios y Retail:* Displays escalonados, organizadores de mostrador y soportes PLV.
  - *Marcas y Empresas:* Objetos corporativos útiles para uso cotidiano, packaging especial y piezas tangibles.
  - *Oficinas y Espacios de Trabajo:* Organizadores de escritorio, señalización interna y accesorios funcionales.
  - *Proyectos Especiales:* Piezas no estandarizadas, prototipos y desarrollos a medida.

---

## 2. AUDITORÍA DEL CÓDIGO Y ESTRUCTURA DE ARCHIVOS

### 2.1. Inventario del repositorio
- **[EXISTENTE] Archivos en raíz:**
  - `index.html` (40.6 KB, 328 líneas): Documento semántico principal.
  - `style.css` (23.8 KB, 338 líneas): Estilos globales, variables base, layout, tipografía y diseño responsive.
  - `v4.css` (13.5 KB, 173 líneas): Capa estética V4 (tonalidades verde profundo, Hero a pantalla completa y estética editorial).
  - `configurator.css` (25.3 KB, 249 líneas): Estilos completos del configurador interactivo, layout del brief y vista previa gráfica.
  - `app.js` (2.6 KB, 54 líneas): Control de menú móvil accesible, IntersectionObserver (`.reveal`) y enlaces rápidos al configurador.
  - `v4.js` (8.0 KB, 137 líneas): Inicialización de dependencias locales (Lenis, Swiper, Anime.js, MicroModal) y base de datos local de productos.
  - `configurator.js` (12.8 KB, 257 líneas): Lógica del asistente en 5 pasos, reactividad de interfaz, cálculo dinámico de recomendaciones y generación/exportación de brief (.txt).
  - `dev_server.py`: Servidor HTTP local con Live-Reload automático mediante SSE y cabeceras anti-caché.
  - `favicon.svg` (712 bytes): Icono temporal vectorial.
  - `objects-hero.png` (2.27 MB): Imagen original del hero en alta resolución.
  - `THIRD_PARTY_NOTICES.md` (1.8 KB): Auditoría de licencias de librerías locales de terceros.
  - `LEEME.txt` (2.4 KB): Documentación técnica legada de la propuesta previa (AVDESIGNLAB).
  - `README.md` (15 bytes): Fichero inicial del repositorio.
- **[EXISTENTE] Directorio `images/` (11 archivos WebP optimizados):**
  - Portadas y fondos: `hero-green-v4.webp`, `hero-campaign-v3.webp`, `hero-display.webp`.
  - Conceptos de producto: `object-display-v4.webp`, `object-menu-v4.webp`, `object-sign-v4.webp`, `object-tray-v4.webp`, `object-brand-v4.webp`, `object-custom-v4.webp`.
  - Casos de sector: `hospitality.webp`, `retail.webp`.
- **[EXISTENTE] Directorio `vendor/` (Dependencias locales fijadas):**
  - `lenis.min.js` (1.3.15 - MIT) + `lenis.css`: Desplazamiento inercial suave.
  - `swiper-bundle.min.js` (12.0.3 - MIT) + `swiper-bundle.min.css`: Galería táctil de productos.
  - `anime.umd.min.js` (4.2.2 - MIT): Microanimaciones secuenciadas de entrada en hero.
  - `micromodal.min.js` (0.4.10 - MIT/ISC): Ventanas modales accesibles con trampa de foco.
  - `icons/` (Lucide 0.468.0 - ISC): Iconos SVG locales (`arrow-left.svg`, `arrow-right.svg`, `arrow-up-right.svg`, `layers.svg`, `x.svg`).
  - `licenses/`: Textos originales de licencias de terceros.

### 2.2. Diagnóstico técnico y hallazgos
- **[EXISTENTE]** Principio de degradación elegante: Si JavaScript se deshabilita, el contenido es 100% visible y el carrusel Swiper pasa a una cuadrícula CSS estática accesible.
- **[EXISTENTE]** Carga de scripts: `configurator.js`, `anime.umd.min.js`, `lenis.min.js`, `swiper-bundle.min.js`, `micromodal.min.js` y `v4.js` se cargan con `defer`. `app.js` se carga sin defer al final de `<body>`.
- **[PROPUESTO]** Añadir `defer` a `app.js` para homogeneizar la carga diferida sin bloquear el renderizado final.
- **[EXISTENTE]** Directiva `<meta name="robots" content="noindex,nofollow">` presente de forma adecuada durante la fase privada de desarrollo.
- **[PROPUESTO]** Limpieza integral de referencias y cadenas textuales residuales: Reemplazar todas las apariciones de "AVDESIGNLAB" por "ARGZWORKS" tanto en el HTML como en scripts de generación de brief y modales.

---

## 3. AUDITORÍA VISUAL Y SISTEMA DE DISEÑO

### 3.1. Paleta de colores confirmada (Extraída del código)
- **[CONFIRMADO] Fondos y contrastes profundos:**
  - `--midnight`: `#1e2721` (Verde noche institucional)
  - Fondo Hero V4: `#14211b` (Verde profundo con degradado `#0e201af2` y `#0a1816a8`)
  - Acentos oscuros de interacción: `#222a24`, `#263629`, `#1d2b23`
- **[CONFIRMADO] Tonos salvia y líneas técnicas:**
  - `--sage`: `#dfe7db` / `#dfe9dc`
  - Bordes y separadores: `#dfe3db`, `#dce4d9`, `#d5e0d2`
  - Estados sutiles y detalles gráficos: `#829784`, `#829583`, `#61835b`, `#a5c45a`
- **[CONFIRMADO] Tonos minerales y papel:**
  - `--paper`: `#f7f7f4` (Fondo mineral cálido base)
  - `--white`: `#ffffff` (Blanco puro para tarjetas y modales)
  - Superficies alternas: `#edf0e9`, `#f0f1ec`, `#fdfefb`, `#f8faf5`
- **[CONFIRMADO] Acento vivo (Citrus / Ácido):**
  - `--acid` / `--accent`: `#d6f26d` (Verde lima de alta visibilidad para CTA principal, foco y elementos activos)
  - Variantes de interacción: `#e5ffa0` (hover del botón primario), `#adc75d` (dot de estado en vivo), `#d9efa0` (fondo de selección de texto)
- **[CONFIRMADO] Texto y tipografía neutra:**
  - `--ink`: `#1e2420` (Texto principal de alto contraste)
  - `--muted`: `#6c756d` (Párrafos y notas secundarias)
  - `--quiet`: `#96a097` (Anotaciones técnicas y pies)

### 3.2. Tipografía y maquetación editorial (Sistema Oficial FASE 1)
- **[CONFIRMADO] Montserrat — Tipografía principal:** Titulares, nombre de marca, navegación, botones, códigos numéricos y encabezados (`weights: 500, 600, 700, 800`).
- **[CONFIRMADO] DM Sans — Tipografía secundaria:** Párrafos, subtítulos, descripciones, fichas, formularios y notas explicativas (`weights: 400, 500, 600, 700`).
- **[CONFIRMADO] Parámetros de lectura:**
  - Tamaño base de cuerpo: 16–18 px (17 px en escritorio).
  - Interlineado optimizado: 1.65 (rango 1.5–1.7).
  - Anchura de lectura controlada (`max-width: 620px` en párrafos descriptivos).
  - Eliminación de tipografías monoespaciadas en bloques de lectura; `--mono` reasignado a `Montserrat` para etiquetas técnicas breves.
- **[CONFIRMADO] Logotipo oficial integrado:**
  - Extraído de `ARGZWORKS_logo_original_2048.png` (Inkscape RGBA con transparencia original).
  - Versión principal para fondos claros: `images/argzworks-logo-opt.png` (36 px altura).
  - Versión blanca para fondos oscuros/hero/footer: `images/argzworks-logo-white-opt.png` (36–40 px altura).
  - Composición balanceada con wordmark `ARGZWORKS.` en `Montserrat` 800/500 con punto acento.

---

## 4. AUDITORÍA FUNCIONAL (REAL VS DEMOSTRACIÓN)

| Componente | Estado Real | Comportamiento Verificado |
| :--- | :--- | :--- |
| **Menú móvil** | **Funcional (100%)** | Botón hamburguesa accesible con `aria-expanded`, cierre con `Escape` y click fuera. |
| **Desplazamiento inercial (Lenis)** | **Funcional (100%)** | Suavizado de scroll activo; se desactiva automáticamente si `prefers-reduced-motion: reduce`. |
| **Animación Hero (Anime.js)** | **Funcional (100%)** | Entrada escalonada cinematográfica de líneas del titular y llamadas a la acción. |
| **Carrusel Swiper** | **Funcional (100%)** | Deslizamiento táctil, navegación por teclado y botones previa/siguiente con 6 familias de objetos. |
| **Modal de producto (MicroModal)** | **Funcional (100%)** | Inyección reactiva de contenido según el objeto seleccionado, especificaciones completas, trampa de foco y cierre accesible. |
| **Atajos directos al configurador** | **Funcional (100%)** | Los botones en tarjetas precargan el objeto y sector seleccionados y llevan al configurador con desplazamiento suave. |
| **Configurador (Pasos 1 a 4)** | **Funcional (100% en cliente)** | Validación de campos obligatorios, actualización reactiva del visualizador gráfico y cálculo dinámico de viabilidad según cantidad/material. |
| **Configurador (Paso 5 - Brief)** | **Funcional (Demostración local)** | Genera un archivo estructurado en memoria (`ARGZWORKS_brief_proyecto.txt`); permite **copiar al portapapeles** y **descargar `.txt`**. **No envía a servidor** (adecuado para esta fase). |
| **Formulario de contacto general B2B** | **Demostración local controlada** | Validación completa en cliente; almacena temporalmente y permite descarga (.txt) en desarrollo sin endpoints no autorizados. |

---

## 5. AUDITORÍA DE GIT (SOLO LECTURA)

- **[CONFIRMADO] Repositorio local:** `/Users/victorargente/Documents/GitHub/argzworks-net`.
- **[CONFIRMADO] Rama activa:** `main`.
- **[CONFIRMADO] Política:** No se han realizado commits ni pushes a GitHub. Código validado localmente en servidor de desarrollo.

---

## 6. FASE 1: DIRECCIÓN CREATIVA, IDENTIDAD Y REDISEÑO VISUAL (COMPLETADA)

- **[COMPLETADO] 1. Identidad unificada ARGZWORKS:**
  - Sustitución de cualquier referencia previa a marcas legadas en `index.html`, `style.css`, `v4.css`, `v4.js`, `configurator.js`, `configurator.css` y `LEEME.txt`.
  - Integración del logotipo oficial PNG con geometría y proporciones nativas, transparencias respetadas y adaptación automática a fondos claros (`argzworks-logo-opt.png`) y oscuros (`argzworks-logo-white-opt.png`).
- **[COMPLETADO] 2. Sistema tipográfico oficial:**
  - Carga optimizada de Google Fonts: **Montserrat** (500, 600, 700, 800) y **DM Sans** (400, 500, 600, 700).
  - Jerarquía clara, contrastes refinados y lectura humana sin fuentes monoespaciadas en párrafos.
- **[COMPLETADO] 3. Identidad cromática:**
  - Paleta preservada: Verde noche (`#1e2721`, `#14211b`), verde salvia (`#dfe7db`), papel cálido (`#f7f7f4`) y lima ácido (`#d6f26d`, hover `#e5ffa0`).
- **[COMPLETADO] 4. Hero a pantalla completa:**
  - Composición editorial a sangre sin márgenes blancos exteriores.
  - Titular principal: `NO SOLO DISEÑAMOS OBJETOS. / DISEÑAMOS SU PROPÓSITO.`
  - Subtítulo: `Transformamos las necesidades de tu negocio en soluciones físicas funcionales, personalizadas y diseñadas para marcar la diferencia.`
  - CTA principal: `CUÉNTANOS QUÉ NECESITAS` (desplaza al `#configurador`).
  - CTA secundario: `EXPLORAR SOLUCIONES` (desplaza a `#soluciones`).
  - Kicker con logotipo integrado y barra de metadatos inferior.
- **[COMPLETADO] 5. Navegación refinada:**
  - Elementos: `Inicio` / `Soluciones` / `Proyectos` / `Cómo trabajamos` / `Contacto`.
  - CTA permanente: `INICIAR PROYECTO`.
- **[COMPLETADO] 6. Presentación de las 6 familias de soluciones:**
  1. Expositores comerciales
  2. Accesorios de hostelería
  3. Señalética y soportes QR
  4. Organizadores y objetos funcionales
  5. Objetos corporativos personalizados
  6. Proyectos especiales
  - Cada una con imagen profesional, descripción cercana, problema que resuelve, aplicaciones reales, fabricación orientativa y acceso directo al configurador.

---

## 7. SERVIDOR LOCAL Y VISTA PREVIA

- **URL activa:** `http://localhost:3000`
- **Mecanismo:** `dev_server.py` con live-reload automático SSE y encabezados anti-caché.
- **Validación técnica:** Verificación HTTP 200 en todos los assets (HTML, imágenes, CSS, JS y fuentes). Estructura HTML conforme y sin errores de consola.

