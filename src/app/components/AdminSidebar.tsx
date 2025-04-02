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
import { usePathname } from "next/navigation";

interface ActiveLinkProps {
  href: string;
  children: React.ReactNode;
}

const ActiveLink = ({ href, children }: ActiveLinkProps) => {
  const pathname = usePathname();

  return (
    <Link
      href={href}
      className={`${styles.navItem} ${pathname === href ? styles.active : ""}`}
    >
      {children}
    </Link>
  );
};

export default function AdminSidebar() {
  return (
    <div className={styles.sidebar}>
      <Link href="/admin/dashboard" className={styles.logo}>
        <Image
          src="/assets/logo-H.png"
          alt="Logo"
          width={40}
          height={40}
          priority
        />
        <span className={styles.logoText}>Hôtel</span>
      </Link>
      <nav className={styles.nav}>
        <ActiveLink href="/admin/dashboard">
          <FontAwesomeIcon icon={faChartBar} className={styles.icon} />
          <span>Thống kê</span>
        </ActiveLink>
        <ActiveLink href="/booking">
          <FontAwesomeIcon icon={faBookmark} className={styles.icon} />
          <span>Đặt phòng</span>
        </ActiveLink>
        <ActiveLink href="/admin/rooms">
          <FontAwesomeIcon icon={faBed} className={styles.icon} />
          <span>Phòng</span>
        </ActiveLink>
        <ActiveLink href="/admin/customers">
          <FontAwesomeIcon icon={faUsers} className={styles.icon} />
          <span>Khách hàng</span>
        </ActiveLink>
        <ActiveLink href="/admin/transactions">
          <FontAwesomeIcon icon={faExchangeAlt} className={styles.icon} />
          <span>Giao dịch</span>
        </ActiveLink>
        <ActiveLink href="/admin/services">
          <FontAwesomeIcon icon={faConciergeBell} className={styles.icon} />
          <span>Dịch vụ</span>
        </ActiveLink>
        <ActiveLink href="/reports">
          <FontAwesomeIcon icon={faFileAlt} className={styles.icon} />
          <span>Báo cáo</span>
        </ActiveLink>
      </nav>
    </div>
  );
}
