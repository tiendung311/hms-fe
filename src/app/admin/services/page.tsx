"use client";

import AdminHeader from "@/app/components/AdminHeader";
import AdminSidebar from "@/app/components/AdminSidebar";
import styles from "./style.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen, faTrash } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";

interface Service {
  id: number;
  roomType: string;
  services: string[];
  rooms: number[];
}

export default function ServiceManage() {
  const [services, setServices] = useState<Service[]>([]);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await fetch(
          "http://localhost:8080/api/admin/room-type-services"
        );
        if (!response.ok) throw new Error("Failed to fetch data");
        const data = await response.json();
        setServices(data);
      } catch (error) {
        console.error("Error fetching services:", error);
      }
    };

    fetchServices();
  }, []);

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
                {services.length === 0 ? (
                  <tr key="no-data">
                    <td colSpan={5} className={styles.emptyRow}>
                      Không có dữ liệu
                    </td>
                  </tr>
                ) : (
                  services.map((service, index) => (
                    <tr key={service.id ?? `${service.roomType}-${index}`}>
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
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
