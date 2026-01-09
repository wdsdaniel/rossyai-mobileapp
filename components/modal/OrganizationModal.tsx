import React, { useEffect, useState, useRef } from "react";
import {
  Modal,
  View,
  TouchableOpacity,
  FlatList,
} from "react-native";
import * as SecureStore from "expo-secure-store";
import { Ionicons } from "@expo/vector-icons";

import SearchAppInput from "../ui/SearchAppInput";
import NoOrganizationView from "@/components/ui/NoOrganizationView";
import AppText from "@/components/ui/AppText";
import ShimmerList from "../shimmer/ShimmerList";

import { TEXTS } from "@/constants/texts";
import { STORAGE_KEYS } from "@/constants/storageKeys";
import { Organization } from "@/api/types/Organization";
import { getOrganization } from "@/api/organization/organizations.api";
import { getUserId } from "@/api/storage";
import { checkConnection } from "@/utils/network";

interface Props {
  visible: boolean;
  onClose: () => void;
  onSelect: (org: Organization) => void;
  onCreate: () => void;
}

export default function OrganizationModal({
  visible,
  onClose,
  onSelect,
  onCreate,
}: Props) {
  const [search, setSearch] = useState("");
  const [organizationList, setOrganizationList] = useState<Organization[]>([]);
  const [selectedOrgId, setSelectedOrgId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const hasLoadedRef = useRef(false);

  /* =======================
     LOAD ORGANIZATIONS
  ======================== */
  useEffect(() => {
    if (!visible || hasLoadedRef.current) return;

    hasLoadedRef.current = true;

    const load = async () => {
      try {
        setLoading(true);

        const net = await checkConnection();
        if (!net.isConnected || !net.isInternetReachable) return;

        const userId = await getUserId();
        if (!userId) return;

        const orgs = await getOrganization(Number(userId));
        setOrganizationList(orgs);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [visible]);

  /* =======================
     RESTORE SELECTION
  ======================== */
  useEffect(() => {
    if (!visible || organizationList.length === 0) return;

    const restore = async () => {
      const savedId = await SecureStore.getItemAsync(
        STORAGE_KEYS.SELECTED_ORGANIZATION_ID
      );

      const valid = organizationList.find(o => o.id === savedId);

      if (valid) {
        setSelectedOrgId(valid.id);
      } else {
        const first = organizationList[0];
        setSelectedOrgId(first.id);
        await SecureStore.setItemAsync(
          STORAGE_KEYS.SELECTED_ORGANIZATION_ID,
          first.id
        );
      }
    };

    restore();
  }, [visible, organizationList]);

  /* =======================
     RESET ON CLOSE
  ======================== */
  useEffect(() => {
    if (!visible) {
      hasLoadedRef.current = false;
      setLoading(false);
      setSearch("");
      setOrganizationList([]);
      setSelectedOrgId(null);
    }
  }, [visible]);

  /* =======================
     SELECT HANDLER
  ======================== */
  const handleSelect = async (org: Organization) => {
    setSelectedOrgId(org.id);
    await SecureStore.setItemAsync(
      STORAGE_KEYS.SELECTED_ORGANIZATION_ID,
      org.id
    );
    onSelect(org);
    onClose();
  };

  const filtered = organizationList.filter(o =>
    o.business_name.toLowerCase().includes(search.toLowerCase())
  );

  const renderEmpty = () => (
    <NoOrganizationView
      title={
        organizationList.length === 0
          ? TEXTS.App.noOrganizationFound
          : TEXTS.App.noMatchingOrganizationFound
      }
      description={
        organizationList.length === 0
          ? TEXTS.App.createOrganization
          : TEXTS.App.trySearchingDifferentName
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
              placeholder={TEXTS.App.searchOrganization}
              value={search}
              onChangeText={setSearch}
            />
          </View>

          {/* Content */}
          {loading ? (
            <ShimmerList rows={6} />
          ) : (
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
          )}

          {/* Cancel Button */}
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
              <AppText weight="600">{TEXTS.Dialog.cancel}</AppText>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}
