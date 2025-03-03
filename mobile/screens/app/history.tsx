import React, { useEffect, useState } from "react";
import {
  KeyboardAvoidingView,
  ScrollView,
  StatusBar,
  View,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Card,
  Chip,
  Avatar,
  Divider,
  useTheme,
  TouchableRipple,
  ActivityIndicator,
} from "react-native-paper";
import TabNavBar from "../components/tab-navbar";
import moment from "moment";
import CustomText from "../components/custom-text";
import { useIsFocused } from "@react-navigation/native";
import axiosInstance from "../../config/axios";

export default function History({ route, navigation }: any) {
  const theme = useTheme();
  const isFocused = useIsFocused();

  const [scanHistory, setScanHistory] = useState<any>([]);

  const getSeverityColor = (severity: any) => {
    switch (severity) {
      case true:
        return "green";
      case false:
        return "red";
      default:
        return "red";
    }
  };

  const [loading, setLoading] = useState<boolean>(true);

  const getHistory = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get("/searchHistory");
      setScanHistory(res?.data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  useEffect(() => {
    getHistory();
  }, [isFocused]);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar barStyle="dark-content" backgroundColor="white" />
      <TabNavBar title="Scan History" navigation={navigation} />

      <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding">
        <ScrollView
          className="bg-[#F0F1F2]"
          contentContainerStyle={{ padding: 16 }}
        >
          <CustomText
            className="text-standard text-lg font-semibold"
            style={{
              marginBottom: 12,
            }}
          >
            Recent scans ({scanHistory.length})
          </CustomText>

          {loading && (
            <View className="py-5">
              <ActivityIndicator
                size="large"
                color="#00A362"
              ></ActivityIndicator>
            </View>
          )}

          {!loading &&
            scanHistory.map((scan: any, index: any) => (
              <TouchableRipple
                borderless
                onPress={() => {
                  navigation.navigate("Results", {
                    image: scan.image_url,
                    ...scan,
                  });
                }}
                style={{ borderRadius: 12, marginBottom: 12 }}
              >
                <Card
                  key={scan.id}
                  style={{
                    borderRadius: 12,
                    overflow: "hidden",
                    elevation: 2,
                    backgroundColor: "white",
                  }}
                >
                  <Card.Content style={{ padding: 0 }}>
                    <View
                      style={{ flexDirection: "row", alignItems: "center" }}
                    >
                      {/* Left: Image with fixed dimensions */}
                      <View style={{ width: 90, height: 90 }}>
                        <Image
                          source={{ uri: scan?.image_url }}
                          style={{ width: 90, height: 90, borderRadius: 5 }}
                        />
                      </View>

                      {/* Right: Content */}
                      <View style={{ flex: 1, padding: 12 }}>
                        <View
                          style={{
                            flexDirection: "row",
                            justifyContent: "space-between",
                            alignItems: "center",
                            marginBottom: 4,
                            columnGap: 10,
                          }}
                        >
                          <CustomText
                            numberOfLines={1}
                            className="text-primary"
                            style={{
                              fontSize: 16,
                              fontWeight: "500",
                              marginBottom: 4,
                            }}
                          >
                            {scan.disease}
                          </CustomText>
                          <View
                            className="px-3 py-1 rounded-lg"
                            style={{
                              backgroundColor: getSeverityColor(
                                scan?.isHealthy
                              ),
                            }}
                          >
                            <CustomText className="text-white text-sm font-bold">
                              {scan.isHealthy ? "Healthy" : "Sick"}
                            </CustomText>
                          </View>
                        </View>

                        <CustomText
                          style={{
                            fontSize: 14,
                            color: theme.colors.onSurfaceVariant,
                          }}
                        >
                          Scanned: {moment(new Date()).format("MMM D, YYYY")}
                        </CustomText>
                      </View>
                    </View>
                  </Card.Content>
                </Card>
              </TouchableRipple>
            ))}

          {!loading && scanHistory.length === 0 && (
            <View style={{ alignItems: "center", marginTop: 40, padding: 20 }}>
              <Avatar.Icon
                size={80}
                icon="leaf-off"
                color={theme.colors.onSurfaceVariant}
                style={{ backgroundColor: theme.colors.surfaceVariant }}
              />
              <CustomText
                style={{ marginTop: 16, fontSize: 16, textAlign: "center" }}
              >
                No scan history yet
              </CustomText>
              <CustomText
                style={{
                  marginTop: 8,
                  color: theme.colors.onSurfaceVariant,
                  textAlign: "center",
                }}
              >
                Scan your first plant to see the history here
              </CustomText>
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
