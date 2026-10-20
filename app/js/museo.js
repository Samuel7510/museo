/* =========================================================
   MUSEO VIRTUAL DE LA MEMORIA – A-Frame 1.6
   Sala única de 16 x 36 m con cuatro zonas:
     Entrada ........ línea del tiempo del proyecto
     Muro izquierdo . Sala 1: Salidas pedagógicas
     Muro derecho ... Sala 2: Muestras comunitarias
     Muro del fondo . Sala 3: Historieta de cómic
     Centro ......... Objetos 3D (fotogrametría) y vitrinas
   ========================================================= */

const SALA = { ancho: 16, largo: 36, alto: 5 };
const LIMITE = { x: SALA.ancho / 2 - 0.6, z: SALA.largo / 2 - 0.6 };
const OBSTACULOS = []; // [x, z, radio] de pedestales y vitrinas

const COLORES = {
  muro: '#e9e1d3', zocalo: '#3a2a1e', marco: '#3a2a1e', techo: '#2b2521',
  alfombra: '#7d1616', ocre: '#d69a2d', terracota: '#a8432a', verde: '#2f5d50', papel: '#f6f1e7', tinta: '#1e1a17'
};

/* Contenido de cada sala (imágenes del documento de evidencias) */
const SALA_SALIDAS = [
  { src: 'img/salida-01.jpg', titulo: 'Llegada al lugar de memoria' },
  { src: 'img/salida-02.jpg', titulo: 'Mural en el recorrido' },
  { src: 'img/salida-03.jpg', titulo: 'Caminar la ciudad' },
  { src: 'img/salida-04.jpg', titulo: 'Escuchar a los guías' },
  { src: 'img/salida-05.jpg', titulo: 'Conversatorio en el recorrido' },
  { src: 'img/salida-07.jpg', titulo: 'Preguntar y registrar' },
  { src: 'img/salida-08.jpg', titulo: 'El territorio como aula' },
  { src: 'img/salida-09.jpg', titulo: 'Foto de grupo' }
];
const SALA_MUESTRAS = [
  { src: 'img/muestra-03.jpg', titulo: 'Stand del Museo Escolar de la Memoria' },
  { src: 'img/muestra-06.jpg', titulo: 'Danza tradicional' },
  { src: 'img/muestra-08.jpg', titulo: 'Música en vivo' },
  { src: 'img/muestra-10.jpg', titulo: 'La comunidad acompaña' },
  { src: 'img/muestra-13.jpg', titulo: 'Teatro sobre el conflicto' },
  { src: 'img/muestra-15.jpg', titulo: 'Performance de memoria' },
  { src: 'img/muestra-16.jpg', titulo: 'Guardianes de los objetos' },
  { src: 'img/muestra-20.jpg', titulo: 'Realidad virtual en la muestra' }
];
const SALA_COMIC = [
  { src: 'img/comic-1.jpg', titulo: '"¿Basado en una historia real?"' },
  { src: 'img/comic-2.jpg', titulo: 'Boceto a mano' },
  { src: 'img/comic-3.jpg', titulo: 'El comandante reparte armas' }
];

/* ---------------------------------------------------------
   Utilidades
   --------------------------------------------------------- */
function crear(etiqueta, atributos = {}, padre = null) {
  const el = document.createElement(etiqueta);
  // Los objetos se convierten a "prop: valor; prop: valor" (sin ';' dentro de los textos)
  const limpiar = o => Object.fromEntries(Object.entries(o).map(([k, v]) => [k, typeof v === 'string' ? v.replace(/;/g, ',') : v]));
  Object.entries(atributos).forEach(([k, v]) => el.setAttribute(k, typeof v === 'object' ? AFRAME.utils.styleParser.stringify(limpiar(v)) : v));
  if (padre) padre.appendChild(el);
  return el;
}

function partirLineas(ctx, texto, anchoMax) {
  const lineas = [];
  texto.split('\n').forEach(parrafo => {
    let linea = '';
    parrafo.split(' ').forEach(palabra => {
      const prueba = linea ? `${linea} ${palabra}` : palabra;
      if (ctx.measureText(prueba).width > anchoMax && linea) { lineas.push(linea); linea = palabra; }
      else linea = prueba;
    });
    lineas.push(linea);
  });
  return lineas;
}

/* Evita abrir obras cuando el usuario solo estaba arrastrando para mirar */
const puntero = { x: 0, y: 0, arrastre: false };
window.addEventListener('pointerdown', e => { puntero.x = e.clientX; puntero.y = e.clientY; puntero.arrastre = false; });
window.addEventListener('pointerup', e => { puntero.arrastre = Math.hypot(e.clientX - puntero.x, e.clientY - puntero.y) > 8; });

