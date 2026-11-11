import { calculateCuitCuil } from "./calculator.mjs";

const form = document.querySelector("#calculator-form");
const dniInput = document.querySelector("#dni");
const result = document.querySelector("#result");
const noResult = document.querySelector("#no-result");
const resultNumber = document.querySelector("#result-number");
const resultDetail = document.querySelector("#result-detail");
const copyButton = document.querySelector("#copy-button");
const copyText = copyButton.querySelector("span");
const dniError = document.querySelector("#dni-error");
const sexError = document.querySelector("#sex-error");
let lastRaw = "";

function clearErrors() {
  dniError.hidden = true;
  sexError.hidden = true;
  dniInput.removeAttribute("aria-invalid");
}

function hideOutput() {
  result.hidden = true;
  noResult.hidden = true;
  lastRaw = "";
  copyText.textContent = "Copiar";
}

dniInput.addEventListener("input", () => {
  const cleaned = dniInput.value.replace(/[.\s-]/g, "");
  if (cleaned !== dniInput.value) dniInput.value = cleaned;
  clearErrors();
  hideOutput();
});

form.querySelectorAll('[name="sex"]').forEach((radio) => {
  radio.addEventListener("change", () => { clearErrors(); hideOutput(); });
});

form.addEventListener("submit", (event) => {
  event.preventDefault();
  clearErrors();
  hideOutput();

  const sex = form.querySelector('[name="sex"]:checked')?.value;
  if (!sex) {
    sexError.textContent = "Elegí una de las dos opciones para calcular.";
    sexError.hidden = false;
  }

  try {
    const calculated = calculateCuitCuil(dniInput.value, sex || "M");
    if (!sex) return;
    if (calculated.checkDigit === null) {
      noResult.hidden = false;
      return;
    }
    resultNumber.textContent = calculated.formatted;
    resultDetail.textContent = `Prefijo ${calculated.prefix} · DNI ${calculated.paddedDni} · Verificador ${calculated.checkDigit}`;
    lastRaw = calculated.raw;
    result.hidden = false;
  } catch (error) {
    if (dniInput.value.trim() && /^\d{1,8}$/.test(dniInput.value.trim()) && !/[1-9]/.test(dniInput.value)) {
      dniError.textContent = "El DNI debe ser mayor que cero.";
    } else {
      dniError.textContent = "Ingresá un DNI de 1 a 8 dígitos, solo con números.";
    }
    dniError.hidden = false;
    dniInput.setAttribute("aria-invalid", "true");
    dniInput.focus();
  }
});

copyButton.addEventListener("click", async () => {
  if (!lastRaw) return;
  try {
    await navigator.clipboard.writeText(lastRaw);
    copyText.textContent = "Copiado";
  } catch {
    copyText.textContent = "No se pudo copiar";
  }
});
