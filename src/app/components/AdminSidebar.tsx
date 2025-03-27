import styles from "./AdminSidebar.module.css";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChartBar,
  faBookmark,
  faBed,
  faUsers,
  faExchangeAlt,
  faConciergeBell,
  faFileAlt,
} from "@fortawesome/free-solid-svg-icons";
import Image from "next/image";

export default function AdminSidebar() {
  return (
    <div className={styles.sidebar}>
      <div className={styles.logo}>
        <Image
          src="/assets/logo-H.png"
          alt="Logo"
          width={30}
          height={30}
          priority
        />
        <span className={styles.text}>Hôtel</span>
      </div>
      <nav className={styles.nav}>
        <Link
          href="/dashboard"
          className={`${styles.navItem} ${styles.active}`}
        >
          <FontAwesomeIcon icon={faChartBar} className={styles.icon} />
          <span>Thống kê</span>
        </Link>
        <Link href="/booking" className={styles.navItem}>
          <FontAwesomeIcon icon={faBookmark} className={styles.icon} />
          <span>Đặt phòng</span>
        </Link>
        <Link href="/rooms" className={styles.navItem}>
          <FontAwesomeIcon icon={faBed} className={styles.icon} />
          <span>Phòng</span>
        </Link>
        <Link href="/customers" className={styles.navItem}>
          <FontAwesomeIcon icon={faUsers} className={styles.icon} />
          <span>Khách hàng</span>
        </Link>
        <Link href="/transactions" className={styles.navItem}>
          <FontAwesomeIcon icon={faExchangeAlt} className={styles.icon} />
          <span>Giao dịch</span>
        </Link>
        <Link href="/services" className={styles.navItem}>
          <FontAwesomeIcon icon={faConciergeBell} className={styles.icon} />
          <span>Dịch vụ</span>
        </Link>
        <Link href="/reports" className={styles.navItem}>
          <FontAwesomeIcon icon={faFileAlt} className={styles.icon} />
          <span>Báo cáo</span>
        </Link>
      </nav>
    </div>
  );
}
