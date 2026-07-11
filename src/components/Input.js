import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { theme } from '../styles/theme';

export const Input = ({ label, icon, ...props }) => (
  <View style={styles.wrapper}>
    <Text style={styles.label}>{label}</Text>
    <View style={styles.inputContainer}>
      <MaterialCommunityIcons name={icon} size={20} color={theme.colors.onSurfaceVariant} style={styles.icon} />
      <TextInput 
        style={styles.input} 
        placeholderTextColor={theme.colors.onSurfaceVariant}
        {...props} 
      />
    </View>
  </View>
);

const styles = StyleSheet.create({
  wrapper: { marginBottom: theme.spacing.md },
  label: { ...theme.typography.labelCaps, color: theme.colors.onSurfaceVariant, marginBottom: 8 },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface, 
    borderWidth: 1,
    borderColor: theme.colors.outline,
    borderRadius: theme.rounded.md,
    paddingHorizontal: theme.spacing.sm,
  },
  icon: { marginRight: 15, color: theme.colors.onPrimaryContainer },
  input: { flex: 1, paddingVertical: 12, color: theme.colors.onSurface }
});