import "bootstrap/dist/css/bootstrap.min.css";
import { Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import "./BookingDetail.css";
import { useState } from "react";
import RatingOverlay from "./RatingOverlay";

const getStatusStyle = (status: string) => {
  const styles: Record<string, { color: string; backgroundColor: string }> = {
    Chờ: { color: "white", backgroundColor: "var(--main-yellow)" },
    "Xác nhận": { color: "white", backgroundColor: "var(--main-green)" },
    "Nhận phòng": { color: "white", backgroundColor: "var(--main-blue)" },
    "Trả phòng": { color: "white", backgroundColor: "var(--main-grey)" },
    "Hủy phòng": { color: "white", backgroundColor: "var(--main-red)" },
  };
  return (
    styles[status] || { color: "white", backgroundColor: "var(--main-grey)" }
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
    <div className="booking-container">
      {/* Thông tin đặt phòng */}
      <div className="booking-detail">
        <h1>Chi tiết đặt phòng</h1>
        <div className="info">
          <p className="label">Loại phòng:</p>
          <p>{booking.roomType}</p>
        </div>
        <div className="info">
          <p className="label">Số phòng:</p>
          <p>{booking.roomNumber}</p>
        </div>
        <div className="info">
          <p className="label">Tiện ích:</p>
          <p>
            {booking.amenities.map((amenity, index) => (
              <span key={index}>
                {amenity}
                {index !== booking.amenities.length - 1 ? ", " : ""}
              </span>
            ))}
          </p>
        </div>
        <div className="info">
          <p className="label">Giờ nhận phòng:</p>
          <p>{booking.checkIn}</p>
        </div>
        <div className="info">
          <p className="label">Giờ trả phòng:</p>
          <p>{booking.checkOut}</p>
        </div>
        <div className="info">
          <p className="label">Giá:</p>
          <p>{booking.price.toLocaleString("vi-VN")} VND</p>
        </div>
        <div className="info">
          <p className="label">Trạng thái:</p>
          <p className="status" style={getStatusStyle(booking.status)}>
            {booking.status}
          </p>
        </div>
        <div className="btn-group">
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
      <div className="booking-rating">
        {ratingData ? (
          <div className="review-info">
            <h1>Feedback của bạn</h1>
            <div className="info">
              <p className="label">Đánh giá:</p>
              <p>{ratingData.rating} ⭐</p>
            </div>
            <div className="info">
              <p className="label">Nhận xét:</p>
              <p>{ratingData.comment}</p>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
