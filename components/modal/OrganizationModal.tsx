import React, { useState } from "react";
import {
  Modal,
  View,
  TextInput,
  TouchableOpacity,
  FlatList,
  Text,
} from "react-native";
import { useTheme } from "../../hooks/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import { Organization } from "@/api/types/Organization";
import AppInput from "../ui/AppInput";

interface Org {
  id: string;
  name: string;
  minutes: number;
}

interface Props {
  visible: boolean;
  organizations: Organization[];
  onClose: () => void;
  onSelect: (org: Organization) => void;
  onCreate: () => void;
}

export default function OrganizationModal({
  visible,
  organizations,
  onClose,
  onSelect,
  onCreate,
}: Props) {
  const { theme } = useTheme();
  const [search, setSearch] = useState("");

  const filtered = organizations.filter((o) =>
    o.business_name.toLowerCase().includes(search.toLowerCase())
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
            <AppInput
              placeholder="Search organizations"
              value={search}
              onChangeText={setSearch}
            />
          </View>

          {/* List */}
          <FlatList
            data={filtered}
            keyExtractor={(item) => item.id}
            style={{ marginBottom: 10 }}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => onSelect(item)}
                style={{
                  paddingVertical: 10,
                }}
              >
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Ionicons name="business-outline" size={20} color="#707070" />

                  <View style={{ marginLeft: 10 }}>
                    <Text style={{ fontWeight: "600" }}>{item.business_name}</Text>
                    <Text style={{ fontSize: 12, color: "#666" }}>
                      Minutes: {item.minutes}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            )}
          />

          {/* Footer buttons */}
          <View style={{ marginTop: 10 }}>
            <TouchableOpacity
              onPress={onCreate}
              style={{
                flexDirection: "row",
                alignItems: "center",
                paddingVertical: 12,
              }}
            >
              <Ionicons name="add" size={20} color="#5A4BFF" />
              <Text
                style={{
                  fontSize: 15,
                  marginLeft: 6,
                  color: "#5A4BFF",
                  fontWeight: "600",
                }}
              >
                Create Organization
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={onClose}
              style={{
                marginTop: 6,
                paddingVertical: 12,
                borderRadius: 8,
                alignItems: "center",
                backgroundColor: "#f2f2f2",
              }}
            >
              <Text style={{ fontWeight: "600" }}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}
