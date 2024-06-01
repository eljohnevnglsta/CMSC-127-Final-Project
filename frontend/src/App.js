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
import { Routes, Route, Navigate } from 'react-router-dom';
import UpdateEstablishment from "./pages/Manager/UpdateEstablishment";
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
          <Route path='/manager' element={<ManagerRoot />}>
          <Route path='/manager' element={<ManagerHome />}/>
          <Route path='/manager/food-establishment/:name' element={<ManagerEstablishment />}/>
          <Route path='/manager/food/:code' element={<ManagerFood />}/>
          <Route path='/manager/add-establishment' element={<ManagerAdd />}/>
          <Route path='/manager/update-establishment/:name' element={<UpdateEstablishment />}/>
      </Route>
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
