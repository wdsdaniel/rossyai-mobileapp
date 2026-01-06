import { apiClient } from "../client";
import { LoginResponse } from "../types/login";
import {
  saveToken,
  saveUser,
  saveRole,
  saveUserId,
  saveLoginResponse,
} from "../storage";
import { TEXTS } from "@/constants/texts";
import { ForgotPasswordResponse } from "../types/forgot-password";

export async function loginApi(payload: {
  email: string;
  password: string;
  portal: string;
  rememberMe: boolean;
}): Promise<LoginResponse> {
  try {
    const res = await apiClient.post("/api/login", payload);
    // if API responds but not 200
    if (res.status !== 200) {
      throw new Error(res.data?.message || TEXTS.Auth.somethingWentWrong);
    }

    const token = res.data?.accessToken;
    const user = res.data?.userData;
    const role = res.data?.role;

    if (token) {
      await saveToken(token);
    }

    if (user) await saveUser(user);
    if (role) await saveRole(role);
    if (user) await saveUserId(user.id);
    if (res.data) await saveLoginResponse(res.data);

    return res.data as LoginResponse;
  } catch (e: any) {
    // backend sent structured error
    if (e.response) {
      const msg =
        e.response.data?.message ||
        e.response.data?.error ||
        `Server error (${e.response.status})`;

      throw new Error(msg);
    }

    // network / unexpected
    throw new Error(TEXTS.Network.unableToConnect);
  }
}

export async function forgotPassword(
  email: string
): Promise<ForgotPasswordResponse> {
  const payload = {
    data: {
      email,
    },
  };
  const res = await apiClient.post<ForgotPasswordResponse>(
    "/api/users/forgot-password/",
    payload
  );
  return res.data as ForgotPasswordResponse;
}
