const modal = document.getElementById("modal");
const openBtn = document.getElementById("openModal");
const closeBtn = document.getElementById("closeModal");
const formPostulacion = document.getElementById("formPostulacion");
const btnPdf = document.getElementById("btn-pdf");
const btnPostulacion = document.getElementById("btn-postulacion");
const inputFoto = document.getElementById("foto");
const previewFoto = document.getElementById("previewFoto");
const btnMas = document.getElementById("btn-mas-texto");
const masTexto = document.getElementById("mas-texto");

const EMAILJS_CONFIG = {
  publicKey: "HlfnK-aglYbt-S_i-",
  serviceId: "service_wx55jqg",
  templateId: "template_vay4i7g",
};

document.getElementById("menuBtn").addEventListener("click", () => {
  document.getElementById("menu-nav").classList.toggle("hidden");
});

btnMas.addEventListener("click", () => {
  masTexto.classList.toggle("hidden");

  if (masTexto.classList.contains("hidden")) {
    btnMas.textContent = "Leer más";
  } else {
    btnMas.textContent = "Leer menos";
  }
});

openBtn.addEventListener("click", () => {
  modal.classList.remove("hidden");
  modal.classList.add("flex");
});

closeBtn.addEventListener("click", () => {
  modal.classList.add("hidden");
});

// cerrar clickeando afuera
modal.addEventListener("click", (e) => {
  if (e.target === modal) {
    modal.classList.add("hidden");
  }
});

//Formulario email
document.getElementById("contactForm").addEventListener("submit", (e) => {
// Formulario email simple de contacto
const contactForm = document.getElementById("contactForm");
contactForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const nombre = document.getElementById("nombre").value;
  const email = document.getElementById("email").value;
  const mensaje = document.getElementById("mensaje").value;

  const asunto = encodeURIComponent("Nueva consulta desde la web");
  const cuerpo = encodeURIComponent(
    `Nombre: ${nombre}\nEmail: ${email}\n\nMensaje:\n${mensaje}`
  );

  const mailtoLink = `mailto:oleryoriana@gmail.com?subject=${asunto}&body=${cuerpo}`;

  window.location.href = mailtoLink;
});
});

function getOrCreateFeedback() {
  let feedback = document.getElementById("postulacion-feedback");
  if (!feedback) {
    feedback = document.createElement("div");
    feedback.id = "postulacion-feedback";
    feedback.className = "text-sm px-4 py-3 rounded-lg mx-6 mb-5";
    formPostulacion.prepend(feedback);
  }
  return feedback;
}

function mostrarMensaje(texto, tipo = "info") {
  const feedback = getOrCreateFeedback();
  const estilos = {
    success: "bg-green-500/20 text-green-200 border border-green-500/30",
    error: "bg-red-500/20 text-red-200 border border-red-500/30",
    info: "bg-blue-500/20 text-blue-200 border border-blue-500/30",
  };

  feedback.className = `text-sm px-4 py-3 rounded-lg mx-6 mb-5 ${estilos[tipo] || estilos.info}`;
  feedback.textContent = texto;
}

function setLoading(button, isLoading, loadingText) {
  if (!button) return;
  if (isLoading) {
    button.dataset.originalText = button.textContent;
    button.textContent = loadingText;
    button.disabled = true;
    button.classList.add("opacity-70", "cursor-not-allowed");
  } else {
    button.textContent = button.dataset.originalText || button.textContent;
    button.disabled = false;
    button.classList.remove("opacity-70", "cursor-not-allowed");
  }
}

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    if (!file) {
      resolve("");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => resolve(reader.result || "");
    reader.onerror = () => reject(new Error("No se pudo leer la imagen."));
    reader.readAsDataURL(file);
  });
}

function obtenerNombreCampo(el, index) {
  return (
    el.name ||
    el.id ||
    (el.placeholder
      ? el.placeholder
          .toLowerCase()
          .replace(/[^a-z0-9áéíóúñ\s]/gi, "")
          .trim()
          .replace(/\s+/g, "_")
      : `campo_${index + 1}`)
  );
}

