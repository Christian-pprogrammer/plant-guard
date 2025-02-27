import {
    Dimensions,
    ImageBackground,
    KeyboardAvoidingView,
    Platform,
    Share,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    View,
  } from 'react-native';
  import {ScrollView} from 'react-native';
  import {SafeAreaView} from 'react-native-safe-area-context';
import React, { useEffect, useState } from 'react';
import CustomButton from '../components/custom-button';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { TouchableRipple } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Feather from "react-native-vector-icons/Feather"
import CustomText from '../components/custom-text';
import { Instructions } from '../../config/helpers';

const { height } = Dimensions.get('window');
  
  const Results = ({route, navigation}: any) => {
    const headerHeight = height * 0.5;
    const [plantImage, setPlantImage] = useState('')
    const [scrollValue, setScrollValue] = useState(0);

    useEffect(()=>{
   if(route?.params?.image){
    setPlantImage(route?.params?.image)
   }
    },[route])

    const handleScroll = (event:any) => {
      const scrollY = event.nativeEvent.contentOffset.y;
      setScrollValue(scrollY)
      if (scrollY > 150) {
      }
    };
  
    return (
      <KeyboardAvoidingView style={{flex: 1}} behavior="padding">
        <StatusBar barStyle={scrollValue>150? 'dark-content' : 'light-content'} backgroundColor={'white'} />
        <SafeAreaView style={{flex: 1}} className=''>

        <View
          className='w-full z-[9999]'
            style={{
              position: 'absolute',
              top: StatusBar.currentHeight ? StatusBar.currentHeight + 10 : 40,
              backgroundColor: scrollValue>150? 'white': 'transparent'
            }}
          >
           <View style={{ flexDirection: "row",alignItems: 'center' }} className="flex justify-between pt-3 items-center w-full px-[15px] mb-3 w-full">
        <TouchableRipple
          style={{ flexDirection: "row",backgroundColor: "rgba(0,0,0,0.5)" }}
          className="p-[5px] rounded-full flex justify-center items-center"
          borderless
          onPress={() => {
           navigation.goBack()
          }}
        >
          <MaterialIcons style={{ position: "relative", left: 5 }} name={"arrow-back-ios"} size={24} color={"white"} />
        </TouchableRipple>
        <TouchableRipple
          style={{ flexDirection: "row",backgroundColor: "rgba(0,0,0,0.5)" }}
          className="p-[5px] rounded-full flex justify-center items-center"
          borderless
          onPress={() => {
            navigation.goBack()
          }}
        >
          <Feather name={"camera"} size={24} color={"white"} />
        </TouchableRipple>
      </View>
          </View>

      <ScrollView
      onScroll={handleScroll}
      scrollEventThrottle={16}
       contentContainerStyle={{paddingBottom: 110}} style={scrollValue<150? StyleSheet.absoluteFill : {}}>

      {plantImage && (
        <ImageBackground
          source={{ uri: plantImage }}
          style={{
            width: '100%',
            height: headerHeight,
            // position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
          }}
          resizeMode="cover"
        >
        </ImageBackground>
      )}

       <View className='px-[20px] pt-4'>
       <View style={{flexDirection: 'row',alignItems: 'center'}} className='mb-3'>
<CustomText style={{
  fontFamily: 'EuclidCircularB-Bold'
}} className='text-standard text-xl'>This plant looks </CustomText>
<CustomText
 style={{
  fontFamily: 'EuclidCircularB-Bold'
}}
 className='text-primary text-xl'>Healthy!</CustomText>
        </View>

        <CustomText className='text-body text-base mb-4'>This plant has disease called <CustomText className='font-bold text-base text-primary'>Canmnepiadiasis</CustomText>, this disease is caused by various factors including the water loss, lorem ipsum and the following m,ioght help in it's treatment.</CustomText>

        <CustomText
        style={{
          fontFamily: 'EuclidCircularB-Bold'
        }}
         className='text-xl text-standard mb-3'>Treatment options</CustomText>

<View className='mb-3'>
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
      </ScrollView>

      <View style={{flexDirection: 'row',alignItems: 'center',justifyContent: 'space-between',columnGap: 22}} className='w-full py-5 pb-10 px-[20px] absolute bottom-0 bg-white'>
        <TouchableRipple borderless onPress={()=>{
            navigation.goBack()
        }}>
          <View style={{flexDirection: 'column',alignItems: 'center',justifyContent: 'center'}}>
          <Feather name={"camera"} size={24} color={"black"} />
            <CustomText className='text-standard text-lg'>New</CustomText>
          </View>
        </TouchableRipple>
       <View className='flex-1'>
       <CustomButton classNames={'py-3'} leftIcon={<AntDesign name='sharealt' color={'white'} size={24}/>} title={'Share'} onPress={()=>{
        Share.share({
          message: '',
          title: 'Plant health'
        })
        }}></CustomButton>
       </View>
      </View>
        </SafeAreaView>
      </KeyboardAvoidingView>
    );
  };
  
  export default Results;
  