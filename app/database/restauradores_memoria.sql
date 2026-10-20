-- =========================================================
-- BASE DE DATOS: Portal Web Restauradores de la Memoria
-- Colegio Tom Adams IED – Proyecto integrador Programación Web
-- Motor: MySQL 8 / MariaDB 10 (XAMPP, phpMyAdmin)
-- =========================================================

DROP DATABASE IF EXISTS restauradores_memoria;
CREATE DATABASE restauradores_memoria CHARACTER SET utf8mb4 COLLATE utf8mb4_spanish_ci;
USE restauradores_memoria;

-- ---------------------------------------------------------
-- 1. ALIADOS: entidades e instituciones que apoyan el proyecto
-- ---------------------------------------------------------
CREATE TABLE Aliados (
  id_aliado          INT AUTO_INCREMENT PRIMARY KEY,
  nombre             VARCHAR(150) NOT NULL,
  tipo               VARCHAR(60),
  sitio_web          VARCHAR(255),
  contacto           VARCHAR(150),
  fecha_vinculacion  DATE,
  descripcion        TEXT
);

-- ---------------------------------------------------------
-- 2. EVENTOS: exposiciones, muestras, salidas, festivales...
-- ---------------------------------------------------------
CREATE TABLE Eventos (
  id_evento     INT AUTO_INCREMENT PRIMARY KEY,
  nombre        VARCHAR(200) NOT NULL,
  tipo          ENUM('Exposición','Muestra comunitaria','Salida pedagógica','Taller','Festival',
                     'Concurso','Reconocimiento','Visita guiada','Conmemoración') NOT NULL,
  fecha_inicio  DATE NOT NULL,
  fecha_fin     DATE,
  lugar         VARCHAR(200),
  organizador   VARCHAR(200),
  estado        ENUM('Programado','Realizado','Cancelado') DEFAULT 'Programado',
  imagen_url    VARCHAR(255),
  enlace        VARCHAR(500),
  descripcion   TEXT,
  CHECK (fecha_fin IS NULL OR fecha_fin >= fecha_inicio)
);

-- ---------------------------------------------------------
-- 3. ACTIVIDADES: acciones concretas (pueden pertenecer a un evento)
-- ---------------------------------------------------------
CREATE TABLE Actividades (
  id_actividad  INT AUTO_INCREMENT PRIMARY KEY,
  id_evento     INT NULL,
  nombre        VARCHAR(250) NOT NULL,
  tipo          VARCHAR(60),
  fecha         DATE,
  responsable   VARCHAR(150),
  lugar         VARCHAR(200),
  descripcion   TEXT,
  FOREIGN KEY (id_evento) REFERENCES Eventos(id_evento) ON DELETE SET NULL
);

-- ---------------------------------------------------------
-- 4. EXPOSICIONES: colecciones del museo (física o virtual)
-- ---------------------------------------------------------
CREATE TABLE Exposiciones (
  id_exposicion INT AUTO_INCREMENT PRIMARY KEY,
  titulo        VARCHAR(200) NOT NULL,
  tipo          ENUM('Permanente','Temporal','Itinerante','Virtual') DEFAULT 'Temporal',
  fecha_inicio  DATE,
  fecha_fin     DATE,
  lugar         VARCHAR(200),
  curador       VARCHAR(200),
  descripcion   TEXT
);

-- ---------------------------------------------------------
-- 5. OBJETOS_MUSEO: obras y objetos (incluye modelos 3D de fotogrametría)
-- ---------------------------------------------------------
CREATE TABLE Objetos_Museo (
  id_objeto       INT AUTO_INCREMENT PRIMARY KEY,
  id_exposicion   INT NULL,
  nombre          VARCHAR(200) NOT NULL,
  tipo            VARCHAR(80),
  tecnica         VARCHAR(150),
  autor           VARCHAR(200),
  fecha_creacion  DATE,
  imagen_url      VARCHAR(255),
  modelo_3d_url   VARCHAR(255),          -- archivo .glb exportado de Luma AI / Polycam
  creditos        VARCHAR(255),
  descripcion     TEXT,
  FOREIGN KEY (id_exposicion) REFERENCES Exposiciones(id_exposicion) ON DELETE SET NULL
);

