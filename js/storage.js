/* ============================================================
   storage.js
   Módulo de "base de datos" en LocalStorage. Sigue el patrón
   visto en clases: una CLAVE por colección, obtenerX(),
   guardarX(lista) y agregarX(objeto).
   ============================================================ */

const CLAVE_PRODUCTOS = "gasvolcan_productos";
const CLAVE_USUARIOS = "gasvolcan_usuarios";
const CLAVE_CARRITO = "gasvolcan_carrito";
const CLAVE_SESION = "gasvolcan_sesion";
const CLAVE_CONSULTAS = "gasvolcan_consultas";
const CLAVE_PEDIDOS = "gasvolcan_pedidos";
const CLAVE_BLOGS = "gasvolcan_blogs";
const CLAVE_PRODUCTO_SELECCIONADO = "gasvolcan_producto_seleccionado";
const CLAVE_USUARIO_EDITANDO = "gasvolcan_usuario_editando";
const CLAVE_BLOG_SELECCIONADO = "gasvolcan_blog_seleccionado";
const CLAVE_PEDIDO_SELECCIONADO = "gasvolcan_pedido_seleccionado";

const CATEGORIAS_PRODUCTO = ["Cilindros de Gas", "Accesorios", "Artefactos a Gas"];
const TIPOS_USUARIO = ["Administrador", "Vendedor", "Cliente"];

/* Catálogo inicial: cilindros de gas, accesorios y artefactos.
   Dos productos parten sin stock para poder probar esa regla,
   y dos parten con stock igual o menor a su stock crítico. */
const PRODUCTOS_INICIALES = [
  { id: 1, codigo: "CIL-5KG", nombre: "Cilindro de Gas 5 kg", categoria: "Cilindros de Gas", precio: 8990, precioOferta: null,
    imagen: "https://placehold.co/500x500/0b5fa5/ffffff?text=Cilindro+5kg", stock: 40, stockCritico: 8,
    descripcion: "Cilindro de gas licuado de 5 kg, ideal para cocinillas portátiles y consumo doméstico ocasional." },
  { id: 2, codigo: "CIL-11KG", nombre: "Cilindro de Gas 11 kg", categoria: "Cilindros de Gas", precio: 14990, precioOferta: null,
    imagen: "https://placehold.co/500x500/0b5fa5/ffffff?text=Cilindro+11kg", stock: 60, stockCritico: 10,
    descripcion: "El cilindro más solicitado por los hogares de Chillán y comunas aledañas. Rinde para cocina y agua caliente.", destacado: true },
  { id: 3, codigo: "CIL-15KG", nombre: "Cilindro de Gas 15 kg", categoria: "Cilindros de Gas", precio: 18990, precioOferta: null,
    imagen: "https://placehold.co/500x500/0b5fa5/ffffff?text=Cilindro+15kg", stock: 35, stockCritico: 8,
    descripcion: "Mayor autonomía para familias numerosas o consumo combinado de cocina y calefacción." },
  { id: 4, codigo: "CIL-45KG", nombre: "Cilindro de Gas 45 kg (Industrial)", categoria: "Cilindros de Gas", precio: 54990, precioOferta: null,
    imagen: "https://placehold.co/500x500/0b5fa5/ffffff?text=Cilindro+45kg", stock: 6, stockCritico: 6,
    descripcion: "Formato industrial para locales comerciales, restaurantes y negocios con alto consumo de gas." },
  { id: 5, codigo: "ACC-REG01", nombre: "Regulador de Gas Universal", categoria: "Accesorios", precio: 6990, precioOferta: null,
    imagen: "https://placehold.co/500x500/f7931e/1a1a1a?text=Regulador", stock: 50, stockCritico: 10,
    descripcion: "Compatible con cilindros de 5, 11, 15 y 45 kg. Incluye sello de seguridad certificado." },
  { id: 6, codigo: "ACC-MAN01", nombre: "Manguera de Gas 1.5 m", categoria: "Accesorios", precio: 4990, precioOferta: null,
    imagen: "https://placehold.co/500x500/f7931e/1a1a1a?text=Manguera+Gas", stock: 45, stockCritico: 10,
    descripcion: "Manguera flexible reforzada, certificada para uso con gas licuado, 1.5 metros de largo." },
  { id: 7, codigo: "ACC-ABR01", nombre: "Abrazaderas de Seguridad (par)", categoria: "Accesorios", precio: 2490, precioOferta: null,
    imagen: "https://placehold.co/500x500/f7931e/1a1a1a?text=Abrazaderas", stock: 0, stockCritico: 5,
    descripcion: "Par de abrazaderas metálicas para asegurar la conexión entre manguera y regulador." },
  { id: 8, codigo: "ACC-DET01", nombre: "Detector de Fuga de Gas", categoria: "Accesorios", precio: 12990, precioOferta: 15990,
    imagen: "https://placehold.co/500x500/f7931e/1a1a1a?text=Detector+Fuga", stock: 20, stockCritico: 4,
    descripcion: "Alarma sonora que detecta fugas de gas licuado en el ambiente antes de que representen un riesgo." },
  { id: 9, codigo: "ART-COC01", nombre: "Cocinilla a Gas 2 Platos", categoria: "Artefactos a Gas", precio: 34990, precioOferta: null,
    imagen: "https://placehold.co/500x500/0b5fa5/ffffff?text=Cocinilla+2P", stock: 15, stockCritico: 3,
    descripcion: "Cocinilla a gas de 2 platos con encendido automático, ideal para espacios reducidos.", destacado: true },
  { id: 10, codigo: "ART-CAL01", nombre: "Calefont a Gas 5 Litros", categoria: "Artefactos a Gas", precio: 149990, precioOferta: null,
    imagen: "https://placehold.co/500x500/0b5fa5/ffffff?text=Calefont+5L", stock: 6, stockCritico: 2,
    descripcion: "Calefont instantáneo a gas, entrega 5 litros por minuto de agua caliente, encendido electrónico." },
  { id: 11, codigo: "ART-EST01", nombre: "Estufa a Gas Catalítica", categoria: "Artefactos a Gas", precio: 69990, precioOferta: null,
    imagen: "https://placehold.co/500x500/0b5fa5/ffffff?text=Estufa+Catalitica", stock: 0, stockCritico: 3,
    descripcion: "Calefacción silenciosa sin llama visible, con sistema de seguridad por falta de oxígeno." },
  { id: 12, codigo: "ART-ANA01", nombre: "Anafe Portátil a Gas", categoria: "Artefactos a Gas", precio: 22990, precioOferta: 27990,
    imagen: "https://placehold.co/500x500/0b5fa5/ffffff?text=Anafe+Portatil", stock: 22, stockCritico: 5,
    descripcion: "Anafe compacto a gas, perfecto para camping o como respaldo en la cocina.", destacado: true }
];

