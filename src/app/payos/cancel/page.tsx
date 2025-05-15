"use client";

import { useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import styles from "./style.module.css";

export default function PaymentCancelPage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!isLoaded) return;

    const role = user?.publicMetadata?.role;

    if (role === "admin") {
      const timer = setTimeout(() => {
        router.push("/admin/transactions");
      }, 3000); // chuyển hướng sau 3 giây

      return () => clearTimeout(timer); // cleanup khi component unmount
    }
  }, [user, isLoaded, router]);

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>❌ Thanh toán đã bị hủy!</h1>
        <p className={styles.message}>
          Đã xảy ra lỗi hoặc bạn đã hủy giao dịch.
        </p>
        <p className={styles.redirect}>
          Bạn sẽ được chuyển hướng về trang chủ sau vài giây...
        </p>
      </div>
    </div>
  );
}
