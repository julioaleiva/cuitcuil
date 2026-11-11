/** Calcula una clave estimada con los prefijos fijos solicitados. */
export function calculateCuitCuil(dniInput, sex) {
  const dni = String(dniInput).trim();
  if (!/^\d{1,8}$/.test(dni) || !/[1-9]/.test(dni)) {
    throw new RangeError("Ingresá un DNI de 1 a 8 dígitos, mayor que cero y sin puntos.");
  }
  if (sex !== "M" && sex !== "F") {
    throw new RangeError("Elegí Masculino o Femenino.");
  }

  const prefix = sex === "M" ? "20" : "27";
  const paddedDni = dni.padStart(8, "0");
  const base = prefix + paddedDni;
  // Pesos del procedimiento aportado. Cada uno equivale a 11 menos
  // el peso convencional 5,4,3,2,7,6,5,4,3,2, respectivamente.
  const weights = [6, 7, 8, 9, 4, 5, 6, 7, 8, 9];
  const sum = [...base].reduce((total, digit, i) => total + Number(digit) * weights[i], 0);
  const checkDigit = sum % 11;

  if (checkDigit === 10) {
    return { prefix, paddedDni, checkDigit: null, formatted: null, raw: null };
  }

  return {
    prefix,
    paddedDni,
    checkDigit,
    formatted: `${prefix}-${paddedDni}-${checkDigit}`,
    raw: `${base}${checkDigit}`,
  };
}
