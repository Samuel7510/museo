/* =========================================================
   DATOS INICIALES DEL PROYECTO (fuente: EVIDENCIAS PROYECTO 2025)
   Se usan para "sembrar" la base de datos local la primera vez.
   ========================================================= */

const fotos = (prefijo, desde, hasta) => {
  const lista = [];
  for (let i = desde; i <= hasta; i++) lista.push(`img/${prefijo}-${String(i).padStart(2, '0')}.jpg`);
  return lista;
};

const SEED = {
  Eventos: [
    { id: 1, nombre: 'Exposición "Escuelas que recuerdan, narran y resignifican la guerra"', tipo: 'Exposición', fecha_inicio: '2018-04-24', fecha_fin: '2018-05-07', lugar: 'Feria Internacional del Libro de Bogotá', organizador: 'Secretaría de Educación del Distrito', estado: 'Realizado', imagen_url: 'img/muestra-01.jpg', enlace: 'https://www.youtube.com/watch?v=pdQ-DnRZfyQ', descripcion: 'Participación en la Feria del Libro 2018. Antecedente directo del Proyecto Restauradores de la Memoria.' },
    { id: 2, nombre: 'Museo Inspirador de la Memoria', tipo: 'Muestra comunitaria', fecha_inicio: '2024-10-30', fecha_fin: '2024-10-30', lugar: 'Bahía frente a la Alcaldía Local de Kennedy', organizador: 'Colegio Tom Adams IED y Colegio Los Periodistas IED', estado: 'Realizado', imagen_url: 'img/museo-inspirador-afiche.jpg', enlace: '', descripcion: 'Entorno Escolar Inspirador La Amistad: comparsa por el entorno, museo vivo, Museo Escolar "Restauradores de la Memoria", memorial para habitantes del entorno y presentaciones artísticas. La comunidad trajo objetos antiguos y fotografías de antaño.' },
    { id: 3, nombre: 'Reconocimiento Entornos Escolares Inspiradores', tipo: 'Reconocimiento', fecha_inicio: '2025-02-25', fecha_fin: '2025-02-25', lugar: 'Bogotá', organizador: 'Alcaldía Mayor de Bogotá – Secretaría de Educación', estado: 'Realizado', imagen_url: 'img/entornos-reconocimiento-1.jpg', enlace: 'https://x.com/Bogota/status/1894407697602080927', descripcion: 'Reconocimiento al trabajo articulado entre la institución, la comunidad y las entidades del entorno escolar.' },
    { id: 4, nombre: 'Actividad hito "Cuerpos que recuerdan, arte y memoria"', tipo: 'Muestra comunitaria', fecha_inicio: '2025-06-05', fecha_fin: '2025-06-05', lugar: 'Bahía frente a la Alcaldía Local de Kennedy', organizador: 'Entorno Escolar Inspirador La Amistad', estado: 'Realizado', imagen_url: 'img/cuerpos-que-recuerdan.jpg', enlace: '', descripcion: 'Encuentro para reconstruir, desde el arte y la cultura, la memoria colectiva del territorio con estudiantes, docentes, vecinos y organizaciones.' },
    { id: 5, nombre: 'Salida pedagógica Eje de la Memoria y la Paz', tipo: 'Salida pedagógica', fecha_inicio: '2025-06-01', fecha_fin: '2025-06-30', lugar: 'Centro Nacional de Memoria Histórica, Bogotá', organizador: 'Colegio Tom Adams IED – CNMH', estado: 'Realizado', imagen_url: 'img/salida-02.jpg', enlace: 'https://web.facebook.com/reel/1748586202702527', descripcion: 'Recorrido por lugares de memoria de la ciudad con el acompañamiento del Centro Nacional de Memoria Histórica.' },
    { id: 6, nombre: 'Taller de co-creación: Exposición Permanente', tipo: 'Taller', fecha_inicio: '2025-08-30', fecha_fin: '2025-08-30', lugar: 'Centro de Memoria, Paz y Reconciliación', organizador: 'Centro de Memoria, Paz y Reconciliación', estado: 'Realizado', imagen_url: 'img/taller-cocreacion.jpg', enlace: '', descripcion: 'Construcción colectiva de una exposición polifónica sobre experiencias de resistencia y construcción de memoria. 2:30 p.m. a 6:00 p.m.' },
    { id: 7, nombre: 'Festival Rolotopía 2025', tipo: 'Festival', fecha_inicio: '2025-09-19', fecha_fin: '2025-09-28', lugar: 'Localidad de Kennedy, Bogotá', organizador: 'Festival Rolotopía', estado: 'Realizado', imagen_url: 'img/rolotopia-2025.jpg', enlace: '', descripcion: 'Desfile de comparsas (19 sep.), Foro "Democratización del privilegio de la mirada" (25 sep.) y evento central (27 y 28 sep.).' },
    { id: 8, nombre: 'Inauguración de la exposición "La Escuela: territorio de paz"', tipo: 'Exposición', fecha_inicio: '2025-10-22', fecha_fin: '2025-10-22', lugar: 'Centro de Memoria, Paz y Reconciliación', organizador: 'Red de colegios como lugares de memoria', estado: 'Realizado', imagen_url: 'img/expo-escuela-territorio-paz.jpg', enlace: 'https://www.instagram.com/p/DQMuGmsjtRB/', descripcion: 'Exposición resultado del trabajo en torno a las memorias vivas de 10 colegios de diferentes localidades de Bogotá.' },
    { id: 9, nombre: 'INFOMATRIX Sudamérica 2025', tipo: 'Concurso', fecha_inicio: '2025-11-01', fecha_fin: '2025-11-30', lugar: 'Colombia', organizador: 'INFOMATRIX – SOLACYT', estado: 'Realizado', imagen_url: 'img/virtual-3.jpg', enlace: 'https://infomatrix.lat/colombia/', descripcion: 'XX Concurso Iberoamericano de Proyectos de Ciencia y Tecnología. Categoría Diseño de Software: Museo Virtual de la Memoria.' },
    { id: 10, nombre: 'Quinta versión del Museo Escolar de la Memoria', tipo: 'Muestra comunitaria', fecha_inicio: '2025-11-27', fecha_fin: '2025-11-27', lugar: 'Colegio Tom Adams IED, Kennedy', organizador: 'Colegio Tom Adams IED con acompañamiento del CNMH', estado: 'Realizado', imagen_url: 'img/muestra-03.jpg', enlace: 'https://x.com/CentroMemoriaH/status/1993854790150050186', descripcion: 'Muestra comunitaria con objetos, obras, danza, música, teatro y experiencia de realidad virtual.' }
  ],

  Actividades: [
    { id: 1, id_evento: 5, nombre: 'Recorrido Eje de la Memoria y la Paz', tipo: 'Salida pedagógica', fecha: '2025-06-01', responsable: 'Docentes del proyecto', lugar: 'Bogotá', descripcion: 'Visita guiada a lugares de memoria de la ciudad junto al Centro Nacional de Memoria Histórica.' },
    { id: 2, id_evento: 6, nombre: 'Co-creación de exposición polifónica', tipo: 'Taller', fecha: '2025-08-30', responsable: 'Estudiantes y docentes', lugar: 'Centro de Memoria, Paz y Reconciliación', descripcion: 'Elaboración colectiva del tejido de la memoria.' },
    { id: 3, id_evento: null, nombre: 'El Guateque Ep. 115 – Especial Cátedra de Paz: apuntes para construir paz desde el aula (parte III)', tipo: 'Entrevista radial', fecha: '2025-10-12', responsable: 'Javeriana Estéreo 91.9 FM', lugar: 'Radio', descripcion: 'Programa El Guateque, Memorias Rurales.' },
    { id: 4, id_evento: null, nombre: 'El Guateque Ep. 121 – Proyecto Restauradores de Memoria', tipo: 'Entrevista radial', fecha: '2025-11-23', responsable: 'Javeriana Estéreo 91.9 FM', lugar: 'Radio', descripcion: 'Proyectos restauradores de la memoria histórica en escuelas.' },
    { id: 5, id_evento: null, nombre: 'El Guateque Ep. 132 – Las madres de falsos positivos en el marco del proyecto', tipo: 'Entrevista radial', fecha: '2026-03-22', responsable: 'Javeriana Estéreo 91.9 FM', lugar: 'Radio', descripcion: 'Episodio dedicado al museo y a las voces de las madres de falsos positivos.' },
    { id: 6, id_evento: null, nombre: 'Entrevista Encuentro Distrital Red de Escuelas como Territorios de Paz', tipo: 'Entrevista', fecha: '2023-01-01', responsable: 'Secretaría de Educación del Distrito', lugar: 'Bogotá', descripcion: 'Presentación del proyecto en el encuentro distrital (2023).' },
    { id: 7, id_evento: null, nombre: 'Entrevista Programa Arriba Bogotá – Canal City TV', tipo: 'Entrevista', fecha: '2024-03-22', responsable: 'Canal City TV', lugar: 'Televisión', descripcion: 'Entrevista en dos partes sobre el Museo Escolar de la Memoria.' }
  ],

  Exposiciones: [
    { id: 1, titulo: 'Museo Escolar de la Memoria', tipo: 'Itinerante', fecha_inicio: '2021-01-01', fecha_fin: '', lugar: 'Colegio Tom Adams IED y su entorno', curador: 'Estudiantes del proyecto', descripcion: 'Muestra comunitaria que reúne objetos, obras, testimonios y expresiones artísticas sobre la memoria del territorio. Cinco versiones a 2025.' },
    { id: 2, titulo: 'Museo Virtual de la Memoria', tipo: 'Virtual', fecha_inicio: '2025-01-01', fecha_fin: '', lugar: 'Web (A-Frame y CoSpacesEdu)', curador: 'Estudiantes de Programación Web', descripcion: 'Recorrido inmersivo con fotografías, obras y objetos 3D capturados por fotogrametría.' },
    { id: 3, titulo: 'La Escuela: territorio de paz', tipo: 'Temporal', fecha_inicio: '2025-10-22', fecha_fin: '', lugar: 'Centro de Memoria, Paz y Reconciliación', curador: 'Red de colegios como lugares de memoria', descripcion: 'Exposición conjunta de 10 colegios de Bogotá.' },
    { id: 4, titulo: 'Museo Inspirador de la Memoria', tipo: 'Temporal', fecha_inicio: '2024-10-30', fecha_fin: '2024-10-30', lugar: 'Alcaldía Local de Kennedy', curador: 'Colegio Tom Adams IED y Colegio Los Periodistas IED', descripcion: 'Museo vivo en el espacio público con objetos y fotografías de la comunidad.' }
  ],

  Objetos_Museo: [
    { id: 1, id_exposicion: 1, nombre: 'Corazón en la mano', tipo: 'Escultura / Objeto 3D', tecnica: 'Modelado y pintura a mano', autor: 'Estudiantes del proyecto', fecha_creacion: '2025-11-27', imagen_url: 'img/muestra-18.jpg', modelo_3d_url: 'models/objeto-1.glb', creditos: 'Fotografía y captura 3D: equipo de Programación Web', descripcion: 'Una mano sostiene un corazón que guarda en su interior una vida que comienza: la memoria como cuidado de lo que nos hace humanos.' },
    { id: 2, id_exposicion: 2, nombre: 'Máscara de la memoria', tipo: 'Máscara / Objeto 3D', tecnica: 'Máscara intervenida, digitalizada por fotogrametría', autor: 'Estudiantes del proyecto', fecha_creacion: '2025-01-01', imagen_url: 'img/virtual-1.jpg', modelo_3d_url: 'models/objeto-2.glb', creditos: 'Captura 3D: equipo de Programación Web', descripcion: 'Rostro blanco marcado en rojo: las huellas de la violencia sobre los cuerpos y la necesidad de nombrar a las víctimas.' },
    { id: 3, id_exposicion: 3, nombre: 'Tejido colectivo de la memoria', tipo: 'Textil', tecnica: 'Bordado y pintura sobre tela', autor: 'Estudiantes y comunidad', fecha_creacion: '2025-08-30', imagen_url: 'img/tejido-colectivo-2.jpg', modelo_3d_url: '', creditos: 'Taller de co-creación, Centro de Memoria, Paz y Reconciliación', descripcion: 'Camino de tela con raíces, flores y símbolos tejidos entre muchas manos.' },
    { id: 4, id_exposicion: 1, nombre: 'Altar de la memoria', tipo: 'Instalación', tecnica: 'Fotografía, velas, objetos personales', autor: 'Estudiantes del proyecto', fecha_creacion: '2025-11-27', imagen_url: 'img/altar-memoria.jpg', modelo_3d_url: '', creditos: 'Museo Escolar de la Memoria', descripcion: 'Retratos, flores y objetos dispuestos para honrar a quienes ya no están.' },
    { id: 5, id_exposicion: 1, nombre: 'Historieta "¿Basado en una historia real?"', tipo: 'Cómic', tecnica: 'Dibujo a mano y digitalización', autor: 'Estudiantes del proyecto', fecha_creacion: '2025-01-01', imagen_url: 'img/comic-1.jpg', modelo_3d_url: '', creditos: 'Historieta de cómic – dibujo a mano y digitalización', descripcion: 'Un joven descubre que la historia que leía con pereza estaba basada en hechos reales del conflicto.' },
    { id: 6, id_exposicion: 1, nombre: 'Rostro entre rosas', tipo: 'Pintura', tecnica: 'Técnica mixta', autor: 'Estudiantes del proyecto', fecha_creacion: '2025-11-27', imagen_url: 'img/muestra-07.jpg', modelo_3d_url: '', creditos: 'Museo Escolar de la Memoria', descripcion: 'Obra exhibida en la muestra comunitaria del Museo Escolar de la Memoria.' },
    { id: 7, id_exposicion: 1, nombre: 'Mapa "Pasado"', tipo: 'Cartografía', tecnica: 'Cartografía social', autor: 'Estudiantes del proyecto', fecha_creacion: '2025-11-27', imagen_url: 'img/muestra-09.jpg', modelo_3d_url: '', creditos: 'Museo Escolar de la Memoria', descripcion: 'Cartografía del territorio tal como lo recuerdan sus habitantes.' }
  ],

  Evidencias: [
    { id: 1, titulo: 'Reconocimiento Entornos Escolares Inspiradores (Educación Bogotá)', tipo: 'Enlace', fuente: 'X', fecha: '2025-03-18', url: 'https://x.com/Educacionbogota/status/1902046716477477112', id_evento: 3, descripcion: '' },
    { id: 2, titulo: 'Reconocimiento Entornos Escolares Inspiradores (Alcaldía de Bogotá)', tipo: 'Enlace', fuente: 'X', fecha: '2025-02-25', url: 'https://x.com/Bogota/status/1894407697602080927', id_evento: 3, descripcion: '' },
    { id: 3, titulo: 'Salida pedagógica Eje de Memoria y Paz – CNMH', tipo: 'Video', fuente: 'Facebook', fecha: '2025-06-01', url: 'https://web.facebook.com/reel/1748586202702527', id_evento: 5, descripcion: '' },
    { id: 4, titulo: 'El Guateque – Memorias Rurales (programa)', tipo: 'Audio', fuente: 'Javeriana Estéreo', fecha: '2025-01-01', url: 'https://javerianaestereo.com/el-guateque/2025', id_evento: null, descripcion: '' },
    { id: 5, titulo: 'El Guateque – 12 de octubre de 2025, Especial Cátedra de la Paz', tipo: 'Audio', fuente: 'SoundCloud', fecha: '2025-10-12', url: 'https://soundcloud.com/javeriana919fm/el-guateque-12-de-octubre-de-2025-especial-catedra-de-la-paz', id_evento: null, descripcion: '' },
    { id: 6, titulo: 'El Guateque – 23 de noviembre de 2025, Restauradores de la memoria histórica en escuelas', tipo: 'Audio', fuente: 'SoundCloud', fecha: '2025-11-23', url: 'https://soundcloud.com/javeriana919fm/el-guateque-23-de-noviembre-de-2025-proyectos-restauradores-de-la-memoria-historica-en-escuelas', id_evento: null, descripcion: '' },
    { id: 7, titulo: 'El Guateque – 22 de marzo de 2026, Museo', tipo: 'Audio', fuente: 'SoundCloud', fecha: '2026-03-22', url: 'https://soundcloud.com/javeriana919fm/22-de-marzo-de-2026-museo', id_evento: null, descripcion: '' },
    { id: 8, titulo: 'Exposición "La Escuela: territorio de paz" (Instagram)', tipo: 'Enlace', fuente: 'Instagram', fecha: '2025-10-22', url: 'https://www.instagram.com/p/DQMuGmsjtRB/?img_index=8', id_evento: 8, descripcion: '' },
    { id: 9, titulo: 'Así fue la inauguración de "La Escuela: territorio de paz" (CMPR)', tipo: 'Enlace', fuente: 'Facebook', fecha: '2025-10-22', url: 'https://web.facebook.com/CMPReconciliacion/posts/1242731244564095/', id_evento: 8, descripcion: '' },
    { id: 10, titulo: 'Exposición "La Escuela: territorio de paz" (Instagram 2)', tipo: 'Enlace', fuente: 'Instagram', fecha: '2025-10-22', url: 'https://www.instagram.com/p/DQDKQEFjv6b/', id_evento: 8, descripcion: '' },
    { id: 11, titulo: 'INFOMATRIX Colombia', tipo: 'Enlace', fuente: 'INFOMATRIX', fecha: '2025-11-01', url: 'https://infomatrix.lat/colombia/', id_evento: 9, descripcion: '' },
    { id: 12, titulo: 'Proyecto en la plataforma SOLACYT', tipo: 'Enlace', fuente: 'SOLACYT', fecha: '2025-11-01', url: 'https://solacyt.org/plataforma/index.php/administracion/proyecto/35059', id_evento: 9, descripcion: '' },
    { id: 13, titulo: 'Acompañamiento CNMH – quinta versión del Museo Escolar', tipo: 'Enlace', fuente: 'X', fecha: '2025-11-27', url: 'https://x.com/CentroMemoriaH/status/1993854790150050186', id_evento: 10, descripcion: '' },
    { id: 14, titulo: 'Publicaciones en la página web del Colegio Tom Adams IED', tipo: 'Enlace', fuente: 'Colegio Tom Adams IED', fecha: '', url: 'https://colegiotomadams.edu.co/category/opinion/', id_evento: null, descripcion: '' },
    { id: 15, titulo: 'Video resumen Museo Escolar de la Memoria 2021', tipo: 'Video', fuente: 'YouTube', fecha: '2021-01-01', url: 'https://www.youtube.com/watch?v=EvR31L2aH44', id_evento: null, descripcion: '' },
    { id: 16, titulo: 'Video resumen Museo Escolar de la Memoria 2023', tipo: 'Video', fuente: 'YouTube', fecha: '2023-01-01', url: 'https://www.youtube.com/watch?v=7KZMLHnJLM8', id_evento: null, descripcion: '' },
    { id: 17, titulo: 'Video resumen Museo Escolar de la Memoria 2025', tipo: 'Video', fuente: 'YouTube', fecha: '2025-01-01', url: 'https://www.youtube.com/watch?v=-O6inKLKRRI', id_evento: null, descripcion: '' },
    { id: 18, titulo: 'Entrevista Encuentro Distrital Red de Escuelas como Territorios de Paz – SED 2023', tipo: 'Video', fuente: 'YouTube', fecha: '2023-01-01', url: 'https://www.youtube.com/watch?v=Igaz95346rM', id_evento: null, descripcion: '' },
    { id: 19, titulo: 'Arriba Bogotá, City TV 2024 – primera parte', tipo: 'Video', fuente: 'YouTube', fecha: '2024-03-22', url: 'https://www.youtube.com/watch?v=tudL3XZiGPc', id_evento: null, descripcion: '' },
    { id: 20, titulo: 'Arriba Bogotá, City TV 2024 – segunda parte', tipo: 'Video', fuente: 'X', fecha: '2024-03-22', url: 'https://x.com/CityNoticiasTv/status/1771228569949090082', id_evento: null, descripcion: '' },
    { id: 21, titulo: 'Página web anterior del proyecto', tipo: 'Enlace', fuente: 'GitHub Pages', fecha: '', url: 'https://lozanoalcuadrado.github.io/MuseoDeLaMemoria/exhibicion4.html', id_evento: null, descripcion: '' },
    { id: 22, titulo: 'Museo Virtual de la Memoria en CoSpacesEdu', tipo: 'Enlace', fuente: 'CoSpacesEdu', fecha: '', url: 'https://edu.cospaces.io/SRH-SUX', id_evento: null, descripcion: '' },
    { id: 23, titulo: 'Feria del Libro 2018 (Educación Bogotá)', tipo: 'Enlace', fuente: 'X', fecha: '2018-04-24', url: 'https://x.com/Educacionbogota/status/988831073281900544', id_evento: 1, descripcion: '' },
    { id: 24, titulo: 'Feria del Libro 2018 (video)', tipo: 'Video', fuente: 'YouTube', fecha: '2018-04-24', url: 'https://www.youtube.com/watch?v=pdQ-DnRZfyQ', id_evento: 1, descripcion: '' }
  ],

  Aliados: [
    { id: 1, nombre: 'Centro Nacional de Memoria Histórica', tipo: 'Entidad nacional', sitio_web: 'https://centrodememoriahistorica.gov.co', contacto: '', fecha_vinculacion: '2025-06-01', descripcion: 'Acompañamiento pedagógico a la quinta versión del Museo Escolar y salida al Eje de la Memoria y la Paz.' },
    { id: 2, nombre: 'Centro de Memoria, Paz y Reconciliación', tipo: 'Entidad distrital', sitio_web: 'https://centromemoria.gov.co', contacto: '', fecha_vinculacion: '2025-08-30', descripcion: 'Taller de co-creación y exposición "La Escuela: territorio de paz".' },
    { id: 3, nombre: 'Secretaría de Educación del Distrito', tipo: 'Entidad distrital', sitio_web: 'https://www.educacionbogota.edu.co', contacto: '', fecha_vinculacion: '2018-04-24', descripcion: 'Red de Escuelas como Territorios de Paz y Entornos Escolares Inspiradores.' },
    { id: 4, nombre: 'Alcaldía Mayor de Bogotá', tipo: 'Entidad distrital', sitio_web: 'https://bogota.gov.co', contacto: '', fecha_vinculacion: '2025-02-25', descripcion: 'Reconocimiento Entornos Escolares Inspiradores.' },
    { id: 5, nombre: 'Alcaldía Local de Kennedy', tipo: 'Entidad local', sitio_web: 'https://www.kennedy.gov.co', contacto: '', fecha_vinculacion: '2024-10-30', descripcion: 'Espacio público para el Museo Inspirador de la Memoria y la actividad "Cuerpos que recuerdan".' },
    { id: 6, nombre: 'Javeriana Estéreo 91.9 FM – El Guateque', tipo: 'Medio de comunicación', sitio_web: 'https://javerianaestereo.com/el-guateque/2025', contacto: '', fecha_vinculacion: '2025-10-12', descripcion: 'Entrevistas en el programa Memorias Rurales (2025 – 2026), con la Facultad de Educación.' },
    { id: 7, nombre: 'INFOMATRIX Sudamérica – SOLACYT', tipo: 'Concurso científico', sitio_web: 'https://infomatrix.lat/colombia/', contacto: '', fecha_vinculacion: '2025-11-01', descripcion: 'Participación en la categoría Diseño de Software con el Museo Virtual de la Memoria.' },
    { id: 8, nombre: 'Colegio Los Periodistas IED', tipo: 'Institución educativa', sitio_web: '', contacto: '', fecha_vinculacion: '2024-10-30', descripcion: 'Coorganizador del Museo Inspirador de la Memoria en el Entorno Escolar La Amistad.' },
    { id: 9, nombre: 'Red de colegios como lugares de memoria', tipo: 'Red escolar', sitio_web: '', contacto: '', fecha_vinculacion: '2025-10-22', descripcion: '10 colegios de Bogotá que trabajan las memorias vivas.' },
    { id: 10, nombre: 'Metro de Bogotá y Ciudad Limpia', tipo: 'Empresas del entorno', sitio_web: '', contacto: '', fecha_vinculacion: '2024-10-30', descripcion: 'Participantes del Museo Inspirador de la Memoria.' },
    { id: 11, nombre: 'Canal City TV – Arriba Bogotá', tipo: 'Medio de comunicación', sitio_web: '', contacto: '', fecha_vinculacion: '2024-03-22', descripcion: 'Entrevista sobre el Museo Escolar de la Memoria (2024).' }
  ],

  Reconocimientos: [
    { id: 1, nombre: 'Entornos Escolares Inspiradores', entidad: 'Alcaldía Mayor de Bogotá – Secretaría de Educación', id_aliado: 4, fecha: '2025-02-25', categoria: 'Aliados por un entorno inspirador', imagen_url: 'img/entornos-reconocimiento-1.jpg', evidencia_url: 'https://x.com/Bogota/status/1894407697602080927', descripcion: 'Reconoce la sostenibilidad del trabajo articulado entre la institución educativa, líderes, organizaciones y entidades para mejorar el entorno escolar.' },
    { id: 2, nombre: 'INFOMATRIX Sudamérica 2025', entidad: 'SOLACYT', id_aliado: 7, fecha: '2025-11-01', categoria: 'Diseño de Software', imagen_url: 'img/virtual-3.jpg', evidencia_url: 'https://solacyt.org/plataforma/index.php/administracion/proyecto/35059', descripcion: 'Participación en el XX Concurso Iberoamericano de Proyectos de Ciencia y Tecnología con el Museo Virtual de la Memoria.' },
    { id: 3, nombre: 'Acompañamiento pedagógico del CNMH', entidad: 'Centro Nacional de Memoria Histórica', id_aliado: 1, fecha: '2025-11-27', categoria: 'Quinta versión del Museo Escolar', imagen_url: 'img/muestra-16.jpg', evidencia_url: 'https://x.com/CentroMemoriaH/status/1993854790150050186', descripcion: 'El CNMH acompañó la quinta versión del Museo Escolar de la Memoria.' },
    { id: 4, nombre: 'Exposición en el Centro de Memoria, Paz y Reconciliación', entidad: 'Centro de Memoria, Paz y Reconciliación', id_aliado: 2, fecha: '2025-10-22', categoria: 'La Escuela: territorio de paz', imagen_url: 'img/expo-escuela-territorio-paz.jpg', evidencia_url: 'https://www.instagram.com/p/DQMuGmsjtRB/', descripcion: 'El trabajo del proyecto hizo parte de la exposición de la Red de colegios como lugares de memoria.' },
    { id: 5, nombre: 'Voces en la radio: El Guateque', entidad: 'Javeriana Estéreo 91.9 FM', id_aliado: 6, fecha: '2025-10-12', categoria: 'Episodios 115, 121 y 132', imagen_url: 'img/guateque-ep121.jpg', evidencia_url: 'https://javerianaestereo.com/el-guateque/2025', descripcion: 'Tres entrevistas sobre Cátedra de Paz, el proyecto y el museo (2025 – 2026).' },
    { id: 6, nombre: 'Feria Internacional del Libro 2018', entidad: 'Secretaría de Educación del Distrito', id_aliado: 3, fecha: '2018-04-24', categoria: 'Escuelas que recuerdan, narran y resignifican la guerra', imagen_url: 'img/muestra-02.jpg', evidencia_url: 'https://x.com/Educacionbogota/status/988831073281900544', descripcion: 'Primera exposición pública, antecedente del proyecto.' }
  ],

  Visitantes: [
    { id: 1, nombres: 'Visitante', apellidos: 'De ejemplo', documento: '0000000000', correo: 'ejemplo@correo.com', telefono: '3000000000', tipo: 'Estudiante', institucion: 'Colegio Tom Adams IED', id_evento: 10, fecha_visita: '2025-11-27', fecha_registro: '2025-11-20' }
  ]
};

