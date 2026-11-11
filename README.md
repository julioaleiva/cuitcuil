# CUIT/CUIL · Calculadora

Aplicación web responsive para calcular un **CUIL/CUIT estimado** a partir de un DNI y una opción M o F. Usa HTML, CSS y JavaScript sin dependencias de producción. El cálculo ocurre íntegramente en el navegador; la aplicación no envía ni almacena el DNI.

> **Alcance:** esta herramienta aplica deliberadamente la regla solicitada **M → 20, F → 27**. Desde 2021, el prefijo que asignan ANSES y ARCA a personas humanas es genérico y aleatorio, sin relación con el sexo o género. Un resultado matemáticamente válido no demuestra que ese número haya sido asignado, esté vigente o corresponda a una persona. Verificá el número real en la [constancia oficial de CUIL](https://www.argentina.gob.ar/descarga-constancia-cuil) o ante [ARCA](https://www.arca.gob.ar/).

## Cómo funciona

1. Se valida un DNI de 1 a 8 cifras, mayor que cero, y se completa con ceros a la izquierda hasta obtener 8 posiciones.
2. Se antepone `20` para M o `27` para F. Esto forma una base de 10 dígitos.
3. Se multiplica cada dígito por los pesos `6, 7, 8, 9, 4, 5, 6, 7, 8, 9` y se suman los productos.
4. El resto de dividir la suma por 11 es el dígito verificador. Si el resto es `10`, no existe un dígito decimal para esa combinación de prefijo y DNI: la aplicación informa el caso, sin inventar otro prefijo.

Los pesos son los del procedimiento `scl_verifica_dig_CUIT_new` aportado como base. Son equivalentes a los pesos convencionales `5, 4, 3, 2, 7, 6, 5, 4, 3, 2` cuando se usa `11 − (suma % 11)`: cada peso del procedimiento suma 11 con el peso convencional de la misma posición. Se excluyeron las validaciones dependientes de tablas y la lógica comentada de cambio de prefijo.

### Ejemplo

Para M y DNI `12345678`, la base es `2012345678`. El dígito verificador es `6` y el número estimado es `20-12345678-6`.

## Normativa y fuentes

- [Resolución 286/2021](https://www.argentina.gob.ar/normativa/nacional/resoluci%C3%B3n-286-2021-350568/texto): describe la estructura de 11 dígitos y los prefijos históricos 20, 27, 23 y 24; establece la asignación genérica y aleatoria para nuevos CUIL.
- [Resolución General Conjunta 5007/2021](https://www.argentina.gob.ar/normativa/nacional/resoluci%C3%B3n-5007-2021-350854/texto): extiende el criterio de prefijos genéricos y aleatorios a CUIL y CUIT de personas humanas.
- [ARCA, errores frecuentes de CUIL o CUIT inexistente](https://arca.gob.ar/simplificacionregistral/alta-ya/ayuda/documentos/Errores-frecuentes-CUIL-o-CUIT-inexistente.pdf): indica 11 dígitos y controles de prefijo y dígito verificador; también muestra por qué superar el control matemático no confirma existencia.
- [Solicitar constancia de CUIL](https://www.argentina.gob.ar/servicio/solicitar-constancia-de-cuil) y [obtener CUIT por internet](https://www.argentina.gob.ar/servicio/obtener-cuit-por-internet): vías oficiales para conocer u obtener la clave asignada.

Se revisó además [Mi CUIL Online](https://micuilonline.com.ar/averiguar-cuil-cuit) como referencia de interfaz y explicación al usuario. Es un sitio no oficial; su contenido no se utilizó como fuente normativa. El diseño de esta aplicación toma como guía el boceto compartido por el usuario, con opciones limitadas a M y F y una identidad visual azul propia.

## Uso local

Abrí `index.html` desde un servidor estático local (los módulos JavaScript requieren HTTP). Por ejemplo:

```bash
npx serve .
```

Luego abrí la dirección que muestre el servidor. No se necesitan variables de entorno ni servicios externos. La fuente web es opcional: el navegador usa fuentes del sistema si no puede cargarla.

## Pruebas

```bash
node --test
```

Las pruebas cubren los prefijos, ceros a la izquierda, los resultados extremos del módulo 11 y entradas inválidas.

## Estructura

| Archivo | Función |
| --- | --- |
| `index.html` | Formulario, resultado y enlaces oficiales |
| `styles.css` | Diseño adaptable y estados de interacción |
| `app.mjs` | Validación visual, interacción y copiado |
| `calculator.mjs` | Cálculo puro y reusable |
| `icon.svg` | Ícono propio para la pestaña y la interfaz |
| `calculator.test.mjs` | Pruebas del cálculo |

## Publicación en Vercel

El sitio es estático. Al importar este repositorio en Vercel, seleccioná **Other** como framework, dejá vacío el comando de compilación y usá `.` como directorio de salida. El archivo `vercel.json` también declara esa configuración.
