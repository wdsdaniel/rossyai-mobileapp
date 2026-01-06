import React from "react";
import {
  Modal,
  View,
  TouchableOpacity,
  StyleSheet,
  Pressable,
} from "react-native";
import { useTheme } from "../../hooks/ThemeContext";
import AppText from "../../components/ui/AppText";
import { TEXTS } from "@/constants/texts";

type Props = {
  visible: boolean;

  title?: string;
  message?: string;

  showCancel?: boolean;
  showConfirm?: boolean;

  cancelText?: string;
  confirmText?: string;

  onCancel?: () => void;
  onConfirm?: () => void;

  // disable closing when needed (optional)
  disableBackdropClose?: boolean;
};

export default function CustomDialog({
  visible,
  title = TEXTS.App.rossyAI,
  message,

  showCancel = true,
  showConfirm = true,

  cancelText = TEXTS.Dialog.cancel,
  confirmText = TEXTS.Dialog.okay,

  onCancel,
  onConfirm,

  disableBackdropClose = false,
}: Props) {
  const { theme } = useTheme();

  return (
    <Modal transparent animationType="fade" visible={visible}>
      <Pressable
        style={styles.backdrop}
        onPress={() => {
          if (!disableBackdropClose && onCancel) onCancel();
        }}
      >
        <Pressable style={[styles.container, { backgroundColor: theme.colors.surface }]}>
          {title ? (
            <AppText
              size={18}
              weight="700"
              style={{ marginBottom: 6 }}
              color={theme.colors.textPrimary}
            >
              {title}
            </AppText>
          ) : null}

          {message ? (
            <AppText
              size={14}
              weight="400"
              style={{ marginBottom: 16 }}
              color={theme.colors.textMuted}
            >
              {message}
            </AppText>
          ) : null}

          <View style={styles.actions}>
            {showCancel && (
              <TouchableOpacity onPress={onCancel} style={styles.actionBtn}>
                <AppText weight="600" color={theme.colors.textPrimary}>
                  {cancelText.toUpperCase()}
                </AppText>
              </TouchableOpacity>
            )}

            {showConfirm && (
              <TouchableOpacity onPress={onConfirm} style={styles.actionBtn}>
                <AppText weight="600" color={theme.colors.primary}>
                  {confirmText.toUpperCase()}
                </AppText>
              </TouchableOpacity>
            )}
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  container: {
    width: "100%",
    borderRadius: 18,
    padding: 18,
  },
  actions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    marginTop: 4,
  },
  actionBtn: {
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginLeft: 8,
    borderRadius: 6,
  },
});
