/* ============================================================
   admin-usuarios.js
   Listado (mantenedor) de usuarios. Exclusivo del rol
   Administrador.
   ============================================================ */

function crearFilaUsuarioAdmin(usuario, idPropio) {
  const fila = document.createElement("tr");

  [usuario.run, usuario.nombre + " " + usuario.apellidos, usuario.correo, usuario.tipoUsuario, usuario.region || ""]
    .forEach(function (texto) {
      const celda = document.createElement("td");
      celda.textContent = texto;
      fila.appendChild(celda);
    });

  const celdaAcciones = document.createElement("td");
  celdaAcciones.className = "text-end";

  const botonVer = document.createElement("button");
  botonVer.type = "button";
  botonVer.className = "btn btn-sm btn-outline-secondary me-1";
  botonVer.textContent = "Ver";
  botonVer.addEventListener("click", function () {
    localStorage.setItem(CLAVE_USUARIO_EDITANDO, usuario.id);
    window.location.href = "usuario-mostrar.html";
  });
  celdaAcciones.appendChild(botonVer);

  const botonEditar = document.createElement("button");
  botonEditar.type = "button";
  botonEditar.className = "btn btn-sm btn-outline-primary me-1";
  botonEditar.textContent = "Editar";
  botonEditar.addEventListener("click", function () {
    localStorage.setItem(CLAVE_USUARIO_EDITANDO, usuario.id);
    window.location.href = "usuario-form.html";
  });
  celdaAcciones.appendChild(botonEditar);

  if (usuario.id !== idPropio) {
    const botonEliminar = document.createElement("button");
    botonEliminar.type = "button";
    botonEliminar.className = "btn btn-sm btn-outline-danger";
    botonEliminar.textContent = "Eliminar";
    botonEliminar.addEventListener("click", function () {
      if (window.confirm('¿Eliminar la cuenta de "' + usuario.nombre + '"?')) {
        eliminarUsuario(usuario.id);
        renderizarTablaUsuarios(idPropio);
      }
    });
    celdaAcciones.appendChild(botonEliminar);
  }

  fila.appendChild(celdaAcciones);
  return fila;
}

function renderizarTablaUsuarios(idPropio) {
  const cuerpo = document.getElementById("cuerpo-tabla-usuarios");
  vaciarContenedor(cuerpo);
  obtenerUsuarios().forEach(function (usuario) {
    cuerpo.appendChild(crearFilaUsuarioAdmin(usuario, idPropio));
  });
}

document.addEventListener("DOMContentLoaded", function () {
  const sesion = inicializarAdmin(["Administrador"]);
  if (!sesion) return;

  document.getElementById("btn-nuevo-usuario").addEventListener("click", function () {
    localStorage.removeItem(CLAVE_USUARIO_EDITANDO);
    window.location.href = "usuario-form.html";
  });

  renderizarTablaUsuarios(sesion.id);
});