/* Cuentas iniciales para poder probar el panel administrador sin
   quedar bloqueados: un Administrador y un Vendedor de ejemplo. */
const USUARIOS_INICIALES = [
  {
    id: "seed-admin-001", run: "190110222", nombre: "Marcela", apellidos: "Soto Ibáñez",
    correo: "administradora@duoc.cl", password: "QWRtaW4xMjM=", telefono: "",
    fechaNacimiento: "", tipoUsuario: "Administrador", region: "Ñuble", comuna: "Chillán",
    direccion: "Camino a Confluencia 450, Chillán", intentosFallidos: 0, bloqueado: false
  },
  {
    id: "seed-vendedor-001", run: "179542609", nombre: "Operadora", apellidos: "Turno Día",
    correo: "vendedor@duoc.cl", password: "VmVuZGUxMjM=", telefono: "",
    fechaNacimiento: "", tipoUsuario: "Vendedor", region: "Ñuble", comuna: "Chillán",
    direccion: "Camino a Confluencia 450, Chillán", intentosFallidos: 0, bloqueado: false
  }
];

/* Datos iniciales de la sección Blogs: noticias o datos curiosos
   de la tienda. */
const BLOGS_INICIALES = [
  {
    id: 1,
    titulo: "Caso curioso #1: ¿Por qué el gas licuado tiene olor?",
    imagen: "https://placehold.co/600x400/0b5fa5/ffffff?text=Caso+Curioso+1",
    descripcionCorta: "El gas licuado es en realidad inodoro. Te contamos por qué siempre lo sientes con ese olor tan particular.",
    descripcionLarga: "El gas licuado de petróleo (GLP) que distribuimos es, en su estado natural, completamente inodoro. Por seguridad, se le agrega un compuesto llamado mercaptano, cuyo olor característico permite detectar una fuga incluso en concentraciones muy bajas en el aire. Este simple pero importante proceso ha salvado innumerables vidas desde que se implementó como estándar en la industria del gas. En Gas El Volcán, cada cilindro que despachamos pasa por un control de calidad que incluye la verificación de este aditivo odorizante."
  },
  {
    id: 2,
    titulo: "Caso curioso #2: ¿Cuánto dura un cilindro de 11 kg?",
    imagen: "https://placehold.co/600x400/f7931e/1a1a1a?text=Caso+Curioso+2",
    descripcionCorta: "Es la pregunta que más nos hacen nuestros clientes de Chillán. La respuesta depende de tu consumo diario.",
    descripcionLarga: "Un cilindro de 11 kg usado solo para cocinar puede durar entre 6 y 8 semanas en un hogar de 4 personas con uso moderado. Si además calienta agua mediante un calefont a gas, la duración baja a entre 3 y 4 semanas. Factores como la temperatura ambiente, la frecuencia de uso de la cocina y el estado del regulador también influyen en el consumo real. Por eso, en Gas El Volcán recomendamos revisar periódicamente tus accesorios y mantener siempre un cilindro de respaldo, especialmente en los meses de invierno en la Región de Ñuble."
  }
];

