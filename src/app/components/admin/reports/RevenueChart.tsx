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

interface RevenueChartProps {
  fromDate: string;
  toDate: string;
}

interface RevenueData {
  date: string;
  revenue: number;
}

const generateRevenueData = (): RevenueData[] => {
  // Danh sách tháng từ 11/2024 đến 05/2025
  const months = [
    "2024-11",
    "2024-12",
    "2025-01",
    "2025-02",
    "2025-03",
    "2025-04",
    "2025-05",
  ];

  // Phân bổ doanh thu sao cho tổng = 24 triệu VND
  const revenues = [
    3000000, 3000000, 4000000, 2000000, 4000000, 4000000, 4000000,
  ]; // Tổng = 24 triệu

  return months.map((month, index) => ({
    date: month,
    revenue: revenues[index],
  }));
};

const RevenueChart: React.FC<RevenueChartProps> = ({ fromDate, toDate }) => {
  const [data, setData] = useState<RevenueData[]>([]);

  useEffect(() => {
    const generatedData = generateRevenueData();
    setData(generatedData);
  }, []);

  const filteredData = data.filter((entry) => {
    return entry.date >= fromDate && entry.date <= toDate;
  });

  const formatNumber = (number: number) => {
    return number.toLocaleString("vi-VN");
  };

  return (
    <div className={styles.chartContainer}>
      <h3 className={styles.chartTitle}>
        {fromDate && toDate
          ? `Doanh thu theo tháng từ ${fromDate} đến ${toDate}`
          : "Doanh thu theo tháng"}
      </h3>

      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={filteredData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis tickFormatter={formatNumber} style={{ fontSize: "0.7rem" }} />
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
          <Bar dataKey="revenue" fill="var(--main-blue)" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default RevenueChart;
