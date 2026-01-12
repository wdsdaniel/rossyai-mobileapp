import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  View,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Linking,
  Platform,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";
import { Audio } from "expo-av";
import * as FileSystem from "expo-file-system/legacy";
import * as MediaLibrary from "expo-media-library";
import { Svg, Circle } from "react-native-svg";

import Header from "../Header";
import AppText from "@/components/ui/AppText";
import { useTheme } from "@/hooks/ThemeContext";
import { RouteProp } from "@react-navigation/native";
import { CallLogsStackParamList } from "./CallLogsStack";
import { TEXTS } from "@/constants/texts";
import CustomDialog from "@/components/modal/CustomDialog";

type CallDetailsRouteProp = RouteProp<CallLogsStackParamList>;
/* -------------------------------------------------------------------------- */
/*                              SCREEN COMPONENT                               */
/* -------------------------------------------------------------------------- */
type Props = {
  route: CallDetailsRouteProp;
};

export default function CallDetailsScreen({ route }: Props) {
  const { theme } = useTheme();
  const { callLog } = route.params!;

  const openAppSettings = () => {
    if (Platform.OS === "ios") {
      Linking.openURL("app-settings:");
    } else {
      Linking.openSettings();
    }
  };

  // dialog state
  const [dialogVisible, setDialogVisible] = useState(false);
  const [dialogTitle, setDialogTitle] = useState("");
  const [dialogMessage, setDialogMessage] = useState("");
  const [dialogOnConfirm, setDialogOnConfirm] = useState<
    (() => void) | undefined
  >();

  const showDialog = (
    title: string,
    message: string,
    onConfirm?: () => void
  ) => {
    setDialogTitle(title);
    setDialogMessage(message);
    setDialogOnConfirm(() => onConfirm);
    setDialogVisible(true);
  };

  const [activeTab, setActiveTab] = useState<"summary" | "transcript">(
    "summary"
  );

  const soundRef = useRef<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const [downloadProgress, setDownloadProgress] = useState<number | null>(null);

  /* ----------------------------- FORMATTERS ----------------------------- */

  const durationText = useMemo(() => {
    const m = Math.floor(callLog.duration / 60);
    const s = Math.floor(callLog.duration % 60);
    return `${m}m ${s}s`;
  }, [callLog.duration]);

  /* ----------------------------- AUDIO ----------------------------- */

  const togglePlay = async () => {
    if (!callLog.recordingUrl) {
      showDialog(TEXTS.App.rossyAI, TEXTS.CallLogs.recodringNotAvailable);
      return;
    }

    try {
      if (!soundRef.current) {
        const { sound } = await Audio.Sound.createAsync(
          { uri: callLog.recordingUrl },
          { shouldPlay: true }
        );
        soundRef.current = sound;
        setIsPlaying(true);
      } else {
        if (isPlaying) {
          await soundRef.current.pauseAsync();
          setIsPlaying(false);
        } else {
          await soundRef.current.playAsync();
          setIsPlaying(true);
        }
      }
    } catch {
      showDialog(TEXTS.App.rossyAI, TEXTS.CallLogs.notAbleToPlay);
    }
  };

  useEffect(() => {
    return () => {
      soundRef.current?.unloadAsync();
    };
  }, []);

  const ensureMediaPermission = async (): Promise<boolean> => {
  // 1. Check current permission status
  const current = await MediaLibrary.getPermissionsAsync();

  // ✅ Already granted
  if (current.granted) {
    return true;
  }

  // 2. If user can still be asked → show system dialog
  if (current.canAskAgain) {
    const request = await MediaLibrary.requestPermissionsAsync();

    if (request.granted) {
      return true;
    }
  }

  // 3. Permission denied (or Don't ask again)
  showDialog(
    TEXTS.CallLogs.permissionRequired,
    TEXTS.CallLogs.rossyNeedAccessToStorage,
    () => {
      setDialogVisible(false);
      openAppSettings();
    }
  );

  return false;
};


  /* ----------------------------- DOWNLOAD ----------------------------- */

  const downloadRecording = async () => {
  if (!callLog.recordingUrl) {
    showDialog(
      TEXTS.App.rossyAI,
      TEXTS.CallLogs.recodringNotAvailable
    );
    return;
  }

  try {
    const hasPermission = await ensureMediaPermission();
    if (!hasPermission) return;

    const callback = (p: {
      totalBytesWritten: number;
      totalBytesExpectedToWrite: number;
    }) => {
      const percent =
        p.totalBytesWritten / p.totalBytesExpectedToWrite;
      setDownloadProgress(Math.round(percent * 100));
    };

    const fileUri =
      FileSystem.documentDirectory +
      `rossy-call-${Date.now()}.mp3`;

    const resumable =
      FileSystem.createDownloadResumable(
        callLog.recordingUrl,
        fileUri,
        {},
        callback
      );

    const result = await resumable.downloadAsync();
    if (!result) {
      setDownloadProgress(null);
      showDialog(
        TEXTS.CallLogs.downloadFailed,
        TEXTS.CallLogs.unableToDownloadRecording
      );
      return;
    }

    // ✅ SAFE on Android 13+
    await MediaLibrary.saveToLibraryAsync(result.uri);

    setDownloadProgress(null);
    showDialog(
      TEXTS.CallLogs.donwloadComplete,
      TEXTS.CallLogs.savedToDevice
    );
  } catch (e) {
    console.log("Exception while downloading => ", e);
    setDownloadProgress(null);
    showDialog(
      TEXTS.App.rossyAI,
      TEXTS.CallLogs.downloadFailed
    );
  }
};



  /* -------------------------------------------------------------------------- */

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <CustomDialog
        visible={dialogVisible}
        title={dialogTitle}
        message={dialogMessage}
        showCancel={false}
        showConfirm={true}
        confirmText={TEXTS.Dialog.okay}
        onConfirm={() => {
          dialogOnConfirm?.();
          setDialogVisible(false);
        }}
      />
      <Header title="Call Details" organizationList={[]} />

      <ScrollView contentContainerStyle={{ padding: 16 }}>
        {/* ----------------------------- TOP CARD ----------------------------- */}
        <View style={[styles.card, { borderColor: theme.colors.border }]}>
          <InfoRow
            icon="call-outline"
            label="Phone Number"
            value={callLog.phoneNumber}
          />
          <InfoRow icon="time-outline" label="Duration" value={durationText} />
          <InfoRow
            icon="play-circle-outline"
            label="Started At"
            value={callLog.startedAt}
          />
          <InfoRow
            icon="stop-circle-outline"
            label="Ended At"
            value={callLog.endedAt}
          />

          {/* RECORDING ROW */}
          <View style={styles.recordingRow}>
            <View style={styles.iconWrapper}>
              <Ionicons
                name="musical-notes-outline"
                size={20}
                color={theme.colors.primary}
              />
            </View>

            <View style={styles.textWrapper}>
              <AppText size={12} weight="600" color={theme.colors.primary}>
                Recording
              </AppText>
            </View>

            <View style={{ flex: 1 }} />

            {/* PLAY */}
            <TouchableOpacity
              onPress={togglePlay}
              style={[
                styles.playButton,
                { backgroundColor: theme.colors.primary },
              ]}
            >
              <Ionicons
                name={isPlaying ? "pause" : "play"}
                size={18}
                color="#fff"
              />
            </TouchableOpacity>

            {/* DOWNLOAD / PROGRESS */}
            {downloadProgress !== null ? (
              <View style={styles.downloadButton}>
                <CircularProgress
                  progress={downloadProgress}
                  color={theme.colors.primary}
                />
              </View>
            ) : (
              <TouchableOpacity
                onPress={downloadRecording}
                style={styles.downloadButton}
              >
                <Ionicons
                  name="download-outline"
                  size={22}
                  color={theme.colors.primary}
                />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* ----------------------------- TABS ----------------------------- */}
        <View style={styles.tabRow}>
          <TabButton
            title="Summary"
            active={activeTab === "summary"}
            onPress={() => setActiveTab("summary")}
          />
          <TabButton
            title="Transcript"
            active={activeTab === "transcript"}
            onPress={() => setActiveTab("transcript")}
          />
        </View>

        {/* ----------------------------- SUMMARY ----------------------------- */}
        {activeTab === "summary" && (
          <AppText size={13} style={{ marginTop: 12 }}>
            {callLog.summary || "No summary available."}
          </AppText>
        )}

        {/* ----------------------------- TRANSCRIPT ----------------------------- */}
        {activeTab === "transcript" &&
          (callLog.transcript?.length ? (
            callLog.transcript.map((item, index) => {
              const isAssistant = item.role === "assistant";
              return (
                <View
                  key={index}
                  style={[
                    styles.messageRow,
                    {
                      justifyContent: isAssistant ? "flex-start" : "flex-end",
                    },
                  ]}
                >
                  <View
                    style={[
                      styles.bubble,
                      {
                        backgroundColor: isAssistant
                          ? theme.colors.surface
                          : theme.colors.primary,
                      },
                    ]}
                  >
                    <AppText
                      size={13}
                      color={isAssistant ? theme.colors.textPrimary : "#fff"}
                    >
                      {item.content}
                    </AppText>
                  </View>
                </View>
              );
            })
          ) : (
            <AppText size={13} color={theme.colors.textMuted}>
              No transcript available.
            </AppText>
          ))}
      </ScrollView>

      {/* ----------------------------- FAB ----------------------------- */}
      <TouchableOpacity
        style={[styles.fab, { backgroundColor: theme.colors.primary }]}
        onPress={() => {}}
      >
        <Ionicons name="help-outline" size={22} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}

/* -------------------------------------------------------------------------- */
/*                               COMPONENTS                                    */
/* -------------------------------------------------------------------------- */

function InfoRow({
  icon,
  label,
  value,
}: {
  icon: any;
  label: string;
  value: string;
}) {
  const { theme } = useTheme();
  return (
    <View style={styles.infoRow}>
      <View style={styles.iconWrapper}>
        <Ionicons name={icon} size={20} color={theme.colors.primary} />
      </View>
      <View style={styles.textWrapper}>
        <AppText size={12} weight="600" color={theme.colors.primary}>
          {label}
        </AppText>
        <AppText size={14} weight="600">
          {value}
        </AppText>
      </View>
    </View>
  );
}

function TabButton({
  title,
  active,
  onPress,
}: {
  title: string;
  active: boolean;
  onPress: () => void;
}) {
  const { theme } = useTheme();
  return (
    <TouchableOpacity onPress={onPress} style={{ marginRight: 24 }}>
      <AppText
        weight="700"
        color={active ? theme.colors.primary : theme.colors.textMuted}
      >
        {title}
      </AppText>
      {active && (
        <View
          style={{
            height: 2,
            marginTop: 4,
            backgroundColor: theme.colors.primary,
          }}
        />
      )}
    </TouchableOpacity>
  );
}

function CircularProgress({
  size = 36,
  strokeWidth = 3,
  progress,
  color,
}: {
  size?: number;
  strokeWidth?: number;
  progress: number;
  color: string;
}) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (circumference * progress) / 100;

  return (
    <Svg width={size} height={size}>
      <Circle
        stroke="#E5E7EB"
        fill="none"
        cx={size / 2}
        cy={size / 2}
        r={radius}
        strokeWidth={strokeWidth}
      />
      <Circle
        stroke={color}
        fill="none"
        cx={size / 2}
        cy={size / 2}
        r={radius}
        strokeWidth={strokeWidth}
        strokeDasharray={`${circumference} ${circumference}`}
        strokeDashoffset={offset}
        strokeLinecap="round"
      />
    </Svg>
  );
}

/* -------------------------------------------------------------------------- */
/*                                   STYLES                                   */
/* -------------------------------------------------------------------------- */

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 14,
    backgroundColor: "#fff",
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  iconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F1F2FF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },
  textWrapper: {
    flexDirection: "column",
    flex: 1,
  },
  recordingRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  playButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  downloadButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  tabRow: {
    flexDirection: "row",
    marginTop: 20,
  },
  messageRow: {
    flexDirection: "row",
    marginTop: 12,
  },
  bubble: {
    maxWidth: "75%",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 16,
  },
  fab: {
    position: "absolute",
    right: 20,
    bottom: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    elevation: 6,
  },
});
