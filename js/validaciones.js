/* ============================================================
   validaciones.js
   Reglas de negocio y datos compartidos, según el Anexo 1
   (Instrucciones EP1) de la asignatura.
   ============================================================ */

const REGLAS = {
  MAX_INTENTOS_LOGIN: 3,
  DOMINIOS_CORREO: ["duoc.cl", "profesor.duoc.cl", "gmail.com"],
  DOMINIOS_REGISTRO: ["duoc.cl"],
  EDAD_MINIMA_REGISTRO: 14,
  PASSWORD_MIN: 4,
  PASSWORD_MAX: 10
};

/* Regiones y comunas de Chile (arreglo complementario de JS,
   selección representativa de comunas por región). Al cambiar
   la región en un formulario, se debe repoblar el select de
   comunas con las comunas de esa región. */
const REGIONES_COMUNAS = {
  "Arica y Parinacota": ["Arica", "Camarones", "Putre", "General Lagos"],
  "Tarapacá": ["Iquique", "Alto Hospicio", "Pozo Almonte", "Camiña", "Colchane", "Huara", "Pica"],
  "Antofagasta": ["Antofagasta", "Calama", "Tocopilla", "Mejillones", "Taltal", "San Pedro de Atacama", "María Elena"],
  "Atacama": ["Copiapó", "Caldera", "Tierra Amarilla", "Chañaral", "Diego de Almagro", "Vallenar", "Huasco"],
  "Coquimbo": ["La Serena", "Coquimbo", "Ovalle", "Illapel", "Los Vilos", "Salamanca", "Vicuña", "Andacollo"],
  "Valparaíso": ["Valparaíso", "Viña del Mar", "Quilpué", "Villa Alemana", "Concón", "Quillota", "San Antonio", "Los Andes", "San Felipe", "Isla de Pascua"],
  "Metropolitana de Santiago": ["Santiago", "Providencia", "Las Condes", "Ñuñoa", "Maipú", "Puente Alto", "La Florida", "San Bernardo", "Vitacura", "Peñalolén", "Recoleta", "Quilicura"],
  "Libertador General Bernardo O'Higgins": ["Rancagua", "San Fernando", "Rengo", "Machalí", "Santa Cruz", "Pichilemu", "San Vicente"],
  "Maule": ["Talca", "Curicó", "Linares", "Constitución", "Cauquenes", "Molina", "San Javier"],
  "Ñuble": ["Chillán", "Chillán Viejo", "San Carlos", "Bulnes", "Quirihue", "Coihueco", "Yungay", "San Nicolás"],
  "Biobío": ["Concepción", "Talcahuano", "Los Ángeles", "Coronel", "San Pedro de la Paz", "Chiguayante", "Tomé", "Lota", "Penco"],
  "La Araucanía": ["Temuco", "Padre Las Casas", "Villarrica", "Angol", "Victoria", "Pucón", "Lautaro"],
  "Los Ríos": ["Valdivia", "La Unión", "Río Bueno", "Panguipulli", "Los Lagos", "Lanco"],
  "Los Lagos": ["Puerto Montt", "Osorno", "Castro", "Ancud", "Puerto Varas", "Quellón", "Frutillar"],
  "Aysén del General Carlos Ibáñez del Campo": ["Coyhaique", "Puerto Aysén", "Chile Chico", "Cochrane"],
  "Magallanes y de la Antártica Chilena": ["Punta Arenas", "Puerto Natales", "Porvenir", "Cabo de Hornos"]
};
const REGIONES_CHILE = Object.keys(REGIONES_COMUNAS);

function calcularEdad(fechaNacimientoStr) {
  const hoy = new Date();
  const nacimiento = new Date(fechaNacimientoStr + "T00:00:00");
  let edad = hoy.getFullYear() - nacimiento.getFullYear();
  const mes = hoy.getMonth() - nacimiento.getMonth();
  if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
    edad--;
  }
  return edad;
}

/* Correo: formato válido y dominio dentro de los permitidos.
   Por defecto usa los dominios generales (@duoc.cl, @profesor.duoc.cl,
   @gmail.com) que se aceptan en login y contacto. El formulario de
   registro le pasa una lista más restrictiva (solo @duoc.cl), tal
   como lo exige el caso de esta evaluación. Máximo 100 caracteres. */
