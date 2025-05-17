import React from "react";
import styles from "./RoomFilter.module.css";
import Image from "next/image";
import { Button, OverlayTrigger, Tooltip } from "react-bootstrap";

interface RoomProps {
  image: string;
  name: string;
  reviews: number;
  rating: number;
  comments: string[];
  amenities: string;
  price: number;
  onViewDetail: () => void;
}

export default function RoomFilter({
  image,
  name,
  reviews,
  rating,
  comments,
  amenities,
  price,
  onViewDetail,
}: RoomProps) {
  const truncatedAmenities =
    amenities.length > 30 ? amenities.substring(0, 30) + "..." : amenities;

  const displayedComments =
    comments.length > 2
      ? `"${comments[0]}", "${comments[1]}", ...`
      : comments.map((c) => `"${c}"`).join(", ");

  return (
    <div className={styles.roomCard}>
      <Image
        src={image}
        alt={name}
        width={150}
        height={150}
        className={styles.roomImage}
      />

      <div className={styles.roomContent}>
        <h3>{name}</h3>

        <div className={styles.info}>
          <p className={styles.labels}>Đánh giá ({reviews}):</p>
          <p>{rating} ⭐</p>
        </div>

        <div className={styles.info}>
          <p className={styles.labels}>Nhận xét ({comments.length}):</p>
          <OverlayTrigger
            placement="top"
            overlay={
              <Tooltip id={`tooltip-comments`}>
                {comments.length > 0
                  ? comments.join(", ")
                  : "Không có nhận xét"}
              </Tooltip>
            }
          >
            <p style={{ cursor: "pointer" }}>{displayedComments}</p>
          </OverlayTrigger>
        </div>

        <div className={styles.info}>
          <p className={styles.labels}>Tiện ích:</p>
          <OverlayTrigger
            placement="top"
            overlay={<Tooltip id={`tooltip-amenities`}>{amenities}</Tooltip>}
          >
            <p style={{ cursor: "pointer" }}>{truncatedAmenities}</p>
          </OverlayTrigger>
        </div>

        <div className={styles.roomFooter}>
          <span className={styles.roomPrice}>
            {price.toLocaleString("vi-VN")}₫ / đêm
          </span>
          <Button
            variant="warning"
            className={styles.viewBtn}
            onClick={onViewDetail}
          >
            Xem phòng &gt;
          </Button>
        </div>
      </div>
    </div>
  );
}
