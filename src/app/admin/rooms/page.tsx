"use client";

import { useEffect, useState } from "react";
import AdminHeader from "@/app/components/AdminHeader";
import AdminSidebar from "@/app/components/AdminSidebar";
import AdminPagination from "../AdminPagination";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTimes,
  faRotateLeft,
  faWrench,
  faCheckCircle,
} from "@fortawesome/free-solid-svg-icons";
import styles from "./style.module.css";
import { ToastContainer, toast } from "react-toastify";
import { useFetchWithAuth } from "@/app/utils/api";
import RequireAdmin from "@/app/components/RequireAdmin";

interface Room {
  roomNumber: string;
  roomType: string;
  roomServices: string[];
  roomStatus: string;
}

const PAGE_SIZE = 10;

export default function RoomManage() {
  const fetchWithAuth = useFetchWithAuth();

  const [searchQuery, setSearchQuery] = useState<string>("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState<string>("");
  const [roomTypeFilter, setRoomTypeFilter] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [rooms, setRooms] = useState<Room[]>([]);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await fetchWithAuth(
          "http://localhost:8080/api/admin/rooms"
        );
        if (!response.ok) throw new Error("Failed to fetch data");
        const data = await response.json();
        setRooms(data);
      } catch (error) {
        console.error("Error fetching rooms:", error);
      }
    };

    fetchRooms();
  }, [fetchWithAuth]);

  const [roomStatuses, setRoomStatuses] = useState<string[]>([]);

  useEffect(() => {
    const fetchRoomStatuses = async () => {
      try {
        const response = await fetchWithAuth(
          "http://localhost:8080/api/rooms/status"
        );
        if (!response.ok) throw new Error("Failed to fetch room statuses");
        const data = await response.json();
        setRoomStatuses(data);
      } catch (error) {
        console.error("Error fetching room statuses:", error);
      }
    };

    fetchRoomStatuses();
  }, [fetchWithAuth]);

  const [services, setServices] = useState<string[]>([]);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await fetchWithAuth(
          "http://localhost:8080/api/services/names"
        );
        if (!response.ok) throw new Error("Failed to fetch services");
        const data = await response.json();
        setServices(data);
      } catch (error) {
        console.error("Error fetching services:", error);
      }
    };

    fetchServices();
  }, [fetchWithAuth]);

  const [roomTypes, setRoomTypes] = useState<string[]>([]);

  useEffect(() => {
    const fetchRoomTypes = async () => {
      try {
        const response = await fetchWithAuth(
          "http://localhost:8080/api/room-types"
        );
        if (!response.ok) throw new Error("Failed to fetch room types");
        const data = await response.json();
        setRoomTypes(data);
      } catch (error) {
        console.error("Error fetching room types:", error);
      }
    };

    fetchRoomTypes();
  }, [fetchWithAuth]);

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

  const filteredRooms = rooms.filter((room) => {
    const matchesSearch = debouncedSearchQuery
      ? room.roomNumber
          ?.toLowerCase()
          .includes(debouncedSearchQuery.toLowerCase())
      : true;

    const matchesRoomType = roomTypeFilter
      ? room.roomType === roomTypeFilter
      : true;
    const matchesStatus = statusFilter
      ? room.roomStatus === statusFilter
      : true;
    const matchesAmenities = selectedAmenities.length
      ? selectedAmenities.every((amenity) =>
          Array.isArray(room.roomServices)
            ? room.roomServices.includes(amenity)
            : false
        )
      : true;

    return (
      matchesSearch && matchesRoomType && matchesStatus && matchesAmenities
    );
  });

  const toggleRoomMaintenance = async (roomNumber: string) => {
    try {
      const response = await fetchWithAuth(
        `http://localhost:8080/api/admin/rooms/${roomNumber}/toggle-maintenance`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Thao tác thất bại");
      }

      toast.success(`Đã cập nhật trạng thái phòng ${roomNumber}`);

      setRooms((prevRooms) =>
        prevRooms.map((room) =>
          room.roomNumber === roomNumber
            ? {
                ...room,
                roomStatus: room.roomStatus === "Trống" ? "Bảo trì" : "Trống",
              }
            : room
        )
      );
    } catch (err) {
      console.error("Toggle failed:", err);
      toast.error("Không thể cập nhật trạng thái phòng");
    }
  };

  const totalPages = Math.ceil(filteredRooms.length / PAGE_SIZE);
  const currentRooms = filteredRooms.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearchQuery, roomTypeFilter, statusFilter, selectedAmenities]);

  return (
    <RequireAdmin>
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
                {roomTypes.length > 0 ? (
                  roomTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))
                ) : (
                  <option disabled>Chưa có dữ liệu trong danh sách</option>
                )}
              </select>

              <select
                className={styles.filterSelect}
                value={statusFilter}
                onChange={(e) => handleFilterChange(e, setStatusFilter)}
              >
                <option value="">Trạng thái</option>
                {roomStatuses.length > 0 ? (
                  roomStatuses.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))
                ) : (
                  <option disabled>Chưa có dữ liệu trong danh sách</option>
                )}
              </select>

              <button className={styles.resetButton} onClick={handleReset}>
                <FontAwesomeIcon
                  icon={faRotateLeft}
                  style={{ marginRight: 5 }}
                />
                Làm mới
              </button>
            </div>

            <div className={styles.amenityFilterContainer}>
              <select
                className={styles.filterSelect}
                id="amenitySelect"
                onChange={handleAmenitySelect}
                disabled={
                  services.length === 0 ||
                  selectedAmenities.length === services.length
                }
              >
                <option value="">Chọn tiện ích</option>
                {services.map((amenity) => (
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
                  {currentRooms.length === 0 ? (
                    <tr key="no-data">
                      <td colSpan={6} className={styles.emptyRow}>
                        Không có dữ liệu
                      </td>
                    </tr>
                  ) : (
                    currentRooms.map((room, index) => (
                      <tr key={`${room.roomNumber}-${index}`}>
                        <td>{(currentPage - 1) * PAGE_SIZE + index + 1}</td>
                        <td>{room.roomNumber}</td>
                        <td>{room.roomType}</td>
                        <td>
                          {room.roomServices?.join(", ") ??
                            "Không có tiện nghi"}
                        </td>
                        <td className={styles.status}>
                          <span
                            className={
                              room.roomStatus === "Trống"
                                ? styles.textGreen
                                : room.roomStatus === "Đã đặt"
                                ? styles.textRed
                                : room.roomStatus === "Chờ"
                                ? styles.textOrange
                                : styles.textGrey
                            }
                          >
                            {room.roomStatus}
                          </span>
                        </td>
                        <td className={styles.actions}>
                          {["Trống", "Đã đặt", "Chờ"].includes(
                            room.roomStatus
                          ) ? (
                            <FontAwesomeIcon
                              icon={faWrench}
                              className={`${styles.icon} ${styles.delete}`}
                              title="Chuyển sang bảo trì"
                              onClick={() =>
                                toggleRoomMaintenance(room.roomNumber)
                              }
                              style={{ cursor: "pointer" }}
                            />
                          ) : room.roomStatus === "Bảo trì" ? (
                            <FontAwesomeIcon
                              icon={faCheckCircle}
                              className={styles.icon}
                              title="Kết thúc bảo trì"
                              onClick={() =>
                                toggleRoomMaintenance(room.roomNumber)
                              }
                              style={{ color: "green", cursor: "pointer" }}
                            />
                          ) : null}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <ToastContainer
              position="top-right"
              autoClose={3000}
              hideProgressBar={false}
              closeOnClick
              pauseOnHover
              draggable
            />

            <AdminPagination
              totalPages={totalPages}
              currentPage={currentPage}
              onPageChange={setCurrentPage}
            />
          </div>
        </div>
      </div>
    </RequireAdmin>
  );
}
