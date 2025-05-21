"use client";

import React, { useEffect, useState } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from "recharts";
import styles from "./RevenueChart.module.css";
import RequireAdmin from "../../RequireAdmin";

interface RevenueChartProps {
  fromDate: string;
  toDate: string;
}

interface RevenueData {
  month: string;
  netRevenue: number;
}

const RevenueChart: React.FC<RevenueChartProps> = ({ fromDate, toDate }) => {
  const [data, setData] = useState<RevenueData[]>([]);

  useEffect(() => {
    async function fetchMonthlyRevenue() {
      try {
        if (!fromDate || !toDate) return;

        const res = await fetch(
          `http://localhost:8080/api/payments/monthly-net-revenue?from=${fromDate}&to=${toDate}`
        );
        const result = await res.json();

        if (Array.isArray(result)) {
          setData(result);
        } else {
          console.warn("Unexpected API response:", result);
          setData([]);
        }
      } catch (error) {
        console.error("Failed to fetch monthly revenue:", error);
        setData([]);
      }
    }

    fetchMonthlyRevenue();
  }, [fromDate, toDate]);

  const formatNumber = (number: number) => {
    return number.toLocaleString("vi-VN");
  };

  return (
    <RequireAdmin>
      <div className={styles.chartContainer}>
        <h3 className={styles.chartTitle}>
          {fromDate && toDate
            ? `Doanh thu theo tháng từ ${fromDate} đến ${toDate}`
            : "Doanh thu theo tháng"}
        </h3>

        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis
              tickFormatter={formatNumber}
              style={{ fontSize: "0.7rem" }}
            />
            <Tooltip formatter={(value: number) => formatNumber(value)} />
            <Legend
              payload={[
                {
                  value: "Doanh thu (VND)",
                  type: "square",
                  color: "var(--main-blue)",
                },
              ]}
            />
            <Bar dataKey="netRevenue" fill="var(--main-blue)" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </RequireAdmin>
  );
};

export default RevenueChart;
