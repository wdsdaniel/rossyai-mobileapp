import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

import { useTheme } from "../../../hooks/ThemeContext";
import AppText from "../../../components/ui/AppText";
import Header from "../../main/Header";
import HeaderText from "@/components/ui/HeaderText";
import { TEXTS } from "@/constants/texts";
import { Organization } from "@/api/types/Organization";
import { getOrganization } from "../../../api/organization/organizations.api";

import {
  getCallLogs,
  markCallLogItemFavorites,
} from "@/api/calllogs/calllog.api";
import { CallLog } from "@/api/types/Calllogs";
import { getUserId } from "@/api/storage";
import { checkConnection } from "@/utils/network";
import CustomDialog from "../../../components/modal/CustomDialog";
import CallLogShimmer from "@/components/shimmer/CallLogShimmer";

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

/* -------------------------------------------------------------------------- */
/*                                   SCREEN                                   */
/* -------------------------------------------------------------------------- */

export default function CallLogsScreen() {
  const { theme } = useTheme();

  const [callLogs, setCallLogs] = useState<CallLog[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [isLoading, setIsLoading] = useState(true);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [starringId, setStarringId] = useState<string | null>(null);

  const [organization, setOrganization] = useState<Organization | null>(null);
  const [organizationList, setOrganizationList] = useState<Organization[]>([]);

  const [dialogVisible, setDialogVisible] = useState(false);
  const [dialogTitle, setDialogTitle] = useState("");
  const [dialogMessage, setDialogMessage] = useState("");

  /* --------------------------- DIALOG --------------------------- */

  const showDialog = (title: string, message: string) => {
    setDialogTitle(title);
    setDialogMessage(message);
    setDialogVisible(true);
  };

  /* --------------------------- INTERNET --------------------------- */

  const ensureInternet = async (): Promise<boolean> => {
    const net = await checkConnection();
    if (!net.isConnected || !net.isInternetReachable) {
      showDialog(
        TEXTS.Network.noInternetTitle,
        TEXTS.Network.noInternetMessage
      );
      return false;
    }
    return true;
  };

  /* --------------------------- LOAD ORGANIZATIONS --------------------------- */

  useEffect(() => {
    async function loadOrganizations() {
      const hasInternet = await ensureInternet();
      if (!hasInternet) return;

      const userId = await getUserId();
      if (!userId) return;

      const orgs = await getOrganization(Number(userId));
      setOrganizationList(orgs);

      if (orgs.length > 0) {
        setOrganization(orgs[0]);
      }
    }

    loadOrganizations();
  }, []);

  /* --------------------------- RESET PAGINATION --------------------------- */

  const resetPagination = () => {
    setCallLogs([]);
    setPage(1);
    setTotalPages(1);
  };

  /* --------------------------- FETCH CALL LOGS --------------------------- */

  const fetchCallLogs = async (pageNumber = 1, orgId?: string) => {
    if (isFetchingMore) return;

    const hasInternet = await ensureInternet();
    if (!hasInternet || !orgId) return;

    pageNumber === 1 ? setIsLoading(true) : setIsFetchingMore(true);

    try {
      const res = await getCallLogs({
        organizationId: orgId,
        page: pageNumber,
        limit: 10,
      });

      if (res.success) {
        setTotalPages(res.data.totalPages);
        setCallLogs((prev) =>
          pageNumber === 1
            ? res.data.docs
            : [...prev, ...res.data.docs]
        );
        setPage(pageNumber);
      } else {
        showDialog(TEXTS.App.rossyAI, res.message);
      }
    } catch {
      showDialog(TEXTS.App.rossyAI, TEXTS.Auth.somethingWentWrong);
    } finally {
      setIsLoading(false);
      setIsFetchingMore(false);
    }
  };

  /* --------------------------- ORG CHANGE EFFECT --------------------------- */

  useEffect(() => {
    if (!organization?.id) return;
    resetPagination();
    fetchCallLogs(1, String(organization.id));
  }, [organization]);

  /* --------------------------- LOAD MORE --------------------------- */

  const handleLoadMore = useCallback(() => {
    if (
      page < totalPages &&
      !isFetchingMore &&
      organization?.id
    ) {
      fetchCallLogs(page + 1, String(organization.id));
    }
  }, [page, totalPages, isFetchingMore, organization]);

  /* --------------------------- FAVORITE --------------------------- */

  const handleToggleFavorite = async (item: CallLog) => {
    if (starringId || !organization?.id) return;

    const hasInternet = await ensureInternet();
    if (!hasInternet) return;

    const newValue = !item.starred;

    setCallLogs((prev) =>
      prev.map((log) =>
        log.id === item.id ? { ...log, starred: newValue } : log
      )
    );

    setStarringId(item.id);

    try {
      const res = await markCallLogItemFavorites(
        newValue,
        String(organization.id),
        item.id
      );

      if (!res.success) throw new Error();
    } catch {
      setCallLogs((prev) =>
        prev.map((log) =>
          log.id === item.id ? { ...log, starred: item.starred } : log
        )
      );
      showDialog(TEXTS.App.rossyAI, TEXTS.Auth.somethingWentWrong);
    } finally {
      setStarringId(null);
    }
  };

  /* --------------------------- EMPTY --------------------------- */

  const EmptyList = () => (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Ionicons
        name="call-outline"
        size={44}
        color={theme.colors.primary}
        style={{ marginBottom: 12 }}
      />
      <AppText size={14} weight="600" color={theme.colors.primary}>
        {TEXTS.CallLogs.noCallLogsAvailable}
      </AppText>
    </View>
  );

  /* --------------------------- SHIMMER --------------------------- */

  const ShimmerList = () => (
    <>
      {Array.from({ length: 6 }).map((_, index) => (
        <CallLogShimmer key={index} />
      ))}
    </>
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
          <AppText weight="600">Call ID: </AppText>
          {item.id}
        </AppText>

        <AppText size={12}>
          <AppText weight="600">Number: </AppText>
          {item.phoneNumber}
        </AppText>

        <AppText size={12}>
          <AppText weight="600">Duration: </AppText>
          {formatDuration(item.duration)}
        </AppText>

        <AppText size={12}>
          <AppText weight="600">Ended Reason: </AppText>
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
          Start Time {new Date(item.startedAt).toLocaleString()}
        </AppText>

        <View style={{ flex: 1 }} />

        <TouchableOpacity>
          <AppText
            size={12}
            weight="600"
            color={theme.colors.primary}
            style={{ textDecorationLine: "underline" }}
          >
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
        organizationList={organizationList}
        onSelectOrganization={(org) => setOrganization(org)}
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

      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          paddingHorizontal: 14,
          paddingVertical: 10,
        }}
      >
        <View style={{ flex: 1 }} />
        <Ionicons
          name="options-outline"
          size={16}
          color={theme.colors.primary}
        />
        <AppText style={{ marginLeft: 6 }} weight="600" color={theme.colors.primary}>
          Filters
        </AppText>
      </View>

      <FlatList
        data={isLoading ? [] : callLogs}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        ListEmptyComponent={isLoading ? <ShimmerList /> : <EmptyList />}
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