/* ---------------------------------------------------------
   Componente: cartel (texto con tildes dibujado en canvas)
   --------------------------------------------------------- */
AFRAME.registerComponent('cartel', {
  schema: {
    titulo: { default: '' },
    texto: { default: '' },
    ancho: { default: 1.6 },
    alto: { default: 0.4 },
    fondo: { default: COLORES.papel },
    color: { default: COLORES.tinta },
    acento: { default: COLORES.terracota },
    tamTitulo: { default: 0.09 },
    tamTexto: { default: 0.05 },
    centrado: { default: false }
  },
  init() {
    const d = this.data;
    this.canvas = document.createElement('canvas');
    this.canvas.width = 1024;
    this.canvas.height = Math.round(1024 * d.alto / d.ancho);
    this.textura = new THREE.CanvasTexture(this.canvas);
    this.textura.colorSpace = THREE.SRGBColorSpace;
    this.textura.anisotropy = 8;
    this.el.setObject3D('mesh', new THREE.Mesh(new THREE.PlaneGeometry(d.ancho, d.alto), new THREE.MeshBasicMaterial({ map: this.textura })));
    this.dibujar();
    if (document.fonts) document.fonts.ready.then(() => this.dibujar());
  },
  dibujar() {
    const d = this.data;
    const ctx = this.canvas.getContext('2d');
    const W = this.canvas.width, H = this.canvas.height;
    const ppm = W / d.ancho; // píxeles por metro
    const margen = 0.07 * ppm;
    ctx.fillStyle = d.fondo;
    ctx.fillRect(0, 0, W, H);
    if (!d.centrado) { ctx.fillStyle = d.acento; ctx.fillRect(0, 0, 0.022 * ppm, H); }

    const tT = d.tamTitulo * ppm, tX = d.tamTexto * ppm;
    const fT = `700 ${tT}px Fraunces, Georgia, serif`;
    const fX = `400 ${tX}px "Source Sans 3", "Segoe UI", sans-serif`;
    ctx.font = fT;
    const lT = d.titulo ? partirLineas(ctx, d.titulo, W - margen * 2) : [];
    ctx.font = fX;
    const lX = d.texto ? partirLineas(ctx, d.texto, W - margen * 2) : [];
    const altoTotal = lT.length * tT * 1.15 + (lT.length && lX.length ? tX * 0.5 : 0) + lX.length * tX * 1.35;
    let y = (H - altoTotal) / 2;

    ctx.textBaseline = 'top';
    ctx.textAlign = d.centrado ? 'center' : 'left';
    const x = d.centrado ? W / 2 : margen;
    ctx.fillStyle = d.color;
    ctx.font = fT;
    lT.forEach(l => { ctx.fillText(l, x, y); y += tT * 1.15; });
    if (lT.length && lX.length) y += tX * 0.5;
    ctx.font = fX;
    ctx.globalAlpha = 0.85;
    lX.forEach(l => { ctx.fillText(l, x, y); y += tX * 1.35; });
    ctx.globalAlpha = 1;
    this.textura.needsUpdate = true;
  }
});

/* ---------------------------------------------------------
   Componente: cuadro (foto enmarcada + placa + clic)
   --------------------------------------------------------- */
AFRAME.registerComponent('cuadro', {
  schema: {
    src: { type: 'string' },
    titulo: { type: 'string' },
    sala: { type: 'string' },
    texto: { type: 'string' },
    maxAncho: { default: 2.5 },
    maxAlto: { default: 1.7 }
  },
  init() {
    const img = new Image();
    img.onload = () => this.armar(img.naturalWidth / img.naturalHeight);
    img.src = this.data.src;
  },
  armar(proporcion) {
    const d = this.data;
    let w = d.maxAncho, h = w / proporcion;
    if (h > d.maxAlto) { h = d.maxAlto; w = h * proporcion; }

    crear('a-box', { width: w + 0.14, height: h + 0.14, depth: 0.06, position: '0 0 0.03', color: COLORES.marco }, this.el);
    const foto = crear('a-plane', {
      class: 'interactivo', width: w, height: h, position: '0 0 0.065',
      material: { src: d.src, shader: 'flat' }
    }, this.el);
    crear('a-entity', {
      position: `0 ${-h / 2 - 0.3} 0.02`,
      cartel: { titulo: d.titulo, texto: d.sala, ancho: 1.5, alto: 0.3, tamTitulo: 0.07, tamTexto: 0.045 }
    }, this.el);

    resaltar(foto, this.el);
    foto.addEventListener('click', () => abrirInfo({ img: d.src, titulo: d.titulo, sala: d.sala, texto: d.texto }));
  }
});

