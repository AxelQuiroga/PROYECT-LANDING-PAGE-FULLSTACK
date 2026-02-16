// Configuración escalable
const whatsappConfig = {
  countryCode: "54", // cambiar según país (sin +)
  phoneNumber: "91162970896", // número sin espacios ni guiones
  defaultMessage: "Hola, quiero información sobre entrenamiento personalizado."
};

// Construcción dinámica del link
function buildWhatsAppURL(config) {
  const fullNumber = `${config.countryCode}${config.phoneNumber}`;
  const encodedMessage = encodeURIComponent(config.defaultMessage);
  return `https://wa.me/${fullNumber}?text=${encodedMessage}`;
}

// Crear botón dinámicamente
function createWhatsAppButton() {
  const button = document.createElement("a");
  button.href = buildWhatsAppURL(whatsappConfig);
  button.target = "_blank";
  button.rel = "noopener noreferrer";
  button.className = "whatsapp-float";
  button.innerHTML = `
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="24" height="24" fill="white">
    <path d="M16 .396C7.164.396 0 7.56 0 16.396c0 2.887.76 5.708 2.2 8.187L0 32l7.615-2.17a15.9 15.9 0 008.385 2.36h.006c8.836 0 16-7.164 16-16S24.836.396 16 .396zm0 29.2h-.005a13.2 13.2 0 01-6.725-1.83l-.48-.285-4.52 1.29 1.205-4.4-.31-.45A13.19 13.19 0 012.8 16.396C2.8 9.1 8.704 3.196 16 3.196c7.296 0 13.2 5.904 13.2 13.2s-5.904 13.2-13.2 13.2zm7.2-9.84c-.39-.195-2.31-1.14-2.67-1.27-.36-.135-.615-.195-.87.195-.255.39-.99 1.27-1.215 1.53-.225.255-.45.285-.84.09-.39-.195-1.65-.61-3.14-1.95-1.16-1.03-1.94-2.3-2.165-2.69-.225-.39-.024-.6.17-.795.175-.174.39-.45.585-.675.195-.225.26-.39.39-.65.13-.26.065-.49-.03-.685-.095-.195-.87-2.1-1.19-2.88-.315-.76-.63-.66-.87-.675-.225-.01-.48-.015-.735-.015-.255 0-.675.095-1.03.49-.355.39-1.35 1.32-1.35 3.21 0 1.89 1.38 3.72 1.575 3.98.195.26 2.72 4.16 6.59 5.83.92.4 1.64.64 2.2.82.925.295 1.77.255 2.44.155.745-.11 2.31-.945 2.64-1.86.33-.915.33-1.7.23-1.86-.1-.165-.36-.26-.75-.455z"/>
  </svg>
`;


  document.body.appendChild(button);
}



// Asignar WhatsApp dinámico a botones de planes
function attachPlanButtons() {
  const planButtons = document.querySelectorAll(".plan-card a");

  planButtons.forEach(button => {
    button.addEventListener("click", function (e) {
      e.preventDefault();

      const planName = button
        .closest(".plan-card")
        .querySelector("h3")
        .textContent;

      const fullNumber = `${whatsappConfig.countryCode}${whatsappConfig.phoneNumber}`;
      const message = encodeURIComponent(
        `Hola, quiero información sobre ${planName}`
      );

      const url = `https://wa.me/${fullNumber}?text=${message}`;

      window.open(url, "_blank", "noopener,noreferrer");
    });
  });
}



// Ejecutar cuando cargue la página
document.addEventListener("DOMContentLoaded", () => {
  createWhatsAppButton();
  attachPlanButtons();
});



