import React from "react";
import "./Card.css";

function Card({
  title,
  subTitle,
  content,
  content2,
  content3,
  mainImage,
  id,
  price,
  count,
}) {
  return (
    <div className="card">
      <div>
        {/* <div style={{ display: "flex", alignItems: "center" }}> */}
        <h1 className="card-title">{title}</h1>
        <span className="card-sub-title">{subTitle}</span>
        {/* </div> */}
        <p className="card-content">{content}</p>
        <p className="card-content2"> {content2}</p>
        <p className="card-price">
          {price ? "가격: " : null}
          {price} {price ? "₩" : null}
        </p>
        {/* <p className="card-count">
          {count ? "재고: " : null} {count}
        </p> */}
        <p className="card-content3">{content3}</p>
      </div>
    </div>
  );
}

export default Card;
