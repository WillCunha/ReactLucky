import messaging from '@react-native-firebase/messaging';
import { NavigationContainer } from '@react-navigation/native';
import { Router } from './app/routes/Routes';

export default function App() {

  messaging().onNotificationOpenedApp(remoteMessage => {
    console.log('Notificação aberta!', remoteMessage.notification);
  });

  // Ou para mensagens em segundo plano
  messaging().setBackgroundMessageHandler(async remoteMessage => {
    console.log('Mensagem recebida em segundo plano:', remoteMessage.notification);
  });

  return (
    <NavigationContainer>
      <Router />
    </NavigationContainer>
  );
}
