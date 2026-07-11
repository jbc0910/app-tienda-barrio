import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from 'react';
import { supabase } from '../config/supabase';

const AppContext = createContext(undefined);

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [tienda, setTienda] = useState(null);
  const [currentScreen, setCurrentScreen] = useState('SPLASH');
  const [isGlobalLoading, setIsGlobalLoading] = useState(true);

  const resolveTiendaParaUsuario = useCallback(async (authUser) => {
    const { data: tiendaData, error: tiendaError } = await supabase
      .from('tiendas')
      .select('*')
      .eq('usuario_id', authUser.id)
      .maybeSingle();

    if (tiendaError) {
      console.error('[AppContext] Error consultando tienda:', tiendaError.message);
      setUser(authUser);
      setTienda(null);
      setCurrentScreen('LOGIN');
      return;
    }

    setUser(authUser);

    if (tiendaData) {
      setTienda(tiendaData);
      setCurrentScreen('DASHBOARD');
    } else {
      setTienda(null);
      setCurrentScreen('SETUP_TIENDA');
    }
  }, []);

  const checkSession = useCallback(async () => {
    setIsGlobalLoading(true);
    try {
      const { data, error } = await supabase.auth.getSession();

      if (error) {
        console.error('[AppContext] Error obteniendo sesión:', error.message);
        setUser(null);
        setTienda(null);
        setCurrentScreen('LOGIN');
        return;
      }

      const session = data?.session;

      if (!session) {
        setUser(null);
        setTienda(null);
        setCurrentScreen('LOGIN');
        return;
      }

      await resolveTiendaParaUsuario(session.user);
    } catch (err) {
      console.error('[AppContext] Excepción en checkSession:', err);
      setUser(null);
      setTienda(null);
      setCurrentScreen('LOGIN');
    } finally {
      setIsGlobalLoading(false);
    }
  }, [resolveTiendaParaUsuario]);

  useEffect(() => {
    checkSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_OUT' || !session) {
          setUser(null);
          setTienda(null);
          setCurrentScreen('LOGIN');
          setIsGlobalLoading(false);
          return;
        }

        if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
          setUser((prevUser) => {
            if (prevUser?.id === session.user.id && event === 'TOKEN_REFRESHED') {
              return prevUser;
            }
            resolveTiendaParaUsuario(session.user).finally(() =>
              setIsGlobalLoading(false)
            );
            return prevUser;
          });
        }
      }
    );

    return () => {
      authListener?.subscription?.unsubscribe();
    };
  }, []);

  const signOut = useCallback(async () => {
    try {
      await supabase.auth.signOut();
    } catch (err) {
      console.error('[AppContext] Error en signOut (se limpia estado local igual):', err);
    } finally {
      setUser(null);
      setTienda(null);
      setCurrentScreen('LOGIN');
    }
  }, []);

  const value = {
    user,
    tienda,
    setTienda,
    currentScreen,
    setCurrentScreen,
    isGlobalLoading,
    checkSession,
    signOut,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp debe usarse dentro de un <AppProvider>');
  }
  return context;
};