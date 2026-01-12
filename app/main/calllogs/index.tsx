import React, { useEffect, useState, useCallback, useRef } from "react";
import {
  View,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import * as SecureStore from "expo-secure-store";
import { useFocusEffect, useNavigation } from "@react-navigation/native";

import { useTheme } from "@/hooks/ThemeContext";
import AppText from "@/components/ui/AppText";
import Header from "../Header";
import HeaderText from "@/components/ui/HeaderText";
import { TEXTS } from "@/constants/texts";
import { STORAGE_KEYS } from "@/constants/storageKeys";

import { Organization } from "@/api/types/Organization";
import {
  getCallLogs,
  markCallLogItemFavorites,
} from "@/api/calllogs/calllog.api";
import { CallLog } from "@/api/types/Calllogs";
import { checkConnection } from "@/utils/network";

import CustomDialog from "@/components/modal/CustomDialog";
import CallLogShimmer from "@/components/shimmer/CallLogShimmer";
import NoOrganizationView from "@/components/ui/NoOrganizationView";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { CallLogsStackParamList } from "./CallLogsStack";

/* -------------------------------------------------------------------------- */
/*                            DURATION FORMATTER                              */
/* -------------------------------------------------------------------------- */

const formatDuration = (seconds?: number) => {
  if (!seconds || seconds <= 0) return "0s";
  const totalSeconds = Math.round(seconds);
  const mins = Math.floor(totalSeconds / 60);
  const secs = totalSeconds % 60;
  if (mins > 0 && secs > 0) return `${mins}m ${secs}s`;
  if (mins > 0) return `${mins}m`;
  return `${secs}s`;
};

const MIN_SEARCH_LENGTH = 3;
const SEARCH_DEBOUNCE_DELAY = 500;

export default function CallLogsScreen() {
  const { theme } = useTheme();

  const [organization, setOrganization] = useState<Organization | null>(null);
  const [isRestoringOrg, setIsRestoringOrg] = useState(true);

  const [callLogs, setCallLogs] = useState<CallLog[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [starringId, setStarringId] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState("");

  const [dialogVisible, setDialogVisible] = useState(false);
  const [dialogTitle, setDialogTitle] = useState("");
  const [dialogMessage, setDialogMessage] = useState("");

  const [isSearchVisible, setIsSearchVisible] = useState(false);

  const isPaginatingRef = useRef(false);
  const searchDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  type NavigationProp = NativeStackNavigationProp<
    CallLogsStackParamList,
    "CallLogsList"
  >;
  const navigation = useNavigation<NavigationProp>();

  const handleViewDetails = (item: CallLog) => {
    navigation.navigate("CallDetails", {
      callLog: item,
    });
  };

  const hasSelectedOrganization = !!organization?.id;

  /* --------------------------- DIALOG --------------------------- */

  const showDialog = (title: string, message: string) => {
    setDialogTitle(title);
    setDialogMessage(message);
    setDialogVisible(true);
  };

  /* --------------------------- INTERNET --------------------------- */

  const ensureInternet = useCallback(async () => {
    const net = await checkConnection();
    if (!net.isConnected || !net.isInternetReachable) {
      showDialog(
        TEXTS.Network.noInternetTitle,
        TEXTS.Network.noInternetMessage
      );
      return false;
    }
    return true;
  }, []);

  /* -------------------- SYNC ORGANIZATION ON FOCUS -------------------- */

  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      const syncOrganization = async () => {
        try {
          const savedOrgId = await SecureStore.getItemAsync(
            STORAGE_KEYS.SELECTED_ORGANIZATION_ID
          );

          if (!isActive) return;

          if (!savedOrgId) {
            setOrganization(null);
            setCallLogs([]);
            setPage(1);
            return;
          }

          if (savedOrgId !== organization?.id) {
            setOrganization({ id: savedOrgId } as Organization);
            setCallLogs([]);
            setPage(1);
          }
        } finally {
          setIsRestoringOrg(false);
        }
      };

      syncOrganization();
      return () => {
        isActive = false;
      };
    }, [organization?.id])
  );

  /* --------------------------- FETCH CALL LOGS --------------------------- */

  const fetchCallLogs = useCallback(
    async (pageNumber = 1, orgId?: string, query = "") => {
      if (!orgId) return;
      if (pageNumber > 1 && isPaginatingRef.current) return;

      const ok = await ensureInternet();
      if (!ok) return;

      if (pageNumber === 1) setIsLoading(true);
      else {
        isPaginatingRef.current = true;
        setIsFetchingMore(true);
      }

      try {
        const res = await getCallLogs({
          organizationId: orgId,
          page: pageNumber,
          limit: 10,
          q: query,
        });

        if (res.success) {
          setTotalPages(res.data.totalPages);
          setCallLogs((prev) =>
            pageNumber === 1 ? res.data.docs : [...prev, ...res.data.docs]
          );
          setPage(pageNumber);
        }
      } catch {
        showDialog(TEXTS.App.rossyAI, TEXTS.Auth.somethingWentWrong);
      } finally {
        setIsLoading(false);
        setIsFetchingMore(false);
        isPaginatingRef.current = false;
      }
    },
    [ensureInternet]
  );

  /* -------------------- INITIAL LOAD (ORG CHANGE) -------------------- */

  useEffect(() => {
    if (!organization?.id) return;
    setCallLogs([]);
    setPage(1);
    fetchCallLogs(1, String(organization.id));
  }, [organization?.id, fetchCallLogs]);

  /* --------------------------- SEARCH (SAFE) --------------------------- */

  useEffect(() => {
    if (!organization?.id) return;
    if (!searchQuery) return;
    if (searchQuery.length < MIN_SEARCH_LENGTH) return;

    if (searchDebounceRef.current) {
      clearTimeout(searchDebounceRef.current);
    }

    searchDebounceRef.current = setTimeout(() => {
      setCallLogs([]);
      setPage(1);
      fetchCallLogs(1, String(organization.id), searchQuery);
    }, SEARCH_DEBOUNCE_DELAY);

    return () => {
      if (searchDebounceRef.current) {
        clearTimeout(searchDebounceRef.current);
      }
    };
  }, [searchQuery, organization?.id, fetchCallLogs]);

  /* --------------------------- CLEAR SEARCH --------------------------- */

  const handleClearSearch = () => {
    if (searchDebounceRef.current) {
      clearTimeout(searchDebounceRef.current);
    }

    setSearchQuery("");
    setCallLogs([]);
    setPage(1);
    fetchCallLogs(1, String(organization?.id));
  };

  /* --------------------------- LOAD MORE --------------------------- */

  const handleLoadMore = useCallback(async () => {
    if (!organization?.id) return;
    if (page >= totalPages) return;
    if (!(await ensureInternet())) return;

    fetchCallLogs(
      page + 1,
      String(organization.id),
      searchQuery.length >= MIN_SEARCH_LENGTH ? searchQuery : ""
    );
  }, [
    page,
    totalPages,
    organization?.id,
    searchQuery,
    ensureInternet,
    fetchCallLogs,
  ]);

  /* --------------------------- FAVORITE --------------------------- */

  const handleToggleFavorite = async (item: CallLog) => {
    if (starringId || !organization?.id) return;
    if (!(await ensureInternet())) return;

    const newValue = !item.starred;
    setCallLogs((prev) =>
      prev.map((log) =>
        log.id === item.id ? { ...log, starred: newValue } : log
      )
    );

    setStarringId(item.id);
    try {
      await markCallLogItemFavorites(
        newValue,
        String(organization.id),
        item.id
      );
    } finally {
      setStarringId(null);
    }
  };

  /* --------------------------- EMPTY --------------------------- */

  const EmptyList = () => (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Ionicons name="call-outline" size={44} color={theme.colors.primary} />
      <AppText size={14} weight="600" color={theme.colors.primary}>
        {TEXTS.CallLogs.noCallLogsAvailable}
      </AppText>
    </View>
  );

  /* --------------------------- RENDER ITEM --------------------------- */

  const renderItem = ({ item }: { item: CallLog }) => (
    <View
      style={{
        backgroundColor: "#fff",
        borderRadius: 12,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: "#E9E9E9",
        overflow: "hidden",
      }}
    >
      <View style={{ padding: 14 }}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <AppText size={14} weight="700">
            {item.assistantName}
          </AppText>

          <View style={{ flex: 1 }} />

          <TouchableOpacity
            onPress={() => handleToggleFavorite(item)}
            disabled={starringId === item.id}
          >
            <Ionicons
              name={item.starred ? "star" : "star-outline"}
              size={18}
              color={theme.colors.primary}
            />
          </TouchableOpacity>
        </View>

        <AppText size={12} style={{ marginTop: 6 }}>
          <AppText weight="600" color={theme.colors.primary}>
            {TEXTS.CallLogs.callId}:{" "}
          </AppText>
          {item.id}
        </AppText>

        <AppText size={12} style={{ marginTop: 4 }}>
          <AppText weight="600" color={theme.colors.primary}>
            {TEXTS.CallLogs.number}:{" "}
          </AppText>
          {item.phoneNumber}
        </AppText>

        <AppText size={12} style={{ marginTop: 4 }}>
          <AppText weight="600" color={theme.colors.primary}>
            {TEXTS.CallLogs.duration}:{" "}
          </AppText>
          {formatDuration(item.duration)}
        </AppText>

        <AppText size={12} style={{ marginTop: 4 }}>
          <AppText weight="600" color={theme.colors.primary}>
            {TEXTS.CallLogs.endedReason}:{" "}
          </AppText>
          {item.endedReason}
        </AppText>
      </View>
      <View
        style={{
          borderTopWidth: 1,
          borderTopColor: "#E9E9E9",
          backgroundColor: "#F8F9FC",
          paddingHorizontal: 14,
          paddingVertical: 10,
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <AppText size={11}>
          {TEXTS.CallLogs.startTime}:{" "}
          {new Date(item.startedAt).toLocaleString()}
        </AppText>

        <View style={{ flex: 1 }} />

        <TouchableOpacity
          onPress={() => {
            handleViewDetails(item);
          }}
        >
          <AppText size={12} weight="600" color={theme.colors.primary}>
            {TEXTS.CallLogs.viewDetails}
          </AppText>
        </TouchableOpacity>
      </View>
    </View>
  );

  /* --------------------------- UI --------------------------- */

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <Header
        title={TEXTS.CallLogs.callLogs}
        organizationList={[]}
        onSelectOrganization={setOrganization}
      />

      <HeaderText
        style={{ textAlign: "center", backgroundColor: "#F6F6F7" }}
        weight="700"
        height={60}
        size={30}
        lineHeight={60}
        color={theme.colors.primary}
      >
        {TEXTS.CallLogs.callLogs}
      </HeaderText>

      {/* SEARCH + FILTER ROW */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          paddingHorizontal: 14,
          paddingVertical: 10,
        }}
      >
        {/* LEFT: SEARCH ICON */}
        <TouchableOpacity onPress={() => setIsSearchVisible((prev) => !prev)}>
          <Ionicons
            name="search-outline"
            size={18}
            color={theme.colors.primary}
          />
        </TouchableOpacity>

        {/* MIDDLE: SEARCH INPUT (SPACE RESERVED ALWAYS) */}
        <View
          style={{
            flex: 1,
            marginLeft: 10,
            marginRight: 12,
            opacity: isSearchVisible ? 1 : 0,
          }}
          pointerEvents={isSearchVisible ? "auto" : "none"}
        >
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <TextInput
              value={searchQuery}
              placeholder={TEXTS.CallLogs.searchCallLogs}
              placeholderTextColor="#000" // black hint
              onChangeText={setSearchQuery}
              style={{
                flex: 1,
                fontSize: 15,
                color: theme.colors.textPrimary,
                paddingVertical: 6,
              }}
              selectionColor={theme.colors.primary}
            />

            {!!searchQuery && (
              <TouchableOpacity onPress={handleClearSearch}>
                <Ionicons
                  name="close"
                  size={16}
                  color={theme.colors.textMuted}
                />
              </TouchableOpacity>
            )}
          </View>

          {/* UNDERLINE */}
          <View
            style={{
              height: 1,
              backgroundColor: theme.colors.border,
              marginTop: 4,
            }}
          />
        </View>

        {/* RIGHT: FILTER (FIXED POSITION) */}
        <TouchableOpacity
          style={{
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <Ionicons
            name="options-outline"
            size={16}
            color={theme.colors.primary}
          />
          <AppText
            style={{ marginLeft: 6 }}
            weight="600"
            color={theme.colors.primary}
          >
            {TEXTS.CallLogs.filter}
          </AppText>
        </TouchableOpacity>
      </View>

      {isRestoringOrg ? (
        <View style={{ padding: 14 }}>
          <CallLogShimmer />
        </View>
      ) : !hasSelectedOrganization ? (
        <NoOrganizationView />
      ) : (
        <FlatList
          data={isLoading ? [] : callLogs}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          ListEmptyComponent={isLoading ? <CallLogShimmer /> : <EmptyList />}
          ListFooterComponent={
            isFetchingMore ? (
              <ActivityIndicator
                size="small"
                color={theme.colors.primary}
                style={{ marginVertical: 16 }}
              />
            ) : null
          }
          contentContainerStyle={{ padding: 14, flexGrow: 1 }}
        />
      )}

      <CustomDialog
        visible={dialogVisible}
        title={dialogTitle}
        message={dialogMessage}
        showCancel={false}
        showConfirm
        confirmText={TEXTS.Dialog.okay}
        onConfirm={() => setDialogVisible(false)}
      />
    </View>
  );
}
