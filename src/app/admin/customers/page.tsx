"use client";

import AdminHeader from "@/app/components/AdminHeader";
import AdminSidebar from "@/app/components/AdminSidebar";
import styles from "./style.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEye,
  faPen,
  faRotateLeft,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import AdminPagination from "../AdminPagination";

interface Customer {
  id: number;
  fullName: string;
  email: string;
  bookingCount: number;
}

const PAGE_SIZE = 10;
const FILTER_OPTIONS = [
  { value: "fullName", label: "Họ tên" },
  { value: "email", label: "Email" },
] as const;

type FilterKey = "fullName" | "email";

export default function CustomerManage() {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [searchFilter, setSearchFilter] = useState<FilterKey>("fullName"); // Mặc định tìm theo Họ tên
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);

  useEffect(() => {
    const generateCustomers = () =>
      Array.from({ length: 35 }, (_, i) => ({
        id: i + 1,
        fullName: `Khách hàng ${i + 1}`,
        email: `customer${i + 1}@example.com`,
        bookingCount: Math.floor(Math.random() * 10),
      }));

    const initialCustomers = generateCustomers();
    setCustomers(initialCustomers);
    setFilteredCustomers(initialCustomers);
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      const filtered = customers.filter((customer) =>
        customer[searchFilter as keyof Customer]
          ?.toString()
          .toLowerCase()
          .includes(searchQuery.toLowerCase())
      );
      setFilteredCustomers(filtered);
      setCurrentPage(1);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery, searchFilter, customers]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const handleFilterChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSearchFilter(event.target.value as FilterKey);
  };

  const handleReset = () => {
    setSearchQuery("");
    setFilteredCustomers(customers);
    setCurrentPage(1);
  };

  const totalPages = Math.ceil(filteredCustomers.length / PAGE_SIZE);
  const currentCustomers = filteredCustomers.slice(
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
            <select
              className={styles.filterSelect}
              value={searchFilter}
              onChange={handleFilterChange}
            >
              {FILTER_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>

            <input
              type="text"
              className={styles.searchInput}
              placeholder={`Tìm kiếm theo ${
                FILTER_OPTIONS.find((opt) => opt.value === searchFilter)?.label
              }`}
              value={searchQuery}
              onChange={handleSearchChange}
            />

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
