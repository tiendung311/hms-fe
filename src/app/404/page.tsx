"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function NotFound() {
  const router = useRouter();

  useEffect(() => {
    const timeout = setTimeout(() => {
      router.push("/"); // Quay lại trang chủ
    }, 3000); // 5 giây

    return () => clearTimeout(timeout);
  }, [router]);

  return (
    <div style={{ textAlign: "center", paddingTop: "100px" }}>
      <h1>🚫 Trang không tồn tại hoặc bạn không có quyền truy cập</h1>
      <p>Bạn sẽ được quay lại trang chủ trong vài giây...</p>
    </div>
  );
}