-- ---------------------------------------------------------
-- 6. EVIDENCIAS: fotos, videos, audios y enlaces de soporte
-- ---------------------------------------------------------
CREATE TABLE Evidencias (
  id_evidencia  INT AUTO_INCREMENT PRIMARY KEY,
  titulo        VARCHAR(250) NOT NULL,
  tipo          ENUM('Fotografía','Video','Audio','Enlace','Documento') NOT NULL,
  fuente        VARCHAR(100),
  fecha         DATE,
  url           VARCHAR(500) NOT NULL,
  id_evento     INT NULL,
  descripcion   TEXT,
  FOREIGN KEY (id_evento) REFERENCES Eventos(id_evento) ON DELETE SET NULL
);

-- ---------------------------------------------------------
-- 7. RECONOCIMIENTOS
-- ---------------------------------------------------------
CREATE TABLE Reconocimientos (
  id_reconocimiento INT AUTO_INCREMENT PRIMARY KEY,
  nombre            VARCHAR(200) NOT NULL,
  entidad           VARCHAR(200),
  id_aliado         INT NULL,
  fecha             DATE,
  categoria         VARCHAR(150),
  imagen_url        VARCHAR(255),
  evidencia_url     VARCHAR(500),
  descripcion       TEXT,
  FOREIGN KEY (id_aliado) REFERENCES Aliados(id_aliado) ON DELETE SET NULL
);

-- ---------------------------------------------------------
-- 8. VISITANTES: registro de visitas al museo y a los eventos
-- ---------------------------------------------------------
CREATE TABLE Visitantes (
  id_visitante    INT AUTO_INCREMENT PRIMARY KEY,
  nombres         VARCHAR(100) NOT NULL,
  apellidos       VARCHAR(100) NOT NULL,
  documento       VARCHAR(12)  NOT NULL,
  correo          VARCHAR(150) NOT NULL,
  telefono        VARCHAR(10),
  tipo            ENUM('Estudiante','Docente','Familia','Comunidad','Institución') NOT NULL,
  institucion     VARCHAR(150),
  id_evento       INT NULL,
  fecha_visita    DATE,
  fecha_registro  DATE DEFAULT (CURRENT_DATE),
  FOREIGN KEY (id_evento) REFERENCES Eventos(id_evento) ON DELETE SET NULL
);

-- =========================================================
-- DATOS INICIALES (tomados del documento de evidencias)
-- Nota: cuando la evidencia solo indica mes o año, se usa el día 1.
-- =========================================================

