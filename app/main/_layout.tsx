import { createDrawerNavigator } from "@react-navigation/drawer";
import CustomDrawer from "./dashboard/CustomDrawer";
import DashboardHome from "./dashboard";
import ProfileScreen from "./profile";
import { useWindowDimensions } from "react-native";
import CallLogsStack from "./calllogs/CallLogsStack";

const Drawer = createDrawerNavigator();

export default function MainLayout() {
  const { width } = useWindowDimensions();

  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawer {...props} />}
      screenOptions={{
        headerShown: false,
        drawerType: "slide",
        overlayColor: "rgba(0,0,0,0.4)",
        drawerStyle: { width: width * 0.78 },
      }}
    >
      <Drawer.Screen
        name="dashboard"
        component={DashboardHome}
      />

      <Drawer.Screen
        name="profile"
        component={ProfileScreen}
      />

      <Drawer.Screen
        name="calllogs"
        component={CallLogsStack}
      />
    </Drawer.Navigator>
  );
}

