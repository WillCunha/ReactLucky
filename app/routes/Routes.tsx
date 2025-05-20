import React from 'react';
import { View, Text } from 'react-native';
import { NavigationContainer, NavigationIndependentTree } from '@react-navigation/native'
import {Redirect} from 'expo-router'
import { useAuth } from '../context/Auth';
import Login from '../(login)/login';
import HomeScreen from '../(drawer)/(tabs)';


export function Router() {

    const {authData, isLoading} = useAuth();
    if (isLoading) {
        return (
            <View style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}>
                <Text>Carregando informações....</Text>
            </View>
        );
    }
    return (

        
        <NavigationIndependentTree>
            {authData ?  <HomeScreen /> : <Login />}
        </NavigationIndependentTree>
    );
}