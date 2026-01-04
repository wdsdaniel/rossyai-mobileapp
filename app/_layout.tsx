import { Slot, usePathname } from "expo-router";
import { ThemeProvider } from "../hooks/ThemeContext";
import { Drawer } from "expo-router/drawer";

import {
  useFonts,
  PublicSans_400Regular,
  PublicSans_500Medium,
  PublicSans_600SemiBold,
  PublicSans_700Bold,
} from "@expo-google-fonts/public-sans";

import CustomDrawer from "./main/dashboard/CustomDrawer";

export default function RootLayout() {
  const pathname = usePathname();

  const [fontsLoaded] = useFonts({
    PublicSans_400Regular,
    PublicSans_500Medium,
    PublicSans_600SemiBold,
    PublicSans_700Bold,
  });

  if (!fontsLoaded) return null;

  // no header / drawer for auth screens
  // const hideShell = pathname.startsWith("/auth");

  return (
    <ThemeProvider>
      <Slot />
    </ThemeProvider>
  );
}
