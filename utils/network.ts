import NetInfo from "@react-native-community/netinfo";

export async function checkConnection() {
  const state = await NetInfo.fetch();

  return {
    isConnected: !!state.isConnected,
    isInternetReachable: state.isInternetReachable === true,
    type: state.type, // wifi, cellular, none, unknown
  };
}
