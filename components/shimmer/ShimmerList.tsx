import React from "react";
import { View } from "react-native";
import Shimmer from "./Shimmer";

export default function ShimmerList({ rows = 6 }: { rows?: number }) {
  return (
    <>
      {Array.from({ length: rows }).map((_, i) => (
        <View
          key={i}
          style={{
            flexDirection: "row",
            alignItems: "center",
            paddingVertical: 12,
            paddingHorizontal: 6,
          }}
        >
          <Shimmer width={20} height={20} radius={10} />

          <View style={{ marginLeft: 10, flex: 1 }}>
            <Shimmer width="60%" height={14} radius={6} />
            <View style={{ height: 6 }} />
            <Shimmer width="40%" height={10} radius={6} />
          </View>
        </View>
      ))}
    </>
  );
}
