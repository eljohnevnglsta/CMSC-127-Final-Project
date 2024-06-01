import React from "react";
import Root from "./pages/Root";
import Home from "./pages/Home";
import FoodEstablishment from "./pages/FoodEstablishment";
import Food from "./pages/Food";
import Search from "./pages/Search";
import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";

const isAdmin = !!localStorage.getItem("admin");
const isManager = !!localStorage.getItem("manager");
const isUser = !!localStorage.getItem("user");

const App = () => {
  return (
    <div className="App">
      <Routes>
        {isUser && (
          <Route path="/" element={<Root />}>
            <Route path="/" element={<Home />} />
            <Route
              path="/food-establishment/:name"
              element={<FoodEstablishment />}
            />
            <Route path="/food/:code" element={<Food />} />
            <Route path="/search" element={<Search />} />
          </Route>
        )}
        {isAdmin && (
          <Route path="/" element={<Root />}>
            <Route path="/" element={<Home />} />
            <Route
              path="/food-establishment/:name"
              element={<FoodEstablishment />}
            />
            <Route path="/food/:code" element={<Food />} />
            <Route path="/search" element={<Search />} />
          </Route>
        )}
        {isManager && (
          <>
            <Route path="/food/:code" element={<Food />} />
            <Route path="/search" element={<Search />} />
          </>
        )}
        {!isUser && !isAdmin && !isManager && (
          <Route path="*" element={<LoginPage />} />
        )}
      </Routes>
    </div>
  );
};

export default App;
