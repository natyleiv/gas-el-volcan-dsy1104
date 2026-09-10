/* ============================================================
   ui.js
   Comportamiento común a todas las páginas: contador del
   carrito, enlace activo, estado de sesión y el aviso flotante
   ("toast" simple con clases de Bootstrap) para confirmaciones
   rápidas como "producto agregado al carrito".
   ============================================================ */

function actualizarContadorCarrito() {
  const contador = document.getElementById("contador-carrito");
  if (contador) {
    contador.textContent = obtenerCantidadTotalCarrito();
  }
}

function marcarEnlaceActivo() {
  const pagina = window.location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".navbar-nav .nav-link").forEach(function (enlace) {
    if (enlace.getAttribute("href") === pagina) {
      enlace.classList.add("active");
      enlace.setAttribute("aria-current", "page");
    }
  });
}

function actualizarEstadoSesion() {
  const sesion = obtenerSesion();
  const zona = document.getElementById("zona-sesion");
  if (!zona) return;

  if (sesion) {
    zona.innerHTML = "";

    const saludo = document.createElement("span");
    saludo.className = "navbar-text me-3 text-white-50";
    saludo.textContent = "Hola, " + sesion.nombre;

    const boton = document.createElement("button");
    boton.type = "button";
    boton.className = "btn btn-outline-light btn-sm";
    boton.textContent = "Cerrar sesión";
    boton.addEventListener("click", function () {
      cerrarSesion();
      window.location.href = "index.html";
    });

    zona.appendChild(saludo);
    zona.appendChild(boton);
  } else {
    zona.innerHTML = "";

    const enlaceLogin = document.createElement("a");
    enlaceLogin.href = "login.html";
    enlaceLogin.className = "btn btn-outline-light btn-sm me-2";
    enlaceLogin.textContent = "Iniciar sesión";

    const enlaceRegistro = document.createElement("a");
    enlaceRegistro.href = "registro.html";
    enlaceRegistro.className = "btn btn-flame btn-sm";
    enlaceRegistro.textContent = "Registrarse";

    zona.appendChild(enlaceLogin);
    zona.appendChild(enlaceRegistro);
  }
}

/* Aviso flotante reutilizable en la esquina inferior derecha,
   construido con clases de alerta de Bootstrap (mismo patrón
   classList.add/remove visto en clases, sin usar el componente
   JS Toast). */
function mostrarAviso(mensaje, tipo) {
  const contenedor = document.getElementById("aviso-flotante");
  if (!contenedor) return;

  contenedor.textContent = mensaje;
  contenedor.classList.remove("d-none", "alert-success", "alert-danger");
  contenedor.classList.add("alert-" + (tipo === "error" ? "danger" : "success"));

  clearTimeout(contenedor._temporizador);
  contenedor._temporizador = setTimeout(function () {
    contenedor.classList.add("d-none");
  }, 3200);
}

function inicializarLayoutComun() {
  inicializarDatos();
  actualizarContadorCarrito();
  marcarEnlaceActivo();
  actualizarEstadoSesion();

  const anioFooter = document.getElementById("anio-actual");
  if (anioFooter) {
    anioFooter.textContent = new Date().getFullYear();
  }
}

document.addEventListener("DOMContentLoaded", inicializarLayoutComun);
