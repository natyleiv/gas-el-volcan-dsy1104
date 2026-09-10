/* ============================================================
   registro.js
   Formulario de registro de clientes y sus reglas de negocio
   (Anexo 1: RUN, Nombre, Apellidos, Correo, Contraseña,
   Fecha de nacimiento opcional, Región y Comuna, Dirección).
   El tipo de usuario creado aquí siempre es "Cliente"; el tipo
   Administrador/Vendedor solo se asigna desde el panel admin.
   ============================================================ */

const CAMPOS_REGISTRO = [
  "run", "nombre", "apellidos", "correo", "fecha-nacimiento",
  "password", "confirmar-password", "direccion", "region", "comuna"
];

function inicializarRegistro() {
  const repoblarComunas = encadenarRegionComuna("region", "comuna");

  const form = document.getElementById("form-registro");

  form.addEventListener("submit", function (evento) {
    evento.preventDefault();
    limpiarValidaciones(CAMPOS_REGISTRO);
    document.getElementById("terminos").classList.remove("is-invalid");
    ocultarAlerta("mensaje-registro");

    const datos = {
      run: document.getElementById("run").value.trim().toUpperCase(),
      telefono: document.getElementById("telefono").value.trim(),
      nombre: document.getElementById("nombre").value.trim(),
      apellidos: document.getElementById("apellidos").value.trim(),
      correo: document.getElementById("correo").value.trim(),
      fechaNacimiento: document.getElementById("fecha-nacimiento").value,
      password: document.getElementById("password").value,
      confirmarPassword: document.getElementById("confirmar-password").value,
      region: document.getElementById("region").value,
      comuna: document.getElementById("comuna").value,
      direccion: document.getElementById("direccion").value.trim(),
      terminos: document.getElementById("terminos").checked
    };

    let esValido = true;

    if (!validarRun(datos.run)) {
      marcarCampoInvalido("run", "Ingresa un RUN válido, sin puntos ni guion (7 a 9 caracteres, ej: 19011022K).");
      esValido = false;
    } else if (buscarUsuarioPorRun(datos.run)) {
      marcarCampoInvalido("run", "Ya existe una cuenta registrada con este RUN.");
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
    if (!validarCorreo(datos.correo, REGLAS.DOMINIOS_REGISTRO)) {
      marcarCampoInvalido("correo", "Para registrarte debes usar tu correo institucional @duoc.cl (máx. 100 caracteres).");
      esValido = false;
    } else if (buscarUsuarioPorCorreo(datos.correo)) {
      marcarCampoInvalido("correo", "Ya existe una cuenta registrada con este correo.");
      esValido = false;
    }
    if (!datos.fechaNacimiento) {
      marcarCampoInvalido("fecha-nacimiento", "Debes indicar tu fecha de nacimiento.");
      esValido = false;
    } else if (calcularEdad(datos.fechaNacimiento) < REGLAS.EDAD_MINIMA_REGISTRO) {
      marcarCampoInvalido("fecha-nacimiento", "Debes tener al menos " + REGLAS.EDAD_MINIMA_REGISTRO + " años para registrarte.");
      esValido = false;
    }
    if (!validarPassword(datos.password)) {
      marcarCampoInvalido("password", "La contraseña debe tener entre 4 y 10 caracteres.");
      esValido = false;
    }
    if (!datos.confirmarPassword || datos.confirmarPassword !== datos.password) {
      marcarCampoInvalido("confirmar-password", "Las contraseñas no coinciden.");
      esValido = false;
    }
    if (!datos.region) {
      marcarCampoInvalido("region", "Selecciona tu región.");
      esValido = false;
    }
    if (!datos.comuna) {
      marcarCampoInvalido("comuna", "Selecciona tu comuna.");
      esValido = false;
    }
    if (!datos.direccion || datos.direccion.length > 300) {
      marcarCampoInvalido("direccion", "La dirección es obligatoria (máximo 300 caracteres).");
      esValido = false;
    }
    if (!datos.terminos) {
      document.getElementById("terminos").classList.add("is-invalid");
      esValido = false;
    }

    if (!esValido) {
      mostrarAlerta("mensaje-registro", "Revisa los campos marcados en rojo antes de continuar.", "danger");
      return;
    }

    agregarUsuario({
      run: datos.run,
      telefono: datos.telefono,
      nombre: datos.nombre,
      apellidos: datos.apellidos,
      correo: datos.correo,
      fechaNacimiento: datos.fechaNacimiento,
      password: codificarClave(datos.password),
      region: datos.region,
      comuna: datos.comuna,
      direccion: datos.direccion,
      tipoUsuario: "Cliente",
      aceptaTerminos: datos.terminos
    });

    mostrarAlerta("mensaje-registro", "¡Cuenta creada con éxito! Redirigiendo al inicio de sesión...", "success");
    form.reset();
    document.getElementById("comuna").disabled = true;

    setTimeout(function () {
      window.location.href = "login.html";
    }, 1600);
  });
}

document.addEventListener("DOMContentLoaded", inicializarRegistro);
