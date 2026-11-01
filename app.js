(() => {
  "use strict";
  const button = document.getElementById("menu-toggle");
  const menu = document.getElementById("main-nav");
  if (button && menu) {
    const close = () => {
      menu.classList.remove("open");
      button.setAttribute("aria-expanded", "false");
      button.setAttribute("aria-label", "Abrir menú");
    };
    button.addEventListener("click", () => {
      const open = menu.classList.toggle("open");
      button.setAttribute("aria-expanded", String(open));
      button.setAttribute("aria-label", open ? "Cerrar menú" : "Abrir menú");
    });
    menu.querySelectorAll("a").forEach(anchor => anchor.addEventListener("click", close));
    document.addEventListener("keydown", e => { if (e.key === "Escape") close(); });
    document.addEventListener("click", e => { if (!menu.contains(e.target) && !button.contains(e.target)) close(); });
  }

  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const reveal = [...document.querySelectorAll(".reveal")];
  if (!reduced && "IntersectionObserver" in window) {
    const observer = new IntersectionObserver((entries, io) => entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        io.unobserve(entry.target);
      }
    }), { threshold: 0.05, rootMargin: "0px 0px 60px 0px" });
    reveal.forEach(el => observer.observe(el));
  } else reveal.forEach(el => el.classList.add("is-visible"));

  const legacy = {
    "Expositor de sobremesa personalizado": ["display", "retail"],
    "Expositores y displays para tienda": ["display", "retail"],
    "Portacartas o cartas rígidas personalizadas": ["menu", "hosteleria"],
    "Accesorios para restaurante, cafetería u hotel": ["menu", "hosteleria"],
    "Señalética y soportes QR para mesas": ["sign", "hosteleria"],
    "Objetos y accesorios corporativos": ["brand", "marca"],
    "Bandejas, organizadores y accesorios de mesa": ["tray", "hosteleria"],
    "Diseño de objeto personalizado o pequeña serie": ["custom", "marca"],
    "Tengo otra idea de producto o accesorio": ["custom", "otro"]
  };
  document.querySelectorAll("[data-brief], [data-config-type]").forEach(el => {
    el.addEventListener("click", () => {
      const config = el.dataset.configType
        ? [el.dataset.configType, el.dataset.configSector || "otro"]
        : legacy[el.dataset.brief] || ["custom", "otro"];
      if (window.avOpenConfigurator) window.avOpenConfigurator(config[0], config[1]);
      document.getElementById("configurador")?.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" });
    });
  });
})();
