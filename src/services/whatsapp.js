import { Linking } from 'react-native';

export const generarEnlaceWhatsApp = (telefono, mensaje) => {
  // Aseguramos que el teléfono solo tenga números
  const telLimpio = telefono.replace(/\D/g, '');
  
  // Codificamos el mensaje para URL
  const mensajeCodificado = encodeURIComponent(mensaje);
  
  // Usamos el esquema wa.me que es el estándar moderno
  return `https://wa.me/${telLimpio}?text=${mensajeCodificado}`;
};

export const enviarPedidoWhatsApp = async (tienda, cartItems, subtotal, datosCliente) => {
  if (!tienda.telefono_whatsapp) {
    throw new Error('La tienda no tiene un número de WhatsApp configurado.');
  }

  const { nombre, direccion, notas } = datosCliente;
  
  let mensaje = `*¡Nuevo Pedido!* 🛒\n\n`;
  mensaje += `*Cliente:* ${nombre}\n`;
  if (direccion) mensaje += `*Dirección:* ${direccion}\n`;
  
  mensaje += `\n*Detalle del pedido:*\n`;
  
  cartItems.forEach(item => {
    const precio = item.producto.precio_oferta || item.producto.precio;
    mensaje += `- ${item.cantidad}x ${item.producto.nombre} ($${precio})\n`;
  });
  
  mensaje += `\n*Total a pagar:* $${subtotal}\n`;
  
  if (notas) {
    mensaje += `\n*Notas:* ${notas}\n`;
  }

  const url = generarEnlaceWhatsApp(tienda.telefono_whatsapp, mensaje);
  
  const canOpen = await Linking.canOpenURL(url);
  
  if (canOpen) {
    return Linking.openURL(url);
  } else {
    // Fallback if WhatsApp is not installed but still tries to open in browser
    return Linking.openURL(url);
  }
};
