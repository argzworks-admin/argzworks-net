/* AVDESIGNLAB / v04 — progressive enhancements; core configurator works without dependencies. */
(() => {
  "use strict";
  const prefersLessMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const items = {
    display: {
      category: "AV / 01 — RETAIL SYSTEMS", title: "Expositores que venden.",
      image: "./images/object-display-v4.webp",
      intro: "Un sistema de alturas y apoyos para que el producto destaque sin ocupar todo el mostrador.",
      benefit: "Mejora la visibilidad, organiza las referencias y facilita el cambio de colección o producto.",
      manufacturing: "Prototipo mediante impresión 3D y pruebas de estabilidad. Para series, estudiar acrílico cortado y chapa plegada con uniones desmontables.",
      options: "Dimensiones, número de niveles, soportes reemplazables, color corporativo y logotipo.",
      type: "display", sector: "retail"
    },
    menu: {
      category: "AV / 02 — HOSPITALITY SYSTEMS", title: "Cartas sin complicaciones.",
      image: "./images/object-menu-v4.webp",
      intro: "Un portacarta que aporta identidad, se mantiene de pie y permite actualizar información sin rehacerlo.",
      benefit: "Reduce impresiones y recambios, mantiene la presentación uniforme y simplifica la limpieza de la mesa.",
      manufacturing: "Chapa plegada o base lastrada con ranura de metacrilato. Validar estabilidad, resistencia al agua y bordes fáciles de limpiar.",
      options: "Formatos A5/A6 u otros, doble cara, acabados, colores, grabado y sistema para sustituir las cartas.",
      type: "menu", sector: "hosteleria"
    },
    sign: {
      category: "AV / 03 — SPACE SYSTEMS", title: "Señales con carácter.",
      image: "./images/object-sign-v4.webp",
      intro: "Señalética para un restaurante, tienda u hotel que informa y también forma parte del interiorismo.",
      benefit: "Mayor legibilidad y coherencia; soportes que pueden reutilizarse cuando cambie un mensaje o un QR.",
      manufacturing: "Placa intercambiable en metacrilato o chapa; fijaciones simples. Comprobar contraste, estabilidad y, si procede, acceso al QR real.",
      options: "Tipografía, pictogramas, base, anclaje, tamaños, gráfica reemplazable y acabados.",
      type: "sign", sector: "hosteleria"
    },
    tray: {
      category: "AV / 04 — OPERATIONS", title: "Orden, sin esfuerzo.",
      image: "./images/object-tray-v4.webp",
      intro: "Bandejas y organizadores diseñados para una tarea concreta: cobrar, servir, preparar pedidos o guardar accesorios.",
      benefit: "Evita piezas sueltas, reduce tiempo de búsqueda y ordena el puesto de trabajo.",
      manufacturing: "Prototipo FDM en PETG para test de encaje; madera mecanizada o moldes/procesos externos si el volumen lo justifica.",
      options: "Compartimentos, inserciones, apilado, medidas, material y color.",
      type: "tray", sector: "otro"
    },
    brand: {
      category: "AV / 05 — BRAND OBJECTS", title: "Una marca para usar.",
      image: "./images/object-brand-v4.webp",
      intro: "Pequeños objetos corporativos con utilidad cotidiana, no piezas promocionales destinadas a un cajón.",
      benefit: "Mantiene tu marca presente porque el objeto cumple una función real.",
      manufacturing: "Selección de un objeto funcional, prototipo y fabricación por la técnica adecuada: impresión, grabado, corte o colaboración con proveedores.",
      options: "Uso, forma, textura, paleta corporativa, packaging y distintas cantidades.",
      type: "brand", sector: "marca"
    },
    custom: {
      category: "AV / 06 — BESPOKE OBJECTS", title: "Lo que aún no existe.",
      image: "./images/object-custom-v4.webp",
      intro: "Si tu negocio tiene un problema que ningún accesorio convencional resuelve, empezamos por ahí.",
      benefit: "Una solución ajustada a tu flujo de trabajo en lugar de adaptar el negocio a un producto genérico.",
      manufacturing: "Modelado CAD y prototipo según exigencias de carga, temperatura, limpieza y uso. La producción final se selecciona tras validar la pieza.",
      options: "Función, medidas, encajes, material, forma, color y volumen de fabricación.",
      type: "custom", sector: "otro"
    }
  };

  // 01 / Lenis: inertial scrolling, disabled for users requesting less motion.
  let smooth = null;
  if (!prefersLessMotion && window.Lenis) {
    try {
      smooth = new window.Lenis({ autoRaf: true, anchors: true, duration: 1.08, smoothWheel: true, wheelMultiplier: 0.9 });
    } catch (err) { console.warn("Smooth scroll unavailable; using native scrolling.", err); }
  }

  // 02 / Swiper: touch gestures, keyboard navigation, bullets, responsive widths.
  if (window.Swiper) {
    new window.Swiper(".product-swiper", {
      slidesPerView: 1.12, spaceBetween: 15, speed: prefersLessMotion ? 0 : 650,
      grabCursor: true, watchOverflow: true, keyboard: { enabled: true, onlyInViewport: true },
      a11y: { enabled: true, prevSlideMessage: "Producto anterior", nextSlideMessage: "Siguiente producto" },
      pagination: { el: ".product-gallery-pagination", clickable: true },
      navigation: { prevEl: ".gallery-prev", nextEl: ".gallery-next" },
      breakpoints: { 560: { slidesPerView: 1.55 }, 740: { slidesPerView: 2.08 }, 1120: { slidesPerView: 3, spaceBetween: 20 } }
    });
  }

  // 03 / Anime.js: controlled, lightweight entrance animations for the hero.
  if (!prefersLessMotion && window.anime?.animate) {
    try {
      window.anime.animate(".hero-v4 .hero-line", {
        opacity: [0, 1], translateY: [40, 0],
        delay: window.anime.stagger(170, { start: 150 }),
        duration: 1100, ease: "out(4)"
      });
      window.anime.animate(".hero-v4 .hero-v3-content>p, .hero-v4 .hero-actions", {
        opacity: [0, 1], translateY: [24, 0],
        delay: window.anime.stagger(125, { start: 520 }),
        duration: 850, ease: "out(3)"
      });
    } catch (err) { console.warn("Entrance animation unavailable.", err); }
  }

  // 04 / MicroModal: accessible, focus-trapped product specifications.
  const setText = (id, value) => { const element = document.getElementById(id); if (element) element.textContent = value; };
  let current = null;
  const modal = document.getElementById("product-modal");
  if (window.MicroModal && modal) {
    window.MicroModal.init({
      disableScroll: true, disableFocus: false, awaitOpenAnimation: false, awaitCloseAnimation: false,
      onShow: () => smooth?.stop(), onClose: () => smooth?.start()
    });
    document.querySelectorAll("[data-product-detail]").forEach(button => {
      button.addEventListener("click", () => {
        current = items[button.dataset.productDetail];
        if (!current) return;
        setText("modal-product-category", current.category);
        setText("modal-product-title", current.title);
        setText("modal-product-intro", current.intro);
        setText("modal-product-benefit", current.benefit);
        setText("modal-product-manufacturing", current.manufacturing);
        setText("modal-product-options", current.options);
        const picture = document.getElementById("modal-product-image");
        picture.src = current.image;
        picture.alt = "Visual conceptual de " + current.title.toLowerCase();
        window.MicroModal.show("product-modal", {
          disableScroll: true, awaitOpenAnimation: false, awaitCloseAnimation: false,
          onShow: () => smooth?.stop(), onClose: () => smooth?.start()
        });
      });
    });
    document.getElementById("modal-config-button")?.addEventListener("click", () => {
      if (!current) return;
      window.MicroModal.close("product-modal");
      window.avOpenConfigurator?.(current.type, current.sector);
      document.getElementById("configurador")?.scrollIntoView({ behavior: prefersLessMotion ? "auto" : "smooth", block: "start" });
    });
  }

  // 05 / Lucide icons are self-hosted, selected SVG assets in the markup.
  // Accessible graceful fallback when JavaScript or individual libraries are unavailable.
})();
