/* ============================================================
   carrito.js
   Renderiza carrito.html: líneas de producto, cantidad,
   subtotal, cupón de descuento, total y las acciones de
   eliminar, vaciar y pagar. Construido con createElement.
   ============================================================ */

function crearFilaCarrito(linea) {
  const fila = document.createElement("tr");

  const celdaProducto = document.createElement("td");
  const info = document.createElement("div");
  info.className = "d-flex align-items-center gap-3";

  const imagen = document.createElement("img");
  imagen.src = linea.producto.imagen;
  imagen.alt = linea.producto.nombre;
  imagen.className = "carrito-img rounded";

  const textos = document.createElement("div");
  const nombre = document.createElement("div");
  nombre.className = "fw-semibold";
  nombre.textContent = linea.producto.nombre;
  const categoria = document.createElement("div");
  categoria.className = "small text-primary";
  categoria.textContent = linea.producto.categoria;
  textos.appendChild(nombre);
  textos.appendChild(categoria);

  info.appendChild(imagen);
  info.appendChild(textos);
  celdaProducto.appendChild(info);

  const celdaCantidad = document.createElement("td");
  const stepper = document.createElement("div");
  stepper.className = "btn-group";

  const botonRestar = document.createElement("button");
  botonRestar.type = "button";
  botonRestar.className = "btn btn-sm btn-outline-secondary";
  botonRestar.textContent = "−";
  botonRestar.addEventListener("click", function () {
    quitarUnidadDelCarrito(linea.producto.id);
    renderizarCarrito();
    actualizarContadorCarrito();
  });

  const cantidadSpan = document.createElement("span");
  cantidadSpan.className = "btn btn-sm btn-outline-secondary disabled";
  cantidadSpan.textContent = linea.cantidad;

  const botonSumar = document.createElement("button");
  botonSumar.type = "button";
  botonSumar.className = "btn btn-sm btn-outline-secondary";
  botonSumar.textContent = "+";
  botonSumar.addEventListener("click", function () {
    const resultado = agregarAlCarrito(linea.producto.id, 1);
    if (!resultado.ok) mostrarAviso(resultado.mensaje, "error");
    renderizarCarrito();
    actualizarContadorCarrito();
  });

  stepper.appendChild(botonRestar);
  stepper.appendChild(cantidadSpan);
  stepper.appendChild(botonSumar);
  celdaCantidad.appendChild(stepper);

  const celdaPrecio = document.createElement("td");
  celdaPrecio.textContent = formatearPrecio(linea.precioUnitario);

  const celdaSubtotal = document.createElement("td");
  celdaSubtotal.className = "fw-semibold";
  celdaSubtotal.textContent = formatearPrecio(linea.subtotal);

  const celdaEliminar = document.createElement("td");
  const botonEliminar = document.createElement("button");
  botonEliminar.type = "button";
  botonEliminar.className = "btn btn-sm btn-outline-danger";
  botonEliminar.textContent = "Eliminar";
  botonEliminar.addEventListener("click", function () {
    eliminarProductoDelCarrito(linea.producto.id);
    renderizarCarrito();
    actualizarContadorCarrito();
  });
  celdaEliminar.appendChild(botonEliminar);

  fila.appendChild(celdaProducto);
  fila.appendChild(celdaCantidad);
  fila.appendChild(celdaPrecio);
  fila.appendChild(celdaSubtotal);
  fila.appendChild(celdaEliminar);

  return fila;
}

function renderizarCarrito() {
  const detalle = obtenerDetalleCarrito();
  const vacio = document.getElementById("carrito-vacio");
  const lleno = document.getElementById("carrito-lleno");

  if (detalle.length === 0) {
    vacio.classList.remove("d-none");
    lleno.classList.add("d-none");
    return;
  }

  vacio.classList.add("d-none");
  lleno.classList.remove("d-none");

  const cuerpoTabla = document.getElementById("cuerpo-tabla-carrito");
  vaciarContenedor(cuerpoTabla);
  detalle.forEach(function (linea) {
    cuerpoTabla.appendChild(crearFilaCarrito(linea));
  });

  const subtotal = calcularSubtotalCarrito();
  const descuento = calcularDescuentoCarrito();
  const total = calcularTotalCarrito();
  const cuponActivo = obtenerCuponAplicado();

  document.getElementById("subtotal-carrito").textContent = formatearPrecio(subtotal);
  document.getElementById("total-carrito").textContent = formatearPrecio(total);

  const filaDescuento = document.getElementById("fila-descuento");
  if (descuento > 0) {
    filaDescuento.classList.remove("d-none");
    document.getElementById("descuento-carrito").textContent = "-" + formatearPrecio(descuento);
  } else {
    filaDescuento.classList.add("d-none");
  }

  const infoCupon = document.getElementById("cupon-info");
  if (cuponActivo) {
    infoCupon.textContent = "Cupón activo: " + cuponActivo;
    infoCupon.className = "small text-success mt-1";
  } else {
    infoCupon.textContent = "";
  }
}

function mostrarAlertaCarrito(mensaje, ok) {
  mostrarAlerta("mensaje-carrito", mensaje, ok ? "success" : "danger");
}

function inicializarCarrito() {
  renderizarCarrito();

  document.getElementById("btn-vaciar-carrito").addEventListener("click", function () {
    vaciarCarrito();
    renderizarCarrito();
    actualizarContadorCarrito();
  });

  document.getElementById("btn-aplicar-cupon").addEventListener("click", function () {
    const codigo = document.getElementById("input-cupon").value;
    const resultado = aplicarCupon(codigo);
    if (!resultado.ok) {
      mostrarAviso(resultado.mensaje, "error");
    } else {
      mostrarAviso(resultado.mensaje, "exito");
    }
    renderizarCarrito();
  });

  document.getElementById("btn-finalizar-compra").addEventListener("click", function () {
    const resultado = finalizarCompra();
    mostrarAlertaCarrito(resultado.mensaje, resultado.ok);

    if (resultado.ok) {
      actualizarContadorCarrito();
      document.getElementById("input-cupon").value = "";
      setTimeout(function () {
        window.location.href = "index.html";
      }, 1800);
    } else {
      renderizarCarrito();
    }
  });
}

document.addEventListener("DOMContentLoaded", inicializarCarrito);
