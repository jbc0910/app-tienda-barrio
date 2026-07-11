import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { theme } from '../styles/theme';

/**
 * Input reutilizable con ícono, label y soporte de error.
 *
 * Props:
 *  - label        {string}    Etiqueta superior
 *  - icon         {string}    Nombre del ícono (MaterialCommunityIcons)
 *  - iconColor    {string}    Color del ícono (opcional)
 *  - error        {string}    Mensaje de error (muestra borde rojo + texto)
 *  - value        {string}    Valor controlado
 *  - onChangeText {function}  Callback de cambio
 *  - ...props                 Resto de props para TextInput
 */
export const Input = ({ label, icon, iconColor, error, ...props }) => (
  <View style={styles.wrapper}>
    {label ? <Text style={styles.label}>{label}</Text> : null}
    <View style={[styles.inputContainer, error && styles.inputContainerError]}>
      {icon ? (
        <MaterialCommunityIcons
          name={icon}
          size={20}
          color={iconColor ?? theme.colors.onPrimaryContainer}
          style={styles.icon}
        />
      ) : null}
      <TextInput
        style={styles.input}
        placeholderTextColor={theme.colors.onSurfaceVariant}
        autoCapitalize="none"
        autoCorrect={false}
        {...props}
      />
    </View>
    {error ? <Text style={styles.errorText}>{error}</Text> : null}
  </View>
);

const styles = StyleSheet.create({
  wrapper: { marginBottom: theme.spacing.md },
  label: {
    ...theme.typography.labelCaps,
    color: theme.colors.onSurfaceVariant,
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.outline,
    borderRadius: theme.rounded.md,
    paddingHorizontal: theme.spacing.sm,
  },
  inputContainerError: {
    borderColor: '#f87171',
  },
  icon: { marginRight: 10 },
  input: {
    flex: 1,
    paddingVertical: 13,
    color: theme.colors.onSurface,
    fontSize: 15,
  },
  errorText: {
    color: '#f87171',
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
  },
});