
import axios from 'axios';
import { Link, Redirect, useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import { ActivityIndicator, Alert, Image, KeyboardAvoidingView, StyleSheet, Text, TextInput, View } from 'react-native';
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";
import { useAuth } from '../../../app/context/Auth';

export default function Continuar() {

    const { vName, vEmail, vPhoto, vPlataforma } = useLocalSearchParams();

    // Funções de validação
    const validatePhone = (phone: string): boolean => {
        const phoneRegex = /^\d{11}$/;
        return phoneRegex.test(phone);
    };

    const validateEmail = (email: string): boolean => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const validateCPF = (cpf: string): boolean => {
        cpf = cpf.replace(/[^\d]+/g, '');
        if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return false;

        let sum = 0;
        for (let i = 0; i < 9; i++) sum += parseInt(cpf.charAt(i)) * (10 - i);
        let rev = 11 - (sum % 11);
        if (rev === 10 || rev === 11) rev = 0;
        if (rev !== parseInt(cpf.charAt(9))) return false;

        sum = 0;
        for (let i = 0; i < 10; i++) sum += parseInt(cpf.charAt(i)) * (11 - i);
        rev = 11 - (sum % 11);
        if (rev === 10 || rev === 11) rev = 0;
        if (rev !== parseInt(cpf.charAt(10))) return false;

        return true;
    };

    const validateSenha = (pass: string, repeatPass: string): boolean => {
        if (pass === repeatPass) {
            if (pass.length > 8) {
                return true;
            }
        }
    }
    const [cep, setCep] = useState('');
    const [phone, setPhone] = useState('');
    const [cpf, setCpf] = useState('');

    async function handleValidation(){
        const isPhoneValid = validatePhone(phone);
        const isCpfValid = validateCPF(cpf);
        

        if (isPhoneValid && isCpfValid) {
            const url = 'https://api.wfsoft.com.br/wf-lucky/api/lucky/cadastro';
            const dadosTelefone = phone;
            const dadosEmail = vEmail;
            const dadosCpf = cpf;
            const dadosNome = vName;
            const dadosCep = cep;
            const dadosPlataforma = vPlataforma;
            
            try {
                await axios.post(url, {
                    telefone: dadosTelefone,
                    email: dadosEmail,
                    cpf: dadosCpf,
                    nome: dadosNome,
                    cep: dadosCep,
                    plataforma: dadosPlataforma
                })
                    .then(response => {
                        return <Redirect href='/login'/>
                    })
            } catch (error) {
                console.log(error)
            }
        } else {
            let message = 'Corrija os seguintes campos:\n';
            if (!isPhoneValid) message += '- Telefone inválido (11 dígitos)\n';
            if (!isCpfValid) message += '- CPF inválido\n';
            Alert.alert('❌ Erro de validação', message);
        }
    };


    const [carregando, setCarregando] = useState(false);

    const { signIn } = useAuth();

    function handleLogin() {
        signIn(email, password);
    }

    return (
        <View style={{ width: '100%', justifyContent: 'center', alignItems: 'center', backgroundColor: '#3CAE54' }} >
            <View style={{ width: '100%', maxHeight: 150, minHeight: 150, overflow: 'hidden',  justifyContent: 'center', alignItems: 'center' }}>
                <Image
                    source={require('../../../assets/images/logoLucky.png')}
                    style={{ maxHeight: 150, maxWidth: 100 }}
                    resizeMode="contain"
                />

            </View>
            <ScrollView showsHorizontalScrollIndicator={false} showsVerticalScrollIndicator={false} contentContainerStyle={{ flexGrow: 1 }}>
                <View style={{ padding: 25, width: '100%', height: 'auto', marginTop: '5%', justifyContent: 'center', backgroundColor: '#fff', borderTopLeftRadius: 20, borderTopRightRadius: 20 }} >
                    <Text style={styles.textsH1}>CRIAR CONTA LUCKY</Text>
                    <Text style={{ color: '#717171', fontWeight: 600, fontSize: 14, textAlign: 'left', marginTop: '2%', marginBottom: '7%' }}>{vName}, antes de continuar, é necessário que você nos dê apenas 03 informações.</Text>
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
                        <Text style={{ color: '#D4D3D8', fontWeight: 700, fontSize: 12, textAlign: 'left', marginBottom: '5%' }}>Para sua segurança, o Lucky criptografa informações sensíveis. </Text>
                        <Text style={{ color: '#717171', fontWeight: '600' }}>Telefone:</Text>
                        <TextInput
                            style={styles.input}
                            keyboardType="number-pad"
                            value={phone}
                            onChangeText={setPhone}
                            autoCapitalize="none"
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
                            onPress={() => handleValidation()}
                            style={styles.button}>
                            <Text style={styles.buttonTxt}>CONTINUAR</Text>
                        </TouchableOpacity>

                        <Text style={{ color: '#D4D3D8', fontWeight: 700, fontSize: 12, textAlign: 'left', marginTop: '5%' }}>Ao criar sua conta, você concorda com os termos de políticas do Lucky. </Text>
                        {carregando ? (
                            <ActivityIndicator size={'small'} style={{ margin: 20 }} />
                        ) : (
                            <Link style={{ marginTop: '20%' }} href='/register'>


                            </Link>
                        )}
                    </KeyboardAvoidingView>
                </View>
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({

    textsH1: {
        textAlign: 'center',
        fontSize: 25,
        fontWeight: 900,
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
        fontFamily: 'Arial sans-serif',
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
        fontWeight: 800,
    }
})