import { RootStackParamList } from '@/app/routes/Routes';
import { AntDesign, MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { NativeStackNavigationProp } from 'react-native-screens/lib/typescript/native-stack/types';

const Mid: React.FC = () => {

  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const [userData, setUserData] = useState<{ score: string } | null>(null);


  useEffect(() => {
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
            score: jsonData[0].score,
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


  const cards = [
    { id: 1, value: '10' },
    { id: 2, value: '5' },
    { id: 3, value: '2x' },
    { id: 4, value: '0' },
    { id: 5, value: '-3' },
    { id: 6, value: '7' },
  ];


  return (
    <View style={styles.container}>
      <View style={styles.topArea}>

        <TouchableOpacity
          style={[styles.button25, { backgroundColor: '#FC5543' }]}
          onPress={() => console.log("sei la")}
        >
          <AntDesign name={'dashboard'} size={28}
            color="#fff" />
          <Text style={[styles.buttonText, { fontWeight: 900 }]}>Pontos: {userData?.score}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button25, { backgroundColor: '#FFD700' }]}
          onPress={() => console.log("sei la")}
        >
          <AntDesign name={'Trophy'} size={28}
            color="#fff" />
          <Text style={[styles.buttonText, { fontWeight: 900 }]}>Level: 03</Text>
        </TouchableOpacity>

      </View>
      <View style={styles.midArea}>
        <Text style={styles.infoText}>Escolha um botão!</Text>
        <View style={styles.midButtons}>
          <TouchableOpacity
            style={[styles.button25, { backgroundColor: '#28a745', flexDirection: 'column', minHeight: 100, maxWidth: '33%' }]}
            onPress={() => navigation.navigate('Musicas')}
          >
            <MaterialCommunityIcons name="cards-playing-spade-outline" size={32} color="white" />
            <Text style={styles.buttonText}>CARTAS</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button25, { backgroundColor: '#28a745', flexDirection: 'column', minHeight: 100, maxWidth: '33%' }]}
            onPress={() => navigation.navigate('Perguntas')}
          >
            <MaterialCommunityIcons name="book" size={32} color="white" />
            <Text style={styles.buttonText}>Perguntas e Respostas</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button25, { backgroundColor: '#28a745', flexDirection: 'column', minHeight: 100, maxWidth: '33%' }]}
            onPress={() => navigation.navigate('Ads')}
          >
            <MaterialCommunityIcons name="youtube-tv" size={32} color="white" />
            <Text style={styles.buttonText}>Ads</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  topArea: {
    width: '100%',
    height: 100,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 50,
  },
  midArea: {
    width: '100%',
    height: 500,
  },
  midButtons: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#28a745',
    padding: 15,
    marginVertical: 5,
    borderRadius: 5,
    width: '80%',
    alignItems: 'center',
  },
  button25: {
    width: '40%',
    borderRadius: 5,
    height: 50,
    padding: 5,
    marginVertical: 5,
    alignItems: 'center',
    justifyContent: 'space-evenly',
    display: 'flex',
    flexDirection: 'row',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 800,
    textAlign: 'center'
  },
  infoText: {
    fontSize: 18,
    fontWeight: 800,
    marginBottom: 20,
    textAlign: 'center',
  },
});

export default Mid;
