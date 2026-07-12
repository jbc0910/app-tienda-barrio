import { decode } from 'base64-arraybuffer';
import { supabase } from '../config/supabase';

export const PRODUCTOS_BUCKET = 'productos-imagenes';

/**
 * Lista los productos de una tienda, ordenados por nombre.
 */
export async function listProductos(tiendaId) {
  const { data, error } = await supabase
    .from('productos')
    .select('*')
    .eq('tienda_id', tiendaId)
    .order('nombre', { ascending: true });

  if (error) throw error;
  return data;
}

export async function uploadProductoImagen(tiendaId, asset) {
  if (!asset?.base64) {
    throw new Error('La imagen seleccionada no incluye datos base64 para subir.');
  }

  const extension = (asset.mimeType?.split('/')[1] || 'jpg').replace('jpeg', 'jpg');
  const path = `${tiendaId}/${Date.now()}.${extension}`;

  const { error: uploadError } = await supabase.storage
    .from(PRODUCTOS_BUCKET)
    .upload(path, decode(asset.base64), {
      contentType: asset.mimeType || 'image/jpeg',
      upsert: false,
    });

  if (uploadError) throw uploadError;

  const { data } = supabase.storage.from(PRODUCTOS_BUCKET).getPublicUrl(path);
  return data.publicUrl;
}

function extractStoragePath(imagenUrl) {
  if (!imagenUrl) return null;
  const marker = `/object/public/${PRODUCTOS_BUCKET}/`;
  const idx = imagenUrl.indexOf(marker);
  if (idx === -1) return null;
  return imagenUrl.slice(idx + marker.length);
}

async function deleteProductoImagenSilencioso(imagenUrl) {
  const path = extractStoragePath(imagenUrl);
  if (!path) return;
  const { error } = await supabase.storage.from(PRODUCTOS_BUCKET).remove([path]);
  if (error) console.warn('[products] No se pudo borrar la imagen anterior:', error.message);
}

export async function createProducto({ tiendaId, nombre, precio, stock, imageAsset }) {
  let imagen_url = null;
  if (imageAsset) {
    imagen_url = await uploadProductoImagen(tiendaId, imageAsset);
  }

  const { data, error } = await supabase
    .from('productos')
    .insert({
      tienda_id: tiendaId,
      nombre: nombre.trim(),
      precio,
      stock,
      imagen_url,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateProducto(producto, { nombre, precio, stock, imageAsset }) {
  const updates = { nombre: nombre.trim(), precio, stock };

  if (imageAsset) {
    updates.imagen_url = await uploadProductoImagen(producto.tienda_id, imageAsset);
  }

  const { data, error } = await supabase
    .from('productos')
    .update(updates)
    .eq('id', producto.id)
    .select()
    .single();

  if (error) throw error;

  if (imageAsset && producto.imagen_url) {
    await deleteProductoImagenSilencioso(producto.imagen_url);
  }

  return data;
}

export async function deleteProducto(producto) {
  const { error } = await supabase.from('productos').delete().eq('id', producto.id);
  if (error) throw error;

  if (producto.imagen_url) {
    await deleteProductoImagenSilencioso(producto.imagen_url);
  }
}