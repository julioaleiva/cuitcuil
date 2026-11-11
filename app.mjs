import { calculateVariants } from "./calculator.mjs";

const form = document.querySelector("#calculator-form");
const numberInput = document.querySelector("#dni");
const identifierLabel = document.querySelector("#identifier-label");
const numberHelp = document.querySelector("#dni-help");
const categoryHelp = document.querySelector("#sex-help");
const numberError = document.querySelector("#dni-error");
const categoryError = document.querySelector("#sex-error");
const result = document.querySelector("#result");
const resultIntro = document.querySelector("#result-intro");
const variantList = document.querySelector("#variant-list");
let wasCompany = false;

const selectedCategory = () => form.querySelector('[name="category"]:checked')?.value;

function hideOutput() {
  result.hidden = true;
  variantList.replaceChildren();
}

function clearErrors() {
  numberError.hidden = true;
  categoryError.hidden = true;
  numberInput.removeAttribute("aria-invalid");
}

function updateInputContext() {
  const company = selectedCategory() === "COMPANY";
  if (company !== wasCompany) numberInput.value = "";
  wasCompany = company;
  identifierLabel.textContent = company ? "Número base de la entidad" : "Número de DNI";
  numberHelp.textContent = company
    ? "Ingresá los 8 dígitos centrales del CUIT de la entidad. No uses un DNI personal."
    : "Solo números, sin puntos. Acepta de 1 a 8 dígitos.";
  categoryHelp.textContent = company
    ? "La CUIT de una entidad no se obtiene del DNI de sus integrantes."
    : "Para personas, el prefijo asignado no depende del sexo o género.";
  numberInput.placeholder = company ? "Ej.: 12345678" : "Ej.: 32985165";
  numberInput.maxLength = company ? 8 : 12;
  clearErrors();
  hideOutput();
}

function makeVariantCard(variant) {
  const card = document.createElement("article");
  card.className = `variant-card${variant.historical ? " variant-card--historical" : ""}${variant.raw ? "" : " variant-card--unavailable"}`;

  const top = document.createElement("div");
  top.className = "variant-top";
  const label = document.createElement("span");
  label.textContent = `PREFIJO ${variant.prefix}`;
  top.append(label);
  if (variant.historical) {
    const badge = document.createElement("span");
    badge.className = "historical-badge";
    badge.textContent = "Referencia histórica";
    top.append(badge);
  }

  const number = document.createElement("strong");
  number.className = "variant-number";
  number.textContent = variant.formatted ?? "Sin dígito válido";

  const bottom = document.createElement("div");
  bottom.className = "variant-bottom";
  const detail = document.createElement("span");
  detail.textContent = variant.raw
    ? `Verificador ${variant.checkDigit}`
    : "El módulo 11 da 10 para este prefijo";
  bottom.append(detail);

  if (variant.raw) {
    const copy = document.createElement("button");
    copy.type = "button";
    copy.className = "variant-copy";
    copy.textContent = "Copiar";
    copy.setAttribute("aria-label", `Copiar ${variant.formatted}`);
    copy.addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(variant.raw);
        copy.textContent = "Copiado";
      } catch {
        copy.textContent = "No se pudo copiar";
      }
    });
    bottom.append(copy);
  }

  card.append(top, number, bottom);
  return card;
}

numberInput.addEventListener("input", () => {
  const cleaned = numberInput.value.replace(/[.\s-]/g, "");
  if (cleaned !== numberInput.value) numberInput.value = cleaned;
  clearErrors();
  hideOutput();
});

form.querySelectorAll('[name="category"]').forEach((radio) => {
  radio.addEventListener("change", updateInputContext);
});

form.addEventListener("submit", (event) => {
  event.preventDefault();
  clearErrors();
  hideOutput();

  const category = selectedCategory();
  if (!category) {
    categoryError.textContent = "Elegí una opción para calcular.";
    categoryError.hidden = false;
  }

  let variants;
  try {
    variants = calculateVariants(numberInput.value, category ?? "M");
  } catch {
    numberError.textContent = category === "COMPANY"
      ? "Ingresá exactamente 8 dígitos numéricos del número base de la entidad."
      : "Ingresá un DNI de 1 a 8 dígitos, mayor que cero y solo con números.";
    numberError.hidden = false;
    numberInput.setAttribute("aria-invalid", "true");
    numberInput.focus();
    return;
  }
  if (!category) return;

  resultIntro.textContent = category === "COMPANY"
    ? "Se calculan 30, 33 y 34 sobre el número base ingresado. ARCA determina la CUIT efectivamente asignada."
    : category === "X"
      ? "Se calculan 20, 23, 24 y 27. Ningún prefijo identifica actualmente el género ni confirma el CUIL asignado."
      : "Se calculan 20, 23, 24 y 27. La primera opción refleja la regla histórica; hoy el prefijo se asigna sin relación con el sexo o género.";
  variantList.append(...variants.map(makeVariantCard));
  result.hidden = false;
});
