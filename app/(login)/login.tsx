import { AntDesign } from "@expo/vector-icons";
import {
    GoogleSignin,
    isErrorWithCode,
    statusCodes
} from '@react-native-google-signin/google-signin';
import { useNavigation } from "@react-navigation/native";
import { Link } from "expo-router";
import React, { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Image,
    KeyboardAvoidingView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from "react-native";
import { AccessToken, GraphRequest, GraphRequestManager, LoginManager } from 'react-native-fbsdk-next';
import { useAuth } from "../context/Auth";


export default function LoginScreen() {

    const navigation = useNavigation();

    const [email, setEmail] = useState("");
    const [password, setPass] = useState("");
    const [carregando, setCarregando] = useState(false);
    const [mostrarSenha, setMostrarSenha] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [userInfo, setUserInfo] = useState<any>(null);

    useEffect(() => {
        GoogleSignin.configure({
            webClientId: '515317620527-g6eikuir369gdcvmc868ljng30j9qsvn.apps.googleusercontent.com', // obtido no console do Google
            iosClientId: 'com.googleusercontent.apps.515317620527-07o9rcbq0mnl78i47mh8n7v88hn3enbi'
        });
    }, []);

    const signInWithGoogle = async () => {
        try {
            await GoogleSignin.hasPlayServices();
            const info = await GoogleSignin.signIn();

            const { user } = info.data;
            console.log(info.data);
            if (user?.email) {
                console.log("email" + user?.email)
                const { name, email, photo } = user;

                navigation.navigate('Continuar', { name, email, photo, plataforma: 'google' });
                
            } else {
                Alert.alert("Login cancelado.");
            }
        } catch (err) {
            console.log('Sign-In error:', JSON.stringify(err, null, 2));
            if (isErrorWithCode(err)) {
                switch (err.code) {
                    case statusCodes.IN_PROGRESS:
                        setError("Login em progresso... aguarde");
                        break;

                    case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
                        setError("O 'Play Services' não está disponível neste dispositivo.");
                        break;

                    default:
                        setError(err.code);
                }
            }
        }
    };



    const signOutWithGoogle = async () => {
        try {
            await GoogleSignin.signOut();
            setUserInfo(null);
            console.log("SAIU!")
        } catch (error) {
            console.error(error);
        }
    };

    const signInWithFacebook = async () => {
        try {
            // Faz o login solicitando permissões
            const result = await LoginManager.logInWithPermissions(['public_profile', 'email']);

            if (result.isCancelled) {
                Alert.alert('Login cancelado');
                return;
            }

            const data = await AccessToken.getCurrentAccessToken();

            if (!data) {
                Alert.alert('Erro ao obter token de acesso');
                return;
            }
            const infoRequest = new GraphRequest(
                '/me',
                {
                    accessToken: data.accessToken,
                    parameters: {
                        fields: {
                            string: 'id, name, email, picture.type(large)',
                        },
                    },
                },
                (error, result) => {
                    if (error) {
                        Alert.alert('Erro ao buscar dados do usuário', error.toString());
                    } else {
                        setUserInfo({
                            name: result.name,
                            email: result.email,
                            picture: result.picture.data.url,
                        });
                    }
                }
            );
            new GraphRequestManager().addRequest(infoRequest).start();
            console.log(userInfo);
        } catch (e) {
            Alert.alert('Erro no login com Facebook', e.toString());
        }
    };


    const { signIn } = useAuth();

    function handleLogin() {
        signIn(email, password);
    }

    const alternarVisibilidade = () => {
        setMostrarSenha(!mostrarSenha);
    };

    return (
        <View style={{ flex: 1, backgroundColor: "#3CAE54" }}>
            <View
                style={{
                    width: "100%",
                    maxHeight: 250,
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                <Image
                    source={require("../../assets/images/logoLucky.png")}
                    style={{ height: 150, width: 100 }}
                    resizeMode="contain"
                />
            </View>

            <View
                style={{
                    flex: 1,
                    padding: 25,
                    backgroundColor: "#fff",
                    borderTopLeftRadius: 20,
                    borderTopRightRadius: 20,
                }}
            >
                <Text style={styles.textsH1}>CONTA LUCKY</Text>


                <KeyboardAvoidingView behavior="padding">
                    <Text style={{ color: "#717171", fontWeight: "600" }}>
                        Telefone:
                    </Text>
                    <TextInput
                        style={styles.input}
                        value={email}
                        onChangeText={setEmail}
                        autoCapitalize="none"
                        keyboardType="number-pad"
                        placeholder="Seu telefone sem espaços"
                    />

                    <Text style={{ color: "#717171", fontWeight: "600" }}>Senha:</Text>
                    <View
                        style={{
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >
                        <TextInput
                            style={[
                                styles.input,
                                {
                                    flex: 1,
                                    borderRightWidth: 0,
                                    borderTopRightRadius: 0,
                                    borderBottomRightRadius: 0,
                                },
                            ]}
                            value={password}
                            onChangeText={setPass}
                            placeholder="******"
                            secureTextEntry={!mostrarSenha}
                        />
                        <TouchableOpacity
                            onPress={alternarVisibilidade}
                            style={styles.olho}
                        >
                            <AntDesign
                                name={mostrarSenha ? "eye" : "eyeo"}
                                size={24}
                                color="#333"
                            />
                        </TouchableOpacity>
                    </View>

                    <Text style={{ color: "#cc0000", fontSize: 14, fontWeight: 800 }} >{error}</Text>

                    <TouchableOpacity onPress={handleLogin} style={styles.button}>
                        <Text style={styles.buttonTxt}> Entrar </Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={signInWithGoogle} style={styles.buttonRedesG}>
                        <Image source={require('../../assets/images/gIcon.png')} style={styles.iconSocial} />
                        <Text style={styles.buttonTxtG}> Continuar com o Google </Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={signOutWithGoogle} style={styles.buttonRedesG}>
                        <Image source={require('../../assets/images/gIcon.png')} style={styles.iconSocial} />
                        <Text style={styles.buttonTxtG}> SAIR com o Google </Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={signInWithFacebook} style={styles.buttonRedesF}>
                        <Image source={require('../../assets/images/fIcon.png')} style={styles.iconSocial} />
                        <Text style={styles.buttonTxtF}> Continuar com o Facebook </Text>
                    </TouchableOpacity>

                    {carregando ? (
                        <ActivityIndicator size={"small"} style={{ margin: 20 }} />
                    ) : (
                        <Link style={{ marginTop: "10%" }} href="/register">
                            <Text
                                style={{
                                    color: "#D4D3D8",
                                    fontWeight: "700",
                                    fontSize: 14,
                                    textAlign: "center",
                                    marginTop: "10%",
                                }}
                            >
                                Não tem uma conta no Lucky ainda? Registrar-se agora!
                            </Text>
                        </Link>
                    )}
                </KeyboardAvoidingView>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    textsH1: {
        textAlign: "center",
        fontSize: 25,
        fontWeight: "900",
        fontFamily: "Dongle_700Bold",
        marginBottom: "5%",
        letterSpacing: -1.5,
        color: "#28262E",
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
    olho: {
        padding: 10,
        borderWidth: 2,
        borderColor: "#F5F5F5",
        borderLeftWidth: 0,
        borderTopRightRadius: 4,
        borderBottomRightRadius: 4,
        height: 50,
        marginBottom: "3%",
    },
    button: {
        marginTop: "2%",
        backgroundColor: "#3CAE54",
        borderWidth: 2,
        borderRadius: 5,
        borderColor: "#ffffff",
        padding: 10,
        height: 50,
        justifyContent: "center",
        alignItems: "center",
    },
    buttonRedesG: {
        marginTop: "2%",
        backgroundColor: "#fff",
        borderWidth: 2,
        borderRadius: 5,
        borderColor: "#DEDEDE",
        padding: 10,
        height: 50,
        flexDirection: "row",
        justifyContent: 'space-evenly',
        alignItems: "center",
    },
    buttonTxt: {
        textAlign: "center",
        fontSize: 15,
        textTransform: "uppercase",
        color: "#ffffff",
        fontWeight: "800",
    },
    buttonRedesF: {
        marginTop: '2%',
        fontFamily: 'Arial sans-serif',
        backgroundColor: '#ffffff',
        borderWidth: 2,
        borderRadius: 5,
        borderColor: '#0071F2',
        padding: 10,
        height: 50,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'center',
    },
    buttonTxtG: {
        textAlign: "center",
        fontSize: 15,
        textTransform: "uppercase",
        color: "#5F6368",
        fontWeight: "800",
    },
    buttonTxtF: {
        textAlign: 'center',
        fontSize: 15,
        textTransform: 'uppercase',
        color: '#0071F2',
        fontWeight: 800,
    },
    iconSocial: {
        maxWidth: 22,
        maxHeight: 22,
    }
});
