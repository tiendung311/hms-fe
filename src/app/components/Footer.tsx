import Image from "next/image";
import "./Footer.css";

export default function Footer() {
  return (
    <div className="footer">
      <div className="footer-container">
        <div className="contents">
          <div className="detail">
            <h3>Liên hệ</h3>
            <p>123 Cầu Giấy, Hà Nội</p>
            <p>+84 123 456 789</p>
          </div>
          <div className="detail">
            <h3>Loại phòng</h3>
            <p>Đơn - Đôi</p>
            <p>3 sao - 4 sao - 5 sao</p>
          </div>
          <div className="detail">
            <h3>Dịch vụ</h3>
            <p>Spa</p>
            <p>Bể bơi</p>
            <p>Sky bar</p>
            <p>Ẩm thực Michelin</p>
          </div>
          <div className="detail">
            <h3>Liên kết</h3>
            <div className="payos">
              <Image
                src="/assets/payos-logo.png"
                alt="payos"
                width={150}
                height={80}
              />
            </div>
          </div>
        </div>
        <div className="social-media" style={{ marginTop: "50px" }}>
          <Image
            src="/assets/facebook.png"
            alt="facebook"
            width={50}
            height={50}
          />
          <Image
            src="/assets/instagram.png"
            alt="instagram"
            width={39}
            height={39}
          />
          <Image
            src="/assets/twitter.png"
            alt="twitter"
            width={43}
            height={43}
          />
          <Image
            src="/assets/youtube.png"
            alt="youtube"
            width={43}
            height={43}
          />
        </div>
      </div>
    </div>
  );
}
