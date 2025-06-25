import { useAuth } from "@/app/context/Auth";
import { RootStackParamList } from "@/app/routes/Routes";
import { AntDesign, Ionicons } from '@expo/vector-icons';
import AsyncStorage from "@react-native-async-storage/async-storage";
import messaging from '@react-native-firebase/messaging';
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Image, PermissionsAndroid, Platform, StyleSheet, Text, View } from "react-native";
import { NativeStackNavigationProp } from "react-native-screens/lib/typescript/native-stack/types";

export default function Header() {

  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();



  const { signOut } = useAuth();

  const getGreeting = (): string => {
    const currentHour = new Date().getHours();

    if (currentHour >= 5 && currentHour < 12) {
      return 'Bom dia';
    } else if (currentHour >= 12 && currentHour < 18) {
      return 'Boa tarde';
    } else {
      return 'Boa noite';
    }
  };

  const [authData, setAuthData] = useState<AuthData>();
  const [userData, setUserData] = useState<{ id: string, nome: string; plataformas: string, pontos: string, plataforma: string, acesso: string, register_type: string, photo: string } | null>(null);
  const [greeting, setGreeting] = useState<string>(getGreeting());
  const [token, setToken] = React.useState<string | null>(null);


  // 1° Define o "Bom dia", "Boa tarde", "Boa noite" e busca os dados de user.
  useEffect(() => {
    checkPermission();
    const intervalId = setInterval(() => {
      setGreeting(getGreeting());
    }, 60000);


    const fetchData = async () => {
      try {
        const jsonString = await AsyncStorage.getItem("WF_LUCKY"); // Pegando os dados do AsyncStorage

        if (!jsonString) {
          console.warn("Nenhum dado encontrado no AsyncStorage");
          return; // Se a chave não existir, evitamos chamar JSON.parse()
        }

        const jsonData = JSON.parse(jsonString); // Parseando os dados

        if (Array.isArray(jsonData) && jsonData.length > 0) {
          setUserData({
            id: jsonData[0].id,
            nome: jsonData[0].nome,
            plataformas: jsonData[0].plataformas,
            plataforma: jsonData[0].plataforma,
            pontos: jsonData[0].pontos,
            register_type: jsonData[0].register_type,
            photo: jsonData[0].photo,
            acesso: jsonData[0].acesso
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


    return () => clearInterval(intervalId);
  }, []);


  // 2° Verifica se o usuario está acessando pela primeira vez e se ele ja tem plataformas selecionadas.
  useEffect(() => {
    if (userData?.acesso == "0") {
      const timeout = setTimeout(() => {
        navigation.navigate('Gratidao');
      }, 2000); // 2000 milissegundos = 2 segundos

      // cleanup pro caso do componente desmontar antes dos 2 segundos
      return () => clearTimeout(timeout);
    } else if (userData?.plataformas == "0") {

      const timeout = setTimeout(() => {
        navigation.navigate('ListaPlataformas');
      }, 1000); // 2000 milissegundos = 2 segundos

      // cleanup pro caso do componente desmontar antes dos 2 segundos
      return () => clearTimeout(timeout);
    }
  }, [userData]);

  // 3° Google SignIn
  useEffect(() => {
    GoogleSignin.configure({
      webClientId: '515317620527-g6eikuir369gdcvmc868ljng30j9qsvn.apps.googleusercontent.com', // obtido no console do Google
      iosClientId: 'com.googleusercontent.apps.515317620527-07o9rcbq0mnl78i47mh8n7v88hn3enbi'
    });
  }, []);

  // 4° Controla as notificações ( Se não tiver o token, chama a função para gerar um )
  useEffect(() => {
    if (!userData) return; // Garante que o userData esteja preenchido

    // As permissões são solicitadas e o token FCM só é buscado se userData estiver válido
    const getTokenAndSubscribe = async () => {
      try {
        await getFcmToken(); // Obtém o token FCM

        const unsubscribe = messaging().onMessage(async remoteMessage => {
          console.log('Nova notificação!', JSON.stringify(remoteMessage.notification));
        });

        return unsubscribe; // Retorna o unsubscribe para ser limpo quando necessário
      } catch (error) {
        console.error('Erro ao solicitar permissão ou obter FCM token:', error);
      }
    };

    getTokenAndSubscribe();

  }, [userData]);


  //Gera o token.
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
      console.log('Erro ao obter o token FCM:', JSON.stringify(error));
    }
  };


  //Envia o Token pra API
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
    } catch (error) {
      console.log('Erro ao enviar token para o servidor:', JSON.stringify(error));
    }
  };

  //Checa se o usuario tem as permissões habilitadas, se não, solicita.
  const checkPermission = async () => {
    if (Platform.OS === 'android') {
      if (Platform.Version >= 33) {
        // Android 13+
        const result = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
        );

        if (result === PermissionsAndroid.RESULTS.GRANTED) {
          console.log('✅ Permissão de notificação concedida');

        } else {
          console.warn('❌ Permissão de notificação negada!');

        }
      } else {
        // Android < 13 não exige permissão runtime
        console.log('✅ Android < 13: notificações permitidas por padrão');

      }
    } else if (Platform.OS === 'ios') {
      // iOS
      const authStatus = await messaging().requestPermission();
      const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;

      if (enabled) {
        console.log('✅ Permissão para notificações no iOS:', authStatus);

      } else {
        console.warn('❌ Permissão de notificação no iOS não concedida');

      }
    }
  };

  //Logout com o Google.
  const signOutWithGoogle = async () => {
    try {
      await GoogleSignin.signOut();
      signOut();
    } catch (error) {
      console.error(error);
    }
  };


  return (
    <View style={styles.headerContainer}>
      <View style={styles.headerUser}>
        <View style={styles.btnIconUser}>
          {userData ?
            <Image
              style={{ width: 50, height: 50, borderRadius: 50 }}
              source={{ uri: userData?.photo }}
            />
            :
            <AntDesign name="user" size={24} color="#fff" />
          }
        </View>
      </View>
      <View style={styles.headerLeft}>
        <Text style={styles.headerTx}> {greeting}, {userData ? userData.nome : "Carregando..."}!</Text>
      </View>
      <View style={styles.headerRight}>
        <View style={styles.btnCartCircle}>

          <Ionicons name="wallet" size={24} color="#404B51" onPress={() => navigation.navigate('Wallet')} />

        </View>
        <View style={styles.btnCartCircle}>

          <Ionicons name="list" size={24} color="#404B51" onPress={() => navigation.navigate('ListaPlataformas')} />

        </View>
        <View style={styles.btnCartCircle}>
          {userData?.plataforma || userData?.register_type == 'Google' ?
            <AntDesign name="logout" size={24} color="#404B51" onPress={signOutWithGoogle} />
            :
            <AntDesign name="logout" size={24} color="#404B51" onPress={signOut} />
          }
        </View>
      </View>

    </View>

  );

}

