import { Stack } from "expo-router";

export default function TabLayout() {

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
      <Stack.Screen name="index" options={{headerShown: true, title: 'Início'}}/>
      <Stack.Screen name="explore" options={{headerShown: true, title: 'Plataformas'}}/>
      <Stack.Screen name="congrats" options={{headerShown: false, title: 'Plataformas'}}/>

    </Stack>
  );
}
