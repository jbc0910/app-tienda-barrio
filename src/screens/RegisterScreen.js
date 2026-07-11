import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import { theme } from '../styles/theme';
import { Input } from '../components/Input';
import { Button } from '../components/Button';

export default function RegisterScreen() {
  const { setCurrentScreen } = useApp();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.card}>
          <Text style={styles.title}>Bienvenido</Text>
          <Text style={styles.subtitle}>Accede a la exclusividad de tu barrio con un solo toque.</Text>
          <View style={styles.toggleContainer}>
            <TouchableOpacity style={styles.toggleButton} onPress={() => setCurrentScreen('LOGIN')}>
              <Text style={styles.toggleText}>Login</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.toggleButton, styles.toggleActive]}>
              <Text style={styles.toggleText}>Register</Text>
            </TouchableOpacity>
          </View>

          <Input label="Nombre de la Tienda" icon="store-outline" placeholder="Ej. El Mercadito" />
          <Input label="Email" icon="email-outline" placeholder="hola@tu-tienda.com" />
          <Text style={styles.label}>Contraseña</Text>
          <Input icon="lock-outline" placeholder="••••••••" secureTextEntry />

          <Button title="Crear Cuenta" />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  scrollContent: { padding: theme.spacing.md, justifyContent: 'center', flexGrow: 1 },
  card: { backgroundColor: theme.colors.surface, padding: theme.spacing.lg, borderRadius: theme.rounded.md, borderWidth: 1, borderColor: theme.colors.outline },
  title: { ...theme.typography.headlineLg, color: theme.colors.onSurface, textAlign: 'center', marginBottom: theme.spacing.md },
  subtitle: { ...theme.typography.bodyLg, color: theme.colors.onPrimaryContainer, textAlign: 'center', marginBottom: theme.spacing.md },
  toggleContainer: { flexDirection: 'row', backgroundColor: theme.colors.surfaceDim, borderRadius: theme.rounded.md, marginBottom: theme.spacing.md, padding: 4 },
  toggleButton: { flex: 1, padding: 12, alignItems: 'center' },
  toggleActive: { backgroundColor: theme.colors.primary, borderRadius: theme.rounded.sm },
  toggleText: { color: 'white', fontWeight: '600' },
  label: { ...theme.typography.labelCaps, color: theme.colors.onSurfaceVariant, marginBottom: 8 }
});