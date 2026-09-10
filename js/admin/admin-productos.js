/* ============================================================
   admin-productos.js
   Listado (mantenedor) de productos. El Vendedor solo puede
   ver el detalle; crear, editar y eliminar son exclusivos del
   Administrador.
   ============================================================ */

function crearFilaProductoAdmin(producto, esAdministrador) {
  const fila = document.createElement("tr");
  const sinStockCritico = typeof producto.stockCritico === "number" && producto.stock <= producto.stockCritico;

  const celdas = [producto.codigo, producto.nombre, producto.categoria, formatearPrecio(producto.precio)];
  celdas.forEach(function (texto) {
    const celda = document.createElement("td");
    celda.textContent = texto;
    fila.appendChild(celda);
  });

  const celdaStock = document.createElement("td");
  celdaStock.textContent = producto.stock;
  if (sinStockCritico) {
    celdaStock.classList.add("stock-critico");
    const icono = document.createElement("i");
    icono.className = "bi bi-exclamation-triangle-fill ms-1";
    icono.title = "Stock igual o menor al stock crítico (" + producto.stockCritico + ")";
    celdaStock.appendChild(icono);
  }
  fila.appendChild(celdaStock);

  const celdaAcciones = document.createElement("td");
  celdaAcciones.className = "text-end";

  const botonVer = document.createElement("button");
  botonVer.type = "button";
  botonVer.className = "btn btn-sm btn-outline-secondary me-1";
  botonVer.textContent = "Ver";
  botonVer.addEventListener("click", function () {
    localStorage.setItem(CLAVE_PRODUCTO_SELECCIONADO, producto.id);
    window.location.href = "producto-mostrar.html";
  });
  celdaAcciones.appendChild(botonVer);

  if (esAdministrador) {
    const botonEditar = document.createElement("button");
    botonEditar.type = "button";
    botonEditar.className = "btn btn-sm btn-outline-primary me-1";
    botonEditar.textContent = "Editar";
    botonEditar.addEventListener("click", function () {
      localStorage.setItem(CLAVE_PRODUCTO_SELECCIONADO, producto.id);
      window.location.href = "producto-form.html";
    });
    celdaAcciones.appendChild(botonEditar);

    const botonEliminar = document.createElement("button");
    botonEliminar.type = "button";
    botonEliminar.className = "btn btn-sm btn-outline-danger";
    botonEliminar.textContent = "Eliminar";
    botonEliminar.addEventListener("click", function () {
      if (window.confirm('¿Eliminar el producto "' + producto.nombre + '"?')) {
        eliminarProducto(producto.id);
        renderizarTablaProductos(esAdministrador);
      }
    });
    celdaAcciones.appendChild(botonEliminar);
  }

  fila.appendChild(celdaAcciones);
  return fila;
}

function renderizarTablaProductos(esAdministrador) {
  const cuerpo = document.getElementById("cuerpo-tabla-productos");
  vaciarContenedor(cuerpo);
  obtenerProductos().forEach(function (producto) {
    cuerpo.appendChild(crearFilaProductoAdmin(producto, esAdministrador));
  });
}

document.addEventListener("DOMContentLoaded", function () {
  const sesion = inicializarAdmin(["Administrador", "Vendedor"]);
  if (!sesion) return;

  const esAdministrador = sesion.tipoUsuario === "Administrador";

  if (esAdministrador) {
    document.getElementById("btn-nuevo-producto").addEventListener("click", function () {
      localStorage.removeItem(CLAVE_PRODUCTO_SELECCIONADO);
      window.location.href = "producto-form.html";
    });
  } else {
    document.getElementById("btn-nuevo-producto").remove();
  }

  renderizarTablaProductos(esAdministrador);
});
