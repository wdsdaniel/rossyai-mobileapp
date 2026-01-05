import {
  View,
  ScrollView,
  Dimensions,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useState, useEffect } from "react";
import Header from "../Header";
import { useTheme } from "@/hooks/ThemeContext";
import { Picker } from "@react-native-picker/picker";
import AppText from "../../../components/ui/AppText";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { LineChart } from "react-native-chart-kit";
import { Organization } from "@/api/types/Organization";
import { getOrganization } from "../../../api/organization/organizations.api";
import { getUserId } from "@/api/storage";
import { checkConnection } from "@/utils/network";
const screenWidth = Dimensions.get("window").width;

export default function DashboardHome() {
  const { theme } = useTheme();

  // agent dropdown
  const [agent, setAgent] = useState("Customer Support Assistance");

  // date picker
  const [showPicker, setShowPicker] = useState(false);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [step, setStep] = useState<"start" | "end">("start");
  const [organization, setOrganization] = useState<Organization | null>(null);
  const formattedRange =
    startDate && endDate
      ? `${startDate.toLocaleDateString()} — ${endDate.toLocaleDateString()}`
      : "Select date range";

  const [organizationList, setOrganizationList] = useState<Organization[]>([]);

  useEffect(() => {
    async function load() {
      const net = await checkConnection();

      if (!net.isConnected) {
        Alert.alert("No connection", "Please connect to Wi-Fi or mobile data.");
        return;
      }

      if (!net.isInternetReachable) {
        Alert.alert("No internet", "Please check your network connection.");
        return;
      }

      const userId = await getUserId();
      if (!userId) return;

      const orgs = await getOrganization(Number(userId));
      setOrganizationList(orgs);
    }

    load();
  }, []);

  const chartConfig = {
    backgroundGradientFrom: "#ffffff",
    backgroundGradientTo: "#ffffff",
    color: () => "#7367F0",
    fillShadowGradient: "#7367F0",
    fillShadowGradientOpacity: 0.25,
    decimalPlaces: 0,
  };

  console.log("Organization in Content => ", organization);
  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <Header
        title="Dashboard"
        organizationList={organizationList}
        onSelectOrganization={(org) => setOrganization(org)}
      />

      <ScrollView
        contentContainerStyle={{
          padding: 14,
          paddingBottom: 30,
        }}
      >
        {/* ---------------- FILTER CARD ---------------- */}
        <View
          style={{
            backgroundColor: "#fff",
            borderRadius: 12,
            padding: 14,
            elevation: 2,
          }}
        >
          {/* Agent */}
          <AppText weight="600" size={12} style={{ marginBottom: 6 }}>
            Select Agent
          </AppText>

          <View
            style={{
              borderWidth: 1,
              borderColor: "#ddd",
              borderRadius: 8,
              marginBottom: 12,
            }}
          >
            <Picker selectedValue={agent} onValueChange={setAgent}>
              <Picker.Item
                label="Customer Support Assistance"
                value="Customer Support Assistance"
              />
              <Picker.Item label="Sales Agent" value="Sales Agent" />
            </Picker>
          </View>

          {/* Date range */}
          <AppText weight="600" size={12} style={{ marginBottom: 6 }}>
            Date Range
          </AppText>

          <TouchableOpacity
            onPress={() => {
              setStep("start");
              setShowPicker(true);
            }}
            style={{
              borderWidth: 1,
              borderColor: "#ddd",
              borderRadius: 8,
              padding: 10,
            }}
          >
            <AppText>
              {startDate && endDate
                ? `${startDate.toLocaleDateString()} — ${endDate.toLocaleDateString()}`
                : "Select date range"}
            </AppText>
          </TouchableOpacity>
        </View>

        {/* ---------------- CHART CARDS ---------------- */}
        {[
          { title: "Total Minutes", data: [0, 4, 8, 12, 15] },
          { title: "Number of Calls", data: [0, 1, 2, 3, 4] },
          { title: "Average Call Duration", data: [1, 1.5, 2.2, 3.1, 3.8] },
        ].map((item, index) => (
          <View
            key={index}
            style={{
              backgroundColor: "#fff",
              borderRadius: 14,
              marginTop: 16,
              paddingVertical: 12,
            }}
          >
            <LineChart
              data={{
                labels: ["Dec 01", "", "", "", "Dec 26"],
                datasets: [{ data: item.data }],
              }}
              width={screenWidth - 28}
              height={180}
              withDots={false}
              bezier
              chartConfig={chartConfig}
              style={{ borderRadius: 14 }}
            />

            <AppText
              style={{
                textAlign: "center",
                marginBottom: 10,
                marginTop: -6,
              }}
            >
              {item.title}
            </AppText>
          </View>
        ))}
      </ScrollView>

      {/* ---------------- DATE PICKER MODAL ---------------- */}
      <DateTimePickerModal
        isVisible={showPicker}
        mode="date"
        onConfirm={(date) => {
          if (step === "start") {
            setStartDate(date);
            setEndDate(null);
            setStep("end");

            // CLOSE first…
            setShowPicker(false);

            // …then reopen after a short delay
            setTimeout(() => setShowPicker(true), 250);
          } else {
            setEndDate(date);
            setShowPicker(false);
            setStep("start");
          }
        }}
        onCancel={() => {
          setShowPicker(false);
          setStep("start");
        }}
      />
    </View>
  );
}
