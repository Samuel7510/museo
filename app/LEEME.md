# Portal Web – Restauradores de la Memoria (Colegio Tom Adams IED)

## Cómo ejecutarlo
El museo 3D carga imágenes como texturas WebGL, por eso **debe abrirse desde un servidor local** (no con doble clic en el .html).

- **Opción 1:** doble clic en `iniciar.bat` → abre http://localhost:8080
- **Opción 2:** VS Code + extensión *Live Server* → clic derecho en `index.html` → *Open with Live Server*
- **Opción 3:** `powershell -ExecutionPolicy Bypass -File iniciar-servidor.ps1`

## Estructura
| Archivo | Contenido |
|---|---|
| `index.html` | Portal con las 10 secciones mínimas |
| `museo.html` | Museo Virtual de la Memoria (A-Frame 1.6) |
| `admin.html` | Panel de gestión de la base de datos (CRUD de las 8 tablas) |
| `css/styles.css`, `css/museo.css`, `css/admin.css` | Estilos (responsive) |
| `js/datos.js` | Contenidos tomados de *EVIDENCIAS PROYECTO 2025* |
| `js/db.js` | Base de datos en el navegador (localStorage) + exportar SQL |
| `js/main.js` | Menú, filtros, galería, visor, fechas, validación de formularios |
| `js/museo.js` | Componentes A-Frame: sala, cuadros, carteles, objetos 3D, movimiento |
| `js/admin.js` | Formularios y tablas del panel |
| `database/restauradores_memoria.sql` | Script MySQL: 8 tablas + datos iniciales + consultas |
| `img/` | 52 fotografías del documento de evidencias (optimizadas) |
| `models/` | Aquí van `objeto-1.glb` y `objeto-2.glb` de Luma AI (ver `models/LEEME.txt`) |

## Pendiente del equipo
1. Capturar con Luma AI los 2 objetos 3D y guardarlos en `models/`.
2. Completar el nombre del equipo en el pie de `index.html` (`[Nombre del equipo]`).
3. Verificar fechas aproximadas (en la evidencia solo aparece mes o año: se usó el día 1).
