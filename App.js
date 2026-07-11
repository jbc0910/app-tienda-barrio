import React from 'react';
import { SafeAreaView, StyleSheet, Text, View, ActivityIndicator } from 'react-native';
import { AppProvider, useApp } from './src/context/AppContext';
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';

const MainNavigator = () => {
  const { currentScreen, isGlobalLoading } = useApp();

  if (isGlobalLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#6366f1" />
        <Text style={styles.textCargando}>Iniciando SaaS...</Text>
      </View>
    );
  }

  switch (currentScreen) {
    case 'LOGIN':
      return <LoginScreen />;
    case 'REGISTER': // Nueva línea agregada
      return <RegisterScreen />; // Nueva línea agregada
    case 'SETUP_TIENDA':
      return <View style={styles.center}><Text style={styles.textTitulo}>Configurar Tienda 🏪</Text></View>;
    case 'DASHBOARD':
      return <View style={styles.center}><Text style={styles.textTitulo}>Dashboard del Tendero 📊</Text></View>;
    default:
      return <View style={styles.center}><Text style={styles.textTitulo}>Cargando...</Text></View>;
  }
};

export default function App() {
  return (
    <AppProvider>
      <SafeAreaView style={styles.container}>
        <MainNavigator />
      </SafeAreaView>
    </AppProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0b0f19',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0b0f19',
  },
  textTitulo: {
    color: '#f3f4f6',
    fontSize: 22,
    fontWeight: 'bold',
  },
  textCargando: {
    color: '#818cf8',
    fontSize: 16,
    marginTop: 12,
  },
});