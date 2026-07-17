import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { theme } from '../styles/theme';
import { useCart } from '../context/CartContext';

const formatPrecio = (precio) =>
  new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0,
  }).format(precio);

export const CartItem = ({ item }) => {
  const { addItem, removeItem } = useCart();
  const { producto, cantidad } = item;
  
  const precio = producto.precio_oferta || producto.precio;
  
  return (
    <View style={styles.container}>
      {producto.imagen_url ? (
        <Image source={{ uri: producto.imagen_url }} style={styles.image} />
      ) : (
        <View style={[styles.image, styles.imagePlaceholder]}>
          <MaterialCommunityIcons name="image-off-outline" size={24} color={theme.colors.onSurfaceVariant} />
        </View>
      )}
      
      <View style={styles.info}>
        <Text style={styles.nombre} numberOfLines={2}>{producto.nombre}</Text>
        <Text style={styles.precio}>{formatPrecio(precio)}</Text>
      </View>
      
      <View style={styles.actions}>
        <View style={styles.counterGroup}>
          <TouchableOpacity 
            style={styles.btnAction} 
            onPress={() => removeItem(producto.id)}
          >
            <MaterialCommunityIcons name="minus" size={20} color={theme.colors.onSurface} />
          </TouchableOpacity>
          
          <Text style={styles.qtyText}>{cantidad}</Text>
          
          <TouchableOpacity 
            style={styles.btnAction} 
            onPress={() => addItem(producto)}
          >
            <MaterialCommunityIcons name="plus" size={20} color={theme.colors.onSurface} />
          </TouchableOpacity>
        </View>
        
        <TouchableOpacity 
          style={styles.btnDelete}
          onPress={() => removeItem(producto.id, true)}
        >
          <MaterialCommunityIcons name="trash-can-outline" size={20} color={theme.colors.error} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.md,
    backgroundColor: theme.colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.outline,
    gap: theme.spacing.md,
  },
  image: {
    width: 64,
    height: 64,
    borderRadius: theme.rounded.sm,
    backgroundColor: theme.colors.surfaceBright,
  },
  imagePlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  info: {
    flex: 1,
  },
  nombre: {
    ...theme.typography.bodyLg,
    fontWeight: '600',
    color: theme.colors.onSurface,
    marginBottom: 4,
  },
  precio: {
    ...theme.typography.bodyLg,
    fontWeight: '700',
    color: theme.colors.primary,
  },
  actions: {
    alignItems: 'flex-end',
    gap: 8,
  },
  counterGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surfaceDim,
    borderRadius: theme.rounded.sm,
    borderWidth: 1,
    borderColor: theme.colors.outline,
  },
  btnAction: {
    padding: 6,
    width: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qtyText: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.onSurface,
    width: 24,
    textAlign: 'center',
  },
  btnDelete: {
    padding: 4,
  }
});
