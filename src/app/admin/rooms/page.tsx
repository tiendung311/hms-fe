"use client";

import { useEffect, useState } from "react";
import AdminHeader from "@/app/components/AdminHeader";
import AdminSidebar from "@/app/components/AdminSidebar";
import AdminPagination from "../AdminPagination";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEye,
  faPen,
  faTrash,
  faTimes,
  faRotateLeft,
} from "@fortawesome/free-solid-svg-icons";
import styles from "./style.module.css";

const ROOM_TYPES = [
  "Đơn 3 sao",
  "Đơn 4 sao",
  "Đơn 5 sao",
  "Đôi 3 sao",
  "Đôi 4 sao",
  "Đôi 5 sao",
];
const ROOM_STATUSES = ["Còn trống", "Đã đặt"];
const ROOM_AMENITIES = ["WiFi", "TV", "Máy lạnh", "Bồn tắm", "Ban công"];

interface Room {
  id: number;
  number: string;
  type: string;
  amenities: string[];
  status: string;
}

const PAGE_SIZE = 10;

export default function RoomManage() {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState<string>("");
  const [roomTypeFilter, setRoomTypeFilter] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [rooms] = useState<Room[]>(
    Array.from({ length: 25 }, (_, i) => ({
      id: i + 1,
      number: `${100 + (i % 10)}`,
      type: ROOM_TYPES[i % ROOM_TYPES.length],
      amenities: ROOM_AMENITIES.slice(0, (i % ROOM_AMENITIES.length) + 1),
      status: ROOM_STATUSES[i % ROOM_STATUSES.length],
    }))
  );

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 300);

    return () => {
      clearTimeout(handler);
    };
  }, [searchQuery]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const handleFilterChange = (
    event: React.ChangeEvent<HTMLSelectElement>,
    setFilter: (value: string) => void
  ) => {
    setFilter(event.target.value);
  };

  const handleAmenitySelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedAmenity = event.target.value;
    if (selectedAmenity && !selectedAmenities.includes(selectedAmenity)) {
      setSelectedAmenities([...selectedAmenities, selectedAmenity]);
    }
  };

  const removeAmenity = (amenity: string) => {
    setSelectedAmenities(selectedAmenities.filter((item) => item !== amenity));
  };

  const handleReset = () => {
    setSearchQuery("");
    setRoomTypeFilter("");
    setStatusFilter("");
    setSelectedAmenities([]);
    setCurrentPage(1);

    if (typeof window !== "undefined") {
      const amenitySelect = document.getElementById(
        "amenitySelect"
      ) as HTMLSelectElement;
      if (amenitySelect) {
        amenitySelect.value = "";
      }
    }
  };

  const filteredRooms = rooms.filter(
    (room) =>
      room.number.includes(debouncedSearchQuery) &&
      (roomTypeFilter ? room.type === roomTypeFilter : true) &&
      (statusFilter ? room.status === statusFilter : true) &&
      (selectedAmenities.length
        ? selectedAmenities.every((amenity) => room.amenities.includes(amenity))
        : true)
  );

  const totalPages = Math.ceil(filteredRooms.length / PAGE_SIZE);
  const currentRooms = filteredRooms.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  return (
    <div className={styles.dashboardContainer}>
      <AdminSidebar />
      <div className={styles.mainContent}>
        <AdminHeader />
        <div className={styles.content}>
          <h2 className={styles.title}>Quản lý phòng</h2>

          <div className={styles.searchContainer}>
            <input
              type="text"
              className={styles.searchInput}
              placeholder="Tìm kiếm theo số phòng..."
              value={searchQuery}
              onChange={handleSearchChange}
            />

            <select
              className={styles.filterSelect}
              value={roomTypeFilter}
              onChange={(e) => handleFilterChange(e, setRoomTypeFilter)}
            >
              <option value="">Loại phòng</option>
              {ROOM_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>

            <select
              className={styles.filterSelect}
              value={statusFilter}
              onChange={(e) => handleFilterChange(e, setStatusFilter)}
            >
              <option value="">Trạng thái</option>
              {ROOM_STATUSES.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>

            <button className={styles.resetButton} onClick={handleReset}>
              <FontAwesomeIcon icon={faRotateLeft} style={{ marginRight: 5 }} />
              Làm mới
            </button>
          </div>

          <div className={styles.amenityFilterContainer}>
            <select
              className={styles.filterSelect}
              id="amenitySelect"
              onChange={handleAmenitySelect}
              disabled={selectedAmenities.length === ROOM_AMENITIES.length}
            >
              <option value="">Chọn tiện ích</option>
              {ROOM_AMENITIES.map((amenity) => (
                <option
                  key={amenity}
                  value={amenity}
                  disabled={selectedAmenities.includes(amenity)}
                >
                  {amenity}
                </option>
              ))}
            </select>

            <div className={styles.selectedAmenitiesBox}>
              {selectedAmenities.length > 0 ? (
                selectedAmenities.map((amenity) => (
                  <span key={amenity} className={styles.amenityTag}>
                    {amenity}
                    <FontAwesomeIcon
                      icon={faTimes}
                      className={styles.removeIcon}
                      onClick={() => removeAmenity(amenity)}
                    />
                  </span>
                ))
              ) : (
                <span className={styles.placeholder}>
                  Không có tiện ích nào
                </span>
              )}
            </div>
          </div>

          <div className={styles.tableContainer}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>STT</th>
                  <th>Phòng</th>
                  <th>Loại phòng</th>
                  <th>Tiện ích</th>
                  <th>Trạng thái</th>
                  <th>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {currentRooms.map((room, index) => (
                  <tr key={room.id}>
                    <td>{(currentPage - 1) * PAGE_SIZE + index + 1}</td>
                    <td>{room.number}</td>
                    <td>{room.type}</td>
                    <td>{room.amenities.join(", ")}</td>
                    <td
                      className={styles.status}
                      style={{
                        color:
                          room.status === "Còn trống"
                            ? "var(--main-green)"
                            : "orange",
                      }}
                    >
                      {room.status}
                    </td>
                    <td className={styles.actions}>
                      <FontAwesomeIcon
                        icon={faEye}
                        className={`${styles.icon} ${styles.view}`}
                      />
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

          <AdminPagination
            totalPages={totalPages}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>
    </div>
  );
}
