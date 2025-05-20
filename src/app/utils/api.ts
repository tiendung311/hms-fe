import { useAuth } from "@clerk/nextjs";
import { useCallback } from "react";

export const useFetchWithAuth = () => {
  const { getToken, isLoaded, userId } = useAuth();

  return useCallback(
    async (url: string, options: RequestInit = {}) => {
      // if (!isLoaded) {
      //   throw new Error("Clerk is not loaded yet");
      // }

      // if (!userId) {
      //   throw new Error("User is not signed in");
      // }
      if (!isLoaded) {
        // Clerk chưa load xong, chưa xác định user, đợi hoặc reject nhẹ
        // Không throw error, chờ load xong
        return Promise.reject(new Error("Clerk is not loaded yet"));
      }

      if (!userId) {
        // Clerk đã load xong nhưng user chưa đăng nhập -> chắc chắn lỗi
        return Promise.reject(new Error("User is not signed in"));
      }

      let token = await getToken({ template: "user_jwt" });
      if (!token) {
        console.warn("JWT not ready, retrying...");
        await new Promise((r) => setTimeout(r, 500));
        token = await getToken({ template: "user_jwt" });
        if (!token) {
          throw new Error("JWT token is not available after retry");
        }
      }

      return fetch(url, {
        ...options,
        headers: {
          ...(options.headers || {}),
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
    },
    [getToken, isLoaded, userId]
  );
};
