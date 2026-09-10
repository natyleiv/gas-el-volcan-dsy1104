/* ============================================================
   catalogo.js
   Renderiza la grilla de productos y aplica los filtros de
   categoría y precio de forma combinada, sin recargar la
   página.
   ============================================================ */

function poblarFiltroCategorias() {
  const select = document.getElementById("filtro-categoria");
  const categorias = obtenerProductos()
    .map(function (p) { return p.categoria; })
    .filter(function (cat, indice, lista) { return lista.indexOf(cat) === indice; })
    .sort();

  categorias.forEach(function (categoria) {
    const opcion = document.createElement("option");
    opcion.value = categoria;
    opcion.textContent = categoria;
    select.appendChild(opcion);
  });
}

function obtenerProductosFiltrados() {
  const categoria = document.getElementById("filtro-categoria").value;
  const precioMin = Number(document.getElementById("filtro-precio-min").value) || 0;
  const precioMaxInput = document.getElementById("filtro-precio-max").value;
  const precioMax = precioMaxInput ? Number(precioMaxInput) : Infinity;

  return obtenerProductos().filter(function (producto) {
    const precioComparado = producto.precioOferta || producto.precio;
    const coincideCategoria = categoria === "todas" || producto.categoria === categoria;
    const coincidePrecio = precioComparado >= precioMin && precioComparado <= precioMax;
    return coincideCategoria && coincidePrecio;
  });
}

function renderizarCatalogo() {
  const contenedor = document.getElementById("grid-catalogo");
  const vacio = document.getElementById("catalogo-vacio");
  const productos = obtenerProductosFiltrados();

  if (productos.length === 0) {
    vaciarContenedor(contenedor);
    vacio.classList.remove("d-none");
    return;
  }

  vacio.classList.add("d-none");
  renderizarListaEnContenedor(contenedor, productos.map(crearCardProducto));
}

document.addEventListener("DOMContentLoaded", function () {
  poblarFiltroCategorias();
  renderizarCatalogo();

  document.getElementById("filtro-categoria").addEventListener("change", renderizarCatalogo);
  document.getElementById("filtro-precio-min").addEventListener("input", renderizarCatalogo);
  document.getElementById("filtro-precio-max").addEventListener("input", renderizarCatalogo);
  document.getElementById("btn-limpiar-filtros").addEventListener("click", function () {
    document.getElementById("filtro-categoria").value = "todas";
    document.getElementById("filtro-precio-min").value = "";
    document.getElementById("filtro-precio-max").value = "";
    renderizarCatalogo();
  });
});