function resaltar(objetivo, quien) {
  objetivo.addEventListener('mouseenter', () => { quien.object3D.scale.setScalar(1.04); document.body.classList.add('sobre-obra'); });
  objetivo.addEventListener('mouseleave', () => { quien.object3D.scale.setScalar(1); document.body.classList.remove('sobre-obra'); });
}

/* ---------------------------------------------------------
   Componente: modelo con respaldo
   Carga models/objeto-N.glb (Luma AI, Polycam...). Si el archivo
   no existe, muestra la versión modelada con primitivas.
   --------------------------------------------------------- */
AFRAME.registerComponent('modelo-con-respaldo', {
  schema: { src: { type: 'string' }, tamano: { default: 0.75 } },
  init() {
    if (!this.data.src || location.protocol === 'file:') return;
    fetch(this.data.src, { method: 'HEAD' })
      .then(r => { if (r.ok && !/text\/html/.test(r.headers.get('content-type') || '')) this.cargar(); })
      .catch(() => { /* se queda el respaldo */ });
  },
  cargar() {
    const modelo = crear('a-entity', { 'gltf-model': `url(${this.data.src})` }, this.el);
    modelo.addEventListener('model-loaded', () => {
      const obj = modelo.getObject3D('mesh');
      // Normaliza escala y posición: los modelos de fotogrametría llegan con tamaños muy distintos
      let caja = new THREE.Box3().setFromObject(obj);
      const tam = caja.getSize(new THREE.Vector3());
      obj.scale.multiplyScalar(this.data.tamano / Math.max(tam.x, tam.y, tam.z));
      obj.updateMatrixWorld(true);
      caja = new THREE.Box3().setFromObject(obj);
      const centro = modelo.object3D.worldToLocal(caja.getCenter(new THREE.Vector3()));
      const base = modelo.object3D.worldToLocal(caja.min.clone());
      obj.position.x -= centro.x;
      obj.position.z -= centro.z;
      obj.position.y -= base.y;
      this.el.querySelectorAll('.respaldo').forEach(r => r.setAttribute('visible', false));
    });
  }
});

/* ---------------------------------------------------------
   Componente: límites (paredes y pedestales)
   --------------------------------------------------------- */
AFRAME.registerComponent('limites', {
  init() { this.pos = new THREE.Vector3(); },
  tick() {
    const camara = this.el.sceneEl.camera;
    if (!camara) return;
    camara.getWorldPosition(this.pos);
    let x = THREE.MathUtils.clamp(this.pos.x, -LIMITE.x, LIMITE.x);
    let z = THREE.MathUtils.clamp(this.pos.z, -LIMITE.z, LIMITE.z);
    OBSTACULOS.forEach(([ox, oz, r]) => {
      const dx = x - ox, dz = z - oz, dist = Math.hypot(dx, dz);
      if (dist < r && dist > 0.0001) { x = ox + dx / dist * r; z = oz + dz / dist * r; }
    });
    this.el.object3D.position.x += x - this.pos.x;
    this.el.object3D.position.z += z - this.pos.z;
  }
});

/* ---------------------------------------------------------
   Componente: movimiento con los botones táctiles
   --------------------------------------------------------- */
const teclasTactiles = { adelante: false, atras: false, izquierda: false, derecha: false };
AFRAME.registerComponent('mover-tactil', {
  init() { this.dir = new THREE.Vector3(); this.lado = new THREE.Vector3(); },
  tick(t, dt) {
    const k = teclasTactiles;
    if (!(k.adelante || k.atras || k.izquierda || k.derecha) || !dt) return;
    const camara = this.el.sceneEl.camera;
    camara.getWorldDirection(this.dir);
    this.dir.y = 0;
    this.dir.normalize();
    this.lado.set(-this.dir.z, 0, this.dir.x);
    const v = 2.4 * dt / 1000;
    const p = this.el.object3D.position;
    p.addScaledVector(this.dir, ((k.adelante ? 1 : 0) - (k.atras ? 1 : 0)) * v);
    p.addScaledVector(this.lado, ((k.derecha ? 1 : 0) - (k.izquierda ? 1 : 0)) * v);
  }
});

/* ---------------------------------------------------------
   Componente: piso de madera con textura generada
   --------------------------------------------------------- */