/* Crea los registros iniciales si aún no existen. Se llama al
   comienzo de cada página. */
function inicializarDatos() {
  if (localStorage.getItem(CLAVE_PRODUCTOS) === null) {
    guardarProductos(PRODUCTOS_INICIALES);
  }
  if (localStorage.getItem(CLAVE_USUARIOS) === null) {
    guardarUsuarios(USUARIOS_INICIALES);
  }
  if (localStorage.getItem(CLAVE_CARRITO) === null) {
    guardarCarrito([]);
  }
  if (localStorage.getItem(CLAVE_CONSULTAS) === null) {
    localStorage.setItem(CLAVE_CONSULTAS, JSON.stringify([]));
  }
  if (localStorage.getItem(CLAVE_PEDIDOS) === null) {
    localStorage.setItem(CLAVE_PEDIDOS, JSON.stringify([]));
  }
  if (localStorage.getItem(CLAVE_BLOGS) === null) {
    localStorage.setItem(CLAVE_BLOGS, JSON.stringify(BLOGS_INICIALES));
  }
}

/* ---------- Productos ---------- */
function obtenerProductos() {
  const datos = localStorage.getItem(CLAVE_PRODUCTOS);
  if (datos === null) return [];
  return JSON.parse(datos);
}
function guardarProductos(productos) {
  localStorage.setItem(CLAVE_PRODUCTOS, JSON.stringify(productos));
}
function buscarProductoPorId(id) {
  const productos = obtenerProductos();
  return productos.find(function (producto) {
    return producto.id === Number(id);
  });
}
function actualizarStockProducto(id, nuevoStock) {
  const productos = obtenerProductos();
  const producto = productos.find(function (p) { return p.id === Number(id); });
  if (producto) {
    producto.stock = nuevoStock;
    guardarProductos(productos);
  }
}
function agregarProducto(producto) {
  const productos = obtenerProductos();
  producto.id = productos.length > 0 ? Math.max.apply(null, productos.map(function (p) { return p.id; })) + 1 : 1;
  productos.push(producto);
  guardarProductos(productos);
  return producto;
}
function actualizarProducto(productoActualizado) {
  const productos = obtenerProductos();
  const indice = productos.findIndex(function (p) { return p.id === productoActualizado.id; });
  if (indice !== -1) {
    productos[indice] = productoActualizado;
    guardarProductos(productos);
  }
}
function eliminarProducto(id) {
  const productos = obtenerProductos().filter(function (p) { return p.id !== Number(id); });
  guardarProductos(productos);
}

