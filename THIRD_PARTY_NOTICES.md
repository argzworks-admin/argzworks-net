# Dependencias de terceros — AVDESIGNLAB v4

Se distribuyen localmente, sin CDN ni ejecución de código remoto, los siguientes recursos públicos. Las versiones están fijadas para evitar cambios inesperados. Las atribuciones y licencias originales disponibles se incluyen en `vendor/licenses/`.

| Recurso | Versión | Licencia | Fuente oficial | Uso real |
| --- | --- | --- | --- | --- |
| Anime.js | 4.2.2 | MIT | https://github.com/juliangarnier/anime | Entrada secuenciada del titular y llamadas a la acción de la portada. |
| Lenis | 1.3.15 | MIT | https://github.com/darkroomengineering/lenis | Desplazamiento fluido y anclas, desactivado con movimiento reducido. |
| Swiper | 12.0.3 | MIT | https://github.com/nolimits4web/swiper | Galería táctil de seis conceptos, navegación por teclado, flechas y paginación. |
| Lucide (lucide-static) | 0.468.0 | ISC | https://github.com/lucide-icons/lucide | Iconos SVG individuales y locales; no se carga toda la colección. |
| MicroModal | 0.4.10 | MIT según LICENSE.md del repositorio | https://github.com/micromodal/Micromodal | Ficha técnica emergente con foco gestionado y cierre por teclado. |

**Nota de auditoría:** el `package.json` publicado en npm de MicroModal 0.4.10 identifica la licencia como `ISC`, mientras que la licencia `LICENSE.md` del repositorio oficial y su README la identifican como `MIT`. Se conserva el texto original MIT del repositorio oficial para atribución, y debe revisarse esta discrepancia antes de distribución comercial de una versión final. No se han incluido dependencias con licencias copyleft conocidas.

**Diseño progresivo:** el configurador principal funciona sin estas librerías; los efectos mejorados no recogen datos ni sustituyen la validación del formulario. Las imágenes son conceptos generados para mostrar posibilidades y no acreditan una fabricación previa.