async function obtenerDatosFormulario() {
  const fields = Array.from(
    formPostulacion.querySelectorAll("input, select, textarea")
  ).filter((el) => !["button", "submit", "file"].includes(el.type));

  const datos = {};

  fields.forEach((el, index) => {
    const key = obtenerNombreCampo(el, index);
    datos[key] = (el.value || "").trim();
  });

  const fotoFile = inputFoto.files?.[0] || null;
  const fotoBase64 = await fileToBase64(fotoFile);

  return {
    ...datos,
    fotoNombre: fotoFile?.name || "",
    fotoBase64,
  };
}

function construirContenidoPostulacion(datos) {
  return `
DATOS PERSONALES
- Nombre: ${datos.nombre || ""}
- Edad: ${datos.edad || ""}
- Teléfono: ${datos.telefono || ""}
- Email: ${datos.email || ""}
- Ciudad/Zona: ${datos.ciudad || ""}
- Disponibilidad para viajar: ${datos.viajar || ""}

OBJETIVO LABORAL
- Área: ${datos.area || ""}
- Tipo de trabajo: ${datos.motivacion || ""}
- Interés por el trabajo: ${datos.interes || ""}

EXPERIENCIA LABORAL
- Empresa: ${datos.empresa || ""}
- Puesto: ${datos.puestos || ""}
- Fechas: ${datos.fechas || ""}
- Tareas realizadas: ${datos.tareas || ""}
- Contacto con clientes: ${datos.clientes || ""}
- Manejo de dinero/responsabilidades: ${datos.responsabilidad || ""}

EDUCACIÓN
- Nivel de estudios: ${datos.nivel_estudios || ""}
- Institución: ${datos.institucion || ""}
- ¿Finalizado?: ${datos.finalizado || ""}

HABILIDADES
- Habilidades principales: ${datos.habilidades || ""}
- Fortalezas: ${datos.fortalezas || ""}

PERFIL PERSONAL
- Descripción: ${datos.perfil || ""}
- ¿Por qué deberían contratarte?: ${datos.contratacion || ""}

SITUACIONES LABORALES
- Reacción ante problemas: ${datos.problemas || ""}
- Experiencia en equipo: ${datos.equipo || ""}

HERRAMIENTAS
- Uso de computadora: ${datos.pc || ""}
- Programas: ${datos.programas || ""}
- Trabajo no deseado: ${datos.no_trabajo || ""}
- Disponibilidad horaria: ${datos.disponibilidad || ""}
- Fecha de inicio: ${datos.inicio || ""}
`.trim();
}

function validarMinimos(datos) {
  if (!datos.nombre || !datos.email) {
    throw new Error("Completá al menos Nombre y Email antes de continuar.");
  }
}

