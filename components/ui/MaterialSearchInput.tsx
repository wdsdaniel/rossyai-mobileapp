import React, { useState, useRef, useEffect } from "react";
import {
  View,
  TextInput,
  Animated,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import AppText from "@/components/ui/AppText";
import { useTheme } from "@/hooks/ThemeContext";

type Props = {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  onClear?: () => void;
};

export default function MaterialSearchInput({
  label,
  value,
  onChangeText,
  onClear,
}: Props) {
  const { theme } = useTheme();
  const [focused, setFocused] = useState(false);

  const animatedLabel = useRef(new Animated.Value(value ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(animatedLabel, {
      toValue: focused || value ? 1 : 0,
      duration: 180,
      useNativeDriver: false,
    }).start();
  }, [focused, value]);

  const labelStyle = {
    position: "absolute" as const,
    left: 0,
    top: animatedLabel.interpolate({
      inputRange: [0, 1],
      outputRange: [18, -2],
    }),
    fontSize: animatedLabel.interpolate({
      inputRange: [0, 1],
      outputRange: [16, 12],
    }),
    color: focused
      ? theme.colors.primary
      : theme.colors.textMuted,
  };

  return (
    <View style={{ flex: 1, paddingTop: 12 }}>
      {/* Floating label */}
      <Animated.Text style={labelStyle}>
        {label}
      </Animated.Text>

      {/* Input row */}
      <View style={styles.row}>
        <TextInput
          value={value}
          onChangeText={onChangeText}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={[
            styles.input,
            { color: theme.colors.textPrimary },
          ]}
          cursorColor={theme.colors.primary}
        />

        {!!value && (
          <TouchableOpacity onPress={onClear}>
            <Ionicons
              name="close"
              size={18}
              color={theme.colors.textMuted}
            />
          </TouchableOpacity>
        )}
      </View>

      {/* Underline */}
      <View
        style={[
          styles.underline,
          {
            backgroundColor: focused
              ? theme.colors.primary
              : theme.colors.border,
            height: focused ? 2 : 1,
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    height: 36,
  },
  input: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 4,
    paddingRight: 8,
  },
  underline: {
    width: "100%",
    marginTop: 6,
  },
});
