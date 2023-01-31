import React from "react";
import logo from "./logo.svg";
import "./App.css";
import InsightCarousel from "./components/InsightCarousel";
import ReactSwitch from "react-switch";
import { useState } from "react";
import SummaryCarousel from "./components/SummaryCarousel";
import { BrowserRouter, Route, Routes } from "react-router-dom";

export const ThemeContext = React.createContext(null);

function App() {
  const [theme, setTheme] = useState("light");
  const toggleTheme = () => {
    setTheme((curr) => (curr === "light" ? "dark" : "light"));
  };
  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <div className="App" id={theme}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<SummaryCarousel />}></Route>
            <Route path="/insights-view" element={<InsightCarousel />}></Route>
          </Routes>
        </BrowserRouter>
      </div>
    </ThemeContext.Provider>
  );
}

export default App;
