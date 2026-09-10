/* ============================================================
   contacto.js
   Formulario de la página Contacto. Reglas (Anexo 1):
   Nombre requerido (max 100), Correo (max 100, dominio
   permitido), Comentario requerido (max 500).
   ============================================================ */

function inicializarFormularioContacto() {
  const form = document.getElementById("form-contacto");
  if (!form) return;

  const idsCampos = ["contacto-nombre", "contacto-correo", "contacto-mensaje"];

  form.addEventListener("submit", function (evento) {
    evento.preventDefault();
    limpiarValidaciones(idsCampos);
    ocultarAlerta("mensaje-contacto");

    const nombre = document.getElementById("contacto-nombre").value.trim();
    const correo = document.getElementById("contacto-correo").value.trim();
    const mensaje = document.getElementById("contacto-mensaje").value.trim();
    let esValido = true;

    if (!nombre || nombre.length > 100) {
      marcarCampoInvalido("contacto-nombre", "El nombre es obligatorio (máximo 100 caracteres).");
      esValido = false;
    }
    if (correo && !validarCorreo(correo)) {
      marcarCampoInvalido("contacto-correo", "Ingresa un correo válido de dominio @duoc.cl, @profesor.duoc.cl o @gmail.com (máx. 100 caracteres).");
      esValido = false;
    }
    if (!mensaje || mensaje.length > 500) {
      marcarCampoInvalido("contacto-mensaje", "El comentario es obligatorio (máximo 500 caracteres).");
      esValido = false;
    }

    if (!esValido) {
      mostrarAlerta("mensaje-contacto", "Revisa los campos marcados antes de enviar.", "danger");
      return;
    }

    agregarConsulta({ nombre: nombre, correo: correo, mensaje: mensaje });
    form.reset();
    mostrarAlerta("mensaje-contacto", "¡Gracias por tu mensaje! Te responderemos a la brevedad.", "success");
  });
}

document.addEventListener("DOMContentLoaded", inicializarFormularioContacto);
