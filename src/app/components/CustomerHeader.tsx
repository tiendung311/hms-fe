"use client";

import "bootstrap/dist/css/bootstrap.min.css";
import Image from "next/image";
import "./CustomerHeader.css";
import { Dropdown } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBell,
  faCaretDown,
  faIdCard,
  faRightFromBracket,
} from "@fortawesome/free-solid-svg-icons";

export default function CustomerHeader() {
  return (
    <div className="header">
      <div className="logo-group">
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
          }}
        >
          Hôtel
        </h1>
      </div>

      <Dropdown className="dropdown">
        <Dropdown.Toggle
          variant="warning"
          id="dropdown-basic"
          style={{ color: "white" }}
        >
          Nguyễn Văn A
          <FontAwesomeIcon className="icon" icon={faCaretDown} />
        </Dropdown.Toggle>

        <Dropdown.Menu>
          <Dropdown.Item href="#">
            Hồ sơ
            <FontAwesomeIcon className="icon" icon={faIdCard} />
          </Dropdown.Item>
          <Dropdown.Item href="#">
            Hoạt động
            <FontAwesomeIcon className="icon" icon={faBell} />
          </Dropdown.Item>
          <Dropdown.Item href="#">
            Đăng xuất
            <FontAwesomeIcon className="icon" icon={faRightFromBracket} />
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    </div>
  );
}
