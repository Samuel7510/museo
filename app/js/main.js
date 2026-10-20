/* =========================================================
   PORTAL – Interacciones, contenidos dinámicos y formularios
   ========================================================= */

const $ = (sel, raiz = document) => raiz.querySelector(sel);
const $$ = (sel, raiz = document) => [...raiz.querySelectorAll(sel)];
const MESES = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
const MESES_LARGO = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];

/* Escapa texto antes de insertarlo como HTML (los datos pueden venir del panel) */
const esc = t => String(t ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const urlSegura = u => (/^(https?:\/\/|img\/|models\/)/.test(u || '') ? u : '');
const fechaLocal = iso => { const [a, m, d] = iso.split('-').map(Number); return new Date(a, m - 1, d); };
const fechaTexto = iso => {
  if (!iso) return '';
  const f = fechaLocal(iso);
  return `${f.getDate()} de ${MESES_LARGO[f.getMonth()]} de ${f.getFullYear()}`;
};
const hoy = () => { const h = new Date(); h.setHours(0, 0, 0, 0); return h; };

/* ---------------- Menú responsive ---------------- */
function iniciarMenu() {
  const btn = $('#menuBtn');
  const menu = $('#menu');
  const cerrar = () => { menu.classList.remove('abierto'); btn.setAttribute('aria-expanded', 'false'); };
  btn.addEventListener('click', () => {
    const abierto = menu.classList.toggle('abierto');
    btn.setAttribute('aria-expanded', String(abierto));
  });
  $$('a', menu).forEach(a => a.addEventListener('click', cerrar));
  document.addEventListener('keydown', e => e.key === 'Escape' && cerrar());

  // Resalta la sección visible en el menú
  const enlaces = $$('a[href^="#"]', menu);
  const observador = new IntersectionObserver(entradas => {
    entradas.forEach(en => {
      if (!en.isIntersecting) return;
      enlaces.forEach(a => a.classList.toggle('activo', a.getAttribute('href') === '#' + en.target.id));
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  $$('main section[id]').forEach(s => observador.observe(s));
}

/* ---------------- Contadores animados ---------------- */
function iniciarCifras() {
  $$('[data-contar-tabla]').forEach(el => { el.dataset.contar = DB.todos(el.dataset.contarTabla).length; });
  const animar = el => {
    const fin = Number(el.dataset.contar);
    const inicio = fin > 1000 ? fin - 40 : 0;
    const t0 = performance.now();
    const paso = t => {
      const p = Math.min(1, (t - t0) / 1200);
      el.textContent = Math.round(inicio + (fin - inicio) * (1 - Math.pow(1 - p, 3)));
      if (p < 1) requestAnimationFrame(paso);
    };
    requestAnimationFrame(paso);
  };
  const obs = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { animar(e.target); obs.unobserve(e.target); } }));
  $$('[data-contar]').forEach(el => obs.observe(el));
}

/* ---------------- Línea del tiempo ---------------- */
function pintarLinea() {
  $('#lineaTiempo').innerHTML = LINEA_TIEMPO.map(h => `<li class="aparecer"><strong>${h.anio}</strong><p>${esc(h.texto)}</p></li>`).join('');
}

/* ---------------- Objetos del museo ---------------- */
function pintarObjetos() {
  const objetos = DB.todos('Objetos_Museo');
  $('#listaObjetos').innerHTML = objetos.map(o => `
    <article class="objeto aparecer">
      <img src="${esc(urlSegura(o.imagen_url))}" alt="${esc(o.nombre)}" loading="lazy" data-visor data-titulo="${esc(o.nombre)}">
      <div class="objeto__cuerpo">
        <span class="etiqueta">${esc(o.tipo)}</span>${o.modelo_3d_url ? '<span class="etiqueta">Objeto 3D</span>' : ''}
        <h3>${esc(o.nombre)}</h3>
        <p>${esc(o.descripcion)}</p>
        <p class="creditos">${esc(o.tecnica)} · ${esc(o.creditos)}</p>
      </div>
    </article>`).join('');
}

/* ---------------- Videos (carga bajo demanda) ---------------- */
function iniciarVideos() {
  const marco = $('#videoMarco');
  const tabs = $$('.videos__tabs button');
  let actual = tabs[0].dataset.video;
  const cargar = () => {
    marco.innerHTML = `<iframe src="https://www.youtube-nocookie.com/embed/${actual}?autoplay=1" title="Video resumen Museo Escolar de la Memoria" allow="autoplay; encrypted-media; picture-in-picture" allowfullscreen></iframe>`;
  };
  $('#videoPortada').addEventListener('click', cargar);
  tabs.forEach(tab => tab.addEventListener('click', () => {
    tabs.forEach(t => t.setAttribute('aria-selected', String(t === tab)));
    actual = tab.dataset.video;
    marco.innerHTML = `<button class="videos__portada" style="background-image:url(img/muestra-13.jpg)"><span class="play" aria-hidden="true">▶</span><span>Ver video resumen ${tab.textContent}</span></button>`;
    $('.videos__portada', marco).addEventListener('click', cargar);
  }));
}

/* ---------------- Salidas pedagógicas ---------------- */
function pintarSalidas() {
  const salidas = DB.todos('Actividades').filter(a => a.tipo === 'Salida pedagógica' || a.tipo === 'Taller');
  $('#listaSalidas').innerHTML = salidas.map(s => `
    <article class="tarjeta aparecer">
      <p class="tarjeta__fecha">${fechaTexto(s.fecha)}</p>
      <span class="etiqueta">${esc(s.tipo)}</span>
      <h3>${esc(s.nombre)}</h3>
      <p>${esc(s.descripcion)}</p>
      <p class="nota">${esc(s.lugar)} · ${esc(s.responsable)}</p>
    </article>`).join('');
  $('#tiraSalidas').innerHTML = GALERIA.filter(g => g.categoria === 'Salidas pedagógicas')
    .map(g => `<img src="${g.src}" alt="${esc(g.titulo)}" loading="lazy" data-visor data-titulo="${esc(g.titulo)}">`).join('');
}

/* ---------------- Fechas conmemorativas ---------------- */
function pintarFechas() {
  const h = hoy();
  const conProxima = FECHAS.map(f => {
    let fecha = new Date(h.getFullYear(), f.mes - 1, f.dia);
    if (fecha < h) fecha = new Date(h.getFullYear() + 1, f.mes - 1, f.dia);
    return { ...f, proxima: fecha, dias: Math.round((fecha - h) / 86400000) };
  });
  const siguiente = [...conProxima].sort((a, b) => a.dias - b.dias)[0];
  $('#proximaFecha').innerHTML = `
    <div>
      <p>Próxima fecha · ${siguiente.dia} de ${MESES_LARGO[siguiente.mes - 1]}</p>
      <h3>${esc(siguiente.nombre)}</h3>
      <p>${esc(siguiente.detalle)}</p>
    </div>
    <div class="proxima__dias">${siguiente.dias === 0 ? 'Hoy' : siguiente.dias}<small>${siguiente.dias === 0 ? 'conmemoramos' : siguiente.dias === 1 ? 'día' : 'días'}</small></div>`;
  const yaPaso = f => new Date(h.getFullYear(), f.mes - 1, f.dia) < h;
  $('#listaFechas').innerHTML = FECHAS.map(f => `
    <li class="${yaPaso(f) ? 'pasada' : ''}">
      <div class="fecha__dia">${f.dia}<small>${MESES[f.mes - 1]}</small></div>
      <div><h3>${esc(f.nombre)}</h3><p>${esc(f.detalle)}</p></div>
    </li>`).join('');
}

/* ---------------- Eventos con filtros ---------------- */
function pintarEventos(filtro = 'Todos') {
  const eventos = DB.todos('Eventos').sort((a, b) => b.fecha_inicio.localeCompare(a.fecha_inicio));
  const tipos = ['Todos', 'Próximos', ...new Set(eventos.map(e => e.tipo))];
  $('#filtrosEventos').innerHTML = tipos.map(t => `<button aria-pressed="${t === filtro}" data-filtro="${esc(t)}">${esc(t)}</button>`).join('');
  $$('#filtrosEventos button').forEach(b => b.addEventListener('click', () => pintarEventos(b.dataset.filtro)));

  const lista = eventos.filter(e => filtro === 'Todos' || (filtro === 'Próximos' ? fechaLocal(e.fecha_fin || e.fecha_inicio) >= hoy() : e.tipo === filtro));
  $('#listaEventos').innerHTML = lista.length ? lista.map(e => {
    const f = fechaLocal(e.fecha_inicio);
    const img = urlSegura(e.imagen_url);
    const enlace = urlSegura(e.enlace);
    return `
    <article class="evento">
      <div class="evento__fecha"><strong>${f.getDate()}</strong><span>${MESES[f.getMonth()]} ${f.getFullYear()}</span></div>
      ${img ? `<img src="${esc(img)}" alt="" loading="lazy" data-visor data-titulo="${esc(e.nombre)}">` : '<div></div>'}
      <div>
        <span class="etiqueta">${esc(e.tipo)}</span><span class="etiqueta">${esc(e.estado)}</span>
        <h3>${esc(e.nombre)}</h3>
        <p>${esc(e.descripcion)}</p>
        <p><strong>${esc(e.lugar)}</strong> · ${esc(e.organizador)}${enlace ? ` · <a href="${esc(enlace)}" target="_blank" rel="noopener">Ver evidencia</a>` : ''}</p>
      </div>
    </article>`;
  }).join('') : `<p class="vacio">${filtro === 'Próximos' ? 'No hay eventos programados por ahora. Agenda una visita guiada con el formulario.' : 'No hay eventos de este tipo.'}</p>`;

  // Opciones del formulario de visita
  const select = $('#v-evento');
  const proximos = eventos.filter(e => fechaLocal(e.fecha_fin || e.fecha_inicio) >= hoy());
  select.innerHTML = '<option value="">Visita guiada al museo</option>' + proximos.map(e => `<option value="${e.id}">${esc(e.nombre)}</option>`).join('');
}

/* ---------------- Reconocimientos y aliados ---------------- */
function pintarReconocimientos() {
  const recos = DB.todos('Reconocimientos').sort((a, b) => (b.fecha || '').localeCompare(a.fecha || ''));
  $('#listaReconocimientos').innerHTML = recos.map(r => `
    <article class="reco aparecer">
      <img src="${esc(urlSegura(r.imagen_url))}" alt="" loading="lazy" data-visor data-titulo="${esc(r.nombre)}">
      <div>
        <span class="etiqueta">${r.fecha ? r.fecha.slice(0, 4) : ''}</span>
        <h3>${esc(r.nombre)}</h3>
        <p><strong>${esc(r.entidad)}</strong> · ${esc(r.categoria)}</p>
        <p>${esc(r.descripcion)}</p>
        ${urlSegura(r.evidencia_url) ? `<a href="${esc(r.evidencia_url)}" target="_blank" rel="noopener">Ver evidencia →</a>` : ''}
      </div>
    </article>`).join('');
}

function pintarAliados() {
  const iniciales = n => n.replace(/[–-].*$/, '').split(/\s+/).filter(p => p.length > 2 && p[0] === p[0].toUpperCase()).slice(0, 3).map(p => p[0]).join('');
  $('#listaAliados').innerHTML = DB.todos('Aliados').map(a => `
    <li class="aliado aparecer">
      <span class="aliado__ini" aria-hidden="true">${esc(iniciales(a.nombre))}</span>
      <span class="etiqueta">${esc(a.tipo)}</span>
      <h3>${urlSegura(a.sitio_web) ? `<a href="${esc(a.sitio_web)}" target="_blank" rel="noopener">${esc(a.nombre)}</a>` : esc(a.nombre)}</h3>
      <p>${esc(a.descripcion)}</p>
    </li>`).join('');
}

/* ---------------- Galería con filtros y "ver más" ---------------- */
let galeriaFiltro = 'Todas';
let galeriaLimite = 16;
function pintarGaleria() {
  const categorias = ['Todas', ...new Set(GALERIA.map(g => g.categoria))];
  $('#filtrosGaleria').innerHTML = categorias.map(c => `<button aria-pressed="${c === galeriaFiltro}" data-cat="${esc(c)}">${esc(c)}</button>`).join('');
  $$('#filtrosGaleria button').forEach(b => b.addEventListener('click', () => { galeriaFiltro = b.dataset.cat; galeriaLimite = 16; pintarGaleria(); }));
  const lista = GALERIA.filter(g => galeriaFiltro === 'Todas' || g.categoria === galeriaFiltro);
  $('#gridGaleria').innerHTML = lista.slice(0, galeriaLimite).map(g => `
    <figure>
      <button data-visor data-src="${g.src}" data-titulo="${esc(g.titulo)}" aria-label="Ampliar: ${esc(g.titulo)}">
        <img src="${g.src}" alt="${esc(g.titulo)}" loading="lazy">
      </button>
      <figcaption>${esc(g.titulo)}</figcaption>
    </figure>`).join('');
  $('#verMas').hidden = lista.length <= galeriaLimite;
}

function pintarMultimedia() {
  const portadas = { '2025-10-12': 'img/guateque-ep115.jpg', '2025-11-23': 'img/guateque-ep121.jpg', '2026-03-22': 'img/guateque-ep132.jpg' };
  const evid = DB.todos('Evidencias');
  $('#listaAudios').innerHTML = evid.filter(e => e.fuente === 'SoundCloud').map(a => `
    <article class="audio">
      <img src="${portadas[a.fecha] || 'img/guateque-ep121.jpg'}" alt="" loading="lazy">
      <div>
        <h4>${esc(a.titulo)}</h4>
        <p>Javeriana Estéreo 91.9 FM · El Guateque, Memorias Rurales</p>
        <a class="btn btn--oscuro" href="${esc(urlSegura(a.url))}" target="_blank" rel="noopener">▶ Escuchar</a>
      </div>
    </article>`).join('');
  $('#listaEnlaces').innerHTML = evid.filter(e => e.fuente !== 'SoundCloud' && urlSegura(e.url)).map(e => `
    <li><a href="${esc(e.url)}" target="_blank" rel="noopener"><span class="fuente">${esc(e.fuente)}</span><span>${esc(e.titulo)}</span></a></li>`).join('');
}

/* ---------------- Visor de imágenes ---------------- */
function iniciarVisor() {
  const visor = $('#visor');
  let lista = [];
  let i = 0;
  const mostrar = () => {
    $('#visorImg').src = lista[i].src;
    $('#visorImg').alt = lista[i].titulo;
    $('#visorTxt').textContent = `${lista[i].titulo} (${i + 1}/${lista.length})`;
  };
  document.addEventListener('click', e => {
    const el = e.target.closest('[data-visor]');
    if (!el) return;
    const grupo = el.closest('section') || document;
    lista = $$('[data-visor]', grupo).map(x => ({ src: x.dataset.src || x.getAttribute('src'), titulo: x.dataset.titulo || x.alt || '' }));
    i = $$('[data-visor]', grupo).indexOf(el);
    mostrar();
    visor.showModal();
  });
  const mover = d => { i = (i + d + lista.length) % lista.length; mostrar(); };
  $('#visorAnt').addEventListener('click', () => mover(-1));
  $('#visorSig').addEventListener('click', () => mover(1));
  $('#visorCerrar').addEventListener('click', () => visor.close());
  visor.addEventListener('click', e => { if (e.target === visor) visor.close(); });
  visor.addEventListener('keydown', e => { if (e.key === 'ArrowLeft') mover(-1); if (e.key === 'ArrowRight') mover(1); });
}

/* ---------------- Validación de formularios ---------------- */
const MENSAJES = {
  valueMissing: 'Este campo es obligatorio.',
  typeMismatch: 'Revisa el formato (ej. nombre@correo.com).',
  patternMismatch: 'Usa solo números con la longitud indicada.',
  tooShort: 'Escribe un poco más.'
};
function validarCampo(input) {
  const campo = input.closest('.campo');
  if (!campo) return true;
  let msg = '';
  if (!input.validity.valid) {
    msg = Object.keys(MENSAJES).find(k => input.validity[k]);
    msg = MENSAJES[msg] || input.validationMessage;
    if (input.name === 'documento' && input.validity.patternMismatch) msg = 'El documento debe tener entre 6 y 12 dígitos.';
    if (input.name === 'telefono' && input.validity.patternMismatch) msg = 'El teléfono debe tener entre 7 y 10 dígitos.';
  }
  if (!msg && input.name === 'fecha_visita' && input.value && fechaLocal(input.value) < hoy()) msg = 'Elige una fecha a partir de hoy.';
  campo.classList.toggle('invalido', Boolean(msg));
  const error = $('.error', campo);
  if (error) error.textContent = msg;
  return !msg;
}
function prepararFormulario(form, alEnviar) {
  const campos = $$('input, select, textarea', form);
  campos.forEach(c => {
    c.addEventListener('blur', () => validarCampo(c));
    c.addEventListener('input', () => c.closest('.campo')?.classList.contains('invalido') && validarCampo(c));
  });
  form.addEventListener('submit', e => {
    e.preventDefault();
    const validos = campos.map(validarCampo).every(Boolean);
    if (!validos) { campos.find(c => c.closest('.invalido'))?.focus(); return; }
    alEnviar(Object.fromEntries(new FormData(form)));
    form.reset();
  });
}

function iniciarFormularios() {
  const fecha = $('#v-fecha');
  const h = hoy();
  fecha.min = `${h.getFullYear()}-${String(h.getMonth() + 1).padStart(2, '0')}-${String(h.getDate()).padStart(2, '0')}`;

  prepararFormulario($('#formVisita'), datos => {
    const repetido = DB.todos('Visitantes').some(v => v.documento === datos.documento && v.fecha_visita === datos.fecha_visita);
    const msg = $('#msgVisita');
    if (repetido) { msg.className = 'mensaje campo--ancho mal'; msg.textContent = 'Ya existe un registro con ese documento para esa fecha.'; return; }
    delete datos.acepta;
    datos.id_evento = datos.id_evento ? Number(datos.id_evento) : null;
    datos.fecha_registro = fecha.min;
    const fila = DB.insertar('Visitantes', datos);
    msg.className = 'mensaje campo--ancho ok';
    msg.textContent = `¡Gracias, ${fila.nombres}! Tu visita quedó registrada para el ${fechaTexto(fila.fecha_visita)} (registro n.º ${fila.id}).`;
  });

  const texto = $('#c-mensaje');
  texto.addEventListener('input', () => { $('#contador').textContent = `${texto.value.length}/500`; });
  prepararFormulario($('#formContacto'), datos => {
    let mensajes = [];
    try { mensajes = JSON.parse(localStorage.getItem('rdm_mensajes')) || []; } catch { /* sin almacenamiento */ }
    mensajes.push({ ...datos, fecha: new Date().toISOString() });
    try { localStorage.setItem('rdm_mensajes', JSON.stringify(mensajes)); } catch { /* sin almacenamiento */ }
    $('#contador').textContent = '0/500';
    const msg = $('#msgContacto');
    msg.className = 'mensaje ok';
    msg.textContent = `Mensaje recibido, ${datos.nombre}. Te responderemos a ${datos.correo}.`;
  });
}

/* ---------------- Animación al hacer scroll ---------------- */
function iniciarAparecer() {
  const obs = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); } }), { threshold: .12 });
  $$('.aparecer').forEach(el => obs.observe(el));
}

document.addEventListener('DOMContentLoaded', () => {
  iniciarMenu();
  pintarLinea();
  pintarObjetos();
  iniciarVideos();
  pintarSalidas();
  pintarFechas();
  pintarEventos();
  pintarReconocimientos();
  pintarAliados();
  pintarGaleria();
  $('#verMas').addEventListener('click', () => { galeriaLimite += 16; pintarGaleria(); });
  pintarMultimedia();
  iniciarVisor();
  iniciarFormularios();
  iniciarCifras();
  iniciarAparecer();
});
