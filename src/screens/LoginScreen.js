import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import { theme } from '../styles/theme';
import { Input } from '../components/Input';
import { Button } from '../components/Button';

export default function LoginScreen() {
  const { setCurrentScreen } = useApp();

  return (
    <SafeAreaView style={styles.container}>
        <View style={styles.logoCircle}>
          <MaterialCommunityIcons name="store" size={32} color={theme.colors.onPrimaryContainer} />
        </View>

        <Text style={styles.title}>Bienvenido</Text>
        <Text style={styles.subtitle}>Accede a la exclusividad de tu barrio con un solo toque.</Text>

        <View style={styles.toggleContainer}>
          <TouchableOpacity style={[styles.toggleButton, styles.toggleActive]}>
            <Text style={styles.toggleText}>Login</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.toggleButton} onPress={() => setCurrentScreen('REGISTER')}>
            <Text style={styles.toggleText}>Register</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.card}>
        <Input label="Email" icon="email-outline" iconColor={theme.colors.onPrimaryContainer} placeholder="tu@email.com" />
        
        <View style={styles.passwordHeader}>
          <Text style={styles.label}>Password</Text>
          <TouchableOpacity><Text style={styles.forgotText}>¿Olvidaste?</Text></TouchableOpacity>
        </View>
        <Input icon="lock-outline" iconColor={theme.colors.onPrimaryContainer} placeholder="********" secureTextEntry />
        
        <Button title="Acceder" />

        <Text style={styles.orText}>o continuar con</Text>
        
        <View style={styles.socialContainer}>
           <View style={styles.socialButton}><MaterialCommunityIcons name="google" size={20} color="white" /></View>
           <View style={styles.socialButton}><MaterialCommunityIcons name="apple" size={20} color="white" /></View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background, justifyContent: 'center', padding: theme.spacing.md },
  card: { backgroundColor: theme.colors.surface, padding: theme.spacing.lg, borderRadius: theme.rounded.md, borderWidth: 1, borderColor: theme.colors.outline },
  logoCircle: { width: 64, height: 64, borderRadius: 32, backgroundColor: theme.colors.surfaceBright, alignItems: 'center', justifyContent: 'center', alignSelf: 'center', marginBottom: theme.spacing.md },
  title: { ...theme.typography.headlineLg, color: theme.colors.onSurface, textAlign: 'center' },
  subtitle: { ...theme.typography.bodyLg, color: theme.colors.onPrimaryContainer, textAlign: 'center', marginBottom: theme.spacing.md },
  toggleContainer: { flexDirection: 'row', backgroundColor: theme.colors.surfaceDim, borderRadius: theme.rounded.md, marginBottom: theme.spacing.md, padding: 4 },
  toggleButton: { flex: 1, padding: 12, alignItems: 'center' },
  toggleActive: { backgroundColor: theme.colors.primary, borderRadius: theme.rounded.sm },
  toggleText: { color: theme.colors.onPrimaryContainer, fontWeight: '600' },
  passwordHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  label: { ...theme.typography.labelCaps, color: theme.colors.onSurfaceVariant },
  forgotText: { ...theme.typography.labelCaps, color: theme.colors.onPrimaryContainer },
  orText: { color: theme.colors.onSurfaceVariant, textAlign: 'center', marginVertical: theme.spacing.sm },
  socialContainer: { flexDirection: 'row', gap: theme.spacing.md },
  socialButton: { flex: 1, borderWidth: 1, borderColor: theme.colors.outline, padding: 12, alignItems: 'center', borderRadius: theme.rounded.sm }
});