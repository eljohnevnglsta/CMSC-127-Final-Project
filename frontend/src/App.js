import React from "react";
import Root from "./pages/Root";
import Home from "./pages/Home";
import FoodEstablishment from "./pages/FoodEstablishment";
import Food from "./pages/Food";
import Search from "./pages/Search";
import ManagerAdd from "./pages/Manager/ManagerAdd";
import ManagerEstablishment from "./pages/Manager/ManagerEstablishment";
import ManagerRoot from "./pages/Manager/ManagerRoot";
import ManagerHome from "./pages/Manager/ManagerHome";
import ManagerFood from "./pages/Manager/ManagerFood";
import { Routes, Route, Navigate } from "react-router-dom";
import UpdateEstablishment from "./pages/Manager/UpdateEstablishment";
import LoginPage from "./pages/LoginPage";
import AddReview from "./pages/AddReview";
import "./index.css";
import Unauthorized from "./pages/Unauthorized";
const isAdmin = !!localStorage.getItem("admin");
const isManager = !!localStorage.getItem("manager");
const isUser = !!localStorage.getItem("user");
//sets defined routes for user
//sets defined routes for manager
//sets defined routes for admin
//goes back to login page if not user,admin,or manager
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
            <Route path="/write" element={<AddReview />} />
            <Route path="*" element={<Unauthorized />} />
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
            <Route path="*" element={<Unauthorized />} />
          </Route>
        )}
        {isManager && (
          <Route path="/" element={<ManagerRoot />}>
            <Route path="/" element={<ManagerHome />} />
            <Route
              path="/manager/food-establishment/:name"
              element={<ManagerEstablishment />}
            />
            <Route path="/manager/food/:code" element={<ManagerFood />} />
            <Route path="/manager/add-establishment" element={<ManagerAdd />} />
            <Route
              path="/manager/update-establishment/:name"
              element={<UpdateEstablishment />}
            />
            <Route path="*" element={<Unauthorized />} />
          </Route>
        )}
        {!isUser && !isAdmin && !isManager && (
          <Route path="*" element={<LoginPage />} />
        )}
      </Routes>
    </div>
  );
};

export default App;
