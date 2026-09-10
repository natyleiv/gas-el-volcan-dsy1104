/* ============================================================
   admin-pedido-detalle.js
   Detalle de un pedido específico. Accesible para
   Administrador y Vendedor.
   ============================================================ */

document.addEventListener("DOMContentLoaded", function () {
  const sesion = inicializarAdmin(["Administrador", "Vendedor"]);
  if (!sesion) return;

  const idSeleccionado = localStorage.getItem(CLAVE_PEDIDO_SELECCIONADO);
  const pedido = idSeleccionado !== null ? buscarPedidoPorId(idSeleccionado) : undefined;

  if (pedido === undefined) {
    document.getElementById("pedido-contenido").classList.add("d-none");
    document.getElementById("pedido-no-encontrado").classList.remove("d-none");
    return;
  }

  document.getElementById("pedido-id").textContent = "#" + pedido.id;
  const fecha = new Date(pedido.fecha);
  document.getElementById("pedido-fecha").textContent = fecha.toLocaleDateString("es-CL") + " " + fecha.toLocaleTimeString("es-CL", { hour: "2-digit", minute: "2-digit" });
  document.getElementById("pedido-cliente").textContent = pedido.cliente;
  document.getElementById("pedido-correo").textContent = pedido.correoCliente || "No registrado (compra sin sesión)";
  document.getElementById("pedido-estado").textContent = pedido.estado;

  const cuerpo = document.getElementById("pedido-items");
  pedido.items.forEach(function (item) {
    const fila = document.createElement("tr");
    [item.nombre, item.cantidad, formatearPrecio(item.precioUnitario), formatearPrecio(item.subtotal)].forEach(function (texto) {
      const celda = document.createElement("td");
      celda.textContent = texto;
      fila.appendChild(celda);
    });
    cuerpo.appendChild(fila);
  });

  document.getElementById("pedido-subtotal").textContent = formatearPrecio(pedido.subtotal);
  document.getElementById("pedido-total").textContent = formatearPrecio(pedido.total);

  const filaDescuento = document.getElementById("pedido-fila-descuento");
  if (pedido.descuento > 0) {
    document.getElementById("pedido-cupon").textContent = pedido.cupon || "—";
    document.getElementById("pedido-descuento").textContent = "-" + formatearPrecio(pedido.descuento);
  } else {
    filaDescuento.style.display = "none";
  }
});
