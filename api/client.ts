import axios from "axios";
import "./interceptors";
import { getToken } from "./storage";

export const apiClient = axios.create({
  baseURL: "https://stage.rossy.ai/", 
  timeout: 20000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

apiClient.interceptors.request.use(async (config) => {
  const token = await getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

