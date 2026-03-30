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

//FORMULARIO POSTULACION
const formPostulacion = document.getElementById("formPostulacion");

if (formPostulacion) {
  formPostulacion.addEventListener("submit", (e) => {
    e.preventDefault();

    const data = new FormData(formPostulacion);

    let cuerpo = "";

    for (let [key, value] of data.entries()) {
      if (value.trim() !== "") {
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

//CREAR PDF
const btnPDF = document.getElementById("btn-pdf");

btnPDF.addEventListener("click", () => {

  const nombre = document.querySelector('input[name="nombre"]')?.value || "";
  const email = document.querySelector('input[name="email"]')?.value || "";
  const telefono = document.querySelector('input[name="telefono"]')?.value || "";
  const perfil = document.querySelector('textarea[name="perfil"]')?.value || "";

  document.getElementById("cvNombre").innerText = nombre;
  document.getElementById("cvEmail").innerText = email;
  document.getElementById("cvTelefono").innerText = telefono;
  document.getElementById("cvPerfil").innerText = perfil;

  const img = document.getElementById("cvFoto");
  const file = document.getElementById("foto").files[0];

  if (file) {
    const reader = new FileReader();

    reader.onload = function (e) {
      img.src = e.target.result;
      generarPDF();
    };

    reader.readAsDataURL(file);
  } else {
    img.src = "https://via.placeholder.com/150";
    generarPDF();
  }
});

function generarPDF() {
  const element = document.getElementById("cv");

  element.classList.remove("hidden");

  setTimeout(() => {
    html2pdf()
      .set({
        margin: 0.5,
        filename: "cv-postulacion.pdf",
        html2canvas: { scale: 2 },
        jsPDF: { unit: "in", format: "a4", orientation: "portrait" }
      })
      .from(element)
      .save()
      .then(() => {
        element.classList.add("hidden");
      });
  }, 400);
}