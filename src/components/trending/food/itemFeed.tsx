import { View, Pressable, Text, Image, StyleSheet, Button } from 'react-native';
import { FoodsProps } from '../trending';
import { Feather } from '@expo/vector-icons';
import { Route, router } from 'expo-router';

export default function ItemFeed({ food }: { food: FoodsProps }) {


    return (
        <Pressable
            onPress={() => router.push({
                pathname: '(details)' + food.id,
                params: { codigoBarra: food.codigoBarra, name: food.name, categoria: food.categoria, price: food.valor, desc: food.desc, imagem: food.imagem }
            })}
            style={styles.pressableStyle}>
            <View style={styles.styleImg}>
                <Image
                    source={{
                        uri:
                            'https://api.wfsoft.com.br/wf-stock/files/imagem/' + food.imagem
                    }}
                    style={{ width: 144, minHeight: 150, borderRadius: 12 }}
                    resizeMode='contain'
                />


            </View>
            <View style={styles.styleDetails}>
                <Text style={styles.textName}>{food.name}</Text>
                <View style={styles.bottomLine}>
                    <Text style={styles.textPrice}>R$ {food.valor}</Text>
                    <View style={styles.btnPlusCircle}>
                        <Feather name='plus' size={16} color='#673ab7' />
                    </View>
                </View>
            </View>
        </Pressable>
    )

    
}

const styles = StyleSheet.create({

    pressableStyle: {
        position: 'relative',
        borderRadius: 12,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 6,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        backgroundColor: 'white',
        marginLeft: '2%',
        marginRight: '2%',
        width: '45%',
        minHeight: 275,
        maxHeight: 275,
    },
    styleImg: {
        maxHeight: 180,
        minHeight: 180,
        overflow: 'hidden',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#e1e5ea',
        borderTopLeftRadius: 12,
        borderTopRightRadius: 12,
    },
    styleDetails: {
        margin: 3,
        padding: 5,
        alignContent: 'flex-end'
    },
    bottomLine: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end'
    },
    textName: {
        fontSize: 17,
        color: '#919297',
        fontWeight: 400,
        textTransform: 'capitalize'
    },
    textPrice: {
        fontSize: 15,
        color: '#000',
        fontWeight: '600',
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