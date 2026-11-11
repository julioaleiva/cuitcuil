export const PERSON_PREFIXES = Object.freeze(["20", "23", "24", "27"]);
export const COMPANY_PREFIXES = Object.freeze(["30", "33", "34"]);
const ALL_PREFIXES = [...PERSON_PREFIXES, ...COMPANY_PREFIXES];

/** Calcula una combinación matemática para un prefijo permitido. */
export function calculateForPrefix(numberInput, prefix) {
  const number = String(numberInput).trim();
  if (!/^\d{1,8}$/.test(number) || !/[1-9]/.test(number)) {
    throw new RangeError("Ingresá un número base de 1 a 8 dígitos, mayor que cero y sin puntos.");
  }
  if (!ALL_PREFIXES.includes(prefix)) {
    throw new RangeError("Elegí un prefijo válido.");
  }

  const paddedNumber = number.padStart(8, "0");
  const base = prefix + paddedNumber;
  // Pesos del procedimiento aportado. Cada uno equivale a 11 menos
  // el peso convencional 5,4,3,2,7,6,5,4,3,2, respectivamente.
  const weights = [6, 7, 8, 9, 4, 5, 6, 7, 8, 9];
  const sum = [...base].reduce((total, digit, i) => total + Number(digit) * weights[i], 0);
  const checkDigit = sum % 11;

  if (checkDigit === 10) {
    return { prefix, paddedNumber, checkDigit: null, formatted: null, raw: null };
  }

  return {
    prefix,
    paddedNumber,
    checkDigit,
    formatted: `${prefix}-${paddedNumber}-${checkDigit}`,
    raw: `${base}${checkDigit}`,
  };
}

/** Conserva la regla inicial M→20 y F→27 como referencia histórica. */
export function calculateCuitCuil(dniInput, sex) {
  if (sex !== "M" && sex !== "F") {
    throw new RangeError("Elegí Masculino o Femenino.");
  }
  return calculateForPrefix(dniInput, sex === "M" ? "20" : "27");
}

/** Devuelve las variantes del tipo elegido; no identifica la clave asignada. */
export function calculateVariants(numberInput, category) {
  if (!["M", "F", "X", "COMPANY"].includes(category)) {
    throw new RangeError("Elegí una opción válida.");
  }
  const number = String(numberInput).trim();
  if (category === "COMPANY" && (!/^\d{8}$/.test(number) || !/[1-9]/.test(number))) {
    throw new RangeError("Ingresá los 8 dígitos del número base de la entidad.");
  }
  const assumedPrefix = category === "M" ? "20" : category === "F" ? "27" : null;
  const prefixes = assumedPrefix
    ? [assumedPrefix]
    : category === "COMPANY" ? COMPANY_PREFIXES : PERSON_PREFIXES;
  return prefixes.map((prefix) => ({
    ...calculateForPrefix(number, prefix),
    assumed: prefix === assumedPrefix,
  }));
}
