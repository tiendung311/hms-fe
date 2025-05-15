"use client";

import { useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import styles from "./style.module.css";

export default function PaymentSuccessPage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!isLoaded) return;

    const role = user?.publicMetadata?.role;

    if (role === "admin") {
      const timer = setTimeout(() => {
        router.push("/admin/transactions");
      }, 3000); // chuyển hướng sau 3 giây

      return () => clearTimeout(timer); // dọn dẹp timer khi component unmount
    }
  }, [user, isLoaded, router]);

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>🎉 Thanh toán thành công!</h1>
        <p className={styles.message}>Cảm ơn bạn đã sử dụng dịch vụ.</p>
        <p className={styles.redirect}>
          Bạn sẽ được chuyển hướng về trang chủ sau vài giây...
        </p>
      </div>
    </div>
  );
}
