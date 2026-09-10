/* ============================================================
   admin-home.js
   Página de bienvenida del panel administrador con KPIs
   simples del negocio.
   ============================================================ */

document.addEventListener("DOMContentLoaded", function () {
  const sesion = inicializarAdmin(["Administrador", "Vendedor"]);
  if (!sesion) return;

  document.getElementById("saludo-nombre").textContent = sesion.nombre;

  const productos = obtenerProductos();
  document.getElementById("kpi-productos").textContent = productos.length;

  const conStockCritico = productos.filter(function (p) {
    return typeof p.stockCritico === "number" && p.stock <= p.stockCritico;
  }).length;
  document.getElementById("kpi-stock-critico").textContent = conStockCritico;

  document.getElementById("kpi-pedidos").textContent = obtenerPedidos().length;

  if (sesion.tipoUsuario === "Administrador") {
    document.getElementById("kpi-usuarios").textContent = obtenerUsuarios().length;
  } else {
    document.getElementById("tarjeta-usuarios").remove();
  }
});
