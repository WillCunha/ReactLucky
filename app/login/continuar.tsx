import { useNavigation, useRoute } from '@react-navigation/native';
import axios from 'axios';
import React, { useState } from "react";
import { ActivityIndicator, Alert, Image, KeyboardAvoidingView, StyleSheet, Text, TextInput, View } from 'react-native';
import { GestureHandlerRootView, ScrollView, TouchableOpacity } from "react-native-gesture-handler";
import { NativeStackNavigationProp } from 'react-native-screens/lib/typescript/native-stack/types';
import { useAuth } from '../context/Auth';
import { RootStackParamList } from '../routes/Routes';

export default function ContinuarScreen() {

    const route = useRoute<any>();
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

    const { socialSignIn } = useAuth();

    const { name, email, photo, plataforma, plataformas } = route.params;

    const nameParts = name ? name.split(/\s+/) : [];
    const nome = nameParts[0] || "";
    const second_name = nameParts.length > 1 ? nameParts.slice(1).join(" ") : "";

    const validatePhone = (phone: string): boolean => /^\d{11}$/.test(phone);
    const validateCPF = (cpf: string): boolean => {
        cpf = cpf.replace(/[^\d]+/g, '');
        if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return false;
        let sum = 0;
        for (let i = 0; i < 9; i++) sum += parseInt(cpf.charAt(i)) * (10 - i);
        let rev = 11 - (sum % 11);
        if (rev >= 10) rev = 0;
        if (rev !== parseInt(cpf.charAt(9))) return false;
        sum = 0;
        for (let i = 0; i < 10; i++) sum += parseInt(cpf.charAt(i)) * (11 - i);
        rev = 11 - (sum % 11);
        if (rev >= 10) rev = 0;
        if (rev !== parseInt(cpf.charAt(10))) return false;
        return true;
    };

    const [cep, setCep] = useState('');
    const [phone, setPhone] = useState('');
    const [cpf, setCpf] = useState('');
    const [carregando, setCarregando] = useState(false);
    const [erro, setErro] = useState('');

    async function handleValidation() {
        const isPhoneValid = validatePhone(phone);
        const isCpfValid = validateCPF(cpf);

        if (isPhoneValid && isCpfValid) {
            setCarregando(true);
            const url = 'https://api.wfsoft.com.br/wf-lucky/api/lucky/cadastro';

            try {
                await axios.post(url, {
                    telefone: phone,
                    email,
                    cpf,
                    pass: " ",
                    nome: nome,
                    sobrenome: second_name,
                    photo: photo,
                    cep,
                    register_type: plataforma,
                    acesso: 0
                }).then(response => {
                    if (response.data.resp.status == 'erro') {
                        console.log(response.data.resp);
                        setErro(response.data.resp.mensagem)
                    } else if (response.data.resp.status == 'ok') {
                        const id = response.data.resp.id;
                        const acesso = 0
                        console.log(response.data.resp.id);
                        console.warn("id: " + id)
                        const dados = [{ id, phone, email, cpf, nome, second_name, cep, photo, plataforma, plataformas, acesso }]
                        socialSignIn(email, ' ', plataforma, dados)
                    }
                });

            } catch (error) {
                console.log(error);
                Alert.alert('❌ Erro ao cadastrar', 'Tente novamente mais tarde.');
            } finally {
                setCarregando(false);
            }
        } else {
            let message = 'Corrija os seguintes campos:\n';
            if (!isPhoneValid) message += '- Telefone inválido (11 dígitos)\n';
            if (!isCpfValid) message += '- CPF inválido\n';
            Alert.alert('❌ Erro de validação', message);
        }
    };

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <View style={{ width: '100%', justifyContent: 'center', alignItems: 'center', backgroundColor: '#3CAE54' }} >
                <View style={{ width: '100%', maxHeight: 150, minHeight: 150, overflow: 'hidden', justifyContent: 'center', alignItems: 'center' }}>
                    <Image
                        source={require('../../assets/images/logoLucky.png')}
                        style={{ maxHeight: 150, maxWidth: 100 }}
                        resizeMode="contain"
                    />
                </View>
                <ScrollView showsHorizontalScrollIndicator={false} showsVerticalScrollIndicator={false} contentContainerStyle={{ flexGrow: 1 }}>
                    <View style={{ padding: 25, width: '100%', marginTop: '5%', minHeight: '100%', backgroundColor: '#fff', borderTopLeftRadius: 20, borderTopRightRadius: 20 }} >
                        <Text style={styles.textsH1}>CRIAR CONTA LUCKY</Text>
                        <Text style={{ color: '#717171', fontWeight: '600', fontSize: 14, marginTop: '2%', marginBottom: '7%' }}><Text style={{ textTransform: 'capitalize' }}>{nome}</Text>, antes de continuar, é necessário que você nos dê apenas 03 informações.</Text>
                        <KeyboardAvoidingView behavior="padding">
                            <Text style={{ color: '#717171', fontWeight: '600' }}>CPF:</Text>
                            <TextInput
                                style={[styles.input, { marginBottom: '1%' }]}
                                keyboardType="number-pad"
                                value={cpf}
                                onChangeText={setCpf}
                                placeholder="Somente números"
                                maxLength={11}
                            />
                            <Text style={{ color: '#D4D3D8', fontWeight: '700', fontSize: 12, marginBottom: '5%' }}>Para sua segurança, o Lucky criptografa informações sensíveis.</Text>
                            <Text style={{ color: '#717171', fontWeight: '600' }}>Telefone:</Text>
                            <TextInput
                                style={styles.input}
                                keyboardType="number-pad"
                                value={phone}
                                onChangeText={setPhone}
                                placeholder="Ex: 11987654321"
                            />
                            <Text style={{ color: '#717171', fontWeight: '600' }}>CEP:</Text>
                            <TextInput
                                keyboardType="number-pad"
                                style={styles.input}
                                value={cep}
                                onChangeText={setCep}
                                placeholder="Informe seu cep"
                            />

                            <TouchableOpacity
                                onPress={handleValidation}
                                style={styles.button}>
                                <Text style={styles.buttonTxt}>CONTINUAR</Text>
                            </TouchableOpacity>

                            <Text style={{ color: '#cc0000', fontWeight: '800' }}>{erro}</Text>

                            {carregando && (
                                <ActivityIndicator size={'small'} style={{ margin: 20 }} />
                            )}
                        </KeyboardAvoidingView>
                    </View>
                </ScrollView>
            </View>
        </GestureHandlerRootView>
    )
}

const styles = StyleSheet.create({
    textsH1: {
        textAlign: 'center',
        fontSize: 25,
        fontWeight: '900',
        fontFamily: 'Dongle_700Bold',
        letterSpacing: -1.5,
        color: '#28262E'
    },
    input: {
        width: '100%',
        marginVertical: 4,
        height: 50,
        borderWidth: 2,
        borderRadius: 4,
        padding: 10,
        backgroundColor: '#fff',
        borderColor: '#F5F5F5',
        marginBottom: '4%',
    },
    button: {
        marginTop: '2%',
        backgroundColor: '#3CAE54',
        borderWidth: 2,
        borderRadius: 5,
        borderColor: '#ffffff',
        padding: 10,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonTxt: {
        textAlign: 'center',
        fontSize: 15,
        textTransform: 'uppercase',
        color: '#ffffff',
        fontWeight: '800',
    }
});
