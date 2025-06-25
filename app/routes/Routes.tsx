import Gratidao from '@/src/components/gratidao';
import Ops from '@/src/components/ops';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { Text, View } from 'react-native';
import AdsScreen from '../(drawer)/(tabs)/ads';
import ConfigScreen from '../(drawer)/(tabs)/config';
import CongratsScreen from '../(drawer)/(tabs)/congrats';
import Deck from '../(drawer)/(tabs)/deck';
import ListaPlataformas from '../(drawer)/(tabs)/explore';
import Loja from '../(drawer)/(tabs)/Loja';
import PerguntasScreen from '../(drawer)/(tabs)/perguntas';
import Tabs from '../(drawer)/(tabs)/Tabs';
import Wallet from '../(drawer)/(tabs)/Wallet';
import { useAuth } from '../context/Auth';
import ContinuarScreen from '../login/continuar';
import LoginScreen from '../login/login';
import Register from '../login/register';
import PushNotification from '../PushNotification';


export type RootStackParamList = {
  Login: undefined;
  Continuar: { name: string; email: string; photo?: string; plataforma: string };
  Register: undefined;
  HomeScreen: undefined;
  ListaPlataformas: undefined;
  Congrats: undefined;
  Gratidao: undefined
  Ops: undefined
  Deck: undefined
  PushNotification: undefined
  Perguntas: undefined
  Loja: undefined
  Wallet: undefined
  Ads: undefined
  Config: undefined
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
          <Stack.Screen name="HomeScreen" component={Tabs} />
          <Stack.Screen name="ListaPlataformas" component={ListaPlataformas} />
          <Stack.Screen name="Congrats" component={CongratsScreen} />
          <Stack.Screen name="Gratidao" component={Gratidao} />
          <Stack.Screen name="PushNotification" component={PushNotification} />
          <Stack.Screen name="Ops" component={Ops} />
          <Stack.Screen name="Deck" component={Deck} />
          <Stack.Screen name="Perguntas" component={PerguntasScreen} />
          <Stack.Screen name="Loja" component={Loja} />
          <Stack.Screen name="Wallet" component={Wallet} />
          <Stack.Screen name="Ads" component={AdsScreen} />
          <Stack.Screen name="Config" component={ConfigScreen} />
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
