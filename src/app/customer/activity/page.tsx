"use client";

import { useState } from "react";
import CustomerHeader from "@/app/components/CustomerHeader";
import { Container } from "react-bootstrap";
import styles from "./page.module.css";
import BookingActivity from "@/app/components/customer/bookings/BookingActivity";
import BookingDetail from "@/app/components/customer/bookings/BookingDetail";

type Booking = {
  id: number;
  roomType: string;
  roomNumber: string;
  amenities: string[];
  status: string;
  checkIn: string;
  checkOut: string;
  price: number;
};

const bookings = [
  {
    id: 1,
    roomType: "Phòng đơn - 3 sao",
    roomNumber: "101",
    amenities: ["WiFi", "Điều hòa", "Tivi"],
    status: "Xác nhận",
    checkIn: "12:00 15/03/2025",
    checkOut: "12:00 17/03/2025",
    price: 1000000,
  },
  {
    id: 2,
    roomType: "Phòng đôi - 4 sao",
    roomNumber: "202",
    amenities: ["WiFi", "Bồn tắm", "Mini bar"],
    status: "Trả phòng",
    checkIn: "12:00 29/02/2025",
    checkOut: "12:00 02/03/2025",
    price: 2000000,
  },
  {
    id: 3,
    roomType: "Phòng đơn - 5 sao",
    roomNumber: "303",
    amenities: ["WiFi", "Hồ bơi riêng", "Máy pha cà phê"],
    status: "Hủy phòng",
    checkIn: "12:00 20/02/2025",
    checkOut: "12:00 21/02/2025",
    price: 3000000,
  },
  {
    id: 4,
    roomType: "Phòng đôi - 3 sao",
    roomNumber: "404",
    amenities: ["WiFi", "Điều hòa", "Tivi"],
    status: "Nhận phòng",
    checkIn: "12:00 15/03/2025",
    checkOut: "12:00 17/03/2025",
    price: 4000000,
  },
];

export default function Activity() {
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  const handleSelectBooking = (booking: Booking) => {
    setSelectedBooking(booking);
  };

  return (
    <Container>
      <CustomerHeader />

      {selectedBooking ? (
        <BookingDetail
          booking={selectedBooking}
          onBack={() => setSelectedBooking(null)}
        />
      ) : (
        <>
          <h1 className={styles.heading}>Hoạt động</h1>
          {bookings.some(({ status }) =>
            ["Chờ", "Xác nhận", "Nhận phòng"].includes(status)
          ) ? (
            bookings
              .filter(({ status }) =>
                ["Chờ", "Xác nhận", "Nhận phòng"].includes(status)
              )
              .map((booking) => (
                <BookingActivity
                  key={booking.id}
                  roomType={booking.roomType}
                  status={booking.status}
                  time={`${booking.checkIn} - ${booking.checkOut}`}
                  onClick={() => handleSelectBooking(booking)}
                />
              ))
          ) : (
            <p className={styles.noti}>Không có hoạt động hiện tại</p>
          )}

          <h1 className={styles.heading}>Gần đây</h1>
          {bookings.some(({ status }) =>
            ["Trả phòng", "Hủy phòng"].includes(status)
          ) ? (
            bookings
              .filter(({ status }) =>
                ["Trả phòng", "Hủy phòng"].includes(status)
              )
              .map((booking) => (
                <BookingActivity
                  key={booking.id}
                  roomType={booking.roomType}
                  status={booking.status}
                  time={`${booking.checkIn} - ${booking.checkOut}`}
                  onClick={() => handleSelectBooking(booking)}
                />
              ))
          ) : (
            <p className={styles.noti}>Không có hoạt động nào gần đây</p>
          )}
        </>
      )}
    </Container>
  );
}
