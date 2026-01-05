// src/api/storage.ts
import * as SecureStore from "expo-secure-store";
import { LoginResponse } from "./types/login";

export async function saveToken(token: string) {
  await SecureStore.setItemAsync("accessToken", token);
}

export async function getToken() {
  return SecureStore.getItemAsync("accessToken");
}

export async function saveUser(user: any) {
  await SecureStore.setItemAsync("user", JSON.stringify(user));
}

export async function saveUserId(userId: number){
  await SecureStore.setItemAsync("userId", String(userId));
}

export async function saveRole(role: any){
    await SecureStore.setItemAsync("role", JSON.stringify(role));
}

export async function getRole(){
    const u = await SecureStore.getItemAsync("role");
    return u ? JSON.stringify(u) : null;
}

export async function getUser() {
  const u = await SecureStore.getItemAsync("user");
  return u ? JSON.parse(u) : null;
}

export async function getUserId() {
  const stored = await SecureStore.getItemAsync("userId");
  const userId = stored ? Number(stored.replace(/,/g, "")) : null;
  return userId;
}

export async function clearAuth() {
  await SecureStore.deleteItemAsync("accessToken");
  await SecureStore.deleteItemAsync("user");
  await SecureStore.deleteItemAsync("role");
}

export async function saveLoginResponse(loginResponse: LoginResponse) {
  await SecureStore.setItemAsync("loginResponse", JSON.stringify(loginResponse));
}

export async function getLoginResponse(): Promise<LoginResponse | null> {
  try {
    const stored = await SecureStore.getItemAsync("loginResponse");

    if (!stored) return null;

    return JSON.parse(stored) as LoginResponse;
  } catch (e) {
    console.warn("Failed to read loginResponse:", e);
    return null;
  }
}


