import { useAuth } from '@/app/context/Auth';
import Header from '@/src/components/header';
import Mid from '@/src/components/mid';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from "expo-constants";
import { useEffect, useState } from 'react';
import { ScrollView, StatusBar, StyleSheet, View } from 'react-native';

export default function HomeScreen() {

  const [userData, setUserData] = useState<{ nome: string; plataformas: string } | null>(null);

  const statusBarHeight = Constants.statusBarHeight;
  const { signOut } = useAuth();

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
            nome: jsonData[0].nome,
            plataformas: jsonData[0].plataformas
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


  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: '#fff' }}
      showsVerticalScrollIndicator={false}
    >
      <View className='w-full px-4' style={{ marginTop: statusBarHeight + 8, marginBottom: '3%' }}>
        <><StatusBar backgroundColor="#3CAF54" barStyle="light-content" /><Header />< Mid /></>

      </View>
    </ScrollView>

  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
});
