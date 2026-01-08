import { DrawerContentScrollView, DrawerItem } from "@react-navigation/drawer";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { useEffect, useState } from "react";
import { useTheme } from "../../../hooks/ThemeContext";
import Ionicons from "@expo/vector-icons/Ionicons";
import { clearAuth, getUser } from "@/api/storage";
import { router } from "expo-router";
import { TEXTS } from "@/constants/texts";

export default function CustomDrawer(props: any) {
  const { theme } = useTheme();
  const [showSupport, setShowSupport] = useState(false);
  const insets = useSafeAreaInsets();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    (async () => {
      const u = await getUser();
      setUser(u);
    })();
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      {/* HEADER */}
      <SafeAreaView
        style={{
          backgroundColor: theme.colors.primary,
          paddingTop: insets.top - 32,
          paddingBottom: 10,
          paddingHorizontal: 14,
        }}
      />
      <View
        style={{
          backgroundColor: theme.colors.primary,
          paddingVertical: 14,
          paddingHorizontal: 14,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          {/* Icon / Logo */}
          <View
            style={{
              height: 48,
              width: 48,
              borderRadius: 12,
              overflow: "hidden",
              backgroundColor: "#ffffff33",
              marginRight: 12,
            }}
          >
            {user?.image ? (
              <Image
                source={{ uri: user.image }}
                style={{ height: "100%", width: "100%" }}
                resizeMode="cover"
              />
            ) : (
              <View
                style={{
                  flex: 1,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Ionicons name="person" size={24} color="#fff" />
              </View>
            )}
          </View>

          {/* TEXT SECTION */}
          <View style={{ flex: 1 }}>
            <Text
              style={{
                color: "#fff",
                fontWeight: "700",
                fontSize: 15,
              }}
              numberOfLines={1}
            >
              {user
                ? `${user.first_name || ""} ${user.last_name || ""}`.trim()
                : "Loading..."}
            </Text>

            <Text style={{ color: "#E8E8FF", fontSize: 11, marginTop: 2 }}>
              Account ID: RACA5002
            </Text>

            <Text style={{ color: "#E8E8FF", fontSize: 11 }}>
              Minutes: 39.35
            </Text>
          </View>
        </View>
      </View>

      {/* MENU SCROLL LIST */}
      <DrawerContentScrollView
        {...props}
        contentContainerStyle={{ paddingTop: 8 }}
      >
        <DrawerItem
          label={TEXTS.Drawer.dashboard}
          icon={({ color, size }) => (
            <Ionicons name="home-outline" size={20} color={color} />
          )}
          labelStyle={{ marginLeft: -8 }}
          onPress={() => {
            props.navigation.closeDrawer();
            props.navigation.navigate("dashboard");
            // router.replace("/main/dashboard");
          }}
        />

        <DrawerItem
          label={TEXTS.Drawer.callLogs}
          onPress={() => {
            props.navigation.closeDrawer();
            props.navigation.navigate("calllogs");
          }}
          icon={() => <Ionicons name="call-outline" size={20} />}
        />

        <DrawerItem
          label={TEXTS.Drawer.phoneNumbers}
          onPress={() => {}}
          icon={() => <Ionicons name="calculator-outline" size={20} />}
        />

        <DrawerItem
          label={TEXTS.Drawer.contact}
          onPress={() => {}}
          icon={() => <Ionicons name="people-outline" size={20} />}
        />

        <DrawerItem
          label={TEXTS.Drawer.calendar}
          onPress={() => {}}
          icon={() => <Ionicons name="calendar-outline" size={20} />}
        />

        <DrawerItem
          label={TEXTS.Drawer.leads}
          onPress={() => {}}
          icon={() => <Ionicons name="bar-chart-outline" size={20} />}
        />

        <DrawerItem
          label={TEXTS.Drawer.campaigns}
          onPress={() => {}}
          icon={() => <Ionicons name="layers-outline" size={20} />}
        />

        <DrawerItem
          onPress={() => {}}
          label={TEXTS.Drawer.agents}
          icon={() => <Ionicons name="person-outline" size={20} />}
        />

        <DrawerItem
          label={TEXTS.Drawer.billing}
          onPress={() => {}}
          icon={() => <Ionicons name="card-outline" size={20} />}
        />

        {/* SUPPORT DROPDOWN */}
        <TouchableOpacity
          style={{
            flexDirection: "row",
            alignItems: "center",
            paddingHorizontal: 16,
            paddingVertical: 12,
          }}
          onPress={() => setShowSupport(!showSupport)}
        >
          <Ionicons name="help-circle-outline" size={20} color="#444" />
          <Text
            style={{ marginLeft: 18, fontSize: 15, color: "#444", flex: 1 }}
          >
            {TEXTS.Drawer.support}
          </Text>

          <Ionicons
            name={showSupport ? "chevron-up" : "chevron-down"}
            size={18}
          />
        </TouchableOpacity>

        {showSupport && (
          <>
            <DrawerItem
              style={{ marginLeft: 24 }}
              label={TEXTS.Drawer.mySupport}
              onPress={() => {}}
              icon={() => <Ionicons name="chatbubble-outline" size={18} />}
            />
          </>
        )}
        <DrawerItem
          style={{ marginLeft: 0 }}
          label={TEXTS.Drawer.profile}
          onPress={() => {
            props.navigation.closeDrawer();
            props.navigation.navigate("profile");
            // router.replace("/main/profile");
          }}
          icon={() => <Ionicons name="person-circle-outline" size={18} />}
        />
      </DrawerContentScrollView>

      {/* LOGOUT SECTION */}
      <TouchableOpacity
        style={{
          backgroundColor: theme.colors.primary,
          paddingVertical: 14,
          paddingHorizontal: 18,
          flexDirection: "row",
          alignItems: "center",
        }}
        onPress={() => {
          props.navigation.closeDrawer();
          console.log("Logout");
          clearAuth();
          router.replace("/auth/Login");
        }}
      >
        <Ionicons name="power-outline" size={20} color="#fff" />
        <Text
          style={{
            color: "#fff",
            marginLeft: 14,
            fontWeight: "600",
            fontSize: 14,
          }}
        >
          {TEXTS.Drawer.logOut}
        </Text>
      </TouchableOpacity>
    </View>
  );
}
