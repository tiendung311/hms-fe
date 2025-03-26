import RoomCard from "./RoomCard";
import styles from "./ShowRoom.module.css";

const rooms = [
  {
    image: "/assets/single-3star.jpg",
    name: "Phòng đơn - 3 sao",
    type: "single",
    stars: 3,
    amenities: ["Wi-Fi", "Tivi", "Bồn tắm"],
    price: 1000000,
  },
  {
    image: "/assets/single-4star.jpg",
    name: "Phòng đơn - 4 sao",
    type: "single",
    stars: 4,
    amenities: ["Wi-Fi", "Tivi", "Máy lạnh", "Ban công"],
    price: 1500000,
  },
  {
    image: "/assets/single-5star.jpg",
    name: "Phòng đơn - 5 sao",
    type: "single",
    stars: 5,
    amenities: ["Wi-Fi", "Tivi", "Máy lạnh", "Bồn tắm", "Minibar"],
    price: 2000000,
  },
  {
    image: "/assets/double-3star.jpg",
    name: "Phòng đôi - 3 sao",
    type: "double",
    stars: 3,
    amenities: ["Wi-Fi", "Tivi", "2 Giường lớn"],
    price: 1800000,
  },
  {
    image: "/assets/double-4star.jpg",
    name: "Phòng đôi - 4 sao",
    type: "double",
    stars: 4,
    amenities: ["Wi-Fi", "Tivi", "2 Giường lớn", "Bồn tắm", "Ban công"],
    price: 2500000,
  },
  {
    image: "/assets/double-5star.jpg",
    name: "Phòng đôi - 5 sao",
    type: "double",
    stars: 5,
    amenities: [
      "Wi-Fi",
      "Tivi",
      "Máy lạnh",
      "Phòng khách",
      "Minibar",
      "View biển",
    ],
    price: 4000000,
  },
];

export default function ShowRoom() {
  return (
    <div className={styles.roomContainer}>
      <div className={styles.roomList}>
        {rooms.map((room, index) => (
          <RoomCard key={index} {...room} />
        ))}
      </div>
    </div>
  );
}
