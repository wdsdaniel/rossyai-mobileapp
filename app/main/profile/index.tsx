import { View, ScrollView, Image, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/hooks/ThemeContext";
import AppText from "@/components/ui/AppText";
import Header from "../Header";
import { useEffect, useState } from "react";
import { getUser } from "@/api/storage";

// 👇 Ionicons name type
type IoniconName = React.ComponentProps<typeof Ionicons>["name"];

export default function ProfileScreen() {
  const { theme } = useTheme();
  const [profile, setProfile] = useState<any>({});

  useEffect(() => {
    async function load() {
      const user = await getUser();
      setProfile(user || {});
    }
    load();
  }, []);

  // 👇 Central list (typed)
  const profileFields: {
    label: string;
    value: string | undefined;
    icon: IoniconName;
  }[] = [
    { label: "First Name", value: profile.first_name, icon: "person-outline" },
    { label: "Last Name", value: profile.last_name, icon: "person-outline" },
    { label: "Email", value: profile.email, icon: "mail-outline" },
    { label: "Phone", value: profile.contact_no, icon: "call-outline" },
  ];

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <Header title="My Profile"
      organizationList={[]} />

      <ScrollView contentContainerStyle={{ padding: 16 }}>
        {/* Avatar */}
        <View style={{ alignItems: "center", marginTop: 10 }}>
          <View
            style={{
              width: 140,
              height: 140,
              borderRadius: 70,
              backgroundColor: "#F3F3FF",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Image
              source={require("@/assets/images/AppIcon.png")}
              style={{ width: 80, height: 80, resizeMode: "contain" }}
            />
          </View>

          <TouchableOpacity style={{ marginTop: 8 }}>
            <AppText color={theme.colors.primary}>Edit</AppText>
          </TouchableOpacity>
        </View>

        {/* Fields */}
        <View style={{ marginTop: 18 }}>
          {profileFields.map((item, index) => (
            <View
              key={index}
              style={{
                flexDirection: "row",
                alignItems: "center",
                backgroundColor: "#fff",
                borderRadius: 12,
                padding: 14,
                marginTop: 10,
              }}
            >
              <Ionicons
                name={item.icon}
                size={20}
                color={theme.colors.primary}
              />

              <View style={{ marginLeft: 12 }}>
                <AppText weight="600">{item.label}</AppText>
                <AppText size={13}>{item.value || "-"}</AppText>
              </View>
            </View>
          ))}
        </View>

        {/* Security option */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: "#fff",
            borderRadius: 12,
            padding: 14,
            marginTop: 16,
          }}
        >
          <Ionicons
            name="lock-closed-outline"
            size={20}
            color={theme.colors.primary}
          />
          <View style={{ marginLeft: 12 }}>
            <AppText weight="600">Security</AppText>
            <AppText size={13}>Change password & settings</AppText>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
