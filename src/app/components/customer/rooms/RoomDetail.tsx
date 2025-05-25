import React, { useEffect, useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import Image from "next/image";
import styles from "./RoomDetail.module.css";
import { toast, ToastContainer } from "react-toastify";
import { useUser } from "@clerk/nextjs";

interface RoomDetailProps {
  show: boolean;
  onHide: () => void;
  room: {
    roomTypeId: number;
    image: string;
    name: string;
    reviews: number;
    rating: number;
    comments: string[];
    amenities: string;
    price: number;
  };
  checkIn: string;
  checkOut: string;
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return "Chưa chọn";
  return `${date.getDate().toString().padStart(2, "0")}/${(date.getMonth() + 1)
    .toString()
    .padStart(2, "0")}/${date.getFullYear()} - 12:00`;
}

function calculateNights(checkIn: string, checkOut: string): number {
  const inDate = new Date(checkIn);
  const outDate = new Date(checkOut);
  if (isNaN(inDate.getTime()) || isNaN(outDate.getTime())) return 0;
  const diffTime = outDate.getTime() - inDate.getTime();
  return Math.max(Math.ceil(diffTime / (1000 * 60 * 60 * 24)), 0);
}

export default function RoomDetail({
  show,
  onHide,
  room,
  checkIn,
  checkOut,
}: RoomDetailProps) {
  const [agreed, setAgreed] = useState(false);
  const nights = calculateNights(checkIn, checkOut);
  const total = nights * room.price;

  const { user } = useUser();

  const handleBooking = async () => {
    if (!user) {
      toast.error("Bạn cần đăng nhập để đặt phòng!");
      return;
    }

    const email = user.emailAddresses[0].emailAddress;

    try {
      const res = await fetch(
        "http://localhost:8080/api/payos/create-customer-link",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: new URLSearchParams({
            email,
            roomTypeId: room.roomTypeId.toString(),
            checkIn,
            checkOut,
          }),
        }
      );

      console.log("res", res);

      if (!res.ok) throw new Error("Gọi API thất bại");

      const data = await res.json();

      console.log("data", data);

      if (data.url) {
        toast.success("Chuyển hướng đến trang thanh toán!");
        window.location.href = data.url;
      } else {
        toast.error("Không lấy được link thanh toán");
      }
    } catch (err) {
      console.error(err);
      toast.error("Lỗi khi tạo link thanh toán!");
    }
  };

  useEffect(() => {
    if (!show) {
      setAgreed(false);
    }
  }, [show]);

  return (
    <Modal show={show} onHide={onHide} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Chi tiết đặt phòng - {room.name}</Modal.Title>
      </Modal.Header>

      <Modal.Body className={styles.modalBody}>
        <Image
          src={room.image}
          alt={room.name}
          width={500}
          height={300}
          className={styles.roomImage}
        />

        <div className={styles.details}>
          <p>
            <strong>Đánh giá:</strong> {room.rating} ⭐ ({room.reviews} lượt)
          </p>
          <p>
            <strong>Tiện ích:</strong> {room.amenities}
          </p>
          <p>
            <strong>Nhận xét:</strong> {room.comments.join(", ")}
          </p>
          <p>
            <strong>Giá:</strong> {room.price.toLocaleString("vi-VN")}₫ / đêm
          </p>
          <hr />
          <p>
            <strong>Ngày nhận phòng:</strong> {formatDate(checkIn)}
          </p>
          <p>
            <strong>Ngày trả phòng:</strong> {formatDate(checkOut)}
          </p>
        </div>

        <div className={styles.footer}>
          <div className={styles.terms}>
            <h4>Điều khoản đặt phòng</h4>
            <ul>
              <li>Không hoàn tiền khi hủy trong vòng 48 giờ trước check-in.</li>
              <li>
                Giờ nhận phòng: sau 12:00, trả phòng trước 12:00 ngày rời đi.
              </li>
              <li>Khách cần mang theo CCCD/hộ chiếu để nhận phòng.</li>
            </ul>
            <Form.Check
              type="checkbox"
              label="Tôi đã đọc các điều khoản và đồng ý đặt phòng"
              checked={agreed}
              onChange={() => setAgreed(!agreed)}
            />
          </div>

          <div className={styles.invoice}>
            <h4>Hóa đơn</h4>
            <div className={styles.invoiceItem}>
              <span className={styles.invoiceLabel}>Giá/đêm:</span>
              <span>{room.price.toLocaleString("vi-VN")}₫</span>
            </div>
            <div className={styles.invoiceItem}>
              <span className={styles.invoiceLabel}>Số đêm:</span>
              <span>{nights}</span>
            </div>
            <div className={styles.line}></div>
            <div className={styles.invoiceItem}>
              <span className={styles.invoiceLabel}>Tổng cộng:</span>
              <span>
                <strong>{total.toLocaleString("vi-VN")}₫</strong>
              </span>
            </div>
          </div>
        </div>
      </Modal.Body>

      <Modal.Footer>
        <Button
          className={styles.payButton}
          disabled={!agreed}
          variant="outline-success"
          onClick={handleBooking}
        >
          Đặt phòng
        </Button>
        <Button variant="outline-secondary" onClick={onHide}>
          Hủy
        </Button>
      </Modal.Footer>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        closeOnClick
        pauseOnHover
        draggable
      />
    </Modal>
  );
}
