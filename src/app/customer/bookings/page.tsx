"use client";

import { useState } from "react";
import CustomerHeader from "@/app/components/CustomerHeader";
import { Container } from "react-bootstrap";
import "./style.css";
import BookingItem from "@/app/components/BookingItem";
import BookingDetail from "@/app/components/BookingDetail";

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
];

export default function Bookings() {
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
          <h1>Hoạt động</h1>
          {bookings.some(({ status }) =>
            ["Chờ", "Xác nhận", "Nhận phòng"].includes(status)
          ) ? (
            bookings
              .filter(({ status }) =>
                ["Chờ", "Xác nhận", "Nhận phòng"].includes(status)
              )
              .map((booking) => (
                <BookingItem
                  key={booking.id}
                  roomType={booking.roomType}
                  status={booking.status}
                  time={`${booking.checkIn} - ${booking.checkOut}`}
                  onClick={() => handleSelectBooking(booking)}
                />
              ))
          ) : (
            <p className="noti">Không có hoạt động hiện tại</p>
          )}

          <h1>Gần đây</h1>
          {bookings.some(({ status }) =>
            ["Trả phòng", "Hủy phòng"].includes(status)
          ) ? (
            bookings
              .filter(({ status }) =>
                ["Trả phòng", "Hủy phòng"].includes(status)
              )
              .map((booking) => (
                <BookingItem
                  key={booking.id}
                  roomType={booking.roomType}
                  status={booking.status}
                  time={`${booking.checkIn} - ${booking.checkOut}`}
                  onClick={() => handleSelectBooking(booking)}
                />
              ))
          ) : (
            <p className="noti">Không có hoạt động nào gần đây</p>
          )}
        </>
      )}
    </Container>
  );
}
