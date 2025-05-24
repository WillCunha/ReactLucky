import { NavigationIndependentTree } from '@react-navigation/native';
import React from 'react';
import { Text, View } from 'react-native';
import HomeScreen from '../(drawer)/(tabs)';
import { useAuth } from '../context/Auth';
import Login from '../login/login';


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