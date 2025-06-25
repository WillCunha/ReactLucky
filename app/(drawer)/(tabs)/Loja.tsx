// ... (importações mantidas)
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { FlatList, Image, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { NativeStackNavigationProp } from 'react-native-screens/lib/typescript/native-stack/types';
import { RootStackParamList } from '../../routes/Routes';

interface Item {
  id: string;
  nome: string;
  obs: string;
  prime_color: string,
  second_color: string,
  codigo: string,
  valor: string,
  pontos: string,
  status: string
}

const Loja = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const [dataSelecionados, setDataSelecionados] = useState<any[]>([]);
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [response, setResponse] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [userData, setUserData] = useState<{ nome: string; id: string, plataformas: number, obs: string } | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const jsonString = await AsyncStorage.getItem("WF_LUCKY");
        if (!jsonString) return;
        const jsonData = JSON.parse(jsonString);
        if (Array.isArray(jsonData) && jsonData.length > 0) {
          setUserData({
            id: jsonData[0].id,
            nome: jsonData[0].nome,
            plataformas: jsonData[0].plataformas,
            obs: jsonData[0].obs
          });
        }
      } catch (error) {
        console.error("Erro ao buscar os dados:", error);
        setUserData(null);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (!userData) return;

    const fetchApi = async () => {
      if (userData?.plataformas != 0) {
        try {
          const response = await fetch(`https://api.wfsoft.com.br/wf-lucky/api/lucky/store/${userData?.id}`);
          const json = await response.json();
          if (Array.isArray(json.resp)) {
            setDataSelecionados(json.resp);
            const idsParaSelecionar: number[] = json.resp
              .flatMap((grupo: any) => grupo.gifts.map((item: any) => item.plataformas_id))
              .filter((id: any) => id !== undefined && id !== null);
            setSelectedItems(idsParaSelecionar);
          }
        } catch (error) {
          console.error("Erro ao buscar plataformas do usuário:", error);
        }
      }
    };

    fetchApi();
  }, [userData]);

  const handleSelectItem = (id: number) => {
    const isSelected = selectedItems.includes(id);
    if (isSelected) {
      setSelectedItems(selectedItems.filter(itemId => itemId !== id));
    } else {
      setSelectedItems([...selectedItems, id]);
    }
  };

  const isColorDark = (hexColor: string) => {
    const color = hexColor.replace('#', '');
    const r = parseInt(color.substr(0, 2), 16);
    const g = parseInt(color.substr(2, 2), 16);
    const b = parseInt(color.substr(4, 2), 16);
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    return brightness < 150;
  };

  
  const renderItem = ({ item }: { item: Item }) => {
    const isSelected = selectedItems.includes(parseInt(item.id));
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <TouchableOpacity
          style={[
            styles.item,
            { backgroundColor: item.prime_color, borderColor: item.second_color }
          ]}
          onPress={() => handleSelectItem(parseInt(item.id))}
        >
          <View style={styles.styleImg}>
            <Image
              source={{ uri: `https://api.wfsoft.com.br/wf-lucky/files/imagem/${item.nome}.png` }}
              style={{ width: 100, minHeight: 100 }}
              resizeMode='contain'
            />
          </View>
          <View style={{ justifyContent: 'center', alignItems: 'center' }}>
            <Text style={[
              styles.valor,
              { color: isColorDark(item.prime_color) ? '#FFF' : '#000' }
            ]}>R$ {item.valor}</Text>
            <Text style={[
              styles.codigo,
              { color: isColorDark(item.prime_color) ? '#FFF' : '#000' }
            ]}>{item.nome}</Text>
            <Text style={[
              styles.id,
              { color: isColorDark(item.prime_color) ? '#FFF' : '#000' }
            ]}>ID: {item.id}</Text>
            {item.obs ? (
              <Text style={{ fontSize: 12, fontWeight: '600', color: '#000' }}>{item.obs}</Text>
            ) : null}
          </View>
        </TouchableOpacity>
        <Text style={styles.pontuacao}>Pontuação: {item.pontos}</Text>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}> COMPRAR </Text>
        </TouchableOpacity>
      </View>
    );
  };

  const handleSubmit = async () => {
    try {
      const result = await axios.post(
        'https://api.wfsoft.com.br/wf-lucky/api/lucky/add-plataforma/' + userData?.id,
        selectedItems
      );
      setResponse(result.data);
      setError(null);
      if (result.data.resp == 200) {
        const storedData = await AsyncStorage.getItem('WF_LUCKY');
        if (storedData) {
          const users = JSON.parse(storedData);
          users[0].plataformas = selectedItems.length;
          await AsyncStorage.setItem('WF_LUCKY', JSON.stringify(users));
        }
        router.push('/');
      }
    } catch (e: any) {
      setError(e.message);
      setResponse(null);
    }
  };

  return (
    <View style={{ padding: '5%', flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <StatusBar backgroundColor="#3CAF54" translucent={false} barStyle="dark-content" />
      <ScrollView showsHorizontalScrollIndicator={false} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Loja</Text>
          <Text style={styles.headerText}>Os gift-cards abaixo são exibidos de acordo com a seleção realizada na tela "Selecione suas plataformas".</Text>
        </View>

        {dataSelecionados.map((grupo, index) => (
          
          <View key={index} style={{ marginBottom: 30 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: '3%' }}>
              <Image
                style={{ width: 32, height: 32, borderRadius: 32, marginRight: '3%', }}
                source={{ uri: `https://api.wfsoft.com.br/wf-lucky/files/imagem/${grupo.nome}.png` }}
              />
              <Text style={{
                fontSize: 18,
                fontWeight: 'bold',
                marginBottom: 10,
                color: '#000'
              }}>{grupo.nome}</Text>
            </View>
            <FlatList
              data={grupo.gifts}
              horizontal
              showsHorizontalScrollIndicator={false}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => renderItem({ item })}
              ItemSeparatorComponent={() => <View style={{ width: 12 }} />}
            />
            <View style={{width: '100%', borderBottomWidth: 2, borderBottomColor: '#EAEAEA'}}></View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    marginBottom: '5%',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: '#000'
  },
  headerText: {
    fontSize: 14,
    color: '#9D9D9D',
    marginTop: '2%',
    marginBottom: '2%',
    lineHeight: 20,
  },
  item: {
    padding: 15,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    width: 250,
    height: 300,
    borderRadius: 15,
    borderWidth: 3
  },
  button: {
    backgroundColor: '#3CAF54',
    padding: 15,
    width: '80%',
    borderRadius: 5,
    alignItems: 'center',
    marginVertical: 20,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  valor: {
    fontSize: 32,
    fontWeight: '900',
  },
  codigo: {
    fontSize: 20,
    fontWeight: '900',
    textAlign: 'center',
  },
  id: {
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
  pontuacao: {
    fontSize: 16,
    marginTop: '5%',
    textAlign: 'center',
    fontWeight: '700'
  },
  styleImg: {
    marginBottom: 10
  }
});

export default Loja;
