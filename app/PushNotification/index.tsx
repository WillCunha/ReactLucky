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
  
          if (Array.isArray(jsonData) && jsonData.length > 0) {
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
    requestUserPermission();
    getFcmToken();
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      Alert.alert('Nova notificação!', JSON.stringify(remoteMessage.notification));
    });

    return unsubscribe;
  }, []);

  const requestUserPermission = async () => {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      console.log('Permissão para notificações:', authStatus);
    }
  };

  const getFcmToken = async () => {
    try {
      const fcmToken = await messaging().getToken();
      if (fcmToken) {
        console.log('FCM Token:', fcmToken);
        setToken(fcmToken);
        sendTokenToServer(fcmToken);
      }
    } catch (error) {
      Alert.alert('Erro ao obter o token FCM:', JSON.stringify(error));
    }
  };


  const sendTokenToServer = async (fcmToken: string) => {
    try {
      const response = await axios.post('https://api.wfsoft.com.br/wf-lucky/api/lucky/tokenFCM/update', {
        token: fcmToken,
        id: userData?.id,  // Opcional: ID do usuário autenticado
      });

      console.log('Token enviado com sucesso:', response.data);
      Alert.alert('Token enviado com sucesso:', response.data);
    } catch (error) {
      console.log('Erro ao enviar token para o servidor:', error);
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
