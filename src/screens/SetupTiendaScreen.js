import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, Alert } from 'react-native';
import { useApp } from '../context/AppContext';
import { supabase } from '../config/supabase';
import { theme } from '../styles/theme';
import { Input } from '../components/Input';
import { Button } from '../components/Button';

export default function SetupTiendaScreen() {
  const { user, setTienda, setCurrentScreen } = useApp();
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    nombre: '',
    categoria: '', // Podrías usar un Picker si prefieres, por ahora text input
    direccion: '',
    telefono: '',
  });

  const handleCreateTienda = async () => {
    if (!formData.nombre || !formData.categoria) {
      Alert.alert('Error', 'Por favor llena los campos obligatorios');
      return;
    }

    setLoading(true);
    
    // Insertamos en Supabase
    const { data, error } = await supabase
      .from('tiendas')
      .insert([
        {
          usuario_id: user.id,
          nombre: formData.nombre,
          categoria: formData.categoria,
          direccion: formData.direccion,
          telefono: formData.telefono,
        },
      ])
      .select()
      .single();

    if (error) {
      Alert.alert('Error', error.message);
    } else {
      setTienda(data);
      setCurrentScreen('DASHBOARD');
    }
    setLoading(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Configura tu tienda</Text>
        <Text style={styles.subtitle}>Completa los datos para comenzar.</Text>

        <View style={styles.form}>
          <Input 
            label="Nombre de la Tienda" 
            icon="store-outline" 
            value={formData.nombre}
            onChangeText={(text) => setFormData({...formData, nombre: text})}
          />
          <Input 
            label="Categoría" 
            icon="shape-outline" 
            value={formData.categoria}
            onChangeText={(text) => setFormData({...formData, categoria: text})}
          />
          <Input 
            label="Dirección" 
            icon="map-marker-outline" 
            value={formData.direccion}
            onChangeText={(text) => setFormData({...formData, direccion: text})}
          />
          <Input 
            label="Teléfono" 
            icon="phone-outline" 
            value={formData.telefono}
            onChangeText={(text) => setFormData({...formData, telefono: text})}
          />

          <Button 
            title={loading ? "Guardando..." : "Continuar"} 
            onPress={handleCreateTienda} 
            disabled={loading}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  scrollContent: { padding: theme.spacing.lg, flexGrow: 1, justifyContent: 'center' },
  title: { ...theme.typography.headlineLg, color: theme.colors.onSurface, textAlign: 'center', marginBottom: theme.spacing.sm },
  subtitle: { ...theme.typography.bodyLg, color: theme.colors.onSurfaceVariant, textAlign: 'center', marginBottom: theme.spacing.xl },
  form: { gap: theme.spacing.md }
});