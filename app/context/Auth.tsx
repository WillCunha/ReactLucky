import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { Alert } from 'react-native';
export interface AuthData {
  token: string;
  email: string;
  nome: string;
  logado: boolean,
}

interface AuthContextData {
  authData?: AuthData;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider: React.FC = ({ children }) => {
  const [authData, setAuthData] = useState<AuthData>();
  const [logado, setLogado] = useState();
  const [isLoading, setisLoading] = useState(true);

  useEffect(() => {
    loadStorageData();
  }, []);

  async function loadStorageData(): Promise<void> {
    try {
      //Try get the data from Async Storage
      const authDataSerialized = await AsyncStorage.getItem('WF_LUCKY');
      if (authDataSerialized) {
        //If there are data, it's converted to an Object and the state is updated.
        const _authData: AuthData = JSON.parse(authDataSerialized);
        setAuthData(_authData);
      }
    } catch (error) {
    } finally {
      setisLoading(false);
    }
  }

  async function signIn(email: string, password: string) {

    if (email !== '' && password !== '') {

      const url = 'https://api.wfsoft.com.br/wf-lucky/api/lucky/login';
      const username = email;
      const pass = password;


      try {
        await axios.post(url, {
          telefone: username,
          pass: pass
        })
          .then(response => {
            console.log(response.data.resp);
            if (response.data.resp == 400) {
              
              Alert.alert('Erro: ', 'Número de telefone ou senha incorretos!');
            } else {
              console.log(response.data.resp);
              AsyncStorage.setItem('WF_LUCKY', JSON.stringify(response.data.resp));
              setAuthData(response.data.resp);
              setisLoading(false);
            }
          })
      } catch (error) {
        console.error('ERRO: ', error);
      }

    } else {
      Alert.alert('É necessário preencher os campos');
    }
  }

  async function signOut() {
    setAuthData(undefined);
    AsyncStorage.removeItem('WF_LUCKY');
  }

  return (
    <AuthContext.Provider value={{ authData, signIn, signOut, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth(): AuthContextData {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
}
