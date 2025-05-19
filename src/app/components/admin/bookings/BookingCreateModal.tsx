import React, { useState, useEffect } from "react";
import styles from "./BookingCreateModal.module.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useFetchWithAuth } from "@/app/utils/api";

interface BookingCreateModalProps {
  onClose: () => void;
  onUpdate: () => void;
}

const BookingCreateModal: React.FC<BookingCreateModalProps> = ({
  onClose,
  onUpdate,
}) => {
  const fetchWithAuth = useFetchWithAuth();

  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [roomNumber, setRoomNumber] = useState("");
  const [roomType, setRoomType] = useState("");
  const [checkInDate, setCheckInDate] = useState("");
  const [checkOutDate, setCheckOutDate] = useState("");
  const [totalPrice, setTotalPrice] = useState(0);
  const [loadingPrice, setLoadingPrice] = useState(false);

  // Hàm tìm kiếm tên khách hàng từ email
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (email) {
        fetch(`http://localhost:8080/api/customers/email/${email}`)
          .then((res) => res.json())
          .then((data) => {
            setFullName(data.fullName || "");
          })
          .catch((err) => {
            console.error("Lỗi khi tìm khách hàng:", err);
            setFullName("Không tìm thấy tên khách hàng");
          });
      }
    }, 1000);

    return () => clearTimeout(timeout);
  }, [email]);

  // Hàm generate loại phòng
  useEffect(() => {
    if (roomNumber) {
      fetchWithAuth(`http://localhost:8080/api/admin/rooms/${roomNumber}`)
        .then((res) => res.json())
        .then((data) => {
          console.log("API response:", data);
          setRoomType(data.roomType || "");
        })
        .catch((err) => {
          console.error("Không thể lấy loại phòng", err);
          setRoomType("Chưa có thông tin");
        });
    }
  }, [roomNumber, fetchWithAuth]);

  // Hàm tính giá
  useEffect(() => {
    if (roomNumber && checkInDate && checkOutDate) {
      const timeout = setTimeout(() => {
        setLoadingPrice(true);
        fetchWithAuth(
          `http://localhost:8080/api/admin/bookings/calculate-price?roomNumber=${roomNumber}&checkInDate=${checkInDate}&checkOutDate=${checkOutDate}`
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
      }, 1000);

      return () => clearTimeout(timeout);
    }
  }, [roomNumber, checkInDate, checkOutDate, fetchWithAuth]);

  const [roomNumbers, setRoomNumbers] = useState<string[]>([]);

  useEffect(() => {
    if (checkInDate && checkOutDate) {
      fetchWithAuth(
        `http://localhost:8080/api/admin/rooms/available?checkInDate=${checkInDate}&checkOutDate=${checkOutDate}`
      )
        .then((res) => res.json())
        .then((data: string[]) => {
          setRoomNumbers(data);
        })
        .catch((err) => console.error("Failed to fetch available rooms", err));
    }
  }, [checkInDate, checkOutDate, fetchWithAuth]);

  const today = new Date().toISOString().split("T")[0];

  const createBooking = async () => {
    console.log("Payload gửi:", {
      email,
      roomNumber,
      checkInDate,
      checkOutDate,
      totalAmount: totalPrice,
    });

    const response = await fetchWithAuth(
      "http://localhost:8080/api/admin/bookings",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          roomNumber,
          checkInDate,
          checkOutDate,
          totalAmount: totalPrice,
        }),
      }
    );

    const contentType = response.headers.get("Content-Type") || "";

    if (!response.ok) {
      let errorMessage = "Tạo booking thất bại!";
      if (contentType.includes("application/json")) {
        try {
          const errorJson = await response.json();
          errorMessage = errorJson.message || JSON.stringify(errorJson);
        } catch (err) {
          console.warn("Phản hồi không parse được JSON:", err);
        }
      } else {
        errorMessage = await response.text();
      }
      throw new Error(errorMessage);
    }
  };

  const handleCreate = async () => {
    if (!email || !roomNumber || !checkInDate || !checkOutDate) {
      toast.error("Vui lòng điền đầy đủ thông tin!");
      return;
    }

    try {
      await createBooking();
      toast.success("Tạo booking thành công!");
      onUpdate();
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (error: unknown) {
      console.log("Error:", error);
      if (typeof error === "string") {
        toast.error(error);
      } else if (error instanceof Error) {
        toast.error(error.message || "Có lỗi xảy ra khi tạo booking.");
      } else {
        toast.error("Có lỗi không xác định xảy ra khi tạo booking.");
      }
    }
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h2>Tạo đặt phòng mới</h2>

        {/* Email */}
        <p>
          <strong>Email:</strong>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={styles.editableInput}
            placeholder="example@email.com"
          />
        </p>

        {/* Full Name */}
        <p>
          <strong>Tên khách hàng:</strong>
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className={`${styles.editableInput} ${styles.greenBorderInput}`}
            readOnly
          />
        </p>

        {/* Check-in Date */}
        <p>
          <strong>Ngày nhận phòng:</strong>
          <input
            type="date"
            value={checkInDate}
            min={today}
            onChange={(e) => setCheckInDate(e.target.value)}
            className={styles.editableInput}
          />
        </p>

        {/* Check-out Date */}
        <p>
          <strong>Ngày trả phòng:</strong>
          <input
            type="date"
            value={checkOutDate}
            min={checkInDate || today}
            onChange={(e) => setCheckOutDate(e.target.value)}
            className={styles.editableInput}
          />
        </p>

        {/* Room Number */}
        <p>
          <strong>Phòng:</strong>
          <select
            value={roomNumber}
            onChange={(e) => setRoomNumber(e.target.value)}
            className={styles.editableInput}
          >
            <option value="">-- Chọn phòng --</option>
            {roomNumbers.map((num) => (
              <option key={num} value={num}>
                {num}
              </option>
            ))}
          </select>
        </p>

        {/* Room Type */}
        <p>
          <strong>Loại phòng:</strong>
          <input
            type="text"
            value={roomType}
            onChange={(e) => setRoomType(e.target.value)}
            readOnly
            className={`${styles.editableInput} ${styles.greenBorderInput}`}
          />
        </p>

        {/* Total Price */}
        <p>
          <strong>Tổng tiền:</strong>
          <input
            type="text"
            value={
              loadingPrice
                ? "Đang tính toán ..."
                : totalPrice.toLocaleString("vi-VN") + " VND"
            }
            className={`${styles.editableInput} ${
              loadingPrice ? styles.yellowBorderInput : styles.greenBorderInput
            }`}
            readOnly
          />
        </p>

        {/* Buttons */}
        <div className={styles.btnGroup}>
          <button className={styles.saveBtn} onClick={handleCreate}>
            Lưu
          </button>
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
  );
};

export default BookingCreateModal;
