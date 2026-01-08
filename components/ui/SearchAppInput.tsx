import React, { forwardRef, useState } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import type { KeyboardTypeOptions } from "react-native";
import { useTheme } from "../../hooks/ThemeContext";
import { Fonts } from "@/constants/theme"; // adjust path if needed

type Props = {
  placeholder: string;
  value: string;
  onChangeText: (t: string) => void;

  secureTextEntry?: boolean;
  returnKeyType?: "next" | "done" | "go" | "send";
  onSubmitEditing?: () => void;

  maxLength?: number;
  numericOnly?: boolean;
  keyboardType?: KeyboardTypeOptions;

  /** layout control */
  style?: any;
  containerStyle?: any;
};

const AppInput = forwardRef<TextInput, Props>(
  (
    {
      placeholder,
      value,
      onChangeText,
      secureTextEntry,
      returnKeyType = "done",
      onSubmitEditing,
      maxLength,
      numericOnly = false,
      keyboardType,
      style,
      containerStyle,
    },
    ref
  ) => {
    const { theme } = useTheme();
    const { colors } = theme;
    const [hidden, setHidden] = useState(!!secureTextEntry);

    const handleChange = (text: string) => {
      let out = text;

      if (numericOnly) {
        out = out.replace(/[^0-9]/g, "");
      }

      if (maxLength && out.length > maxLength) {
        out = out.slice(0, maxLength);
      }

      onChangeText(out);
    };

    return (
      <View style={[styles.container, containerStyle]}>
        <TextInput
          ref={ref}
          value={value}
          placeholder={placeholder}
          placeholderTextColor={colors.textMuted}
          secureTextEntry={hidden}
          onChangeText={handleChange}
          returnKeyType={returnKeyType}
          onSubmitEditing={onSubmitEditing}
          keyboardType={keyboardType ?? "default"}
          maxLength={maxLength}
          style={[
            styles.input,
            {
              color: colors.textPrimary,
              fontFamily: Fonts.regular,
            },
            style,
          ]}
        />

        {secureTextEntry && (
          <TouchableOpacity
            onPress={() => setHidden((p) => !p)}
            style={styles.eye}
            hitSlop={10}
          >
            <Ionicons
              name={hidden ? "eye-off" : "eye"}
              size={20}
              color={colors.textMuted}
            />
          </TouchableOpacity>
        )}
      </View>
    );
  }
);

AppInput.displayName = "AppInput";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: "relative",
  },
  input: {
    flex: 1,
    fontSize: 14,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: "transparent",
  },
  eye: {
    position: "absolute",
    right: 8,
    top: 8,
  },
});

export default AppInput;
