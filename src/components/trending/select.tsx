
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { FlatList, Image, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface Item {
  id: number;
  nome: string;
  status: string
}

const ListaPlataformas = () => {

  const navigation = useNavigation();

  const [dataTodos, setDataTodos] = useState<Item[]>([]);
  const [dataSelecionados, setDataSelecionados] = useState<any[]>([]);
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [response, setResponse] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [userData, setUserData] = useState<{ nome: string; id: string, plataformas: number } | null>(null);


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
            id: jsonData[0].id,
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

  useEffect(() => {
    if(!userData) return;
    const fetchApi = async () => {
      try {
        const response = await fetch('https://api.wfsoft.com.br/wf-lucky/api/lucky/plataformas/');
        const json = await response.json();
        setDataTodos(json.resp);
      } catch (error) {
        console.error("Error fetching data:", error);
      }

      if (userData?.plataformas != 0) {
        console.log('https://api.wfsoft.com.br/wf-lucky/api/lucky/plataformas/' + userData?.id)
        try {
          const response = await fetch('https://api.wfsoft.com.br/wf-lucky/api/lucky/plataformas/' + userData?.id);
          const json2 = await response.json();
          setDataSelecionados(json2.resp);

          const idsParaSelecionar: number[] = [];

          json2.resp.forEach((item: any) => {
            // Exemplo: se quiser selecionar todos

            console.log(item)
            idsParaSelecionar.push(item.plataformas_id);
          });
          
          console.log(idsParaSelecionar)
          setSelectedItems(idsParaSelecionar);
        } catch (error) {
          console.error("Error fetching data:", error);
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


  const renderItem = ({ item }: { item: Item }) => {
    const isSelected = selectedItems.includes(item.id);

    return (
      <TouchableOpacity
        style={[styles.item, isSelected && styles.selectedItem]}
        onPress={() => handleSelectItem(item.id)}
      >
        <View style={styles.styleImg}>
          <Image
            source={{
              uri:
                'https://api.wfsoft.com.br/wf-lucky/files/imagem/' + item.nome + '.png'
            }}
            style={{ width: 50, minHeight: 50, borderRadius: 12 }}
            resizeMode='contain'
          />


        </View>
        <View style={styles.txtNome}>
          <Text style={{
            fontSize: 16,
            fontWeight: 900,
            color: '#000'
          }}>{item.nome}</Text>
        </View>
        <View>
          <Text></Text>
        </View>
      </TouchableOpacity>
    );
  };

  const handleSubmit = async () => {

    try {
      const result = await axios.post(
        'https://api.wfsoft.com.br/wf-lucky/api/lucky/add-plataforma/' + userData?.id,
        selectedItems,
      );
      setResponse(result.data);
      setError(null);
      if (result.data.resp == 200) {
        try {
          const storedData = await AsyncStorage.getItem('WF_LUCKY');

          if (storedData) {
            const users = JSON.parse(storedData);
            users[0].plataformas = selectedItems.length;

            await AsyncStorage.setItem('WF_LUCKY', JSON.stringify(users));

          } else {
            console.log('Nenhum usuário encontrado no AsyncStorage.');
          }
        } catch (error) {
          console.error('Error:', error);
        }
        navigation.navigate('HomeScreen');
      }
    } catch (e: any) {
      setError(e.message);
      setResponse(null);
    }


  };

  return (

    <View style={{ padding: '5%' }}>
      <StatusBar backgroundColor="#3CAF54" barStyle="light-content" />
      <ScrollView
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Selecione suas plataformas</Text>
          <Text style={styles.headerText}>{userData?.nome}, escolha as plataformas que você utiliza atualmente. Você pode habilitar
            outras plataformas futuramente, assim como, desativa-las. </Text>
        </View>
        <FlatList
          data={dataTodos}
          renderItem={renderItem}
          keyExtractor={(item) => String(item.id)}
          extraData={selectedItems}
        />
        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Continuar</Text>
        </TouchableOpacity>
        {error && (
          <View>
            <Text>Erro:</Text>
            <Text>{error}!</Text>
          </View>
        )}
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
    fontWeight: 900,
    color: '#000'
  },
  headerText: {
    fontSize: 14,
    color: '#9D9D9D',
    marginTop: '2%',
    marginBottom: '2%',
    lineHeight: 20,
  },
  styleImg: {
    width: '30%'
  },
  txtNome: {
    width: '70%',
  },
  item: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center'
  },
  selectedItem: {
    backgroundColor: '#e0f2f7',
  },
  button: {
    backgroundColor: '#3CAF54',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginVertical: 20,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default ListaPlataformas;