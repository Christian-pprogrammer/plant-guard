import { ActivityIndicator, Alert, Dimensions, Platform, View } from "react-native";
import CustomText from "./custom-text";
import { TouchableRipple } from "react-native-paper";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import React from "react";
import { Instructions } from "../../config/helpers";
import AntDesign from "react-native-vector-icons/AntDesign"

export default function Help({ onClose }: any) {

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

      <View className="px-[20px] w-full flex-col itesm-center justify-center pt-10">
        <CustomText style={{ fontFamily: "EuclidCircularB-Bold" }} className="text-standard font-bold text-[25px] mb-2 text-center">
       How it works
        </CustomText>
        <CustomText className="text-center text-base text-standard mb-7">
       Here are instructions about how it works
        </CustomText>

{
    Instructions?.map((instruction:any)=>{
        return(
            <View style={{flexDirection: 'row',columnGap: 10,alignItems: 'center'}} className="mb-3">
                <AntDesign color={'#00A362'} size={20} name={'checkcircle'}></AntDesign>
<CustomText className="text-base text-standard">{instruction}</CustomText>
                </View>
        )
    })
}

 
      </View>
    </View>
  );
}
