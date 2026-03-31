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

//Formulario email
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