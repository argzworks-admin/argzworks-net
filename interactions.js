/**
 * ARGZWORKS — ADVANCED INTERACTION CONTROLLER (interactions.js)
 * =============================================================
 * 1. Sección 3: Desplazamiento horizontal (Desktop Pin-Scroll + Mobile Embla)
 * 2. Experiencia Circular: Retorno suave al inicio y overscroll de ciclo
 * 3. Formulario B2B: Validación, gestión de estados y preparación de endpoint
 * 4. Microinteracciones y accesibilidad (prefers-reduced-motion)
 */

(() => {
  "use strict";

  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ==========================================================================
     1. SECCIÓN 3: DESPLAZAMIENTO HORIZONTAL
     ========================================================================== */
  function initHorizontalSection() {
    const pinWrap = document.getElementById("solutions-pin-wrap");
    const sticky = document.getElementById("solutions-sticky");
    const track = document.getElementById("solutions-track");
    const progressFill = document.getElementById("solutions-progress-fill");
    const counter = document.getElementById("solutions-counter");
    const emblaNode = document.getElementById("embla-solutions");

    if (!pinWrap || !track) return;

    let emblaInstance = null;
    let isDesktop = window.innerWidth > 900;

    // A. Modo Desktop: Pin-Scroll vertical controlado
    function updateDesktopScroll() {
      if (prefersReduced || window.innerWidth <= 900) {
        track.style.transform = "";
        return;
      }

      const rect = pinWrap.getBoundingClientRect();
      const wrapHeight = pinWrap.offsetHeight;
      const windowHeight = window.innerHeight;
      const scrollableDistance = wrapHeight - windowHeight;

      if (scrollableDistance <= 0) return;

      // Calcular progreso (0.0 a 1.0)
      const scrolled = -rect.top;
      const progress = Math.max(0, Math.min(1, scrolled / scrollableDistance));

      // Calcular distancia total de desplazamiento horizontal
      const trackWidth = track.scrollWidth;
      const viewportWidth = window.innerWidth;
      const maxTranslate = Math.max(0, trackWidth - viewportWidth + 120);

      const currentX = -(progress * maxTranslate);
      track.style.transform = `translate3d(${currentX}px, 0, 0)`;

      if (progressFill) {
        progressFill.style.width = `${progress * 100}%`;
      }

      if (counter) {
        const totalCards = track.querySelectorAll(".solution-h-card").length || 5;
        const currentCardIndex = Math.min(totalCards, Math.max(1, Math.ceil(progress * totalCards) || 1));
        counter.textContent = `0${currentCardIndex} / 0${totalCards}`;
      }
    }

    // B. Modo Móvil: Embla Carousel
    function initMobileEmbla() {
      if (!emblaNode || window.EmblaCarousel === undefined) return;

      const dotsContainer = document.getElementById("embla-dots");
      const prevBtn = document.getElementById("embla-prev");
      const nextBtn = document.getElementById("embla-next");

      try {
        emblaInstance = window.EmblaCarousel(emblaNode, {
          loop: false,
          align: "start",
          containScroll: "trimSnaps",
          skipSnaps: false,
          dragFree: false
        });

        // Crear botones de paginación (dots)
        if (dotsContainer) {
          dotsContainer.innerHTML = "";
          const snaps = emblaInstance.scrollSnapList();
          snaps.forEach((_, idx) => {
            const dot = document.createElement("button");
            dot.type = "button";
            dot.className = `embla-dot ${idx === 0 ? "is-selected" : ""}`;
            dot.setAttribute("aria-label", `Ir a solución ${idx + 1}`);
            dot.addEventListener("click", () => emblaInstance.scrollTo(idx));
            dotsContainer.appendChild(dot);
          });
        }

        const updateControls = () => {
          if (prevBtn) prevBtn.disabled = !emblaInstance.canScrollPrev();
          if (nextBtn) nextBtn.disabled = !emblaInstance.canScrollNext();

          if (dotsContainer) {
            const selected = emblaInstance.selectedScrollSnap();
            const dots = dotsContainer.querySelectorAll(".embla-dot");
            dots.forEach((dot, idx) => {
              dot.classList.toggle("is-selected", idx === selected);
            });
          }
        };

        emblaInstance.on("select", updateControls);
        emblaInstance.on("init", updateControls);
        updateControls();

        if (prevBtn) prevBtn.addEventListener("click", () => emblaInstance.scrollPrev());
        if (nextBtn) nextBtn.addEventListener("click", () => emblaInstance.scrollNext());
      } catch (err) {
        console.warn("[ARGZWORKS] Embla Carousel inicializado en modo fallback.", err);
      }
    }

    function handleResize() {
      const nowDesktop = window.innerWidth > 900;
      if (nowDesktop !== isDesktop) {
        isDesktop = nowDesktop;
        if (isDesktop) {
          if (emblaInstance) {
            emblaInstance.destroy();
            emblaInstance = null;
          }
          updateDesktopScroll();
        } else {
          track.style.transform = "";
          initMobileEmbla();
        }
      }
    }

    if (isDesktop) {
      window.addEventListener("scroll", updateDesktopScroll, { passive: true });
      updateDesktopScroll();
    } else {
      initMobileEmbla();
    }

    window.addEventListener("resize", handleResize, { passive: true });
  }

  /* ==========================================================================
     2. EXPERIENCIA CIRCULAR: RETORNO SUAVE AL INICIO
     ========================================================================== */
  function initCircularReturn() {
    const returnBtn = document.getElementById("circular-return-btn");
    const ringFill = document.getElementById("circular-ring-fill");
    const overscrollCue = document.getElementById("overscroll-cue");

    // A. Actualizar progreso circular según el scroll total
    function updateScrollProgress() {
      if (!ringFill) return;
      const totalScrollable = document.documentElement.scrollHeight - window.innerHeight;
      if (totalScrollable <= 0) return;

      const progress = Math.max(0, Math.min(1, window.scrollY / totalScrollable));
      const circumference = 213.6; // 2 * PI * 34
      const offset = circumference * (1 - progress);
      ringFill.style.strokeDashoffset = `${offset}`;
    }

    window.addEventListener("scroll", updateScrollProgress, { passive: true });
    updateScrollProgress();

    // B. Retorno al inicio con clic
    function scrollToTop() {
      if (prefersReduced) {
        window.scrollTo(0, 0);
        return;
      }

      // Si Lenis está activo en window, usar su scroll suave
      if (window.lenisInstance && typeof window.lenisInstance.scrollTo === "function") {
        window.lenisInstance.scrollTo(0, { duration: 1.4 });
      } else {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    }

    if (returnBtn) {
      returnBtn.addEventListener("click", scrollToTop);
    }

    // C. Gesto de Overscroll en Desktop (Opcional Avanzado)
    let overscrollCooldown = false;
    let overscrollDelta = 0;

    function handleWheelOverscroll(e) {
      // Desactivar en móviles o movimiento reducido
      if (prefersReduced || window.innerWidth <= 900) return;

      // No activar si el usuario está interactuando con un formulario
      const activeTag = document.activeElement?.tagName;
      if (activeTag === "INPUT" || activeTag === "TEXTAREA" || activeTag === "SELECT") return;

      const atBottom = (window.innerHeight + window.scrollY) >= (document.documentElement.scrollHeight - 35);

      if (atBottom && e.deltaY > 0) {
        overscrollDelta += e.deltaY;
        if (overscrollDelta > 160 && !overscrollCooldown) {
          overscrollCooldown = true;
          overscrollDelta = 0;

          if (overscrollCue) {
            overscrollCue.classList.add("is-active");
          }

          setTimeout(() => {
            scrollToTop();
            setTimeout(() => {
              if (overscrollCue) overscrollCue.classList.remove("is-active");
              overscrollCooldown = false;
            }, 1200);
          }, 350);
        }
      } else {
        overscrollDelta = Math.max(0, overscrollDelta - 10);
      }
    }

    window.addEventListener("wheel", handleWheelOverscroll, { passive: true });
  }

  /* ==========================================================================
     3. FORMULARIO DE CONTACTO B2B
     ========================================================================== */
  function initB2BContactForm() {
    const form = document.getElementById("b2b-contact-form");
    if (!form) return;

    const projectChips = form.querySelectorAll(".b2b-chip-project");
    const timelineChips = form.querySelectorAll(".b2b-chip-timeline");
    const projectInput = document.getElementById("b2b-project-type");
    const timelineInput = document.getElementById("b2b-timeline");
    const statusBanner = document.getElementById("b2b-status-banner");
    const submitBtn = document.getElementById("b2b-submit-btn");

    // A. Lógica de selección de chips
    function setupChips(buttons, hiddenInput) {
      buttons.forEach(btn => {
        btn.addEventListener("click", () => {
          buttons.forEach(b => {
            b.classList.remove("is-active");
            b.setAttribute("aria-pressed", "false");
          });
          btn.classList.add("is-active");
          btn.setAttribute("aria-pressed", "true");
          if (hiddenInput) {
            hiddenInput.value = btn.dataset.value;
          }
        });
      });
    }

    setupChips(projectChips, projectInput);
    setupChips(timelineChips, timelineInput);

    // B. Validación accesible y envío
    function showError(fieldId, errorMsg) {
      const field = document.getElementById(fieldId);
      const errorEl = document.getElementById(`${fieldId}-error`);
      if (field) {
        field.classList.add("has-error");
        field.focus();
      }
      if (errorEl) {
        errorEl.textContent = errorMsg;
        errorEl.classList.add("is-visible");
      }
    }

    function clearErrors() {
      form.querySelectorAll(".b2b-input, .b2b-textarea").forEach(input => {
        input.classList.remove("has-error");
      });
      form.querySelectorAll(".b2b-field-error").forEach(err => {
        err.classList.remove("is-visible");
        err.textContent = "";
      });
      if (statusBanner) {
        statusBanner.className = "b2b-status-banner";
        statusBanner.innerHTML = "";
      }
    }

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      clearErrors();

      const name = document.getElementById("b2b-name")?.value.trim();
      const company = document.getElementById("b2b-company")?.value.trim();
      const email = document.getElementById("b2b-email")?.value.trim();
      const phone = document.getElementById("b2b-phone")?.value.trim();
      const projectType = projectInput?.value || "Por definir";
      const timeline = timelineInput?.value || "Sin fecha";
      const message = document.getElementById("b2b-message")?.value.trim();
      const privacy = document.getElementById("b2b-privacy")?.checked;

      // Validaciones requeridas
      if (!name) {
        showError("b2b-name", "Por favor, indica tu nombre y apellidos.");
        return;
      }
      if (!company) {
        showError("b2b-company", "Por favor, indica el nombre de tu empresa o marca.");
        return;
      }
      if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        showError("b2b-email", "Introduce un correo electrónico corporativo válido.");
        return;
      }
      if (!message || message.length < 10) {
        showError("b2b-message", "Describe brevemente tu necesidad o proyecto (mínimo 10 caracteres).");
        return;
      }
      if (!privacy) {
        alert("Debes aceptar la información de privacidad para poder contactar.");
        document.getElementById("b2b-privacy")?.focus();
        return;
      }

      // Payload estructurado
      const formData = {
        nombre: name,
        empresa: company,
        email: email,
        telefono: phone || "No especificado",
        tipoProyecto: projectType,
        plazo: timeline,
        necesidad: message,
        fecha: new Date().toISOString()
      };

      // C. Verificación de backend
      const endpoint = form.dataset.endpoint || form.getAttribute("action");

      if (endpoint && endpoint.startsWith("http")) {
        // En caso de que exista un endpoint de producción autorizado
        try {
          if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.innerHTML = "Enviando solicitud... <span>⏳</span>";
          }
          const response = await fetch(endpoint, {
            method: "POST",
            headers: { "Content-Type": "application/json", "Accept": "application/json" },
            body: JSON.stringify(formData)
          });

          if (response.ok) {
            statusBanner.className = "b2b-status-banner is-success";
            statusBanner.innerHTML = `
              <strong>✓ Solicitud enviada correctamente</strong>
              <p>Gracias por contactar con ARGZWORKS. Hemos recibido los datos de <strong>${company}</strong> y revisaremos tu proyecto con criterio técnico.</p>
            `;
            form.reset();
          } else {
            throw new Error(`Error en el servidor: ${response.status}`);
          }
        } catch (err) {
          statusBanner.className = "b2b-status-banner is-error";
          statusBanner.innerHTML = `
            <strong>Error al conectar con el servidor</strong>
            <p>No se pudo completar el envío telemático (${err.message}). Puedes descargar la solicitud a continuación.</p>
          `;
        } finally {
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = 'Enviar solicitud de proyecto <span class="arrow" aria-hidden="true">↗</span>';
          }
        }
      } else {
        // Estado transparente sin backend conectado (Fase de desarrollo local)
        const summaryText = [
          "ARGZWORKS — SOLICITUD DE CONTACTO B2B",
          "=====================================",
          `Fecha: ${new Date().toLocaleString("es-ES")}`,
          "",
          "DATOS DE LA EMPRESA",
          `Nombre: ${name}`,
          `Empresa: ${company}`,
          `Email: ${email}`,
          `Teléfono: ${phone || "No especificado"}`,
          "",
          "DETALLES DEL PROYECTO",
          `Tipo de solución: ${projectType}`,
          `Plazo objetivo: ${timeline}`,
          `Necesidad: ${message}`,
          "",
          "---",
          "Formulario validado en el entorno local de desarrollo de ARGZWORKS.",
          "Pendiente de asignación de endpoint seguro para producción."
        ].join("\n");

        statusBanner.className = "b2b-status-banner is-info";
        statusBanner.innerHTML = `
          <strong>✓ Solicitud validada con éxito (Entorno Local)</strong>
          <p>Los datos de <strong>${company}</strong> han sido comprobados correctamente. En esta fase de desarrollo no hay endpoint remoto conectado para evitar envíos no autorizados.</p>
          <div class="b2b-actions-row">
            <button type="button" id="b2b-copy-btn" class="b2b-action-link">Copiar datos al portapapeles 📋</button>
            <button type="button" id="b2b-download-btn" class="b2b-action-link">Descargar solicitud (.txt) 💾</button>
          </div>
        `;

        // Atajos para no perder los datos rellenados
        document.getElementById("b2b-copy-btn")?.addEventListener("click", () => {
          navigator.clipboard.writeText(summaryText).then(() => {
            const btn = document.getElementById("b2b-copy-btn");
            if (btn) btn.textContent = "¡Copiado! ✓";
          });
        });

        document.getElementById("b2b-download-btn")?.addEventListener("click", () => {
          const blob = new Blob([summaryText], { type: "text/plain;charset=utf-8" });
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = `ARGZWORKS_contacto_${company.replace(/\s+/g, "_")}.txt`;
          document.body.appendChild(a);
          a.click();
          a.remove();
          setTimeout(() => URL.revokeObjectURL(url), 1500);
        });

        statusBanner.scrollIntoView({ behavior: prefersReduced ? "auto" : "smooth", block: "nearest" });
      }
    });
  }

  /* ==========================================================================
     4. INTEGRACIÓN DE MOTION DIVISION (REVELADO SUAVE EN SCROLL)
     ========================================================================== */
  function initMotionScrollReveals() {
    if (prefersReduced || !window.Motion) return;

    try {
      const { inView, animate } = window.Motion;

      // Revelar elementos del formulario
      inView(".b2b-contact-info", (info) => {
        animate(info.target, { opacity: [0, 1], y: [30, 0] }, { duration: 0.8, easing: [0.16, 1, 0.3, 1] });
      });

      inView(".b2b-form-card", (info) => {
        animate(info.target, { opacity: [0, 1], y: [40, 0] }, { duration: 0.9, delay: 0.15, easing: [0.16, 1, 0.3, 1] });
      });
    } catch (err) {
      console.warn("[ARGZWORKS] Motion reveals no disponibles; fallback nativo activo.", err);
    }
  }

  /* ==========================================================================
     INICIALIZACIÓN AL CARGAR EL DOM
     ========================================================================== */
  function init() {
    initHorizontalSection();
    initCircularReturn();
    initB2BContactForm();
    initMotionScrollReveals();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
