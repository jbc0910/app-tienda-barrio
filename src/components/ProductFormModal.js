import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { theme } from '../styles/theme';
import { Input } from './Input';
import { Button } from './Button';
import { ImagePickerField } from './ImagePickerField';

const emptyForm = { nombre: '', precio: '', stock: '' };

export const ProductFormModal = ({ visible, producto, onClose, onSubmit, loading }) => {
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [imageAsset, setImageAsset] = useState(null); 
  const [previewUri, setPreviewUri] = useState(null);

  const isEditing = Boolean(producto);

  useEffect(() => {
    if (visible) {
      setForm(
        producto
          ? {
              nombre: producto.nombre ?? '',
              precio: String(producto.precio ?? ''),
              stock: String(producto.stock ?? ''),
            }
          : emptyForm
      );
      setPreviewUri(producto?.imagen_url ?? null);
      setImageAsset(null);
      setErrors({});
    }
  }, [visible, producto]);

  const validate = () => {
    const newErrors = {};
    if (!form.nombre.trim()) newErrors.nombre = 'El nombre es requerido';

    const precioNum = Number(form.precio.replace(',', '.'));
    if (!form.precio || Number.isNaN(precioNum) || precioNum < 0) {
      newErrors.precio = 'Precio inválido';
    }

    const stockNum = Number(form.stock);
    if (form.stock === '' || !Number.isInteger(stockNum) || stockNum < 0) {
      newErrors.stock = 'Stock inválido (número entero)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    onSubmit(
      {
        nombre: form.nombre,
        precio: Number(form.precio.replace(',', '.')),
        stock: Number(form.stock),
      },
      imageAsset
    );
  };

  const handleImageSelected = (asset) => {
    setImageAsset(asset);
    setPreviewUri(asset.uri);
  };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.overlay}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.sheetWrapper}
        >
          <View style={styles.sheet}>
            <View style={styles.header}>
              <Text style={styles.title}>{isEditing ? 'Editar producto' : 'Nuevo producto'}</Text>
              <TouchableOpacity onPress={onClose} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                <MaterialCommunityIcons name="close" size={22} color={theme.colors.onSurfaceVariant} />
              </TouchableOpacity>
            </View>

            <ScrollView keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
              <ImagePickerField previewUri={previewUri} onImageSelected={handleImageSelected} />

              <Input
                label="Nombre del producto"
                icon="tag-outline"
                placeholder="Ej. Arroz Diana 500g"
                value={form.nombre}
                onChangeText={(t) => setForm((f) => ({ ...f, nombre: t }))}
                error={errors.nombre}
              />

              <Input
                label="Precio (COP)"
                icon="currency-usd"
                placeholder="5000"
                keyboardType="numeric"
                value={form.precio}
                onChangeText={(t) => setForm((f) => ({ ...f, precio: t }))}
                error={errors.precio}
              />

              <Input
                label="Stock disponible"
                icon="package-variant-closed"
                placeholder="10"
                keyboardType="number-pad"
                value={form.stock}
                onChangeText={(t) => setForm((f) => ({ ...f, stock: t }))}
                error={errors.stock}
              />

              <Button
                title={isEditing ? 'Guardar cambios' : 'Crear producto'}
                onPress={handleSubmit}
                loading={loading}
                disabled={loading}
              />
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'flex-end',
  },
  sheetWrapper: { maxHeight: '90%' },
  sheet: {
    backgroundColor: theme.colors.surface,
    borderTopLeftRadius: theme.rounded.lg,
    borderTopRightRadius: theme.rounded.lg,
    borderWidth: 1,
    borderColor: theme.colors.outline,
    padding: theme.spacing.lg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  title: { ...theme.typography.titleMd, color: theme.colors.onSurface },
});