INSERT INTO Aliados (id_aliado, nombre, tipo, sitio_web, fecha_vinculacion, descripcion) VALUES
 (1,'Centro Nacional de Memoria Histórica','Entidad nacional','https://centrodememoriahistorica.gov.co','2025-06-01','Acompañamiento pedagógico a la quinta versión del Museo Escolar y salida al Eje de la Memoria y la Paz.'),
 (2,'Centro de Memoria, Paz y Reconciliación','Entidad distrital','https://centromemoria.gov.co','2025-08-30','Taller de co-creación y exposición "La Escuela: territorio de paz".'),
 (3,'Secretaría de Educación del Distrito','Entidad distrital','https://www.educacionbogota.edu.co','2018-04-24','Red de Escuelas como Territorios de Paz y Entornos Escolares Inspiradores.'),
 (4,'Alcaldía Mayor de Bogotá','Entidad distrital','https://bogota.gov.co','2025-02-25','Reconocimiento Entornos Escolares Inspiradores.'),
 (5,'Alcaldía Local de Kennedy','Entidad local','https://www.kennedy.gov.co','2024-10-30','Espacio público para el Museo Inspirador de la Memoria.'),
 (6,'Javeriana Estéreo 91.9 FM – El Guateque','Medio de comunicación','https://javerianaestereo.com/el-guateque/2025','2025-10-12','Entrevistas en el programa Memorias Rurales (2025 – 2026).'),
 (7,'INFOMATRIX Sudamérica – SOLACYT','Concurso científico','https://infomatrix.lat/colombia/','2025-11-01','Categoría Diseño de Software: Museo Virtual de la Memoria.'),
 (8,'Colegio Los Periodistas IED','Institución educativa',NULL,'2024-10-30','Coorganizador del Museo Inspirador de la Memoria.'),
 (9,'Red de colegios como lugares de memoria','Red escolar',NULL,'2025-10-22','10 colegios de Bogotá que trabajan las memorias vivas.'),
 (10,'Metro de Bogotá y Ciudad Limpia','Empresas del entorno',NULL,'2024-10-30','Participantes del Museo Inspirador de la Memoria.'),
 (11,'Canal City TV – Arriba Bogotá','Medio de comunicación',NULL,'2024-03-22','Entrevista sobre el Museo Escolar de la Memoria.');

INSERT INTO Eventos (id_evento, nombre, tipo, fecha_inicio, fecha_fin, lugar, organizador, estado, imagen_url, enlace, descripcion) VALUES
 (1,'Exposición "Escuelas que recuerdan, narran y resignifican la guerra"','Exposición','2018-04-24','2018-05-07','Feria Internacional del Libro de Bogotá','Secretaría de Educación del Distrito','Realizado','img/muestra-01.jpg','https://www.youtube.com/watch?v=pdQ-DnRZfyQ','Antecedente del Proyecto Restauradores de la Memoria.'),
 (2,'Museo Inspirador de la Memoria','Muestra comunitaria','2024-10-30','2024-10-30','Bahía frente a la Alcaldía Local de Kennedy','Colegio Tom Adams IED y Colegio Los Periodistas IED','Realizado','img/museo-inspirador-afiche.jpg',NULL,'Comparsa, museo vivo, memorial y presentaciones artísticas.'),
 (3,'Reconocimiento Entornos Escolares Inspiradores','Reconocimiento','2025-02-25','2025-02-25','Bogotá','Alcaldía Mayor de Bogotá – SED','Realizado','img/entornos-reconocimiento-1.jpg','https://x.com/Bogota/status/1894407697602080927','Reconocimiento al trabajo articulado del entorno escolar.'),
 (4,'Actividad hito "Cuerpos que recuerdan, arte y memoria"','Muestra comunitaria','2025-06-05','2025-06-05','Bahía frente a la Alcaldía Local de Kennedy','Entorno Escolar Inspirador La Amistad','Realizado','img/cuerpos-que-recuerdan.jpg',NULL,'Reconstruir la memoria colectiva desde el arte y la cultura.'),
 (5,'Salida pedagógica Eje de la Memoria y la Paz','Salida pedagógica','2025-06-01','2025-06-30','Centro Nacional de Memoria Histórica, Bogotá','Colegio Tom Adams IED – CNMH','Realizado','img/salida-02.jpg','https://web.facebook.com/reel/1748586202702527','Recorrido por lugares de memoria de la ciudad.'),
 (6,'Taller de co-creación: Exposición Permanente','Taller','2025-08-30','2025-08-30','Centro de Memoria, Paz y Reconciliación','CMPR','Realizado','img/taller-cocreacion.jpg',NULL,'Exposición polifónica sobre resistencia y memoria.'),
 (7,'Festival Rolotopía 2025','Festival','2025-09-19','2025-09-28','Localidad de Kennedy, Bogotá','Festival Rolotopía','Realizado','img/rolotopia-2025.jpg',NULL,'Desfile de comparsas, foro y evento central.'),
 (8,'Inauguración de la exposición "La Escuela: territorio de paz"','Exposición','2025-10-22','2025-10-22','Centro de Memoria, Paz y Reconciliación','Red de colegios como lugares de memoria','Realizado','img/expo-escuela-territorio-paz.jpg','https://www.instagram.com/p/DQMuGmsjtRB/','Memorias vivas de 10 colegios de Bogotá.'),
 (9,'INFOMATRIX Sudamérica 2025','Concurso','2025-11-01','2025-11-30','Colombia','INFOMATRIX – SOLACYT','Realizado','img/virtual-3.jpg','https://infomatrix.lat/colombia/','Categoría Diseño de Software: Museo Virtual de la Memoria.'),
 (10,'Quinta versión del Museo Escolar de la Memoria','Muestra comunitaria','2025-11-27','2025-11-27','Colegio Tom Adams IED, Kennedy','Colegio Tom Adams IED con acompañamiento del CNMH','Realizado','img/muestra-03.jpg','https://x.com/CentroMemoriaH/status/1993854790150050186','Objetos, obras, danza, música, teatro y realidad virtual.');

