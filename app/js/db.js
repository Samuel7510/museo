/* =========================================================
   BASE DE DATOS LOCAL (localStorage)
   Replica en el navegador las tablas de database/restauradores_memoria.sql
   para que el prototipo funcione sin servidor de base de datos.
   ========================================================= */

const ESQUEMA = {
  Visitantes: {
    titulo: 'Visitantes',
    campos: {
      nombres: { etiqueta: 'Nombres', tipo: 'text', requerido: true },
      apellidos: { etiqueta: 'Apellidos', tipo: 'text', requerido: true },
      documento: { etiqueta: 'Documento', tipo: 'text', requerido: true, patron: '^[0-9]{6,12}$' },
      correo: { etiqueta: 'Correo', tipo: 'email', requerido: true },
      telefono: { etiqueta: 'Teléfono', tipo: 'tel', patron: '^[0-9]{7,10}$' },
      tipo: { etiqueta: 'Tipo de visitante', tipo: 'select', opciones: ['Estudiante', 'Docente', 'Familia', 'Comunidad', 'Institución'], requerido: true },
      institucion: { etiqueta: 'Institución', tipo: 'text' },
      id_evento: { etiqueta: 'Evento', tipo: 'ref', tabla: 'Eventos', mostrar: 'nombre' },
      fecha_visita: { etiqueta: 'Fecha de visita', tipo: 'date' },
      fecha_registro: { etiqueta: 'Fecha de registro', tipo: 'date' }
    }
  },
  Eventos: {
    titulo: 'Eventos',
    campos: {
      nombre: { etiqueta: 'Nombre', tipo: 'text', requerido: true },
      tipo: { etiqueta: 'Tipo', tipo: 'select', opciones: ['Exposición', 'Muestra comunitaria', 'Salida pedagógica', 'Taller', 'Festival', 'Concurso', 'Reconocimiento', 'Visita guiada', 'Conmemoración'], requerido: true },
      fecha_inicio: { etiqueta: 'Fecha inicio', tipo: 'date', requerido: true },
      fecha_fin: { etiqueta: 'Fecha fin', tipo: 'date' },
      lugar: { etiqueta: 'Lugar', tipo: 'text' },
      organizador: { etiqueta: 'Organizador', tipo: 'text' },
      estado: { etiqueta: 'Estado', tipo: 'select', opciones: ['Programado', 'Realizado', 'Cancelado'] },
      imagen_url: { etiqueta: 'Imagen (URL)', tipo: 'text' },
      enlace: { etiqueta: 'Enlace', tipo: 'url' },
      descripcion: { etiqueta: 'Descripción', tipo: 'textarea' }
    }
  },
  Actividades: {
    titulo: 'Actividades',
    campos: {
      id_evento: { etiqueta: 'Evento', tipo: 'ref', tabla: 'Eventos', mostrar: 'nombre' },
      nombre: { etiqueta: 'Nombre', tipo: 'text', requerido: true },
      tipo: { etiqueta: 'Tipo', tipo: 'select', opciones: ['Salida pedagógica', 'Taller', 'Entrevista', 'Entrevista radial', 'Conversatorio', 'Presentación artística'] },
      fecha: { etiqueta: 'Fecha', tipo: 'date' },
      responsable: { etiqueta: 'Responsable', tipo: 'text' },
      lugar: { etiqueta: 'Lugar', tipo: 'text' },
      descripcion: { etiqueta: 'Descripción', tipo: 'textarea' }
    }
  },
  Exposiciones: {
    titulo: 'Exposiciones',
    campos: {
      titulo: { etiqueta: 'Título', tipo: 'text', requerido: true },
      tipo: { etiqueta: 'Tipo', tipo: 'select', opciones: ['Permanente', 'Temporal', 'Itinerante', 'Virtual'] },
      fecha_inicio: { etiqueta: 'Fecha inicio', tipo: 'date' },
      fecha_fin: { etiqueta: 'Fecha fin', tipo: 'date' },
      lugar: { etiqueta: 'Lugar', tipo: 'text' },
      curador: { etiqueta: 'Curador(es)', tipo: 'text' },
      descripcion: { etiqueta: 'Descripción', tipo: 'textarea' }
    }
  },
  Objetos_Museo: {
    titulo: 'Objetos del museo',
    campos: {
      id_exposicion: { etiqueta: 'Exposición', tipo: 'ref', tabla: 'Exposiciones', mostrar: 'titulo' },
      nombre: { etiqueta: 'Nombre', tipo: 'text', requerido: true },
      tipo: { etiqueta: 'Tipo', tipo: 'text' },
      tecnica: { etiqueta: 'Técnica', tipo: 'text' },
      autor: { etiqueta: 'Autor(es)', tipo: 'text' },
      fecha_creacion: { etiqueta: 'Fecha de creación', tipo: 'date' },
      imagen_url: { etiqueta: 'Fotografía (URL)', tipo: 'text' },
      modelo_3d_url: { etiqueta: 'Modelo 3D (.glb)', tipo: 'text' },
      creditos: { etiqueta: 'Créditos', tipo: 'text' },
      descripcion: { etiqueta: 'Descripción', tipo: 'textarea' }
    }
  },
  Evidencias: {
    titulo: 'Evidencias',
    campos: {
      titulo: { etiqueta: 'Título', tipo: 'text', requerido: true },
      tipo: { etiqueta: 'Tipo', tipo: 'select', opciones: ['Fotografía', 'Video', 'Audio', 'Enlace', 'Documento'] },
      fuente: { etiqueta: 'Fuente', tipo: 'text' },
      fecha: { etiqueta: 'Fecha', tipo: 'date' },
      url: { etiqueta: 'URL', tipo: 'url', requerido: true },
      id_evento: { etiqueta: 'Evento', tipo: 'ref', tabla: 'Eventos', mostrar: 'nombre' },
      descripcion: { etiqueta: 'Descripción', tipo: 'textarea' }
    }
  },
  Aliados: {
    titulo: 'Aliados',
    campos: {
      nombre: { etiqueta: 'Nombre', tipo: 'text', requerido: true },
      tipo: { etiqueta: 'Tipo', tipo: 'text' },
      sitio_web: { etiqueta: 'Sitio web', tipo: 'url' },
      contacto: { etiqueta: 'Contacto', tipo: 'text' },
      fecha_vinculacion: { etiqueta: 'Fecha de vinculación', tipo: 'date' },
      descripcion: { etiqueta: 'Descripción', tipo: 'textarea' }
    }
  },
  Reconocimientos: {
    titulo: 'Reconocimientos',
    campos: {
      nombre: { etiqueta: 'Nombre', tipo: 'text', requerido: true },
      entidad: { etiqueta: 'Entidad que otorga', tipo: 'text' },
      id_aliado: { etiqueta: 'Aliado', tipo: 'ref', tabla: 'Aliados', mostrar: 'nombre' },
      fecha: { etiqueta: 'Fecha', tipo: 'date' },
      categoria: { etiqueta: 'Categoría', tipo: 'text' },
      imagen_url: { etiqueta: 'Imagen (URL)', tipo: 'text' },
      evidencia_url: { etiqueta: 'Evidencia (URL)', tipo: 'url' },
      descripcion: { etiqueta: 'Descripción', tipo: 'textarea' }
    }
  }
};

