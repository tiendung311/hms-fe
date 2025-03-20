import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faStar } from "@fortawesome/free-solid-svg-icons";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";

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
  const maxAmenitiesLength = 25;
  const amenitiesText = amenities.join(", ");

  const displayedAmenities =
    amenitiesText.length > maxAmenitiesLength
      ? amenitiesText.substring(0, maxAmenitiesLength) + "..."
      : amenitiesText;

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

      <OverlayTrigger
        placement="top"
        overlay={<Tooltip id="tooltip-top">{amenitiesText}</Tooltip>}
      >
        <p style={{ cursor: "pointer" }}>Tiện ích: {displayedAmenities}</p>
      </OverlayTrigger>

      <p className="price">{price.toLocaleString("vi-VN")}₫ /đêm</p>
    </div>
  );
}
