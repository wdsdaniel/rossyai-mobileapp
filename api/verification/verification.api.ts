import { apiClient } from "../client";
import { Verification } from "../../api/types/Verification";
import { AxiosError } from "axios";

export async function verifyOTP(payload: {
  token: string;
  otp: string;
  purpose: string;
}): Promise<Verification> {
  try {
    console.log("Payload => " + JSON.stringify(payload));

    const res = await apiClient.post<Verification>("/api/otp/verify", payload);

    console.log("Verification Status Code => ", res.status);
    console.log("Verification Status Response => ", JSON.stringify(res.data));

    return res.data;   // ✅ success returns Verification
  } catch (err) {
    const error = err as AxiosError<Verification>;

    // 👇 this is the JSON your server sent on 400
    const apiError = error.response?.data;

    if (apiError) {
      console.log("Verification API Error => ", apiError);
      return apiError; // ✅ error ALSO returns Verification
    }

    // fallback if something unexpected happens
    return {
      code: "UNKNOWN_ERROR",
      error: true,
      message: "Something went wrong. Please try again. error",
    };
  }
}

export async function getOTP(payload: { email: string; purpose: string }) {
  const res = await apiClient.post("/api/otp/generate", payload);
  return res.data;
}
