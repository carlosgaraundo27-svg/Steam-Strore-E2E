# Informe de Pruebas Automatizadas E2E - Laboratorio 07

**Universidad Nacional de San Cristóbal de Huamanga**
**Escuela Profesional de Ingeniería de Sistemas**
**Curso:** IS-489 Pruebas y Aseguramiento de Calidad de Software
**Docente:** Ing. Lizbeth Jaico Quispe
**Estudiantes:** Carlos Leonardo Garaundo Cuya y Miguel Matheos Palomino Cardenas

---

## 1. Introducción al Entorno de Pruebas

Para el presente laboratorio de automatización End-to-End (E2E), se ha seleccionado **Steam (store.steampowered.com)**, la plataforma de distribución digital de videojuegos y software más grande del mundo, desarrollada por Valve Corporation.

**Justificación de la elección:**
A diferencia de los entornos de prueba controlados, Steam representa un desafío real para un QA Automation Engineer debido a su complejidad arquitectónica:
*   **DOM Dinámico:** Sus elementos cambian de ID constantemente y su contenido varía según la región.
*   **Peticiones Asíncronas (AJAX):** Menús de búsqueda y autocompletado que requieren interacción humana simulada (tiempos de tipeo).
*   **Localización y A/B Testing:** Adaptación del código para manejar cambios de idioma y elementos superpuestos.

Automatizar flujos en esta plataforma demuestra un dominio avanzado en el manejo de localizadores resilientes (`getByRole`, `getByText`) y el control del motor de Playwright.

---

## 2. Herramientas y Tecnologías Utilizadas

*   **Framework:** Playwright (TypeScript)
*   **Entorno:** Node.js v20 LTS
*   **IDE:** Visual Studio Code
*   **Navegador de Prueba:** Chromium (Google Chrome)

---

## 3. Alcance de las Pruebas (Bloque 01 - Exploración y Búsqueda)

Se diseñó y ejecutó una suite de 7 casos de prueba críticos orientados a validar la funcionalidad del motor de búsqueda, los filtros dinámicos del catálogo y la internacionalización de la interfaz.

| ID | Título del Caso de Prueba | Descripción y Objetivo | Estado |
| :--- | :--- | :--- | :---: |
| **TC-01** | Búsqueda exitosa de un título | Valida que el motor de búsqueda redirija y cargue el título exacto consultado (`EA SPORTS FC™ 26`). | ✅ PASS |
| **TC-02** | Búsqueda sin resultados | Verifica el manejo de excepciones cuando se ingresan cadenas de texto inválidas o inexistentes en la base de datos. | ✅ PASS |
| **TC-03** | Menú AJAX de autocompletado | Evalúa la carga dinámica de sugerencias simulando el tipeo secuencial (`pressSequentially`) con pausas de 100ms. | ✅ PASS |
| **TC-04** | Navegación por Categorías | Valida el correcto funcionamiento del ruteo interno de la página hacia la sección de juegos de "Acción". | ✅ PASS |
| **TC-05** | Filtros de Hardware (Mandos) | Comprueba que la tienda pueda filtrar su catálogo basado en periféricos específicos (Xbox Controllers). | PASS |
| **TC-06** | Filtros de Sistema Operativo | Verifica la lógica de filtrado excluyente, asegurando que se listen exactamente los resultados correspondientes a macOS. | ✅ PASS |
| **TC-07** | Internacionalización (Español) | Evalúa que al cambiar el idioma desde el modal, el DOM se actualice y renderice las variables de entorno correctas. | ✅ PASS |

### Alcance de las Pruebas (Bloque 02 - Interacción, Formularios y Carrito)

Este segundo bloque consta de 8 casos de prueba (TC-08 al TC-15) enfocados en validar el comportamiento transaccional del e-commerce, el manejo de sesiones y la renderización de elementos estáticos y dinámicos mediante aserciones estrictas.

| ID | Título del Caso de Prueba | Descripción y Objetivo | Estado |
| :--- | :--- | :--- | :---: |
| **TC-08** | Validación del Age Gate (Restricción de Edad) | Comprueba la lógica condicional (`isVisible`) de la plataforma para juegos clasificados (+18), interactuando con el select de año y superando la barrera de edad. | ✅ PASS |
| **TC-09** | Agregar producto al carrito de compras | Verifica el flujo transaccional principal asegurando que, al hacer clic en "Add to Cart", el sistema rutea correctamente a `/cart/` y muestra el contenedor correspondiente. | ✅ PASS |
| **TC-10** | Eliminar producto del carrito | Valida el correcto funcionamiento de las funciones de manipulación del DOM al remover un ítem, asegurando que el recuento de `.cart_item` se reduzca a cero. | ✅ PASS |
| **TC-11** | Navegación al formulario de Inicio de Sesión | Evalúa el ruteo hacia el portal de autenticación utilizando selectores con expresiones regulares (`RegEx`) para garantizar resiliencia ante cambios de idioma. | ✅ PASS |
| **TC-12** | Validación de credenciales vacías en Login | Verifica que el sistema impida el inicio de sesión sin credenciales, manteniendo al usuario en la ruta `/login/` para que corrija sus datos. | ✅ PASS |
| **TC-13** | Verificación de sección Hardware | Valida el acceso directo y la carga del módulo de hardware (Steam Deck) mediante aserciones de URL. | ✅ PASS |
| **TC-14** | Redirección a la página de Soporte | Evalúa la redirección asíncrona hacia un subdominio externo (`help.steampowered.com`) gestionando los tiempos de espera con `Promise.all`. | ✅ PASS |
| **TC-15** | Verificación del pie de página (Footer) | Comprueba la accesibilidad e información legal haciendo un *scroll* forzado hasta el final del DOM y validando la existencia del texto de la corporación. | ✅ PASS |

---

## 4. Ejecución y Evidencia

Para replicar estas pruebas y visualizar el comportamiento del script, ejecutar el siguiente comando en la terminal dentro de la raíz del proyecto:

```bash
npx playwright test --workers=1 --headed
