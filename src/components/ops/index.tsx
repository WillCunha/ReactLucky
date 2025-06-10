import { RootStackParamList } from '@/app/routes/Routes';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
//import * as Clipboard from 'expo-clipboard';
import { useEffect, useState } from 'react';
import { Image, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { NativeStackNavigationProp } from 'react-native-screens/lib/typescript/native-stack/types';

const Ops = () => {

    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const [userData, setUserData] = useState<{ nome: string; id: string } | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            console.log("TA AQUI!")
            try {
                const jsonString = await AsyncStorage.getItem("WF_LUCKY"); // Pegando os dados do AsyncStorage
                if (!jsonString) {
                    return; // Se a chave não existir, evitamos chamar JSON.parse()
                }
                const jsonData = JSON.parse(jsonString); // Parseando os dados
                if (Array.isArray(jsonData) && jsonData.length > 0) {
                    setUserData({
                        id: jsonData[0].id,
                        nome: jsonData[0].nome
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

    async function atualizaContinuar() {
        try {
            const storedData = await AsyncStorage.getItem('WF_LUCKY');

            if (storedData) {
                const users = JSON.parse(storedData);
                users[0].acesso = 1;

                await AsyncStorage.setItem('WF_LUCKY', JSON.stringify(users));

            } else {
                console.log('Nenhum usuário encontrado no AsyncStorage.');
            }
        } catch (error) {
            console.error('Error:', error);
        }
        navigation.navigate('HomeScreen')
    }



return (
    <View>
        <StatusBar backgroundColor="#3CAF54" translucent={false} barStyle="light-content" />
        <ScrollView showsHorizontalScrollIndicator={false} showsVerticalScrollIndicator={false}>
            <View style={Styles.imageContent}>
                <Image
                    source={require('../../../assets/images/ops.png')}
                    resizeMode='contain'
                    style={{ maxWidth: '100%', maxHeight: 400 }} />
            </View>

            <View style={Styles.mainContent}>
                <Text style={[Styles.txtHeader, { fontSize: 30 }]}>CALMA, {userData?.nome}!!</Text>
            </View>

            <View style={Styles.mainContent}>
                <Text style={[Styles.txtP, { textAlign: 'center', fontSize: 20, fontWeight: 800, marginTop: '-3%', letterSpacing: -1 }]}>Você estar aqui, significa muito!</Text>
                <Text></Text>
                <Text style={Styles.txtP}>O <Text style={Styles.txtSpan}>Lucky</Text> ainda está em fase Beta!
                </Text>
                <Text></Text>
                <Text style={Styles.txtP}>Portanto, ainda não é possível dar os nossos prêmios à você. Mas isto é por
                    pouco tempo! 
                </Text>
                <Text></Text>
                <Text style={Styles.txtP}>Assim que estivermos em versão de produção, você poderá jogar e ganhar 
                    os gift cards das suas plataformas preferidas!
                </Text>
                

            </View>

            <View style={Styles.mainContent}>
                <TouchableOpacity
                    style={Styles.btn}
                    onPress={() => atualizaContinuar()}>
                    <Text style={{ fontWeight: 'bold', fontSize: 15, color: '#fff' }}>
                        CONTINUAR
                    </Text>
                </TouchableOpacity>
            </View>

        </ScrollView>
    </View>
)


}

export default Ops

const Styles = StyleSheet.create({
    imageContent: {
        maxWidth: '100%',
        maxHeight: 400,
    },
    mainContent: {
        textAlign: 'center',
        padding: 15,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center'
    },
    premioContent: {
        maxHeight: 150,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        margin: 3
    },
    txtHeader: {
        textAlign: 'center',
        width: '100%',
        fontWeight: 900,
        color: '#191820',
        textTransform: 'uppercase',

    },
    txtHeader2: {
        textAlign: 'center',
        width: '100%',
        fontSize: 20,
        fontWeight: 900,
        color: '#191820',
    },
    txtContent: {
        textAlign: 'center',
        fontWeight: 500,
        color: '#191820',

    },
    txtContentCodigo: {
        textAlign: 'center',
        fontWeight: 500,
        color: '#191820',
        width: '100%',
        alignItems: 'center',
    },
    txtSpan: {
        fontWeight: 900,
        color: '#191820',
        letterSpacing: -0.5
    },
    premioValor: {
        color: '#3CAF54',
        fontWeight: 900,
        fontSize: 50,
        letterSpacing: -3
    },
    txtP: {
        textAlign: 'left',
        width: '100%',
        fontSize: 16,
        color: '#191820'
    },
    btn: {
        backgroundColor: '#3CAF54',
        flex: 1,
        height: 50,
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        color: '#fff'
    },
    btnCopiar: {
        flex: 1,
        minHeight: 35,
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center',
        maxWidth: 70,
        borderWidth: 2,
        borderColor: '#3CAF54'
    },
    input: {
        width: "100%",
        marginVertical: 4,
        height: 50,
        borderWidth: 2,
        borderRadius: 4,
        padding: 10,
        backgroundColor: "#fff",
        borderColor: "#F5F5F5",
        marginBottom: "4%",
    },
    codigoContent: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        minHeight: 80,
        maxHeight: 80,
    }
})