"use client";

import CustomerHeader from "@/app/components/CustomerHeader";
import { Button, Container } from "react-bootstrap";
import styles from "./style.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";

export default function Profile() {
  return (
    <Container>
      <CustomerHeader />
      <div className={styles.mainContainer}>
        <div className={styles.bodyContainer}>
          <div className={styles.profileSection}>
            <h1>Thông tin cá nhân</h1>
            <div className={styles.detailsSection}>
              <div className={styles.infoRow}>
                <label className={styles.label}>Họ tên:</label>
                <input className={styles.input} type="text" />
              </div>
              <div className={styles.infoRow}>
                <label className={styles.label}>Email:</label>
                <input className={styles.input} type="text" />
              </div>
            </div>
          </div>
          <div className={styles.passwordGroup}>
            <h1>Cập nhật mật khẩu</h1>
            <div className={styles.detailsSection}>
              <div className={styles.infoRow}>
                <label className={styles.label}>Mật khẩu hiện tại:</label>
                <input className={styles.input} type="password" />
              </div>
              <div className={styles.infoRow}>
                <label className={styles.label}>Mật khẩu mới:</label>
                <input className={styles.input} type="password" />
              </div>
              <div className={styles.infoRow}>
                <label className={styles.label}>Xác nhận mật khẩu mới:</label>
                <input className={styles.input} type="password" />
              </div>
            </div>
          </div>
        </div>
        <div className={styles.buttonGroup}>
          <Button
            className={styles.saveButton}
            variant="warning"
            style={{ color: "white" }}
          >
            Lưu thay đổi
          </Button>
          <Link
            href="/home"
            className={`btn btn-secondary ${styles.cancelButton}`}
          >
            <FontAwesomeIcon
              icon={faArrowLeft}
              style={{ marginRight: "10px" }}
            />
            Quay lại
          </Link>
        </div>
      </div>
    </Container>
  );
}
