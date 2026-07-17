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
  Platform,
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
import { listCategorias } from '../services/categorias';

export default function DashboardScreen({ navigation }) {
  const { tienda, signOut } = useApp();

  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
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
      const [productosData, categoriasData] = await Promise.all([
        listProductos(tienda.id),
        listCategorias(tienda.id)
      ]);
      setProductos(productosData);
      setCategorias(categoriasData);
    } catch (err) {
      console.error('[Dashboard] Error cargando datos:', err);
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
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.headerTitle}>{tienda?.nombre_tienda ?? 'Panel Admin'}</Text>
            <Text style={styles.headerSubtitle}>
              {productos.length} {productos.length === 1 ? 'producto' : 'productos'}
            </Text>
          </View>
          <View style={styles.headerActions}>
            <TouchableOpacity 
              style={styles.viewStoreBtn}
              onPress={() => navigation.navigate('Catalogo', { tiendaId: tienda.id })}
            >
              <MaterialCommunityIcons name="storefront-outline" size={18} color={theme.colors.orangeText} />
              <Text style={styles.viewStoreText}>Ver Tienda</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={signOut} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
              <MaterialCommunityIcons name="logout" size={24} color={theme.colors.onPrimary} />
            </TouchableOpacity>
          </View>
        </View>
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
        <MaterialCommunityIcons name="plus" size={28} color={theme.colors.orangeText} />
      </TouchableOpacity>

      <ProductFormModal
        visible={modalVisible}
        producto={productoEnEdicion}
        categorias={categorias}
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
    backgroundColor: theme.colors.primary,
    paddingHorizontal: theme.spacing.lg,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: theme.spacing.lg,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: { ...theme.typography.titleMd, color: theme.colors.onPrimary },
  headerSubtitle: { fontSize: 13, color: theme.colors.primaryLight, marginTop: 2 },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  viewStoreBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.orange,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: theme.rounded.sm,
    gap: 6,
  },
  viewStoreText: {
    color: theme.colors.orangeText,
    fontWeight: '700',
    fontSize: 13,
  },
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
    backgroundColor: theme.colors.orange,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
});
