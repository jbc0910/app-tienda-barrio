import 'react-native-gesture-handler';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import React, { useEffect } from 'react';
import { View, StyleSheet, ActivityIndicator, LogBox } from 'react-native';

// Suprimir advertencias internas de librerías de terceros que no son accionables
LogBox.ignoreLogs([
  'InteractionManager has been deprecated',
]);
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import * as Linking from 'expo-linking';
import { AppProvider, useApp } from './src/context/AppContext';
import { supabase } from './src/config/supabase';
import { theme } from './src/styles/theme';

import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import SetupTiendaScreen from './src/screens/SetupTiendaScreen';
import DashboardScreen from './src/screens/DashboardScreen';
import CatalogoScreen from './src/screens/CatalogoScreen';
import CartScreen from './src/screens/CartScreen';
import { CartProvider } from './src/context/CartContext';

const Stack = createStackNavigator();

const RootNavigator = () => {
  const { user, tienda, isGlobalLoading } = useApp();

  if (isGlobalLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!user ? (
        <>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
        </>
      ) : !tienda ? (
        <Stack.Screen name="SetupTienda" component={SetupTiendaScreen} />
      ) : (
        <>
          <Stack.Screen name="Dashboard" component={DashboardScreen} />
          <Stack.Screen name="Catalogo" component={CatalogoScreen} />
          <Stack.Screen name="Cart" component={CartScreen} />
        </>
      )}
    </Stack.Navigator>
  );
};

export default function App() {
  useEffect(() => {
    const handleDeepLink = async (event) => {
      await supabase.auth.exchangeCodeForSession(event.url);
    };

    Linking.getInitialURL().then(url => {
      if (url) handleDeepLink({ url });
    });

    const sub = Linking.addEventListener('url', handleDeepLink);
    return () => sub.remove();
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AppProvider>
        <CartProvider>
          <NavigationContainer>
            <RootNavigator />
          </NavigationContainer>
        </CartProvider>
      </AppProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: theme.colors.background },
});