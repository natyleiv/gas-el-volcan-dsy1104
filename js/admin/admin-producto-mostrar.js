/* ============================================================
   admin-producto-mostrar.js
   Vista de solo lectura del detalle de un producto, accesible
   para Administrador y Vendedor. El botón "Editar" solo se
   muestra al Administrador.
   ============================================================ */

document.addEventListener("DOMContentLoaded", function () {
  const sesion = inicializarAdmin(["Administrador", "Vendedor"]);
  if (!sesion) return;

  const idSeleccionado = localStorage.getItem(CLAVE_PRODUCTO_SELECCIONADO);
  const producto = idSeleccionado !== null ? buscarProductoPorId(idSeleccionado) : undefined;

  if (producto === undefined) {
    document.getElementById("producto-contenido").classList.add("d-none");
    document.getElementById("producto-no-encontrado").classList.remove("d-none");
    return;
  }

  document.getElementById("mostrar-imagen").src = producto.imagen;
  document.getElementById("mostrar-imagen").alt = producto.nombre;
  document.getElementById("mostrar-codigo").textContent = producto.codigo;
  document.getElementById("mostrar-nombre").textContent = producto.nombre;
  document.getElementById("mostrar-categoria").textContent = producto.categoria;
  document.getElementById("mostrar-precio").textContent = formatearPrecio(producto.precio);
  document.getElementById("mostrar-stock").textContent = producto.stock;
  document.getElementById("mostrar-stock-critico").textContent =
    (producto.stockCritico !== undefined && producto.stockCritico !== null) ? producto.stockCritico : "No definido";
  document.getElementById("mostrar-descripcion").textContent = producto.descripcion || "Sin descripción.";

  const linkEditar = document.getElementById("link-editar");
  if (sesion.tipoUsuario === "Administrador") {
    linkEditar.addEventListener("click", function (evento) {
      evento.preventDefault();
      window.location.href = "producto-form.html";
    });
  } else {
    linkEditar.remove();
  }
});
