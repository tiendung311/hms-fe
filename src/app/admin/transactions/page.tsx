"use client";

import AdminHeader from "@/app/components/AdminHeader";
import AdminSidebar from "@/app/components/AdminSidebar";
import styles from "./style.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBuildingColumns,
  faMoneyBillWave,
  faPen,
  faRotateLeft,
} from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import AdminPagination from "../AdminPagination";
import { toast } from "react-toastify";
import TransactionEditModal from "@/app/components/admin/transactions/TransactionEditModal";
import { useFetchWithAuth } from "@/app/utils/api";

interface Transaction {
  transactionId: number;
  fullName: string;
  roomNumber: string;
  paymentDate: string;
  paymentMethod: string;
  paymentStatus: string;
  amount: string;
}

interface TransactionDetail {
  transactionId: number;
  fullName: string;
  roomNumber: string;
  paymentDate: string;
  paymentMethod: string;
  paymentStatus: string;
  amount: number;
}

const PAGE_SIZE = 10;

export default function TransactionManage() {
  const fetchWithAuth = useFetchWithAuth();

  const [searchQuery, setSearchQuery] = useState<string>("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState<string>("");
  const [paymentFilter, setPaymentFilter] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  const fetchTransactions = async () => {
    try {
      const response = await fetchWithAuth(
        "http://localhost:8080/api/admin/payments"
      );
      const data = await response.json();
      setTransactions(data);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [fetchWithAuth]);

  // payment status: Chờ, Thành công, Thất bại, Hoàn tiền
  const [paymentStatuses, setPaymentStatuses] = useState<string[]>([]);

  useEffect(() => {
    const fetchPaymentStatuses = async () => {
      try {
        const response = await fetchWithAuth(
          "http://localhost:8080/api/payments/status"
        );
        const data = await response.json();
        setPaymentStatuses(data);
      } catch (error) {
        console.error("Error fetching payment statuses:", error);
      }
    };

    fetchPaymentStatuses();
  });

  // payment method: Chuyển khoản, Tiền mặt
  const [paymentMethods, setPaymentMethods] = useState<string[]>([]);

  useEffect(() => {
    const fetchPaymentMethods = async () => {
      try {
        const response = await fetchWithAuth(
          "http://localhost:8080/api/payments/method"
        );
        const data = await response.json();
        setPaymentMethods(data);
      } catch (error) {
        console.error("Error fetching payment methods:", error);
      }
    };

    fetchPaymentMethods();
  }, [fetchWithAuth]);

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
      transaction.fullName
        .toLowerCase()
        .includes(debouncedSearchQuery.toLowerCase()) &&
      (paymentFilter === "" || transaction.paymentMethod === paymentFilter) &&
      (statusFilter === "" || transaction.paymentStatus === statusFilter)
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
        return { backgroundColor: "var(--main-yellow)", color: "white" };
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

  const [selectedTransaction, setSelectedTransaction] =
    useState<TransactionDetail | null>(null);
  const [showModal, setShowModal] = useState<boolean>(false);

  const handleViewDetail = async (id: number) => {
    try {
      const response = await fetchWithAuth(
        `http://localhost:8080/api/admin/payments/${id}`
      );
      const data = await response.json();
      setSelectedTransaction(data);
      setShowModal(true);
      console.log("Transaction detail:", data);
    } catch (error) {
      console.error("Error fetching transaction detail:", error);
      toast.error("Lỗi khi tải chi tiết giao dịch!");
    }
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [paymentFilter, statusFilter]);

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
              {paymentMethods.length > 0 ? (
                paymentMethods.map((method, index) => (
                  <option key={index} value={method}>
                    {method}
                  </option>
                ))
              ) : (
                <option disabled>Không có phương thức thanh toán</option>
              )}
            </select>

            <select
              className={styles.filterSelect}
              value={statusFilter}
              onChange={(e) => handleFilterChange(e, "status")}
            >
              <option value="">Trạng thái</option>
              {paymentStatuses.length > 0 ? (
                paymentStatuses.map((status, index) => (
                  <option key={index} value={status}>
                    {status}
                  </option>
                ))
              ) : (
                <option disabled>Không có trạng thái thanh toán</option>
              )}
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
                {currentTransactions.length === 0 ? (
                  <tr key="no-data">
                    <td colSpan={8} className={styles.emptyRow}>
                      Không có dữ liệu
                    </td>
                  </tr>
                ) : (
                  currentTransactions.map((transaction, index) => (
                    <tr key={`${transaction.roomNumber}-${index}`}>
                      <td>{(currentPage - 1) * PAGE_SIZE + index + 1}</td>
                      <td>{transaction.fullName}</td>
                      <td>{transaction.roomNumber}</td>
                      <td>{transaction.paymentDate}</td>
                      <td>
                        {getPaymentIcon(transaction.paymentMethod)}{" "}
                        {transaction.paymentMethod}
                      </td>
                      <td>
                        <span
                          style={{
                            ...getStatusStyle(transaction.paymentStatus),
                            padding: "5px 8px",
                            borderRadius: "5px",
                            display: "inline-block",
                            textAlign: "center",
                          }}
                        >
                          {transaction.paymentStatus}
                        </span>
                      </td>
                      <td>
                        {new Intl.NumberFormat("vi-VN", {
                          style: "currency",
                          currency: "VND",
                          minimumFractionDigits: 0,
                        }).format(Number(transaction.amount))}
                      </td>
                      <td className={styles.actions}>
                        <FontAwesomeIcon
                          icon={faPen}
                          className={`${styles.icon} ${styles.edit}`}
                          title="Cập nhật"
                          onClick={() =>
                            handleViewDetail(transaction.transactionId)
                          }
                        />
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <AdminPagination
            totalPages={totalPages}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
          />

          {showModal && selectedTransaction && (
            <TransactionEditModal
              isOpen={showModal}
              onClose={() => setShowModal(false)}
              transactionDetail={selectedTransaction}
              onUpdate={fetchTransactions}
            />
          )}
        </div>
      </div>
    </div>
  );
}
