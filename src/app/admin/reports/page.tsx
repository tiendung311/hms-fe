"use client";

import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHandHoldingDollar,
  faMoneyBills,
  faMoneyBillTransfer,
  faRotateLeft,
} from "@fortawesome/free-solid-svg-icons";
import styles from "./style.module.css";
import AdminSidebar from "@/app/components/AdminSidebar";
import AdminHeader from "@/app/components/AdminHeader";
import RevenueChart from "@/app/components/admin/reports/RevenueChart";

export default function Report() {
  const now = new Date();
  const currentMonth = `${now.getFullYear()}-${String(
    now.getMonth() + 1
  ).padStart(2, "0")}`;

  const [fromDate, setFromDate] = useState("2024-11");
  const [toDate, setToDate] = useState(currentMonth);

  const handleDateChange =
    (setter: (value: string) => void) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setter(event.target.value);
    };

  const handleReset = () => {
    setFromDate("2024-11");
    setToDate(currentMonth);
  };

  return (
    <div className={styles.dashboardContainer}>
      <AdminSidebar />
      <div className={styles.mainContent}>
        <AdminHeader />
        <div className={styles.content}>
          <h2 className={styles.title}>Báo cáo tài chính</h2>

          <div className={styles.filterContainer}>
            <label>
              Từ:{" "}
              <input
                type="month"
                value={fromDate}
                min={fromDate}
                max={toDate}
                onChange={handleDateChange(setFromDate)}
              />
            </label>
            <label>
              Đến:{" "}
              <input
                type="month"
                value={toDate}
                min={fromDate}
                max={toDate}
                onChange={handleDateChange(setToDate)}
              />
            </label>
            <button className={styles.resetButton} onClick={handleReset}>
              <FontAwesomeIcon
                icon={faRotateLeft}
                style={{ marginRight: 10 }}
              />
              Làm mới
            </button>
          </div>

          <div className={styles.stats}>
            <div
              className={styles.statCard}
              style={{ backgroundColor: "var(--main-blue)" }}
            >
              <p className={styles.cardLabel}>Thu nhập</p>
              <FontAwesomeIcon
                className={styles.icon}
                icon={faHandHoldingDollar}
              />
              <h3>24.000.000₫</h3>
            </div>
            <div
              className={styles.statCard}
              style={{ backgroundColor: "var(--main-yellow)" }}
            >
              <p className={styles.cardLabel}>Hoàn tiền</p>
              <FontAwesomeIcon
                className={styles.icon}
                icon={faMoneyBillTransfer}
              />
              <h3>4.000.000₫</h3>
            </div>
            <div
              className={styles.statCard}
              style={{ backgroundColor: "var(--main-green)" }}
            >
              <p className={styles.cardLabel}>Tổng doanh thu</p>
              <FontAwesomeIcon className={styles.icon} icon={faMoneyBills} />
              <h3>20.000.000₫</h3>
            </div>
          </div>

          <RevenueChart fromDate={fromDate} toDate={toDate} />
        </div>
      </div>
    </div>
  );
}
