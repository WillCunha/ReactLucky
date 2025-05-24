import React from 'react';
import { StatusBar, StyleSheet, View } from 'react-native';



export default function Continuar(){
    return(
        <View style={styles.container}>
        <StatusBar backgroundColor="#3CAF54" barStyle="light-content" />
            <Continuar />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff'
    },
})