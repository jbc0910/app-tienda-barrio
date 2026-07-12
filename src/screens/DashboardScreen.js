import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Alert,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import { theme } from '../styles/theme';
import { ProductCard } from '../components/ProductCard';
import { ProductFormModal } from '../components/ProductFormModal';
import {
  listProductos,
  createProducto,
  updateProducto,
  deleteProducto,
} from '../services/products';

export default function DashboardScreen() {
  const { tienda, signOut } = useApp();

  const [productos, setProductos] = useState([]);
  const [loadingList, setLoadingList] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [listError, setListError] = useState('');

  const [modalVisible, setModalVisible] = useState(false);
  const [productoEnEdicion, setProductoEnEdicion] = useState(null);
  const [savingProducto, setSavingProducto] = useState(false);

  const cargarProductos = useCallback(async () => {
    if (!tienda?.id) return;
    try {
      setListError('');
      const data = await listProductos(tienda.id);
      setProductos(data);
    } catch (err) {
      console.error('[Dashboard] Error cargando productos:', err);
      setListError('No se pudieron cargar los productos. Desliza para reintentar.');
    } finally {
      setLoadingList(false);
      setRefreshing(false);
    }
  }, [tienda?.id]);

  useEffect(() => {
    cargarProductos();
  }, [cargarProductos]);

  const handleRefresh = () => {
    setRefreshing(true);
    cargarProductos();
  };

  const openCreateModal = () => {
    setProductoEnEdicion(null);
    setModalVisible(true);
  };

  const openEditModal = (producto) => {
    setProductoEnEdicion(producto);
    setModalVisible(true);
  };

  const handleSubmit = async (formData, imageAsset) => {
    setSavingProducto(true);
    try {
      if (productoEnEdicion) {
        const actualizado = await updateProducto(productoEnEdicion, { ...formData, imageAsset });
        setProductos((prev) =>
          prev
            .map((p) => (p.id === actualizado.id ? actualizado : p))
            .sort((a, b) => a.nombre.localeCompare(b.nombre))
        );
      } else {
        const nuevo = await createProducto({ tiendaId: tienda.id, ...formData, imageAsset });
        setProductos((prev) => [...prev, nuevo].sort((a, b) => a.nombre.localeCompare(b.nombre)));
      }
      setModalVisible(false);
    } catch (err) {
      console.error('[Dashboard] Error guardando producto:', err);
      Alert.alert('Error', err.message || 'No se pudo guardar el producto. Intenta de nuevo.');
    } finally {
      setSavingProducto(false);
    }
  };

  const handleDelete = (producto) => {
    Alert.alert(
      'Eliminar producto',
      `¿Seguro que quieres eliminar "${producto.nombre}"? Esta acción no se puede deshacer.`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteProducto(producto);
              setProductos((prev) => prev.filter((p) => p.id !== producto.id));
            } catch (err) {
              console.error('[Dashboard] Error eliminando producto:', err);
              Alert.alert('Error', 'No se pudo eliminar el producto.');
            }
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>{tienda?.nombre_tienda ?? 'Tu tienda'}</Text>
          <Text style={styles.headerSubtitle}>
            {productos.length} {productos.length === 1 ? 'producto' : 'productos'}
          </Text>
        </View>
        <TouchableOpacity onPress={signOut} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <MaterialCommunityIcons name="logout" size={22} color={theme.colors.onSurfaceVariant} />
        </TouchableOpacity>
      </View>

      {loadingList ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      ) : (
        <FlatList
          data={productos}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <ProductCard producto={item} onEdit={openEditModal} onDelete={handleDelete} />
          )}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              tintColor={theme.colors.primary}
            />
          }
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <MaterialCommunityIcons
                name="package-variant"
                size={40}
                color={theme.colors.onSurfaceVariant}
              />
              <Text style={styles.emptyTitle}>
                {listError || 'Todavía no tienes productos'}
              </Text>
              {!listError && (
                <Text style={styles.emptySubtitle}>
                  Toca el botón + para agregar tu primer producto.
                </Text>
              )}
            </View>
          }
        />
      )}

      <TouchableOpacity style={styles.fab} onPress={openCreateModal} activeOpacity={0.85}>
        <MaterialCommunityIcons name="plus" size={28} color={theme.colors.onPrimary} />
      </TouchableOpacity>

      <ProductFormModal
        visible={modalVisible}
        producto={productoEnEdicion}
        onClose={() => setModalVisible(false)}
        onSubmit={handleSubmit}
        loading={savingProducto}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.xl,
    paddingBottom: theme.spacing.md,
  },
  headerTitle: { ...theme.typography.titleMd, color: theme.colors.onSurface },
  headerSubtitle: { fontSize: 12, color: theme.colors.onSurfaceVariant, marginTop: 2 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  listContent: { paddingHorizontal: theme.spacing.lg, paddingBottom: 100, flexGrow: 1 },
  emptyState: { alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 80 },
  emptyTitle: { ...theme.typography.bodyLg, color: theme.colors.onSurface, textAlign: 'center' },
  emptySubtitle: {
    fontSize: 13,
    color: theme.colors.onSurfaceVariant,
    textAlign: 'center',
    paddingHorizontal: theme.spacing.lg,
  },
  fab: {
    position: 'absolute',
    right: theme.spacing.lg,
    bottom: theme.spacing.xl,
    width: 56,
    height: 56,
    borderRadius: theme.rounded.full,
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
});
