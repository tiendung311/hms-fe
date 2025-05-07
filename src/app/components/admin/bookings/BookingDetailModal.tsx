"use client";

import { useEffect, useState } from "react";
import styles from "./BookingDetailModal.module.css";

interface BookingDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookingDetail: {
    bookingId: number;
    fullName: string;
    roomNumber: string;
    checkInDate: string;
    checkOutDate: string;
    bookingStatus: string;
    totalPrice: number;
  };
  isEditable?: boolean;
}

const STATUS_OPTIONS = ["Chờ", "Xác nhận", "Nhận phòng", "Trả phòng", "Hủy"];

export default function BookingDetailModal({
  isOpen,
  onClose,
  bookingDetail,
  isEditable = false,
}: BookingDetailModalProps) {
  const [roomNumbers, setRoomNumbers] = useState<string[]>([]);

  useEffect(() => {
    if (isEditable) {
      fetch("http://localhost:8080/api/admin/rooms/empty")
        .then((res) => res.json())
        .then((data) => setRoomNumbers(data))
        .catch((err) => console.error("Failed to fetch room numbers", err));
    }
  }, [isEditable]);

  if (!isOpen) return null;

  const renderField = (
    label: string,
    value: string | number,
    name?: string
  ) => {
    if (!isEditable) {
      return (
        <p>
          <strong>{label}</strong>
          <span>{value}</span>
        </p>
      );
    }

    if (name === "roomNumber") {
      return (
        <p>
          <strong>{label}</strong>
          <select
            name={name}
            defaultValue={value}
            className={styles.editableInput}
          >
            {roomNumbers.map((roomNum) => (
              <option key={roomNum} value={roomNum}>
                {roomNum}
              </option>
            ))}
          </select>
        </p>
      );
    }

    if (name === "bookingStatus") {
      return (
        <p>
          <strong>{label}</strong>
          <select
            name={name}
            defaultValue={value}
            className={styles.editableInput}
          >
            {STATUS_OPTIONS.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </p>
      );
    }

    const toInputDate = (dateString: string): string => {
      if (!dateString.includes("/")) return dateString; // nếu đã là ISO rồi

      const [day, month, year] = dateString.split("/");
      if (!day || !month || !year) return "";
      return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
    };

    if (name === "checkInDate" || name === "checkOutDate") {
      return (
        <p>
          <strong>{label}</strong>
          <input
            type="date"
            name={name}
            defaultValue={toInputDate(value as string)}
            className={styles.editableInput}
          />
        </p>
      );
    }

    if (name === "totalPrice") {
      return (
        <p>
          <strong>{label}</strong>
          <input
            type="text"
            name={name}
            defaultValue={value}
            className={`${styles.editableInput} ${styles.greenBorderInput}`}
            disabled
          />
        </p>
      );
    }

    return (
      <p>
        <strong>{label}</strong>
        <input
          type="text"
          name={name}
          defaultValue={value}
          className={`${styles.editableInput} ${styles.greenBorderInput}`}
          disabled
        />
      </p>
    );
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h2>Chi tiết đặt phòng</h2>
        {renderField("Tên khách hàng:", bookingDetail.fullName, "fullName")}
        {renderField("Phòng:", bookingDetail.roomNumber, "roomNumber")}
        {renderField(
          "Ngày nhận phòng:",
          bookingDetail.checkInDate,
          "checkInDate"
        )}
        {renderField(
          "Ngày trả phòng:",
          bookingDetail.checkOutDate,
          "checkOutDate"
        )}
        {renderField(
          "Trạng thái:",
          bookingDetail.bookingStatus,
          "bookingStatus"
        )}
        {renderField(
          "Tổng số tiền:",
          `${bookingDetail.totalPrice.toLocaleString("vi-VN")} VND`,
          "totalPrice"
        )}

        <button onClick={onClose}>Đóng</button>
      </div>
    </div>
  );
}
