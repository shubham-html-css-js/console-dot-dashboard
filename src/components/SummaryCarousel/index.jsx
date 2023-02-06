import React from "react";
import { useContext } from "react";
import { useState } from "react";
import Modal from "react-modal";
import { useNavigate } from "react-router-dom";
import ReactSwitch from "react-switch";
import { DataContext, LoadingContext, ThemeContext } from "../../App";
import { Circles } from "react-loader-spinner";
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
  const [isOpen, setIsOpen] = useState(false);
  const [modalData, setModalData] = useState([]);
  const [chosenData, setChosenData] = useState({});
  const themeValue = useContext(ThemeContext);
  const dataValue = useContext(DataContext);
  const loadingValue = useContext(LoadingContext);
  const navigate = useNavigate();
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
  const openModal = (data, group_name, product_name, version_number) => {
    setModalData(data);
    setChosenData({ group_name, product_name, version_number });
    setIsOpen(true);
  };
  const closeModal = () => {
    setIsOpen(false);
  };
  if (loadingValue.isLoading === true)
    return (
      <div className="loading-container">
        <Circles
          height="80"
          width="80"
          color="blue"
          ariaLabel="circles-loading"
          wrapperStyle={{}}
          wrapperClass=""
          visible={true}
        ></Circles>
      </div>
    );
  else
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
          {Array.from(dataValue?.summaryMap.keys()).map((data, i) => {
            return (
              <>
                <div className="product-title">{data}</div>
                {Array.from(dataValue?.summaryMap?.get(data)?.keys()).map(
                  (service, i) => {
                    return (
                      <>
                        <div className="service-title">{service}</div>
                        <div
                          className={`insight-carousel-container scrollable-container-${i}`}
                        >
                          <button
                            className="prev-btn"
                            onClick={() => goPrev(i)}
                          >
                            <p>&lt;</p>
                          </button>
                          <button
                            className="next-btn"
                            onClick={() => goNext(i)}
                          >
                            <p>&gt;</p>
                          </button>
                          {Array.from(
                            dataValue?.summaryMap
                              ?.get(data)
                              ?.get(service)
                              ?.entries()
                          )
                            .sort((a, b) =>
                              a[1]["test_list"][0]
                                .date <
                              b[1]["test_list"][0]
                                .date
                                ? 1
                                : -1
                            )
                            .map((version, i) => {
                              let darkColor, lightColor;
                              const pass_percent =
                                (version[1]["pass"] /
                                  (version[1]["pass"] + version[1]["fail"])) *
                                100;
                              if (pass_percent >= 75 && pass_percent <= 100) {
                                darkColor = "#3EB489";
                                lightColor = "green";
                              } else if (
                                pass_percent >= 50 &&
                                pass_percent < 75
                              ) {
                                darkColor = "#aa9208";
                                lightColor = "#8B8000";
                              } else if (
                                pass_percent >= 25 &&
                                pass_percent < 50
                              ) {
                                darkColor = "#FDA172";
                                lightColor = "orange";
                              } else {
                                darkColor = "#CF6679";
                                lightColor = "red";
                              }
                              return (
                                <>
                                  <div
                                    className="service-card"
                                    onClick={() =>
                                      openModal(
                                        version[1]["test_list"],
                                        data,
                                        service,
                                        version[0]
                                      )
                                    }
                                    style={{
                                      backgroundColor:
                                        `${themeValue.theme}` === "dark"
                                          ? darkColor
                                          : lightColor,
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
                                      {(
                                        (version[1]["pass"] /
                                          (version[1]["pass"] +
                                            version[1]["fail"])) *
                                        100
                                      ).toFixed(2)}
                                    </div>
                                  </div>
                                </>
                              );
                            })}
                        </div>
                      </>
                    );
                  }
                )}
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

            {modalData.length > 10 ? (
              <button
                className="button-modal"
                onClick={() =>
                  navigate(
                    `/table-view/${chosenData.group_name}/${chosenData.product_name}/${chosenData.version_number}`
                  )
                }
              >
                View More
              </button>
            ) : null}
          </div>
        </Modal>
      </>
    );
}

export default SummaryCarousel;
