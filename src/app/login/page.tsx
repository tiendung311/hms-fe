"use client";

import "bootstrap/dist/css/bootstrap.min.css";
import "./style.css";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash, faUser } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import { useState } from "react";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="login-container">
      <div className="form" style={{ backgroundColor: "rgba(0, 0, 0, 0.7)" }}>
        <div className="logo-group">
          <Image
            src="/assets/logo-H.png"
            alt="Logo"
            width={50}
            height={50}
            priority
          />
          <h1 style={{ color: "white", marginTop: "10px" }}>Hôtel</h1>
        </div>
        <div className="input-groups">
          <input type="text" id="email" placeholder=" " autoComplete="off" />
          <label htmlFor="email">Gmail</label>
          <FontAwesomeIcon
            className="icon"
            icon={faUser}
            style={{ color: "#fff" }}
          />
        </div>
        <div className="input-groups">
          <input
            type={showPassword ? "text" : "password"}
            id="password"
            placeholder=" "
          />
          <label htmlFor="password">Mật khẩu</label>
          <FontAwesomeIcon
            className="icon"
            icon={showPassword ? faEye : faEyeSlash}
            style={{ color: "#fff", cursor: "pointer" }}
            onClick={() => setShowPassword(!showPassword)}
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
