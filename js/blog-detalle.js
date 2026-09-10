/* ============================================================
   blog-detalle.js
   Igual patrón que producto.js: el id llega por LocalStorage.
   ============================================================ */

function renderizarBlogDetalle() {
  const idSeleccionado = localStorage.getItem(CLAVE_BLOG_SELECCIONADO);
  const blog = idSeleccionado !== null ? buscarBlogPorId(idSeleccionado) : undefined;

  if (blog === undefined) {
    document.getElementById("blog-contenido").classList.add("d-none");
    document.getElementById("blog-no-encontrado").classList.remove("d-none");
    return;
  }

  document.title = blog.titulo + " · Gas El Volcán";
  document.getElementById("blog-imagen").src = blog.imagen;
  document.getElementById("blog-imagen").alt = blog.titulo;
  document.getElementById("blog-titulo").textContent = blog.titulo;
  document.getElementById("blog-descripcion").textContent = blog.descripcionLarga;
}

document.addEventListener("DOMContentLoaded", renderizarBlogDetalle);
