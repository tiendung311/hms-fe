"use client";

import { useEffect, useState } from "react";
import styles from "./BookingDetailModal.module.css";
import { toast, ToastContainer } from "react-toastify";
import { useFetchWithAuth } from "@/app/utils/api";
import RequireAdmin from "../../RequireAdmin";

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
  onUpdate: () => void;
}

const STATUS_OPTIONS = ["Chờ", "Xác nhận", "Nhận phòng", "Trả phòng", "Hủy"];

export default function BookingDetailModal({
  isOpen,
  onClose,
  bookingDetail,
  isEditable = false,
  onUpdate,
}: BookingDetailModalProps) {
  const fetchWithAuth = useFetchWithAuth();

  const toInputDate = (dateString: string): string => {
    if (!dateString.includes("/")) return dateString;
    const [day, month, year] = dateString.split("/");
    return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
  };

  const [checkInDate, setCheckInDate] = useState(
    toInputDate(bookingDetail.checkInDate)
  );
  const [checkOutDate, setCheckOutDate] = useState(
    toInputDate(bookingDetail.checkOutDate)
  );
  const [roomNumbers, setRoomNumbers] = useState<string[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<string>(
    bookingDetail.roomNumber
  );

  useEffect(() => {
    if (isEditable) {
      fetchWithAuth(
        `http://localhost:8080/api/admin/rooms/available?checkInDate=${checkInDate}&checkOutDate=${checkOutDate}`
      )
        .then((res) => res.json())
        .then((data: string[]) => {
          const currentRoom = bookingDetail.roomNumber;
          const filtered = data.filter((room) => room !== currentRoom);
          const sortedRooms = [currentRoom, ...filtered];
          setRoomNumbers(sortedRooms);
        })
        .catch((err) => console.error("Failed to fetch room numbers", err));
    }
  }, [
    isEditable,
    bookingDetail.roomNumber,
    checkInDate,
    checkOutDate,
    fetchWithAuth,
  ]);

  const [totalPrice, setTotalPrice] = useState<number>(
    bookingDetail.totalPrice
  );
  const [loadingPrice, setLoadingPrice] = useState(false);

  useEffect(() => {
    if (!isEditable) return;

    const initialRoom = bookingDetail.roomNumber;
    const initialCheckIn = toInputDate(bookingDetail.checkInDate);
    const initialCheckOut = toInputDate(bookingDetail.checkOutDate);

    // If nothing changed, don't fetch price
    if (
      selectedRoom === initialRoom &&
      checkInDate === initialCheckIn &&
      checkOutDate === initialCheckOut
    ) {
      return;
    }

    const timeout = setTimeout(() => {
      if (selectedRoom && checkInDate && checkOutDate) {
        setLoadingPrice(true);
        fetchWithAuth(
          `http://localhost:8080/api/admin/bookings/calculate-price?roomNumber=${selectedRoom}&checkInDate=${checkInDate}&checkOutDate=${checkOutDate}`
        )
          .then((res) => {
            if (!res.ok) throw new Error("Không tính được giá");
            return res.json();
          })
          .then((data) => {
            setTotalPrice(data.totalAmount);
            setLoadingPrice(false);
          })
          .catch((err) => {
            console.error("Lỗi khi tính tổng tiền:", err);
            setLoadingPrice(false);
          });
      }
    }, 2000);

    return () => clearTimeout(timeout);
  }, [
    selectedRoom,
    checkInDate,
    checkOutDate,
    isEditable,
    bookingDetail.checkInDate,
    bookingDetail.checkOutDate,
    bookingDetail.roomNumber,
    fetchWithAuth,
  ]);

  const handleSaveChanges = async () => {
    const checkInInput = (
      document.querySelector('input[name="checkInDate"]') as HTMLInputElement
    ).value;
    const checkOutInput = (
      document.querySelector('input[name="checkOutDate"]') as HTMLInputElement
    ).value;
    const bookingStatus = (
      document.querySelector(
        'select[name="bookingStatus"]'
      ) as HTMLSelectElement
    ).value;

    // Format ngày về dạng dd/MM/yyyy giống backend
    const formatDate = (dateStr: string) => {
      const [year, month, day] = dateStr.split("-");
      return `${day}/${month}/${year}`;
    };

    const bookingId = parseInt(bookingDetail.bookingId.toString(), 10);

    const payload = {
      bookingId: bookingId,
      fullName: bookingDetail.fullName,
      roomNumber: selectedRoom,
      checkInDate: formatDate(checkInInput),
      checkOutDate: formatDate(checkOutInput),
      bookingStatus: bookingStatus,
      totalPrice: totalPrice,
    };

    try {
      const res = await fetchWithAuth(
        `http://localhost:8080/api/admin/bookings/${bookingDetail.bookingId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      if (!res.ok) throw new Error("Lỗi khi cập nhật booking");

      toast.success("Cập nhật thành công!");
      setTimeout(() => {
        onClose();
      }, 2000);
      onUpdate();
    } catch (err) {
      console.error("Lỗi:", err);
      toast.error("Cập nhật thất bại!");
    }
  };

  if (!isOpen) return null;

  return (
    <RequireAdmin>
      <div className={styles.modalOverlay}>
        <div className={styles.modalContent}>
          <h2>Chi tiết đặt phòng</h2>

          {/* Full Name */}
          <p>
            <strong>Tên khách hàng:</strong>
            {!isEditable ? (
              <span>{bookingDetail.fullName}</span>
            ) : (
              <input
                type="text"
                name="fullName"
                defaultValue={bookingDetail.fullName}
                className={`${styles.editableInput} ${styles.greenBorderInput}`}
                readOnly
              />
            )}
          </p>

          {/* Room Number */}
          <p>
            <strong>Phòng:</strong>
            {!isEditable ? (
              <span>{bookingDetail.roomNumber}</span>
            ) : (
              <select
                name="roomNumber"
                value={selectedRoom}
                onChange={(e) => setSelectedRoom(e.target.value)}
                className={styles.editableInput}
              >
                {roomNumbers.map((roomNum) => (
                  <option key={roomNum} value={roomNum}>
                    {roomNum}
                  </option>
                ))}
              </select>
            )}
          </p>

          {/* Check In Date */}
          <p>
            <strong>Ngày nhận phòng:</strong>
            {!isEditable ? (
              <span>{bookingDetail.checkInDate}</span>
            ) : (
              <input
                type="date"
                name="checkInDate"
                value={checkInDate}
                onChange={(e) => setCheckInDate(e.target.value)}
                className={styles.editableInput}
              />
            )}
          </p>

          {/* Check Out Date */}
          <p>
            <strong>Ngày trả phòng:</strong>
            {!isEditable ? (
              <span>{bookingDetail.checkOutDate}</span>
            ) : (
              <input
                type="date"
                name="checkOutDate"
                value={checkOutDate}
                onChange={(e) => setCheckOutDate(e.target.value)}
                className={styles.editableInput}
              />
            )}
          </p>

          {/* Booking Status */}
          <p>
            <strong>Trạng thái:</strong>
            {!isEditable ? (
              <span>{bookingDetail.bookingStatus}</span>
            ) : (
              <select
                name="bookingStatus"
                defaultValue={bookingDetail.bookingStatus}
                className={styles.editableInput}
              >
                {STATUS_OPTIONS.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            )}
          </p>

          {/* Total Price */}
          <p>
            <strong>Tổng số tiền:</strong>
            {!isEditable ? (
              <span>
                {bookingDetail.totalPrice.toLocaleString("vi-VN")} VND
              </span>
            ) : (
              <input
                type="text"
                name="totalPrice"
                value={
                  loadingPrice
                    ? "Đang tính toán ..."
                    : totalPrice.toLocaleString("vi-VN") + " VND"
                }
                className={`${styles.editableInput} ${
                  loadingPrice
                    ? styles.yellowBorderInput
                    : styles.greenBorderInput
                }`}
                readOnly
              />
            )}
          </p>

          {/* Buttons */}
          <div className={styles.btnGroup}>
            {isEditable && (
              <button className={styles.saveBtn} onClick={handleSaveChanges}>
                Lưu
              </button>
            )}
            <button className={styles.backBtn} onClick={onClose}>
              Đóng
            </button>
          </div>

          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            closeOnClick
            pauseOnHover
            draggable
          />
        </div>
      </div>
    </RequireAdmin>
  );
}