INSERT INTO Actividades (id_actividad, id_evento, nombre, tipo, fecha, responsable, lugar, descripcion) VALUES
 (1,5,'Recorrido Eje de la Memoria y la Paz','Salida pedagógica','2025-06-01','Docentes del proyecto','Bogotá','Visita guiada con el CNMH.'),
 (2,6,'Co-creación de exposición polifónica','Taller','2025-08-30','Estudiantes y docentes','CMPR','Elaboración del tejido de la memoria.'),
 (3,NULL,'El Guateque Ep. 115 – Especial Cátedra de Paz','Entrevista radial','2025-10-12','Javeriana Estéreo 91.9 FM','Radio','Apuntes para construir paz desde el aula, parte III.'),
 (4,NULL,'El Guateque Ep. 121 – Proyecto Restauradores de Memoria','Entrevista radial','2025-11-23','Javeriana Estéreo 91.9 FM','Radio','Restauradores de la memoria histórica en escuelas.'),
 (5,NULL,'El Guateque Ep. 132 – Las madres de falsos positivos','Entrevista radial','2026-03-22','Javeriana Estéreo 91.9 FM','Radio','Episodio dedicado al museo.'),
 (6,NULL,'Entrevista Encuentro Distrital Red de Escuelas como Territorios de Paz','Entrevista','2023-01-01','SED','Bogotá','Presentación del proyecto.'),
 (7,NULL,'Entrevista Arriba Bogotá – City TV','Entrevista','2024-03-22','Canal City TV','Televisión','Entrevista en dos partes.');

INSERT INTO Exposiciones (id_exposicion, titulo, tipo, fecha_inicio, fecha_fin, lugar, curador, descripcion) VALUES
 (1,'Museo Escolar de la Memoria','Itinerante','2021-01-01',NULL,'Colegio Tom Adams IED y su entorno','Estudiantes del proyecto','Muestra comunitaria con objetos, obras y testimonios.'),
 (2,'Museo Virtual de la Memoria','Virtual','2025-01-01',NULL,'Web (A-Frame y CoSpacesEdu)','Estudiantes de Programación Web','Recorrido inmersivo con objetos 3D de fotogrametría.'),
 (3,'La Escuela: territorio de paz','Temporal','2025-10-22',NULL,'Centro de Memoria, Paz y Reconciliación','Red de colegios como lugares de memoria','Exposición conjunta de 10 colegios.'),
 (4,'Museo Inspirador de la Memoria','Temporal','2024-10-30','2024-10-30','Alcaldía Local de Kennedy','Colegio Tom Adams IED y Colegio Los Periodistas IED','Museo vivo en el espacio público.');

