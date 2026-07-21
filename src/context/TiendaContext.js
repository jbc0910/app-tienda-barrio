import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase } from '../config/supabase';
import { useAuth } from './AuthContext';

const TiendaContext = createContext(undefined);

export const TiendaProvider = ({ children }) => {
  const { user } = useAuth();
  const [tienda, setTienda] = useState(null);

  const resolveTienda = useCallback(async (authUser) => {
    if (!authUser) {
      setTienda(null);
      return;
    }
    const { data, error } = await supabase
      .from('tiendas')
      .select('*')
      .eq('usuario_id', authUser.id)
      .maybeSingle();
    
    if (error) console.error('[TiendaContext] Error fetching tienda:', error);
    setTienda(data || null);
  }, []);

  useEffect(() => {
    resolveTienda(user);
  }, [user, resolveTienda]);

  const refreshTienda = useCallback(async () => {
    await resolveTienda(user);
  }, [resolveTienda, user]);

  return (
    <TiendaContext.Provider value={{ tienda, setTienda, refreshTienda }}>
      {children}
    </TiendaContext.Provider>
  );
};

export const useTienda = () => {
  const context = useContext(TiendaContext);
  if (context === undefined) {
    throw new Error('useTienda debe usarse dentro de un <TiendaProvider>');
  }
  return context;
};
