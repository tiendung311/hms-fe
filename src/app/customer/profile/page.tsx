"use client";

import CustomerHeader from "@/app/components/CustomerHeader";
import { Button, Container } from "react-bootstrap";
import "./style.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRotateLeft } from "@fortawesome/free-solid-svg-icons";

export default function Profile() {
  return (
    <Container>
      <CustomerHeader />
      <div className="main">
        <div className="body">
          <div className="profile">
            <h1>Thông tin cá nhân</h1>
            <div className="details">
              <div className="info">
                <label>Họ tên:</label>
                <input type="text" />
              </div>
              <div className="info">
                <label>Email:</label>
                <input type="text" />
              </div>
              <div className="info">
                <label>Số điện thoại:</label>
                <input type="text" />
              </div>
            </div>
          </div>
          <div className="password-group">
            <h1>Cập nhật mật khẩu</h1>
            <div className="details">
              <div className="info">
                <label>Mật khẩu hiện tại:</label>
                <input type="password" />
              </div>
              <div className="info">
                <label>Mật khẩu mới:</label>
                <input type="password" />
              </div>
              <div className="info">
                <label>Xác nhận mật khẩu mới:</label>
                <input type="password" />
              </div>
            </div>
          </div>
        </div>
        <div className="btn-group">
          <Button id="saveBtn" variant="warning" style={{ color: "white" }}>
            Lưu thay đổi
          </Button>
          <Button id="cancelBtn" variant="secondary" style={{ color: "white" }}>
            <FontAwesomeIcon icon={faRotateLeft} />
          </Button>
        </div>
      </div>
    </Container>
  );
}
