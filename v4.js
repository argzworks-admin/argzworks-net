/* ARGZWORKS — Progressive Enhancements & Product Knowledge Base */
(() => {
  "use strict";
  const prefersLessMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const items = {
    display: {
      category: "ARGZ / 01 — RETAIL",
      title: "Expositores comerciales",
      image: "./images/object-display-v4.webp",
      intro: "Sistemas modulares que elevan y organizan tus productos en mostradores, vitrinas y puntos de venta.",
      benefit: "Multiplica la visibilidad sin saturar la superficie disponible. Facilita la reposición y mantiene el producto siempre destacado.",
      manufacturing: "Prototipo de encaje en impresión 3D de alta definición. Para series: acrílico cortado con láser, chapa plegada y lacado al horno.",
      options: "Medidas exactas de tu mostrador, número de niveles, módulos intercambiables, color corporativo y logotipo grabado.",
      type: "display", sector: "retail"
    },
    menu: {
      category: "ARGZ / 02 — HOSTELERÍA",
      title: "Accesorios de hostelería",
      image: "./images/object-menu-v4.webp",
      intro: "Portacartas y soportes de mesa diseñados para soportar el uso diario intenso con presencia impecable.",
      benefit: "Bases firmes que no se caen, materiales lavables resistentes a líquidos y un sistema ágil para actualizar la carta sin cambiar el soporte.",
      manufacturing: "Bases lastradas con chapa de acero tratada o madera mecanizada, ranura para panel de metacrilato y esquinas pulidas para limpieza fácil.",
      options: "Formatos A5/A6 u otros, grabado de marca, acabado a una o dos caras y fijaciones invisibles.",
      type: "menu", sector: "hosteleria"
    },
    sign: {
      category: "ARGZ / 03 — ESPACIOS",
      title: "Señalética y soportes QR",
      image: "./images/object-sign-v4.webp",
      intro: "Elementos de señalización e información digital que se integran con naturalidad en el interiorismo de tu espacio.",
      benefit: "Sustituye cartelería efímera por soportes sólidos y cuidados que comunican con claridad y refuerzan la identidad de tu negocio.",
      manufacturing: "Placas intercambiables en chapa metálica o metacrilato satinado antirreflejo. Códigos QR grabados por láser o protegidos.",
      options: "Tipografía corporativa, pictogramas, peanas de sobremesa o anclaje mural, acabados mates o cepillados.",
      type: "sign", sector: "hosteleria"
    },
    tray: {
      category: "ARGZ / 04 — FUNCIONAL",
      title: "Organizadores y objetos funcionales",
      image: "./images/object-tray-v4.webp",
      intro: "Bandejas y organizadores creados a la medida de los flujos de trabajo de tu equipo.",
      benefit: "Pone fin al desorden en cajas y mostradores. Reduce tiempos muertos y mejora la experiencia operativa de cara al cliente.",
      manufacturing: "Modelado paramétrico y prototipado FDM en PETG de alta tenacidad; piezas finales en madera noble mecanizada o moldeado según volumen.",
      options: "Compartimentación según objetos a ordenar, encajes apilables, almohadillado interior y grabado de identificación.",
      type: "tray", sector: "otro"
    },
    brand: {
      category: "ARGZ / 05 — BRANDING",
      title: "Objetos corporativos personalizados",
      image: "./images/object-brand-v4.webp",
      intro: "Piezas de marca con utilidad diaria real, pensadas para que tus clientes y colaboradores las conserven y utilicen.",
      benefit: "Genera una conexión tangible y duradera con tu marca, muy por encima del merchandising genérico descartable.",
      manufacturing: "Selección del objeto según uso, modelado, prototipo funcional y producción mediante técnicas mixtas (mecanizado, corte, impresión y acabados nobles).",
      options: "Uso específico, ergonomía, materiales combinados, gama cromática y packaging protector.",
      type: "brand", sector: "marca"
    },
    custom: {
      category: "ARGZ / 06 — A MEDIDA",
      title: "Proyectos especiales",
      image: "./images/object-custom-v4.webp",
      intro: "Desarrollo de piezas singulares y soluciones no estandarizadas a partir de tu problema específico.",
      benefit: "Una solución que se ajusta a tus necesidades exactas en lugar de forzar a tu negocio a adaptarse a productos estándar de catálogo.",
      manufacturing: "Estudio técnico preliminar, modelado 3D CAD, análisis de tolerancias y validación mediante prototipo físico antes de coordinar la fabricación final.",
      options: "Definición total: geometría, resistencia mecánica, acabados, uniones desmontables y tirada necesaria.",
      type: "custom", sector: "otro"
    }
  };

  // 01 / Lenis: inertial scrolling, disabled for users requesting less motion.
  let smooth = null;
  if (!prefersLessMotion && window.Lenis) {
    try {
      smooth = new window.Lenis({ autoRaf: true, anchors: true, duration: 1.08, smoothWheel: true, wheelMultiplier: 0.9 });
      window.lenisInstance = smooth;
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
