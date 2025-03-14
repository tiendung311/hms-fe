import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircle, faClock } from "@fortawesome/free-solid-svg-icons";
import "./BookingItem.css";

// Hàm lấy màu theo trạng thái
const getStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    Chờ: "var(--main-yellow)",
    "Xác nhận": "var(--main-green)",
    "Nhận phòng": "var(--main-blue)",
    "Trả phòng": "var(--main-grey)",
    "Hủy phòng": "var(--main-red)",
  };
  return colors[status] || "var(--main-grey)";
};

// Hàm xác định loại đơn đặt phòng (current/recent)
const getBookingType = (status: string): "current" | "recent" => {
  return ["Chờ", "Xác nhận", "Nhận phòng"].includes(status)
    ? "current"
    : "recent";
};

type BookingItemProps = {
  roomType: string;
  status: string;
  time: string;
  onClick?: () => void;
};

export default function BookingItem({
  roomType,
  status,
  time,
  onClick,
}: BookingItemProps) {
  const type = getBookingType(status);

  return (
    <div className="booking-item" onClick={onClick}>
      <div className="info">
        <FontAwesomeIcon
          className="icon"
          icon={type === "current" ? faCircle : faClock}
          style={{ color: getStatusColor(status) }}
        />
        <div className="booking-info">
          <h3>{roomType}</h3>
          <p>Trạng thái: {status}</p>
          <p>{time}</p>
        </div>
      </div>
    </div>
  );
}
