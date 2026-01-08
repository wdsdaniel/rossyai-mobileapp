import React from "react";
import {
  View,
  Modal,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import AppText from "@/components/ui/AppText";
import { useTheme } from "@/hooks/ThemeContext";
import { TEXTS } from "@/constants/texts";

export default function FilterBottomSheet({ visible, onClose }: any) {
  const { theme } = useTheme();

  return (
    <Modal visible={visible} transparent animationType="slide">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1, justifyContent: "flex-end" }}
      >
        <TouchableOpacity style={{ flex: 1, backgroundColor: "#00000040" }} onPress={onClose} />

        <View
          style={{
            backgroundColor: "#fff",
            borderTopLeftRadius: 22,
            borderTopRightRadius: 22,
            padding: 18,
          }}
        >
          <AppText size={18} weight="700" style={{ textAlign: "center", marginBottom: 12 }}>
            Search Filters
          </AppText>

          <Input placeholder={TEXTS.CallLogs.searchCall} />
          <Input placeholder={TEXTS.CallLogs.filterFav} />
          <Input placeholder={TEXTS.CallLogs.selectAgent} />
          <Input placeholder={TEXTS.CallLogs.dateRange} />

          <TouchableOpacity onPress={onClose}>
            <AppText
              color={theme.colors.primary}
              weight="700"
              style={{ textAlign: "center", marginTop: 18 }}
            >
              Cancel
            </AppText>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

function Input({ placeholder }: any) {
  return (
    <View
      style={{
        borderWidth: 1,
        borderColor: "#E5E5E5",
        borderRadius: 10,
        paddingHorizontal: 12,
        paddingVertical: 10,
        marginTop: 10,
      }}
    >
      <TextInput placeholder={placeholder} style={{ fontSize: 14 }} />
    </View>
  );
}
