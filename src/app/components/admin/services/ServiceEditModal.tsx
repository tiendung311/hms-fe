"use client";

import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";
import styles from "./ServiceEditModal.module.css";
import { useFetchWithAuth } from "@/app/utils/api";

interface ServiceEditModalProps {
  id: number;
  onClose: () => void;
  onUpdate: () => void;
}

export default function ServiceEditModal({
  id,
  onClose,
  onUpdate,
}: ServiceEditModalProps) {
  const fetchWithAuth = useFetchWithAuth();

  const [roomType, setRoomType] = useState("");
  const [availableAmenities, setAvailableAmenities] = useState<string[]>([]);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      try {
        const res = await fetchWithAuth(
          `http://localhost:8080/api/admin/room-type-services/${id}`
        );
        if (!res.ok)
          throw new Error("Không thể fetch dữ liệu room-type-services");
        const data = await res.json();
        setRoomType(data.roomType || "");
        setSelectedAmenities(Array.isArray(data.services) ? data.services : []);

        const allAmenitiesRes = await fetch(
          "http://localhost:8080/api/services/names"
        );
        if (!allAmenitiesRes.ok)
          throw new Error("Không thể fetch danh sách services");
        const allAmenities = await allAmenitiesRes.json();
        setAvailableAmenities(Array.isArray(allAmenities) ? allAmenities : []);
      } catch (err) {
        console.error("Lỗi khi tải dữ liệu:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleAmenitySelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    if (value && !selectedAmenities.includes(value)) {
      setSelectedAmenities((prev) => [...prev, value]);
    }
    e.target.value = "";
  };

  const removeAmenity = (amenity: string) => {
    setSelectedAmenities((prev) => prev.filter((a) => a !== amenity));
  };

  const handleUpdate = async () => {
    try {
      await fetchWithAuth(
        `http://localhost:8080/api/admin/room-type-services/${id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ services: selectedAmenities }),
        }
      );
      toast.success("Cập nhật thành công!");
      setTimeout(() => {
        onClose();
      }, 2000);
      onUpdate();
    } catch (err) {
      console.error("Update failed:", err);
      toast.error("Cập nhật thất bại!");
    }
  };

  if (loading) return null;
  if (!id) return <div>Lỗi: ID không hợp lệ.</div>;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h2>Chỉnh sửa dịch vụ</h2>

        <p>
          <strong>Loại phòng:</strong>
          <input
            type="text"
            className={styles.editableInput}
            value={roomType}
            disabled
          />
        </p>

        <p>
          <strong>Chọn tiện ích:</strong>
          <select
            className={styles.editableInput}
            onChange={handleAmenitySelect}
            disabled={
              availableAmenities.length === 0 ||
              selectedAmenities.length === availableAmenities.length
            }
          >
            <option value="">-- Chọn --</option>
            {availableAmenities.map((amenity) => (
              <option
                key={amenity}
                value={amenity}
                disabled={selectedAmenities.includes(amenity)}
              >
                {amenity}
              </option>
            ))}
          </select>
        </p>

        <div style={{ marginBottom: "10px" }}>
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
            <span className={styles.placeholder}>Không có tiện ích nào</span>
          )}
        </div>

        <div className={styles.btnGroup}>
          <button className={`${styles.saveBtn}`} onClick={handleUpdate}>
            Cập nhật
          </button>
          <button className={`${styles.backBtn}`} onClick={onClose}>
            Quay về
          </button>
        </div>
      </div>
    </div>
  );
}