function generarPDF(datos) {
  try {
    validarMinimos(datos);

    if (!window.jspdf || !window.jspdf.jsPDF) {
      throw new Error("No se encontró jsPDF. Revisá que el CDN esté cargado.");
    }

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF("p", "mm", "a4");

    let y = 15;
    const lineHeight = 7;
    const marginX = 15;
    const maxWidth = 180;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.text("Currículum - Postulación", marginX, y);
    y += 10;

    if (datos.fotoBase64) {
      try {
        doc.addImage(datos.fotoBase64, "JPEG", 150, 10, 40, 40);
      } catch {
        doc.addImage(datos.fotoBase64, "PNG", 150, 10, 40, 40);
      }
    }

    const secciones = [
      ["Datos personales", [
        `Nombre: ${datos.nombre || ""}`,
        `Edad: ${datos.edad || ""}`,
        `Teléfono: ${datos.telefono || ""}`,
        `Email: ${datos.email || ""}`,
        `Ciudad/Zona: ${datos.ciudad || ""}`,
        `Disponibilidad para viajar: ${datos.viajar || ""}`,
      ]],
      ["Objetivo laboral", [
        `Área: ${datos.area || ""}`,
        `Tipo de trabajo: ${datos.motivacion || ""}`,
        `Interés por el trabajo: ${datos.interes || ""}`,
      ]],
      ["Experiencia laboral", [
        `Empresa: ${datos.empresa || ""}`,
        `Puesto: ${datos.puestos || ""}`,
        `Fechas: ${datos.fechas || ""}`,
        `Tareas realizadas: ${datos.tareas || ""}`,
        `Contacto con clientes: ${datos.clientes || ""}`,
        `Manejo de dinero/responsabilidades: ${datos.responsabilidad || ""}`,
      ]],
      ["Educación", [
        `Nivel de estudios: ${datos.nivel_estudios || ""}`,
        `Institución: ${datos.institucion || ""}`,
        `Finalizado: ${datos.finalizado || ""}`,
      ]],
      ["Habilidades", [
        `Habilidades principales: ${datos.habilidades || ""}`,
        `Fortalezas: ${datos.fortalezas || ""}`,
      ]],
      ["Perfil personal", [
        `Descripción: ${datos.perfil || ""}`,
        `Motivo de contratación: ${datos.contratacion || ""}`,
      ]],
      ["Situaciones laborales", [
        `Reacción ante problemas: ${datos.problemas || ""}`,
        `Experiencia en equipo: ${datos.equipo || ""}`,
      ]],
      ["Herramientas", [
        `Uso de computadora: ${datos.pc || ""}`,
        `Programas: ${datos.programas || ""}`,
        `Trabajo no deseado: ${datos.no_trabajo || ""}`,
        `Disponibilidad horaria: ${datos.disponibilidad || ""}`,
        `Inicio: ${datos.inicio || ""}`,
      ]],
    ];

    secciones.forEach(([titulo, lineas]) => {
      if (y > 270) {
        doc.addPage();
        y = 15;
      }

      doc.setFont("helvetica", "bold");
      doc.setFontSize(13);
      doc.text(titulo, marginX, y);
      y += lineHeight;

      doc.setFont("helvetica", "normal");
      doc.setFontSize(11);

      lineas.forEach((linea) => {
        const lineasCortadas = doc.splitTextToSize(linea, maxWidth);
        if (y + lineasCortadas.length * lineHeight > 280) {
          doc.addPage();
          y = 15;
        }
        doc.text(lineasCortadas, marginX, y);
        y += lineasCortadas.length * lineHeight;
      });

      y += 2;
    });

    const safeName = (datos.nombre || "postulante").replace(/\s+/g, "_");
    doc.save(`CV_${safeName}.pdf`);
    mostrarMensaje("PDF generado y descargado correctamente.", "success");
  } catch (error) {
    mostrarMensaje(error.message || "No se pudo generar el PDF.", "error");
    throw error;
  }
}

async function enviarPostulacion(datos) {
  try {
    validarMinimos(datos);

    if (!window.emailjs) {
      throw new Error("No se encontró EmailJS. Revisá que el CDN esté cargado.");
    }

    if (
      Object.values(EMAILJS_CONFIG).some((value) => value.startsWith("TU_"))
    ) {
      throw new Error(
        "Configurá EMAILJS_CONFIG (publicKey, serviceId, templateId) antes de enviar."
      );
    }

    window.emailjs.init(EMAILJS_CONFIG.publicKey);

    const templateParams = {
      ...datos,
      postulacion_texto: construirContenidoPostulacion(datos),
      foto_base64: datos.fotoBase64,
      foto_nombre: datos.fotoNombre || "foto-postulante.jpg",
      to_email: "mailto:oleryoriana@gmail.com",
    };

    await window.emailjs.send(
      EMAILJS_CONFIG.serviceId,
      EMAILJS_CONFIG.templateId,
      templateParams
    );

    mostrarMensaje("Postulación enviada correctamente por email.", "success");
  } catch (error) {
    mostrarMensaje(error.message || "No se pudo enviar la postulación.", "error");
    throw error;
  }
}

inputFoto.addEventListener("change", async () => {
  try {
    const file = inputFoto.files?.[0];
    if (!file) return;
    const base64 = await fileToBase64(file);
    previewFoto.src = base64;
  } catch (error) {
    mostrarMensaje("No se pudo previsualizar la imagen seleccionada.", "error");
  }
});

btnPdf.addEventListener("click", async () => {
  setLoading(btnPdf, true, "Generando PDF...");
  try {
    const datos = await obtenerDatosFormulario();
    generarPDF(datos);
  } catch {
    // Error ya gestionado en generarPDF
  } finally {
    setLoading(btnPdf, false);
  }
});

formPostulacion.addEventListener("submit", async (e) => {
  e.preventDefault();
  setLoading(btnPostulacion, true, "Enviando...");

  try {
    const datos = await obtenerDatosFormulario();
    await enviarPostulacion(datos);
    formPostulacion.reset();
    previewFoto.src = "https://via.placeholder.com/150";
  } catch {
    // Error ya gestionado en enviarPostulacion
  } finally {
    setLoading(btnPostulacion, false);
  }
});