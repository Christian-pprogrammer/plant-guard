import React from "react";
import { KeyboardAvoidingView, StatusBar } from "react-native";
import { View } from "react-native-reanimated/lib/typescript/Animated";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Login(){
    return(
        <KeyboardAvoidingView style={{flex: 1}} behavior="padding">
        <SafeAreaView style={{
             backgroundColor: "white",
             flex: 1,
        }}>
    <StatusBar barStyle={'dark-content'} backgroundColor={'white'} />

    </SafeAreaView>
    </KeyboardAvoidingView>
    )
}