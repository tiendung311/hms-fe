"use client";

import AdminHeader from "@/app/components/AdminHeader";
import AdminSidebar from "@/app/components/AdminSidebar";
import styles from "./style.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen, faTrash } from "@fortawesome/free-solid-svg-icons";

interface Service {
  id: number;
  roomType: string;
  services: string[];
  rooms: number[];
}

export default function ServiceManage() {
  const services: Service[] = [
    {
      id: 1,
      roomType: "Đơn 3 sao",
      services: ["Wifi", "TV", "Mini Bar"],
      rooms: [101, 102],
    },
    {
      id: 2,
      roomType: "Đôi 3 sao",
      services: ["Wifi", "TV"],
      rooms: [103, 104],
    },
    {
      id: 3,
      roomType: "Đơn 4 sao",
      services: ["Wifi", "TV", "Bồn tắm"],
      rooms: [105, 106],
    },
    {
      id: 4,
      roomType: "Đôi 4 sao",
      services: ["Wifi", "TV", "Bồn tắm", "Ban công"],
      rooms: [107, 108],
    },
    {
      id: 5,
      roomType: "Đơn 5 sao",
      services: ["Wifi", "TV", "Bồn tắm", "Ban công", "Spa"],
      rooms: [109, 110],
    },
    {
      id: 6,
      roomType: "Đôi 5 sao",
      services: ["Wifi", "TV", "Bồn tắm", "Ban công", "Spa", "Hồ bơi"],
      rooms: [111, 112],
    },
  ];

  return (
    <div className={styles.dashboardContainer}>
      <AdminSidebar />
      <div className={styles.mainContent}>
        <AdminHeader />
        <div className={styles.content}>
          <h2 className={styles.title}>Quản lý dịch vụ</h2>

          <div className={styles.tableContainer}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>STT</th>
                  <th>Loại phòng</th>
                  <th>Dịch vụ</th>
                  <th>Phòng</th>
                  <th>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {services.map((service, index) => (
                  <tr key={service.id}>
                    <td>{index + 1}</td>
                    <td>{service.roomType}</td>
                    <td>{service.services.join(", ")}</td>
                    <td>{service.rooms.join(", ")}</td>
                    <td className={styles.actions}>
                      <FontAwesomeIcon
                        icon={faPen}
                        className={`${styles.icon} ${styles.edit}`}
                      />
                      <FontAwesomeIcon
                        icon={faTrash}
                        className={`${styles.icon} ${styles.delete}`}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
