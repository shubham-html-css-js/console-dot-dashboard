import React, { useEffect } from "react";
import axios from "axios";
import { useState } from "react";
import "./index.css";
import ServiceCard from "../ServiceCard";
import ReactSwitch from "react-switch";
import { useContext } from "react";
import { ThemeContext } from "../../App";
const InsightCarousel = () => {
  const [productList, setProductList] = useState([]);
  const themeValue = useContext(ThemeContext);
  useEffect(() => {
    let url = process.env.REACT_APP_QUERY_URL;
    const headers = {
      "Content-Type": "application/json",
    };
    let data = {
      size: 0,
      aggs: {
        products: { terms: { field: "product.keyword", size: 500 } },
      },
    };
    let promise = [];
    axios
      .post(url, data, { headers })
      .then((res) => {
        for (
          let i = 0;
          i < res.data.aggregations.products.buckets.length;
          i++
        ) {
          let newData = {
            query: {
              term: {
                "product.keyword": {
                  value: `${res.data.aggregations.products.buckets[i].key}`,
                },
              },
            },
          };
          promise.push(axios.post(url, newData, { headers }));
        }
        Promise.all(promise).then((res) => {
          setProductList(res);
        });
      })
      .catch((e) => console.log(e));
  }, []);
  const goPrev = (number) => {
    let screen = document.querySelector(`.scrollable-container-${number}`);
    let width = screen.clientWidth;
    screen.scrollLeft = screen.scrollLeft - width;
  };

  const goNext = (number) => {
    let screen = document.querySelector(`.scrollable-container-${number}`);
    let width = screen.clientWidth;
    screen.scrollLeft = screen.scrollLeft + width;
  };
  return (
    <div className="insight-carousel" id={themeValue.theme}>
      <label className="switch-label">
        <div className="switch-div">
          <span className="switch-text" id={themeValue.theme}>
            {themeValue.theme === "light" ? "Light Mode" : "Dark Mode"}
          </span>
          <ReactSwitch
            height={20}
            width={44}
            onChange={themeValue.toggleTheme}
            onColor="#86d3ff"
            onHandleColor="#2693e6"
            uncheckedIcon={false}
            checkedIcon={false}
            boxShadow="0px 1px 5px rgba(0, 0, 0, 0.6)"
            activeBoxShadow="0px 0px 1px 2px rgba(0, 0, 0, 0.2)"
            checked={themeValue.theme === "light" ? false : true}
          />
        </div>
      </label>
      {productList?.map((data, i) => {
        return (
          <>
            <div className="product-title" id={themeValue.theme}>
              {data.data.hits.hits[0]._source.product}
            </div>
            <div
              className={`insight-carousel-container scrollable-container-${i}`}
            >
              <button className="prev-btn" onClick={() => goPrev(i)}>
                <p>&lt;</p>
              </button>
              <button className="next-btn" onClick={() => goNext(i)}>
                <p>&gt;</p>
              </button>
              {data.data.hits.hits
                .sort((a, b) => (a._source.date < b._source.date ? 1 : -1))
                .map((point) => {
                  return <ServiceCard cardContent={point}></ServiceCard>;
                })}
            </div>
          </>
        );
      })}
    </div>
  );
};

export default InsightCarousel;
