"use client";

import AdminHeader from "@/app/components/AdminHeader";
import AdminSidebar from "@/app/components/AdminSidebar";
import styles from "./style.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBed,
  faMoneyBills,
  faMoneyBillTrendUp,
  faUsers,
} from "@fortawesome/free-solid-svg-icons";

export default function Dashboard() {
  return (
    <div className={styles.dashboardContainer}>
      <AdminSidebar />
      <div className={styles.mainContent}>
        <AdminHeader />
        <div className={styles.content}>
          <h2 className={styles.title}>Thống kê</h2>
          <div className={styles.stats}>
            <div
              className={styles.statCard}
              style={{ backgroundColor: "var(--main-blue)" }}
            >
              <p>Tổng doanh thu</p>
              <FontAwesomeIcon className={styles.icon} icon={faMoneyBills} />
              <h3>20.850.000₫</h3>
            </div>
            <div
              className={styles.statCard}
              style={{ backgroundColor: "var(--main-green)" }}
            >
              <p>Doanh thu tháng</p>
              <FontAwesomeIcon
                className={styles.icon}
                icon={faMoneyBillTrendUp}
              />
              <h3>3.800.000₫</h3>
            </div>
            <div
              className={styles.statCard}
              style={{ backgroundColor: "var(--main-yellow)" }}
            >
              <p>Tổng số khách hàng</p>
              <FontAwesomeIcon className={styles.icon} icon={faUsers} />
              <h3>120</h3>
            </div>
            <div
              className={styles.statCard}
              style={{ backgroundColor: "var(--main-red)" }}
            >
              <p>Tổng số phòng</p>
              <FontAwesomeIcon className={styles.icon} icon={faBed} />
              <h3>30</h3>
            </div>
          </div>
          <div className={styles.chartContainer}>
            <canvas id="revenueChart"></canvas>
          </div>
          <div className={styles.tables}>
            <div className={styles.tableContainer}>
              <h3>Đặt phòng gần đây</h3>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Họ tên</th>
                    <th>Phòng</th>
                    <th>Thời gian</th>
                    <th>Trạng thái</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Nguyễn Văn B</td>
                    <td>201</td>
                    <td>02/11/2025 - 04/11/2025</td>
                    <td className={styles.pending}>Chờ</td>
                  </tr>
                  <tr>
                    <td>Nguyễn Văn B</td>
                    <td>201</td>
                    <td>02/11/2025 - 04/11/2025</td>
                    <td className={styles.confirmed}>Xác nhận</td>
                  </tr>
                  <tr>
                    <td>Nguyễn Văn B</td>
                    <td>201</td>
                    <td>02/11/2025 - 04/11/2025</td>
                    <td className={styles.checkedIn}>Nhận phòng</td>
                  </tr>
                  <tr>
                    <td>Nguyễn Văn B</td>
                    <td>201</td>
                    <td>02/11/2025 - 04/11/2025</td>
                    <td className={styles.cancelled}>Hủy phòng</td>
                  </tr>
                  <tr>
                    <td>Nguyễn Văn B</td>
                    <td>201</td>
                    <td>02/11/2025 - 04/11/2025</td>
                    <td className={styles.completed}>Trả phòng</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className={styles.notifications}>
              <h3>Thông báo</h3>
              <ul>
                <li>Phòng 203 đã cập nhật trạng thái bảo trì</li>
                <li>Phòng 303 đã cập nhật trạng thái phòng trống</li>
                <li>Phòng 204 đã cập nhật trạng thái đã đặt</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
