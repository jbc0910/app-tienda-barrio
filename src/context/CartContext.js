import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CartContext = createContext(undefined);
const CART_STORAGE_KEY = '@tienda_barrio_cart';

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const loadCart = async () => {
      try {
        const storedCart = await AsyncStorage.getItem(CART_STORAGE_KEY);
        if (storedCart) {
          setItems(JSON.parse(storedCart));
        }
      } catch (e) {
        console.error('Error loading cart', e);
      } finally {
        setIsLoaded(true);
      }
    };
    loadCart();
  }, []);

  useEffect(() => {
    if (isLoaded) {
      AsyncStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    }
  }, [items, isLoaded]);

  const addItem = (producto) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.producto.id === producto.id);
      if (existing) {
        return prev.map((i) =>
          i.producto.id === producto.id ? { ...i, cantidad: i.cantidad + 1 } : i
        );
      }
      return [...prev, { producto, cantidad: 1 }];
    });
  };

  const removeItem = (productoId, removeAll = false) => {
    setItems((prev) => {
      if (removeAll) {
        return prev.filter((i) => i.producto.id !== productoId);
      }
      const existing = prev.find((i) => i.producto.id === productoId);
      if (existing && existing.cantidad > 1) {
        return prev.map((i) =>
          i.producto.id === productoId ? { ...i, cantidad: i.cantidad - 1 } : i
        );
      }
      return prev.filter((i) => i.producto.id !== productoId);
    });
  };

  const clearCart = () => setItems([]);

  const totalItems = items.reduce((sum, item) => sum + item.cantidad, 0);
  
  const subtotal = items.reduce((sum, item) => {
    const price = item.producto.precio_oferta || item.producto.precio;
    return sum + price * item.cantidad;
  }, 0);

  return (
    <CartContext.Provider
      value={{ items, addItem, removeItem, clearCart, totalItems, subtotal, isLoaded }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart debe usarse dentro de un CartProvider');
  }
  return context;
};
