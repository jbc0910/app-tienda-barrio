import React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { theme } from '../styles/theme';

export const SearchBar = ({ value, onChangeText, placeholder = "¿Qué necesitas hoy?" }) => {
  return (
    <View style={styles.container}>
      <MaterialCommunityIcons name="magnify" size={24} color={theme.colors.onSurfaceVariant} style={styles.icon} />
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={theme.colors.onSurfaceMuted}
        autoCorrect={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.rounded.full, // 24px-like rounded
    paddingHorizontal: theme.spacing.md,
    height: 48,
    shadowColor: theme.shadow.sm.shadowColor,
    shadowOpacity: theme.shadow.sm.shadowOpacity,
    shadowRadius: theme.shadow.sm.shadowRadius,
    shadowOffset: theme.shadow.sm.shadowOffset,
    elevation: theme.shadow.sm.elevation,
    borderWidth: 1,
    borderColor: theme.colors.outline,
    marginBottom: theme.spacing.md,
  },
  icon: {
    marginRight: theme.spacing.sm,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: theme.colors.onSurface,
  },
});
