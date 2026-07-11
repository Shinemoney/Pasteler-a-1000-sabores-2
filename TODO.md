# TODO - Ajuste flujo carrito / checkout / resultado de compra

- [ ] Refactorizar `src/pages/Cart.jsx` para dejar solo selección y gestión del carrito.
- [ ] Implementar `src/pages/Checkout.jsx` con formulario de cliente, dirección y resumen de productos.
- [ ] Extender `src/context/CartContext.jsx` para persistir `checkoutDraft` y guardar `cliente` + `direccionDetalle` + `notasEntrega` en `pedidoActual`.
- [ ] Ajustar `src/pages/CompraResultado.jsx` para usar datos reales del pedido y soportar reintento de pago sin pérdida de información.
- [ ] Revisar rutas en `src/App.jsx` para asegurar navegación `Cart -> Checkout -> CompraResultado`.
- [ ] Validar consistencia del flujo completo y actualizar checklist.
