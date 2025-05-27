import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { Text, View } from 'react-native';
import HomeScreen from '../(drawer)/(tabs)';
import ListaPlataformas from '../(drawer)/(tabs)/explore';
import { useAuth } from '../context/Auth';
import ContinuarScreen from '../login/continuar';
import LoginScreen from '../login/login';
import Register from '../login/register';


export type RootStackParamList = {
  Login: undefined;
  Continuar: { name: string; email: string; photo?: string; plataforma: string };
  Register: undefined;
  HomeScreen: undefined;
  ListaPlataformas: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export function Router() {
  const { authData, isLoading } = useAuth();

  if (isLoading) {
    return (
      <View style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}>
        <Text>Carregando informações....</Text>
      </View>
    );
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {authData ? (
        <>
          <Stack.Screen name="HomeScreen" component={HomeScreen} />
          <Stack.Screen name="ListaPlataformas" component={ListaPlataformas} />
        </>
      ) : (
        <>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={Register} />
          <Stack.Screen name="Continuar" component={ContinuarScreen} />
        </>
      )}
    </Stack.Navigator>
  );
}
