# CUIT/CUIL · Calculadora

Aplicación web responsive para calcular **combinaciones matemáticas de CUIL/CUIT**. Ofrece las cuatro opciones del formulario: Masculino, Femenino, No binario (X) y Empresa o sociedad. Usa HTML, CSS y JavaScript sin dependencias de producción. El cálculo ocurre íntegramente en el navegador; la aplicación no envía ni almacena el número ingresado.

> **Alcance:** para personas se calculan los prefijos **20, 23, 24 y 27**, cualquiera sea la opción de sexo o género. M y F solo colocan primero el prefijo de la regla histórica solicitada (20 y 27 respectivamente). Desde 2021, ANSES y ARCA asignan esos prefijos de forma genérica y aleatoria, sin relación con el sexo o género. Para empresas se calculan **30, 33 y 34** sobre un número base de 8 dígitos que la entidad ya conozca; no se obtiene del DNI de sus integrantes. Ninguna combinación matemática demuestra que la clave haya sido asignada o esté vigente. Verificá la clave real en la [constancia oficial de CUIL](https://www.argentina.gob.ar/descarga-constancia-cuil) o ante [ARCA](https://www.arca.gob.ar/).

## Cómo funciona

1. Para personas se valida un DNI de 1 a 8 cifras, mayor que cero, y se completa con ceros a la izquierda hasta obtener 8 posiciones. Para empresas se exige un número base de exactamente 8 cifras, mayor que cero.
2. Se antepone cada prefijo aplicable: `20`, `23`, `24`, `27` para personas; `30`, `33`, `34` para empresas. Cada uno forma una base de 10 dígitos.
3. Se multiplica cada dígito por los pesos `6, 7, 8, 9, 4, 5, 6, 7, 8, 9` y se suman los productos.
4. El resto de dividir la suma por 11 es el dígito verificador. Si el resto es `10`, no existe un dígito decimal para esa combinación de prefijo y número base: la aplicación informa el caso para esa variante.

Los pesos son los del procedimiento `scl_verifica_dig_CUIT_new` aportado como base. Son equivalentes a los pesos convencionales `5, 4, 3, 2, 7, 6, 5, 4, 3, 2` cuando se usa `11 − (suma % 11)`: cada peso del procedimiento suma 11 con el peso convencional de la misma posición. Se excluyeron las validaciones dependientes de tablas y la lógica comentada de cambio de prefijo.

### Ejemplo

Para DNI `12345678`, la variante con prefijo 20 tiene base `2012345678`, dígito verificador `6` y resultado `20-12345678-6`. La misma base numérica produce `23-12345678-5`, `24-12345678-1` y `27-12345678-0` con los otros prefijos de persona. Solo una constancia oficial permite saber cuál se asignó realmente.

## Normativa y fuentes

- [Resolución 286/2021](https://www.argentina.gob.ar/normativa/nacional/resoluci%C3%B3n-286-2021-350568/texto): describe la estructura de 11 dígitos y los prefijos históricos 20, 27, 23 y 24; establece la asignación genérica y aleatoria para nuevos CUIL.
- [Resolución General Conjunta 5007/2021](https://www.argentina.gob.ar/normativa/nacional/resoluci%C3%B3n-5007-2021-350854/texto): extiende el criterio de prefijos genéricos y aleatorios a CUIL y CUIT de personas humanas.
- [Especificaciones técnicas del padrón](https://www.argentina.gob.ar/sites/default/files/2024/08/actualizacion_padron_version_2.pdf): enumera 20, 23, 24 y 27 para CUIL, y también 30, 33 y 34 para CUIT.
- [ARCA, errores frecuentes de CUIL o CUIT inexistente](https://arca.gob.ar/simplificacionregistral/alta-ya/ayuda/documentos/Errores-frecuentes-CUIL-o-CUIT-inexistente.pdf): indica 11 dígitos y controles de prefijo y dígito verificador; también muestra por qué superar el control matemático no confirma existencia.
- [Solicitar constancia de CUIL](https://www.argentina.gob.ar/servicio/solicitar-constancia-de-cuil) y [obtener CUIT por internet](https://www.argentina.gob.ar/servicio/obtener-cuit-por-internet): vías oficiales para conocer u obtener la clave asignada.

Se revisó además [Mi CUIL Online](https://micuilonline.com.ar/averiguar-cuil-cuit) como referencia de interfaz y explicación al usuario. Es un sitio no oficial; su contenido no se utilizó como fuente normativa. El diseño de esta aplicación toma como guía el boceto compartido por el usuario, con cuatro opciones y una identidad visual azul propia.

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

Las pruebas cubren los siete prefijos, ceros a la izquierda, los resultados extremos del módulo 11 y entradas inválidas.

## Estructura

| Archivo | Función |
| --- | --- |
| `index.html` | Formulario, resultado y enlaces oficiales |
| `styles.css` | Diseño adaptable y estados de interacción |
| `app.mjs` | Validación visual, interacción y copiado |
| `calculator.mjs` | Cálculo puro y reusable |
| `icon.svg` | Ícono propio para la pestaña y la interfaz |
| `calculator.test.mjs` | Pruebas del cálculo |

## Sitio publicado y despliegue

La versión de producción está disponible en **[cuitcuil.vercel.app](https://cuitcuil.vercel.app/)**.

El sitio es estático. En Vercel se usa **Other** como framework, sin comando de compilación y con `.` como directorio de salida; `vercel.json` declara esa configuración. `.vercelignore` evita subir archivos de sesión, cachés, pruebas y documentación local.

Esta publicación se hizo con la CLI oficial de Vercel desde la carpeta del proyecto. La conexión automática de Vercel con el repositorio de GitHub no tiene acceso a este repositorio, por lo que un nuevo `git push` **no** actualiza el sitio por sí solo. Para publicar cambios, desde esta carpeta ejecutá:

```bash
vercel deploy --prod
```
