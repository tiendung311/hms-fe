"use client";

import { UserProfile } from "@clerk/nextjs";
import styles from "./UserEditModal.module.css";

interface UserEditModalProps {
  onClose: () => void;
}

export default function UserEditModal({ onClose }: UserEditModalProps) {
  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <h2>Chỉnh sửa thông tin</h2>
        <UserProfile
          routing="hash"
          appearance={{
            elements: {
              card: { boxShadow: "none", border: "none" },
              rootBox: { width: "100%" },
            },
          }}
        />
        <div className={styles.btnGroup}>
          <button className={styles.backBtn} onClick={onClose}>
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
}