AFRAME.registerComponent('piso-madera', {
  init() {
    const c = document.createElement('canvas');
    c.width = c.height = 512;
    const ctx = c.getContext('2d');
    const tonos = ['#5a3a24', '#62412a', '#553621', '#6a4630', '#4f321f'];
    for (let fila = 0; fila < 8; fila++) {
      let x = -(fila % 2) * 128;
      while (x < 512) {
        ctx.fillStyle = tonos[Math.floor(Math.random() * tonos.length)];
        ctx.fillRect(x, fila * 64, 256, 64);
        ctx.strokeStyle = 'rgba(0,0,0,.35)';
        ctx.strokeRect(x + 0.5, fila * 64 + 0.5, 256, 63);
        for (let v = 0; v < 6; v++) {
          ctx.strokeStyle = 'rgba(255,255,255,.04)';
          ctx.beginPath();
          const y = fila * 64 + 8 + Math.random() * 48;
          ctx.moveTo(x, y);
          ctx.bezierCurveTo(x + 80, y + 4, x + 170, y - 4, x + 256, y);
          ctx.stroke();
        }
        x += 256;
      }
    }
    const tex = new THREE.CanvasTexture(c);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(SALA.ancho / 4, SALA.largo / 4);
    tex.anisotropy = 8;
    const piso = new THREE.Mesh(new THREE.PlaneGeometry(SALA.ancho, SALA.largo), new THREE.MeshStandardMaterial({ map: tex, roughness: 0.8 }));
    piso.rotation.x = -Math.PI / 2;
    this.el.setObject3D('mesh', piso);

    // Clic en el piso: desplazarse hasta ese punto
    this.el.addEventListener('click', e => {
      if (puntero.arrastre || !e.detail.intersection) return;
      const destino = e.detail.intersection.point;
      const rig = document.getElementById('rig');
      const cam = new THREE.Vector3();
      this.el.sceneEl.camera.getWorldPosition(cam);
      const x = THREE.MathUtils.clamp(destino.x, -LIMITE.x, LIMITE.x);
      const z = THREE.MathUtils.clamp(destino.z, -LIMITE.z, LIMITE.z);
      const p = rig.object3D.position;
      rig.setAttribute('animation__mover', { property: 'position', to: `${p.x + x - cam.x} 0 ${p.z + z - cam.z}`, dur: 700, easing: 'easeInOutQuad' });
    });
  }
});

/* ---------------------------------------------------------
   Componente principal: construye el edificio y la colección
   --------------------------------------------------------- */
