import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircle, faClock } from "@fortawesome/free-solid-svg-icons";
import styles from "./BookingActivity.module.css";

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

export default function BookingActivity({
  roomType,
  status,
  time,
  onClick,
}: BookingItemProps) {
  const type = getBookingType(status);

  return (
    <div className={styles.bookingItem} onClick={onClick}>
      <div className={styles.info}>
        <FontAwesomeIcon
          className={styles.icon}
          icon={type === "current" ? faCircle : faClock}
          style={{ color: getStatusColor(status) }}
        />
        <div className={styles.bookingInfo}>
          <h3>{roomType}</h3>
          <p className={styles.bookingText}>Trạng thái: {status}</p>
          <p className={styles.bookingText}>{time}</p>
        </div>
      </div>
    </div>
  );
}
