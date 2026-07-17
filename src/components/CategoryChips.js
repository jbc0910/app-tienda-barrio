import React from 'react';
import { ScrollView, TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { theme } from '../styles/theme';

export const CategoryChips = ({ categorias, activeId, onSelect, hideAll = false }) => {
  return (
    <View style={styles.wrapper}>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {!hideAll && (
          <TouchableOpacity 
            style={[styles.chip, !activeId && styles.chipActive]}
            onPress={() => onSelect(null)}
            activeOpacity={0.8}
          >
            <MaterialCommunityIcons 
              name="storefront-outline" 
              size={18} 
              color={!activeId ? theme.colors.primaryLight : theme.colors.onSurfaceVariant} 
            />
            <Text style={[styles.text, !activeId && styles.textActive]}>Todos</Text>
          </TouchableOpacity>
        )}
        
        {categorias.map((cat) => {
          const isActive = activeId === cat.id;
          return (
            <TouchableOpacity
              key={cat.id}
              style={[styles.chip, isActive && styles.chipActive]}
              onPress={() => onSelect(cat.id)}
              activeOpacity={0.8}
            >
              {cat.icono && (
                <MaterialCommunityIcons 
                  name={cat.icono} 
                  size={18} 
                  color={isActive ? theme.colors.primaryLight : theme.colors.onSurfaceVariant} 
                />
              )}
              <Text style={[styles.text, isActive && styles.textActive]}>
                {cat.nombre}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: theme.spacing.md,
  },
  scrollContent: {
    paddingHorizontal: theme.spacing.lg,
    gap: theme.spacing.sm,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: theme.colors.chipInactive,
    borderRadius: theme.rounded.full,
  },
  chipActive: {
    backgroundColor: theme.colors.chipActive,
  },
  text: {
    fontSize: 14,
    fontWeight: '500',
    color: theme.colors.onSurface,
  },
  textActive: {
    color: theme.colors.primaryLight,
  }
});
