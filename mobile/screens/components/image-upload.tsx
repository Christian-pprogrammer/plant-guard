import React, { useEffect, useState } from "react";
import { Alert, Image, Dimensions, View, Text, Platform } from "react-native";
import { TouchableRipple } from "react-native-paper";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import LoaderKit from 'react-native-loader-kit';
import axiosInstance from "../../config/axios";
import { LinearGradient } from 'react-native-linear-gradient';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withRepeat, 
  withTiming,
  withSequence,
  Easing 
} from 'react-native-reanimated';

export default function ImageUpload({onClose, image,navigation}:any){
    const [processing, setProcessing] = useState<boolean>(false);
    
    // Animation values
    const opacity = useSharedValue(0.3);
    const scale = useSharedValue(1);
    const rotation = useSharedValue(0);
    const progress = useSharedValue(0);
        
    const processImage = async (_image: any) => {
      try {
        setProcessing(true);
    
        // Prepare form data
        const formData = new FormData();
        formData.append("file", {
          uri: _image.uri,
          name: _image.name || `photo_${Date.now()}.jpg`,
          type: _image.type || "image/jpeg",
        });
    
        // Make API call
        const res = await axiosInstance.post("/upload", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        
        console.log("res", res?.data)
    
        setTimeout(() => {
          setProcessing(false);
          onClose();
          navigation.navigate("Results", {
            image: _image.uri,
            ...res?.data?.result
          });
        }, Platform.OS === "ios" ? 1000 : 500);
      } catch (error: any) {
        console.log(error);
        setProcessing(false);
        Alert.alert("Error occurred", error?.response?.data?.message || error?.message);
      }
    };
    

    // Animation setup
    useEffect(() => {
        if (processing) {
            // Pulse effect
            opacity.value = withRepeat(
                withSequence(
                    withTiming(0.5, { duration: 1000 }),
                    withTiming(0.2, { duration: 1000 })
                ),
                -1,
                true
            );
            
            // Subtle scale effect
            scale.value = withRepeat(
                withSequence(
                    withTiming(1.05, { duration: 1500 }),
                    withTiming(1, { duration: 1500 })
                ),
                -1,
                true
            );
            
            // Rotation for processing circle
            rotation.value = withRepeat(
                withTiming(360, { 
                    duration: 2000,
                    easing: Easing.linear 
                }),
                -1
            );
            
            // Progress indicator animation
            progress.value = withRepeat(
                withTiming(1, { duration: 2000 }),
                -1
            );
        } else {
            // Reset animations when processing is done
            opacity.value = withTiming(0);
            scale.value = withTiming(1);
            rotation.value = withTiming(0);
            progress.value = withTiming(0);
        }
    }, [processing]);

    // Run process on mount if image exists
    useEffect(() => {
        if(image){
            processImage(image)
        }
    }, [image]);

    // Animated styles
    const overlayStyle = useAnimatedStyle(() => {
        return {
            opacity: opacity.value,
            transform: [{ scale: scale.value }]
        };
    });
    
    const spinnerStyle = useAnimatedStyle(() => {
        return {
            transform: [{ rotate: `${rotation.value}deg` }]
        };
    });
    
    const progressStyle = useAnimatedStyle(() => {
        return {
            width: `${progress.value * 100}%`,
        };
    });

    return(
        <View className="bg-white" style={{height: Dimensions.get('window').height, flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
            {/* Close button */}
            <View className="px-[20px] absolute top-[60px] left-[10px] z-10">
                <Text>
                    <TouchableRipple
                        style={{ flexDirection: "row" }}
                        className="p-[5px] bg-gray-200 rounded-full flex justify-center items-center"
                        borderless
                        onPress={() => { onClose(); }}
                    >
                        <MaterialCommunityIcons name={"close"} size={26} color={"black"} />
                    </TouchableRipple>
                </Text>
            </View>
            
            <View style={{ position: 'relative' }}>
                {/* The image */}
                <Image 
                    source={{uri: image?.uri}} 
                    style={{
                        width: Dimensions.get('screen').width, 
                        height: Dimensions.get('screen').width
                    }} 
                    resizeMode="contain"
                />
                
                {/* Processing overlay with gradient */}
                {processing && (
                    <Animated.View 
                        style={[
                            {
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                right: 0,
                                bottom: 0,
                                justifyContent: 'center',
                                alignItems: 'center',
                            },
                            overlayStyle
                        ]}
                    >
                        <LinearGradient
                            colors={['rgba(0,163,98,0.4)', 'rgba(0,163,98,0.1)', 'rgba(0,0,0,0.2)']}
                            style={{
                                position: 'absolute',
                                width: '100%',
                                height: '100%',
                            }}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                        />
                        
                        {/* Processing text */}
                        <View style={{
                            backgroundColor: 'rgba(0,0,0,0.7)',
                            paddingHorizontal: 20,
                            paddingVertical: 10,
                            borderRadius: 20,
                            marginBottom: 20
                        }}>
                            <Text style={{ color: 'white', fontWeight: 'bold' }}>
                                Processing Image...
                            </Text>
                        </View>
                        
                        {/* Animated spinner */}
                        <Animated.View style={[spinnerStyle]}>
                            <LoaderKit
                                style={{width: 60, height: 60}}
                                name={'BallClipRotateMultiple'}
                                color={'#FFFFFF'}
                            />
                        </Animated.View>
                        
                        {/* Progress bar */}
                        <View style={{
                            width: Dimensions.get('screen').width * 0.7,
                            height: 6,
                            backgroundColor: 'rgba(255,255,255,0.3)',
                            borderRadius: 3,
                            marginTop: 20,
                            overflow: 'hidden'
                        }}>
                            <Animated.View style={[
                                {
                                    height: '100%',
                                    backgroundColor: '#00A362',
                                    borderRadius: 3
                                },
                                progressStyle
                            ]} />
                        </View>
                    </Animated.View>
                )}
            </View>
        </View>
    );
}