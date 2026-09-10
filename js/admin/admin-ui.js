/* ============================================================
   admin-ui.js
   Layout común del panel administrador: control de acceso por
   sesión/rol, menú lateral dinámico según el perfil del
   usuario y cierre de sesión. Debe cargarse después de
   storage.js y antes del script propio de cada vista.
   ============================================================ */

/* Utilidad de DOM compartida por las vistas de listado del
   panel (Productos, Usuarios): vacía un contenedor quitando
   nodo por nodo, sin usar innerHTML. */
function vaciarContenedor(contenedor) {
  while (contenedor.firstChild) {
    contenedor.removeChild(contenedor.firstChild);
  }
}

const ITEMS_MENU_ADMIN = [
  { href: "index.html", etiqueta: "Inicio", icono: "bi-house-door", roles: ["Administrador", "Vendedor"] },
  { href: "productos.html", etiqueta: "Productos", icono: "bi-box-seam", roles: ["Administrador", "Vendedor"] },
  { href: "usuarios.html", etiqueta: "Usuarios", icono: "bi-people", roles: ["Administrador"] },
  { href: "pedidos.html", etiqueta: "Pedidos", icono: "bi-receipt", roles: ["Administrador", "Vendedor"] }
];

/* Verifica que exista una sesión activa y que su rol esté entre
   los permitidos para la vista actual. Si no cumple, redirige y
   detiene la ejecución del resto del script (devuelve null). */
function verificarSesionAdmin(rolesPermitidos) {
  const sesion = obtenerSesion();

  if (!sesion) {
    window.location.href = "../login.html";
    return null;
  }
  if (rolesPermitidos.indexOf(sesion.tipoUsuario) === -1) {
    window.location.href = sesion.tipoUsuario === "Cliente" ? "../index.html" : "index.html";
    return null;
  }
  return sesion;
}

function construirMenuAdmin(sesion) {
  const nav = document.getElementById("admin-menu");
  if (!nav) return;

  const paginaActual = window.location.pathname.split("/").pop() || "index.html";

  ITEMS_MENU_ADMIN.forEach(function (item) {
    if (item.roles.indexOf(sesion.tipoUsuario) === -1) return;

    const enlace = document.createElement("a");
    enlace.href = item.href;
    enlace.className = "admin-nav-link" + (item.href === paginaActual ? " active" : "");

    const icono = document.createElement("i");
    icono.className = "bi " + item.icono + " me-2";

    enlace.appendChild(icono);
    enlace.appendChild(document.createTextNode(item.etiqueta));
    nav.appendChild(enlace);
  });

  const infoUsuario = document.getElementById("admin-usuario-actual");
  if (infoUsuario) {
    infoUsuario.textContent = sesion.nombre + " · " + sesion.tipoUsuario;
  }

  const botonSalir = document.getElementById("btn-cerrar-sesion-admin");
  if (botonSalir) {
    botonSalir.addEventListener("click", function () {
      cerrarSesion();
      window.location.href = "../login.html";
    });
  }
}

/* Punto de entrada usado por cada página del admin:
   inicializarAdmin(["Administrador"]) o
   inicializarAdmin(["Administrador", "Vendedor"]). Devuelve la
   sesión válida, o null si redirigió por falta de acceso. */
function inicializarAdmin(rolesPermitidos) {
  inicializarDatos();
  const sesion = verificarSesionAdmin(rolesPermitidos);
  if (sesion) {
    construirMenuAdmin(sesion);
  }
  return sesion;
}
