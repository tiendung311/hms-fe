"use client";

import AdminHeader from "@/app/components/AdminHeader";
import AdminSidebar from "@/app/components/AdminSidebar";
import styles from "./style.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPen,
  faTrash,
  faSearch,
  faRotateLeft,
} from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";

interface Service {
  id: number;
  roomType: string;
  services: string[];
  rooms: number[];
}

export default function ServiceManage() {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [services, setServices] = useState<Service[]>([
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
  ]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const handleSearch = () => {
    const filteredServices = services.filter((service) =>
      service.roomType.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setServices(filteredServices);
  };

  const handleReset = () => {
    setSearchQuery("");
    setServices([
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
    ]);
  };

  return (
    <div className={styles.dashboardContainer}>
      <AdminSidebar />
      <div className={styles.mainContent}>
        <AdminHeader />
        <div className={styles.content}>
          <h2 className={styles.title}>Quản lý dịch vụ</h2>

          <div className={styles.searchContainer}>
            <input
              type="text"
              className={styles.searchInput}
              placeholder="Tìm kiếm..."
              value={searchQuery}
              onChange={handleSearchChange}
            />
            <button className={styles.searchButton} onClick={handleSearch}>
              <FontAwesomeIcon icon={faSearch} style={{ marginRight: 10 }} />
              Tìm kiếm
            </button>
            <button className={styles.resetButton} onClick={handleReset}>
              <FontAwesomeIcon
                icon={faRotateLeft}
                style={{ marginRight: 10 }}
              />
              Làm mới
            </button>
          </div>

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
