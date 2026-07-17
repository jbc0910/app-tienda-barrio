import React from 'react';
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  StyleSheet,
  View,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { theme } from '../styles/theme';

/**
 * Botón reutilizable con dos variantes de marca:
 *
 *  variant="primary"  → forest-dark (#012d1d) — acciones institucionales
 *  variant="orange"   → orange-cta (#fd8603)  — acciones de conversión (CTA)
 *  variant="outline"  → borde primario, fondo transparente
 *  variant="ghost"    → sin fondo ni borde, solo texto
 *
 * Props adicionales:
 *  - icon   {string}  nombre del ícono (MaterialCommunityIcons) — opcional
 *  - style  {}        estilos de overwrite del contenedor
 */
export const Button = ({
  title,
  onPress,
  loading = false,
  disabled = false,
  variant = 'primary',
  icon,
  style,
}) => {
  const isOrange  = variant === 'orange';
  const isOutline = variant === 'outline';
  const isGhost   = variant === 'ghost';

  const textColor = isOrange
    ? theme.colors.orangeText
    : isOutline || isGhost
      ? theme.colors.primary
      : theme.colors.onPrimary;

  return (
    <TouchableOpacity
      style={[
        styles.base,
        isOrange  && styles.orange,
        isOutline && styles.outline,
        isGhost   && styles.ghost,
        !isOrange && !isOutline && !isGhost && styles.primary,
        (disabled || loading) && styles.disabled,
        style,
      ]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.82}
    >
      {loading ? (
        <ActivityIndicator color={textColor} size="small" />
      ) : (
        <View style={styles.inner}>
          {icon && (
            <MaterialCommunityIcons
              name={icon}
              size={18}
              color={textColor}
              style={styles.icon}
            />
          )}
          <Text style={[styles.text, { color: textColor }]}>{title}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  base: {
    paddingVertical: 14,
    paddingHorizontal: theme.spacing.md,
    borderRadius: theme.rounded.md,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 50,
  },
  primary: {
    backgroundColor: theme.colors.primary,
  },
  orange: {
    backgroundColor: theme.colors.orange,
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: theme.colors.primary,
  },
  ghost: {
    backgroundColor: 'transparent',
  },
  disabled: {
    opacity: 0.45,
  },
  inner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  text: {
    fontSize: 16,
    fontWeight: '700',
  },
  icon: {},
});