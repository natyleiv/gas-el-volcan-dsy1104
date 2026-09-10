/* ============================================================
   renderizado.js
   Construye las tarjetas (cards) de producto con
   document.createElement, tal como se vio en clases, evitando
   innerHTML para no exponer la aplicación a inyección de
   código (XSS) si en el futuro los datos vinieran de un
   formulario o de un backend.
   ============================================================ */

/* Crea el nodo <div class="col..."> con la card de un producto
   y devuelve el elemento (no un string) para insertarlo con
   appendChild. */
function crearCardProducto(producto) {
  const sinStock = producto.stock <= 0;
  const tieneOferta = !!producto.precioOferta;

  const columna = document.createElement("div");
  columna.className = "col-sm-6 col-lg-4 col-xl-3";

  const card = document.createElement("article");
  card.className = "card producto-card h-100 border-0 shadow-sm";
  card.style.cursor = "pointer";
  card.tabIndex = 0;

  /* --- Imagen + badges --- */
  const wrapperImagen = document.createElement("div");
  wrapperImagen.className = "producto-img-wrap position-relative";

  const imagen = document.createElement("img");
  imagen.className = "producto-img card-img-top";
  imagen.src = producto.imagen;
  imagen.alt = producto.nombre;
  wrapperImagen.appendChild(imagen);

  if (tieneOferta) {
    const badgeOferta = document.createElement("span");
    badgeOferta.className = "badge bg-flame position-absolute top-0 start-0 m-2";
    badgeOferta.textContent = "Oferta";
    wrapperImagen.appendChild(badgeOferta);
  }
  if (sinStock) {
    const badgeSinStock = document.createElement("span");
    badgeSinStock.className = "badge bg-danger position-absolute top-0 end-0 m-2";
    badgeSinStock.textContent = "Sin stock";
    wrapperImagen.appendChild(badgeSinStock);
  }

  /* --- Cuerpo --- */
  const cuerpo = document.createElement("div");
  cuerpo.className = "card-body d-flex flex-column";

  const categoria = document.createElement("span");
  categoria.className = "badge-categoria";
  categoria.textContent = producto.categoria;

  const nombre = document.createElement("h3");
  nombre.className = "h6 mt-1 mb-2";
  nombre.textContent = producto.nombre;

  const precios = document.createElement("div");
  precios.className = "mb-2";
  const precioActual = document.createElement("span");
  precioActual.className = "producto-precio me-2";
  precioActual.textContent = formatearPrecio(producto.precio);
  precios.appendChild(precioActual);
  if (tieneOferta) {
    const precioAnterior = document.createElement("span");
    precioAnterior.className = "text-muted text-decoration-line-through small";
    precioAnterior.textContent = formatearPrecio(producto.precioOferta);
    precios.appendChild(precioAnterior);
  }

  /* Si queda poco stock (según el stockCritico definido por el
     Administrador) avisamos al cliente, para que decida comprar
     antes de que se agote. */
  const stockBajo = !sinStock && producto.stockCritico != null && producto.stock <= producto.stockCritico;

  const stockTexto = document.createElement("p");
  stockTexto.className = "small mb-3 " + (sinStock ? "text-danger fw-semibold" : stockBajo ? "text-warning-emphasis fw-semibold" : "text-secondary");
  stockTexto.textContent = sinStock
    ? "Sin stock disponible"
    : stockBajo
      ? "¡Últimas " + producto.stock + " unidades!"
      : "Stock: " + producto.stock + " unidades";

  const botonAgregar = document.createElement("button");
  botonAgregar.type = "button";
  botonAgregar.className = "btn btn-flame mt-auto btn-agregar";
  botonAgregar.textContent = sinStock ? "Sin stock" : "Agregar al carrito";
  botonAgregar.disabled = sinStock;
  botonAgregar.dataset.id = producto.id;

  cuerpo.appendChild(categoria);
  cuerpo.appendChild(nombre);
  cuerpo.appendChild(precios);
  cuerpo.appendChild(stockTexto);
  cuerpo.appendChild(botonAgregar);

  card.appendChild(wrapperImagen);
  card.appendChild(cuerpo);
  columna.appendChild(card);

  /* Clic en la card completa -> ver detalle (patrón de clases:
     guardar el id seleccionado y navegar). El botón "Agregar"
     detiene la propagación para no disparar también la
     navegación al detalle. */
  card.addEventListener("click", function () {
    abrirDetalleProducto(producto.id);
  });
  botonAgregar.addEventListener("click", function (evento) {
    evento.stopPropagation();
    const resultado = agregarAlCarrito(producto.id, 1);
    mostrarAviso(resultado.mensaje, resultado.ok ? "exito" : "error");
    if (resultado.ok) actualizarContadorCarrito();
  });

  return columna;
}

/* Guarda el id del producto elegido y navega al detalle,
   siguiendo el mismo patrón de LocalStorage visto en clases
   para pasar datos entre páginas. */
function abrirDetalleProducto(id) {
  localStorage.setItem(CLAVE_PRODUCTO_SELECCIONADO, id);
  window.location.href = "producto.html";
}

/* Vacía un contenedor (sin innerHTML, quitando nodo por nodo) y
   le agrega una lista de nodos creados con createElement. */
function vaciarContenedor(contenedor) {
  while (contenedor.firstChild) {
    contenedor.removeChild(contenedor.firstChild);
  }
}

function renderizarListaEnContenedor(contenedor, nodos) {
  vaciarContenedor(contenedor);
  nodos.forEach(function (nodo) { contenedor.appendChild(nodo); });
}
