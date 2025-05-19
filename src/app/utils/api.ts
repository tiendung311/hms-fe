import { useAuth } from "@clerk/nextjs";
import { useCallback } from "react";

export const useFetchWithAuth = () => {
  const { getToken } = useAuth();

  return useCallback(
    async (url: string, options: RequestInit = {}) => {
      const token = await getToken({ template: "user_jwt" });
      return fetch(url, {
        ...options,
        headers: {
          ...(options.headers || {}),
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
    },
    [getToken]
  );
};
