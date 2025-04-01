"use client";

import AdminHeader from "@/app/components/AdminHeader";
import AdminSidebar from "@/app/components/AdminSidebar";
import styles from "./style.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEye,
  faPen,
  faRotateLeft,
  faSearch,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";

interface Customer {
  id: number;
  fullName: string;
  phone: string;
  email: string;
  bookingCount: number;
}

const PAGE_SIZE = 10;

export default function CustomerManage() {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [customers, setCustomers] = useState<Customer[]>(
    Array.from({ length: 35 }, (_, i) => ({
      id: i + 1,
      fullName: `Khách hàng ${i + 1}`,
      phone: `09876543${i % 10}${i}`,
      email: `customer${i + 1}@example.com`,
      bookingCount: Math.floor(Math.random() * 10),
    }))
  );
  const [currentPage, setCurrentPage] = useState<number>(1);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const handleSearch = () => {
    const filteredCustomers = customers.filter((customer) =>
      customer.fullName.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setCustomers(filteredCustomers);
    setCurrentPage(1);
  };

  const handleReset = () => {
    setSearchQuery("");
    setCustomers(
      Array.from({ length: 35 }, (_, i) => ({
        id: i + 1,
        fullName: `Khách hàng ${i + 1}`,
        phone: `09876543${i % 10}${i}`,
        email: `customer${i + 1}@example.com`,
        bookingCount: Math.floor(Math.random() * 10),
      }))
    );
    setCurrentPage(1);
  };

  const totalPages = Math.ceil(customers.length / PAGE_SIZE);
  const currentCustomers = customers.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  return (
    <div className={styles.dashboardContainer}>
      <AdminSidebar />
      <div className={styles.mainContent}>
        <AdminHeader />
        <div className={styles.content}>
          <h2 className={styles.title}>Quản lý khách hàng</h2>

          <div className={styles.searchContainer}>
            <input
              type="text"
              className={styles.searchInput}
              placeholder="Tìm kiếm..."
              value={searchQuery}
              onChange={handleSearchChange}
            />
            <button className={styles.searchButton} onClick={handleSearch}>
              <FontAwesomeIcon icon={faSearch} style={{ marginRight: 10 }} />
              Tìm kiếm
            </button>
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
                  <th>Họ tên</th>
                  <th>Số điện thoại</th>
                  <th>Email</th>
                  <th>Tổng số lần đặt phòng</th>
                  <th>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {currentCustomers.map((customer, index) => (
                  <tr key={customer.id}>
                    <td>{(currentPage - 1) * PAGE_SIZE + index + 1}</td>
                    <td>{customer.fullName}</td>
                    <td>{customer.phone}</td>
                    <td>{customer.email}</td>
                    <td>{customer.bookingCount}</td>
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

          <div className={styles.pagination}>
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                className={`${styles.pageButton} ${
                  currentPage === i + 1 ? styles.activePage : ""
                }`}
                onClick={() => setCurrentPage(i + 1)}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
