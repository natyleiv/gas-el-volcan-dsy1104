/* ============================================================
   admin-pedidos.js
   Listado de pedidos (órdenes) confirmados. Accesible para
   Administrador y Vendedor.
   ============================================================ */

function crearFilaPedido(pedido) {
  const fila = document.createElement("tr");

  const celdaId = document.createElement("td");
  celdaId.textContent = "#" + pedido.id;
  fila.appendChild(celdaId);

  const celdaFecha = document.createElement("td");
  const fecha = new Date(pedido.fecha);
  celdaFecha.textContent = fecha.toLocaleDateString("es-CL") + " " + fecha.toLocaleTimeString("es-CL", { hour: "2-digit", minute: "2-digit" });
  fila.appendChild(celdaFecha);

  const celdaCliente = document.createElement("td");
  celdaCliente.textContent = pedido.cliente;
  fila.appendChild(celdaCliente);

  const celdaItems = document.createElement("td");
  celdaItems.textContent = pedido.items.reduce(function (total, item) { return total + item.cantidad; }, 0) + " producto(s)";
  fila.appendChild(celdaItems);

  const celdaTotal = document.createElement("td");
  celdaTotal.className = "fw-semibold";
  celdaTotal.textContent = formatearPrecio(pedido.total);
  fila.appendChild(celdaTotal);

  const celdaEstado = document.createElement("td");
  const insignia = document.createElement("span");
  insignia.className = "badge bg-success";
  insignia.textContent = pedido.estado;
  celdaEstado.appendChild(insignia);
  fila.appendChild(celdaEstado);

  const celdaAcciones = document.createElement("td");
  const botonVer = document.createElement("button");
  botonVer.type = "button";
  botonVer.className = "btn btn-sm btn-outline-secondary";
  botonVer.textContent = "Ver detalle";
  botonVer.addEventListener("click", function () {
    localStorage.setItem(CLAVE_PEDIDO_SELECCIONADO, pedido.id);
    window.location.href = "pedido-detalle.html";
  });
  celdaAcciones.appendChild(botonVer);
  fila.appendChild(celdaAcciones);

  return fila;
}

document.addEventListener("DOMContentLoaded", function () {
  const sesion = inicializarAdmin(["Administrador", "Vendedor"]);
  if (!sesion) return;

  const pedidos = obtenerPedidos().slice().reverse();

  if (pedidos.length === 0) {
    document.getElementById("pedidos-vacio").classList.remove("d-none");
    document.getElementById("pedidos-tabla-wrap").classList.add("d-none");
    return;
  }

  const cuerpo = document.getElementById("cuerpo-tabla-pedidos");
  pedidos.forEach(function (pedido) {
    cuerpo.appendChild(crearFilaPedido(pedido));
  });
});
