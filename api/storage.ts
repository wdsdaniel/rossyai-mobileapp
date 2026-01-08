// src/api/storage.ts
import * as SecureStore from "expo-secure-store";
import { LoginResponse } from "./types/login";
import { STORAGE_KEYS } from "@/constants/storageKeys";

export async function saveToken(token: string) {
  await SecureStore.setItemAsync(STORAGE_KEYS.AUTH_TOKEN, token);
}

export async function getToken() {
  return SecureStore.getItemAsync(STORAGE_KEYS.AUTH_TOKEN);
}

export async function saveUser(user: any) {
  await SecureStore.setItemAsync(STORAGE_KEYS.USER, JSON.stringify(user));
}

export async function saveUserId(userId: number){
  await SecureStore.setItemAsync(STORAGE_KEYS.USER_ID, String(userId));
}

export async function saveRole(role: any){
    await SecureStore.setItemAsync(STORAGE_KEYS.ROLE, JSON.stringify(role));
}

export async function getRole(){
    const u = await SecureStore.getItemAsync(STORAGE_KEYS.ROLE);
    return u ? JSON.stringify(u) : null;
}

export async function getUser() {
  const u = await SecureStore.getItemAsync(STORAGE_KEYS.USER);
  return u ? JSON.parse(u) : null;
}

export async function getUserId() {
  const stored = await SecureStore.getItemAsync(STORAGE_KEYS.USER_ID);
  const userId = stored ? Number(stored.replace(/,/g, "")) : null;
  return userId;
}

export async function clearAuth() {
  await SecureStore.deleteItemAsync(STORAGE_KEYS.AUTH_TOKEN);
  await SecureStore.deleteItemAsync(STORAGE_KEYS.USER);
  await SecureStore.deleteItemAsync(STORAGE_KEYS.ROLE);
}

export async function saveLoginResponse(loginResponse: LoginResponse) {
  await SecureStore.setItemAsync(STORAGE_KEYS.LOGIN_RESPONSE, JSON.stringify(loginResponse));
}

export async function getLoginResponse(): Promise<LoginResponse | null> {
  try {
    const stored = await SecureStore.getItemAsync(STORAGE_KEYS.LOGIN_RESPONSE);

    if (!stored) return null;

    return JSON.parse(stored) as LoginResponse;
  } catch (e) {
    console.warn("Failed to read loginResponse:", e);
    return null;
  }
}

export async function getOrganizationId(){
  const id = await SecureStore.getItemAsync(STORAGE_KEYS.SELECTED_ORGANIZATION_ID);
  return id;
}

export async function saveOrganizationId(id: string){
  await SecureStore.setItemAsync(STORAGE_KEYS.SELECTED_ORGANIZATION_ID, id);
}