function validarCorreo(correo, dominiosPermitidos) {
  const dominios = dominiosPermitidos || REGLAS.DOMINIOS_CORREO;
  if (!correo || correo.length > 100) return false;
  const formatoValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo);
  if (!formatoValido) return false;
  const dominio = correo.split("@")[1].toLowerCase();
  return dominios.indexOf(dominio) !== -1;
}

/* Contraseña: requerida, entre 4 y 10 caracteres (regla del Anexo 1). */
function validarPassword(password) {
  return !!password && password.length >= REGLAS.PASSWORD_MIN && password.length <= REGLAS.PASSWORD_MAX;
}

/* Solo letras (incluye tildes y ñ) y espacios, sin números ni
   caracteres especiales. */
function soloTexto(valor) {
  const regex = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/;
  return regex.test(valor.trim()) && valor.trim().length > 0;
}

/* RUN chileno: sin puntos ni guion (ej: 19011022K), entre 7 y 9
   caracteres en total, con dígito verificador válido (módulo 11). */
function calcularDigitoVerificador(cuerpo) {
  let suma = 0;
  let multiplo = 2;
  for (let i = cuerpo.length - 1; i >= 0; i--) {
    suma += parseInt(cuerpo[i], 10) * multiplo;
    multiplo = multiplo < 7 ? multiplo + 1 : 2;
  }
  const resto = 11 - (suma % 11);
  if (resto === 11) return "0";
  if (resto === 10) return "K";
  return String(resto);
}

function validarRun(run) {
  if (!run) return false;
  const limpio = run.trim().toUpperCase();
  if (!/^[0-9]{6,8}[0-9K]$/.test(limpio)) return false;
  if (limpio.length < 7 || limpio.length > 9) return false;
  const cuerpo = limpio.slice(0, -1);
  const dv = limpio.slice(-1);
  return dv === calcularDigitoVerificador(cuerpo);
}

/* ---------- Ayudas para mostrar errores con clases de Bootstrap ---------- */
function marcarCampoInvalido(idCampo, mensaje) {
  const campo = document.getElementById(idCampo);
  const retro = document.getElementById(idCampo + "-feedback");
  if (campo) campo.classList.add("is-invalid");
  if (retro) retro.textContent = mensaje;
}

function marcarCampoValido(idCampo) {
  const campo = document.getElementById(idCampo);
  if (campo) campo.classList.remove("is-invalid");
}

function limpiarValidaciones(idsCampos) {
  idsCampos.forEach(marcarCampoValido);
}

/* ---------- Ayudas para la alerta resumen (patrón visto en clases) ---------- */
function mostrarAlerta(idAlerta, mensaje, tipo) {
  const alerta = document.getElementById(idAlerta);
  if (!alerta) return;
  alerta.textContent = mensaje;
  alerta.classList.remove("d-none", "alert-success", "alert-danger", "alert-warning");
  alerta.classList.add("alert-" + tipo);
}

function ocultarAlerta(idAlerta) {
  const alerta = document.getElementById(idAlerta);
  if (alerta) alerta.classList.add("d-none");
}

/* Puebla un <select> de regiones y, opcionalmente, encadena un
   <select> de comunas que se repuebla cada vez que cambia la región. */
function encadenarRegionComuna(idSelectRegion, idSelectComuna) {
  const selectRegion = document.getElementById(idSelectRegion);
  const selectComuna = document.getElementById(idSelectComuna);

  REGIONES_CHILE.forEach(function (region) {
    const opcion = document.createElement("option");
    opcion.value = region;
    opcion.textContent = region;
    selectRegion.appendChild(opcion);
  });

  function repoblarComunas(regionSeleccionada, comunaAMarcar) {
    while (selectComuna.firstChild) selectComuna.removeChild(selectComuna.firstChild);
    const primera = document.createElement("option");
    primera.value = "";
    primera.textContent = "Selecciona tu comuna";
    selectComuna.appendChild(primera);

    const comunas = REGIONES_COMUNAS[regionSeleccionada] || [];
    comunas.forEach(function (comuna) {
      const opcion = document.createElement("option");
      opcion.value = comuna;
      opcion.textContent = comuna;
      if (comuna === comunaAMarcar) opcion.selected = true;
      selectComuna.appendChild(opcion);
    });
    selectComuna.disabled = comunas.length === 0;
  }

  selectRegion.addEventListener("change", function () {
    repoblarComunas(selectRegion.value, null);
  });

  return repoblarComunas;
}