const styles = StyleSheet.create({
  headerContainer: {
    width: '100%',
    height: 40,
    justifyContent: 'space-around',
    alignItems: "center",
    display: 'flex',
    marginBottom: '5%',
    flexDirection: 'row',
    marginLeft: '3%',
  },
  headerUser: {
    width: '8%',
    height: 40,
    justifyContent: 'flex-start',
    alignItems: "flex-start",
    display: 'flex',
    marginBottom: '5%',
    flexDirection: 'row',

  },
  headerLeft: {
    width: '40%',
    height: 40,
    justifyContent: 'flex-start',
    alignItems: "center",
    display: 'flex',
    marginBottom: '5%',
    flexDirection: 'row',

  },
  headerRight: {
    width: '40%',
    height: 40,
    justifyContent: 'space-evenly',
    alignItems: "flex-end",
    display: 'flex',
    marginBottom: '5%',
    flexDirection: 'row',

  },
  headerTx: {
    fontSize: 18,
    color: '#404B51',
    fontFamily: 'Poppins_600SemiBold',
    letterSpacing: -0.5,
    fontWeight: 800,
    width: 'auto',
    textAlign: 'left',
    textTransform: 'capitalize'
  },
  btnCartCircle: {
    backgroundColor: '#fff',
    borderColor: '#F3F5F3',
    borderWidth: 1,
    borderRadius: 40,
    height: 40,
    width: 40,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  btnIconUser: {
    backgroundColor: '#66BD9E',
    borderRadius: 40,
    height: 40,
    width: 40,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
})