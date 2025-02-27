import React from "react";
import { StatusBar } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function History(){
    return(
        <SafeAreaView style={{flex: 1}}>
        <StatusBar barStyle={'dark-content'} backgroundColor={'white'} />
        <TabNavBar title={t('Payments.PaymentHistory')} navigation={navigation} />
  
        <KeyboardAvoidingView style={{flex: 1}} behavior="padding">
          <ScrollView className="bg-white">

            </ScrollView>
            </KeyboardAvoidingView>
            </SafeAreaView>
    )
}