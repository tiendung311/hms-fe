"use client";

import AdminHeader from "@/app/components/AdminHeader";
import AdminSidebar from "@/app/components/AdminSidebar";
import styles from "./style.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBed,
  faMoneyBills,
  faMoneyBillTrendUp,
  faUsers,
} from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState, useRef } from "react";
import {
  Chart,
  ArcElement,
  PieController,
  Tooltip,
  Legend,
  Title,
} from "chart.js";
import { useFetchWithAuth } from "@/app/utils/api";
import RequireAdmin from "@/app/components/RequireAdmin";
import { useAuth } from "@clerk/nextjs";
Chart.register(ArcElement, PieController, Tooltip, Legend, Title);

type Booking = {
  fullName: string;
  roomNumber: string;
  checkInDate: string;
  checkOutDate: string;
  bookingStatus: string;
};

export default function Dashboard() {
  const fetchWithAuth = useFetchWithAuth();
  const { isLoaded, userId } = useAuth();

  const [totalRevenue, setTotalRevenue] = useState<number>(0);

  useEffect(() => {
    if (!isLoaded || !userId) return;

    const fetchTotalRevenue = async () => {
      try {
        const res = await fetchWithAuth(
          "http://localhost:8080/api/admin/total-amount/success"
        );
        const data = await res.json();
        setTotalRevenue(data);
      } catch (err) {
        console.error("Lỗi lấy tổng doanh thu:", err);
      }
    };
    fetchTotalRevenue();
  }, [fetchWithAuth, isLoaded, userId]);

  const [monthlyRevenue, setMonthlyRevenue] = useState<number>(0);

  useEffect(() => {
    if (!isLoaded || !userId) return;

    const fetchMonthlyRevenue = async () => {
      try {
        const res = await fetchWithAuth(
          "http://localhost:8080/api/admin/total-amount/month/now"
        );
        const data = await res.json();
        setMonthlyRevenue(data);
      } catch (err) {
        console.error("Lỗi lấy doanh thu tháng:", err);
      }
    };
    fetchMonthlyRevenue();
  }, [fetchWithAuth, isLoaded, userId]);

  const formatCurrency = (value: number) => {
    return value.toLocaleString("vi-VN") + "₫";
  };

  const [totalUsers, setTotalUsers] = useState<number>(0);

  useEffect(() => {
    if (!isLoaded || !userId) return;

    const fetchTotalUsers = async () => {
      const res = await fetchWithAuth(
        "http://localhost:8080/api/admin/total-users"
      );
      const data = await res.json();
      setTotalUsers(data);
    };

    fetchTotalUsers();
  }, [fetchWithAuth, isLoaded, userId]);

  const [totalRooms, setTotalRooms] = useState<number>(0);

  useEffect(() => {
    if (!isLoaded || !userId) return;

    const fetchTotalRooms = async () => {
      try {
        const res = await fetchWithAuth(
          "http://localhost:8080/api/admin/total-rooms"
        );
        const data = await res.json();
        setTotalRooms(data);
      } catch (err) {
        console.error("Lỗi lấy tổng phòng:", err);
      }
    };
    fetchTotalRooms();
  }, [fetchWithAuth, isLoaded, userId]);

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [allBookings, setAllBookings] = useState<Booking[]>([]);

  useEffect(() => {
    if (!isLoaded || !userId) return;

    const fetchBookings = async () => {
      try {
        const res = await fetchWithAuth(
          "http://localhost:8080/api/admin/bookings"
        );
        if (!res.ok) throw new Error("Failed to fetch bookings");
        const data = await res.json();
        setAllBookings(data);
        setBookings(data.slice(0, 5));
      } catch (err) {
        console.error("Lỗi lấy danh sách booking:", err);
      }
    };
    fetchBookings();
  }, [fetchWithAuth, isLoaded, userId]);

  const getStatusClass = (status: string) => {
    switch (status) {
      case "Chờ":
        return styles.pending;
      case "Xác nhận":
        return styles.confirmed;
      case "Nhận phòng":
        return styles.checkedIn;
      case "Trả phòng":
        return styles.completed;
      case "Hủy":
      case "Đã hủy":
        return styles.cancelled;
      default:
        return "";
    }
  };

  const [activities, setActivities] = useState<string[]>([]);

  useEffect(() => {
    if (!isLoaded || !userId) return;

    const fetchActivityLog = async () => {
      try {
        const res = await fetchWithAuth(
          "http://localhost:8080/api/admin/activity-log"
        );
        const data = await res.json();
        if (Array.isArray(data)) {
          setActivities(data);
        } else if (Array.isArray(data.activities)) {
          setActivities(data.activities);
        } else {
          console.error("Dữ liệu không đúng định dạng:", data);
          setActivities([]);
        }
      } catch (err) {
        console.error("Lỗi lấy thông báo:", err);
        setActivities([]);
      }
    };
    fetchActivityLog();
  }, [fetchWithAuth, isLoaded, userId]);

  const chartRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!chartRef.current || allBookings.length === 0) return;

    const statusCount: { [key: string]: number } = {};
    allBookings.forEach((b) => {
      statusCount[b.bookingStatus] = (statusCount[b.bookingStatus] || 0) + 1;
    });

    const labels = Object.keys(statusCount);
    const data = Object.values(statusCount);

    const chart = new Chart(chartRef.current, {
      type: "pie",
      data: {
        labels,
        datasets: [
          {
            label: "Số lượng theo trạng thái",
            data,
            backgroundColor: [
              "#ffc107", // Chờ
              "#0d6efd", // Xác nhận
              "#198754", // Nhận phòng
              "#6f42c1", // Trả phòng
              "#dc3545", // Hủy
            ],
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            display: true,
            position: "bottom",
          },
          title: {
            display: true,
            text: "Thống kê trạng thái đặt phòng",
            font: {
              size: 18,
            },
          },
        },
      },
    });

    return () => {
      chart.destroy();
    };
  }, [allBookings]);

  const chartRef2 = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!chartRef2.current) return;

    const fetchRoomTypeCounts = async () => {
      try {
        const res = await fetchWithAuth(
          "http://localhost:8080/api/room-types/count"
        );
        const data = await res.json();

        if (!Array.isArray(data)) {
          console.error("Dữ liệu không hợp lệ từ API room-types/count", data);
          return;
        }

        const labels = data.map((item) => item.roomTypeName);
        const roomCounts = data.map((item) => item.totalRooms);

        const chart = new Chart(chartRef2.current!, {
          type: "pie",
          data: {
            labels,
            datasets: [
              {
                label: "Tổng số phòng theo loại",
                data: roomCounts,
                backgroundColor: [
                  "#4dc9f6",
                  "#f67019",
                  "#f53794",
                  "#537bc4",
                  "#acc236",
                  "#166a8f",
                ],
              },
            ],
          },
          options: {
            responsive: true,
            plugins: {
              legend: {
                display: true,
                position: "bottom",
              },
              title: {
                display: true,
                text: "Thống kê loại phòng",
                font: {
                  size: 18,
                },
              },
            },
          },
        });

        // Cleanup
        return () => {
          chart.destroy();
        };
      } catch (error) {
        console.error("Lỗi khi fetch room-type counts:", error);
      }
    };

    const cleanupPromise = fetchRoomTypeCounts();

    return () => {
      cleanupPromise.then((cleanup) => {
        if (typeof cleanup === "function") cleanup();
      });
    };
  }, [fetchWithAuth]);

  if (!isLoaded || typeof window === "undefined") return null;

  return (
    <RequireAdmin>
      <div className={styles.dashboardContainer}>
        <AdminSidebar />
        <div className={styles.mainContent}>
          <AdminHeader />
          <div className={styles.content}>
            <h2 className={styles.title}>Thống kê</h2>
            <div className={styles.stats}>
              <div
                className={styles.statCard}
                style={{ backgroundColor: "var(--main-blue)" }}
              >
                <p>Tổng doanh thu</p>
                <FontAwesomeIcon className={styles.icon} icon={faMoneyBills} />
                <h3>{formatCurrency(totalRevenue)}</h3>
              </div>
              <div
                className={styles.statCard}
                style={{ backgroundColor: "var(--main-green)" }}
              >
                <p>Doanh thu tháng</p>
                <FontAwesomeIcon
                  className={styles.icon}
                  icon={faMoneyBillTrendUp}
                />
                <h3>{formatCurrency(monthlyRevenue)}</h3>
              </div>
              <div
                className={styles.statCard}
                style={{ backgroundColor: "var(--main-yellow)" }}
              >
                <p>Tổng số khách hàng</p>
                <FontAwesomeIcon className={styles.icon} icon={faUsers} />
                <h3>{totalUsers}</h3>
              </div>
              <div
                className={styles.statCard}
                style={{ backgroundColor: "var(--main-red)" }}
              >
                <p>Tổng số phòng</p>
                <FontAwesomeIcon className={styles.icon} icon={faBed} />
                <h3>{totalRooms}</h3>
              </div>
            </div>

            <div className={styles.chartContainer}>
              <div className={styles.chartBox}>
                <canvas ref={chartRef2}></canvas>
              </div>
              <div className={styles.chartBox}>
                <canvas ref={chartRef}></canvas>
              </div>
            </div>

            <div className={styles.tables}>
              <div className={styles.tableContainer}>
                <h3>Đặt phòng gần đây</h3>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>Họ tên</th>
                      <th>Phòng</th>
                      <th>Thời gian</th>
                      <th>Trạng thái</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookings.map((booking, index) => (
                      <tr key={index}>
                        <td>{booking.fullName}</td>
                        <td>{booking.roomNumber}</td>
                        <td>{`${booking.checkInDate} - ${booking.checkOutDate}`}</td>
                        <td className={getStatusClass(booking.bookingStatus)}>
                          {booking.bookingStatus}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className={styles.notifications}>
                <h3>Thông báo</h3>
                <ul>
                  {activities.length === 0 ? (
                    <li>Không có thông báo nào gần đây.</li>
                  ) : (
                    activities.map((msg, index) => <li key={index}>{msg}</li>)
                  )}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </RequireAdmin>
  );
}
