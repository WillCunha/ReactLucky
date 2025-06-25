import { RootStackParamList } from '@/app/routes/Routes';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import {
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { NativeStackNavigationProp } from 'react-native-screens/lib/typescript/native-stack/types';

type Pergunta = {
    id: string;
    pergunta: string;
    alternativa_a: string;
    alternativa_b: string;
    alternativa_c: string;
    resposta_correta: 'a' | 'b' | 'c';
    pontos: number;
    nivel: string;
};

export default function PerguntasScreen() {
    const [perguntas, setPerguntas] = useState<Pergunta[]>([]);
    const [index, setIndex] = useState(0);
    const [respostaSelecionada, setRespostaSelecionada] = useState<null | 'a' | 'b' | 'c'>(null);
    const [respostaCorreta, setRespostaCorreta] = useState<string | null>(null);
    const [pontos, setPontos] = useState(0);
    const [mostrarModalFinal, setMostrarModalFinal] = useState(false);
    const [score, setScore] = useState(0);
    const [erroCarregamento, setErroCarregamento] = useState(false);
    const [timer, setTimer] = useState<NodeJS.Timeout | null>(null);
    const [tempoRestante, setTempoRestante] = useState(5);
    const [intervalo, setIntervalo] = useState<NodeJS.Timeout | null>(null);

    const perguntaAtual = perguntas[index];

    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();


    const loadScore = async () => {
        const jsonString = await AsyncStorage.getItem("WF_LUCKY");
        if (!jsonString) return;
        const jsonData = JSON.parse(jsonString);
        if (Array.isArray(jsonData) && jsonData[0]) {
            jsonData[0].score = Number(jsonData[0].score ?? 500);
            await AsyncStorage.setItem('WF_LUCKY', JSON.stringify(jsonData));
            setScore(jsonData[0].score);
            console.log("🟢 Score carregado:", jsonData[0].score, typeof jsonData[0].score);
        }
    };


    const penalizarSemResposta = async () => {
        const pontosDaPergunta = perguntas[index].pontos;
        const novoScore = Number(score) - Number(pontosDaPergunta);

        console.log("❌ Tempo esgotado! Novo score:", novoScore);

        setScore(novoScore);
        await atualizarScore(novoScore);

        setPontos((p) => Number(p) - Number(pontosDaPergunta));

        if (index < perguntas.length - 1) {
            setIndex((i) => i + 1);
            resetarEstado();
        } else {
            setMostrarModalFinal(true);
        }
    };



    const iniciarTimer = () => {
        setTempoRestante(10);
        if (intervalo) clearInterval(intervalo);

        const novoIntervalo = setInterval(() => {
            setTempoRestante((tempo) => {
                if (tempo === 1) {
                    clearInterval(novoIntervalo);
                    penalizarSemResposta();
                    return 0;
                }
                return tempo - 1;
            });
        }, 1000);

        setIntervalo(novoIntervalo);
    };


    const loadPerguntas = async () => {
        try {
            setErroCarregamento(false); // resetar antes
            const response = await fetch("https://api.wfsoft.com.br/wf-lucky/api/lucky/perguntas/select");
            const data = await response.json();
            if (data?.resp) {
                setPerguntas(data.resp);
            } else {
                console.warn("Ocorreu um erro na busca das perguntas:", data);
                setErroCarregamento(true);
            }
        } catch (error) {
            console.error("Erro ao carregar perguntas:", error);
            setErroCarregamento(true);
        }
    };


    useEffect(() => {
        loadScore();
        loadPerguntas();
    }, []);

    useEffect(() => {
        if (perguntas.length > 0) {
            iniciarTimer();
        }
        // limpar timer antigo ao desmontar componente
        return () => {
            if (timer) clearTimeout(timer);
        };
    }, [index, perguntas.length]);

    const atualizarScore = async (novoScore: number) => {
        try {
            const jsonString = await AsyncStorage.getItem('WF_LUCKY');
            if (jsonString) {
                const jsonData = JSON.parse(jsonString);
                if (Array.isArray(jsonData) && jsonData[0]) {
                    jsonData[0].score = Number(novoScore); // força número
                    await AsyncStorage.setItem('WF_LUCKY', JSON.stringify(jsonData));
                    console.log("✔ Score atualizado no AsyncStorage:", jsonData[0].score, typeof jsonData[0].score);
                }
            }
        } catch (err) {
            console.error("Erro ao atualizar score:", err);
        }
    };



    const selecionarResposta = async (resposta: 'a' | 'b' | 'c') => {
        if (respostaSelecionada !== null) return;
        if (timer) clearTimeout(timer);
        if (intervalo) clearInterval(intervalo);

        setRespostaSelecionada(resposta);
        setRespostaCorreta(perguntas[index].resposta_correta);

        const acertou = resposta === perguntas[index].resposta_correta;
        const pontosDaPergunta = perguntas[index].pontos;



        let novoScore = acertou
            ? Number(score) + Number(pontosDaPergunta)
            : Number(score) - Number(pontosDaPergunta);

        console.log("NOVO SCORE CALCULADO:", novoScore, typeof novoScore);

        setScore(novoScore);
        await atualizarScore(novoScore);

        setPontos((p) => acertou
            ? Number(p) + Number(pontosDaPergunta)
            : Number(p) - Number(pontosDaPergunta));

        setTimeout(() => {
            if (index < perguntas.length - 1) {
                setIndex((i) => i + 1);
                resetarEstado();
            } else {
                setMostrarModalFinal(true);
            }
        }, 1500);
    };


    const resetarEstado = () => {
        if (intervalo) clearInterval(intervalo);
        setRespostaSelecionada(null);
        setRespostaCorreta(null);
        iniciarTimer();
    };

    const getTextoAlternativa = (letra: 'a' | 'b' | 'c', texto: string) => {
        if (!respostaSelecionada) return `${letra.toUpperCase()}) ${texto}`;
        if (letra === respostaSelecionada) {
            if (letra === respostaCorreta) return `✅ ${letra.toUpperCase()}) ${texto}`;
            else return `❌ ${letra.toUpperCase()}) ${texto}`;
        }
        if (letra === respostaCorreta) return `✅ ${letra.toUpperCase()}) ${texto}`;
        return `${letra.toUpperCase()}) ${texto}`;
    };

    const getStyleAlternativa = (letra: 'a' | 'b' | 'c') => {
        if (!respostaSelecionada) return styles.alternativa;
        if (letra === respostaCorreta && letra === respostaSelecionada) return [styles.alternativa, styles.correta];
        if (letra === respostaSelecionada && letra !== respostaCorreta) return [styles.alternativa, styles.errada];
        if (letra === respostaCorreta) return [styles.alternativa, styles.correta];
        return styles.alternativa;
    };

    const formatarNumero = (num) => String(num).padStart(2, '0');

    if (perguntas.length === 0) {
        return (
            <View style={styles.container}>
                {erroCarregamento ? (
                    <View style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }}>
                        <Text style={{ fontSize: 18, textAlign: 'center', marginBottom: 20 }}>❌ Não foi possível carregar as perguntas.</Text>
                        <TouchableOpacity
                            onPress={loadPerguntas}
                            style={{ backgroundColor: '#f88', padding: 12, borderRadius: 10 }}
                        >
                            <Text style={{ fontWeight: 'bold', color: 'white' }}>🔁 Tentar novamente</Text>
                        </TouchableOpacity>
                    </View>
                ) : (
                    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                        <Text style={{ textAlign: 'center' }}>🔄 Conectando ao servidor do Lucky...</Text>
                    </View>
                )}
            </View>
        );
    }


    return (
        <View style={styles.container}>
            <Animated.View
                entering={FadeIn.duration(300)}
                exiting={FadeOut.duration(300)}
                key={perguntaAtual.id}
                style={{ flex: 1 }}
            >
                <ScrollView contentContainerStyle={styles.content}>
                    <View style={styles.barraContainer}>
                        <View
                            style={[
                                styles.barraProgresso,
                                {
                                    width: `${((index + 1) / perguntas.length) * 100}%`,
                                },
                            ]}
                        />
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Text style={{ fontSize: 16, textAlign: 'center' }}>
                            ⏳Tempo restante: {tempoRestante}s
                        </Text>
                        <Text style={{ fontSize: 16, textAlign: 'center', fontWeight: '800' }}>
                            💰 Seu score: {formatarNumero(score)}
                        </Text>
                    </View>

                    <View style={styles.areaPergunta}>
                        <View style={styles.headerArea}>
                            <Text>Dificuldade: {perguntaAtual.nivel}</Text>
                            <Text>Pontos da Pergunta: {formatarNumero(Number(perguntaAtual.pontos))}</Text>
                        </View>
                        <Text style={styles.pergunta}>{formatarNumero(index + 1)}.) {perguntaAtual.pergunta}</Text>
                        {(['a', 'b', 'c'] as const).map((letra) => (
                            <TouchableOpacity
                                key={letra}
                                style={getStyleAlternativa(letra)}
                                onPress={() => selecionarResposta(letra)}
                                disabled={!!respostaSelecionada}
                            >
                                <Text>{getTextoAlternativa(letra, perguntaAtual[`alternativa_${letra}`])}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </ScrollView>
            </Animated.View>

            <View style={styles.navegacao}>
                <Text style={styles.paginacao}>
                    Pergunta: {formatarNumero(index + 1)} de {perguntas.length}
                </Text>
                <Text style={styles.pontos}>🎯 Pontos da Partida: {formatarNumero(pontos)}</Text>
            </View>

            <Modal visible={mostrarModalFinal} transparent animationType="slide">
                <View style={styles.modalContainer}>
                    <View style={styles.modal}>
                        <Text style={styles.modalTitulo}>🏆 Quiz Finalizado!</Text>
                        <Text style={styles.modalTexto}>Você acertou {pontos} de {perguntas.length} pontos.</Text>
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
    container: { flex: 1, padding: 20 },
    content: { flex: 1, paddingBottom: 20 },
    headerArea: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: '-15%', marginBottom: '15%' },
    areaPergunta: { flex: 1, justifyContent: 'center', flexDirection: 'column' },
    pergunta: { fontSize: 20, fontWeight: 'bold', marginBottom: 20 },
    alternativa: {
        padding: 15,
        backgroundColor: '#f0f0f0',
        marginVertical: 8,
        borderRadius: 10,
    },
    correta: {
        backgroundColor: '#d4edda',
        borderColor: '#28a745',
        borderWidth: 2,
    },
    errada: {
        backgroundColor: '#f8d7da',
        borderColor: '#dc3545',
        borderWidth: 2,
    },
    navegacao: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 0,
        alignItems: 'center',
        bottom: '10%'
    },
    paginacao: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    pontos: {
        fontSize: 16,
        fontWeight: 'bold',
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
    },
    barraContainer: {
        height: 10,
        backgroundColor: '#e0e0e0',
        borderRadius: 5,
        overflow: 'hidden',
        marginBottom: 20,
    },
    barraProgresso: {
        height: '100%',
        backgroundColor: '#4caf50',
    },
});
