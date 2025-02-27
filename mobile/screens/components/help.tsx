import { ActivityIndicator, Alert, Dimensions, Platform, View } from "react-native";
import CustomText from "./custom-text";
import { TouchableRipple } from "react-native-paper";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import React from "react";

export default function Help({ onClose,onDone }: any) {

  return (
    <View
      className="flex flex-col items-center w-full pt-4 rounded-xl"
      style={{
        height: Dimensions.get("screen").height * 0.9,
        flexGrow: 3,
        backgroundColor: "#F4F7FA",
      }}
    >
                  <View style={{ flexDirection: "row" }} className="flex justify-between w-full px-[25px] mb-3">
        <TouchableRipple
          style={{ flexDirection: "row" }}
          className="p-1 bg-gray-200 rounded-full flex justify-center items-center"
          borderless
          onPress={() => {
            onClose();
          }}
        >
          <MaterialIcons style={{ position: "relative", left: 5 }} name={"arrow-back-ios"} size={24} color={"gray"} />
        </TouchableRipple>
        <TouchableRipple
          style={{ flexDirection: "row" }}
          className="p-1 bg-gray-200 rounded-full flex justify-center items-center"
          borderless
          onPress={() => {
            onClose();
          }}
        >
          <MaterialCommunityIcons name={"close"} size={24} color={"gray"} />
        </TouchableRipple>
      </View>

      <View className="px-[25px] w-full flex-1 flex-col itesm-center justify-center">
        <CustomText style={{ fontFamily: "EuclidCircularB-Bold" }} className="text-standard font-bold text-[25px] mb-2 text-center">
          Choose your plan
        </CustomText>
        <CustomText className="text-center text-base text-standard mb-7">
        Pay only if you’ve earned at least $10
        </CustomText>

 
      </View>

      <View className={`px-[25px] w-full ${Platform.OS == 'ios'? 'pb-10' : 'pb-20'}`}>

      </View>
    </View>
  );
}
