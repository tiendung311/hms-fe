import { Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import styles from "./BookingDetail.module.css";
import { useState } from "react";
import RatingOverlay from "./RatingOverlay";

const getStatusStyle = (status: string) => {
  const statusStyles: Record<
    string,
    { color: string; backgroundColor: string }
  > = {
    Chờ: { color: "white", backgroundColor: "var(--main-yellow)" },
    "Xác nhận": { color: "white", backgroundColor: "var(--main-green)" },
    "Nhận phòng": { color: "white", backgroundColor: "var(--main-blue)" },
    "Trả phòng": { color: "white", backgroundColor: "var(--main-grey)" },
    "Hủy phòng": { color: "white", backgroundColor: "var(--main-red)" },
  };
  return (
    statusStyles[status] || {
      color: "white",
      backgroundColor: "var(--main-grey)",
    }
  );
};

type BookingDetailProps = {
  booking: {
    roomType: string;
    roomNumber: string;
    amenities: string[];
    status: string;
    checkIn: string;
    checkOut: string;
    price: number;
  };
  onBack: () => void;
};

export default function BookingDetail({ booking, onBack }: BookingDetailProps) {
  const [showRating, setShowRating] = useState(false);
  const [ratingData, setRatingData] = useState<{
    rating: number;
    comment: string;
  } | null>(null);

  const isReviewable = booking.status === "Trả phòng";

  return (
    <div className={styles.bookingContainer}>
      {/* Thông tin đặt phòng */}
      <div className={styles.bookingDetail}>
        <h1 className={styles.heading}>Chi tiết đặt phòng</h1>
        <div className={styles.info}>
          <p className={styles.label}>Loại phòng:</p>
          <p className={styles.text}>{booking.roomType}</p>
        </div>
        <div className={styles.info}>
          <p className={styles.label}>Số phòng:</p>
          <p className={styles.text}>{booking.roomNumber}</p>
        </div>
        <div className={styles.info}>
          <p className={styles.label}>Tiện ích:</p>
          <p className={styles.text}>
            {booking.amenities.map((amenity, index) => (
              <span key={index}>
                {amenity}
                {index !== booking.amenities.length - 1 ? ", " : ""}
              </span>
            ))}
          </p>
        </div>
        <div className={styles.info}>
          <p className={styles.label}>Giờ nhận phòng:</p>
          <p className={styles.text}>{booking.checkIn}</p>
        </div>
        <div className={styles.info}>
          <p className={styles.label}>Giờ trả phòng:</p>
          <p className={styles.text}>{booking.checkOut}</p>
        </div>
        <div className={styles.info}>
          <p className={styles.label}>Giá:</p>
          <p className={styles.text}>
            {booking.price.toLocaleString("vi-VN")} VND
          </p>
        </div>
        <div className={styles.info}>
          <p className={styles.label}>Trạng thái:</p>
          <p className={styles.status} style={getStatusStyle(booking.status)}>
            {booking.status}
          </p>
        </div>
        <div className={styles.btnGroup} style={{ marginBottom: "20px" }}>
          {showRating && (
            <RatingOverlay
              onClose={() => setShowRating(false)}
              onSubmit={(rating, comment) => {
                setRatingData({ rating, comment });
                setShowRating(false);
              }}
              initialRating={ratingData?.rating || 0}
              initialComment={ratingData?.comment || ""}
            />
          )}
          <Button
            variant="warning"
            onClick={() => setShowRating(true)}
            disabled={!isReviewable}
          >
            Đánh giá
          </Button>
          <Button variant="secondary" onClick={onBack} disabled={showRating}>
            <FontAwesomeIcon
              icon={faArrowLeft}
              style={{ marginRight: "10px" }}
            />{" "}
            Quay lại
          </Button>
        </div>
      </div>

      {/* Đánh giá phòng */}
      <div className={styles.bookingRating}>
        {ratingData ? (
          <div className={styles.reviewInfo}>
            <h1 className={styles.heading}>Feedback của bạn</h1>
            <div className={styles.info}>
              <p className={styles.label}>Đánh giá:</p>
              <p className={styles.text}>{ratingData.rating} ⭐</p>
            </div>
            <div className={styles.info}>
              <p className={styles.label}>Nhận xét:</p>
              <p className={styles.text}>{ratingData.comment}</p>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
