import React from "react";
import { Image } from "react-native";
import { Dimensions, View } from "react-native";

export default function ImageUpload({onClose,image}:any){
    return(
        <View className="bg-red-600" style={{height: Dimensions.get('window').height}}>
            <View>
                    <Image source={{uri: image?.uri}} style={{width: Dimensions.get('screen').width, height: Dimensions.get('screen').width}} resizeMode="cover"/>
            </View>
        </View>
    )
}