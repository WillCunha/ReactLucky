import AsyncStorage from '@react-native-async-storage/async-storage';
import messaging from '@react-native-firebase/messaging';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Alert, Button, Text, View } from 'react-native';

export default function PushNotification() {
  const [token, setToken] = React.useState<string | null>(null);
  const [userData, setUserData] = useState<{ id: string } | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const jsonString = await AsyncStorage.getItem("WF_LUCKY"); // Pegando os dados do AsyncStorage

        if (!jsonString) {
          console.warn("Nenhum dado encontrado no AsyncStorage");
          return; // Se a chave não existir, evitamos chamar JSON.parse()
        }

        const jsonData = JSON.parse(jsonString); // Parseando os dados

        console.log(JSON.stringify(jsonData));

        if (Array.isArray(jsonData) && jsonData.length > 0 && jsonData[0].id) {
          setUserData({
            id: jsonData[0].id
          });
        } else {
          console.warn("Formato de dados inválido no AsyncStorage");
        }
      } catch (error) {
        console.error("Erro ao buscar os dados:", error);
        setUserData(null);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (!userData) return; // Garante que o userData esteja preenchido

    // As permissões são solicitadas e o token FCM só é buscado se userData estiver válido
    const getTokenAndSubscribe = async () => {
      try {
        await requestUserPermission(); // Solicita permissão
        await getFcmToken(); // Obtém o token FCM

        const unsubscribe = messaging().onMessage(async remoteMessage => {
          Alert.alert('Nova notificação!', JSON.stringify(remoteMessage.notification));
        });

        return unsubscribe; // Retorna o unsubscribe para ser limpo quando necessário
      } catch (error) {
        console.error('Erro ao solicitar permissão ou obter FCM token:', error);
      }
    };

    getTokenAndSubscribe();

  }, [userData]); // Reexecuta quando o userData for atualizado

  const requestUserPermission = async () => {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      console.log('Permissão para notificações:', authStatus);
    } else {
      console.warn('Permissão para notificações não concedida');
    }
  };

  const getFcmToken = async () => {
    try {
      const fcmToken = await messaging().getToken();
      if (fcmToken) {
        console.log('FCM Token:', fcmToken);
        setToken(fcmToken);
        sendTokenToServer(fcmToken);
      } else {
        console.warn('Não foi possível obter o token FCM');
      }
    } catch (error) {
      Alert.alert('Erro ao obter o token FCM:', JSON.stringify(error));
    }
  };

  const sendTokenToServer = async (fcmToken: string) => {
    if (!userData?.id) {
      console.warn('ID do usuário não disponível');
      return;
    }

    try {
      const response = await axios.post('https://api.wfsoft.com.br/wf-lucky/api/lucky/tokenFCM/update', {
        id_user: userData.id,  // ID do usuário autenticado
        token: fcmToken,
      });

      console.log('Token enviado com sucesso:', response.data);
      Alert.alert('Token enviado com sucesso:', response.data);
    } catch (error) {
      console.error('Erro ao enviar token para o servidor:', error);
      Alert.alert('Erro ao enviar token para o servidor:', JSON.stringify(error));
    }
  };

  const handleTestNotification = async () => {
    Alert.alert('Token:', token || 'Token não disponível');
  };
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>FCM Token:</Text>
      <Text selectable>{token || 'Obtendo token...'}</Text>
      <Button title="Testar Notificação" onPress={handleTestNotification} />
    </View>
  );
}
