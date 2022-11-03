import React, { useEffect } from "react";
import axios from "axios";
import { useState } from "react";
import "./index.css";
import ServiceCard from "../ServiceCard";
const InsightCarousel = () => {
  const [productList, setProductList] = useState([]);
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
    <div className="insight-carousel">
      {productList?.map((data, i) => {
        return (
          <>
            <div className="product-title">
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
              {data.data.hits.hits.map((point) => {
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