AFRAME.registerComponent('construir-museo', {
  init() {
    const raiz = this.el;
    const { ancho: A, largo: L, alto: H } = SALA;

    /* ----- Edificio ----- */
    crear('a-entity', { class: 'interactivo', 'piso-madera': '' }, raiz);
    crear('a-plane', { width: A, height: L, rotation: '90 0 0', position: `0 ${H} 0`, color: COLORES.techo }, raiz);
    const muros = [
      { pos: `${-A / 2 - 0.1} ${H / 2} 0`, w: 0.2, d: L },
      { pos: `${A / 2 + 0.1} ${H / 2} 0`, w: 0.2, d: L },
      { pos: `0 ${H / 2} ${-L / 2 - 0.1}`, w: A + 0.4, d: 0.2 },
      { pos: `0 ${H / 2} ${L / 2 + 0.1}`, w: A + 0.4, d: 0.2 }
    ];
    muros.forEach(m => {
      crear('a-box', { position: m.pos, width: m.w, height: H, depth: m.d, color: COLORES.muro }, raiz);
      const [x, , z] = m.pos.split(' ').map(Number);
      crear('a-box', { position: `${x} 0.12 ${z}`, width: m.w + 0.04, height: 0.24, depth: m.d + 0.04, color: COLORES.zocalo }, raiz);
    });
    // Franjas de color que identifican cada sala
    crear('a-box', { position: `${-A / 2 + 0.01} ${H - 0.35} -1`, width: 0.02, height: 0.12, depth: L - 8, color: COLORES.terracota }, raiz);
    crear('a-box', { position: `${A / 2 - 0.01} ${H - 0.35} -1`, width: 0.02, height: 0.12, depth: L - 8, color: COLORES.verde }, raiz);
    // Lámparas del techo
    for (let z = -14; z <= 14; z += 7) {
      crear('a-box', { position: `0 ${H - 0.03} ${z}`, width: 6, height: 0.04, depth: 0.3, material: { color: '#fff6e0', shader: 'flat' } }, raiz);
    }
    // Alfombra roja (homenaje al museo en CoSpaces)
    crear('a-plane', { rotation: '-90 0 0', position: '0 0.006 -1', width: 2.2, height: L - 6, color: COLORES.alfombra }, raiz);
    [-1.15, 1.15].forEach(x => crear('a-plane', { rotation: '-90 0 0', position: `${x} 0.007 -1`, width: 0.08, height: L - 6, color: COLORES.ocre }, raiz));

    /* ----- Arco de bienvenida ----- */
    [-4.2, 4.2].forEach(x => crear('a-box', { position: `${x} 2 11`, width: 0.35, height: 4, depth: 0.35, color: COLORES.tinta }, raiz));
    crear('a-entity', {
      position: '0 3.85 11',
      cartel: { titulo: 'MUSEO VIRTUAL DE LA MEMORIA', texto: 'Proyecto Restauradores de la Memoria · Colegio Tom Adams IED', ancho: 8.75, alto: 1.1, fondo: COLORES.tinta, color: COLORES.papel, tamTitulo: 0.42, tamTexto: 0.2, centrado: true }
    }, raiz);
    crear('a-entity', {
      position: '0 3.85 10.99', rotation: '0 180 0',
      cartel: { titulo: '"Quien no conoce su historia está condenado a repetirla"', ancho: 8.75, alto: 1.1, fondo: COLORES.tinta, color: COLORES.ocre, tamTitulo: 0.3, centrado: true }
    }, raiz);

    /* ----- Sala 1 y Sala 2 en los muros laterales ----- */
    const posicionesZ = [10, 6.9, 3.8, 0.7, -2.4, -5.5, -8.6, -11.7];
    const colgar = (lista, lado, sala, texto) => {
      const x = lado * (A / 2 - 0.02);
      const rot = `0 ${lado < 0 ? 90 : -90} 0`;
      lista.forEach((obra, i) => crear('a-entity', {
        position: `${x} 2.1 ${posicionesZ[i]}`, rotation: rot,
        cuadro: { src: obra.src, titulo: obra.titulo, sala, texto }
      }, raiz));
    };
    colgar(SALA_SALIDAS, -1, 'Sala 1 · Salidas pedagógicas',
      'Los estudiantes recorren el Eje de la Memoria y la Paz, el Centro de Memoria, Paz y Reconciliación y otros lugares de la ciudad acompañados por el Centro Nacional de Memoria Histórica. Aprender la historia caminándola.');
    colgar(SALA_MUESTRAS, 1, 'Sala 2 · Muestras comunitarias',
      'El Museo Escolar de la Memoria sale al barrio: objetos, retratos, danza, música, teatro y realidad virtual. En 2025 llegó a su quinta versión.');

    crear('a-entity', {
      position: `${-A / 2 + 0.03} 4.05 13.8`, rotation: '0 90 0',
      cartel: { titulo: 'Sala 1 · Salidas pedagógicas', texto: 'Lugares de memoria', ancho: 3.4, alto: 0.75, acento: COLORES.terracota, tamTitulo: 0.22, tamTexto: 0.14 }
    }, raiz);
    crear('a-entity', {
      position: `${A / 2 - 0.03} 4.05 13.8`, rotation: '0 -90 0',
      cartel: { titulo: 'Sala 2 · Muestras comunitarias', texto: 'Museo Escolar de la Memoria', ancho: 3.4, alto: 0.75, acento: COLORES.verde, tamTitulo: 0.22, tamTexto: 0.14 }
    }, raiz);

    /* ----- Sala 3: historieta en el muro del fondo ----- */
    const zFondo = -L / 2 + 0.02;
    crear('a-entity', {
      position: `0 4.2 ${zFondo + 0.01}`,
      cartel: { titulo: 'Sala 3 · Historieta de cómic', texto: 'Dibujo a mano y digitalización', ancho: 5, alto: 0.7, acento: COLORES.ocre, tamTitulo: 0.25, tamTexto: 0.14, centrado: true }
    }, raiz);
    [-4.6, 0, 4.6].forEach((x, i) => crear('a-entity', {
      position: `${x} 2.2 ${zFondo}`,
      cuadro: { src: SALA_COMIC[i].src, titulo: SALA_COMIC[i].titulo, sala: 'Sala 3 · Historieta', maxAncho: 3.2, maxAlto: 2.3,
        texto: 'Historieta creada por los estudiantes: un joven lee con pereza un libro "basado en una historia real" y descubre la realidad del conflicto armado. Dibujo a mano alzada, entintado y coloreado digital.' }
    }, raiz));

    /* ----- Entrada: línea del tiempo ----- */
    const zEntrada = L / 2 - 0.02;
    crear('a-entity', {
      position: `0 3.9 ${zEntrada - 0.01}`, rotation: '0 180 0',
      cartel: { titulo: 'Línea del tiempo del proyecto', ancho: 6, alto: 0.6, tamTitulo: 0.26, centrado: true }
    }, raiz);
    LINEA_TIEMPO.forEach((hito, i) => crear('a-entity', {
      position: `${(2.5 - i) * 2.45} 2.3 ${zEntrada - 0.01}`, rotation: '0 180 0',
      cartel: { titulo: hito.anio, texto: hito.texto, ancho: 2.25, alto: 1.9, tamTitulo: 0.26, tamTexto: 0.085, acento: i % 2 ? COLORES.verde : COLORES.terracota }
    }, raiz));

    /* ----- Objetos 3D en pedestales ----- */
    const obj = id => (typeof DB !== 'undefined' && DB.buscar('Objetos_Museo', id)) || SEED.Objetos_Museo.find(o => o.id === id);
    const corazon = obj(1), mascara = obj(2), tejido = obj(3);
    this.pedestal(-2.7, 6, corazon, construirCorazon);
    this.pedestal(2.7, 6, mascara, construirMascara);
    this.pedestal(2.7, -3.5, {
      nombre: 'Radio: voces de la memoria', tipo: 'Objeto simbólico', creditos: 'Javeriana Estéreo 91.9 FM · El Guateque, Memorias Rurales',
      imagen_url: 'img/guateque-ep132.jpg',
      descripcion: 'El proyecto ha llegado a la radio en tres episodios de El Guateque: Cátedra de Paz (12 oct. 2025), Restauradores de la memoria histórica en escuelas (23 nov. 2025) y el museo junto a las madres de falsos positivos (22 mar. 2026).',
      enlaces: SEED.Evidencias.filter(e => e.fuente === 'SoundCloud').map(e => ({ texto: '▶ ' + e.titulo, url: e.url }))
    }, construirRadio);
    this.vitrinaTejido(-2.7, -3.5, tejido);

    /* ----- Atriles: reconocimientos y medios ----- */
    this.atril(-5.3, -14, 90, 'img/entornos-aliados.jpg', 'Entornos Escolares Inspiradores', 'Reconocimientos',
      'Reconocimiento de la Alcaldía Mayor de Bogotá y la Secretaría de Educación (2025) en la categoría "Aliados por un entorno inspirador".');
    this.atril(5.3, -14, -90, 'img/expo-escuela-territorio-paz.jpg', 'La Escuela: territorio de paz', 'Exposiciones',
      'Exposición de 10 colegios de la Red de colegios como lugares de memoria en el Centro de Memoria, Paz y Reconciliación (22 de octubre de 2025).');
  },

  pedestal(x, z, datos, construir) {
    OBSTACULOS.push([x, z, 0.85]);
    const base = crear('a-entity', { position: `${x} 0 ${z}` }, this.el);
    crear('a-box', { position: '0 0.55 0', width: 0.75, height: 1.1, depth: 0.75, color: '#efe7da' }, base);
    crear('a-box', { position: '0 1.115 0', width: 0.82, height: 0.03, depth: 0.82, color: COLORES.tinta }, base);
    crear('a-entity', { light: { type: 'point', color: '#ffe9c4', intensity: 1.2, distance: 4, decay: 1 }, position: '0 2.6 0.6' }, base);
    crear('a-entity', {
      position: '0 0.8 0.381',
      cartel: { titulo: datos.nombre, texto: datos.tipo, ancho: 0.68, alto: 0.34, tamTitulo: 0.055, tamTexto: 0.035 }
    }, base);

    const giro = crear('a-entity', {
      class: 'interactivo', position: '0 1.13 0',
      animation: { property: 'rotation', to: '0 360 0', loop: true, dur: 24000, easing: 'linear' },
      'modelo-con-respaldo': { src: datos.modelo_3d_url || '' }
    }, base);
    const respaldo = crear('a-entity', { class: 'respaldo' }, giro);
    construir(respaldo);
    // Zona de clic invisible alrededor del objeto
    crear('a-cylinder', { class: 'interactivo', radius: 0.4, height: 0.9, position: '0 0.45 0', material: { opacity: 0, transparent: true, depthWrite: false } }, giro);

    resaltar(giro, giro);
    giro.addEventListener('click', () => abrirInfo({
      img: datos.imagen_url, titulo: datos.nombre, sala: 'Objetos del museo · ' + (datos.modelo_3d_url ? 'Objeto 3D' : datos.tipo),
      texto: datos.descripcion, creditos: [datos.tecnica, datos.autor, datos.creditos].filter(Boolean).join(' · '), enlaces: datos.enlaces
    }));
  },

  vitrinaTejido(x, z, datos) {
    OBSTACULOS.push([x, z, 1.05]);
    const base = crear('a-entity', { position: `${x} 0 ${z}` }, this.el);
    crear('a-box', { position: '0 0.4 0', width: 1.5, height: 0.8, depth: 1.1, color: '#efe7da' }, base);
    const tela = crear('a-plane', {
      class: 'interactivo', rotation: '-75 0 0', position: '0 0.86 0', width: 1.4, height: 1.05,
      material: { src: 'img/tejido-colectivo-1.jpg', shader: 'flat' }
    }, base);
    crear('a-box', { position: '0 1.15 0', width: 1.5, height: 0.7, depth: 1.1, material: { color: '#cfe8ff', opacity: 0.12, transparent: true } }, base);
    crear('a-entity', { position: '0 0.45 0.556', cartel: { titulo: datos.nombre, texto: datos.tecnica, ancho: 1.1, alto: 0.3, tamTitulo: 0.06, tamTexto: 0.038 } }, base);
    resaltar(tela, tela);
    tela.addEventListener('click', () => abrirInfo({ img: datos.imagen_url, titulo: datos.nombre, sala: 'Objetos del museo · Textil', texto: datos.descripcion, creditos: datos.creditos }));
  },

  atril(x, z, giro, src, titulo, sala, texto) {
    OBSTACULOS.push([x, z, 0.8]);
    const base = crear('a-entity', { position: `${x} 0 ${z}`, rotation: `0 ${giro} 0` }, this.el);
    crear('a-box', { position: '0 0.05 0', width: 1.2, height: 0.1, depth: 0.5, color: COLORES.tinta }, base);
    crear('a-box', { position: '0 1.3 -0.03', width: 1.3, height: 2.4, depth: 0.05, color: COLORES.tinta }, base);
    crear('a-entity', { position: '0 1.45 0', cuadro: { src, titulo, sala, texto, maxAncho: 1.1, maxAlto: 1.6 } }, base);
  }
});

