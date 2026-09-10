/* ============================================================
   producto.js
   Vista de detalle. El id del producto llega por LocalStorage
   (guardado por abrirDetalleProducto en renderizado.js), igual
   al patrón "mascotaSeleccionada" visto en clases.
   ============================================================ */

let cantidadSeleccionada = 1;

function mostrarProductoNoEncontrado() {
  document.getElementById("detalle-contenido").classList.add("d-none");
  document.getElementById("producto-no-encontrado").classList.remove("d-none");
}

function renderizarDetalle() {
  const idSeleccionado = localStorage.getItem(CLAVE_PRODUCTO_SELECCIONADO);

  if (idSeleccionado === null) {
    mostrarProductoNoEncontrado();
    return;
  }

  const producto = buscarProductoPorId(idSeleccionado);
  if (producto === undefined) {
    mostrarProductoNoEncontrado();
    return;
  }

  document.title = producto.nombre + " · Gas El Volcán";
  const sinStock = producto.stock <= 0;
  const tieneOferta = !!producto.precioOferta;

  document.getElementById("detalle-imagen").src = producto.imagen;
  document.getElementById("detalle-imagen").alt = producto.nombre;
  document.getElementById("detalle-categoria").textContent = producto.categoria;
  document.getElementById("detalle-nombre").textContent = producto.nombre;
  document.getElementById("detalle-precio").textContent = formatearPrecio(producto.precio);
  document.getElementById("detalle-descripcion").textContent = producto.descripcion;

  const precioAnterior = document.getElementById("detalle-precio-anterior");
  if (tieneOferta) {
    precioAnterior.textContent = formatearPrecio(producto.precioOferta);
    precioAnterior.classList.remove("d-none");
  } else {
    precioAnterior.classList.add("d-none");
  }

  const stockTexto = document.getElementById("detalle-stock");
  stockTexto.textContent = sinStock ? "Sin stock disponible" : "Stock disponible: " + producto.stock + " unidades";
  stockTexto.className = sinStock ? "fw-semibold text-danger" : "text-secondary";

  const selector = document.getElementById("selector-cantidad");
  const botonAgregar = document.getElementById("btn-agregar-detalle");

  if (sinStock) {
    selector.classList.add("d-none");
    botonAgregar.disabled = true;
    botonAgregar.textContent = "Sin stock";
  } else {
    selector.classList.remove("d-none");
    botonAgregar.disabled = false;
    botonAgregar.textContent = "Agregar al carrito";

    document.getElementById("cantidad-actual").textContent = cantidadSeleccionada;

    document.getElementById("btn-sumar").addEventListener("click", function () {
      if (cantidadSeleccionada < producto.stock) {
        cantidadSeleccionada++;
        document.getElementById("cantidad-actual").textContent = cantidadSeleccionada;
      }
    });
    document.getElementById("btn-restar").addEventListener("click", function () {
      if (cantidadSeleccionada > 1) {
        cantidadSeleccionada--;
        document.getElementById("cantidad-actual").textContent = cantidadSeleccionada;
      }
    });
    botonAgregar.addEventListener("click", function () {
      const resultado = agregarAlCarrito(producto.id, cantidadSeleccionada);
      mostrarAviso(resultado.mensaje, resultado.ok ? "exito" : "error");
      if (resultado.ok) actualizarContadorCarrito();
    });
  }
}

document.addEventListener("DOMContentLoaded", renderizarDetalle);
