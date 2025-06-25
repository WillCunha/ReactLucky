import { RootStackParamList } from '@/app/routes/Routes';
import Card from '@/src/components/cards';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { FlatList, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { NativeStackNavigationProp } from 'react-native-screens/lib/typescript/native-stack/types';

// Gera cartas com valores aleatórios, sem repetir, e com pesos de probabilidade
function gerarCartasAleatoriasSemRepeticao(qtd: number) {
    const valoresComPeso = [
        { value: '-200', peso: 1 },
        { value: '-100', peso: 2 },
        { value: '-50', peso: 3 },
        { value: '-20', peso: 4 },
        { value: '-10', peso: 6 },
        { value: '-1', peso: 8 },
        { value: '0', peso: 10 },
        { value: '10', peso: 8 },
        { value: '20', peso: 6 },
        { value: '50', peso: 4 },
        { value: '100', peso: 3 },
        { value: '2x', peso: 2 },
        { value: '3x', peso: 1 },
        { value: '200', peso: 1 },
        { value: '-75', peso: 2 },
        { value: '-25', peso: 3 },
        { value: '-30', peso: 4 },
        { value: '-5', peso: 6 },
        { value: '-9', peso: 8 },
        { value: '2', peso: 10 },
        { value: '30', peso: 8 },
        { value: '45', peso: 6 },
        { value: '75', peso: 4 },
        { value: '85', peso: 3 },
        { value: '4x', peso: 2 },
        { value: '5x', peso: 1 },
    ];

    let pool: string[] = [];
    valoresComPeso.forEach(({ value, peso }) => {
        for (let i = 0; i < peso; i++) {
            pool.push(value);
        }
    });

    pool = pool.sort(() => Math.random() - 0.5); // embaralha
    const valoresUnicos = [...new Set(pool)];
    const selecionados = valoresUnicos.slice(0, qtd);

    console.log("cartas: " + selecionados);
    return selecionados.map((value, index) => ({ id: index + 1, value }));
}

export default function Deck() {

    const [cards, setCards] = useState([]);
    const [score, setScore] = useState(0);
    const [resetTrigger, setResetTrigger] = useState(false);
    const [cliques, setCliques] = useState(0);
    const [mostrarModalFinal, setMostrarModalFinal] = useState(false);

    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

    const loadScore = async () => {
        const jsonString = await AsyncStorage.getItem("WF_LUCKY");
        if (!jsonString) return;
        const jsonData = JSON.parse(jsonString);
        if (Array.isArray(jsonData) && jsonData[0]) {
            setScore(jsonData[0].score ?? 0);
        }
    };

    useEffect(() => {
        loadScore();
        setCards(gerarCartasAleatoriasSemRepeticao(9)); // número de cartas
    }, []);

    const updateScore = async (cardValue: string) => {
        if (cliques >= 5) return;

        try {
            const jsonString = await AsyncStorage.getItem("WF_LUCKY");
            if (!jsonString) return;

            const jsonData = JSON.parse(jsonString);
            if (Array.isArray(jsonData) && jsonData.length > 0) {
                const user = jsonData[0];
                const currentScore = user.score ?? 0;
                let newScore = currentScore;

                if (cardValue.includes('x')) {
                    const multiplier = parseFloat(cardValue.replace('x', ''));
                    newScore = Math.round(currentScore * multiplier);
                } else {
                    newScore = currentScore + parseInt(cardValue);
                }

                setScore(newScore);
                setCliques((prev) => {
                    const novoClique = prev + 1;
                    if (novoClique >= 5) {
                        setMostrarModalFinal(true);
                    }
                    return novoClique;
                });

                user.score = newScore;
                await AsyncStorage.setItem("WF_LUCKY", JSON.stringify([user]));
            }
        } catch (error) {
            console.error("Erro ao atualizar o score:", error);
        }
    };


    const handleReset = async () => {
        await AsyncStorage.setItem('score', '0');
        setScore(0);
        setCards(gerarCartasAleatoriasSemRepeticao(9));
        setResetTrigger(true);
        setTimeout(() => setResetTrigger(false), 100);
    };

    return (
        <View style={styles.container}>
            <View style={{ height: 200, justifyContent: 'center' }}>
                <Text style={{ fontSize: 30, color: '#fff', textAlign: 'center', fontWeight: '800' }}>
                    💰 Pontos: {score}
                </Text>
            </View>
            <FlatList
                data={cards}
                numColumns={3}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <View style={styles.cardContainer}>
                        <Card id={item.id} value={item.value} onFlipComplete={() => {
                            if (cliques < 5) updateScore(item.value);
                        }} />
                    </View>
                )}
                contentContainerStyle={styles.deck}
            />
            <Modal visible={mostrarModalFinal} transparent animationType="slide">
                <View style={styles.modalContainer}>
                    <View style={styles.modal}>
                        <Text style={styles.modalTitulo}>🏆 Fim da Rodada!</Text>
                        <Text style={styles.modalTexto}>Você somou {score} pontos com 5 cartas.</Text>
                        <TouchableOpacity
                            style={styles.botao}
                            onPress={() => {
                                navigation.navigate('HomeScreen')
                            }}
                        >
                            <Text>🔁 Jogar Novamente</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>

    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#181818',
        justifyContent: 'center',
        alignItems: 'center',
    },
    deck: {
        gap: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    cardContainer: {
        margin: 10,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: '#000000aa',
        alignItems: 'center',
    },
    modal: {
        backgroundColor: 'white',
        padding: 25,
        borderRadius: 20,
        alignItems: 'center',
        width: '80%',
    },
    modalTitulo: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    modalTexto: {
        fontSize: 18,
        marginBottom: 20,
    },
    botao: {
        backgroundColor: '#d0e1ff',
        padding: 12,
        borderRadius: 10,
    }
});
