import Image from "next/image";
import Link from "next/link";
import "./CustomerHeader.css";
import { Dropdown } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBell,
  faCalendarPlus,
  faCaretDown,
  faIdCard,
  faRightFromBracket,
} from "@fortawesome/free-solid-svg-icons";
import { SignOutButton, useUser } from "@clerk/nextjs";
import { useState } from "react";
import UserEditModal from "./UserEditModal";

export default function CustomerHeader() {
  const { user } = useUser();
  const fullName = user
    ? `${user.lastName ?? ""} ${user.firstName ?? ""}`.trim()
    : "Người dùng";
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="userHeader">
      <Link
        href="/home"
        className="logo-group"
        style={{ cursor: "pointer", textDecoration: "none" }}
      >
        <Image
          src="/assets/logo-H.png"
          alt="Logo"
          width={50}
          height={50}
          priority
        />
        <h1
          style={{
            color: "var(--main-yellow)",
            marginLeft: "20px",
            fontSize: "2.8rem",
          }}
        >
          Hôtel
        </h1>
      </Link>

      <Dropdown className="dropdown">
        <Dropdown.Toggle
          variant="warning"
          id="dropdown-basic"
          style={{ color: "white" }}
        >
          {fullName}
          <FontAwesomeIcon className="icon" icon={faCaretDown} />
        </Dropdown.Toggle>

        <Dropdown.Menu>
          {user ? (
            <>
              <button
                className="dropdown-item"
                style={{ cursor: "pointer" }}
                onClick={() => setShowModal(true)}
              >
                Hồ sơ
                <FontAwesomeIcon className="icon" icon={faIdCard} />
              </button>
              <Link className="dropdown-item" href="/customer/activity">
                Hoạt động
                <FontAwesomeIcon className="icon" icon={faBell} />
              </Link>
              <Link className="dropdown-item" href="/customer/booking">
                Đặt phòng
                <FontAwesomeIcon className="icon" icon={faCalendarPlus} />
              </Link>
              <SignOutButton redirectUrl="/sign-in">
                <span className="dropdown-item" style={{ cursor: "pointer" }}>
                  Đăng xuất
                  <FontAwesomeIcon className="icon" icon={faRightFromBracket} />
                </span>
              </SignOutButton>
            </>
          ) : (
            <Link className="dropdown-item" href="/sign-in">
              Đăng nhập
              <FontAwesomeIcon className="icon" icon={faRightFromBracket} />
            </Link>
          )}
        </Dropdown.Menu>
      </Dropdown>

      {user && showModal && (
        <UserEditModal onClose={() => setShowModal(false)} />
      )}
    </div>
  );
}
