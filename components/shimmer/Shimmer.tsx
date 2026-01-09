import React, { useEffect, useRef } from "react";
import { Animated, View, StyleSheet } from "react-native";

interface ShimmerProps {
  width?: number | string;
  height?: number;
  radius?: number;
  style?: any;
}

export default function Shimmer({
  width = "100%",
  height = 12,
  radius = 6,
  style,
}: ShimmerProps) {
  const shimmerAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(shimmerAnim, {
        toValue: 1,
        duration: 1200,
        useNativeDriver: true,
      })
    ).start();
  }, []);

  const translateX = shimmerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-150, 150],
  });

  return (
    <View
      style={[
        styles.container,
        { height, borderRadius: radius, width },
        style,
      ]}
    >
      <Animated.View
        style={[
          styles.shimmer,
          {
            transform: [{ translateX }],
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#E5E7EB",
    overflow: "hidden",
  },
  shimmer: {
    position: "absolute",
    width: "40%",
    height: "100%",
    backgroundColor: "#F3F4F6",
    opacity: 0.7,
  },
});
