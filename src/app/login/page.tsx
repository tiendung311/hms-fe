"use client";

import "./style.css";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLock, faUser } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";

export default function Login() {
  return (
    <div className="container">
      <div className="form" style={{ backgroundColor: "rgba(0, 0, 0, 0.7)" }}>
        <div className="logo-group">
          <Image
            src="/assets/logo-H.png"
            alt="Logo"
            width={50}
            height={50}
            priority
          />
          <h2
            style={{ fontFamily: "Inknut Antiqua", color: "white", margin: 0 }}
          >
            Hôtel
          </h2>
        </div>
        <div className="input-group">
          <input type="text" id="email" placeholder=" " />
          <label htmlFor="email">Gmail/Số điện thoại</label>
          <FontAwesomeIcon
            className="icon"
            icon={faUser}
            style={{ color: "#fff" }}
          />
        </div>
        <div className="input-group">
          <input type="password" id="password" placeholder=" " />
          <label htmlFor="password">Mật khẩu</label>
          <FontAwesomeIcon
            className="icon"
            icon={faLock}
            style={{ color: "#fff" }}
          />
        </div>
        <div className="function">
          <Link id="forgotLink" href="#">
            Quên mật khẩu?
          </Link>
          <Link id="registerLink" href="#">
            Đăng ký
          </Link>
        </div>
        <button className="btn-login">Đăng nhập</button>
      </div>
    </div>
  );
}
