import Signup from '@/src/components/signup';
import React from 'react';
import { StatusBar, StyleSheet, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';


export default function Register() {
    return (
        <View style={styles.container}>
            <StatusBar backgroundColor="#3CAF54" translucent={false}  barStyle="light-content" />
            <GestureHandlerRootView>
                <Signup />
            </GestureHandlerRootView>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff'
    },
})