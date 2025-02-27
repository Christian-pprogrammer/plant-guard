import React, { useState, useRef, useEffect } from "react";
import { View, TouchableOpacity, StyleSheet, Text, Alert, ActivityIndicator } from "react-native";
import { Camera, useCameraDevices } from "react-native-vision-camera";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import CustomText from "../components/custom-text";

const HomePage = ({ navigation }:any) => {
  const [cameraPermission, setCameraPermission] = useState<boolean | null>(null);
  const [cameraType, setCameraType] = useState("back");
  const [flash, setFlash] = useState("off");
  const devices:any = useCameraDevices()

  const device = devices.filter((d:any) => d.position === cameraType)[0];
  const cameraRef = useRef<any>(null);

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
        Alert.alert("Success", "Photo captured successfully!");
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
        <TouchableOpacity 
          style={styles.tryAgainButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.tryAgainText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // No device available
  if (!device) {
    return (
      <View style={styles.errorContainer}>
        <Icon name="camera-off" size={50} color="#555" />
        <Text style={styles.errorText}>No camera available on this device</Text>
        <TouchableOpacity 
          style={styles.tryAgainButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.tryAgainText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return ( 
    <View style={styles.container}>
      <Camera
        ref={cameraRef}
        style={StyleSheet.absoluteFill}
        device={device}
        isActive={true}
        photo={true}
      />

      {/* Top Buttons */}
      <View style={styles.topButtons}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconButton}>
          <Icon name="arrow-left" size={30} color="white" />
        </TouchableOpacity>
        <View style={styles.rightIcons}>
          <TouchableOpacity 
            onPress={() => Alert.alert("Help", "Point your camera at the plant and take a picture.")} 
            style={styles.iconButton}
          >
            <Icon name="help-circle" size={30} color="white" />
          </TouchableOpacity>
          <TouchableOpacity 
            onPress={() => setFlash(flash === "off" ? "on" : "off")} 
            style={styles.iconButton}
          >
            <Icon name={flash === "off" ? "flash-off" : "flash"} size={30} color="white" />
          </TouchableOpacity>
          <TouchableOpacity 
            onPress={() => setCameraType(cameraType === "back" ? "front" : "back")} 
            style={styles.iconButton}
          >
            <Icon name="camera-flip" size={30} color="white" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.centerAlignmentContainer}>
        {/* Top bracket */}
        <View style={styles.topBracket}>
          <View style={styles.bracketLeft} />
          <View style={styles.bracketRight} />
        </View>

        <CustomText style={styles.focusText}>Place the plant in focus</CustomText>

        {/* Bottom bracket */}
        <View style={styles.bottomBracket}>
          <View style={styles.bracketLeft} />
          <View style={styles.bracketRight} />
        </View>
      </View>

      <View style={styles.captureContainer}>
        <TouchableOpacity 
          onPress={takePicture} 
          style={styles.captureButton} 
          activeOpacity={0.7}
        />
      </View>
    </View>
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
    top: 40,
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    alignItems: "center",
    zIndex: 10,
  },

  rightIcons: { 
    flexDirection: "row" 
  },

  iconButton: {
    padding: 10,
    backgroundColor: "rgba(0,0,0,0.5)",
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

  topBracket: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 200,
    marginBottom: 20,
  },
  
  bottomBracket: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 200,
    marginTop: 20,
  },
  
  bracketLeft: {
    width: 30,
    height: 2,
    backgroundColor: 'white',
  },
  
  bracketRight: {
    width: 30,
    height: 2,
    backgroundColor: 'white',
  },

  focusText: {
    color: "white",
    fontSize: 18,
    textAlign: 'center',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    fontWeight: '500'
  },

  captureContainer: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    alignItems: "center",
    paddingVertical: 20,
    backgroundColor: "rgba(0,0,0,0.7)",
  },

  captureButton: {
    width: 70,
    height: 70,
    backgroundColor: "white",
    borderRadius: 35,
    borderWidth: 5,
    borderColor: "rgba(255,255,255,0.5)",
  },
});

export default HomePage;