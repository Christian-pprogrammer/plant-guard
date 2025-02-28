import React, { useState } from "react";
import { KeyboardAvoidingView, StatusBar, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import PasswordInput from "../components/poassword-input";
import CustomText from "../components/custom-text";
import { ScrollView } from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import PhoneNumberInput from "../components/phone-input";
import CustomButton from "../components/custom-button";

export default function Login({navigation}:any){
    const [phoneNumber, setPhoneNumber] = useState('');

    return(
        <KeyboardAvoidingView style={{flex: 1}} behavior="padding">
        <SafeAreaView style={{
             backgroundColor: "white",
             flex: 1,
        }}>
    <StatusBar barStyle={'dark-content'} backgroundColor={'white'} />
    <ScrollView keyboardShouldPersistTaps={'handled'} scrollEnabled={false} className='px-[25px]' contentContainerStyle={{ flexGrow: 2 }} contentInsetAdjustmentBehavior="automatic">

<View style={{flex: 1}} className='py-[20px] pt-[13px]'>
    <Text className='ml-[-12px] mb-[10px]'>
    <TouchableOpacity className='px-3 py-1 rounded-full' onPress={()=>{
        navigation.goBack()
    }}>
<CustomText>
<MaterialIcons color={'#2f313f'} name={'keyboard-backspace'} size={28} />
</CustomText>
    </TouchableOpacity>
    </Text>
<CustomText style={{
     fontFamily: 'EuclidCircularB-Bold'
}} className="text-primary font-bold text-center text-[28px] mb-[12px]">
 PlantGuard
</CustomText>

<View className={'w-full mt-5'}>

<View className="mb-3">
<PhoneNumberInput
                value={phoneNumber}
                defaultCode={'RW'}
                label={"Phone number"}
                onChange={(text: any) => {
                  console.log('text',text);
                  setPhoneNumber(text);
                }}
              />
</View>

<PasswordInput
                                maxLength={50}
                                label={"Password"}
                                onChange={(text: any) => {
                                } } value={""}/>

                                <View className="mt-7">
                                    <CustomButton title={"Continue"} onPress={()=>{}}></CustomButton>
                                </View>
</View>

</View>
</ScrollView>
    </SafeAreaView>
    </KeyboardAvoidingView>
    )
}