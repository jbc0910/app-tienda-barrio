import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, Alert, Modal, TextInput } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import { theme } from '../styles/theme';
import { listCategorias, createCategoria, updateCategoria, deleteCategoria } from '../services/categorias';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function CategoriasAdminScreen() {
  const { tienda } = useApp();
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [categoriaEnEdicion, setCategoriaEnEdicion] = useState(null);
  
  // Modal states
  const [nombre, setNombre] = useState('');
  const [icono, setIcono] = useState('tag-outline');
  const [saving, setSaving] = useState(false);

  const cargarCategorias = useCallback(async () => {
    if (!tienda?.id) return;
    try {
      const data = await listCategorias(tienda.id);
      setCategorias(data);
    } catch (err) {
      console.error('[Categorias] Error cargando:', err);
      Alert.alert('Error', 'No se pudieron cargar las categorías.');
    } finally {
      setLoading(false);
    }
  }, [tienda?.id]);

  useEffect(() => {
    cargarCategorias();
  }, [cargarCategorias]);

  const openCreateModal = () => {
    setCategoriaEnEdicion(null);
    setNombre('');
    setIcono('tag-outline');
    setModalVisible(true);
  };

  const openEditModal = (cat) => {
    setCategoriaEnEdicion(cat);
    setNombre(cat.nombre);
    setIcono(cat.icono || 'tag-outline');
    setModalVisible(true);
  };

  const handleSave = async () => {
    if (!nombre.trim()) {
      Alert.alert('Error', 'El nombre de la categoría es requerido.');
      return;
    }

    setSaving(true);
    try {
      if (categoriaEnEdicion) {
        const actualizado = await updateCategoria(categoriaEnEdicion.id, { nombre, icono });
        setCategorias(prev => prev.map(c => c.id === actualizado.id ? actualizado : c));
      } else {
        const nuevo = await createCategoria({ tiendaId: tienda.id, nombre, icono });
        setCategorias(prev => [...prev, nuevo].sort((a, b) => a.nombre.localeCompare(b.nombre)));
      }
      setModalVisible(false);
    } catch (err) {
      console.error('[Categorias] Error guardando:', err);
      Alert.alert('Error', 'No se pudo guardar la categoría.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = (cat) => {
    Alert.alert(
      'Eliminar Categoría',
      `¿Seguro que quieres eliminar "${cat.nombre}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteCategoria(cat.id);
              setCategorias(prev => prev.filter(c => c.id !== cat.id));
            } catch (err) {
              console.error('[Categorias] Error eliminando:', err);
              Alert.alert('Error', 'No se pudo eliminar la categoría.');
            }
          }
        }
      ]
    );
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>Categorías</Text>
      </View>

      <FlatList
        data={categorias}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.cardInfo}>
              <MaterialCommunityIcons name={item.icono || 'tag-outline'} size={24} color={theme.colors.primary} style={styles.icon} />
              <Text style={styles.cardTitle}>{item.nombre}</Text>
            </View>
            <View style={styles.cardActions}>
              <TouchableOpacity onPress={() => openEditModal(item)} style={styles.actionBtn}>
                <MaterialCommunityIcons name="pencil-outline" size={20} color={theme.colors.onSurfaceVariant} />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleDelete(item)} style={styles.actionBtn}>
                <MaterialCommunityIcons name="delete-outline" size={20} color={theme.colors.error} />
              </TouchableOpacity>
            </View>
          </View>
        )}
      />

      <TouchableOpacity style={styles.fab} onPress={openCreateModal}>
        <MaterialCommunityIcons name="plus" size={28} color={theme.colors.orangeText} />
      </TouchableOpacity>

      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{categoriaEnEdicion ? 'Editar Categoría' : 'Nueva Categoría'}</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <MaterialCommunityIcons name="close" size={24} color={theme.colors.onSurfaceVariant} />
              </TouchableOpacity>
            </View>

            <Text style={styles.label}>Nombre de la categoría</Text>
            <TextInput
              style={styles.input}
              value={nombre}
              onChangeText={setNombre}
              placeholder="Ej. Bebidas"
            />

            <Text style={styles.label}>Ícono (MaterialCommunityIcons)</Text>
            <TextInput
              style={styles.input}
              value={icono}
              onChangeText={setIcono}
              placeholder="Ej. cup-water"
              autoCapitalize="none"
            />

            <TouchableOpacity 
              style={[styles.saveBtn, saving && styles.saveBtnDisabled]} 
              onPress={handleSave} 
              disabled={saving}
            >
              {saving ? (
                <ActivityIndicator color={theme.colors.onPrimary} />
              ) : (
                <Text style={styles.saveBtnText}>Guardar</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { padding: 16, backgroundColor: theme.colors.surface, borderBottomWidth: 1, borderColor: theme.colors.outline },
  title: { fontSize: 20, fontWeight: '700', color: theme.colors.onSurface },
  list: { padding: 16, gap: 12 },
  card: {
    backgroundColor: theme.colors.surface,
    padding: 16,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  cardInfo: { flexDirection: 'row', alignItems: 'center' },
  icon: { marginRight: 12 },
  cardTitle: { fontSize: 16, fontWeight: '600', color: theme.colors.onSurface },
  cardActions: { flexDirection: 'row', gap: 8 },
  actionBtn: { padding: 8, backgroundColor: theme.colors.background, borderRadius: 8 },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: theme.colors.orangeContainer,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#fd8603',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: theme.colors.surface, padding: 24, borderTopLeftRadius: 24, borderTopRightRadius: 24 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', mb: 16 },
  modalTitle: { fontSize: 18, fontWeight: '700', color: theme.colors.onSurface },
  label: { fontSize: 12, fontWeight: '600', color: theme.colors.onSurfaceVariant, marginTop: 12, marginBottom: 4 },
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: theme.colors.outline,
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 14,
    fontWeight: '400',
    color: theme.colors.onSurface,
  },
  saveBtn: {
    backgroundColor: theme.colors.primary,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
  },
  saveBtnDisabled: { opacity: 0.7 },
  saveBtnText: { color: theme.colors.onPrimary, fontWeight: '700', fontSize: 16 },
});
