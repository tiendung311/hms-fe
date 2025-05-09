"use client";

import AdminHeader from "@/app/components/AdminHeader";
import AdminSidebar from "@/app/components/AdminSidebar";
import styles from "./style.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import ServiceEditModal from "@/app/components/admin/services/ServiceEditModal";
import { ToastContainer } from "react-toastify";

interface Service {
  id: number;
  serviceId: number;
  roomType: string;
  services: string[];
}

export default function ServiceManage() {
  const [services, setServices] = useState<Service[]>([]);
  const [selectedServiceId, setSelectedServiceId] = useState<number | null>(
    null
  );

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

  useEffect(() => {
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
                  <th>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {services.length === 0 ? (
                  <tr key="no-data">
                    <td colSpan={4} className={styles.emptyRow}>
                      Không có dữ liệu
                    </td>
                  </tr>
                ) : (
                  services.map((service, index) => (
                    <tr key={service.id ?? `${service.roomType}-${index}`}>
                      <td>{index + 1}</td>
                      <td>{service.roomType}</td>
                      <td>{service.services.join(", ")}</td>
                      <td className={styles.actions}>
                        <FontAwesomeIcon
                          icon={faPen}
                          className={`${styles.icon} ${styles.edit}`}
                          title="Cập nhật"
                          onClick={() =>
                            setSelectedServiceId(service.serviceId)
                          }
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

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        closeOnClick
        pauseOnHover
        draggable
      />

      {selectedServiceId && (
        <ServiceEditModal
          id={selectedServiceId}
          onClose={() => setSelectedServiceId(null)}
          onUpdate={() => {
            setSelectedServiceId(null);
            fetchServices();
          }}
        />
      )}
    </div>
  );
}
