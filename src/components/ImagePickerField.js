import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { theme } from '../styles/theme';

const PICKER_OPTIONS = {
  mediaTypes: ['images'],
  allowsEditing: true,
  aspect: [1, 1],
  quality: 0.7,
  base64: true,
};

export const ImagePickerField = ({ previewUri, onImageSelected }) => {
  const pickFrom = async (source) => {
    const permission =
      source === 'camera'
        ? await ImagePicker.requestCameraPermissionsAsync()
        : await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      Alert.alert(
        'Permiso requerido',
        source === 'camera'
          ? 'Necesitamos acceso a tu cámara para tomar la foto.'
          : 'Necesitamos acceso a tus fotos para elegir una imagen.'
      );
      return;
    }

    const result =
      source === 'camera'
        ? await ImagePicker.launchCameraAsync(PICKER_OPTIONS)
        : await ImagePicker.launchImageLibraryAsync(PICKER_OPTIONS);

    if (result.canceled || !result.assets?.length) return;

    onImageSelected(result.assets[0]);
  };

  const showSourceOptions = () => {
    Alert.alert('Foto del producto', '¿De dónde quieres tomar la imagen?', [
      { text: 'Cámara', onPress: () => pickFrom('camera') },
      { text: 'Galería', onPress: () => pickFrom('library') },
      { text: 'Cancelar', style: 'cancel' },
    ]);
  };

  return (
    <TouchableOpacity style={styles.wrapper} onPress={showSourceOptions} activeOpacity={0.8}>
      {previewUri ? (
        <Image source={{ uri: previewUri }} style={styles.preview} />
      ) : (
        <View style={styles.placeholder}>
          <MaterialCommunityIcons
            name="camera-plus-outline"
            size={28}
            color={theme.colors.onSurfaceVariant}
          />
          <Text style={styles.placeholderText}>Agregar foto</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    width: 120,
    height: 120,
    borderRadius: theme.rounded.md,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.outline,
    alignSelf: 'center',
    overflow: 'hidden',
    marginBottom: theme.spacing.md,
  },
  preview: { width: '100%', height: '100%' },
  placeholder: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 6 },
  placeholderText: {
    ...theme.typography.labelCaps,
    color: theme.colors.onSurfaceVariant,
  },
});
