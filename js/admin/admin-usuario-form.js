/* ============================================================
   admin-usuario-form.js
   Formulario de creación y edición de usuarios (Administrador,
   Vendedor o Cliente). Exclusivo del rol Administrador.
   ============================================================ */

const CAMPOS_USUARIO_ADMIN = [
  "run", "tipo-usuario", "nombre", "apellidos", "correo",
  "password", "confirmar-password", "direccion", "region", "comuna"
];

function poblarTiposUsuario() {
  const select = document.getElementById("tipo-usuario");
  TIPOS_USUARIO.forEach(function (tipo) {
    const opcion = document.createElement("option");
    opcion.value = tipo;
    opcion.textContent = tipo;
    select.appendChild(opcion);
  });
}

document.addEventListener("DOMContentLoaded", function () {
  const sesion = inicializarAdmin(["Administrador"]);
  if (!sesion) return;

  poblarTiposUsuario();
  const repoblarComunas = encadenarRegionComuna("region", "comuna");

  const idEditando = localStorage.getItem(CLAVE_USUARIO_EDITANDO);
  const usuarioExistente = idEditando !== null ? buscarUsuarioPorId(idEditando) : undefined;

  if (usuarioExistente) {
    document.getElementById("titulo-formulario").textContent = "Editar usuario";
    document.getElementById("run").value = usuarioExistente.run;
    document.getElementById("run").disabled = true;
    document.getElementById("tipo-usuario").value = usuarioExistente.tipoUsuario;
    document.getElementById("nombre").value = usuarioExistente.nombre;
    document.getElementById("apellidos").value = usuarioExistente.apellidos;
    document.getElementById("correo").value = usuarioExistente.correo;
    document.getElementById("telefono").value = usuarioExistente.telefono || "";
    document.getElementById("fecha-nacimiento").value = usuarioExistente.fechaNacimiento || "";
    document.getElementById("direccion").value = usuarioExistente.direccion || "";
    document.getElementById("password-ayuda").textContent = "Déjala en blanco para no cambiar la contraseña actual.";
    document.getElementById("password").required = false;

    if (usuarioExistente.region) {
      document.getElementById("region").value = usuarioExistente.region;
      repoblarComunas(usuarioExistente.region, usuarioExistente.comuna);
    }
  }

  const form = document.getElementById("form-usuario");
  form.addEventListener("submit", function (evento) {
    evento.preventDefault();
    limpiarValidaciones(CAMPOS_USUARIO_ADMIN);
    ocultarAlerta("mensaje-usuario");

    const datos = {
      run: document.getElementById("run").value.trim().toUpperCase(),
      tipoUsuario: document.getElementById("tipo-usuario").value,
      nombre: document.getElementById("nombre").value.trim(),
      apellidos: document.getElementById("apellidos").value.trim(),
      correo: document.getElementById("correo").value.trim(),
      telefono: document.getElementById("telefono").value.trim(),
      password: document.getElementById("password").value,
      confirmarPassword: document.getElementById("confirmar-password").value,
      fechaNacimiento: document.getElementById("fecha-nacimiento").value,
      direccion: document.getElementById("direccion").value.trim(),
      region: document.getElementById("region").value,
      comuna: document.getElementById("comuna").value
    };

    let esValido = true;

    if (!validarRun(datos.run)) {
      marcarCampoInvalido("run", "Ingresa un RUN válido, sin puntos ni guion (7 a 9 caracteres).");
      esValido = false;
    } else {
      const otroConMismoRun = buscarUsuarioPorRun(datos.run);
      if (otroConMismoRun && (!usuarioExistente || otroConMismoRun.id !== usuarioExistente.id)) {
        marcarCampoInvalido("run", "Ya existe una cuenta registrada con este RUN.");
        esValido = false;
      }
    }
    if (!datos.tipoUsuario) {
      marcarCampoInvalido("tipo-usuario", "Selecciona el tipo de usuario.");
      esValido = false;
    }
    if (!datos.nombre || datos.nombre.length > 50) {
      marcarCampoInvalido("nombre", "El nombre es obligatorio (máximo 50 caracteres).");
      esValido = false;
    }
    if (!datos.apellidos || datos.apellidos.length > 100) {
      marcarCampoInvalido("apellidos", "Los apellidos son obligatorios (máximo 100 caracteres).");
      esValido = false;
    }
    if (!validarCorreo(datos.correo)) {
      marcarCampoInvalido("correo", "Ingresa un correo válido de dominio @duoc.cl, @profesor.duoc.cl o @gmail.com.");
      esValido = false;
    } else {
      const otroConMismoCorreo = buscarUsuarioPorCorreo(datos.correo);
      if (otroConMismoCorreo && (!usuarioExistente || otroConMismoCorreo.id !== usuarioExistente.id)) {
        marcarCampoInvalido("correo", "Ya existe una cuenta registrada con este correo.");
        esValido = false;
      }
    }

    const cambiaPassword = !usuarioExistente || datos.password !== "" || datos.confirmarPassword !== "";
    if (cambiaPassword) {
      if (!validarPassword(datos.password)) {
        marcarCampoInvalido("password", "La contraseña debe tener entre 4 y 10 caracteres.");
        esValido = false;
      }
      if (datos.confirmarPassword !== datos.password) {
        marcarCampoInvalido("confirmar-password", "Las contraseñas no coinciden.");
        esValido = false;
      }
    }

    if (!datos.region) {
      marcarCampoInvalido("region", "Selecciona una región.");
      esValido = false;
    }
    if (!datos.comuna) {
      marcarCampoInvalido("comuna", "Selecciona una comuna.");
      esValido = false;
    }
    if (!datos.direccion || datos.direccion.length > 300) {
      marcarCampoInvalido("direccion", "La dirección es obligatoria (máximo 300 caracteres).");
      esValido = false;
    }

    if (!esValido) {
      mostrarAlerta("mensaje-usuario", "Revisa los campos marcados en rojo antes de continuar.", "danger");
      return;
    }

    if (usuarioExistente) {
      const usuarioActualizado = Object.assign({}, usuarioExistente, {
        tipoUsuario: datos.tipoUsuario,
        nombre: datos.nombre,
        apellidos: datos.apellidos,
        correo: datos.correo,
        telefono: datos.telefono,
        fechaNacimiento: datos.fechaNacimiento,
        direccion: datos.direccion,
        region: datos.region,
        comuna: datos.comuna
      });
      if (cambiaPassword) {
        usuarioActualizado.password = codificarClave(datos.password);
      }
      actualizarUsuario(usuarioActualizado);
      mostrarAlerta("mensaje-usuario", "Usuario actualizado con éxito.", "success");
    } else {
      agregarUsuario({
        run: datos.run,
        tipoUsuario: datos.tipoUsuario,
        nombre: datos.nombre,
        apellidos: datos.apellidos,
        correo: datos.correo,
        telefono: datos.telefono,
        password: codificarClave(datos.password),
        fechaNacimiento: datos.fechaNacimiento,
        direccion: datos.direccion,
        region: datos.region,
        comuna: datos.comuna
      });
      mostrarAlerta("mensaje-usuario", "Usuario creado con éxito.", "success");
      form.reset();
    }

    setTimeout(function () {
      window.location.href = "usuarios.html";
    }, 1200);
  });
});
