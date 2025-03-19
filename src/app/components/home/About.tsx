import Image from "next/image";
import "./About.css";
import { Carousel } from "react-bootstrap";

const images = [
  "/assets/architecture.jpg",
  "/assets/spa.jpg",
  "/assets/pool.jpg",
  "/assets/cuisine.jpg",
];

export default function About() {
  return (
    <div className="about-container">
      <div className="content">
        <Image
          src="/assets/logo-H.png"
          alt="Logo"
          width={50}
          height={50}
          priority
        />
        <h1
          style={{
            margin: "20px 0 40px",
            fontSize: "2.5rem",
          }}
        >
          Về chúng tôi
        </h1>
        <p>
          Khách sạn 5 sao sang trọng với thiết kế tinh tế và dịch vụ đẳng cấp.
        </p>
        <p>Thưởng thức ẩm thực Michelin, thư giãn tại spa và hồ bơi vô cực.</p>
        <p>Sky bar với tầm nhìn tuyệt đẹp mang đến trải nghiệm khó quên.</p>
        <p>Hãy tận hưởng kỳ nghỉ hoàn hảo cùng chúng tôi!</p>
      </div>
      <div className="carousels">
        <Carousel>
          {images.map((image, index) => (
            <Carousel.Item key={index} interval={2000}>
              <Image src={image} alt="Carousel" width={900} height={500} />
            </Carousel.Item>
          ))}
        </Carousel>
      </div>
    </div>
  );
}