/* Fotografías de la galería (categoría, título y proporción ancho/alto) */
const GALERIA = [
  ...fotos('salida', 1, 10).map((src, i) => ({ src, categoria: 'Salidas pedagógicas', titulo: `Salida pedagógica – lugares de memoria ${i + 1}` })),
  ...fotos('muestra', 1, 20).map((src, i) => ({ src, categoria: 'Muestras comunitarias', titulo: `Museo Escolar de la Memoria – muestra comunitaria ${i + 1}` })),
  { src: 'img/tejido-colectivo-1.jpg', categoria: 'Eventos', titulo: 'Tejido colectivo de la memoria' },
  { src: 'img/tejido-colectivo-2.jpg', categoria: 'Eventos', titulo: 'Tejido colectivo con sus autores' },
  { src: 'img/altar-memoria.jpg', categoria: 'Eventos', titulo: 'Altar de la memoria' },
  { src: 'img/entornos-reconocimiento-1.jpg', categoria: 'Reconocimientos', titulo: 'Entornos Escolares Inspiradores' },
  { src: 'img/entornos-reconocimiento-2.jpg', categoria: 'Reconocimientos', titulo: 'Recorrido por la exposición del entorno escolar' },
  { src: 'img/entornos-aliados.jpg', categoria: 'Reconocimientos', titulo: 'Categoría Aliados por un entorno inspirador' },
  { src: 'img/guateque-ep115.jpg', categoria: 'Medios', titulo: 'El Guateque, episodio 115' },
  { src: 'img/guateque-ep121.jpg', categoria: 'Medios', titulo: 'El Guateque, episodio 121' },
  { src: 'img/guateque-ep132.jpg', categoria: 'Medios', titulo: 'El Guateque, episodio 132' },
  { src: 'img/expo-escuela-territorio-paz.jpg', categoria: 'Eventos', titulo: 'La Escuela: territorio de paz' },
  { src: 'img/taller-cocreacion.jpg', categoria: 'Eventos', titulo: 'Taller de co-creación' },
  { src: 'img/rolotopia-2025.jpg', categoria: 'Eventos', titulo: 'Festival Rolotopía 2025' },
  { src: 'img/cuerpos-que-recuerdan.jpg', categoria: 'Eventos', titulo: 'Cuerpos que recuerdan, arte y memoria' },
  { src: 'img/museo-inspirador-afiche.jpg', categoria: 'Eventos', titulo: 'Museo Inspirador de la Memoria' },
  { src: 'img/comic-1.jpg', categoria: 'Historieta', titulo: 'Historieta – viñeta digital 1' },
  { src: 'img/comic-2.jpg', categoria: 'Historieta', titulo: 'Historieta – boceto a mano' },
  { src: 'img/comic-3.jpg', categoria: 'Historieta', titulo: 'Historieta – viñeta digital 2' },
  ...[1, 2, 3, 4, 5].map(n => ({ src: `img/virtual-${n}.jpg`, categoria: 'Museo virtual', titulo: `Museo Virtual de la Memoria (CoSpaces) ${n}` }))
];

