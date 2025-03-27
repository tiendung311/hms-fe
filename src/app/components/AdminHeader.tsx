import { Dropdown } from "react-bootstrap";
// import styles from "./AdminHeader.module.css";
import "./AdminHeader.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCaretDown,
  faIdCard,
  faRightFromBracket,
} from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";

export default function AdminHeader() {
  return (
    // <div className={styles.header}>
    <div className="header">
      <div></div>
      <Dropdown className="dropdown">
        <Dropdown.Toggle
          variant="dark"
          id="dropdown-basic"
          style={{ color: "white", backgroundColor: "black", border: "none" }}
        >
          <div className="info">
            <span>Nguyễn Văn A</span>
            <span>Quản lý</span>
          </div>
          <FontAwesomeIcon className="icon" icon={faCaretDown} />
        </Dropdown.Toggle>

        <Dropdown.Menu>
          <Link className="dropdown-item" href="/customer/profile">
            Hồ sơ
            <FontAwesomeIcon className="icon" icon={faIdCard} />
          </Link>
          <Link className="dropdown-item" href="/login">
            Đăng xuất
            <FontAwesomeIcon className="icon" icon={faRightFromBracket} />
          </Link>
        </Dropdown.Menu>
      </Dropdown>
    </div>
  );
}
