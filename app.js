const modal = document.getElementById("modal");
const openBtn = document.getElementById("openModal");
const closeBtn = document.getElementById("closeModal");

document.getElementById("menuBtn").addEventListener("click", () => {
  document.getElementById("menu-nav").classList.toggle("hidden");
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

document.getElementById("contactForm").addEventListener("submit", (e) => {
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

// FORMULARIO POSTULACION
const formPostulacion = document.getElementById("formPostulacion");

if (formPostulacion) {
  formPostulacion.addEventListener("submit", (e) => {
    e.preventDefault();

    const data = new FormData(formPostulacion);
    let cuerpo = "";

    for (const [key, value] of data.entries()) {
      if (typeof value === "string" && value.trim() !== "") {
        cuerpo += `• ${key.toUpperCase()}: ${value}\n`;
      }
    }

    const asunto = encodeURIComponent("Nueva postulación laboral");
    const body = encodeURIComponent(cuerpo);

    window.location.href = `mailto:oleryoriana@gmail.com?subject=${asunto}&body=${body}`;

    // cerrar modal
    modal.classList.add("hidden");
  });
}

// CREAR PDF
const btnPDF = document.getElementById("btn-pdf");
const PDF_FILENAME = "cv-postulacion.pdf";
const FALLBACK_AVATAR_BASE64 =
  "data:image/svg+xml;base64,PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHdpZHRoPSczMDAnIGhlaWdodD0nMzAwJz48cmVjdCB3aWR0aD0nMTAwJScgaGVpZ2h0PScxMDAlJyBmaWxsPScjRTVFN0VCJy8+PHRleHQgeD0nNTAlJyB5PSc1MCUnIGRvbWluYW50LWJhc2VsaW5lPSdtaWRkbGUnIHRleHQtYW5jaG9yPSdtaWRkbGUnIGZvbnQtc2l6ZT0nMzInIGZvbnQtZmFtaWx5PSdBcmlhbCwgc2Fucy1zZXJpZicgZmlsbD0nIzZCNzI4MCc+U2luIGZvdG88L3RleHQ+PC9zdmc+";

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function waitForDomReady() {
  if (document.readyState === "complete" || document.readyState === "interactive") {
    return Promise.resolve();
  }

  return new Promise((resolve) => {
    document.addEventListener("DOMContentLoaded", resolve, { once: true });
  });
}

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error("No se pudo leer la imagen seleccionada."));

    reader.readAsDataURL(file);
  });
}

function imageLoaded(img) {
  if (!img) return Promise.resolve();

  if (img.complete && img.naturalWidth > 0) {
    return Promise.resolve();
  }

  return new Promise((resolve) => {
    const onDone = () => {
      img.removeEventListener("load", onDone);
      img.removeEventListener("error", onDone);
      resolve();
    };

    img.addEventListener("load", onDone, { once: true });
    img.addEventListener("error", onDone, { once: true });
  });
}

async function waitForImages(container, fallbackSrc) {
  const images = Array.from(container.querySelectorAll("img"));

  for (const img of images) {
    img.setAttribute("crossorigin", "anonymous");

    await imageLoaded(img);

    if (!img.naturalWidth || !img.naturalHeight) {
      img.src = fallbackSrc;
      await imageLoaded(img);
    }
  }
}

function setCvData() {
  const nombre = document.querySelector('input[name="nombre"]')?.value || "";
  const email = document.querySelector('input[name="email"]')?.value || "";
  const telefono = document.querySelector('input[name="telefono"]')?.value || "";
  const perfil = document.querySelector('textarea[name="perfil"]')?.value || "";

  document.getElementById("cvNombre").innerText = nombre;
  document.getElementById("cvEmail").innerText = email;
  document.getElementById("cvTelefono").innerText = telefono;
  document.getElementById("cvPerfil").innerText = perfil;
}

function ensureRenderable(element) {
  const computed = window.getComputedStyle(element);
  const previous = {
    display: element.style.display,
    visibility: element.style.visibility,
    position: element.style.position,
    left: element.style.left,
    top: element.style.top,
  };

  if (computed.display === "none") {
    element.style.display = "block";
  }

  element.style.visibility = "visible";
  element.style.position = "fixed";
  element.style.left = "-9999px";
  element.style.top = "0";

  return () => {
    element.style.display = previous.display;
    element.style.visibility = previous.visibility;
    element.style.position = previous.position;
    element.style.left = previous.left;
    element.style.top = previous.top;
  };
}

async function resolvePhotoBase64() {
  const fileInput = document.getElementById("foto");
  const selectedFile = fileInput?.files?.[0];

  if (!selectedFile) return FALLBACK_AVATAR_BASE64;

  try {
    return await fileToBase64(selectedFile);
  } catch (error) {
    console.warn(error);
    return FALLBACK_AVATAR_BASE64;
  }
}

async function generarPDF() {
  const element = document.getElementById("cv");

  if (!element) {
    console.error("No se encontró el contenedor #cv para generar el PDF.");
    return;
  }

  await waitForDomReady();

  setCvData();

  const cvFoto = document.getElementById("cvFoto");
  cvFoto.src = await resolvePhotoBase64();

  const restoreStyles = ensureRenderable(element);

  try {
    await waitForImages(element, FALLBACK_AVATAR_BASE64);

    // Delay corto para asegurar render estable antes de html2canvas.
    await wait(350);

    await html2pdf()
      .set({
        margin: 0.5,
        filename: PDF_FILENAME,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: {
          scale: 2,
          useCORS: true,
          allowTaint: false,
          backgroundColor: "#ffffff",
          imageTimeout: 15000,
          logging: false,
        },
        jsPDF: {
          unit: "in",
          format: "a4",
          orientation: "portrait",
        },
      })
      .from(element)
      .save();
  } catch (error) {
    console.error("Error generando el PDF:", error);
    alert("Hubo un problema al generar el PDF. Revisá las imágenes e intentá nuevamente.");
  } finally {
    restoreStyles();
  }
}

if (btnPDF) {
  btnPDF.addEventListener("click", generarPDF);
}
