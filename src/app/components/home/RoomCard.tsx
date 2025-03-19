import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faStar } from "@fortawesome/free-solid-svg-icons";

interface RoomCardProps {
  image: string;
  name: string;
  type: string;
  stars: number;
  amenities: string[];
  price: number;
}

export default function RoomCard({
  image,
  name,
  type,
  stars,
  amenities,
  price,
}: RoomCardProps) {
  return (
    <div className="room-card">
      <Image
        src={image}
        alt={name}
        width={300}
        height={200}
        className="room-image"
      />
      <p>
        Phòng: <FontAwesomeIcon icon={faUser} style={{ marginRight: "5px" }} />
        {type === "double" && <FontAwesomeIcon icon={faUser} />}
      </p>
      <p>
        Sao:{" "}
        {[...Array(stars)].map((_, i) => (
          <FontAwesomeIcon key={i} icon={faStar} style={{ color: "gold" }} />
        ))}
      </p>
      <p>Tiện ích: {amenities.join(", ")}</p>
      <p>Giá: {price.toLocaleString("vi-VN")} VND</p>
    </div>
  );
}
