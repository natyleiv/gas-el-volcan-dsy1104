/* ============================================================
   login.js
   Inicio de sesión y bloqueo tras 3 intentos fallidos
   consecutivos. Tras autenticar, redirige según el tipo de
   usuario: Administrador/Vendedor va al panel interno,
   Cliente va a la tienda.
   ============================================================ */

function inicializarLogin() {
  const form = document.getElementById("form-login");

  form.addEventListener("submit", function (evento) {
    evento.preventDefault();
    limpiarValidaciones(["login-correo", "login-password"]);
    ocultarAlerta("mensaje-login");

    const correo = document.getElementById("login-correo").value.trim();
    const password = document.getElementById("login-password").value;

    const usuario = buscarUsuarioPorCorreo(correo);

    if (!usuario) {
      mostrarAlerta("mensaje-login", "Correo o contraseña incorrectos.", "danger");
      return;
    }

    if (usuario.bloqueado) {
      mostrarAlerta("mensaje-login", "Esta cuenta está bloqueada por demasiados intentos fallidos. Contacta al administrador de la tienda.", "danger");
      return;
    }

    if (codificarClave(password) !== usuario.password) {
      usuario.intentosFallidos += 1;

      if (usuario.intentosFallidos >= REGLAS.MAX_INTENTOS_LOGIN) {
        usuario.bloqueado = true;
        actualizarUsuario(usuario);
        mostrarAlerta("mensaje-login", "Cuenta bloqueada tras 3 intentos fallidos consecutivos.", "danger");
      } else {
        actualizarUsuario(usuario);
        const restantes = REGLAS.MAX_INTENTOS_LOGIN - usuario.intentosFallidos;
        mostrarAlerta("mensaje-login", "Correo o contraseña incorrectos. Te quedan " + restantes + " intento(s).", "danger");
      }
      return;
    }

    usuario.intentosFallidos = 0;
    actualizarUsuario(usuario);
    guardarSesion({
      id: usuario.id,
      nombre: usuario.nombre,
      correo: usuario.correo,
      tipoUsuario: usuario.tipoUsuario
    });

    mostrarAlerta("mensaje-login", "¡Bienvenido/a de nuevo! Redirigiendo...", "success");

    const destino = (usuario.tipoUsuario === "Administrador" || usuario.tipoUsuario === "Vendedor")
      ? "admin/index.html"
      : "index.html";

    setTimeout(function () {
      window.location.href = destino;
    }, 1000);
  });
}

document.addEventListener("DOMContentLoaded", inicializarLogin);
