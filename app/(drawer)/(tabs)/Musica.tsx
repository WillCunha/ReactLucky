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
import { NativeStackNavigationProp } from 'react-native-screens/lib/typescript/native-stack/types';
import TrackPlayer, { Capability } from 'react-native-track-player';

type Musica = {
  id: string;
  nome: string;
  artista: string,
  letra: string
  nivel: string;
  pontos: number;
  tempo_inicio: number;
  tempo_fim: number;
  resposta_a: string;
  resposta_b: string;
  resposta_c: string;
  resposta_correta: 'a' | 'b' | 'c';
  grupo: string,
  slug: string
};

export default function MusicasScreen() {
  const [musicas, setMusicas] = useState<Musica[]>([]);
  const [index, setIndex] = useState(0);
  const [respostaSelecionada, setRespostaSelecionada] = useState<null | 'a' | 'b' | 'c'>(null);
  const [respostaCorreta, setRespostaCorreta] = useState<string | null>(null);
  const [pontos, setPontos] = useState(0);
  const [mostrarModalFinal, setMostrarModalFinal] = useState(false);
  const [score, setScore] = useState(0);
  const [erroCarregamento, setErroCarregamento] = useState(false);
  const [tempoRestante, setTempoRestante] = useState(10);
  const [intervalo, setIntervalo] = useState<NodeJS.Timeout | null>(null);

  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const musicaAtual = musicas[index];

  const setupTrackPlayer = async () => {
    await TrackPlayer.setupPlayer({
      waitForBuffer: true,
    });

    await TrackPlayer.updateOptions({
      stopWithApp: true,
      capabilities: [
        Capability.Play,
        Capability.Pause,
        Capability.Stop,
      ],
      compactCapabilities: [
        Capability.Play,
        Capability.Pause,
      ],
      notificationCapabilities: [
        Capability.Play,
        Capability.Pause,
        Capability.Stop,
      ],
    });
  };

  const loadScore = async () => {
    const jsonString = await AsyncStorage.getItem("WF_LUCKY");
    if (!jsonString) return;
    const jsonData = JSON.parse(jsonString);
    if (Array.isArray(jsonData) && jsonData[0]) {
      jsonData[0].score = Number(jsonData[0].score ?? 500);
      await AsyncStorage.setItem('WF_LUCKY', JSON.stringify(jsonData));
      setScore(jsonData[0].score);
    }
  };

  const loadMusicas = async () => {
    try {
      setErroCarregamento(false);
      const response = await fetch("https://api.wfsoft.com.br/wf-lucky/api/lucky/musicas/select");
      const data = await response.json();
      if (data?.data) {
        setMusicas(data.data);
      } else {
        setErroCarregamento(true);
      }
    } catch (error) {
      setErroCarregamento(true);
    }
  };

  const tocarTrecho = async () => {
    await TrackPlayer.reset();
    console.log("Link musica: " + "https://api.wfsoft.com.br/wf-lucky/files/songs/"+musicaAtual.grupo+"/"+musicaAtual.slug)
    await TrackPlayer.add({
      id: 'track',
      url: 'https://api.wfsoft.com.br/wf-lucky/files/songs/'+musicaAtual.grupo+'/'+musicaAtual.slug,
      title: musicaAtual.nome,
    });
    await TrackPlayer.seekTo(musicaAtual.tempo_inicio);
    await TrackPlayer.play();
    setTimeout(() => TrackPlayer.pause(), (musicaAtual.tempo_fim - musicaAtual.tempo_inicio) * 1000);
  };

  const iniciarTimer = () => {
    setTempoRestante(10);
    if (intervalo) clearInterval(intervalo);
    const novo = setInterval(() => {
      setTempoRestante((t) => {
        if (t === 1) {
          clearInterval(novo);
          penalizarSemResposta();
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    setIntervalo(novo);
  };

  const penalizarSemResposta = async () => {
    const pontosMusica = musicaAtual.pontos;
    const novoScore = score - pontosMusica;
    setScore(novoScore);
    await atualizarScore(novoScore);
    setPontos(p => p - pontosMusica);
    avancar();
  };

  const atualizarScore = async (novo: number) => {
    const jsonString = await AsyncStorage.getItem('WF_LUCKY');
    if (jsonString) {
      const jsonData = JSON.parse(jsonString);
      if (Array.isArray(jsonData) && jsonData[0]) {
        jsonData[0].score = novo;
        await AsyncStorage.setItem('WF_LUCKY', JSON.stringify(jsonData));
      }
    }
  };

  const selecionarResposta = async (resp: 'a' | 'b' | 'c') => {
    if (respostaSelecionada) return;
    if (intervalo) clearInterval(intervalo);
    setRespostaSelecionada(resp);
    setRespostaCorreta(musicaAtual.resposta_correta);
    const acertou = resp === musicaAtual.resposta_correta;
    const pontosMusica = musicaAtual.pontos;
    const novoScore = acertou ? score + pontosMusica : score - pontosMusica;
    setScore(novoScore);
    await atualizarScore(novoScore);
    setPontos(p => acertou ? p + pontosMusica : p - pontosMusica);
    setTimeout(avancar, 1500);
  };

  const avancar = () => {
    if (index < musicas.length - 1) {
      setIndex(i => i + 1);
      resetarEstado();
    } else {
      setMostrarModalFinal(true);
    }
  };

  const resetarEstado = () => {
    if (intervalo) clearInterval(intervalo);
    setRespostaSelecionada(null);
    setRespostaCorreta(null);
    iniciarTimer();
  };

  useEffect(() => {
    loadScore();
    loadMusicas();
    setupTrackPlayer();
  }, []);

  useEffect(() => {
    if (musicas.length) iniciarTimer();
    return () => intervalo && clearInterval(intervalo);
  }, [index, musicas.length]);

  if (!musicas.length) {
    return <View style={styles.container}><Text>Carregando músicas...</Text></View>;
  }

  const formatar = (n: number) => String(n).padStart(2, '0');

  return (
    <View style={styles.container}>
      <ScrollView>
        <Text style={styles.titulo}>{musicaAtual.nome}</Text>
        <TouchableOpacity style={styles.botao} onPress={tocarTrecho}><Text>▶️ Ouvir trecho</Text></TouchableOpacity>
        <Text style={styles.info}>⏳ {tempoRestante}s | 💰 {formatar(score)}</Text>
        <Text style={styles.info}>🎶 Gênero: {musicaAtual.grupo} | 🎯 05 pts</Text>
        {(['a', 'b', 'c'] as const).map(letra => (
          <TouchableOpacity
            key={letra}
            onPress={() => selecionarResposta(letra)}
            style={respostaSelecionada === letra
              ? letra === respostaCorreta ? styles.correta : styles.errada
              : styles.alternativa}
          >
            <Text>{`${letra.toUpperCase()}) ${musicaAtual[`alternativa_${letra}`]}`}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      <Modal visible={mostrarModalFinal} transparent animationType="slide">
        <View style={styles.modal}><Text>🏆 Fim do Quiz!</Text></View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  titulo: { fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
  info: { marginVertical: 5 },
  botao: { backgroundColor: '#d0e1ff', padding: 12, borderRadius: 10, marginVertical: 10 },
  alternativa: { padding: 15, backgroundColor: '#f0f0f0', marginVertical: 5, borderRadius: 10 },
  correta: { padding: 15, backgroundColor: '#d4edda', marginVertical: 5, borderRadius: 10 },
  errada: { padding: 15, backgroundColor: '#f8d7da', marginVertical: 5, borderRadius: 10 },
  modal: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#000000aa' }
});
