"use client";

import { useState, useEffect } from "react";
import { Button, Container } from "react-bootstrap";
import styles from "./style.module.css";
import CustomerHeader from "@/app/components/CustomerHeader";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRotateLeft, faSearch } from "@fortawesome/free-solid-svg-icons";
import RoomFilter from "@/app/components/customer/rooms/RoomFilter";

export default function Booking() {
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);
  const [selectedStar, setSelectedStar] = useState<number | null>(null);
  const [minPrice, setMinPrice] = useState(500000);
  const [maxPrice, setMaxPrice] = useState(5000000);
  const [isClient, setIsClient] = useState(false);
  const today = new Date().toISOString().split("T")[0];

  const rooms = [
    {
      image: "/assets/single-4star.jpg",
      name: "Phòng đơn",
      stars: 4,
      reviews: 20,
      rating: 3.5,
      comments: ["Thoải mái", "Sạch sẽ", "Nhân viên thân thiện"],
      amenities: "Tivi 4K, buffet sáng, bồn tắm",
      status: "Còn phòng",
      price: 1000000,
    },
    {
      image: "/assets/double-5star.jpg",
      name: "Phòng đôi",
      stars: 5,
      reviews: 35,
      rating: 4.8,
      comments: ["Rộng rãi", "Giường êm", "Dịch vụ tuyệt vời"],
      amenities: "Hồ bơi, spa, phòng gym",
      status: "Hết phòng",
      price: 2500000,
    },
  ];

  // Ngăn lỗi SSR bằng cách chờ đến khi component render trên client
  useEffect(() => {
    setIsClient(true);
  }, []);

  const toggleRoom = (room: string) => {
    setSelectedRoom(selectedRoom === room ? null : room);
  };

  const toggleStar = (star: number) => {
    setSelectedStar(selectedStar === star ? null : star);
  };

  const resetFilters = () => {
    setSelectedRoom(null);
    setSelectedStar(null);
    setMinPrice(500000);
    setMaxPrice(5000000);

    // Đặt lại giá trị cho input date
    (document.getElementById("check-in") as HTMLInputElement).value = "";
    (document.getElementById("check-out") as HTMLInputElement).value = "";
  };

  // Format tiền tệ
  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("vi-VN").format(value);

  return (
    <Container>
      <CustomerHeader />
      <div className={styles.bookingContainer}>
        <div className={styles.sidebar}>
          <div className={styles.filterGroup}>
            <h4>Loại phòng:</h4>
            <div
              className={`${styles.filterItem} ${
                selectedRoom === "single" ? styles.filterItemActive : ""
              }`}
              onClick={() => toggleRoom("single")}
            >
              <span>Phòng đơn</span>
            </div>
            <div
              className={`${styles.filterItem} ${
                selectedRoom === "double" ? styles.filterItemActive : ""
              }`}
              onClick={() => toggleRoom("double")}
            >
              <span>Phòng đôi</span>
            </div>
          </div>

          <div className={styles.filterGroup}>
            <h4>Số sao:</h4>
            {[3, 4, 5].map((star) => (
              <div
                key={star}
                className={`${styles.filterItem} ${
                  selectedStar === star ? styles.filterItemActive : ""
                }`}
                onClick={() => toggleStar(star)}
              >
                <span>{star} ⭐</span>
              </div>
            ))}
          </div>

          {isClient && ( // Đảm bảo chỉ render sau khi client-side mount
            <div className={styles.filterGroup}>
              <h4>
                Ngân Sách:
                <p>
                  ({formatCurrency(minPrice)}đ - {formatCurrency(maxPrice)}đ)
                </p>
              </h4>
              <div className={styles.priceSlider}>
                <input
                  className={styles.input}
                  type="range"
                  min="500000"
                  max="5000000"
                  step="50000"
                  value={minPrice}
                  onChange={(e) => {
                    const value = Number(e.target.value);
                    if (value <= maxPrice) setMinPrice(value);
                  }}
                />
                <input
                  className={styles.input}
                  type="range"
                  min="500000"
                  max="5000000"
                  step="50000"
                  value={maxPrice}
                  onChange={(e) => {
                    const value = Number(e.target.value);
                    if (value >= minPrice) setMaxPrice(value);
                  }}
                />
              </div>
            </div>
          )}
        </div>

        <div className={styles.content}>
          <div className={styles.searchBar}>
            <div className={styles.inputGroups}>
              <input
                className={styles.input}
                type="date"
                id="check-in"
                min={today}
                placeholder=" "
              />
              <label htmlFor="check-in">Ngày nhận phòng</label>
            </div>
            <div className={styles.inputGroups}>
              <input
                className={styles.input}
                type="date"
                id="check-out"
                min={today}
                placeholder=" "
              />
              <label htmlFor="check-out">Ngày trả phòng</label>
            </div>
            <Button id={styles.searchBtn} variant="outline-warning">
              <FontAwesomeIcon icon={faSearch} />
            </Button>
            <Button
              id={styles.resetBtn}
              variant="outline-secondary"
              onClick={resetFilters}
            >
              <FontAwesomeIcon icon={faRotateLeft} />
            </Button>
          </div>

          <div className={styles.resultBox}>
            {/* <p>Hiển thị danh sách phòng tại đây...</p> */}
            {rooms.length > 0 ? (
              rooms.map((room, index) => (
                <RoomFilter
                  key={index}
                  image={room.image}
                  name={room.name}
                  stars={room.stars}
                  reviews={room.reviews}
                  rating={room.rating}
                  comments={room.comments}
                  amenities={room.amenities}
                  status={room.status}
                  price={room.price}
                />
              ))
            ) : (
              <p className={styles.noRoomMessage}>
                Không có phòng nào phù hợp với tiêu chí lọc.
              </p>
            )}
          </div>
        </div>
      </div>
    </Container>
  );
}
