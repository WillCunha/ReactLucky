import { RootStackParamList } from '@/app/routes/Routes';
import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { NativeStackNavigationProp } from 'react-native-screens/lib/typescript/native-stack/types';

const Mid: React.FC = () => {

  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  // Estado para o número gerado aleatoriamente
  const [randomNumber, setRandomNumber] = useState<number>(0);

  // Função para gerar um número aleatório entre 1 e 5
  const generateRandomNumber = () => {
    const number = Math.floor(Math.random() * 6) + 1; // Gera número entre 1 e 5
    setRandomNumber(number);
  };   

  // Função para lidar com o clique nos botões
  const handleButtonPress = (buttonNumber: number) => {
    if (buttonNumber === randomNumber) {
      Alert.alert('Parabéns! Você acertou!');
    } else {
      Alert.alert(`Você clicou no botão ${buttonNumber}, tente novamente!`);
    }
  };

  // Gerando o número aleatório assim que o app carrega
  React.useEffect(() => {
    generateRandomNumber();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.infoText}>Escolha o botão! </Text>

      <TouchableOpacity onPress={() => navigation.navigate('PushNotification')}>
          <Text>Clica!</Text>
         </TouchableOpacity>

      {[1, 2, 3, 4, 5].map((buttonNumber) => (
        <TouchableOpacity
          key={buttonNumber}
          style={styles.button}
          onPress={() => handleButtonPress(buttonNumber)}
        >
          <Text style={styles.buttonText}>{buttonNumber}</Text>
        </TouchableOpacity>
      ))}

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
  button: {
    backgroundColor: '#28a745',
    padding: 15,
    marginVertical: 5,
    borderRadius: 5,
    width: '80%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  infoText: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: 'center',
  },
});

export default Mid;
