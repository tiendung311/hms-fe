"use client";

import { useState, useEffect } from "react";
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
import RequireAdmin from "@/app/components/RequireAdmin";

export default function Report() {
  console.log("Report component mounted");
  const [fromDate, setFromDate] = useState<string>("");
  const [toDate, setToDate] = useState<string>("");
  const [defaultRange, setDefaultRange] = useState<{
    fromDate: string;
    toDate: string;
  }>({
    fromDate: "",
    toDate: "",
  });

  const [totalIncome, setTotalIncome] = useState<number | null>(null);
  const [totalRefund, setTotalRefund] = useState<number | null>(null);
  const [netRevenue, setNetRevenue] = useState<number | null>(null);

  function parseAmount(amount: string): number {
    if (!amount) return 0;
    if (typeof amount === "number") return amount;
    return Number(amount);
  }

  async function safeJson(res: Response) {
    const text = await res.text();
    if (!text) return null;
    try {
      return JSON.parse(text);
    } catch {
      return null;
    }
  }

  function convertToFirstDay(month: string): string {
    return `${month}-01`;
  }

  function convertToLastDay(month: string): string {
    const [year, m] = month.split("-").map(Number);
    const lastDay = new Date(year, m, 0).getDate();
    return `${year}-${String(m).padStart(2, "0")}-${lastDay}`;
  }

  const urlWithParams = (baseUrl: string, from: string, to: string) =>
    `${baseUrl}?from=${convertToFirstDay(from)}&to=${convertToLastDay(to)}`;

  async function fetchFinanceData(from: string, to: string) {
    const baseUrl = "http://localhost:8080/api/payments";

    const [incomeRes, refundRes, netRes] = await Promise.all([
      fetch(urlWithParams(`${baseUrl}/total-income`, from, to)),
      fetch(urlWithParams(`${baseUrl}/total-refund`, from, to)),
      fetch(urlWithParams(`${baseUrl}/net-revenue`, from, to)),
    ]);

    const income = await safeJson(incomeRes);
    const refund = await safeJson(refundRes);
    const net = await safeJson(netRes);

    console.log("income:", income);
    console.log("refund:", refund);
    console.log("net:", net);

    setTotalIncome(parseAmount(income));
    setTotalRefund(parseAmount(refund));
    setNetRevenue(parseAmount(net));
  }

  async function fetchDateRangeFromServer() {
    const res = await fetch("http://localhost:8080/api/payments/date-range");
    const data = await safeJson(res);
    console.log("Date range response:", data);

    if (data?.fromDate && data?.toDate) {
      const from = data.fromDate.substring(0, 7);
      const to = data.toDate.substring(0, 7);
      setFromDate(from);
      setToDate(to);
      setDefaultRange({ fromDate: from, toDate: to });
    }
  }

  useEffect(() => {
    fetchDateRangeFromServer();
  }, []);

  useEffect(() => {
    if (fromDate && toDate) {
      fetchFinanceData(fromDate, toDate);
    }
  }, [fromDate, toDate]);

  const handleDateChange =
    (setter: (value: string) => void) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setter(event.target.value);
    };

  const handleReset = () => {
    setFromDate(defaultRange.fromDate);
    setToDate(defaultRange.toDate);
  };

  function formatVND(amount: number | null) {
    if (amount === null) return "...";
    return amount.toLocaleString("vi-VN") + "₫";
  }

  return (
    <RequireAdmin>
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
                  min={defaultRange.fromDate}
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
                  max={defaultRange.toDate}
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
                <h3>{formatVND(totalIncome)}</h3>
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
                <h3>{formatVND(totalRefund)}</h3>
              </div>
              <div
                className={styles.statCard}
                style={{ backgroundColor: "var(--main-green)" }}
              >
                <p className={styles.cardLabel}>Tổng doanh thu</p>
                <FontAwesomeIcon className={styles.icon} icon={faMoneyBills} />
                <h3>{formatVND(netRevenue)}</h3>
              </div>
            </div>

            <RevenueChart fromDate={fromDate} toDate={toDate} />
          </div>
        </div>
      </div>
    </RequireAdmin>
  );
}
