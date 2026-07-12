import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { supabase } from '../config/supabase';
import { theme } from '../styles/theme';
import { Input } from '../components/Input';
import { Button } from '../components/Button';

export default function RegisterScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [globalError, setGlobalError] = useState('');

  /** Validación básica del formulario */
  const validate = () => {
    const newErrors = {};
    if (!email.trim()) newErrors.email = 'El email es requerido';
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Email inválido';
    if (!password) newErrors.password = 'La contraseña es requerida';
    else if (password.length < 6) newErrors.password = 'Mínimo 6 caracteres';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async () => {
    setGlobalError('');
    if (!validate()) return;

    setLoading(true);
    try {
      // 1. Crear usuario en Supabase Auth
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: email.trim().toLowerCase(),
        password,
      });

      if (signUpError) {
        setGlobalError(
          signUpError.message === 'User already registered'
            ? 'Este email ya está registrado'
            : signUpError.message
        );
        return;
      }

      const newUser = data?.user;
      if (!newUser) {
        setGlobalError('Error al crear el usuario. Intenta de nuevo.');
        return;
      }

      // La creación de la tienda ocurre en SetupTiendaScreen (paso obligatorio
      // siguiente). Si Supabase ya generó una sesión (confirmación de email
      // deshabilitada), onAuthStateChange en AppContext detecta el login y
      // navega automáticamente a SetupTienda al no encontrar tienda asociada.
      if (!data?.session) {
        setGlobalError('Cuenta creada. Revisa tu email para confirmar el acceso.');
      }
    } catch (err) {
      setGlobalError('Error de conexión. Intenta de nuevo.');
      console.error('[RegisterScreen] Error inesperado:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Logo */}
          <View style={styles.logoCircle}>
            <MaterialCommunityIcons
              name="store-plus-outline"
              size={32}
              color={theme.colors.onPrimaryContainer}
            />
          </View>

          <Text style={styles.title}>Crear Cuenta</Text>
          <Text style={styles.subtitle}>
            Registra tu tienda y empieza a vender en tu barrio.
          </Text>

          {/* Toggle Login / Register */}
          <View style={styles.toggleContainer}>
            <TouchableOpacity
              style={styles.toggleButton}
              onPress={() => navigation.navigate('Login')}
            >
              <Text style={styles.toggleText}>Login</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.toggleButton, styles.toggleActive]}>
              <Text style={styles.toggleTextActive}>Register</Text>
            </TouchableOpacity>
          </View>

          {/* Card del formulario */}
          <View style={styles.card}>
            {/* Error global */}
            {globalError ? (
              <View style={styles.errorBanner}>
                <MaterialCommunityIcons
                  name="alert-circle-outline"
                  size={16}
                  color="#f87171"
                />
                <Text style={styles.errorBannerText}>{globalError}</Text>
              </View>
            ) : null}

            <Input
              label="Email"
              icon="email-outline"
              placeholder="hola@tu-tienda.com"
              keyboardType="email-address"
              value={email}
              onChangeText={(t) => {
                setEmail(t);
                setErrors((e) => ({ ...e, email: undefined }));
              }}
              error={errors.email}
            />

            <Input
              label="Contraseña"
              icon="lock-outline"
              placeholder="••••••••"
              secureTextEntry
              value={password}
              onChangeText={(t) => {
                setPassword(t);
                setErrors((e) => ({ ...e, password: undefined }));
              }}
              error={errors.password}
            />

            <Button
              title="Crear Cuenta"
              onPress={handleRegister}
              loading={loading}
              disabled={loading}
            />
          </View>

          <Text style={styles.orText}>o continuar con</Text>
          
            <View style={styles.socialContainer}>
              <TouchableOpacity style={styles.socialButton}>
                <MaterialCommunityIcons name="google" size={20} color="white" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.socialButton}>
                <MaterialCommunityIcons name="apple" size={20} color="white" />
              </TouchableOpacity>
           </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: theme.spacing.md,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: theme.spacing.md,
  },
  logoCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: theme.colors.surfaceBright,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: theme.spacing.md,
  },
  title: {
    ...theme.typography.headlineLg,
    color: theme.colors.onSurface,
    textAlign: 'center',
  },
  subtitle: {
    ...theme.typography.bodyLg,
    color: theme.colors.onPrimaryContainer,
    textAlign: 'center',
    marginBottom: theme.spacing.md,
  },
  toggleContainer: {
    flexDirection: 'row',
    backgroundColor: theme.colors.surfaceDim,
    borderRadius: theme.rounded.md,
    marginBottom: theme.spacing.md,
    padding: 4,
  },
  toggleButton: {
    flex: 1,
    padding: 12,
    alignItems: 'center',
  },
  toggleActive: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.rounded.sm,
  },
  toggleText: {
    color: theme.colors.onSurfaceVariant,
    fontWeight: '600',
  },
  toggleTextActive: {
    color: theme.colors.onPrimary,
    fontWeight: '600',
  },
  card: {
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.lg,
    borderRadius: theme.rounded.md,
    borderWidth: 1,
    borderColor: theme.colors.outline,
  },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(248,113,113,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(248,113,113,0.3)',
    borderRadius: theme.rounded.sm,
    padding: theme.spacing.sm,
    marginBottom: theme.spacing.md,
    gap: 8,
  },
  errorBannerText: {
    color: '#f87171',
    fontSize: 13,
    flex: 1,
  },
  socialContainer: {
    flexDirection: 'row',
    gap: theme.spacing.md,
  },
  socialButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: theme.colors.outline,
    padding: 12,
    alignItems: 'center',
    borderRadius: theme.rounded.sm,
  },
});