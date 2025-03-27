import React from "react";
import styles from "./RoomDetail.module.css";
import CustomerHeader from "../../CustomerHeader";
import { Container } from "react-bootstrap";

const RoomDetail: React.FC = () => {
  return (
    <Container>
      <CustomerHeader />
      <h2 className={styles.title}>Thông tin phòng</h2>

      <div className={styles.tabs}>
        <button className={`${styles.tab} ${styles.active}`}>Tổng quan</button>
        <button className={styles.tab}>Đánh giá</button>
      </div>

      <div className={styles.roomInfo}>
        {/* <h3 className={styles.roomTitle}>
          Không xác định - 0 <span className={styles.star}>⭐</span>
        </h3> */}

        <table className={styles.table}>
          <tbody>
            <tr>
              <td className={styles.label}>Loại phòng</td>
              <td>Không rõ</td>
            </tr>
            <tr>
              <td className={styles.label}>Số người</td>
              <td>👤</td>
            </tr>
            <tr>
              <td className={styles.label}>Tiện ích</td>
              <td>
                <ul>
                  <li>Không có tiện ích</li>
                </ul>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className={styles.footer}>
        <div className={styles.terms}>
          <h4>Điều khoản</h4>
          <ul>
            <li>Nhận phòng sau 14:00, trả phòng trước 12:00.</li>
            <li>Không hoàn tiền nếu hủy trong vòng 24h.</li>
            <li>Không được mang vật nuôi.</li>
          </ul>
        </div>

        <div className={styles.invoice}>
          <h4>Hóa đơn</h4>
          <div className={styles.invoiceItem}>
            <p className={styles.invoiceLabel}>Giá 1 đêm:</p>
            <p>0đ</p>
          </div>
          <div className={styles.invoiceItem}>
            <p className={styles.invoiceLabel}>Số ngày ở:</p>
            <p>1</p>
          </div>
          <div className={styles.line}></div>
          <div className={styles.invoiceItem}>
            <p className={styles.invoiceLabel}>Tổng:</p>
            <p>0đ</p>
          </div>

          <button className={styles.payButton}>Thanh toán</button>
        </div>
      </div>
    </Container>
  );
};

export default RoomDetail;
