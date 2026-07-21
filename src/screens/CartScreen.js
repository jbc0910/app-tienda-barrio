import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { theme } from '../styles/theme';
import { useCart } from '../context/CartContext';
import { CartItem } from '../components/CartItem';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { enviarPedidoWhatsApp } from '../services/whatsapp';
import { supabase } from '../config/supabase';

export default function CartScreen({ route, navigation }) {
  const { tiendaId } = route.params || {};
  const { items, totalItems, subtotal, clearCart } = useCart();
  
  const [tienda, setTienda] = useState(null);
  const [nombre, setNombre] = useState('');
  const [direccion, setDireccion] = useState('');
  const [notas, setNotas] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (tiendaId) {
      supabase
        .from('tiendas')
        .select('*')
        .eq('id', tiendaId)
        .single()
        .then(({ data }) => setTienda(data))
        .catch(console.error);
    }
  }, [tiendaId]);

  const formatPrecio = (precio) =>
    new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      maximumFractionDigits: 0,
    }).format(precio);

  const handleCheckout = async () => {
    if (!nombre.trim()) {
      Alert.alert('Faltan datos', 'Por favor ingresa tu nombre.');
      return;
    }
    if (!tienda?.telefono_whatsapp) {
      Alert.alert('Error', 'Esta tienda no tiene un número de WhatsApp configurado.');
      return;
    }

    setLoading(true);
    try {
      await enviarPedidoWhatsApp(tienda, items, subtotal, {
        nombre: nombre.trim(),
        direccion: direccion.trim(),
        notas: notas.trim(),
      });
      // Optionally clear cart after sending? We'll leave it for now so they don't lose it if they cancel WhatsApp.
    } catch (err) {
      Alert.alert('Error', err.message);
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <MaterialCommunityIcons name="arrow-left" size={24} color={theme.colors.onSurface} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Mi Carrito</Text>
          <View style={{ width: 40 }} />
        </View>
        <View style={styles.emptyState}>
          <MaterialCommunityIcons name="cart-outline" size={64} color={theme.colors.onSurfaceVariant} />
          <Text style={styles.emptyTitle}>Tu carrito está vacío</Text>
          <Text style={styles.emptySub}>¡Agrega algunos productos para empezar!</Text>
          <Button 
            title="Volver al catálogo" 
            onPress={() => navigation.goBack()} 
            style={{ marginTop: 20 }}
          />
        </View>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <MaterialCommunityIcons name="arrow-left" size={24} color={theme.colors.onSurface} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Mi Carrito ({totalItems})</Text>
        <TouchableOpacity style={styles.clearBtn} onPress={clearCart}>
          <Text style={styles.clearBtnText}>Vaciar</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={items}
        keyExtractor={(item) => item.producto.id}
        renderItem={({ item }) => <CartItem item={item} />}
        ListFooterComponent={
          <View style={styles.checkoutSection}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Subtotal</Text>
              <Text style={styles.summaryValue}>{formatPrecio(subtotal)}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Total</Text>
              <Text style={styles.summaryTotal}>{formatPrecio(subtotal)}</Text>
            </View>

            <View style={styles.formSection}>
              <Text style={styles.formTitle}>Datos de entrega</Text>
              
              <Input
                label="Tu nombre"
                icon="account-outline"
                placeholder="Ej. Juan Pérez"
                value={nombre}
                onChangeText={setNombre}
              />
              
              <Input
                label="Dirección de entrega"
                icon="map-marker-outline"
                placeholder="Ej. Calle 123 #45-67"
                value={direccion}
                onChangeText={setDireccion}
              />
              
              <Input
                label="Notas para el pedido (Opcional)"
                icon="comment-outline"
                placeholder="Ej. Sin cebolla, llamar al llegar..."
                value={notas}
                onChangeText={setNotas}
              />
            </View>

            <Button
              title="Pedir por WhatsApp"
              variant="orange"
              icon="whatsapp"
              onPress={handleCheckout}
              loading={loading}
              style={styles.checkoutBtn}
            />
          </View>
        }
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: 16,
    paddingHorizontal: theme.spacing.md,
    backgroundColor: theme.colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.outline,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    ...theme.typography.titleMd,
    color: theme.colors.onSurface,
  },
  clearBtn: {
    padding: 8,
  },
  clearBtnText: {
    color: theme.colors.error,
    fontWeight: '600',
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.xl,
  },
  emptyTitle: {
    ...theme.typography.headlineMd,
    color: theme.colors.onSurface,
    marginTop: theme.spacing.md,
  },
  emptySub: {
    color: theme.colors.onSurfaceVariant,
    marginTop: 8,
    textAlign: 'center',
  },
  checkoutSection: {
    backgroundColor: theme.colors.surface,
    marginTop: theme.spacing.sm,
    padding: theme.spacing.lg,
    paddingBottom: 40,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 16,
    color: theme.colors.onSurfaceVariant,
  },
  summaryValue: {
    fontSize: 16,
    color: theme.colors.onSurface,
    fontWeight: '600',
  },
  summaryTotal: {
    fontSize: 20,
    color: theme.colors.primary,
    fontWeight: '800',
  },
  formSection: {
    marginTop: theme.spacing.xl,
    marginBottom: theme.spacing.md,
  },
  formTitle: {
    ...theme.typography.titleMd,
    color: theme.colors.onSurface,
    marginBottom: theme.spacing.md,
  },
  checkoutBtn: {
    marginTop: theme.spacing.md,
  }
});