/* Fechas conmemorativas (mes 1-12) */
const FECHAS = [
  { mes: 4, dia: 9, nombre: 'Día Nacional de la Memoria y Solidaridad con las Víctimas', detalle: 'Establecido por la Ley 1448 de 2011.' },
  { mes: 5, dia: 25, nombre: 'Día por la Dignidad de las Mujeres Víctimas de Violencia Sexual', detalle: 'En el marco del conflicto armado colombiano.' },
  { mes: 8, dia: 30, nombre: 'Día Internacional de las Víctimas de Desapariciones Forzadas', detalle: 'Naciones Unidas.' },
  { mes: 9, dia: 9, nombre: 'Día Nacional de los Derechos Humanos', detalle: 'Colombia, en honor a San Pedro Claver.' },
  { mes: 9, dia: 21, nombre: 'Día Internacional de la Paz', detalle: 'Naciones Unidas.' },
  { mes: 10, dia: 12, nombre: 'Día de la Diversidad Étnica y Cultural', detalle: 'Reconocimiento de la nación pluriétnica y multicultural.' },
  { mes: 11, dia: 6, nombre: 'Memoria del Palacio de Justicia', detalle: 'Toma y retoma del Palacio de Justicia, 1985.' },
  { mes: 11, dia: 24, nombre: 'Firma del Acuerdo Final de Paz', detalle: 'Teatro Colón, Bogotá, 2016.' },
  { mes: 12, dia: 10, nombre: 'Día Internacional de los Derechos Humanos', detalle: 'Declaración Universal de 1948.' }
];

/* Línea del tiempo del proyecto */
const LINEA_TIEMPO = [
  { anio: '2018', texto: 'Exposición "Escuelas que recuerdan, narran y resignifican la guerra" en la Feria del Libro: el antecedente.' },
  { anio: '2021', texto: 'Primera versión documentada del Museo Escolar de la Memoria.' },
  { anio: '2023', texto: 'Encuentro Distrital de la Red de Escuelas como Territorios de Paz (SED).' },
  { anio: '2024', texto: 'Entrevista en Arriba Bogotá (City TV) y Museo Inspirador de la Memoria en Kennedy.' },
  { anio: '2025', texto: 'Entornos Escolares Inspiradores, salida con el CNMH, exposición en el CMPR, INFOMATRIX y quinta versión del museo.' },
  { anio: '2026', texto: 'El Guateque dedica un episodio al museo y a las madres de falsos positivos. Nace este portal.' }
];