/* ---------------------------------------------------------
   Objetos de respaldo modelados con primitivas
   (se reemplazan por el .glb de fotogrametría cuando existe)
   --------------------------------------------------------- */
function construirCorazon(p) {
  const piel = '#f0caa0', rojo = '#b3121f', azul = '#1f3f9e';
  crear('a-cylinder', { radius: 0.085, height: 0.32, position: '0 0.16 0', color: piel }, p);           // muñeca
  crear('a-sphere', { radius: 0.15, scale: '1.25 0.55 1', position: '0 0.36 0', color: piel }, p);       // palma
  [-0.12, -0.04, 0.04, 0.12].forEach((x, i) =>                                                          // dedos
    crear('a-cylinder', { radius: 0.026, height: 0.17 + (i % 3 ? 0.03 : 0), position: `${x} 0.47 0.11`, rotation: '-25 0 0', color: piel }, p));
  crear('a-cylinder', { radius: 0.03, height: 0.15, position: '-0.19 0.44 0.02', rotation: '0 0 30', color: piel }, p); // pulgar
  crear('a-sphere', { radius: 0.11, position: '-0.065 0.62 0', color: rojo }, p);                         // corazón
  crear('a-sphere', { radius: 0.11, position: '0.065 0.62 0', color: rojo }, p);
  crear('a-cone', { 'radius-bottom': 0.01, 'radius-top': 0.165, height: 0.22, position: '0 0.5 0', color: rojo }, p);
  crear('a-cylinder', { radius: 0.035, height: 0.15, position: '-0.04 0.77 -0.01', color: azul }, p);     // aorta
  crear('a-torus', { radius: 0.06, 'radius-tubular': 0.018, arc: 180, position: '0.03 0.8 -0.01', color: rojo }, p);
  crear('a-sphere', { radius: 0.055, scale: '1 1.2 0.5', position: '0 0.58 0.09', color: '#f6d6b8' }, p); // vida que nace
  crear('a-ring', { 'radius-inner': 0.058, 'radius-outer': 0.07, position: '0 0.58 0.118', color: '#ffffff' }, p);
}

