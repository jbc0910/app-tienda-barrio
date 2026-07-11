import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { theme } from '../styles/theme';

/**
 * Botón primario reutilizable.
 *
 * Props:
 *  - title      {string}    Texto del botón
 *  - onPress    {function}  Callback al presionar
 *  - loading    {boolean}   Muestra spinner y deshabilita el botón
 *  - disabled   {boolean}   Deshabilita el botón visualmente
 */
export const Button = ({ title, onPress, loading = false, disabled = false }) => {
  const isDisabled = loading || disabled;

  return (
    <TouchableOpacity
      style={[styles.button, isDisabled && styles.buttonDisabled]}
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator size="small" color={theme.colors.onPrimary} />
      ) : (
        <Text style={styles.text}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: theme.colors.primary,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.rounded.md,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  text: {
    color: theme.colors.onPrimary,
    fontWeight: '600',
    fontSize: 16,
  },
});