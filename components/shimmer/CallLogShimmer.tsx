import React from "react";
import { View } from "react-native";
import ShimmerPlaceholder from "react-native-shimmer-placeholder";
import { LinearGradient } from "expo-linear-gradient";

export default function CallLogShimmer() {
  return (
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
      {/* TOP CONTENT */}
      <View style={{ padding: 14 }}>
        <ShimmerPlaceholder
          LinearGradient={LinearGradient}
          style={{ height: 16, width: "45%", borderRadius: 4 }}
        />

        <ShimmerPlaceholder
          LinearGradient={LinearGradient}
          style={{ height: 12, width: "80%", borderRadius: 4, marginTop: 10 }}
        />

        <ShimmerPlaceholder
          LinearGradient={LinearGradient}
          style={{ height: 12, width: "70%", borderRadius: 4, marginTop: 8 }}
        />

        <ShimmerPlaceholder
          LinearGradient={LinearGradient}
          style={{ height: 12, width: "60%", borderRadius: 4, marginTop: 8 }}
        />

        <ShimmerPlaceholder
          LinearGradient={LinearGradient}
          style={{ height: 12, width: "65%", borderRadius: 4, marginTop: 8 }}
        />
      </View>

      {/* BOTTOM STRIP */}
      <View
        style={{
          borderTopWidth: 1,
          borderTopColor: "#E9E9E9",
          backgroundColor: "#F8F9FC",
          paddingHorizontal: 14,
          paddingVertical: 10,
        }}
      >
        <ShimmerPlaceholder
          LinearGradient={LinearGradient}
          style={{ height: 10, width: "50%", borderRadius: 4 }}
        />
      </View>
    </View>
  );
}
