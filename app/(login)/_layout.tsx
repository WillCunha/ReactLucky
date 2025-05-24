import { Stack } from "expo-router";


export default function RootLayout() {
  return (
    <Stack screenOptions={{
      headerStyle: {
        backgroundColor: '#3CAF54',
      },
      headerTintColor: '#fff',
      headerTitleStyle: {
        fontWeight: 'bold',
      },
    }}>
      <Stack.Screen name="login" options={{headerShown: true, title: 'Entrar'}}/>
      <Stack.Screen name="register" options={{headerShown: false, title: 'Registrar-se'}}/>
      <Stack.Screen name="continuar" options={{headerShown: true, title: 'Concluir Cadastro'}}/>

    </Stack>
  )
}