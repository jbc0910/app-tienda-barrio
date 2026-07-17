import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { theme } from '../styles/theme';
import { listProductos } from '../services/products';
import { listCategorias } from '../services/categorias';
import { supabase } from '../config/supabase';
import { useCart } from '../context/CartContext';
import { SearchBar } from '../components/SearchBar';
import { CategoryChips } from '../components/CategoryChips';
import { ProductCardCliente } from '../components/ProductCardCliente';

export default function CatalogoScreen({ route, navigation }) {
  // En un entorno real, la tiendaId vendría por parámetro (ej. escaneo QR o enlace)
  // Para pruebas, usaremos route.params.tiendaId
  const { tiendaId } = route.params || {};

  const [tienda, setTienda] = useState(null);
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState(null);
  const [loading, setLoading] = useState(true);

  const { totalItems, subtotal } = useCart();

  const loadData = useCallback(async () => {
    if (!tiendaId) return;
    try {
      setLoading(true);
      // Fetch store details
      const { data: storeData } = await supabase
        .from('tiendas')
        .select('*')
        .eq('id', tiendaId)
        .single();
        
      setTienda(storeData);

      const [prods, cats] = await Promise.all([
        listProductos(tiendaId),
        listCategorias(tiendaId)
      ]);
      
      setProductos(prods);
      setCategorias(cats);
    } catch (err) {
      console.error('Error loading catalog:', err);
    } finally {
      setLoading(false);
    }
  }, [tiendaId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const filteredProducts = useMemo(() => {
    return productos.filter(p => {
      const matchesSearch = p.nombre.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = activeCategory ? p.categoria_id === activeCategory : true;
      return matchesSearch && matchesCategory;
    });
  }, [productos, searchQuery, activeCategory]);

  const formatPrecio = (precio) =>
    new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      maximumFractionDigits: 0,
    }).format(precio);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  if (!tienda) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>Tienda no encontrada.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => navigation.goBack()}
        >
          <MaterialCommunityIcons name="arrow-left" size={24} color={theme.colors.onPrimary} />
        </TouchableOpacity>
        <View style={styles.headerInfo}>
          <Text style={styles.storeName}>{tienda.nombre_tienda}</Text>
          <Text style={styles.storeDesc}>Envíos a tu barrio</Text>
        </View>
      </View>

      <View style={styles.content}>
        <SearchBar 
          value={searchQuery} 
          onChangeText={setSearchQuery} 
          placeholder="Busca tus productos..." 
        />
        
        <CategoryChips 
          categorias={categorias} 
          activeId={activeCategory} 
          onSelect={setActiveCategory} 
        />

        <FlatList
          data={filteredProducts}
          keyExtractor={(item) => item.id}
          numColumns={2}
          contentContainerStyle={styles.gridContent}
          columnWrapperStyle={styles.gridRow}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => <ProductCardCliente producto={item} />}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <MaterialCommunityIcons name="magnify-close" size={48} color={theme.colors.onSurfaceVariant} />
              <Text style={styles.emptyTitle}>No hay productos</Text>
              <Text style={styles.emptySub}>Intenta con otra búsqueda o categoría.</Text>
            </View>
          }
        />
      </View>

      {/* Floating Cart Button */}
      {totalItems > 0 && (
        <View style={styles.cartFloatingWrapper}>
          <TouchableOpacity 
            style={styles.cartFloatingBtn}
            onPress={() => navigation.navigate('Cart', { tiendaId })}
            activeOpacity={0.9}
          >
            <View style={styles.cartFloatingLeft}>
              <View style={styles.cartBadge}>
                <Text style={styles.cartBadgeText}>{totalItems}</Text>
              </View>
              <Text style={styles.cartFloatingText}>Ver carrito</Text>
            </View>
            <Text style={styles.cartFloatingTotal}>{formatPrecio(subtotal)}</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  errorText: { ...theme.typography.titleMd, color: theme.colors.error },
  header: {
    backgroundColor: theme.colors.primary,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: 20,
    paddingHorizontal: theme.spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
  },
  backButton: {
    padding: 8,
    borderRadius: theme.rounded.full,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  headerInfo: {
    flex: 1,
  },
  storeName: {
    ...theme.typography.titleMd,
    color: theme.colors.onPrimary,
  },
  storeDesc: {
    fontSize: 13,
    color: theme.colors.primaryLight,
  },
  content: {
    flex: 1,
    padding: theme.spacing.md,
  },
  gridContent: {
    paddingBottom: 100, // Space for floating cart
  },
  gridRow: {
    justifyContent: 'space-between',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 60,
  },
  emptyTitle: {
    ...theme.typography.titleMd,
    color: theme.colors.onSurface,
    marginTop: theme.spacing.md,
  },
  emptySub: {
    color: theme.colors.onSurfaceVariant,
    marginTop: 4,
  },
  cartFloatingWrapper: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 30 : 20,
    left: theme.spacing.md,
    right: theme.spacing.md,
  },
  cartFloatingBtn: {
    backgroundColor: theme.colors.orange,
    borderRadius: theme.rounded.full,
    padding: theme.spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
  cartFloatingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  cartBadge: {
    backgroundColor: 'rgba(0,0,0,0.15)',
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cartBadgeText: {
    color: theme.colors.orangeText,
    fontWeight: '800',
    fontSize: 14,
  },
  cartFloatingText: {
    color: theme.colors.orangeText,
    fontWeight: '700',
    fontSize: 16,
  },
  cartFloatingTotal: {
    color: theme.colors.orangeText,
    fontWeight: '800',
    fontSize: 18,
  }
});
