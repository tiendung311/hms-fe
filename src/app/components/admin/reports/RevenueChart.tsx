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
  const data: RevenueData[] = [];
  const startYear = 2024;
  const endYear = 2025;

  const currentDate = new Date(startYear, 0);

  while (
    currentDate.getFullYear() <= endYear &&
    (currentDate.getFullYear() < endYear ||
      currentDate.getMonth() <= new Date().getMonth())
  ) {
    const formattedDate = `${currentDate.getFullYear()}-${String(
      currentDate.getMonth() + 1
    ).padStart(2, "0")}`;

    const revenue = Math.floor(Math.random() * 100000000) + 1000000;

    data.push({ date: formattedDate, revenue });

    currentDate.setMonth(currentDate.getMonth() + 1);
  }

  return data;
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
