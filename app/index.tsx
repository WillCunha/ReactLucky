import { AntDesign } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import React, { useEffect, useRef, useState } from "react";
import { Alert, StatusBar, StyleSheet, TouchableOpacity, View } from 'react-native';
import 'react-native-gesture-handler';
import { captureScreen } from 'react-native-view-shot';
import { AuthProvider } from "./context/Auth";
import OnboardingScreen from './onboarding';
import { Router } from "./routes/Routes";

function App() {


  const [isAppFirstLaunched, setIsAppFirstLaunched] = useState(true);
  const viewRef = useRef();

  useEffect(() => {
    loadScreens();
  }, [])




  async function loadScreens(): Promise<void> {
    try {
      const loadScreens = await AsyncStorage.getItem('PRIMEIRAVEZ');
      if (loadScreens == null) {
        setIsAppFirstLaunched(true);
        AsyncStorage.setItem('PRIMEIRAVEZ', 'false');
      } else {
        setIsAppFirstLaunched(false);
      }
    } catch (error) {
      console.warn('ERROR ONBOARDING: ' + error);
    }
  }

  const takeScreenshotAndSend = async () => {
    try {
      // 1. Captura a tela
      const uri = await captureScreen({
        format: 'png',
        quality: 0.8,
      });

      console.log('Screenshot capturada:', uri);

      // 2. Prepara o FormData
      const formData = new FormData();
      formData.append('screenshot', {
        uri: uri,
        name: 'screenshot.png',
        type: 'image/png',
      } as any);

      // 3. Envia via axios
      const response = await axios.post('https://api.wfsoft.com.br/wf-lucky/api/lucky/bugs', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log(response)

      if (response.status === 200) {
        Alert.alert('Sucesso', 'Print enviado com sucesso!');
      } else {
        Alert.alert('Erro', `Falha ao enviar: ${response.status}`);
      }

    } catch (error) {
      console.error('Erro ao capturar ou enviar screenshot:', error);
      Alert.alert('Erro', 'Não foi possível capturar ou enviar o print.');
    }
  };

  return (

    <AuthProvider>

      <StatusBar backgroundColor="#3CAF54" translucent={false} barStyle="light-content" />

      {isAppFirstLaunched ? <OnboardingScreen /> : <Router />}
      <View style={styles.container}>
        <TouchableOpacity style={styles.floatingButton} onPress={takeScreenshotAndSend}>
          <AntDesign name={'camera'} size={24}
            color="#fff" />
        </TouchableOpacity>
      </View>
    </AuthProvider>
  );
}

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    maxHeight: 10
  },
  floatingButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 60,
    height: 60,
    backgroundColor: '#3CAF54',
    borderRadius: 10, // Quadrado com bordas levemente arredondadas
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5, // sombra no Android
    shadowColor: '#000', // sombra no iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  buttonText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
})