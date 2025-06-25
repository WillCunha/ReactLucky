import { RootStackParamList } from '@/app/routes/Routes';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { FlatList, Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import { NativeStackNavigationProp } from 'react-native-screens/lib/typescript/native-stack/types';

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

const WalletMid: React.FC = () => {

    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

    const [dataTodos, setDataTodos] = useState<Item[]>([]);
    const [dataData, setData] = useState<{ data_creation: string }[]>([]);
    const [dataValor, setDataValor] = useState<{ total: string } | null>(null);
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
                    const response = await fetch(`https://api.wfsoft.com.br/wf-lucky/api/lucky/wallet/${userData?.id}`);
                    const json = await response.json();
                    if (Array.isArray(json.resp)) {
                        setData(json.resp[0].data[0]);
                        setDataValor(json.resp[0].total[0]);
                        setDataTodos(json.resp[0].gifts);

                        const idsParaSelecionar: number[] = json.resp
                            .flatMap((grupo: any) => grupo.gifts.map((item: any) => item.plataformas_id))
                            .filter((id: any) => id !== undefined && id !== null);

                    }
                } catch (error) {
                    console.error("Erro ao buscar plataformas do usuário:", error);
                }
            }
        };

        fetchApi();
    }, [userData]);

    function formatarDataCompleta(dataStr: string): string {
        const data = new Date(dataStr);

        const dia = String(data.getDate()).padStart(2, '0');
        const mes = String(data.getMonth() + 1).padStart(2, '0'); // mês começa em 0
        const ano = data.getFullYear();

        const hora = String(data.getHours()).padStart(2, '0');
        const minutos = String(data.getMinutes()).padStart(2, '0');
        const segundos = String(data.getSeconds()).padStart(2, '0');

        return `${dia}/${mes}/${ano} às ${hora}:${minutos}:${segundos}`;
    }


    const renderItem = ({ item }: { item: Item }) => {
        console.log(JSON.stringify(item))
        return (
            <View
                style={[styles.item]}
            >
                <View style={styles.styleImg}>
                    <Image
                        source={{
                            uri:
                                'https://api.wfsoft.com.br/wf-lucky/files/imagem/' + item.nome + '.png'
                        }}
                        style={{ width: 50, minHeight: 50, borderRadius: 10, backgroundColor: item.prime_color, padding: 3 }}
                        resizeMode='contain'
                    />


                </View>
                <View style={styles.txtNome}>
                    <Text style={{
                        fontSize: 16,
                        fontWeight: 900,
                        color: '#000'
                    }}>{item.nome}</Text>
                    {item.codigo ? <Text style={{ fontSize: 12, fontWeight: 600, color: '#000' }}>{item.codigo}</Text> : <Text></Text>}
                </View>
                <View style={styles.txtValor}>
                    <Text style={{ fontSize: 16, fontWeight: 600, color: '#000' }}>R$ {item.valor}</Text>
                </View>
            </View >
        );
    };

    return (
        <View style={styles.container}>
            <ScrollView
                showsHorizontalScrollIndicator={false}
                showsVerticalScrollIndicator={false}>
                <View style={styles.topArea}>
                    <View style={[styles.cardHeader]}>
                        <View style={styles.headerCardHeader}>
                            <View style={styles.leftHeader}>
                                <Text style={[styles.valueText, { fontWeight: 900 }]}>R$ {dataValor?.total}</Text>
                                <Text style={[styles.headerText, { fontWeight: 400 }]}>total em gifts ganhos.</Text>
                            </View>
                            <View style={styles.rightHeader}>
                                <Ionicons name="share-outline" size={24} color="#fff" onPress={() => navigation.navigate('Wallet')} />
                            </View>
                        </View>

                        <View style={styles.headerCardFooter}>
                            <View>

                            </View>
                            <View>
                                <Text style={[styles.headerText, { fontSize: 14 }]}>Ultima gift recebido em:</Text>
                                <Text style={[styles.footerText]}>{formatarDataCompleta(dataData.data_creation)}</Text>
                            </View>
                        </View>
                    </View>
                </View>
                <View style={styles.midArea}>
                    <View style={{ justifyContent: 'space-between', alignItems: 'center', flexDirection: 'row' }}>
                        <Text style={styles.infoText}>Historico de gift-cards:</Text>
                        <Text style={[styles.infoText, { color: '#5391c7', fontWeight: '700' }]}>Ver tudo</Text>
                    </View>
                    <View style={styles.midButtons}>
                        <FlatList
                            data={dataTodos}
                            renderItem={renderItem}
                            keyExtractor={(item) => String(item.id)}
                        />
                    </View>
                </View>
            </ScrollView>
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
    styleImg: {
        width: '23%'
    },
    txtNome: {
        width: '50%',
    },
    txtValor: {
        width: '12%',
    },
    item: {
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center'
    },
    topArea: {
        width: '100%',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 50,
        elevation: 5, // sombra no Android
        shadowColor: '#000', // sombra no iOS
        shadowOffset: { width: 20, height: 20 },
        shadowOpacity: 0.3,
        shadowRadius: 3,
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
    cardHeader: {
        backgroundColor: '#28a745',
        padding: 15,
        marginVertical: 5,
        borderRadius: 20,
        width: '100%',
        height: 200,
        flexDirection: 'column',
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
        fontWeight: 800
    },
    headerText: {
        fontSize: 18,
        color: '#fff',
        letterSpacing: 1,
        marginBottom: '1%',
    },
    valueText: {
        fontSize: 24,
        color: '#fff',
    },
    infoText: {
        fontSize: 18,
        fontWeight: 800,
        marginBottom: 20,
        textAlign: 'center',
    },
    headerCardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        height: '50%',
    },
    leftHeader: {
        width: '80%',
    },
    rightHeader: {
        width: '20%',
        alignItems: 'flex-end'
    },
    headerCardFooter: {
        flexDirection: 'column',
        justifyContent: 'flex-end',
        width: '100%',
        height: '50%',
    },

    footerText: {
        color: '#fff',
        fontSize: 12,
        marginBottom: '1%',
    },
});

export default WalletMid;
