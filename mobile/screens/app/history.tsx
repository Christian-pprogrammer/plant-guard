import React from "react";
import { KeyboardAvoidingView, ScrollView, StatusBar, View, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Card, Chip, Avatar, Divider, useTheme, TouchableRipple } from "react-native-paper";
import TabNavBar from "../components/tab-navbar";
import moment from "moment";
import CustomText from "../components/custom-text";

export default function History({ route,navigation }: any) {
  const theme = useTheme();
  
  // Sample scan history data
  const scanHistory = [
    {
      id: 1,
      plantName: "Tomato",
      diseaseName: "Late Blight",
      description: "Fungal disease causing brown spots on leaves and fruits, leading to rapid plant decay.",
      imageUrl: "https://gachwala.in/wp-content/uploads/2022/07/Tomato-Seeds.jpg",
      scanDate: new Date(2025, 1, 26),
      severity: "High"
    },
    {
      id: 2,
      plantName: "Rose",
      diseaseName: "Black Spot",
      description: "Common fungal disease producing black spots on rose leaves, weakening the plant over time.",
      imageUrl: "https://gachwala.in/wp-content/uploads/2022/07/Tomato-Seeds.jpg",
      scanDate: new Date(2025, 1, 24),
      severity: "Medium"
    },
    {
      id: 3,
      plantName: "Cucumber",
      diseaseName: "Powdery Mildew",
      description: "White powdery fungal growth on leaves affecting photosynthesis and overall plant health.",
      imageUrl: "https://gachwala.in/wp-content/uploads/2022/07/Tomato-Seeds.jpg",
      scanDate: new Date(2025, 1, 20),
      severity: "Medium"
    },
    {
      id: 4,
      plantName: "Apple",
      diseaseName: "Fire Blight",
      description: "Bacterial disease causing blackened, wilted leaves and branches with a burnt appearance.",
      imageUrl: "https://gachwala.in/wp-content/uploads/2022/07/Tomato-Seeds.jpg",
      scanDate: new Date(2025, 1, 18),
      severity: "High"
    },
    {
      id: 5,
      plantName: "Potato",
      diseaseName: "Early Blight",
      description: "Fungal disease characterized by brown spots with concentric rings on lower leaves.",
      imageUrl: "https://gachwala.in/wp-content/uploads/2022/07/Tomato-Seeds.jpg",
      scanDate: new Date(2025, 1, 15),
      severity: "Medium"
    }
  ];
  
  // Severity color mapping
  const getSeverityColor = (severity:any) => {
    switch (severity) {
      case "High":
        return "#FF5252";
      case "Medium":
        return "#FFB74D";
      case "Low":
        return "#4CAF50";
      default:
        return "#757575";
    }
  };

  // Function to truncate description
  const truncateDescription = (text:any, maxLength = 60) => {
    return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar barStyle="dark-content" backgroundColor="white" />
      <TabNavBar title="Scan History" navigation={navigation} />
  
      <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding">
        <ScrollView className="bg-[#F0F1F2]" contentContainerStyle={{ padding: 16 }}>
          <CustomText
          className="text-standard text-lg font-semibold"
            style={{ 
              marginBottom: 12,
            }}
          >
            Recent scans ({scanHistory.length})
          </CustomText>
          
          {scanHistory.map((scan, index) => (
           <TouchableRipple
            borderless onPress={()=>{
            navigation.navigate("Results", {
                image: scan.imageUrl 
              })
           }} style={{borderRadius: 12,
            marginBottom: 12,

           }}>
             <Card
              key={scan.id}
              style={{
                borderRadius: 12,
                overflow: "hidden",
                elevation: 2,
                backgroundColor: 'white'
              }}
            >
              <Card.Content style={{ padding: 0 }}>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  {/* Left: Image with fixed dimensions */}
                  <View style={{ width: 90, height: 90 }}>
                    <Image
                      source={{ uri: scan.imageUrl }}
                      style={{ width: 90, height: 90 }}
                    />
                  </View>
                  
                  {/* Right: Content */}
                  <View style={{ flex: 1, padding: 12 }}>
                    <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 4,columnGap: 10 }}>
                    <CustomText numberOfLines={1} className="text-primary" style={{ fontSize: 16, fontWeight: "500", marginBottom: 4 }}>
                      {scan.diseaseName}
                    </CustomText>
                      <View 
                      className="px-3 py-1 rounded-lg"
                        style={{ 
                          backgroundColor: getSeverityColor(scan.severity),
                        }}
                      >
                       <CustomText className="text-white text-sm font-bold">
                       {scan.severity}
                       </CustomText>
                      </View>
                    </View>
                    
                    <CustomText className="text-base text-standard" numberOfLines={1} style={{marginBottom: 8 }}>
                      {truncateDescription(scan.description)}
                    </CustomText>
                    
                    <CustomText style={{ fontSize: 14, color: theme.colors.onSurfaceVariant }}>
                      Scanned: {moment(scan.scanDate).format("MMM D, YYYY")}
                    </CustomText>
                  </View>
                </View>
              </Card.Content>
            </Card>
           </TouchableRipple>
          ))}
          
          {scanHistory.length === 0 && (
            <View style={{ alignItems: "center", marginTop: 40, padding: 20 }}>
              <Avatar.Icon 
                size={80} 
                icon="leaf-off" 
                color={theme.colors.onSurfaceVariant}
                style={{ backgroundColor: theme.colors.surfaceVariant }}
              />
              <CustomText style={{ marginTop: 16, fontSize: 16, textAlign: "center" }}>
                No scan history yet
              </CustomText>
              <CustomText style={{ marginTop: 8, color: theme.colors.onSurfaceVariant, textAlign: "center" }}>
                Scan your first plant to see the history here
              </CustomText>
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}