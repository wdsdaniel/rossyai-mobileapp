import { View, TouchableOpacity, Image } from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, DrawerActions } from "@react-navigation/native";
import { useTheme } from "../../hooks/ThemeContext";
import OrganizationModal from "@/components/modal/OrganizationModal";
import { Organization } from "@/api/types/Organization";
import { useState } from "react";
export default function Header({
  title,
  organizationList = [],
  onSelectOrganization,
}: {
  title: string;
  organizationList: Organization[];
  onSelectOrganization?: (org: Organization) => void;
}) {
  const nav = useNavigation();
  const parent = nav.getParent();
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const [organization, setOrganization] = useState<Organization>();
  const [openOrgModal, setOpenOrgModal] = useState(false);

  return (
    <SafeAreaView
      style={{
        backgroundColor: theme.colors.primary,
        paddingTop: insets.top, // 👈 protects from status bar
      }}
    >
      <View
        style={{
          height: 30,
          backgroundColor: theme.colors.primary,
          flexDirection: "row",
          alignItems: "center",
          paddingHorizontal: 14,
        }}
      >
        <TouchableOpacity
          onPress={() => {
            nav.dispatch(DrawerActions.openDrawer());
            // if (parent) {
            //   parent.dispatch(DrawerActions.openDrawer());
            // } else {
            //   console.log("No drawer found for this screen");
            // }
          }}
        >
          <Ionicons name="menu" size={26} color="#fff" />
        </TouchableOpacity>

        <Image
          source={require("../../assets/images/App_Icon_White.png")}
          style={{ width: 32, height: 32, marginLeft: 12 }}
          resizeMode="contain"
        />

        <View style={{ flex: 1 }} />

        <Ionicons
          name="time-outline"
          size={22}
          color="#fff"
          onPress={() => {
            setOpenOrgModal(true);
          }}
          style={{ marginRight: 14 }}
        />

        <Ionicons name="person-outline" size={22} color="#fff" />
      </View>
      <>
        <OrganizationModal
          visible={openOrgModal}
          organizations={organizationList}
          onClose={() => setOpenOrgModal(false)}
          onSelect={(org) => {
            setOpenOrgModal(false);
            setOrganization(org);
            onSelectOrganization?.(org);
          }}
          onCreate={() => {
            console.log("Create new organization");
            setOpenOrgModal(false);
          }}
        />
      </>
    </SafeAreaView>
  );
}