const DB = (() => {
  const PREFIJO = 'rdm_';
  const VERSION = '1';

  // Si localStorage no funciona (modo privado, vista previa), se trabaja en memoria.
  const memoria = {};
  let persistente = true;
  try { localStorage.setItem('__rdm', '1'); localStorage.removeItem('__rdm'); } catch { persistente = false; }

  const leer = tabla => {
    if (!persistente) return memoria[tabla] || [];
    try { return JSON.parse(localStorage.getItem(PREFIJO + tabla)) || []; }
    catch { return []; }
  };
  const guardar = (tabla, filas) => {
    memoria[tabla] = filas;
    if (persistente) {
      try { localStorage.setItem(PREFIJO + tabla, JSON.stringify(filas)); } catch { /* cuota llena */ }
    }
  };

  function iniciar(forzar = false) {
    let version = null;
    if (persistente) version = localStorage.getItem(PREFIJO + 'version');
    if (version === VERSION && !forzar) return;
    Object.keys(ESQUEMA).forEach(t => guardar(t, structuredClone(SEED[t] || [])));
    if (persistente) localStorage.setItem(PREFIJO + 'version', VERSION);
  }

  const todos = tabla => leer(tabla);

  const buscar = (tabla, id) => todos(tabla).find(f => f.id === Number(id));

  function insertar(tabla, datos) {
    const filas = todos(tabla);
    const id = filas.reduce((m, f) => Math.max(m, f.id), 0) + 1;
    const fila = { id, ...datos };
    filas.push(fila);
    guardar(tabla, filas);
    return fila;
  }

  function actualizar(tabla, id, datos) {
    const filas = todos(tabla).map(f => (f.id === Number(id) ? { ...f, ...datos, id: f.id } : f));
    guardar(tabla, filas);
  }

  function eliminar(tabla, id) {
    guardar(tabla, todos(tabla).filter(f => f.id !== Number(id)));
  }

  /* Exporta todo como sentencias INSERT compatibles con el script SQL */
  function exportarSQL() {
    const esc = v => (v === null || v === '' || v === undefined ? 'NULL' : typeof v === 'number' ? v : `'${String(v).replace(/'/g, "''")}'`);
    let sql = '-- Exportado desde el portal Restauradores de la Memoria\nUSE restauradores_memoria;\n\n';
    Object.keys(ESQUEMA).forEach(tabla => {
      const filas = todos(tabla);
      if (!filas.length) return;
      const cols = ['id', ...Object.keys(ESQUEMA[tabla].campos)];
      const colsSQL = cols.map(c => (c === 'id' ? idSQL(tabla) : c));
      sql += `INSERT INTO ${tabla} (${colsSQL.join(', ')}) VALUES\n`;
      sql += filas.map(f => `  (${cols.map(c => esc(f[c])).join(', ')})`).join(',\n') + ';\n\n';
    });
    return sql;
  }
  const idSQL = tabla => ({ Visitantes: 'id_visitante', Eventos: 'id_evento', Actividades: 'id_actividad', Exposiciones: 'id_exposicion', Objetos_Museo: 'id_objeto', Evidencias: 'id_evidencia', Aliados: 'id_aliado', Reconocimientos: 'id_reconocimiento' }[tabla]);

  return { iniciar, todos, buscar, insertar, actualizar, eliminar, exportarSQL };
})();

DB.iniciar();
