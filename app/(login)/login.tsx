import React from 'react';
import {View, StyleSheet, StatusBar} from 'react-native';
import LoginScreen from '@/src/components/login';
import Register from './register';



export default function Login(){
    return(
        <View style={styles.container}>
        <StatusBar backgroundColor="#3CAF54" barStyle="light-content" />
            <LoginScreen />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff'
    },
})