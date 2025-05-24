
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ContinuarScreen from './app/login/continuar';
import LoginScreen from './app/login/login';
import Register from './app/login/register';


const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Continuar" component={ContinuarScreen} />
        <Stack.Screen name="Registrar" component={Register} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