function construirMascara(p) {
  const blanco = '#f2efe9', rojo = '#b3121f';
  crear('a-cylinder', { radius: 0.02, height: 0.25, position: '0 0.125 0', color: COLORES.tinta }, p);
  crear('a-sphere', { radius: 0.2, 'phi-length': 180, 'phi-start': 0, scale: '1 1.3 0.55', position: '0 0.45 0', rotation: '0 -90 0', color: blanco, side: 'double' }, p);
  [-0.075, 0.075].forEach(x => crear('a-sphere', { radius: 0.042, scale: '1.2 0.7 0.5', position: `${x} 0.5 0.1`, color: '#111' }, p));
  crear('a-box', { width: 0.1, height: 0.012, depth: 0.03, position: '0 0.34 0.1', color: '#222' }, p);
  crear('a-box', { width: 0.015, height: 0.2, depth: 0.01, position: '-0.06 0.4 0.112', rotation: '0 0 12', color: rojo }, p);
  crear('a-box', { width: 0.012, height: 0.16, depth: 0.01, position: '0.09 0.36 0.106', rotation: '0 0 -18', color: rojo }, p);
  crear('a-box', { width: 0.22, height: 0.012, depth: 0.01, position: '0 0.6 0.095', rotation: '0 0 -8', color: rojo }, p);
}

