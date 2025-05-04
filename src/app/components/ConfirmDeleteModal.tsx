"use client";

import React from "react";
import styles from "./ConfirmDeleteModal.module.css";

interface ConfirmDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  message?: string;
}

export default function ConfirmDeleteModal({
  isOpen,
  onClose,
  onConfirm,
  message = "Bạn có chắc chắn muốn xóa?",
}: ConfirmDeleteModalProps) {
  if (!isOpen) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <p className={styles.message}>{message}</p>
        <div className={styles.buttonGroup}>
          <button onClick={onConfirm} className={styles.confirmButton}>
            Đồng ý
          </button>
          <button onClick={onClose} className={styles.cancelButton}>
            Hủy
          </button>
        </div>
      </div>
    </div>
  );
}
