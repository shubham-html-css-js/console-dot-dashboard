import React, { version } from "react";
import { useContext } from "react";
import { useState } from "react";
import Modal from "react-modal";
import { useNavigate } from "react-router-dom";
import ReactSwitch from "react-switch";
import { DataContext, LoadingContext, ThemeContext } from "../../App";
import { Circles } from "react-loader-spinner";
import { Tooltip } from "react-tooltip";
import jspdf from "jspdf";
import "./index.css";
import jsPDF from "jspdf";
import autotable from "jspdf-autotable";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

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

const customStylesTwo = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    padding: "270px",
  },
};

function SummaryCarousel() {
  const [isOpen, setIsOpen] = useState(false);
  const [modalData, setModalData] = useState([]);
  const [generatePdfModal, setGeneratePdfModal] = useState(false);
  const [chosenData, setChosenData] = useState({});
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const themeValue = useContext(ThemeContext);
  const dataValue = useContext(DataContext);
  const loadingValue = useContext(LoadingContext);
  let total = 0;
  const doc = new jsPDF();

  let serviceArray = [];
  let percentageArray = [];
  let totalArray = [];
  const tableColumn = ["Service", "Number of test Runs", "Pass Percentage"];
  const tableRows = [];
  const navigate = useNavigate();
  const goPrev = (service, number) => {
    let screen = document.querySelector(
      `.scrollable-container-${service.split(" ").join("_")}-${number}`
    );
    let width = screen.clientWidth;
    screen.scrollLeft = screen.scrollLeft - width;
  };

  const goNext = (service, number) => {
    let screen = document.querySelector(
      `.scrollable-container-${service.split(" ").join("_")}-${number}`
    );
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
  const closePdfModal = () => {
    setGeneratePdfModal(false);
  };
  const formatDate = (date) => {
    var d = new Date(date),
      month = "" + (d.getMonth() + 1),
      day = "" + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;

    var formattedDate = [year, month, day].join("-");
    return (formattedDate += "T00:00:00.000000+00:00");
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
                          className={`insight-carousel-container scrollable-container-${service
                            .split(" ")
                            .join("_")}-${i}`}
                        >
                          <button
                            className="prev-btn"
                            onClick={() => goPrev(service, i)}
                          >
                            <p>&lt;</p>
                          </button>
                          <button
                            className="next-btn"
                            onClick={() => goNext(service, i)}
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
                              a[1]["test_list"][0].date <
                              b[1]["test_list"][0].date
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
                                    <div
                                      className={`${
                                        version[0].split(":")[1]?.length < 25 ||
                                        (version[0].split(":")[1] ===
                                          undefined &&
                                          version[0]?.length < 25)
                                          ? "card-Version"
                                          : "card-Version-without-justify"
                                      }`}
                                      data-tooltip-id="version-tooltip"
                                      data-tooltip-place="top"
                                      data-tooltip-content={version[0]}
                                    >
                                      Version :{" "}
                                      {version[0].split(":")[1] === undefined
                                        ? version[0]
                                        : version[0].split(":")[1]}
                                    </div>
                                    <div
                                      className="percentage"
                                      data-tooltip-id="percentage-tooltip"
                                      data-tooltip-place="top"
                                      data-tooltip-content={
                                        "Total: " +
                                        (version[1]["pass"] +
                                          version[1]["fail"]) +
                                        ", pass: " +
                                        version[1]["pass"] +
                                        ", fail: " +
                                        version[1]["fail"]
                                      }
                                    >
                                      {(
                                        (version[1]["pass"] /
                                          (version[1]["pass"] +
                                            version[1]["fail"])) *
                                        100
                                      ).toFixed(2)}
                                      %
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
          <div className="generate-btn-div">
            <button
              className="generate-pdf-btn"
              onClick={() => {
                setGeneratePdfModal(true);
              }}
            >
              Generate Report
            </button>
          </div>
        </div>
        <Tooltip id="version-tooltip" />
        <Tooltip id="percentage-tooltip" />
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
        <Modal
          isOpen={generatePdfModal}
          style={customStylesTwo}
          onRequestClose={closePdfModal}
        >
          <h4>
            Select Start Date:{" "}
            <DatePicker
              wrapperClassName="datePicker"
              selected={startDate}
              onChange={(date) => setStartDate(date)}
              onChangeRaw={(e) => {
                e.target.value = "";
                setStartDate("");
                setEndDate("");
              }}
            ></DatePicker>
          </h4>
          <h4>
            Select End Date:{" "}
            <DatePicker
              wrapperClassName="datePicker"
              disabled={startDate === "" || startDate === null ? true : false}
              selected={endDate}
              onChange={(date) => setEndDate(date)}
              minDate={startDate}
              onChangeRaw={(e) => (e.target.value = "")}
            ></DatePicker>
          </h4>
          <div className="generate-btn-div">
            <button
              className="generate-pdf-btn2"
              onClick={() => {
                doc.setFontSize(20);

                doc.text(
                  `Test Run Result report from ${startDate
                    .toString()
                    .slice(4, 15)} to ${endDate.toString().slice(4, 15)}`,
                  24,
                  15
                );
                const formattedStartDate = formatDate(
                  startDate.toString().slice(4, 15)
                );
                const formattedEndDate = formatDate(
                  new Date(
                    new Date(endDate).setDate(new Date(endDate).getDate() + 1)
                  )
                    .toString()
                    .slice(4, 15)
                );
                let linenumber = 30;
                let serviceName = "";
                {
                  Array.from(dataValue?.summaryMap.keys()).map((data, i) => {
                    total = 0;
                    doc.setFontSize(22);
                    doc.text(`${data} group`, 8, linenumber);
                    linenumber += 10;
                    serviceName = data;
                    serviceArray = [];
                    percentageArray = [];
                    totalArray = [];
                    {
                      Array.from(dataValue?.summaryMap?.get(data)?.keys()).map(
                        (service, i) => {
                          let pass = 0;
                          let fail = 0;
                          {
                            Array.from(
                              dataValue?.summaryMap
                                ?.get(data)
                                ?.get(service)
                                ?.entries()
                            )
                              .sort((a, b) =>
                                a[1]["test_list"][0].date <
                                b[1]["test_list"][0].date
                                  ? 1
                                  : -1
                              )
                              .map((version, i) => {
                                for (
                                  let i = 0;
                                  i < version[1].test_list.length;
                                  i++
                                ) {
                                  if (
                                    version[1].test_list[i].date >=
                                      formattedStartDate &&
                                    version[1].test_list[i].date <
                                      formattedEndDate
                                  ) {
                                    pass =
                                      version[1].test_list[i].result === "PASS"
                                        ? pass + 1
                                        : pass;
                                    fail =
                                      version[1].test_list[i].result ===
                                        "FAIL" ||
                                      version[1].test_list[i].result === "ERROR"
                                        ? fail + 1
                                        : fail;
                                    total += 1;
                                  } else if (
                                    version[1].test_list[i].date <
                                    formattedStartDate
                                  )
                                    break;
                                }
                              });
                            if (pass + fail > 0) {
                              serviceArray.push(service);
                              percentageArray.push(
                                ((pass / (pass + fail)) * 100).toFixed(2)
                              );
                              totalArray.push(pass + fail);
                            }
                          }
                        }
                      );
                    }
                    doc.setFontSize(14);
                    doc.text(
                      `For ${serviceName} group , a total of ${total} test runs were triggered in the last month`,
                      8,
                      linenumber,
                      {
                        maxWidth: 200,
                      }
                    );
                    linenumber += 8;
                    if (serviceArray.length > 0)
                      doc.text(
                        `Test runs were triggered for ${serviceArray.map(
                          (service, i) => service
                        )} services with a pass percentage of ${percentageArray.map(
                          (passPercentage) => passPercentage
                        )} respectively`,
                        8,
                        linenumber,
                        {
                          maxWidth: 200,
                        }
                      );
                    linenumber += 13;
                    let body = [];
                    for (let i = 0; i < serviceArray.length; i++) {
                      body.push([
                        serviceArray[i],
                        totalArray[i],
                        percentageArray[i],
                      ]);
                    }
                    if (serviceArray.length > 0) {
                      autotable(doc, {
                        head: [
                          ["Service", "Number of Test Runs", "Pass Percentage"],
                        ],
                        body: body,
                        startY: linenumber,
                      });
                      linenumber += (serviceArray.length + 2) * 8.5;
                    }
                  });
                }

                doc.save("result.pdf");
              }}
              disabled={
                startDate === "" ||
                startDate === null ||
                endDate === "" ||
                endDate === null
              }
            >
              Generate
            </button>
          </div>
        </Modal>
      </>
    );
}

export default SummaryCarousel;