INSERT INTO Objetos_Museo (id_objeto, id_exposicion, nombre, tipo, tecnica, autor, fecha_creacion, imagen_url, modelo_3d_url, creditos, descripcion) VALUES
 (1,1,'Corazón en la mano','Escultura / Objeto 3D','Modelado y pintura a mano','Estudiantes del proyecto','2025-11-27','img/muestra-18.jpg','models/objeto-1.glb','Captura 3D: equipo de Programación Web','La memoria como cuidado de la vida.'),
 (2,2,'Máscara de la memoria','Máscara / Objeto 3D','Fotogrametría','Estudiantes del proyecto','2025-01-01','img/virtual-1.jpg','models/objeto-2.glb','Captura 3D: equipo de Programación Web','Huellas de la violencia sobre los cuerpos.'),
 (3,3,'Tejido colectivo de la memoria','Textil','Bordado y pintura sobre tela','Estudiantes y comunidad','2025-08-30','img/tejido-colectivo-2.jpg',NULL,'Taller de co-creación, CMPR','Camino de tela con raíces y flores.'),
 (4,1,'Altar de la memoria','Instalación','Fotografía, velas y objetos','Estudiantes del proyecto','2025-11-27','img/altar-memoria.jpg',NULL,'Museo Escolar de la Memoria','Homenaje a quienes ya no están.'),
 (5,1,'Historieta "¿Basado en una historia real?"','Cómic','Dibujo a mano y digitalización','Estudiantes del proyecto','2025-01-01','img/comic-1.jpg',NULL,'Historieta de cómic','Un joven descubre la historia real detrás del libro.'),
 (6,1,'Rostro entre rosas','Pintura','Técnica mixta','Estudiantes del proyecto','2025-11-27','img/muestra-07.jpg',NULL,'Museo Escolar de la Memoria','Obra de la muestra comunitaria.'),
 (7,1,'Mapa "Pasado"','Cartografía','Cartografía social','Estudiantes del proyecto','2025-11-27','img/muestra-09.jpg',NULL,'Museo Escolar de la Memoria','El territorio tal como se recuerda.');

INSERT INTO Evidencias (titulo, tipo, fuente, fecha, url, id_evento) VALUES
 ('Reconocimiento Entornos Escolares Inspiradores (Educación Bogotá)','Enlace','X','2025-03-18','https://x.com/Educacionbogota/status/1902046716477477112',3),
 ('Reconocimiento Entornos Escolares Inspiradores (Alcaldía de Bogotá)','Enlace','X','2025-02-25','https://x.com/Bogota/status/1894407697602080927',3),
 ('Salida pedagógica Eje de Memoria y Paz – CNMH','Video','Facebook','2025-06-01','https://web.facebook.com/reel/1748586202702527',5),
 ('El Guateque – 12 de octubre de 2025','Audio','SoundCloud','2025-10-12','https://soundcloud.com/javeriana919fm/el-guateque-12-de-octubre-de-2025-especial-catedra-de-la-paz',NULL),
 ('El Guateque – 23 de noviembre de 2025','Audio','SoundCloud','2025-11-23','https://soundcloud.com/javeriana919fm/el-guateque-23-de-noviembre-de-2025-proyectos-restauradores-de-la-memoria-historica-en-escuelas',NULL),
 ('El Guateque – 22 de marzo de 2026','Audio','SoundCloud','2026-03-22','https://soundcloud.com/javeriana919fm/22-de-marzo-de-2026-museo',NULL),
 ('Exposición La Escuela: territorio de paz','Enlace','Instagram','2025-10-22','https://www.instagram.com/p/DQMuGmsjtRB/',8),
 ('INFOMATRIX – proyecto en SOLACYT','Enlace','SOLACYT','2025-11-01','https://solacyt.org/plataforma/index.php/administracion/proyecto/35059',9),
 ('Acompañamiento CNMH – quinta versión','Enlace','X','2025-11-27','https://x.com/CentroMemoriaH/status/1993854790150050186',10),
 ('Video resumen Museo Escolar 2021','Video','YouTube','2021-01-01','https://www.youtube.com/watch?v=EvR31L2aH44',NULL),
 ('Video resumen Museo Escolar 2023','Video','YouTube','2023-01-01','https://www.youtube.com/watch?v=7KZMLHnJLM8',NULL),
 ('Video resumen Museo Escolar 2025','Video','YouTube','2025-01-01','https://www.youtube.com/watch?v=-O6inKLKRRI',NULL),
 ('Encuentro Distrital Red de Escuelas como Territorios de Paz 2023','Video','YouTube','2023-01-01','https://www.youtube.com/watch?v=Igaz95346rM',NULL),
 ('Arriba Bogotá City TV – primera parte','Video','YouTube','2024-03-22','https://www.youtube.com/watch?v=tudL3XZiGPc',NULL),
 ('Museo Virtual en CoSpacesEdu','Enlace','CoSpacesEdu',NULL,'https://edu.cospaces.io/SRH-SUX',NULL),
 ('Feria del Libro 2018','Video','YouTube','2018-04-24','https://www.youtube.com/watch?v=pdQ-DnRZfyQ',1);

