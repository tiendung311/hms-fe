"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import styles from "./edit.module.css";
import AdminHeader from "@/app/components/AdminHeader";
import AdminSidebar from "@/app/components/AdminSidebar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import { ToastContainer, toast } from "react-toastify";

export default function EditService() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string | undefined;

  const [roomType, setRoomType] = useState("");
  const [availableAmenities, setAvailableAmenities] = useState<string[]>([]);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return; // Tránh lỗi khi id chưa có

    const fetchData = async () => {
      try {
        const res = await fetch(
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
      await fetch(`http://localhost:8080/api/admin/room-type-services/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ services: selectedAmenities }),
      });
      toast.success("Cập nhật thành công!");
      setTimeout(() => {
        router.push("/admin/services");
      }, 2000);
    } catch (err) {
      console.error("Update failed:", err);
      toast.error("Cập nhật thất bại!");
    }
  };

  if (loading) return <div>Đang tải dữ liệu...</div>;
  if (!id) return <div>Lỗi: ID không hợp lệ.</div>;

  return (
    <div className={styles.dashboardContainer}>
      <AdminSidebar />
      <div className={styles.mainContent}>
        <AdminHeader />
        <div className={styles.content}>
          <div className={styles.breadcrumb}>
            <Link
              href="/admin/services"
              style={{
                textDecoration: "none",
                fontSize: "1.6rem",
                color: "#000",
              }}
            >
              Quản lý dịch vụ
            </Link>{" "}
            &gt; Chỉnh sửa
          </div>

          <div className={styles.formGroup}>
            <label>Loại phòng:</label>
            <input type="text" value={roomType || ""} disabled />
          </div>

          <div className={styles.amenityFilterContainer}>
            <select
              className={styles.filterSelect}
              onChange={handleAmenitySelect}
              disabled={
                availableAmenities.length === 0 ||
                selectedAmenities.length === availableAmenities.length
              }
            >
              <option value="">Chọn tiện ích</option>
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

          <div className={styles.buttonGroup}>
            <button onClick={handleUpdate} className={styles.updateButton}>
              Cập nhật
            </button>
            <button onClick={() => router.back()} className={styles.backButton}>
              Quay về
            </button>
          </div>

          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            closeOnClick
            pauseOnHover
            draggable
          />
        </div>
      </div>
    </div>
  );
}
