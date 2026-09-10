/* ============================================================
   carrito-logica.js
   Reglas de negocio del carrito, compartidas por catalogo.js,
   producto.js, home.js y carrito.js.
   ============================================================ */

const CLAVE_CUPON = "gasvolcan_cupon";

/* Cupones de descuento válidos para esta etapa del proyecto. */
const CUPONES_VALIDOS = {
  "GASVOLCAN10": 0.10,
  "BIENVENIDO5": 0.05
};

/* Agrega unidades de un producto respetando el stock disponible.
   Si el producto ya estaba en el carrito, actualiza su cantidad
   en vez de generar una línea duplicada. */
function agregarAlCarrito(idProducto, cantidadAAgregar) {
  cantidadAAgregar = cantidadAAgregar || 1;
  const producto = buscarProductoPorId(idProducto);
  if (!producto) {
    return { ok: false, mensaje: "El producto no existe." };
  }

  const carrito = obtenerCarrito();
  const linea = carrito.find(function (item) { return item.productId === producto.id; });
  const cantidadActual = linea ? linea.cantidad : 0;
  const cantidadFinal = cantidadActual + cantidadAAgregar;

  if (producto.stock <= 0) {
    return { ok: false, mensaje: '"' + producto.nombre + '" no tiene stock disponible.' };
  }
  if (cantidadFinal > producto.stock) {
    return { ok: false, mensaje: "Solo quedan " + producto.stock + " unidades de \"" + producto.nombre + "\"." };
  }

  if (linea) {
    linea.cantidad = cantidadFinal;
  } else {
    carrito.push({ productId: producto.id, cantidad: cantidadAAgregar });
  }

  guardarCarrito(carrito);
  return { ok: true, mensaje: '"' + producto.nombre + '" se agregó al carrito.' };
}

function quitarUnidadDelCarrito(idProducto) {
  let carrito = obtenerCarrito();
  const linea = carrito.find(function (item) { return item.productId === Number(idProducto); });
  if (!linea) return;

  linea.cantidad -= 1;
  if (linea.cantidad <= 0) {
    carrito = carrito.filter(function (item) { return item.productId !== Number(idProducto); });
  }
  guardarCarrito(carrito);
}

function eliminarProductoDelCarrito(idProducto) {
  const carrito = obtenerCarrito().filter(function (item) {
    return item.productId !== Number(idProducto);
  });
  guardarCarrito(carrito);
}

function vaciarCarrito() {
  guardarCarrito([]);
  localStorage.removeItem(CLAVE_CUPON);
}

function obtenerDetalleCarrito() {
  return obtenerCarrito()
    .map(function (item) {
      const producto = buscarProductoPorId(item.productId);
      if (!producto) return null;
      const precioUnitario = producto.precioOferta || producto.precio;
      return {
        producto: producto,
        cantidad: item.cantidad,
        precioUnitario: precioUnitario,
        subtotal: precioUnitario * item.cantidad
      };
    })
    .filter(function (linea) { return linea !== null; });
}

function calcularSubtotalCarrito() {
  return obtenerDetalleCarrito().reduce(function (total, linea) { return total + linea.subtotal; }, 0);
}

/* ---------- Cupón de descuento ---------- */
function obtenerCuponAplicado() {
  return localStorage.getItem(CLAVE_CUPON);
}

function aplicarCupon(codigo) {
  const codigoNormalizado = (codigo || "").trim().toUpperCase();
  if (!codigoNormalizado) {
    return { ok: false, mensaje: "Ingresa un código de cupón." };
  }
  if (!CUPONES_VALIDOS.hasOwnProperty(codigoNormalizado)) {
    return { ok: false, mensaje: "El cupón ingresado no es válido." };
  }
  localStorage.setItem(CLAVE_CUPON, codigoNormalizado);
  const porcentaje = CUPONES_VALIDOS[codigoNormalizado] * 100;
  return { ok: true, mensaje: "Cupón aplicado: " + porcentaje + "% de descuento." };
}

function quitarCupon() {
  localStorage.removeItem(CLAVE_CUPON);
}

function calcularDescuentoCarrito() {
  const cupon = obtenerCuponAplicado();
  if (!cupon || !CUPONES_VALIDOS.hasOwnProperty(cupon)) return 0;
  return calcularSubtotalCarrito() * CUPONES_VALIDOS[cupon];
}

function calcularTotalCarrito() {
  return Math.max(0, calcularSubtotalCarrito() - calcularDescuentoCarrito());
}

/* Valida stock, descuenta existencias, registra el pedido (orden)
   para el panel administrador y vacía el carrito. */
function finalizarCompra() {
  const detalle = obtenerDetalleCarrito();
  if (detalle.length === 0) {
    return { ok: false, mensaje: "Tu carrito está vacío." };
  }

  for (let i = 0; i < detalle.length; i++) {
    const productoActual = buscarProductoPorId(detalle[i].producto.id);
    if (!productoActual || productoActual.stock < detalle[i].cantidad) {
      return { ok: false, mensaje: 'No hay stock suficiente de "' + detalle[i].producto.nombre + '" para completar el pedido.' };
    }
  }

  const sesion = typeof obtenerSesion === "function" ? obtenerSesion() : null;
  const subtotal = calcularSubtotalCarrito();
  const descuento = calcularDescuentoCarrito();
  const total = calcularTotalCarrito();
  const cupon = obtenerCuponAplicado();

  detalle.forEach(function (linea) {
    const productoActual = buscarProductoPorId(linea.producto.id);
    actualizarStockProducto(productoActual.id, productoActual.stock - linea.cantidad);
  });

  agregarPedido({
    cliente: sesion ? sesion.nombre : "Invitado",
    correoCliente: sesion ? sesion.correo : "",
    items: detalle.map(function (linea) {
      return {
        productoId: linea.producto.id,
        nombre: linea.producto.nombre,
        cantidad: linea.cantidad,
        precioUnitario: linea.precioUnitario,
        subtotal: linea.subtotal
      };
    }),
    cupon: cupon || null,
    subtotal: subtotal,
    descuento: descuento,
    total: total,
    estado: "Confirmado"
  });

  vaciarCarrito();
  return { ok: true, mensaje: "¡Pedido confirmado con éxito! Gracias por preferir Gas El Volcán." };
}