/* ---------- Usuarios ---------- */
function obtenerUsuarios() {
  const datos = localStorage.getItem(CLAVE_USUARIOS);
  if (datos === null) return [];
  return JSON.parse(datos);
}
function guardarUsuarios(usuarios) {
  localStorage.setItem(CLAVE_USUARIOS, JSON.stringify(usuarios));
}
function buscarUsuarioPorId(id) {
  return obtenerUsuarios().find(function (u) { return u.id === id; });
}
function buscarUsuarioPorCorreo(correo) {
  return obtenerUsuarios().find(function (usuario) {
    return usuario.correo.toLowerCase() === correo.toLowerCase();
  });
}
function buscarUsuarioPorRun(run) {
  return obtenerUsuarios().find(function (usuario) { return usuario.run === run; });
}
function agregarUsuario(usuario) {
  const usuarios = obtenerUsuarios();
  usuario.id = crypto.randomUUID();
  usuario.intentosFallidos = 0;
  usuario.bloqueado = false;
  usuarios.push(usuario);
  guardarUsuarios(usuarios);
  return usuario;
}
function actualizarUsuario(usuarioActualizado) {
  const usuarios = obtenerUsuarios();
  const indice = usuarios.findIndex(function (u) { return u.id === usuarioActualizado.id; });
  if (indice !== -1) {
    usuarios[indice] = usuarioActualizado;
    guardarUsuarios(usuarios);
  }
}
function eliminarUsuario(id) {
  const usuarios = obtenerUsuarios().filter(function (u) { return u.id !== id; });
  guardarUsuarios(usuarios);
}

/* Codificación simple para no dejar la contraseña en texto plano.
   No reemplaza un hash real de backend (fuera de alcance sin servidor). */
function codificarClave(clave) {
  return btoa(unescape(encodeURIComponent(clave)));
}

/* ---------- Carrito ---------- */
function obtenerCarrito() {
  const datos = localStorage.getItem(CLAVE_CARRITO);
  if (datos === null) return [];
  return JSON.parse(datos);
}
function guardarCarrito(carrito) {
  localStorage.setItem(CLAVE_CARRITO, JSON.stringify(carrito));
}
function obtenerCantidadTotalCarrito() {
  return obtenerCarrito().reduce(function (total, item) { return total + item.cantidad; }, 0);
}

/* ---------- Sesión ---------- */
function obtenerSesion() {
  const datos = localStorage.getItem(CLAVE_SESION);
  if (datos === null) return null;
  return JSON.parse(datos);
}
function guardarSesion(sesion) {
  localStorage.setItem(CLAVE_SESION, JSON.stringify(sesion));
}
function cerrarSesion() {
  localStorage.removeItem(CLAVE_SESION);
}

/* ---------- Consultas de contacto ---------- */
function agregarConsulta(consulta) {
  const consultas = JSON.parse(localStorage.getItem(CLAVE_CONSULTAS)) || [];
  consulta.id = crypto.randomUUID();
  consulta.fecha = new Date().toISOString();
  consultas.push(consulta);
  localStorage.setItem(CLAVE_CONSULTAS, JSON.stringify(consultas));
}

/* ---------- Pedidos (órdenes) ---------- */
function obtenerPedidos() {
  const datos = localStorage.getItem(CLAVE_PEDIDOS);
  if (datos === null) return [];
  return JSON.parse(datos);
}
function guardarPedidos(pedidos) {
  localStorage.setItem(CLAVE_PEDIDOS, JSON.stringify(pedidos));
}
function agregarPedido(pedido) {
  const pedidos = obtenerPedidos();
  pedido.id = pedidos.length > 0 ? Math.max.apply(null, pedidos.map(function (p) { return p.id; })) + 1 : 1;
  pedido.fecha = new Date().toISOString();
  pedidos.push(pedido);
  guardarPedidos(pedidos);
  return pedido;
}
function buscarPedidoPorId(id) {
  return obtenerPedidos().find(function (p) { return p.id === Number(id); });
}

/* ---------- Blogs ---------- */
function obtenerBlogs() {
  const datos = localStorage.getItem(CLAVE_BLOGS);
  if (datos === null) return [];
  return JSON.parse(datos);
}
function buscarBlogPorId(id) {
  return obtenerBlogs().find(function (b) { return b.id === Number(id); });
}

/* ---------- Utilidades ---------- */
function formatearPrecio(valor) {
  return new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "CLP",
    minimumFractionDigits: 0
  }).format(valor);
}
