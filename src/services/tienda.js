import { supabase } from '../config/supabase';

export async function updateTienda(tiendaId, updates) {
  const { data, error } = await supabase
    .from('tiendas')
    .update(updates)
    .eq('id', tiendaId)
    .select()
    .single();

  if (error) throw error;
  return data;
}
