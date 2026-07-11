import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import { theme } from '../styles/theme';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { supabase } from '../config/supabase';

export default function RegisterScreen() {
  const { setCurrentScreen } = useApp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignUp = async () => {
    setLoading(true);
    const { data, error } = await supabase.auth.signUp({
      email: email,
      password: password,
    });
    
    if (error) {
      alert(error.message);
    } else {
      alert('Registro exitoso. ¡Verifica tu email!');
    }
    setLoading(false);
  };

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

          <Input 
          label="Nombre de la Tienda" 
          icon="store-outline" 
          iconcolor="#FFD1DC"
          placeholder="Ej. El Mercadito" 
          />

        <Input 
          label="Email" 
          icon="email-outline" 
          iconcolor="#FFD1DC"
          placeholder="hola@tu-tienda.com"
          value={email} 
          onChangeText={setEmail} 
          autoCapitalize="none"
          />

        <Text style={styles.label}>Contraseña</Text>
        <Input
          icon="lock-outline" 
          iconcolor="#FFD1DC"
          placeholder="••••••••" 
          secureTextEntry
          value={password} 
          onChangeText={setPassword} 
          />

        <Button 
          title={loading ? "Creando cuenta..." : "Crear Cuenta"} 
          onPress={handleSignUp}
          disabled={loading}
          />

          <Text style={styles.orText}>o continuar con</Text>
                  
          <View style={styles.socialContainer}>
          <View style={styles.socialButton}><MaterialCommunityIcons name="google" size={20} color="white" /></View>
          <View style={styles.socialButton}><MaterialCommunityIcons name="apple" size={20} color="white" /></View>
          </View>
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
  label: { ...theme.typography.labelCaps, color: theme.colors.onSurfaceVariant, marginBottom: 8 },
  orText: { color: theme.colors.onSurfaceVariant, textAlign: 'center', marginVertical: theme.spacing.sm },
  socialContainer: { flexDirection: 'row', gap: theme.spacing.md },
  socialButton: { flex: 1, borderWidth: 1, borderColor: theme.colors.outline, padding: 12, alignItems: 'center', borderRadius: theme.rounded.sm }
});