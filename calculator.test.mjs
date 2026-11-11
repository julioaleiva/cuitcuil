import test from "node:test";
import assert from "node:assert/strict";
import { calculateCuitCuil, calculateForPrefix, calculateVariants } from "./calculator.mjs";

test("calcula con los prefijos fijos y el módulo 11", () => {
  assert.deepEqual(calculateCuitCuil("12345678", "M"), {
    prefix: "20", paddedNumber: "12345678", checkDigit: 6,
    formatted: "20-12345678-6", raw: "20123456786",
  });
  assert.equal(calculateCuitCuil("12345678", "F").formatted, "27-12345678-0");
});

test("completa con ceros y conserva verificadores 0 y 9", () => {
  assert.equal(calculateCuitCuil("3", "F").formatted, "27-00000003-0");
  assert.equal(calculateCuitCuil("7", "M").formatted, "20-00000007-9");
});

test("informa el caso sin dígito decimal para cada prefijo", () => {
  const result = calculateCuitCuil("1", "M");
  assert.equal(result.prefix, "20");
  assert.equal(result.checkDigit, null);
  assert.equal(result.formatted, null);
  assert.equal(calculateCuitCuil("9", "F").checkDigit, null);
});

test("incluye los cuatro prefijos de personas y los tres de entidades", () => {
  assert.deepEqual(calculateVariants("12345678", "X").map((item) => item.formatted), [
    "20-12345678-6", "23-12345678-5", "24-12345678-1", "27-12345678-0",
  ]);
  assert.deepEqual(calculateVariants("12345678", "COMPANY").map((item) => item.formatted), [
    "30-12345678-1", "33-12345678-0", "34-12345678-7",
  ]);
  assert.equal(calculateVariants("12345678", "F")[0].prefix, "27");
  assert.equal(calculateVariants("12345678", "M")[0].prefix, "20");
  assert.equal(calculateVariants("12345678", "X").some((item) => item.historical), false);
});

test("rechaza DNI, números de entidad y opciones inválidos", () => {
  for (const dni of ["", "0", "00000000", "123456789", "12A45678", "12.345.678", "-1"]) {
    assert.throws(() => calculateCuitCuil(dni, "M"), RangeError);
  }
  assert.throws(() => calculateCuitCuil("12345678", "X"), RangeError);
  assert.throws(() => calculateVariants("1234567", "COMPANY"), RangeError);
  assert.throws(() => calculateVariants("00000000", "COMPANY"), RangeError);
  assert.throws(() => calculateVariants("12345678", "OTHER"), RangeError);
  assert.throws(() => calculateForPrefix("12345678", "99"), RangeError);
});

test("coincide con el cálculo complementario convencional en todo el rango probado", () => {
  const conventionalWeights = [5, 4, 3, 2, 7, 6, 5, 4, 3, 2];
  for (const prefix of ["20", "23", "24", "27", "30", "33", "34"]) {
    for (let number = 1; number <= 1000; number++) {
      const result = calculateForPrefix(String(number), prefix);
      const base = result.prefix + result.paddedNumber;
      const sum = [...base].reduce((total, digit, i) => total + Number(digit) * conventionalWeights[i], 0);
      const conventional = (11 - (sum % 11)) % 11;
      assert.equal(result.checkDigit, conventional === 10 ? null : conventional);
    }
  }
});
