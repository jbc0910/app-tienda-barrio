import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase } from '../config/supabase';

const AppContext = createContext(undefined);

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [tienda, setTienda] = useState(null);
  const [isGlobalLoading, setIsGlobalLoading] = useState(true);

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
    
    if (error) console.error('[AppContext] Error fetching tienda:', error);
    setTienda(data || null);
  }, []);

  useEffect(() => {
    const initAuth = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        setUser(data.session.user);
        await resolveTienda(data.session.user);
      }
      setIsGlobalLoading(false);
    };
    initAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      setUser(session?.user || null);
      await resolveTienda(session?.user || null);
    });

    return () => subscription.unsubscribe();
  }, [resolveTienda]);

  /**
   * Refresca manualmente el estado de sesión/tienda.
   * Necesario tras operaciones que no disparan onAuthStateChange
   * de forma confiable (ej. justo después de crear la tienda).
   */
  const refreshTienda = useCallback(async () => {
    const { data } = await supabase.auth.getSession();
    const currentUser = data.session?.user || null;
    setUser(currentUser);
    await resolveTienda(currentUser);
  }, [resolveTienda]);

  const signOut = useCallback(async () => {
    // Limpieza síncrona antes de la llamada de red: evita que datos
    // de la sesión anterior queden visibles brevemente en dispositivos
    // compartidos (ej. "Don Pedro" -> "Doña María").
    setUser(null);
    setTienda(null);
    await supabase.auth.signOut();
  }, []);

  return (
    <AppContext.Provider
      value={{ user, tienda, setTienda, isGlobalLoading, signOut, refreshTienda }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp debe usarse dentro de un <AppProvider>');
  }
  return context;
};