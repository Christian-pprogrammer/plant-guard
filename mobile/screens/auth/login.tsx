import React, { useEffect, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import PasswordInput from "../components/poassword-input";
import CustomText from "../components/custom-text";
import { ScrollView } from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import PhoneNumberInput from "../components/phone-input";
import CustomButton from "../components/custom-button";
import axiosInstance from "../../config/axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useIsFocused } from "@react-navigation/native";

export default function Login({ navigation }: any) {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState<boolean>(false);
  const isFocused = useIsFocused();

  const login = async () => {
    try {
      if (phoneNumber && password) {
        setLoading(true);7
        const res = await axiosInstance.post("/auth/login_or_register", {
          mobileNumber: phoneNumber,
          password: password,
        });

        await AsyncStorage.setItem('access_token',res?.data?.token)
        navigation.navigate("HomePage")
        setLoading(false);
      } else {
        Alert.alert("Error", "Fill all fields");
      }
    } catch (error:any) {
        setLoading(false);
        Alert.alert("Error", error?.response?.data?.error || error?.message);
      console.log(error?.response?.data);
    }
  };

  const checkAuth = async()=>{
    try{
         const token = await AsyncStorage.getItem("access_token");
         if(token){
            navigation.navigate("HomePage")
         }
    }
    catch(error){
        console.log(error)
    }
  }

  useEffect(()=>{
   checkAuth()
  },[isFocused])

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding">
      <SafeAreaView
        style={{
          backgroundColor: "white",
          flex: 1,
        }}
      >
        <StatusBar barStyle={"dark-content"} backgroundColor={"white"} />
        <ScrollView
          keyboardShouldPersistTaps={"handled"}
          scrollEnabled={false}
          className="px-[25px]"
          contentContainerStyle={{ flexGrow: 2 }}
          contentInsetAdjustmentBehavior="automatic"
        >
          <View style={{ flex: 1 }} className="py-[20px] pt-[13px]">
            <Text className="ml-[-12px] mb-[10px]">
              <TouchableOpacity
                className="px-3 py-1 rounded-full"
                onPress={() => {
                  navigation.goBack();
                }}
              >
                <CustomText>
                  <MaterialIcons
                    color={"#2f313f"}
                    name={"keyboard-backspace"}
                    size={28}
                  />
                </CustomText>
              </TouchableOpacity>
            </Text>
            <CustomText
              style={{
                fontFamily: "EuclidCircularB-Bold",
              }}
              className="text-primary font-bold text-center text-[28px] mb-[12px]"
            >
              PlantGuard
            </CustomText>

            <View className={"w-full mt-5"}>
              <View className="mb-3">
                <PhoneNumberInput
                  value={phoneNumber}
                  defaultCode={"RW"}
                  label={"Phone number"}
                  onChange={(text: any) => {
                    console.log("text", text);
                    setPhoneNumber(text);
                  }}
                />
              </View>

              <PasswordInput
                maxLength={50}
                label={"Password"}
                onChange={(text: any) => {
                  setPassword(text);
                }}
                value={password}
              />

              <View className="mt-7">
                <CustomButton loadingText="Loading..." isLoading={loading} title={"Continue"} onPress={login}></CustomButton>
              </View>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}
