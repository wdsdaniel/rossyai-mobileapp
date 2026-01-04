import { View, TextInput, TouchableOpacity } from "react-native";
import { useTheme } from "../../hooks/ThemeContext";
import AppText from "./AppText";
import { useState, forwardRef } from "react";

type Props = {
  placeholder: string;
  secureTextEntry?: boolean;
  value: string;
  onChangeText: (t: string) => void;
  returnKeyType?: "next" | "done" | "go" | "send";
  onSubmitEditing?: () => void;
};

const AppInput = forwardRef<TextInput, Props>(
  (
    {
      placeholder,
      secureTextEntry,
      value,
      onChangeText,
      returnKeyType = "done",
      onSubmitEditing,
    },
    ref
  ) => {
    const { theme } = useTheme();
    const [hidden, setHidden] = useState(secureTextEntry);

    return (
      <View style={{ width: "100%", marginVertical: 8, position: "relative" }}>
        <TextInput
          ref={ref}
          placeholder={placeholder}
          value={value}
          secureTextEntry={hidden}
          onChangeText={onChangeText}
          returnKeyType={returnKeyType}
          onSubmitEditing={onSubmitEditing}
          placeholderTextColor={theme.colors.textMuted}
          style={{
            borderWidth: 1,
            borderColor: theme.colors.border,
            borderRadius: 10,
            paddingHorizontal: 14,
            paddingVertical: 12,
            color: theme.colors.textPrimary,
            backgroundColor: theme.colors.surface,
            paddingRight: secureTextEntry ? 40 : 14,
          }}
        />

        {secureTextEntry && (
          <TouchableOpacity
            onPress={() => setHidden((p) => !p)}
            style={{ position: "absolute", right: 10, top: 14 }}
          >
            <AppText size={12} color={theme.colors.textMuted}>
              {hidden ? "👁️" : "🙈"}
            </AppText>
          </TouchableOpacity>
        )}
      </View>
    );
  }
);

AppInput.displayName = "AppInput";

export default AppInput;

