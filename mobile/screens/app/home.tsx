import React, { useState, useRef, useEffect, useMemo, useCallback } from "react";
import { View, StyleSheet, Text, Alert, ActivityIndicator, Platform, PermissionsAndroid } from "react-native";
import { Camera, useCameraDevices } from "react-native-vision-camera";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import CustomText from "../components/custom-text";
import {TouchableRipple} from "react-native-paper"
import Octicons from "react-native-vector-icons/Octicons"
import MaterialIcons from "react-native-vector-icons/MaterialIcons"
import Feather from "react-native-vector-icons/Feather"
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import ImagePicker from 'react-native-image-crop-picker';
import Help from "../components/help";
import FixedBottomSheetModal from "../components/fixed-bottomsheet";
import { BottomSheetModal, BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import ImageUpload from "../components/image-upload";

const HomePage = ({ navigation }:any) => {
  const [cameraPermission, setCameraPermission] = useState<boolean | null>(null);
  const [cameraType, setCameraType] = useState("back");
  const [flash, setFlash] = useState("off");
  const devices:any = useCameraDevices()
  const [image, setImage] = useState<any>('')
  const device = devices.filter((d:any) => d.position === cameraType)[0];
  const cameraRef = useRef<any>(null);

  const snapPoints = useMemo(() => ['80%'], []);
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  const snapPoints2 = useMemo(() => ['100%'], []);
  const bottomSheetModalRef2 = useRef<BottomSheetModal>(null);

  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);
  const handleCloseModal = () => {
    bottomSheetModalRef.current?.close();
  };

  const handlePresentModalPress2 = useCallback(() => {
    bottomSheetModalRef2.current?.present();
  }, []);
  const handleCloseModal2 = () => {
    bottomSheetModalRef2.current?.close();
  };

  const handleUpload = async()=>{
    try{
        const _options: any = {};
        let result: any = {};
         result = await launchImageLibrary({..._options,
              includeBase64: false,
        });
    console.log("result",result)

    if (result?.assets?.length > 0) {
        const {uri, fileName, type} = result?.assets[0];

       setTimeout(() => {
        ImagePicker.openCropper({
          mediaType: 'photo',
          path: uri,
        }).then((image:any)=>{
            setImage({
              uri: image?.path,
              name: fileName,
              type: '.png'
            })
          })
        }, 400);
}
}
    catch(error:any){
        Alert.alert("Error occured",error?.message)
    }
}

  useEffect(() => {
    const checkPermission = async () => {
      try {
        const cameraPermissionStatus = await Camera.requestCameraPermission();
        setCameraPermission(cameraPermissionStatus === "granted");
        
        if (cameraPermissionStatus !== "granted") {
          Alert.alert(
            "Permission Required", 
            "Camera access is required to take photos.",
            [{ text: "OK", onPress: () => navigation.goBack() }]
          );
        }
      } catch (error) {
        console.error("Error requesting camera permission:", error);
        setCameraPermission(false);
        Alert.alert("Error", "Failed to access camera. Please try again.");
      }
    };
    
    checkPermission();
  }, [navigation]);

  const takePicture = async () => {
    if (cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePhoto({
          flash: flash === "on" ? "on" : "off",
          qualityPrioritization: "balanced"
        });
        console.log("Photo captured:", photo.path);
        setImage({
          uri: photo.path,
          name: photo?.name,
          type: '.png'
        })
        handlePresentModalPress2()
      } catch (error) {
        console.error("Error taking photo:", error);
        Alert.alert("Error", "Failed to capture photo. Please try again.");
      }
    }
  };

  // Loading state
  if (cameraPermission === null) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text style={styles.loadingText}>Initializing camera...</Text>
      </View>
    );
  }

  // No permission granted
  if (cameraPermission === false) {
    return (
      <View style={styles.errorContainer}>
        <Icon name="camera-off" size={50} color="#555" />
        <Text style={styles.errorText}>Camera permission not granted</Text>
        <TouchableRipple 
          style={styles.tryAgainButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.tryAgainText}>Go Back</Text>
        </TouchableRipple>
      </View>
    );
  }

  // No device available
  if (!device) {
    return (
      <View style={styles.errorContainer}>
        <Icon name="camera-off" size={50} color="#555" />
        <Text style={styles.errorText}>No camera available on this device</Text>
        <TouchableRipple 
          style={styles.tryAgainButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.tryAgainText}>Go Back</Text>
        </TouchableRipple>
      </View>
    );
  }

  return ( 
    <GestureHandlerRootView
    style={{
      position: 'relative',
      width: '100%',
      flex: 1,
    }}>
    <BottomSheetModalProvider>
    <View style={styles.container}>
      <Camera
        ref={cameraRef}
        style={StyleSheet.absoluteFill}
        device={device}
        isActive={true}
        photo={true}
        zoom={1}
        enableZoomGesture={true}
      />

      {/* Top Buttons */}
      <View style={styles.topButtons}>
        <TouchableRipple borderless className="rounded-full" onPress={() => navigation.goBack()} style={styles.iconButton}>
          <Icon name="close" size={28} color="white" />
        </TouchableRipple>

        <View style={styles.rightIcons}>
          <TouchableRipple borderless className="rounded-full" onPress={()=>{
            handlePresentModalPress();
          }} style={styles.iconButton}>
          <Icon name="help-circle-outline" size={28} color="white" />
        </TouchableRipple>
        <TouchableRipple 
            onPress={() => setFlash(flash === "off" ? "on" : "off")} 
        borderless className="rounded-full" style={styles.iconButton}>
          <Icon name={flash === "off" ? "flash-off" : "flash"} size={28} color={flash =='on'? 'yellow' : "white"} />
        </TouchableRipple>
        <TouchableRipple borderless className="rounded-full" onPress={()=>{}} style={styles.iconButton}>
          <Feather name="user" size={28} color="white" />
        </TouchableRipple>
        <TouchableRipple borderless className="rounded-full" onPress={()=>{
          navigation.navigate("History")
        }} style={styles.iconButton}>
          <Feather name="box" size={28} color="white" />
        </TouchableRipple>
        </View>
      </View>

      <View style={styles.centerAlignmentContainer}>
        {/* Corner brackets container */}
        <View style={styles.bracketsContainer}>
          {/* Top-left corner */}
          <View style={styles.cornerTopLeft}>
            <View style={styles.cornerHorizontal} />
            <View style={styles.cornerVertical} />
          </View>
          
          {/* Top-right corner */}
          <View style={styles.cornerTopRight}>
            <View style={styles.cornerHorizontal} />
            <View style={styles.cornerVertical} />
          </View>
          
          {/* Center text */}
          <CustomText style={styles.focusText}>Place the plant in focus</CustomText>
          
          {/* Bottom-left corner */}
          <View style={styles.cornerBottomLeft}>
            <View style={styles.cornerHorizontal} />
            <View style={styles.cornerVertical} />
          </View>
          
          {/* Bottom-right corner */}
          <View style={styles.cornerBottomRight}>
            <View style={styles.cornerHorizontal} />
            <View style={styles.cornerVertical} />
          </View>
        </View>
      </View>

      <View style={styles.captureContainer}>
        <TouchableRipple
        borderless
          className="rounded-full p-3"
onPress={()=>{
  handleUpload()
}}
        >
          <Octicons name="image" size={30} />
        </TouchableRipple>
        <TouchableRipple
        className="p-1"
        borderless
          onPress={takePicture}
          style={styles.captureButton}>
            <View className="bg-primary w-full h-full rounded-full"></View>
          </TouchableRipple>
          <TouchableRipple
          className="rounded-full p-3"
            onPress={() => setCameraType(cameraType === "back" ? "front" : "back")} 
            borderless
          >
          <MaterialIcons name="flip-camera-android" size={30} />
        </TouchableRipple>
      </View>

      <FixedBottomSheetModal noScroll={true} handleComponent={null} snapPoints={snapPoints2} children={<ImageUpload navigation={navigation} image={image} onClose={handleCloseModal2}></ImageUpload>} bottomSheetModalRef={bottomSheetModalRef2}></FixedBottomSheetModal>
      <FixedBottomSheetModal noScroll={true} handleComponent={null} snapPoints={snapPoints} children={<Help onClose={handleCloseModal}></Help>} bottomSheetModalRef={bottomSheetModalRef}></FixedBottomSheetModal>
    </View>
    </BottomSheetModalProvider>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: "black" 
  },
  
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
  },
  loadingText: {
    color: 'white',
    marginTop: 10,
  },
  
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
    padding: 20,
  },
  errorText: { 
    color: "white", 
    textAlign: "center", 
    marginTop: 20,
    fontSize: 16,
  },
  tryAgainButton: {
    marginTop: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#333',
    borderRadius: 8,
  },
  tryAgainText: {
    color: 'white',
    fontSize: 16,
  },

  topButtons: {
    position: "absolute",
    top: Platform.OS == 'ios'? 45 : 40,
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 10,
    alignItems: "center",
    zIndex: 10,
    paddingRight: 20
  },

  rightIcons: { 
    flexDirection: "row" 
  },

  iconButton: {
    padding: 5,
    borderRadius: 50,
    marginLeft: 10,
  },

  centerAlignmentContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },

  bracketsContainer: {
    width: 260,
    height: 200,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
    top: -50
  },

  // Corner styles
  cornerTopLeft: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
  cornerTopRight: {
    position: 'absolute',
    top: 0,
    right: 0,
    transform: [{ rotate: '90deg' }],
  },
  cornerBottomLeft: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    transform: [{ rotate: '270deg' }],
  },
  cornerBottomRight: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    transform: [{ rotate: '180deg' }],
  },

  cornerHorizontal: {
    width: 30,
    height: 3,
    backgroundColor: 'white',
  },
  cornerVertical: {
    width: 3,
    height: 30,
    backgroundColor: 'white',
    borderRadius: 0,
  },

  focusText: {
    color: "white",
    fontSize: 18,
    textAlign: 'center',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    fontWeight: '500',
    backgroundColor: 'rgba(0,0,0,0.3)',
  },

  captureContainer: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    alignItems: "center",
    paddingVertical: 30,
    paddingBottom: 50,
    backgroundColor: "#ffff",
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 50
  },

  captureButton: {
    width: 70,
    height: 70,
    borderRadius: 100,
    borderWidth: 3,
    borderColor: '#00A362'
    // borderColor: "rgba(255,255,255,0.5)",
  },
});

export default HomePage;