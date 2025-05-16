"use client";

import { Dropdown } from "react-bootstrap";
import "./AdminHeader.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCaretDown,
  faIdCard,
  faRightFromBracket,
} from "@fortawesome/free-solid-svg-icons";
import { SignOutButton, useUser } from "@clerk/nextjs";
import { useState } from "react";
import UserEditModal from "./UserEditModal";

export default function AdminHeader() {
  const { user } = useUser();
  const fullName = user
    ? `${user.lastName ?? ""} ${user.firstName ?? ""}`.trim()
    : "Người dùng";
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="adminHeader">
      <div></div>
      <Dropdown className="dropdown">
        <Dropdown.Toggle
          variant="dark"
          id="dropdown-basic"
          style={{ color: "white", backgroundColor: "black", border: "none" }}
        >
          <div className="info">
            <span>{fullName}</span>
            <span>Quản lý</span>
          </div>
          <FontAwesomeIcon className="icon" icon={faCaretDown} />
        </Dropdown.Toggle>

        <Dropdown.Menu>
          <button
            className="dropdown-item"
            style={{ cursor: "pointer" }}
            onClick={() => setShowModal(true)}
          >
            Hồ sơ
            <FontAwesomeIcon className="icon" icon={faIdCard} />
          </button>
          <SignOutButton redirectUrl="/sign-in">
            <span className="dropdown-item" style={{ cursor: "pointer" }}>
              Đăng xuất
              <FontAwesomeIcon className="icon" icon={faRightFromBracket} />
            </span>
          </SignOutButton>
        </Dropdown.Menu>
      </Dropdown>

      {showModal && <UserEditModal onClose={() => setShowModal(false)} />}
    </div>
  );
}
