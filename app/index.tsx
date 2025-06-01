import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from "react";
import { StatusBar } from 'react-native';
import 'react-native-gesture-handler';
import { AuthProvider } from "./context/Auth";
import OnboardingScreen from './onboarding';
import { Router } from "./routes/Routes";

function App() {

    const [isAppFirstLaunched, setIsAppFirstLaunched] = useState(true);

    useEffect(() => {
        loadScreens();
    }, [])

    async function loadScreens(): Promise<void> {
        try {
            const loadScreens = await AsyncStorage.getItem('ISAPPFIRSTLAUNCH');
            if (loadScreens == null) {
                setIsAppFirstLaunched(true);
                AsyncStorage.setItem('ISAPPFIRSTLAUNCH', 'false');
            } else {
                setIsAppFirstLaunched(false);
            }
        } catch (error) {
            console.warn('ERROR ONBOARDING: ' + error);
        }
    }

    return (
        
        <AuthProvider>
        <StatusBar backgroundColor="#3CAF54" translucent={false}  barStyle="light-content" />    
       
                {isAppFirstLaunched ? <OnboardingScreen /> : <Router />}
            
        </AuthProvider>
    );
}

export default App;
