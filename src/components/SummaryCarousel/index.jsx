import axios from "axios";
import React, { version } from "react";
import { useContext } from "react";
import { useState } from "react";
import { useEffect } from "react";
import Modal from "react-modal";
import { useNavigate } from "react-router-dom";
import ReactSwitch from "react-switch";
import { ThemeContext } from "../../App";
import "./index.css";

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
  },
};

function SummaryCarousel() {
  const [summaryMap, setSummaryMap] = useState(new Map());
  const [isOpen, setIsOpen] = useState(false);
  const [modalData, setModalData] = useState([]);
  const themeValue = useContext(ThemeContext);
  const navigate = useNavigate();
  useEffect(() => {
    let url = process.env.REACT_APP_QUERY_URL;
    const headers = {
      "Content-Type": "application/json",
    };
    let data = {
      size: 10000,
    };
    axios
      .post(url, data, { headers })
      .then((res) => {
        let curr = res.data.hits.hits;
        let curr_Map = new Map();
        for (let i = 0; i < curr.length; i++) {
          if (curr_Map.has(curr[i]._source.group) == false) {
            curr_Map.set(curr[i]._source.group, new Map());
            curr_Map
              .get(curr[i]._source.group)
              .set(curr[i]._source.product, new Map());
            curr_Map
              .get(curr[i]._source.group)
              .get(curr[i]._source.product)
              .set(curr[i]._source.version, {
                pass: curr[i]._source.result == "PASS" ? 1 : 0,
                fail: curr[i]._source.result == "PASS" ? 0 : 1,
                test_list: [
                  new Object({
                    date: curr[i]._source.date,
                    result: curr[i]._source.result,
                    link: curr[i]._source.link,
                  }),
                ],
              });
          } else {
            if (
              curr_Map
                .get(curr[i]._source.group)
                .has(curr[i]._source.product) == false
            ) {
              curr_Map
                .get(curr[i]._source.group)
                .set(curr[i]._source.product, new Map());
              curr_Map
                .get(curr[i]._source.group)
                .get(curr[i]._source.product)
                .set(curr[i]._source.version, {
                  pass: curr[i]._source.result == "PASS" ? 1 : 0,
                  fail: curr[i]._source.result == "PASS" ? 0 : 1,
                  test_list: [
                    new Object({
                      date: curr[i]._source.date,
                      result: curr[i]._source.result,
                      link: curr[i]._source.link,
                    }),
                  ],
                });
            } else {
              if (
                curr_Map
                  .get(curr[i]._source.group)
                  .get(curr[i]._source.product)
                  .has(curr[i]._source.version) == false
              )
                curr_Map
                  .get(curr[i]._source.group)
                  .get(curr[i]._source.product)
                  .set(curr[i]._source.version, {
                    pass: curr[i]._source.result == "PASS" ? 1 : 0,
                    fail: curr[i]._source.result == "PASS" ? 0 : 1,
                    test_list: [
                      new Object({
                        date: curr[i]._source.date,
                        result: curr[i]._source.result,
                        link: curr[i]._source.link,
                      }),
                    ],
                  });
              else {
                let obj_map = curr_Map
                  .get(curr[i]._source.group)
                  .get(curr[i]._source.product)
                  .get(curr[i]._source.version);
                obj_map["pass"] =
                  obj_map["pass"] + (curr[i]._source.result == "PASS" ? 1 : 0);
                obj_map["fail"] =
                  obj_map["fail"] + (curr[i]._source.result == "PASS" ? 0 : 1);
                obj_map.test_list.push(
                  new Object({
                    date: curr[i]._source.date,
                    result: curr[i]._source.result,
                    link: curr[i]._source.link,
                  })
                );
                curr_Map
                  .get(curr[i]._source.group)
                  .get(curr[i]._source.product)
                  .set(curr[i]._source.version, obj_map);
              }
            }
            setSummaryMap(curr_Map);
          }
        }
      })
      .catch((e) => {
        console.log(e);
      });
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
  const openModal = (data) => {
    setModalData(data);
    setIsOpen(true);
  };
  const closeModal = () => {
    setIsOpen(false);
  };
  return (
    <>
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
        {Array.from(summaryMap.keys()).map((data, i) => {
          return (
            <>
              <div className="product-title">{data}</div>
              {Array.from(summaryMap?.get(data)?.keys()).map((service, i) => {
                return (
                  <>
                    <div className="service-title">{service}</div>
                    <div
                      className={`insight-carousel-container scrollable-container-${i}`}
                    >
                      <button className="prev-btn" onClick={() => goPrev(i)}>
                        <p>&lt;</p>
                      </button>
                      <button className="next-btn" onClick={() => goNext(i)}>
                        <p>&gt;</p>
                      </button>
                      {Array.from(
                        summaryMap?.get(data)?.get(service)?.entries()
                      ).map((version, i) => {
                        return (
                          <>
                            <div
                              className="service-card"
                              onClick={() => openModal(version[1]["test_list"])}
                              style={{
                                backgroundColor:
                                  (version[1]["pass"] /
                                    (version[1]["pass"] + version[1]["fail"])) *
                                    100 >=
                                  50
                                    ? `${themeValue.theme}` === "dark"
                                      ? "#3EB489"
                                      : "green"
                                    : `${themeValue.theme}` === "dark"
                                    ? "#CF6679"
                                    : "red",
                              }}
                            >
                              <div className="card-Version">
                                Version : {version[0]}
                              </div>
                              <div className="total-count">
                                TOTAL TESTS :{" "}
                                {version[1]["pass"] + version[1]["fail"]}
                              </div>
                              <div className="pass-count">
                                PASSED TESTS : {version[1]["pass"]}
                              </div>
                              <div className="fail-count">
                                FAILED TESTS: {version[1]["fail"]}
                              </div>
                              <div className="pass-percent">
                                PASS_PERCENTAGE:{" "}
                                {(version[1]["pass"] /
                                  (version[1]["pass"] + version[1]["fail"])) *
                                  100}
                              </div>
                            </div>
                          </>
                        );
                      })}
                    </div>
                  </>
                );
              })}
            </>
          );
        })}
      </div>
      <Modal
        isOpen={isOpen}
        contentLabel="Test Modal"
        style={customStyles}
        onRequestClose={closeModal}
      >
        <h2>Results</h2>
        <table>
          <tr>
            <th>Date</th>
            <th>Result</th>
            <th>Link</th>
          </tr>
          {modalData.map((data, i) => {
            if (i >= 10) return null;
            else {
              return (
                <tr>
                  <td
                    style={{
                      margin: 10,
                      padding: 10,
                    }}
                  >
                    {data.date}
                  </td>
                  <td>{data.result}</td>
                  <td>
                    <a href={data.link}>{data.link}</a>
                  </td>
                </tr>
              );
            }
          })}
        </table>
        <div className="modal-button-container">
          <button onClick={closeModal} className="button-modal">
            Close
          </button>
          <button
            className="button-modal"
            onClick={() => navigate("/insights-view")}
          >
            View More
          </button>
        </div>
      </Modal>
    </>
  );
}

export default SummaryCarousel;
