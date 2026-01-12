import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import CallLogsScreen from ".";
import CallDetailsScreen from "./CallDetailsScreen"
import { CallLog } from "@/api/types/Calllogs";

export type CallLogsStackParamList = {
  CallLogsList: undefined;
  CallDetails: {
    callLog: CallLog;
  };
};


const Stack = createNativeStackNavigator<CallLogsStackParamList>();

export default function CallLogsStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="CallLogsList"
        component={CallLogsScreen}
      />
      <Stack.Screen
        name="CallDetails"
        component={CallDetailsScreen}
      />
    </Stack.Navigator>
  );
}
