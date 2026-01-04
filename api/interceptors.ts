// // src/api/interceptors.ts
// import { apiClient } from "./client";
// import { getToken, clearAuth } from "./storage";

// apiClient.interceptors.request.use(async (config) => {
//   const token = await getToken();
//   if (token) config.headers.Authorization = `Bearer ${token}`;
//   return config;
// });

// apiClient.interceptors.response.use(
//   (res) => res,
//   async (error) => {
//     if (error?.response?.status === 401) {
//       await clearAuth();
//     }
//     return Promise.reject(error);
//   }
// );
