import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { supabase } from '../config/supabase';
import { theme } from '../styles/theme';
import { Input } from '../components/Input';
import { Button } from '../components/Button';

export default function ForgotPasswordScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [sent, setSent] = useState(false);

  const handleReset = async () => {
    setError('');
    if (!email.trim()) {
      setError('El email es requerido.');
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Ingresa un email válido.');
      return;
    }

    setLoading(true);
    try {
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(
        email.trim().toLowerCase(),
        // redirectTo apunta al deep link de tu app para manejar el token
        // Configura esto en Supabase → Auth → URL Configuration → Redirect URLs
        // Ej: com.tuapp://reset-password
        { redirectTo: undefined }
      );

      if (resetError) {
        setError(resetError.message);
      } else {
        setSent(true);
      }
    } catch (err) {
      setError('Error de conexión. Intenta de nuevo.');
      console.error('[ForgotPassword] Error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Back button */}
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.goBack()}
        >
          <MaterialCommunityIcons
            name="arrow-left"
            size={22}
            color={theme.colors.onSurface}
          />
          <Text style={styles.backText}>Volver</Text>
        </TouchableOpacity>

        {/* Icon */}
        <View style={styles.iconCircle}>
          <MaterialCommunityIcons
            name="lock-reset"
            size={32}
            color={theme.colors.onPrimaryContainer}
          />
        </View>

        <Text style={styles.title}>Recuperar contraseña</Text>
        <Text style={styles.subtitle}>
          Te enviaremos un enlace a tu correo para restablecer tu contraseña.
        </Text>

        {sent ? (
          /* ── Estado: email enviado ── */
          <View style={styles.card}>
            <View style={styles.successBanner}>
              <MaterialCommunityIcons
                name="check-circle-outline"
                size={20}
                color="#166534"
              />
              <Text style={styles.successText}>
                ¡Listo! Revisa tu bandeja de entrada y sigue las instrucciones del
                correo. También revisa spam o correo no deseado.
              </Text>
            </View>

            <Button
              title="Volver al inicio de sesión"
              onPress={() => navigation.navigate('Login')}
            />
          </View>
        ) : (
          /* ── Formulario ── */
          <View style={styles.card}>
            {error ? (
              <View style={styles.errorBanner}>
                <MaterialCommunityIcons
                  name="alert-circle-outline"
                  size={16}
                  color="#f87171"
                />
                <Text style={styles.errorText}>{error}</Text>
              </View>
            ) : null}

            <Input
              label="Email"
              icon="email-outline"
              placeholder="tu@email.com"
              keyboardType="email-address"
              value={email}
              onChangeText={(t) => {
                setEmail(t);
                setError('');
              }}
              error={error && !email ? error : undefined}
            />

            <Button
              title="Enviar enlace de recuperación"
              onPress={handleReset}
              loading={loading}
              disabled={loading}
            />
          </View>
        )}
      </ScrollView>
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
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: theme.spacing.lg,
    alignSelf: 'flex-start',
  },
  backText: {
    ...theme.typography.bodySm,
    color: theme.colors.onSurface,
    fontWeight: '600',
  },
  iconCircle: {
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
  card: {
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.lg,
    borderRadius: theme.rounded.md,
    borderWidth: 1,
    borderColor: theme.colors.outline,
    gap: theme.spacing.md,
  },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(248,113,113,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(248,113,113,0.3)',
    borderRadius: theme.rounded.sm,
    padding: theme.spacing.sm,
    gap: 8,
  },
  errorText: {
    color: '#f87171',
    fontSize: 13,
    flex: 1,
  },
  successBanner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: theme.colors.successContainer,
    borderWidth: 1,
    borderColor: 'rgba(22,101,52,0.2)',
    borderRadius: theme.rounded.sm,
    padding: theme.spacing.sm,
    gap: 8,
  },
  successText: {
    color: theme.colors.success,
    fontSize: 14,
    flex: 1,
    lineHeight: 20,
  },
});
