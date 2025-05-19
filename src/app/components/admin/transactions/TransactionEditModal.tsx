"use client";

import { useState } from "react";
import styles from "./TransactionEditModal.module.css";
import { toast, ToastContainer } from "react-toastify";
import { useFetchWithAuth } from "@/app/utils/api";
import RequireAdmin from "../../RequireAdmin";

interface TransactionEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  transactionDetail: {
    transactionId: number;
    fullName: string;
    roomNumber: string;
    paymentDate: string;
    paymentMethod: string;
    paymentStatus: string;
    amount: number;
  };
  onUpdate: () => void;
}

const PAYMENT_METHODS = ["Tiền mặt", "Chuyển khoản"];
const PAYMENT_STATUSES = ["Thành công", "Thất bại", "Hoàn tiền"];

export default function TransactionEditModal({
  isOpen,
  onClose,
  transactionDetail,
  onUpdate,
}: TransactionEditModalProps) {
  const fetchWithAuth = useFetchWithAuth();

  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>(
    transactionDetail.paymentMethod
  );
  const [selectedPaymentStatus, setSelectedPaymentStatus] = useState<string>(
    transactionDetail.paymentStatus
  );

  const handleUpdateTransaction = async () => {
    try {
      const response = await fetchWithAuth(
        `http://localhost:8080/api/admin/payments/${transactionDetail.transactionId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            paymentMethod: selectedPaymentMethod,
            paymentStatus: selectedPaymentStatus,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update transaction");
      }

      toast.success("Cập nhật thành công!");
      setTimeout(() => {
        onClose();
      }, 2000);
      onUpdate();
    } catch (error) {
      console.error("Error updating transaction:", error);
      toast.error("Cập nhật thất bại!");
    }
  };

  const paymentStatusOptions =
    transactionDetail.paymentStatus === "Chờ"
      ? PAYMENT_STATUSES.filter((status) => status !== "Hoàn tiền").concat(
          "Chờ"
        )
      : PAYMENT_STATUSES;

  const handleGoToPaymentPage = async () => {
    try {
      // Lấy bookingId từ đâu đó (ở đây giả sử transactionId = bookingId)
      const transactionId = transactionDetail.transactionId;

      // Gọi API POST không có body, mà truyền bookingId dưới dạng query param
      const response = await fetchWithAuth(
        `http://localhost:8080/api/payments/create-link?transactionId=${transactionId}`,
        {
          method: "POST",
        }
      );

      if (!response.ok) {
        throw new Error("Lỗi khi tạo liên kết thanh toán");
      }

      const data = await response.json();

      // Trong backend trả về obj có url (hoặc checkoutUrl) và orderCode
      // Ở controller bạn nói trả về PayOSLinkResDTO gồm checkoutUrl và orderCode
      // Vậy cần dùng data.checkoutUrl hoặc data.url, tùy tên biến trả về
      const paymentUrl = data.url || data.checkoutUrl;

      if (paymentUrl) {
        window.location.href = paymentUrl;
      } else {
        toast.error("Không nhận được liên kết thanh toán");
      }
    } catch (error) {
      console.error("Error creating payment link:", error);
      toast.error("Tạo thanh toán thất bại!");
    }
  };

  if (!isOpen) return null;

  return (
    <RequireAdmin>
      <div className={styles.modalOverlay}>
        <div className={styles.modalContent}>
          <h2>Chi tiết giao dịch</h2>

          {/* Full Name */}
          <p>
            <strong>Tên khách hàng:</strong>
            <input
              type="text"
              name="fullName"
              defaultValue={transactionDetail.fullName}
              className={`${styles.editableInput} ${styles.greenBorderInput}`}
              readOnly
            />
          </p>

          {/* Room Number */}
          <p>
            <strong>Phòng:</strong>
            <input
              type="text"
              name="roomNumber"
              defaultValue={transactionDetail.roomNumber}
              className={`${styles.editableInput} ${styles.greenBorderInput}`}
              readOnly
            />
          </p>

          {/* Payment Date */}
          <p>
            <strong>Ngày thanh toán:</strong>
            <input
              type="text"
              name="paymentDate"
              defaultValue={transactionDetail.paymentDate}
              className={`${styles.editableInput} ${styles.greenBorderInput}`}
              readOnly
            />
          </p>

          {/* Payment Method */}
          <p>
            <strong>Phương thức thanh toán:</strong>
            <select
              name="paymentMethod"
              value={
                selectedPaymentStatus === "Chờ" ? "" : selectedPaymentMethod
              }
              onChange={(e) => setSelectedPaymentMethod(e.target.value)}
              className={styles.editableInput}
              disabled={selectedPaymentStatus === "Chờ"}
            >
              {selectedPaymentStatus === "Chờ" ? (
                <option value="">Chưa thanh toán</option>
              ) : (
                PAYMENT_METHODS.map((method) => (
                  <option key={method} value={method}>
                    {method}
                  </option>
                ))
              )}
            </select>
          </p>

          {/* Payment Status */}
          <p>
            <strong>Trạng thái thanh toán:</strong>
            <select
              name="paymentStatus"
              value={selectedPaymentStatus}
              onChange={(e) => setSelectedPaymentStatus(e.target.value)}
              className={styles.editableInput}
            >
              {paymentStatusOptions.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </p>

          {/* Amount */}
          <p>
            <strong>Số tiền:</strong>
            {transactionDetail.paymentStatus === "Chờ" ? (
              <button
                className={styles.payNowButton}
                onClick={handleGoToPaymentPage}
              >
                Thực hiện thanh toán
              </button>
            ) : (
              <input
                type="text"
                name="amount"
                value={
                  transactionDetail.amount != null
                    ? transactionDetail.amount.toLocaleString("vi-VN") + " VND"
                    : "Chưa thanh toán"
                }
                className={`${styles.editableInput} ${styles.greenBorderInput}`}
                readOnly
              />
            )}
          </p>

          {/* Buttons */}
          <div className={styles.btnGroup}>
            <button
              className={styles.saveBtn}
              onClick={handleUpdateTransaction}
            >
              Cập nhật
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
    </RequireAdmin>
  );
}
