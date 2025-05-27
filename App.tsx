import { NavigationContainer } from '@react-navigation/native';
import { Router } from './app/routes/Routes';

export default function App() {
  return (
    <NavigationContainer>
      <Router />
    </NavigationContainer>
  );
}
