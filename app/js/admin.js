/* =========================================================
   PANEL DE GESTIÓN – CRUD genérico generado desde ESQUEMA
   ========================================================= */

const $ = (s, r = document) => r.querySelector(s);
const esc = t => String(t ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

let tablaActual = 'Visitantes';
let editando = null;

function pintarMenu() {
  $('#tablas').innerHTML = Object.entries(ESQUEMA).map(([clave, t]) =>
    `<button data-tabla="${clave}" aria-current="${clave === tablaActual}">${t.titulo} <small>${DB.todos(clave).length}</small></button>`).join('');
  document.querySelectorAll('#tablas button').forEach(b => b.addEventListener('click', () => {
    tablaActual = b.dataset.tabla;
    $('#buscar').value = '';
    pintar();
  }));
}

function valorVisible(def, valor) {
  if (def.tipo === 'ref' && valor) {
    const fila = DB.buscar(def.tabla, valor);
    return fila ? fila[def.mostrar] : `#${valor}`;
  }
  return valor ?? '';
}

function pintarTabla() {
  const { titulo, campos } = ESQUEMA[tablaActual];
  $('#tituloTabla').textContent = titulo;
  const texto = $('#buscar').value.trim().toLowerCase();
  const columnas = Object.entries(campos).filter(([, d]) => d.tipo !== 'textarea');
  const filas = DB.todos(tablaActual).filter(f => !texto || JSON.stringify(f).toLowerCase().includes(texto));

  $('#tabla').innerHTML = `
    <thead><tr><th>id</th>${columnas.map(([, d]) => `<th>${esc(d.etiqueta)}</th>`).join('')}<th>Acciones</th></tr></thead>
    <tbody>${filas.length ? filas.map(f => `
      <tr>
        <td>${f.id}</td>
        ${columnas.map(([k, d]) => `<td title="${esc(valorVisible(d, f[k]))}">${esc(valorVisible(d, f[k]))}</td>`).join('')}
        <td class="acciones"><button data-editar="${f.id}">Editar</button><button class="borrar" data-borrar="${f.id}">Eliminar</button></td>
      </tr>`).join('') : `<tr><td colspan="${columnas.length + 2}">Sin registros.</td></tr>`}
    </tbody>`;
}

function pintar() { pintarMenu(); pintarTabla(); }

/* ---------- Formulario dinámico ---------- */
function control(clave, def, valor) {
  const id = `f-${clave}`;
  const req = def.requerido ? 'required' : '';
  const patron = def.patron ? `pattern="${def.patron.replace(/^\^|\$$/g, '')}"` : '';
  let input;
  if (def.tipo === 'textarea') input = `<textarea id="${id}" name="${clave}" rows="4" ${req}>${esc(valor)}</textarea>`;
  else if (def.tipo === 'select') input = `<select id="${id}" name="${clave}" ${req}><option value="">—</option>${def.opciones.map(o => `<option ${o === valor ? 'selected' : ''}>${esc(o)}</option>`).join('')}</select>`;
  else if (def.tipo === 'ref') input = `<select id="${id}" name="${clave}"><option value="">— Ninguno —</option>${DB.todos(def.tabla).map(f => `<option value="${f.id}" ${f.id === Number(valor) ? 'selected' : ''}>${esc(f[def.mostrar])}</option>`).join('')}</select>`;
  else input = `<input id="${id}" name="${clave}" type="${def.tipo}" value="${esc(valor)}" ${req} ${patron}>`;
  return `<div class="campo"><label for="${id}">${esc(def.etiqueta)}${def.requerido ? ' *' : ''}</label>${input}<small class="error"></small></div>`;
}

function abrirFormulario(id = null) {
  editando = id;
  const fila = id ? DB.buscar(tablaActual, id) : {};
  $('#tituloForm').textContent = `${id ? 'Editar' : 'Nuevo'} registro – ${ESQUEMA[tablaActual].titulo}`;
  $('#campos').innerHTML = Object.entries(ESQUEMA[tablaActual].campos).map(([k, d]) => control(k, d, fila[k])).join('');
  $('#dialogo').showModal();
}

$('#formRegistro').addEventListener('submit', e => {
  e.preventDefault();
  const form = e.target;
  let valido = true;
  form.querySelectorAll('input, select, textarea').forEach(c => {
    const ok = c.checkValidity();
    c.closest('.campo')?.classList.toggle('invalido', !ok);
    const err = c.closest('.campo')?.querySelector('.error');
    if (err) err.textContent = ok ? '' : c.validationMessage;
    valido &&= ok;
  });
  // Regla de negocio: la fecha final no puede ser anterior a la inicial
  const campo = n => form.elements.namedItem(n);
  const ini = campo('fecha_inicio')?.value, fin = campo('fecha_fin')?.value;
  if (ini && fin && fin < ini) {
    valido = false;
    campo('fecha_fin').closest('.campo').classList.add('invalido');
    campo('fecha_fin').closest('.campo').querySelector('.error').textContent = 'Debe ser posterior a la fecha inicial.';
  }
  if (!valido) return;

  const datos = {};
  Object.entries(ESQUEMA[tablaActual].campos).forEach(([k, d]) => {
    const v = campo(k).value.trim();
    datos[k] = d.tipo === 'ref' ? (v ? Number(v) : null) : v;
  });
  if (editando) DB.actualizar(tablaActual, editando, datos);
  else DB.insertar(tablaActual, datos);
  $('#dialogo').close();
  pintar();
});

$('#cancelar').addEventListener('click', () => $('#dialogo').close());
$('#nuevo').addEventListener('click', () => abrirFormulario());
$('#buscar').addEventListener('input', pintarTabla);
$('#tabla').addEventListener('click', e => {
  const ed = e.target.dataset.editar, bo = e.target.dataset.borrar;
  if (ed) abrirFormulario(Number(ed));
  if (bo && confirm(`¿Eliminar el registro #${bo} de ${ESQUEMA[tablaActual].titulo}?`)) { DB.eliminar(tablaActual, bo); pintar(); }
});

/* ---------- Exportar / restaurar ---------- */
function descargar(nombre, contenido, tipo) {
  const url = URL.createObjectURL(new Blob([contenido], { type: tipo }));
  const a = Object.assign(document.createElement('a'), { href: url, download: nombre });
  a.click();
  URL.revokeObjectURL(url);
}
$('#exportarSQL').addEventListener('click', () => descargar('restauradores_datos.sql', DB.exportarSQL(), 'text/sql'));
$('#exportarJSON').addEventListener('click', () => {
  const todo = Object.fromEntries(Object.keys(ESQUEMA).map(t => [t, DB.todos(t)]));
  descargar('restauradores_datos.json', JSON.stringify(todo, null, 2), 'application/json');
});
$('#restaurar').addEventListener('click', () => {
  if (confirm('Se borrarán los cambios y se cargarán los datos iniciales. ¿Continuar?')) { DB.iniciar(true); pintar(); }
});

pintar();
