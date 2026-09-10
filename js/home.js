/* ============================================================
   home.js
   Lógica exclusiva de index.html: lista de productos en la
   página principal.
   ============================================================ */

function renderizarDestacados() {
  const contenedor = document.getElementById("hero-destacados");
  if (!contenedor) return;

  const productos = obtenerProductos().slice(0, 8);
  const nodos = productos.map(crearCardProducto);
  renderizarListaEnContenedor(contenedor, nodos);
}

document.addEventListener("DOMContentLoaded", renderizarDestacados);
