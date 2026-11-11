import test from "node:test";
import assert from "node:assert/strict";
import { calculateCuitCuil } from "./calculator.mjs";

test("calcula con los prefijos fijos y el módulo 11", () => {
  assert.deepEqual(calculateCuitCuil("12345678", "M"), {
    prefix: "20", paddedDni: "12345678", checkDigit: 6,
    formatted: "20-12345678-6", raw: "20123456786",
  });
  assert.equal(calculateCuitCuil("12345678", "F").formatted, "27-12345678-0");
});

test("completa con ceros y conserva verificadores 0 y 9", () => {
  assert.equal(calculateCuitCuil("3", "F").formatted, "27-00000003-0");
  assert.equal(calculateCuitCuil("7", "M").formatted, "20-00000007-9");
});

test("informa el caso sin dígito decimal, sin cambiar el prefijo", () => {
  const result = calculateCuitCuil("1", "M");
  assert.equal(result.prefix, "20");
  assert.equal(result.checkDigit, null);
  assert.equal(result.formatted, null);
  assert.equal(calculateCuitCuil("9", "F").checkDigit, null);
});

test("rechaza DNI inválidos y opciones fuera del alcance", () => {
  for (const dni of ["", "0", "00000000", "123456789", "12A45678", "12.345.678", "-1"]) {
    assert.throws(() => calculateCuitCuil(dni, "M"), RangeError);
  }
  assert.throws(() => calculateCuitCuil("12345678", "X"), RangeError);
});

test("coincide con el cálculo complementario convencional en todo el rango probado", () => {
  const conventionalWeights = [5, 4, 3, 2, 7, 6, 5, 4, 3, 2];
  for (const sex of ["M", "F"]) {
    for (let dni = 1; dni <= 1000; dni++) {
      const result = calculateCuitCuil(String(dni), sex);
      const base = result.prefix + result.paddedDni;
      const sum = [...base].reduce((total, digit, i) => total + Number(digit) * conventionalWeights[i], 0);
      const conventional = (11 - (sum % 11)) % 11;
      assert.equal(result.checkDigit, conventional === 10 ? null : conventional);
    }
  }
});
