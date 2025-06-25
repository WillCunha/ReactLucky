import Ads from '@/src/components/Ads';
import Header from '@/src/components/header';
import Constants from 'expo-constants';
import { ScrollView, StatusBar, View } from 'react-native';

export default function AdsScreen() {

    const statusBarHeight = Constants.statusBarHeight;


    return (
        <ScrollView
            style={{ flex: 1, backgroundColor: '#F9F9F9' }}
            showsVerticalScrollIndicator={false}
        >
            <View className='w-full px-4' style={{ marginTop: statusBarHeight + 8, marginBottom: '3%' }}>
                <>
                    <StatusBar backgroundColor="#3CAF54" translucent={false} barStyle="light-content" />

                    <Header />
                    < Ads />
                </>

            </View>
        </ScrollView>

    );
}