"use client";

import AdminHeader from "@/app/components/AdminHeader";
import AdminSidebar from "@/app/components/AdminSidebar";
import styles from "./style.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBuildingColumns,
  faCreditCard,
  faEye,
  faMoneyBillWave,
  faPen,
  faRotateLeft,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import AdminPagination from "../AdminPagination";

interface Transaction {
  id: number;
  customer: string;
  room: string;
  time: string;
  paymentMethod: string;
  status: string;
  amount: string;
}

const PAYMENT_METHODS = ["Thẻ tín dụng", "Chuyển khoản", "Tiền mặt"];
const STATUSES = ["Chờ", "Thành công", "Thất bại", "Hoàn tiền"];
const PAGE_SIZE = 10;

export default function TransactionManage() {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState<string>("");
  const [paymentFilter, setPaymentFilter] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [transactions] = useState<Transaction[]>(
    Array.from({ length: 25 }, (_, i) => ({
      id: i + 1,
      customer: `Khách hàng ${i + 1}`,
      room: `${100 + (i % 10)}`,
      time: `${String(8 + (i % 12)).padStart(2, "0")}:${String(i % 60).padStart(
        2,
        "0"
      )} ${String((i % 30) + 1).padStart(2, "0")}/04/2025`,
      paymentMethod: PAYMENT_METHODS[i % PAYMENT_METHODS.length],
      status: STATUSES[i % STATUSES.length],
      amount: `${(Math.floor(Math.random() * 5000000) + 1000000).toLocaleString(
        "vi-VN"
      )}₫`,
    }))
  );
  const [currentPage, setCurrentPage] = useState<number>(1);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 300);

    return () => {
      clearTimeout(handler);
    };
  }, [searchQuery]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const handleFilterChange = (
    event: React.ChangeEvent<HTMLSelectElement>,
    type: "payment" | "status"
  ) => {
    if (type === "payment") {
      setPaymentFilter(event.target.value);
    } else {
      setStatusFilter(event.target.value);
    }
  };

  const filteredTransactions = transactions.filter(
    (transaction) =>
      transaction.customer
        .toLowerCase()
        .includes(debouncedSearchQuery.toLowerCase()) &&
      (paymentFilter === "" || transaction.paymentMethod === paymentFilter) &&
      (statusFilter === "" || transaction.status === statusFilter)
  );

  const handleReset = () => {
    setSearchQuery("");
    setPaymentFilter("");
    setStatusFilter("");
    setCurrentPage(1);
  };

  const totalPages = Math.ceil(filteredTransactions.length / PAGE_SIZE);
  const currentTransactions = filteredTransactions.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "Chờ":
        return { backgroundColor: "var(--main-blue)", color: "white" };
      case "Thành công":
        return { backgroundColor: "var(--main-green)", color: "white" };
      case "Thất bại":
        return { backgroundColor: "var(--main-red)", color: "white" };
      case "Hoàn tiền":
        return { backgroundColor: "orange", color: "white" };
      default:
        return {};
    }
  };

  const getPaymentIcon = (method: string) => {
    switch (method) {
      case "Thẻ tín dụng":
        return (
          <FontAwesomeIcon
            icon={faCreditCard}
            style={{ marginRight: 5, color: "orange" }}
          />
        );
      case "Chuyển khoản":
        return (
          <FontAwesomeIcon
            icon={faBuildingColumns}
            style={{ marginRight: 5, color: "var(--main-blue)" }}
          />
        );
      case "Tiền mặt":
        return (
          <FontAwesomeIcon
            icon={faMoneyBillWave}
            style={{ marginRight: 5, color: "var(--main-green)" }}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className={styles.dashboardContainer}>
      <AdminSidebar />
      <div className={styles.mainContent}>
        <AdminHeader />
        <div className={styles.content}>
          <h2 className={styles.title}>Quản lý giao dịch</h2>

          <div className={styles.filterContainer}>
            <input
              type="text"
              className={styles.searchInput}
              placeholder="Tìm kiếm..."
              value={searchQuery}
              onChange={handleSearchChange}
            />

            <select
              className={styles.filterSelect}
              value={paymentFilter}
              onChange={(e) => handleFilterChange(e, "payment")}
            >
              <option value="">Phương thức thanh toán</option>
              {PAYMENT_METHODS.map((method, index) => (
                <option key={index} value={method}>
                  {method}
                </option>
              ))}
            </select>

            <select
              className={styles.filterSelect}
              value={statusFilter}
              onChange={(e) => handleFilterChange(e, "status")}
            >
              <option value="">Trạng thái</option>
              {STATUSES.map((status, index) => (
                <option key={index} value={status}>
                  {status}
                </option>
              ))}
            </select>

            <button className={styles.resetButton} onClick={handleReset}>
              <FontAwesomeIcon
                icon={faRotateLeft}
                style={{ marginRight: 10 }}
              />
              Làm mới
            </button>
          </div>

          <div className={styles.tableContainer}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>STT</th>
                  <th>Khách hàng</th>
                  <th>Phòng</th>
                  <th>Thời gian</th>
                  <th>Phương thức</th>
                  <th>Trạng thái</th>
                  <th>Số tiền</th>
                  <th>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {currentTransactions.map((transaction, index) => (
                  <tr key={transaction.id}>
                    <td>{(currentPage - 1) * PAGE_SIZE + index + 1}</td>
                    <td>{transaction.customer}</td>
                    <td>{transaction.room}</td>
                    <td>{transaction.time}</td>
                    <td>
                      {getPaymentIcon(transaction.paymentMethod)}{" "}
                      {transaction.paymentMethod}
                    </td>
                    <td>
                      <span
                        style={{
                          ...getStatusStyle(transaction.status),
                          padding: "5px 8px",
                          borderRadius: "5px",
                        }}
                      >
                        {transaction.status}
                      </span>
                    </td>
                    <td>{transaction.amount}</td>
                    <td className={styles.actions}>
                      <FontAwesomeIcon
                        icon={faEye}
                        className={`${styles.icon} ${styles.view}`}
                      />
                      <FontAwesomeIcon
                        icon={faPen}
                        className={`${styles.icon} ${styles.edit}`}
                      />
                      <FontAwesomeIcon
                        icon={faTrash}
                        className={`${styles.icon} ${styles.delete}`}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <AdminPagination
            totalPages={totalPages}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>
    </div>
  );
}
