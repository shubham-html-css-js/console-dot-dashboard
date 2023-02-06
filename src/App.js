import React, { useEffect } from "react";
import "./App.css";
import { useState } from "react";
import SummaryCarousel from "./components/SummaryCarousel";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import axios from "axios";
import TableOfRuns from "./components/TableOfRuns";

export const ThemeContext = React.createContext(null);
export const DataContext = React.createContext(null);
export const LoadingContext = React.createContext(null);

function App() {
  const [theme, setTheme] = useState("light");
  const [summaryMap, setSummaryMap] = useState(new Map());
  const [isLoading, setIsLoading] = useState(true);
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
          if (curr_Map.has(curr[i]._source.group) === false) {
            curr_Map.set(curr[i]._source.group, new Map());
            curr_Map
              .get(curr[i]._source.group)
              .set(curr[i]._source.product, new Map());
            curr_Map
              .get(curr[i]._source.group)
              .get(curr[i]._source.product)
              .set(curr[i]._source.version, {
                pass: curr[i]._source.result === "PASS" ? 1 : 0,
                fail: curr[i]._source.result === "PASS" ? 0 : 1,
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
                .has(curr[i]._source.product) === false
            ) {
              curr_Map
                .get(curr[i]._source.group)
                .set(curr[i]._source.product, new Map());
              curr_Map
                .get(curr[i]._source.group)
                .get(curr[i]._source.product)
                .set(curr[i]._source.version, {
                  pass: curr[i]._source.result === "PASS" ? 1 : 0,
                  fail: curr[i]._source.result === "PASS" ? 0 : 1,
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
                  .has(curr[i]._source.version) === false
              )
                curr_Map
                  .get(curr[i]._source.group)
                  .get(curr[i]._source.product)
                  .set(curr[i]._source.version, {
                    pass: curr[i]._source.result === "PASS" ? 1 : 0,
                    fail: curr[i]._source.result === "PASS" ? 0 : 1,
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
                  obj_map["pass"] + (curr[i]._source.result === "PASS" ? 1 : 0);
                obj_map["fail"] =
                  obj_map["fail"] + (curr[i]._source.result === "PASS" ? 0 : 1);
                let loc = findLocation(
                  obj_map.test_list,
                  curr[i]._source.date,
                  0,
                  obj_map.test_list.length - 1
                );
                obj_map.test_list.splice(
                  loc,
                  0,
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
          }
        }
        setSummaryMap(curr_Map);
        setIsLoading(false);
      })
      .catch((e) => {
        console.log(e);
      });
  }, []);
  const toggleTheme = () => {
    setTheme((curr) => (curr === "light" ? "dark" : "light"));
  };
  const findLocation = (mp, test_date, start, end) => {
    while (start <= end) {
      let mid = Math.floor((start + end) / 2);
      if (mp[mid].date > test_date) start = mid + 1;
      else end = mid - 1;
    }
    return start;
  };
  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <DataContext.Provider value={{ summaryMap }}>
        <LoadingContext.Provider value={{ isLoading, setIsLoading }}>
          <div className="App" id={theme}>
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<SummaryCarousel />}></Route>
                <Route
                  path="/table-view/:group_name/:product_name/*"
                  element={<TableOfRuns />}
                ></Route>
              </Routes>
            </BrowserRouter>
          </div>
        </LoadingContext.Provider>
      </DataContext.Provider>
    </ThemeContext.Provider>
  );
}

export default App;
