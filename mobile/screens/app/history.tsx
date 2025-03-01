import React, { useEffect, useState } from "react";
import { KeyboardAvoidingView, ScrollView, StatusBar, View, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Card, Chip, Avatar, Divider, useTheme, TouchableRipple, ActivityIndicator } from "react-native-paper";
import TabNavBar from "../components/tab-navbar";
import moment from "moment";
import CustomText from "../components/custom-text";
import { useIsFocused } from "@react-navigation/native";
import axiosInstance from "../../config/axios";

export default function History({ route,navigation }: any) {
  const theme = useTheme();
  const isFocused = useIsFocused();
  
  // Sample scan history data
  const [scanHistory,setScanHistory] = useState<any>([
    {
      id: 1,
      plantName: "Tomato",
      diseaseName: "Late Blight",
      description: "Fungal disease causing brown spots on leaves and fruits, leading to rapid plant decay.",
      imageUrl: "https://gachwala.in/wp-content/uploads/2022/07/Tomato-Seeds.jpg",
      scanDate: new Date(2025, 1, 26),
      severity: "High"
    },
  ]);
  
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

  const [loading, setLoading] = useState<boolean>(true);

  const getHistory = async()=>{
    try{
        setLoading(true);
        const res = await axiosInstance.get("/searchHistory");
        console.log('--->',res?.data);
        // alert(res?.data?.length)
        // setScanHistory()
        setLoading(false);
    }
    catch(error){
console.log("------->Error", error)
setLoading(false);
    }
  }

  useEffect(()=>{
   getHistory()
  },[isFocused])

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

          {
            loading && (
                <View className="py-5">
                    <ActivityIndicator
                    size="large"
                        color="#00A362"
                    >
                    </ActivityIndicator>
                </View>
            )
          }
          
          {!loading && scanHistory.map((scan:any, index:any) => (
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
          
          {(!loading && scanHistory.length === 0) && (
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