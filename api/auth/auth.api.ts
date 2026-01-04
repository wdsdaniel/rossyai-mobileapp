import { apiClient } from "../client";
import { saveToken, saveUser, saveRole, saveUserId, getToken } from "../storage";

export async function loginApi(payload: {
  email: string;
  password: string;
  portal: string;
  rememberMe: boolean;
}) {
  try {
    const res = await apiClient.post("/api/login", payload);
    // if API responds but not 200
    if (res.status !== 200) {
      throw new Error(res.data?.message || "Something went wrong");
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

    return res.data;
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
    throw new Error("Unable to connect. Please try again.");
  }
}