INSERT INTO Reconocimientos (id_reconocimiento, nombre, entidad, id_aliado, fecha, categoria, imagen_url, evidencia_url, descripcion) VALUES
 (1,'Entornos Escolares Inspiradores','Alcaldía Mayor de Bogotá – SED',4,'2025-02-25','Aliados por un entorno inspirador','img/entornos-reconocimiento-1.jpg','https://x.com/Bogota/status/1894407697602080927','Trabajo articulado con la comunidad del entorno escolar.'),
 (2,'INFOMATRIX Sudamérica 2025','SOLACYT',7,'2025-11-01','Diseño de Software','img/virtual-3.jpg','https://solacyt.org/plataforma/index.php/administracion/proyecto/35059','Museo Virtual de la Memoria.'),
 (3,'Acompañamiento pedagógico del CNMH','Centro Nacional de Memoria Histórica',1,'2025-11-27','Quinta versión del Museo Escolar','img/muestra-16.jpg','https://x.com/CentroMemoriaH/status/1993854790150050186','El CNMH acompañó la quinta versión.'),
 (4,'Exposición en el CMPR','Centro de Memoria, Paz y Reconciliación',2,'2025-10-22','La Escuela: territorio de paz','img/expo-escuela-territorio-paz.jpg','https://www.instagram.com/p/DQMuGmsjtRB/','Parte de la Red de colegios como lugares de memoria.'),
 (5,'Voces en la radio: El Guateque','Javeriana Estéreo 91.9 FM',6,'2025-10-12','Episodios 115, 121 y 132','img/guateque-ep121.jpg','https://javerianaestereo.com/el-guateque/2025','Tres entrevistas (2025 – 2026).'),
 (6,'Feria Internacional del Libro 2018','Secretaría de Educación del Distrito',3,'2018-04-24','Escuelas que recuerdan, narran y resignifican la guerra','img/muestra-02.jpg','https://x.com/Educacionbogota/status/988831073281900544','Primera exposición pública.');

-- =========================================================
-- CONSULTAS DE EJEMPLO
-- =========================================================
-- Visitantes por evento
-- SELECT e.nombre, COUNT(v.id_visitante) AS visitantes
--   FROM Eventos e LEFT JOIN Visitantes v ON v.id_evento = e.id_evento
--  GROUP BY e.id_evento ORDER BY visitantes DESC;

-- Objetos con modelo 3D por exposición
-- SELECT x.titulo, o.nombre, o.modelo_3d_url
--   FROM Objetos_Museo o JOIN Exposiciones x ON x.id_exposicion = o.id_exposicion
--  WHERE o.modelo_3d_url IS NOT NULL;

-- Reconocimientos con su aliado
-- SELECT r.nombre, r.fecha, a.nombre AS aliado
--   FROM Reconocimientos r LEFT JOIN Aliados a ON a.id_aliado = r.id_aliado
--  ORDER BY r.fecha DESC;
