"use client";

import { useState, useEffect } from "react";
import { Button, Container } from "react-bootstrap";
import styles from "./style.module.css";
import CustomerHeader from "@/app/components/CustomerHeader";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRotateLeft, faSearch } from "@fortawesome/free-solid-svg-icons";
import RoomFilter from "@/app/components/customer/rooms/RoomFilter";
import { ToastContainer, toast } from "react-toastify";
import RoomDetail from "@/app/components/customer/rooms/RoomDetail";

interface RoomAvailableDTO {
  roomTypeId: number;
  roomName: string;
  services: string[];
  price: number;
}

type MockRoomData = {
  image: string;
  reviews: number;
  rating: number;
  comments: string[];
};

interface RoomWithMock extends RoomAvailableDTO {
  image: string;
  reviews: number;
  rating: number;
  comments: string[];
}

export default function Booking() {
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);
  const [selectedStar, setSelectedStar] = useState<number | null>(null);
  const [minPrice, setMinPrice] = useState(500000);
  const [maxPrice, setMaxPrice] = useState(5000000);
  const [isClient, setIsClient] = useState(false);
  const today = new Date().toISOString().split("T")[0];
  const [filteredRooms, setFilteredRooms] = useState<RoomWithMock[]>([]);

  const [initialMinPrice, setInitialMinPrice] = useState(0);
  const [initialMaxPrice, setInitialMaxPrice] = useState(0);

  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedRoomDetail, setSelectedRoomDetail] =
    useState<RoomWithMock | null>(null);

  const [checkInDate, setCheckInDate] = useState("");
  const [checkOutDate, setCheckOutDate] = useState("");

  const searchRooms = async () => {
    const checkIn = (document.getElementById("check-in") as HTMLInputElement)
      .value;
    const checkOut = (document.getElementById("check-out") as HTMLInputElement)
      .value;

    setCheckInDate(checkIn);
    setCheckOutDate(checkOut);

    if (!checkIn || !checkOut) {
      toast.warning("Vui lòng chọn ngày nhận và trả phòng!");
      return;
    }

    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);

    if (checkInDate >= checkOutDate) {
      toast.error("Ngày nhận phòng phải trước ngày trả phòng!");
      return;
    }

    const payload = {
      type: selectedRoom || "",
      star: selectedStar || null,
      minPrice,
      maxPrice,
      checkInDate: checkIn,
      checkOutDate: checkOut,
    };

    try {
      const res = await fetch("http://localhost:8080/api/available-rooms", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // nếu BE dùng session/cookie
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error(`Lỗi API: ${res.status}`);
      }

      const data: RoomAvailableDTO[] = await res.json();
      console.log("API rooms:", data);

      const dataWithMock = data.map((room) => {
        const mock = getMockData(room.roomName);
        return {
          ...room,
          image: mock.image,
          reviews: mock.reviews,
          rating: mock.rating,
          comments: mock.comments,
        };
      });

      setFilteredRooms(dataWithMock);
      if (dataWithMock.length === 0) {
        toast.info("Không tìm thấy phòng phù hợp với tiêu chí lọc!");
      } else {
        toast.success("Tìm thấy phòng phù hợp!");
      }
    } catch (error) {
      console.error("Lỗi khi gọi API:", error);
      toast.error("Đã xảy ra lỗi khi tìm phòng. Vui lòng thử lại!");
    }
  };

  const mockData: Record<string, MockRoomData> = {
    "Đơn 3 sao": {
      image: "/assets/single-3star.jpg",
      reviews: 12,
      rating: 3.2,
      comments: ["Ổn áp", "Yên tĩnh", "Dễ chịu"],
    },
    "Đơn 4 sao": {
      image: "/assets/single-4star.jpg",
      reviews: 20,
      rating: 3.5,
      comments: ["Thoải mái", "Sạch sẽ", "Nhân viên thân thiện"],
    },
    "Đơn 5 sao": {
      image: "/assets/single-5star.jpg",
      reviews: 27,
      rating: 4.0,
      comments: ["Tiện nghi", "Đầy đủ", "Thân thiện"],
    },
    "Đôi 3 sao": {
      image: "/assets/double-3star.jpg",
      reviews: 25,
      rating: 3.8,
      comments: ["Ổn định", "Tốt", "Đủ dùng"],
    },
    "Đôi 4 sao": {
      image: "/assets/double-4star.jpg",
      reviews: 30,
      rating: 4.3,
      comments: ["Tiện nghi", "Sạch sẽ", "Nhân viên dễ thương"],
    },
    "Đôi 5 sao": {
      image: "/assets/double-5star.jpg",
      reviews: 35,
      rating: 4.8,
      comments: ["Rộng rãi", "Giường êm", "Dịch vụ tuyệt vời"],
    },
  };

  const getMockData = (roomName: string) => {
    return (
      mockData[roomName] || {
        image: "/assets/default-room.jpg",
        reviews: 0,
        rating: 0,
        comments: [],
      }
    );
  };

  useEffect(() => {
    const fetchMinMaxPrice = async () => {
      try {
        const [minRes, maxRes] = await Promise.all([
          fetch("http://localhost:8080/api/room/min-price", {
            credentials: "include",
          }),
          fetch("http://localhost:8080/api/room/max-price", {
            credentials: "include",
          }),
        ]);

        if (!minRes.ok || !maxRes.ok) {
          throw new Error("Không thể lấy dữ liệu giá");
        }

        const min = await minRes.json();
        const max = await maxRes.json();

        setInitialMinPrice(min);
        setInitialMaxPrice(max);
        setMinPrice(min);
        setMaxPrice(max);
      } catch (error) {
        console.error("Lỗi khi fetch min/max price:", error);
        toast.error("Không thể lấy dữ liệu giá phòng.");
      }
    };

    fetchMinMaxPrice();
  }, []);

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

    setMinPrice(initialMinPrice);
    setMaxPrice(initialMaxPrice);

    // Đặt lại giá trị cho input date
    (document.getElementById("check-in") as HTMLInputElement).value = "";
    (document.getElementById("check-out") as HTMLInputElement).value = "";

    setFilteredRooms([]);
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
                selectedRoom === "Đơn" ? styles.filterItemActive : ""
              }`}
              onClick={() => toggleRoom("Đơn")}
            >
              <span>Phòng đơn</span>
            </div>
            <div
              className={`${styles.filterItem} ${
                selectedRoom === "Đôi" ? styles.filterItemActive : ""
              }`}
              onClick={() => toggleRoom("Đôi")}
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
                  min={initialMinPrice}
                  max={initialMaxPrice}
                  step="5000"
                  value={minPrice}
                  onChange={(e) => {
                    const value = Number(e.target.value);
                    if (value <= maxPrice) setMinPrice(value);
                  }}
                />
                <input
                  className={styles.input}
                  type="range"
                  min={initialMinPrice}
                  max={initialMaxPrice}
                  step="5000"
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
            <Button
              id={styles.searchBtn}
              variant="outline-warning"
              onClick={searchRooms}
            >
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
            {filteredRooms.length > 0 ? (
              filteredRooms.map((room, index) => (
                <RoomFilter
                  key={index}
                  image={room.image}
                  name={room.roomName}
                  reviews={room.reviews}
                  rating={room.rating}
                  comments={room.comments}
                  amenities={room.services.join(", ")}
                  price={room.price}
                  onViewDetail={() => {
                    setSelectedRoomDetail(room);
                    setShowDetailModal(true);
                  }}
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

      {selectedRoomDetail && (
        <RoomDetail
          show={showDetailModal}
          onHide={() => setShowDetailModal(false)}
          room={{
            roomTypeId: selectedRoomDetail.roomTypeId,
            image: selectedRoomDetail.image,
            name: selectedRoomDetail.roomName,
            reviews: selectedRoomDetail.reviews,
            rating: selectedRoomDetail.rating,
            comments: selectedRoomDetail.comments,
            amenities: selectedRoomDetail.services.join(", "),
            price: selectedRoomDetail.price,
          }}
          checkIn={checkInDate}
          checkOut={checkOutDate}
        />
      )}

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        closeOnClick
        pauseOnHover
        draggable
      />
    </Container>
  );
}
