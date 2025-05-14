"use client";

import { useEffect, useState } from "react";
import AdminHeader from "@/app/components/AdminHeader";
import AdminSidebar from "@/app/components/AdminSidebar";
import AdminPagination from "../AdminPagination";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEye,
  faPen,
  faRotateLeft,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";
import styles from "./style.module.css";
import { toast } from "react-toastify";
import BookingDetailModal from "@/app/components/admin/bookings/BookingDetailModal";
import BookingCreateModal from "@/app/components/admin/bookings/BookingCreateModal";

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
  bookingId: number;
  fullName: string;
  roomNumber: string;
  checkInDate: string;
  checkOutDate: string;
  bookingStatus: string;
}

interface BookingDetail {
  id: number;
  bookingId: number;
  fullName: string;
  roomNumber: string;
  checkInDate: string;
  checkOutDate: string;
  bookingStatus: string;
  totalPrice: number;
}

const PAGE_SIZE = 10;

export default function BookingManage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const [bookings, setBookings] = useState<Booking[]>([]);

  const fetchBookings = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/admin/bookings");
      if (!response.ok) throw new Error("Failed to fetch bookings");
      const data = await response.json();
      setBookings(data);
    } catch (error) {
      console.error("Error fetching bookings:", error);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const [bookingStatuses, setBookingStatuses] = useState<string[]>([]);

  useEffect(() => {
    const fetchBookingStatuses = async () => {
      try {
        const response = await fetch(
          "http://localhost:8080/api/bookings/status"
        );
        if (!response.ok) throw new Error("Failed to fetch booking statuses");
        const data = await response.json();
        setBookingStatuses(data);
      } catch (error) {
        console.error("Error fetching booking statuses:", error);
      }
    };

    fetchBookingStatuses();
  }, []);

  const [selectedBooking, setSelectedBooking] = useState<BookingDetail | null>(
    null
  );
  const [showModal, setShowModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  const handleViewDetail = async (id: number, editable: boolean) => {
    try {
      const res = await fetch(`http://localhost:8080/api/admin/bookings/${id}`);
      if (!res.ok) throw new Error("Không thể lấy chi tiết đặt phòng");
      const data = await res.json();
      setSelectedBooking(data);
      setIsEditMode(editable);
      setShowModal(true);
    } catch (err) {
      console.error(err);
      toast.error("Lỗi khi lấy thông tin chi tiết");
    }
  };

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 300);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  const handleReset = () => {
    setSearchQuery("");
    setStatusFilter("");
    setFromDate("");
    setToDate("");
    setCurrentPage(1);
  };

  const convertToISODate = (dateStr: string) => {
    // from "dd/MM/yyyy" to "yyyy-MM-dd"
    const [day, month, year] = dateStr.split("/");
    return `${year}-${month}-${day}`;
  };

  const filteredBookings = bookings.filter((b) => {
    const formattedCheckIn = convertToISODate(b.checkInDate);
    const formattedCheckOut = convertToISODate(b.checkOutDate);

    return (
      b.fullName.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) &&
      (statusFilter ? b.bookingStatus === statusFilter : true) &&
      (!fromDate || formattedCheckIn >= fromDate) &&
      (!toDate || formattedCheckOut <= toDate)
    );
  });

  const [showCreateModal, setShowCreateModal] = useState(false);

  const totalPages = Math.ceil(filteredBookings.length / PAGE_SIZE);
  const currentBookings = filteredBookings.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter, fromDate, toDate]);

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
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="">Trạng thái</option>
                {bookingStatuses.length > 0 ? (
                  bookingStatuses.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))
                ) : (
                  <option disabled>Chưa có dữ liệu trong danh sách</option>
                )}
              </select>

              <button className={styles.resetButton} onClick={handleReset}>
                <FontAwesomeIcon
                  icon={faRotateLeft}
                  style={{ marginRight: 5 }}
                />
                Làm mới
              </button>
            </div>
            <button
              className={styles.addButton}
              onClick={() => setShowCreateModal(true)}
            >
              <FontAwesomeIcon icon={faPlus} style={{ marginRight: 5 }} />
              Tạo mới
            </button>
          </div>

          <div className={styles.dateFilterContainer}>
            <div className={styles.dateGroup}>
              <label className={styles.dateLabel}>Từ ngày:</label>
              <input
                type="date"
                className={styles.dateInput}
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
              />
            </div>
            <div className={styles.dateGroup} style={{ marginLeft: 50 }}>
              <label className={styles.dateLabel}>Đến ngày:</label>
              <input
                type="date"
                className={styles.dateInput}
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
              />
            </div>
          </div>

          <div className={styles.tableContainer}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>STT</th>
                  <th>Khách hàng</th>
                  <th>Phòng</th>
                  <th>Ngày nhận phòng</th>
                  <th>Ngày trả phòng</th>
                  <th>Trạng thái</th>
                  <th>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {currentBookings.length === 0 ? (
                  <tr key="no-data">
                    <td colSpan={7} className={styles.emptyRow}>
                      Không có dữ liệu
                    </td>
                  </tr>
                ) : (
                  currentBookings.map((booking, index) => (
                    <tr
                      key={`${booking.roomNumber}-${booking.checkInDate}-${index}`}
                    >
                      <td>{(currentPage - 1) * PAGE_SIZE + index + 1}</td>
                      <td>{booking.fullName}</td>
                      <td>{booking.roomNumber}</td>
                      <td>{booking.checkInDate}</td>
                      <td>{booking.checkOutDate}</td>
                      <td style={getStatusStyle(booking.bookingStatus)}>
                        {booking.bookingStatus}
                      </td>
                      <td className={styles.actions}>
                        <FontAwesomeIcon
                          icon={faEye}
                          className={`${styles.icon} ${styles.view}`}
                          title="Xem chi tiết"
                          onClick={() =>
                            handleViewDetail(booking.bookingId, false)
                          }
                        />
                        <FontAwesomeIcon
                          icon={faPen}
                          className={`${styles.icon} ${styles.edit}`}
                          title="Cập nhật"
                          onClick={() =>
                            handleViewDetail(booking.bookingId, true)
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

          {selectedBooking && showModal && (
            <BookingDetailModal
              isOpen={showModal}
              onClose={() => setShowModal(false)}
              bookingDetail={selectedBooking}
              isEditable={isEditMode}
              onUpdate={fetchBookings}
            />
          )}

          {showCreateModal && (
            <BookingCreateModal
              onClose={() => setShowCreateModal(false)}
              onUpdate={fetchBookings}
            />
          )}
        </div>
      </div>
    </div>
  );
}
