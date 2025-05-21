"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import CustomerHeader from "@/app/components/CustomerHeader";
import { Container } from "react-bootstrap";
import styles from "./style.module.css";
import BookingActivity from "@/app/components/customer/bookings/BookingActivity";
import BookingDetail, {
  BookingDetailProps,
} from "@/app/components/customer/bookings/BookingDetail";

type Booking = {
  bookingId: number;
  roomType: string;
  roomNumber: string;
  services: string[];
  bookingStatus: string;
  checkInDate: string;
  checkOutDate: string;
  price: number;
};

export default function Activity() {
  const { user } = useUser();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [selectedBooking, setSelectedBooking] = useState<
    BookingDetailProps["booking"] | null
  >(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      if (user?.emailAddresses?.[0]?.emailAddress) {
        try {
          const res = await fetch(
            `http://localhost:8080/api/bookings/customer?email=${encodeURIComponent(
              user.emailAddresses[0].emailAddress
            )}`
          );
          const data = await res.json();
          setBookings(data);
        } catch (err) {
          console.error("Failed to fetch bookings", err);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchBookings();
  }, [user]);

  const handleSelectBooking = (booking: Booking) => {
    const convertedBooking = {
      bookingId: booking.bookingId,
      roomType: booking.roomType,
      roomNumber: booking.roomNumber,
      amenities: booking.services,
      status: booking.bookingStatus,
      checkIn: booking.checkInDate,
      checkOut: booking.checkOutDate,
      price: booking.price,
    };
    setSelectedBooking(convertedBooking);
  };

  if (loading) return <p>Đang tải dữ liệu...</p>;

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
          {bookings.length > 0 ? (
            bookings.map((booking) => (
              <BookingActivity
                key={booking.bookingId}
                roomType={booking.roomType}
                status={booking.bookingStatus}
                time={`${booking.checkInDate} - ${booking.checkOutDate}`}
                onClick={() => handleSelectBooking(booking)}
              />
            ))
          ) : (
            <p className={styles.noti}>Bạn chưa có hoạt động đặt phòng nào</p>
          )}
        </>
      )}
    </Container>
  );
}
