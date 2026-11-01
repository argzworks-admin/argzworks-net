(() => {
  "use strict";

  const $ = (selector) => document.querySelector(selector);
  const $$ = (selector) => [...document.querySelectorAll(selector)];
  const form = $("#project-configurator");
  if (!form) return;

  const labels = {
    sector: { hosteleria:"Restauración", retail:"Tiendas & retail", hotel:"Hoteles & espacios", marca:"Marcas & agencias", otro:"Otro negocio" },
    type: { display:"Expositor personalizado", menu:"Portacartas / carta", sign:"Señalética / soporte QR", tray:"Bandeja / organizador", brand:"Objeto de marca", custom:"Objeto a medida" },
    material: { asesorar:"A definir juntos", impresion:"Impresión 3D", acrilico:"Acrílico", metal:"Metal", madera:"Madera" },
    color: { neutro:"Arena", cobalto:"Cobalto", terracota:"Terracota", grafito:"Grafito" }
  };
  const typeCopy = {
    display:"Estructuras y plataformas para presentar mejor tus productos, adaptadas a tu mostrador.",
    menu:"Portacartas compactos, estables y coherentes con el ambiente de tu espacio.",
    sign:"Pequeños soportes para comunicar información, precios, reservas o códigos QR.",
    tray:"Piezas para agrupar, ordenar y presentar objetos con una función concreta.",
    brand:"Accesorios útiles con identidad propia, para una marca, equipo o experiencia.",
    custom:"Un producto nuevo diseñado alrededor del problema que nos cuentes."
  };
  const industrySuggest = {
    hosteleria:"En restauración suelen funcionar especialmente bien los portacartas, soportes QR y accesorios de mesa.",
    retail:"En retail podemos estudiar expositores y organizadores que aprovechen el espacio de mostrador.",
    hotel:"En hoteles solemos partir de la señalética, los accesorios de habitación y la recepción.",
    marca:"Para marcas, una pieza útil y coherente con la identidad puede funcionar mejor que un regalo genérico.",
    otro:"Cuéntanos el uso del objeto; seleccionaremos materiales y procesos según su función."
  };
  const colors = { neutro:"#d6c8ac", cobalto:"#2d4f90", terracota:"#bc6042", grafito:"#313735" };
  const steps = $$(".config-step");
  const tabs = $$(".config-step-tab");
  const progress = $("#config-progress");
  const progressFill = $("#config-progress-fill");
  const currentLabel = $("#config-step-counter");
  const statusLabel = $("#config-step-status");
  const error = $("#config-error");
  const next = $("#config-next");
  const back = $("#config-back");
  const result = $("#config-result");
  const resultBrief = $("#result-brief");
  const configSection = $("#configurador");
  const editor = $(".config-workspace");
  const stage = $("#object-stage");
  const object = $("#render-object");
  const notes = {
    asesorar:"Podemos explorar impresión 3D, corte, plegado o mecanizado según la forma, el uso y el volumen.",
    impresion:"La impresión 3D puede ser útil para prototipos y piezas de tirada corta. Se validarán resistencia y acabado.",
    acrilico:"El acrílico puede cortarse y ensamblarse para displays y señalética. Revisaremos espesores y uniones.",
    metal:"El metal permite piezas duraderas mediante corte y plegado, aunque necesita revisar radios, acabados y cantidades.",
    madera:"La madera permite acabados cálidos mediante corte y mecanizado; estudiaremos protección, limpieza y estabilidad."
  };

  const initial = () => ({ sector:"", type:"", material:"asesorar", color:"neutro", personalization:[], quantity:"", timeline:"sin fecha" });
  let data = initial();
  let step = 0;
  let furthest = 0;
  let preparedText = "";

  const text = (field) => labels[field]?.[data[field]] || (data[field] || "Por definir");
  const near = (value) => Number.isFinite(Number(value)) && Number(value) > 0 ? `${Math.round(Number(value))} mm` : "—";
  const dims = () => [form.elements.width.value, form.elements.height.value, form.elements.depth.value].some(v => v !== "")
    ? `${near(form.elements.width.value)} × ${near(form.elements.height.value)} × ${near(form.elements.depth.value)} (ancho × alto × fondo)` : "A definir";
  const scrollToEditor = () => {
    const top = editor.getBoundingClientRect().top + window.scrollY - 96;
    window.scrollTo({ top, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
  };

  function updatePreview() {
    $("#preview-name").textContent = data.type ? text("type") : "Tu próximo objeto";
    $("#preview-description").textContent = data.type ? typeCopy[data.type] : "Selecciona una familia de objeto para ver una representación gráfica orientativa.";
    $("#preview-sector").textContent = data.sector ? text("sector") : "Sin elegir";
    $("#preview-material").textContent = text("material");
    $("#preview-color").textContent = text("color");
    $("#preview-quantity").textContent = data.quantity ? `${data.quantity}${data.quantity === "1" ? " unidad" : data.quantity === "por definir" ? "" : " unidades"}` : "Por definir";
    stage.style.setProperty("--object-accent", colors[data.color]);
    object.className = "render-object render-" + (data.type || "display");
    $("#sector-suggestion").textContent = "✳ " + (industrySuggest[data.sector] || "Partiremos del contexto de tu negocio para diseñar lo que necesitas.");
    $("#material-hint").textContent = "✳ " + notes[data.material];
    const many = ["51–100", "100+"].includes(data.quantity);
    let production = notes[data.material];
    if (many) production += " Por el volumen indicado, compararemos procesos de serie y proveedores antes de recomendar uno.";
    if (data.quantity === "1") production += " Al tratarse de una pieza, priorizaremos validar geometría y uso con un prototipo.";
    if (data.timeline === "menos de 1 mes") production += " El plazo es ajustado y requerirá confirmar disponibilidad antes de aceptar el encargo.";
    $("#production-insight").textContent = production + " La viabilidad final requiere revisión técnica.";
  }

  function paint() {
    steps.forEach((panel, index) => { panel.hidden = index !== step; panel.classList.toggle("active", index === step); });
    tabs.forEach((tab, index) => {
      const active = index === step;
      tab.disabled = index > furthest;
      tab.classList.toggle("active", active);
      tab.classList.toggle("completed", index < furthest);
      if (active) tab.setAttribute("aria-current", "step"); else tab.removeAttribute("aria-current");
    });
    $$('[data-field]').forEach(button => {
      const selected = data[button.dataset.field] === button.dataset.value;
      button.classList.toggle("selected", selected);
      button.setAttribute("aria-pressed", String(selected));
    });
    $$('[data-multi]').forEach(button => {
      const selected = data.personalization.includes(button.dataset.value);
      button.classList.toggle("selected", selected);
      button.setAttribute("aria-pressed", String(selected));
    });
    currentLabel.textContent = `PASO 0${step + 1} / 05`;
    statusLabel.textContent = ["TU NEGOCIO", "EL OBJETO", "EL DISEÑO", "FABRICACIÓN", "TU BRIEF"][step];
    progress.setAttribute("aria-valuenow", String(step + 1));
    progressFill.style.width = `${(step + 1) * 20}%`;
    next.innerHTML = step === 4 ? 'Generar mi brief <span>↗</span>' : 'Continuar <span>↗</span>';
    back.disabled = step === 0;
    error.hidden = true;
    updatePreview();
  }

  function showError(message, target) {
    error.textContent = message;
    error.hidden = false;
    if (target) target.focus();
  }
  function validate() {
    if (step === 0 && !data.sector) return showError("Selecciona el sector de tu negocio para continuar.", $('[data-field="sector"]'));
    if (step === 1 && !data.type) return showError("Selecciona el tipo de objeto que te gustaría desarrollar.", $('[data-field="type"]'));
    if (step === 3 && !data.quantity) return showError("Selecciona una cantidad aproximada, aunque sea «Por definir».", $('[data-field="quantity"]'));
    if (step === 3) {
      const invalidDim = [form.elements.width, form.elements.height, form.elements.depth].find(el => el.value !== "" && (!el.checkValidity() || !Number.isFinite(Number(el.value))));
      if (invalidDim) return showError("Revisa las medidas: introduce números positivos en milímetros.", invalidDim);
    }
    if (step === 4) {
      const required = [form.elements.contactName, form.elements.contactEmail, form.elements.company];
      const invalid = required.find(el => !el.checkValidity() || !el.value.trim());
      if (invalid) return showError("Completa tu nombre, un correo válido y tu empresa para generar el brief.", invalid);
    }
    return true;
  }

  function changeStep(target) {
    step = Math.max(0, Math.min(4, target));
    furthest = Math.max(furthest, step);
    paint();
    scrollToEditor();
  }

  function makeBrief() {
    const name = form.elements.contactName.value.trim();
    const email = form.elements.contactEmail.value.trim();
    const company = form.elements.company.value.trim();
    const extra = form.elements.notes.value.trim();
    preparedText = [
      "ARGZWORKS — BRIEF DE PROYECTO / SOLICITUD TÉCNICA",
      "=================================================",
      "",
      "CONTACTO",
      `Nombre: ${name}`,
      `Correo: ${email}`,
      `Empresa / marca: ${company}`,
      "",
      "EL ENCARGO",
      `Sector: ${text("sector")}`,
      `Objeto: ${text("type")}`,
      `Material preferido: ${text("material")}`,
      `Dirección de color: ${text("color")}`,
      `Personalización: ${data.personalization.length ? data.personalization.join(", ") : "Por definir"}`,
      `Cantidad: ${data.quantity === "1" ? "1 prototipo" : data.quantity === "por definir" ? "Por definir" : data.quantity + " unidades"}`,
      `Dimensiones aprox.: ${dims()}`,
      `Plazo deseado: ${data.timeline}`,
      "",
      "OBJETIVO Y DETALLES",
      extra || "Pendiente de desarrollar con el estudio.",
      "",
      "NOTAS TÉCNICAS",
      notes[data.material],
      "La elección de proceso, la resistencia, el plazo y los costes requieren evaluación técnica y presupuesto específicos.",
      "",
      "---",
      "Documento generado en la plataforma interactiva de ARGZWORKS.",
      "Pendiente de envío formal mediante canal de comunicación autorizado."
    ].join("\n");
    resultBrief.value = preparedText;
    result.hidden = false;
    $("#config-copy").innerHTML = 'Copiar brief <span>↗</span>';
    result.scrollIntoView({ behavior:"smooth", block:"start" });
  }

  form.addEventListener("click", event => {
    const choice = event.target.closest("[data-field]");
    if (choice && form.contains(choice)) {
      data[choice.dataset.field] = choice.dataset.value;
      paint();
      return;
    }
    const multiple = event.target.closest("[data-multi]");
    if (multiple && form.contains(multiple)) {
      const value = multiple.dataset.value;
      data.personalization = data.personalization.includes(value) ? data.personalization.filter(x => x !== value) : [...data.personalization, value];
      paint();
    }
  });
  form.addEventListener("submit", event => event.preventDefault());
  next.addEventListener("click", () => {
    if (validate() !== true) return;
    if (step === 4) makeBrief(); else changeStep(step + 1);
  });
  back.addEventListener("click", () => changeStep(step - 1));
  tabs.forEach(tab => tab.addEventListener("click", () => {
    const target = Number(tab.dataset.jump);
    if (target <= furthest) changeStep(target);
  }));
  $("#config-reset").addEventListener("click", () => {
    data = initial();
    form.reset();
    step = 0;
    furthest = 0;
    result.hidden = true;
    preparedText = "";
    paint();
    scrollToEditor();
  });
  $("#config-edit").addEventListener("click", () => {
    result.hidden = true;
    changeStep(4);
  });
  $("#config-copy").addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(preparedText);
      $("#config-copy").textContent = "¡Brief copiado! ✓";
    } catch {
      resultBrief.focus(); resultBrief.select();
      $("#config-copy").textContent = "Selecciona y copia el texto";
    }
  });
  $("#config-download").addEventListener("click", () => {
    if (!preparedText) return;
    const file = new Blob([preparedText], { type:"text/plain;charset=utf-8" });
    const url = URL.createObjectURL(file);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "ARGZWORKS_brief_proyecto.txt";
    document.body.append(anchor);
    anchor.click();
    anchor.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1500);
  });

  window.avOpenConfigurator = (type, sector) => {
    data.sector = labels.sector[sector] ? sector : "otro";
    data.type = labels.type[type] ? type : "custom";
    step = 1;
    furthest = Math.max(furthest, 1);
    result.hidden = true;
    paint();
  };

  paint();
})();
