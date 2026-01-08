import React, { useEffect, useState } from "react";
import {
  Modal,
  View,
  TouchableOpacity,
  FlatList,
} from "react-native";
import * as SecureStore from "expo-secure-store";
import { Ionicons } from "@expo/vector-icons";
import { Organization } from "@/api/types/Organization";
import { useTheme } from "../../hooks/ThemeContext";
import SearchAppInput from "../ui/SearchAppInput";
import NoOrganizationView from "@/components/ui/NoOrganizationView";
import AppText from "@/components/ui/AppText";

interface Props {
  visible: boolean;
  organizations: Organization[];
  onClose: () => void;
  onSelect: (org: Organization) => void;
  onCreate: () => void;
}

const STORAGE_KEY = "SELECTED_ORGANIZATION_ID";

export default function OrganizationModal({
  visible,
  organizations,
  onClose,
  onSelect,
  onCreate,
}: Props) {
  const { theme } = useTheme();
  const [search, setSearch] = useState("");
  const [selectedOrgId, setSelectedOrgId] = useState<string | null>(null);

  /** Load saved selection OR select first org */
  useEffect(() => {
    if (!visible || organizations.length === 0) return;

    const loadSelectedOrg = async () => {
      const savedId = await SecureStore.getItemAsync(STORAGE_KEY);

      if (savedId && organizations.some(o => o.id === savedId)) {
        setSelectedOrgId(savedId);
      } else {
        const firstOrg = organizations[0];
        setSelectedOrgId(firstOrg.id);
        await SecureStore.setItemAsync(STORAGE_KEY, firstOrg.id);
        onSelect(firstOrg);
      }
    };

    loadSelectedOrg();
  }, [visible, organizations]);

  /** Handle selection */
  const handleSelect = async (org: Organization) => {
    setSelectedOrgId(org.id);
    await SecureStore.setItemAsync(STORAGE_KEY, org.id);
    onSelect(org);
    onClose();
  };

  const filtered = organizations.filter((o) =>
    o.business_name.toLowerCase().includes(search.toLowerCase())
  );

  /** Empty View (icon + text + create only) */
  const renderEmpty = () => (
    <NoOrganizationView
      title={
        organizations.length === 0
          ? "No organizations found"
          : "No matching organizations"
      }
      description={
        organizations.length === 0
          ? "Create an organization to continue"
          : "Try searching with a different name"
      }
      onCreatePress={onCreate}
    />
  );

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View
        style={{
          flex: 1,
          backgroundColor: "rgba(0,0,0,0.45)",
          justifyContent: "center",
          padding: 20,
        }}
      >
        <View
          style={{
            backgroundColor: "#fff",
            borderRadius: 14,
            padding: 14,
            maxHeight: "85%",
          }}
        >
          {/* Search */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              borderWidth: 1,
              borderColor: "#ddd",
              borderRadius: 10,
              paddingHorizontal: 10,
              height: 42,
              marginBottom: 10,
            }}
          >
            <Ionicons name="search-outline" size={18} color="#777" />
            <SearchAppInput
              placeholder="Search organizations"
              value={search}
              onChangeText={setSearch}
            />
          </View>

          {/* Organization List */}
          <FlatList
            data={filtered}
            keyExtractor={(item) => item.id}
            ListEmptyComponent={renderEmpty}
            contentContainerStyle={{ flexGrow: 1 }}
            renderItem={({ item }) => {
              const isSelected = item.id === selectedOrgId;

              return (
                <TouchableOpacity
                  onPress={() => handleSelect(item)}
                  style={{
                    paddingVertical: 10,
                    paddingHorizontal: 6,
                    borderRadius: 8,
                    backgroundColor: isSelected ? "#EEF0FF" : "transparent",
                  }}
                >
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Ionicons
                      name="business-outline"
                      size={20}
                      color={isSelected ? "#5A4BFF" : "#707070"}
                    />

                    <View style={{ marginLeft: 10, flex: 1 }}>
                      <AppText
                        weight="600"
                        color={isSelected ? "#5A4BFF" : "#000"}
                      >
                        {item.business_name}
                      </AppText>
                      <AppText size={12} color="#666">
                        Minutes: {item.minutes}
                      </AppText>
                    </View>

                    {isSelected && (
                      <Ionicons
                        name="checkmark-circle"
                        size={20}
                        color="#5A4BFF"
                      />
                    )}
                  </View>
                </TouchableOpacity>
              );
            }}
          />

          {/* ✅ ORIGINAL CANCEL BUTTON (UNCHANGED) */}
          <View style={{ marginTop: 10 }}>
            <TouchableOpacity
              onPress={onClose}
              style={{
                paddingVertical: 12,
                borderRadius: 8,
                alignItems: "center",
                backgroundColor: "#f2f2f2",
              }}
            >
              <AppText weight="600">Cancel</AppText>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}
