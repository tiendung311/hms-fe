"use client";

import { useEffect, useState } from "react";
import AdminHeader from "@/app/components/AdminHeader";
import AdminSidebar from "@/app/components/AdminSidebar";
import AdminPagination from "../AdminPagination";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEye,
  faPen,
  faTrash,
  faRotateLeft,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";
import styles from "./style.module.css";

const ROOM_TYPES = [
  "Đơn 3 sao",
  "Đơn 4 sao",
  "Đơn 5 sao",
  "Đôi 3 sao",
  "Đôi 4 sao",
  "Đôi 5 sao",
];

const BOOKING_STATUSES = ["Chờ", "Xác nhận", "Nhận phòng", "Hủy", "Trả phòng"];

const getStatusStyle = (status: string) => {
  switch (status) {
    case "Chờ":
      return { color: "var(--main-yellow)" };
    case "Xác nhận":
      return { color: "var(--main-green)" };
    case "Nhận phòng":
      return { color: "var(--main-blue)" };
    case "Hủy":
      return { color: "var(--main-red)" };
    case "Trả phòng":
      return { color: "grey" };
    default:
      return {};
  }
};

interface Booking {
  id: number;
  customer: string;
  room: string;
  type: string;
  checkInDate: string;
  checkOutDate: string;
  status: string;
}

const PAGE_SIZE = 10;

export default function BookingManage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const [roomTypeFilter, setRoomTypeFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const [bookings] = useState<Booking[]>(
    Array.from({ length: 28 }, (_, i) => ({
      id: i + 1,
      customer: `Khách ${i + 1}`,
      room: `${100 + (i % 10)}`,
      type: ROOM_TYPES[i % ROOM_TYPES.length],
      checkInDate: "2025-04-01",
      checkOutDate: "2025-04-05",
      status: BOOKING_STATUSES[i % BOOKING_STATUSES.length],
    }))
  );

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 300);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  const handleReset = () => {
    setSearchQuery("");
    setRoomTypeFilter("");
    setStatusFilter("");
    setFromDate("");
    setToDate("");
    setCurrentPage(1);
  };

  const filteredBookings = bookings.filter(
    (b) =>
      b.customer.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) &&
      (roomTypeFilter ? b.type === roomTypeFilter : true) &&
      (statusFilter ? b.status === statusFilter : true) &&
      (!fromDate || b.checkInDate >= fromDate) &&
      (!toDate || b.checkOutDate <= toDate)
  );

  const totalPages = Math.ceil(filteredBookings.length / PAGE_SIZE);
  const currentBookings = filteredBookings.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  return (
    <div className={styles.dashboardContainer}>
      <AdminSidebar />
      <div className={styles.mainContent}>
        <AdminHeader />
        <div className={styles.content}>
          <h2 className={styles.title}>Quản lý đặt phòng</h2>

          <div className={styles.functionContainer}>
            <div className={styles.searchContainer}>
              <input
                type="text"
                className={styles.searchInput}
                placeholder="Tìm kiếm theo tên khách hàng..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />

              <select
                className={styles.filterSelect}
                value={roomTypeFilter}
                onChange={(e) => setRoomTypeFilter(e.target.value)}
              >
                <option value="">Loại phòng</option>
                {ROOM_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>

              <select
                className={styles.filterSelect}
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="">Trạng thái</option>
                {BOOKING_STATUSES.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>

              <button className={styles.resetButton} onClick={handleReset}>
                <FontAwesomeIcon
                  icon={faRotateLeft}
                  style={{ marginRight: 5 }}
                />
                Làm mới
              </button>
            </div>
            <button className={styles.addButton}>
              <FontAwesomeIcon icon={faPlus} style={{ marginRight: 5 }} />
              Tạo mới
            </button>
          </div>

          <div className={styles.dateFilterContainer}>
            <input
              type="date"
              className={styles.dateInput}
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
            />
            <input
              type="date"
              className={styles.dateInput}
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
            />
          </div>

          <div className={styles.tableContainer}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>STT</th>
                  <th>Khách hàng</th>
                  <th>Phòng</th>
                  <th>Loại phòng</th>
                  <th>Ngày nhận phòng</th>
                  <th>Ngày trả phòng</th>
                  <th>Trạng thái</th>
                  <th>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {currentBookings.map((booking, index) => (
                  <tr key={booking.id}>
                    <td>{(currentPage - 1) * PAGE_SIZE + index + 1}</td>
                    <td>{booking.customer}</td>
                    <td>{booking.room}</td>
                    <td>{booking.type}</td>
                    <td>{booking.checkInDate}</td>
                    <td>{booking.checkOutDate}</td>
                    <td style={getStatusStyle(booking.status)}>
                      {booking.status}
                    </td>
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
