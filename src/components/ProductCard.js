import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { theme } from '../styles/theme';

const formatPrecio = (precio) =>
  new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0,
  }).format(precio);

export const ProductCard = ({ producto, onEdit, onDelete }) => {
  const sinStock = producto.stock <= 0;

  return (
    <View style={styles.card}>
      {producto.imagen_url ? (
        <Image source={{ uri: producto.imagen_url }} style={styles.image} />
      ) : (
        <View style={[styles.image, styles.imagePlaceholder]}>
          <MaterialCommunityIcons
            name="image-off-outline"
            size={22}
            color={theme.colors.onSurfaceVariant}
          />
        </View>
      )}

      <View style={styles.info}>
        <Text style={styles.nombre} numberOfLines={1}>
          {producto.nombre}
        </Text>
        <Text style={styles.precio}>{formatPrecio(producto.precio)}</Text>
        <View style={styles.stockRow}>
          <View style={[styles.stockDot, sinStock && styles.stockDotEmpty]} />
          <Text style={[styles.stockText, sinStock && styles.stockTextEmpty]}>
            {sinStock ? 'Sin stock' : `${producto.stock} en stock`}
          </Text>
        </View>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity style={styles.actionButton} onPress={() => onEdit(producto)}>
          <MaterialCommunityIcons name="pencil-outline" size={18} color={theme.colors.onSurfaceVariant} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton} onPress={() => onDelete(producto)}>
          <MaterialCommunityIcons name="trash-can-outline" size={18} color="#f87171" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.outline,
    borderRadius: theme.rounded.md,
    padding: theme.spacing.sm,
    marginBottom: theme.spacing.sm,
    gap: theme.spacing.sm,
  },
  image: { width: 56, height: 56, borderRadius: theme.rounded.sm },
  imagePlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.surfaceDim,
  },
  info: { flex: 1, gap: 2 },
  nombre: { ...theme.typography.bodyLg, color: theme.colors.onSurface, fontWeight: '600' },
  precio: { ...theme.typography.bodyLg, color: theme.colors.onPrimaryContainer },
  stockRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 2 },
  stockDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#4ade80' },
  stockDotEmpty: { backgroundColor: '#f87171' },
  stockText: { fontSize: 12, color: theme.colors.onSurfaceVariant },
  stockTextEmpty: { color: '#f87171' },
  actions: { flexDirection: 'row', gap: 4 },
  actionButton: {
    width: 32,
    height: 32,
    borderRadius: theme.rounded.sm,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.surfaceDim,
  },
});
