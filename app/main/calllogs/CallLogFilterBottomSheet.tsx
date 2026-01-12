import React, { forwardRef, useMemo, useState } from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import {
  BottomSheetModal,
  BottomSheetBackdrop,
} from "@gorhom/bottom-sheet";
import Ionicons from "@expo/vector-icons/Ionicons";

import { useTheme } from "@/hooks/ThemeContext";
import AppText from "@/components/ui/AppText";
import AppInput from "@/components/ui/AppInput";

type Filters = {
  search: string;
  favorite: string;
  agent: string;
  dateRange: string;
};

type Props = {
  onApply: (filters: Filters) => void;
  onClear: () => void;
  onClose: () => void;
};

const CallLogFilterBottomSheet = forwardRef<
  BottomSheetModal,
  Props
>(function CallLogFilterBottomSheet(
  { onApply, onClear, onClose },
  ref
) {
  const { theme } = useTheme();

  const [search, setSearch] = useState("");
  const [favorite, setFavorite] = useState("");
  const [agent, setAgent] = useState("");
  const [dateRange, setDateRange] = useState("");

  const snapPoints = useMemo(() => ["75%"], []);

  const handleClear = () => {
    setSearch("");
    setFavorite("");
    setAgent("");
    setDateRange("");
    onClear();
  };

  const handleApply = () => {
    onApply({ search, favorite, agent, dateRange });
  };

  return (
    <BottomSheetModal
      ref={ref}
      snapPoints={snapPoints}
      enablePanDownToClose
      onDismiss={onClose}
      backdropComponent={(props) => (
        <BottomSheetBackdrop
          {...props}
          appearsOnIndex={0}
          disappearsOnIndex={-1}
        />
      )}
    >
      {/* Header */}
      <View style={styles.header}>
        <AppText size={18} weight="700">
          Search Filters
        </AppText>

        <TouchableOpacity onPress={onClose}>
          <Ionicons
            name="close"
            size={24}
            color={theme.colors.textPrimary}
          />
        </TouchableOpacity>
      </View>

      {/* Content */}
      <View style={styles.content}>
        <AppInput placeholder="Search Call" value={search} onChangeText={setSearch} />
        <AppInput placeholder="Filter Favorites" value={favorite} onChangeText={setFavorite} />
        <AppInput placeholder="Select Agent" value={agent} onChangeText={setAgent} />
        <AppInput placeholder="Date Range" value={dateRange} onChangeText={setDateRange} />
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.button, styles.clearBtn, { borderColor: theme.colors.primary }]}
          onPress={handleClear}
        >
          <AppText weight="600" color={theme.colors.primary}>
            Clear
          </AppText>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.applyBtn, { backgroundColor: theme.colors.primary }]}
          onPress={handleApply}
        >
          <AppText weight="600" color="#FFF">
            Apply
          </AppText>
        </TouchableOpacity>
      </View>
    </BottomSheetModal>
  );
});

export default CallLogFilterBottomSheet;

const styles = StyleSheet.create({
  header: {
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderColor: "#E5E7EB",
  },
  content: {
    padding: 16,
  },
  footer: {
    flexDirection: "row",
    gap: 12,
    padding: 16,
  },
  button: {
    flex: 1,
    height: 44,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  clearBtn: {
    borderWidth: 1,
  },
  applyBtn: {},
});