function construirRadio(p) {
  const madera = '#6b3e26';
  crear('a-box', { width: 0.5, height: 0.3, depth: 0.2, position: '0 0.15 0', color: madera }, p);
  crear('a-circle', { radius: 0.09, position: '-0.1 0.15 0.101', color: '#2a1d14' }, p);
  crear('a-ring', { 'radius-inner': 0.085, 'radius-outer': 0.1, position: '-0.1 0.15 0.102', color: COLORES.ocre }, p);
  crear('a-plane', { width: 0.16, height: 0.07, position: '0.12 0.2 0.101', color: '#f2e2b8' }, p);
  [0.07, 0.17].forEach(x => crear('a-cylinder', { radius: 0.02, height: 0.03, rotation: '90 0 0', position: `${x} 0.09 0.11`, color: COLORES.ocre }, p));
  crear('a-cylinder', { radius: 0.006, height: 0.4, position: '0.18 0.45 -0.05', rotation: '0 0 -20', color: '#999' }, p);
}

/* ---------------------------------------------------------
   Interfaz HTML: ficha de la obra, ayuda y botones táctiles
   --------------------------------------------------------- */
function abrirInfo({ img, titulo, sala, texto, creditos, enlaces }) {
  if (puntero.arrastre) return;
  const dlg = document.getElementById('info');
  if (dlg.open) return;
  const imagen = document.getElementById('infoImg');
  imagen.src = img || '';
  imagen.alt = titulo;
  imagen.hidden = !img;
  document.getElementById('infoSala').textContent = sala || '';
  document.getElementById('infoTitulo').textContent = titulo || '';
  document.getElementById('infoTexto').textContent = texto || '';
  document.getElementById('infoCreditos').textContent = creditos || 'Fotografía: archivo del Proyecto Restauradores de la Memoria.';
  const cont = document.getElementById('infoEnlaces');
  cont.replaceChildren(...(enlaces || []).map(e => Object.assign(document.createElement('a'), { href: e.url, textContent: e.texto, target: '_blank', rel: 'noopener' })));
  dlg.showModal();
}

document.addEventListener('DOMContentLoaded', () => {
  const ayuda = document.getElementById('ayuda');
  const btnAyuda = document.getElementById('btnAyuda');
  const alternarAyuda = mostrar => { ayuda.hidden = !mostrar; btnAyuda.setAttribute('aria-expanded', String(mostrar)); };
  btnAyuda.addEventListener('click', () => alternarAyuda(ayuda.hidden));
  document.getElementById('cerrarAyuda').addEventListener('click', () => alternarAyuda(false));

  const info = document.getElementById('info');
  document.getElementById('infoCerrar').addEventListener('click', () => info.close());
  info.addEventListener('click', e => { if (e.target === info) info.close(); });

  document.querySelectorAll('.dpad button').forEach(b => {
    const activar = v => e => { e.preventDefault(); teclasTactiles[b.dataset.dir] = v; b.classList.toggle('activo', v); };
    b.addEventListener('pointerdown', activar(true));
    ['pointerup', 'pointerleave', 'pointercancel'].forEach(ev => b.addEventListener(ev, activar(false)));
  });

  // En modo VR se ocultan los controles HTML
  const escena = document.querySelector('a-scene');
  escena.addEventListener('enter-vr', () => document.body.classList.add('en-vr'));
  escena.addEventListener('exit-vr', () => document.body.classList.remove('en-vr'));
});
