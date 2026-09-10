/* ============================================================
   admin-usuario-mostrar.js
   Vista de solo lectura del detalle de un usuario. Exclusiva
   del rol Administrador.
   ============================================================ */

document.addEventListener("DOMContentLoaded", function () {
  const sesion = inicializarAdmin(["Administrador"]);
  if (!sesion) return;

  const idSeleccionado = localStorage.getItem(CLAVE_USUARIO_EDITANDO);
  const usuario = idSeleccionado !== null ? buscarUsuarioPorId(idSeleccionado) : undefined;

  if (usuario === undefined) {
    document.getElementById("usuario-contenido").classList.add("d-none");
    document.getElementById("usuario-no-encontrado").classList.remove("d-none");
    return;
  }

  document.getElementById("mostrar-run").textContent = usuario.run;
  document.getElementById("mostrar-nombre").textContent = usuario.nombre + " " + usuario.apellidos;
  document.getElementById("mostrar-correo").textContent = usuario.correo;
  document.getElementById("mostrar-telefono").textContent = usuario.telefono || "No registrado";
  document.getElementById("mostrar-tipo").textContent = usuario.tipoUsuario;
  document.getElementById("mostrar-fecha-nacimiento").textContent = usuario.fechaNacimiento || "No registrada";
  document.getElementById("mostrar-region-comuna").textContent = (usuario.region || "—") + " / " + (usuario.comuna || "—");
  document.getElementById("mostrar-direccion").textContent = usuario.direccion || "No registrada";
  document.getElementById("mostrar-estado").textContent = usuario.bloqueado ? "Bloqueada" : "Activa";
});
