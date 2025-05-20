import AsyncStorage from '@react-native-async-storage/async-storage';
import { Link } from 'expo-router';
import react, { useEffect, useState } from 'react';
import { Text, Image, View, StatusBar, StyleSheet } from 'react-native';


const Congrats = () => {


    const [userData, setUserData] = useState<{ nome: string; id: string, plataformas: number } | null>(null);
    const [gift, setGift] = useState<{ nome: string; id: string, valor: string, codigo: string } | null>(null);
    const [isVisible, setIsVisible] = useState(false);
    const [imageLoaded, setImageLoaded] = useState(false);
    const [randomNumber, setRandomNumber] = useState<number | null>(null);

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

    return (
        <View>
            <StatusBar backgroundColor="#3CAF54" barStyle="light-content" />
            <View style={Styles.imageContent}>
                <Image
                    source={images[randomNumber]}
                    resizeMode='contain'
                    style={{ maxWidth: '100%', maxHeight: 400 }} />
            </View>
            <View style={Styles.mainContent}>
                <Text style={Styles.txtHeader}>PARABÉNS, {userData?.nome}!</Text>
                <Text style={Styles.txtContent}>Você ganhou um gift cart do(a) <Text style={Styles.txtSpan}>{gift?.nome}</Text>.</Text>
            </View>
            <View style={Styles.premioContent}>
                <Text style={Styles.premioValor}>
                    R$ {gift?.valor}
                </Text>
            </View>
            <View style={Styles.mainContent}>
                <Text style={Styles.txtP}>Abra a sua carteira no aplicativo "{gift?.nome}", localize um botão que possa ter o
                    seguinte texto: Resgatar gift card. Ao continuar, não é possível recuperar o código. </Text>
            </View>
            <View style={Styles.mainContent}>
                <Text style={Styles.txtHeader2}>CÓDIGO DO GIFT CARD:</Text>
                <Text style={Styles.txtContent}>{gift?.codigo} | ( ID: {gift?.id} )</Text>
                <Link href="/(drawer)/(tabs)" style={Styles.button} >Continuar</Link>
            </View>
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
        padding: 20,
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
        fontSize: 30,
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
        width: '100%',
        fontSize: 18,
        fontWeight: 500,
        color: '#191820',
        letterSpacing: -1
    },
    txtSpan: {
        fontSize: 18,
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
    button: {
        backgroundColor: '#3CAF54',
        color: '#fff',
        width: '80%',
        minHeight: 50,
        borderRadius: 10,
        textAlign: 'center',
        fontSize: 20,
        fontWeight: 800,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignSelf: 'center',
        paddingTop: '2%',
        marginTop: '3%',
    }
})