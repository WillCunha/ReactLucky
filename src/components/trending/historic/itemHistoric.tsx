import { View, Pressable, Text, Image, StyleSheet, Button } from 'react-native';
import { HistoricProp } from '@/app/(drawer)/(tabs)/Wallet';
import { Feather, Ionicons } from '@expo/vector-icons';
import { Route, router } from 'expo-router';

export default function ItemHistoric({ historic }: { historic: HistoricProp }) {


    return (

        <View style={styles.styleDetails}>
            <View style={styles.arrow}>
                <Ionicons name={historic.operation == '1' ? 'arrow-up' : 'arrow-down'} size={20} color='#fff' />
            </View>
            <View style={styles.title}>
                <Text style={styles.textName}>{historic.title}</Text>
            </View>
            <View style={styles.value}>
                <Text style={{
                    fontSize: 15,
                    color: historic.operation == '1' ? '#00F702' : '#E60023',
                    fontWeight: '800',
                }}>R$ {historic.value}</Text>
            </View>
        </View>
    )


}

const styles = StyleSheet.create({

    styleDetails: {
        margin: 3,
        padding: 5,
        alignContent: 'flex-end',
        justifyContent: 'space-between',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center'
    },
    arrow: {
        height: 50,
        width: 50,
        borderRadius: 15,
        backgroundColor: '#222222',
        justifyContent: 'center',
        alignItems: 'center',
        alignContent: 'center',
    },
    title: {
        width: '50%',
        alignItems: 'center'
    },
    value: {
        width: '33%',
        alignItems: 'center'
    },
    textName: {
        fontSize: 17,
        color: '#919297',
        fontWeight: 400,
        textTransform: 'capitalize'
    },

    btnPlusCircle: {
        backgroundColor: '#fff',
        borderColor: '#673ab7',
        borderWidth: 1,
        borderRadius: 26,
        height: 26,
        width: 26,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 6,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    }

})