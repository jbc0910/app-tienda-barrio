import { supabase } from '../config/supabase';

/**
 * Lista las categorías de una tienda, ordenadas alfabéticamente.
 */
export async function listCategorias(tiendaId) {
  const { data, error } = await supabase
    .from('categorias')
    .select('*')
    .eq('tienda_id', tiendaId)
    .order('nombre', { ascending: true });

  if (error) throw error;
  return data;
}

/**
 * Crea una nueva categoría.
 */
export async function createCategoria({ tiendaId, nombre, icono }) {
  const { data, error } = await supabase
    .from('categorias')
    .insert({
      tienda_id: tiendaId,
      nombre: nombre.trim(),
      icono: icono || 'tag-outline',
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Actualiza una categoría existente.
 */
export async function updateCategoria(categoriaId, { nombre, icono }) {
  const { data, error } = await supabase
    .from('categorias')
    .update({ nombre: nombre.trim(), icono })
    .eq('id', categoriaId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Elimina una categoría.
 * Nota: Es importante manejar qué pasa con los productos que tenían esta categoría.
 * Normalmente la BD debería tener SET NULL o CASCADE, o se puede reasignar.
 */
export async function deleteCategoria(categoriaId) {
  const { error } = await supabase.from('categorias').delete().eq('id', categoriaId);
  if (error) throw error;
}

/**
 * Genera categorías por defecto para una tienda recién creada.
 */
export async function seedCategoriasDefecto(tiendaId) {
  const categoriasDefecto = [
    { tienda_id: tiendaId, nombre: 'General', icono: 'tag-outline' },
    { tienda_id: tiendaId, nombre: 'Lácteos', icono: 'bottle-wine-outline' },
    { tienda_id: tiendaId, nombre: 'Bebidas', icono: 'cup-water' },
    { tienda_id: tiendaId, nombre: 'Frutas y Verduras', icono: 'food-apple-outline' },
    { tienda_id: tiendaId, nombre: 'Snacks', icono: 'food-croissant' },
    { tienda_id: tiendaId, nombre: 'Limpieza', icono: 'spray-bottle' },
  ];

  const { data, error } = await supabase
    .from('categorias')
    .insert(categoriasDefecto)
    .select();

  if (error) throw error;
  return data;
}
