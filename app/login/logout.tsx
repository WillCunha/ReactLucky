import React from "react";
import { useAuth } from "../context/Auth";
import { Button, View, Text } from "react-native";

export default function Logout(){

    const {logout} = useAuth();

    return(
        <View>
            <Text>Tem certeza que quer sair?</Text>
            <Button
            title="Sim"
            onPress={logout} />
            <Button
            title="Não"
            onPress={logout} />
        </View>
    )

}