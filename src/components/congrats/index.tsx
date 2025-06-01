import { RootStackParamList } from '@/app/routes/Routes';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
//import * as Clipboard from 'expo-clipboard';
import { useEffect, useState } from 'react';
import { Image, ScrollView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { NativeStackNavigationProp } from 'react-native-screens/lib/typescript/native-stack/types';


const Congrats = () => {

    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

    const [userData, setUserData] = useState<{ nome: string; id: string, plataformas: number } | null>(null);
    const [gift, setGift] = useState<{ nome: string; id: string, valor: string, codigo: string } | null>(null);
    const [chave, setChave] = useState("");
    const [randomNumber, setRandomNumber] = useState<number | null>(null);
    const [error, setError] = useState("");

    const images = {
        1: require('../../../assets/images/congrats-1.png'),
        2: require('../../../assets/images/congrats-2.png'),
        3: require('../../../assets/images/congrats-3.png'),
    };


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
        if (!userData) return;
        console.log("https://api.wfsoft.com.br/wf-lucky/api/lucky/gift/" + userData?.id)
        const fetchApi = async () => {
            try {
                const response = await fetch('https://api.wfsoft.com.br/wf-lucky/api/lucky/gift/ ' + userData?.id);
                const json = await response.json();
                console.log(json.resp[0])
                setGift(json.resp[0]);


            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchApi();
    }, [userData]);



    // Função para gerar um número aleatório entre 1 e 5
    const generateRandomNumber = () => {
        const num = Math.floor(Math.random() * 3) + 1;
        setRandomNumber(num);
    };

    useEffect(() => {
        generateRandomNumber();
    }, []);

    // const copiarParaAreaTransferencia = async () => {
    //     await Clipboard.setStringAsync(gift?.codigo)
    //     Alert.alert('Texto copiado!');
    // };

    async function enviaChave() {
        const url = 'https://api.wfsoft.com.br/wf-lucky/api/lucky/chave/adicionar';
        try {
            await axios.post(url, {
                chave: chave,
                valor: gift?.valor,
                id_user: userData?.id
            })
                .then(response => {
                    console.log(response.data.resp)
                    if (response.data.resp == 200) {
                        navigation.navigate('HomeScreen')
                    } else {
                        setError(JSON.stringify(response));
                    }
                })
        } catch (error) {
            console.log(error)
            setError(JSON.stringify(error));
        }
    }

    return (
        <View>
            <StatusBar backgroundColor="#3CAF54" translucent={false} barStyle="light-content" />
            <ScrollView showsHorizontalScrollIndicator={false} showsVerticalScrollIndicator={false}>
                <View style={Styles.imageContent}>
                    <Image
                        source={images[randomNumber]}
                        resizeMode='contain'
                        style={{ maxWidth: '100%', maxHeight: 400 }} />
                </View>
                <View style={Styles.mainContent}>
                    {
                        gift?.nome === 'PIX' ? (
                            <Text style={[Styles.txtHeader, { fontSize: 26, letterSpacing: -1 }]}>{userData?.nome},
                                você ganhou um...</Text>
                        ) : (
                            <Text style={[Styles.txtHeader, { fontSize: 30 }]}>PARABÉNS, {userData?.nome}!</Text>
                        )
                    }

                    {
                        gift?.nome === 'PIX' ? (
                            <Text style={[Styles.txtContent, { fontSize: 28, letterSpacing: -1 }]}>
                                <Text style={Styles.txtSpan}>{gift?.nome}</Text>.
                            </Text>
                        ) : (
                            <Text style={[Styles.txtContent, { fontSize: 18, letterSpacing: -1 }]}>
                                Você ganhou um gift cart do(a) <Text style={Styles.txtSpan}>{gift?.nome}</Text>.
                            </Text>
                        )
                    }
                </View>
                <View style={Styles.premioContent}>
                    <Text style={Styles.premioValor}>
                        R$ {gift?.valor}
                    </Text>
                </View>
                <View style={Styles.mainContent}>

                    {
                        gift?.nome === 'PIX' ? (
                            <Text style={Styles.txtP}>
                                Informe sua chave PIX no campo abaixo. O valor será creditado na conta no prazo de 2 horas.</Text>
                        ) : (
                            <Text style={Styles.txtP}>
                                Abra a sua carteira no aplicativo "{gift?.nome}", localize um botão que possa ter o
                                seguinte texto: Resgatar gift card. Ao pressionar em "Continuar", não é possível recuperar o código. </Text>
                        )
                    }

                </View>


                {
                    gift?.nome === 'PIX' ? (
                        <View style={Styles.mainContent}>
                            <Text style={Styles.txtSpan}>Chave PIX:</Text>
                            <TextInput
                                style={Styles.input}
                                value={chave}
                                onChangeText={setChave}
                                autoCapitalize="none"
                                placeholder="Informe a chave."
                            />
                            <TouchableOpacity
                                style={Styles.btn}
                                onPress={() => enviaChave()}>
                                <Text style={{ fontWeight: 'bold', fontSize: 15, color: '#fff' }}>
                                    CONTINUAR
                                </Text>
                            </TouchableOpacity>

                            <Text style={[Styles.txtContent, { fontSize: 12, marginTop: '5%' }]}><Text style={[Styles.txtSpan, { fontSize: 12 }]}>Atenção! </Text>Ao pressionar em "Continuar",
                                se a chave informada estiver incorreta, entraremos em contato por meio do e-mail da conta. Se não obtermos um retorno em até 24h, o prêmio será perdido.
                            </Text>

                        </View>
                    ) : (
                        <View style={Styles.mainContent}>
                            <Text style={Styles.txtHeader2}>CÓDIGO DO GIFT CARD:</Text>
                            <View style={Styles.codigoContent}>
                                <Text style={[Styles.txtContentCodigo, { fontSize: 18, letterSpacing: -1, textAlign: 'center' }]}>{gift?.codigo}</Text>
                            </View>
                            <TouchableOpacity
                                style={Styles.btn}
                                onPress={() => navigation.navigate('HomeScreen')}>
                                <Text style={{ fontWeight: 'bold', fontSize: 15, color: '#fff' }}>
                                    CONTINUAR
                                </Text>
                            </TouchableOpacity>

                            <Text style={{ textAlign: 'center', color: '#cc0000', fontSize: 12, fontWeight: 800 }}>{error}</Text>

                        </View>
                    )
                }


            </ScrollView>
        </View>
    )


}

export default Congrats

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
        fontSize: 14,
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