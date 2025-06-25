// src/navigation/Tabs.tsx
import { MaterialIcons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React from 'react';
import HomeScreen from '.';
import ConfigScreen from './config';
import Loja from './Loja';



const Tab = createBottomTabNavigator();

export default function Tabs() {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                headerShown: false,
                tabBarStyle: {
                    position: 'absolute',
                    bottom: 30,
                    left: 30,
                    right: 30,
                    elevation: 5,
                    backgroundColor: '#fff',
                    borderRadius: 20,
                    height: 70,
                    paddingBottom: 10,
                    paddingTop: 10,
                    shadowColor: '#000',
                    shadowOpacity: 0.06,
                    shadowOffset: { width: 0, height: 4 },
                    shadowRadius: 10,
                },
                tabBarActiveTintColor: '#00875F',    // Cor do ícone e label ativo
                tabBarInactiveTintColor: '#aaa',     // Cor do ícone e label inativo
                tabBarIcon: ({ color, size, focused }) => {
                    let iconName: any;

                    switch (route.name) {
                        case 'Início':
                            iconName = 'home';
                            break;
                        case 'Loja':
                            iconName = 'store';
                            break;
                        case 'Configurações':
                            iconName = 'supervised-user-circle';
                            break;
                        default:
                            iconName = 'ellipse';
                    }

                    return <MaterialIcons name={iconName} size={28}
                        color={focused ? '#00875F' : '#aaa'} />;
                },
            })}
        >
            <Tab.Screen name="Início" component={HomeScreen} />
            <Tab.Screen name="Loja" component={Loja} />
            <Tab.Screen name="Configurações" component={ConfigScreen} />
        </Tab.Navigator>
    );
}
