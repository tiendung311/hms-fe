import "bootstrap/dist/css/bootstrap.min.css";
import { useState } from "react";
import { Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRotateLeft, faStar } from "@fortawesome/free-solid-svg-icons";
import "./RatingOverlay.css";

type RatingOverlayProps = {
  onClose: () => void;
  onSubmit: (rating: number, comment: string) => void;
  initialRating?: number;
  initialComment?: string;
};

export default function RatingOverlay({
  onClose,
  onSubmit,
  initialRating = 0,
  initialComment = "",
}: RatingOverlayProps) {
  const [hoverRating, setHoverRating] = useState(0);
  const [selectedRating, setSelectedRating] = useState(initialRating);
  const [comment, setComment] = useState(initialComment);

  const resetRating = () => {
    setSelectedRating(0);
    setHoverRating(0);
    setComment("");
  };

  return (
    <div className="overlay" onClick={onClose}>
      <div className="rating-box" onClick={(e) => e.stopPropagation()}>
        <h2>Đánh giá phòng</h2>
        <div className="stars">
          {[...Array(5)].map((_, index) => {
            const starValue = index + 1;
            return (
              <span
                key={index}
                className={`star ${hoverRating >= starValue ? "hover" : ""} ${
                  selectedRating >= starValue ? "selected" : ""
                }`}
                onMouseEnter={() => setHoverRating(starValue)}
                onMouseLeave={() => setHoverRating(0)}
                onClick={() => setSelectedRating(starValue)}
              >
                <FontAwesomeIcon icon={faStar} />
              </span>
            );
          })}
        </div>
        <textarea
          placeholder="Nhận xét ..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
        <div className="button-group">
          <Button
            variant="warning"
            onClick={() => onSubmit(selectedRating, comment)}
          >
            Xác nhận
          </Button>
          <Button variant="secondary" onClick={resetRating}>
            <FontAwesomeIcon icon={faRotateLeft} /> Làm lại
          </Button>
        </div>
      </div>
    </div>
  );
}
