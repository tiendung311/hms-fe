import React from "react";
import styles from "./RoomFilter.module.css";
import Image from "next/image";
import { Button } from "react-bootstrap";

interface RoomProps {
  image: string;
  name: string;
  stars: number;
  reviews: number;
  rating: number;
  comments: string[];
  amenities: string;
  status: string;
  price: number;
}

export default function RoomFilter({
  image,
  name,
  stars,
  reviews,
  rating,
  comments,
  amenities,
  status,
  price,
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
        <h3>
          {name} - {stars} sao
        </h3>

        <div className={styles.info}>
          <p className={styles.labels}>Đánh giá ({reviews}):</p>
          <p>{rating} ⭐</p>
        </div>

        <div className={styles.info}>
          <p className={styles.labels}>Nhận xét ({comments.length}):</p>
          <p>{displayedComments}</p>
        </div>

        <div className={styles.info}>
          <p className={styles.labels}>Tiện ích:</p>
          <p>{truncatedAmenities}</p>
        </div>

        <div className={styles.info}>
          <p className={styles.labels}>Trạng thái:</p>
          <p
            className={
              status === "Còn phòng" ? styles.available : styles.unavailable
            }
          >
            {status}
          </p>
        </div>

        <div className={styles.roomFooter}>
          <span className={styles.roomPrice}>
            {price.toLocaleString("vi-VN")}₫ / đêm
          </span>
          <Button variant="warning" className={styles.viewBtn}>
            Xem phòng &gt;
          </Button>
        </div>
      </div>
    </div>
  );
}
