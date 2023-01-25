import React, { useContext } from "react";
import { ThemeContext } from "../../App";
import "./index.css";
const ServiceCard = ({ cardContent }) => {
  const themeValue = useContext(ThemeContext);
  return (
    <div
      className="service-card"
      style={{
        backgroundColor:
          cardContent._source.result === "FAIL"
            ? `${themeValue.theme}` === "dark"
              ? "#CF6679"
              : "red"
            : `${themeValue.theme}` === "dark"
            ? "#3EB489"
            : "green",
      }}
    >
      <div className="card-Title">{cardContent._source.product}</div>
      <div className="card-Version">
        Version : {cardContent._source.version}
      </div>
      <div className="card-date">Date: {cardContent._source.date}</div>
      <div className="card-result">Result : {cardContent._source.result}</div>
      <div className="card-link">
        <a href={cardContent._source.link} className="result-link">
          Result Link
        </a>
      </div>
    </div>
  );
};

export default ServiceCard;
