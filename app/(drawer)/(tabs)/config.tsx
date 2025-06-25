import Constants from 'expo-constants';
import { ScrollView, StatusBar, Text, View } from 'react-native';

export default function ConfigScreen() {

    const statusBarHeight = Constants.statusBarHeight;


    return (
        <ScrollView
            style={{ flex: 1, backgroundColor: '#F9F9F9' }}
            showsVerticalScrollIndicator={false}
        >
            <View className='w-full px-4' style={{ marginTop: statusBarHeight + 8, marginBottom: '3%', justifyContent: 'center', alignItems: 'center' }}>
                <>
                    <StatusBar backgroundColor="#3CAF54" translucent={false} barStyle="light-content" />

                    <Text>Em breve!</Text>
                </>

            </View>
        </ScrollView>

    );
}