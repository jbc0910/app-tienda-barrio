import React from 'react';
import { View, StyleSheet, ActivityIndicator, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { AppProvider, useApp } from './src/context/AppContext';
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import { theme } from './src/styles/theme';

const Stack = createStackNavigator();

/** Pantallas placeholder — se implementarán en próximas iteraciones */
const SetupTiendaScreen = () => (
  <View style={styles.center}>
    <Text style={styles.textTitulo}>Configurar Tienda 🏪</Text>
  </View>
);

const DashboardScreen = () => (
  <View style={styles.center}>
    <Text style={styles.textTitulo}>Dashboard del Tendero 📊</Text>
  </View>
);

/** Stack para usuarios NO autenticados */
const AuthStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerShown: false,
      cardStyle: { backgroundColor: theme.colors.background },
      animationEnabled: true,
    }}
  >
    <Stack.Screen name="Login" component={LoginScreen} />
    <Stack.Screen name="Register" component={RegisterScreen} />
  </Stack.Navigator>
);

/** Stack para usuarios autenticados sin tienda configurada */
const SetupStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="SetupTienda" component={SetupTiendaScreen} />
  </Stack.Navigator>
);

/** Stack para usuarios autenticados con tienda */
const AppStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Dashboard" component={DashboardScreen} />
  </Stack.Navigator>
);

/** Decide qué stack renderizar según el estado de autenticación */
const RootNavigator = () => {
  const { user, tienda, isGlobalLoading } = useApp();

  if (isGlobalLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={styles.textCargando}>Iniciando...</Text>
      </View>
    );
  }

  if (!user) return <AuthStack />;
  if (!tienda) return <SetupStack />;
  return <AppStack />;
};

export default function App() {
  return (
    <AppProvider>
      <NavigationContainer>
        <RootNavigator />
      </NavigationContainer>
    </AppProvider>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
  },
  textTitulo: {
    color: theme.colors.onSurface,
    fontSize: 22,
    fontWeight: 'bold',
  },
  textCargando: {
    color: theme.colors.primary,
    fontSize: 16,
    marginTop: 12,
  },
});