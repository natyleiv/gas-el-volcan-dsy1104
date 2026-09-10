/* ============================================================
   admin-producto-form.js
   Formulario de creación y edición de productos. Reglas
   (Anexo 1): Código (requerido, texto, min 3, sin max),
   Nombre (requerido, max 100), Descripción (opcional, max 500),
   Precio (requerido, min 0, decimales permitidos, sin max),
   Stock (requerido, min 0, enteros, sin max), Stock crítico
   (opcional, min 0, enteros), Categoría (requerida), Imagen
   (opcional).
   ============================================================ */

const CAMPOS_PRODUCTO = ["codigo", "nombre", "descripcion", "precio", "stock", "stock-critico", "categoria"];

function poblarCategorias() {
  const select = document.getElementById("categoria");
  CATEGORIAS_PRODUCTO.forEach(function (categoria) {
    const opcion = document.createElement("option");
    opcion.value = categoria;
    opcion.textContent = categoria;
    select.appendChild(opcion);
  });
}

function cargarProductoEnFormulario(producto) {
  document.getElementById("titulo-formulario").textContent = "Editar producto";
  document.getElementById("codigo").value = producto.codigo;
  document.getElementById("nombre").value = producto.nombre;
  document.getElementById("descripcion").value = producto.descripcion || "";
  document.getElementById("precio").value = producto.precio;
  document.getElementById("stock").value = producto.stock;
  document.getElementById("stock-critico").value = (producto.stockCritico !== undefined && producto.stockCritico !== null) ? producto.stockCritico : "";
  document.getElementById("categoria").value = producto.categoria;
  document.getElementById("imagen").value = producto.imagen || "";
}

document.addEventListener("DOMContentLoaded", function () {
  const sesion = inicializarAdmin(["Administrador"]);
  if (!sesion) return;

  poblarCategorias();

  const idEditando = localStorage.getItem(CLAVE_PRODUCTO_SELECCIONADO);
  const productoExistente = idEditando !== null ? buscarProductoPorId(idEditando) : undefined;
  if (productoExistente) {
    cargarProductoEnFormulario(productoExistente);
  }

  const form = document.getElementById("form-producto");
  form.addEventListener("submit", function (evento) {
    evento.preventDefault();
    limpiarValidaciones(CAMPOS_PRODUCTO);
    ocultarAlerta("mensaje-producto");

    const codigo = document.getElementById("codigo").value.trim();
    const nombre = document.getElementById("nombre").value.trim();
    const descripcion = document.getElementById("descripcion").value.trim();
    const precioTexto = document.getElementById("precio").value;
    const stockTexto = document.getElementById("stock").value;
    const stockCriticoTexto = document.getElementById("stock-critico").value;
    const categoria = document.getElementById("categoria").value;
    const imagen = document.getElementById("imagen").value.trim();

    let esValido = true;

    if (!codigo || codigo.length < 3) {
      marcarCampoInvalido("codigo", "El código es obligatorio (mínimo 3 caracteres).");
      esValido = false;
    }
    if (!nombre || nombre.length > 100) {
      marcarCampoInvalido("nombre", "El nombre es obligatorio (máximo 100 caracteres).");
      esValido = false;
    }
    if (descripcion.length > 500) {
      marcarCampoInvalido("descripcion", "La descripción admite máximo 500 caracteres.");
      esValido = false;
    }
    const precio = parseFloat(precioTexto);
    if (precioTexto === "" || isNaN(precio) || precio < 0) {
      marcarCampoInvalido("precio", "El precio es obligatorio y no puede ser negativo (0 = producto gratis).");
      esValido = false;
    }
    const stock = parseInt(stockTexto, 10);
    if (stockTexto === "" || isNaN(stock) || stock < 0 || !Number.isInteger(Number(stockTexto))) {
      marcarCampoInvalido("stock", "El stock es obligatorio, debe ser un número entero mayor o igual a 0.");
      esValido = false;
    }
    let stockCritico = null;
    if (stockCriticoTexto !== "") {
      stockCritico = parseInt(stockCriticoTexto, 10);
      if (isNaN(stockCritico) || stockCritico < 0 || !Number.isInteger(Number(stockCriticoTexto))) {
        marcarCampoInvalido("stock-critico", "El stock crítico debe ser un número entero mayor o igual a 0.");
        esValido = false;
      }
    }
    if (!categoria) {
      marcarCampoInvalido("categoria", "Selecciona una categoría.");
      esValido = false;
    }

    if (!esValido) {
      mostrarAlerta("mensaje-producto", "Revisa los campos marcados en rojo antes de continuar.", "danger");
      return;
    }

    const productoGuardado = {
      codigo: codigo,
      nombre: nombre,
      descripcion: descripcion,
      precio: precio,
      precioOferta: productoExistente ? productoExistente.precioOferta : null,
      stock: stock,
      stockCritico: stockCritico,
      categoria: categoria,
      imagen: imagen || "https://placehold.co/500x500/0b5fa5/ffffff?text=" + encodeURIComponent(nombre),
      destacado: productoExistente ? !!productoExistente.destacado : false
    };

    if (productoExistente) {
      productoGuardado.id = productoExistente.id;
      actualizarProducto(productoGuardado);
      mostrarAlerta("mensaje-producto", "Producto actualizado con éxito.", "success");
    } else {
      agregarProducto(productoGuardado);
      mostrarAlerta("mensaje-producto", "Producto creado con éxito.", "success");
      form.reset();
    }

    setTimeout(function () {
      window.location.href = "productos.html";
    }, 1200);
  });
});
