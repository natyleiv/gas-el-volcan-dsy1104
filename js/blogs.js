/* ============================================================
   blogs.js
   Lista las publicaciones del blog usando document.createElement
   (mismo criterio anti-innerHTML del resto del sitio) y guarda
   el id seleccionado en LocalStorage antes de ir al detalle.
   ============================================================ */

function abrirDetalleBlog(id) {
  localStorage.setItem(CLAVE_BLOG_SELECCIONADO, id);
  window.location.href = "blog-detalle.html";
}

function crearCardBlog(blog) {
  const columna = document.createElement("div");
  columna.className = "col-md-6";

  const card = document.createElement("article");
  card.className = "card border-0 shadow-sm h-100 flex-md-row";
  card.style.cursor = "pointer";

  const imagen = document.createElement("img");
  imagen.src = blog.imagen;
  imagen.alt = blog.titulo;
  imagen.className = "blog-img";

  const cuerpo = document.createElement("div");
  cuerpo.className = "card-body";

  const titulo = document.createElement("h2");
  titulo.className = "h5";
  titulo.textContent = blog.titulo;

  const descripcion = document.createElement("p");
  descripcion.className = "text-secondary small";
  descripcion.textContent = blog.descripcionCorta;

  const boton = document.createElement("span");
  boton.className = "btn btn-outline-primary btn-sm";
  boton.textContent = "Ver caso";

  cuerpo.appendChild(titulo);
  cuerpo.appendChild(descripcion);
  cuerpo.appendChild(boton);
  card.appendChild(imagen);
  card.appendChild(cuerpo);
  columna.appendChild(card);

  card.addEventListener("click", function () { abrirDetalleBlog(blog.id); });

  return columna;
}

function renderizarBlogs() {
  const contenedor = document.getElementById("lista-blogs");
  if (!contenedor) return;
  const blogs = obtenerBlogs();
  renderizarListaEnContenedor(contenedor, blogs.map(crearCardBlog));
}

document.addEventListener("DOMContentLoaded", renderizarBlogs);
