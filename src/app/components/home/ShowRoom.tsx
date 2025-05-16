"use client";

import { useEffect, useState } from "react";
import RoomCard from "./RoomCard";
import styles from "./ShowRoom.module.css";

interface RoomCardDTO {
  roomName: string;
  type: string;
  star: string;
  services: string[];
  price: number;
}

export default function ShowRoom() {
  const [rooms, setRooms] = useState<RoomCardDTO[]>([]);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const res = await fetch("http://localhost:8080/api/room-cards");
        const data = await res.json();
        setRooms(data);
      } catch (error) {
        console.error("Error fetching room data:", error);
      }
    };

    fetchRooms();
  }, []);

  const getImagePath = (type: string, star: string) => {
    const typeKey = type.toLowerCase().includes("đơn") ? "single" : "double";
    const starNum = parseInt(star);
    return `/assets/${typeKey}-${starNum}star.jpg`;
  };

  return (
    <div className={styles.roomContainer}>
      <div className={styles.roomList}>
        {rooms.map((room, index) => (
          <RoomCard
            key={index}
            image={getImagePath(room.type, room.star)}
            name={room.roomName}
            type={room.type}
            stars={parseInt(room.star)}
            amenities={room.services}
            price={room.price}
          />
        ))}
      </div>
    </div>
  );
}
