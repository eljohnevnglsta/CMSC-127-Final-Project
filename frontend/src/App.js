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
const App = () => {
  return (
    <div className="App">
      <Routes>
      <Route path="/"  element={<Root  />}>
        <Route path="/"  element={<Home  />}/>
          <Route path="/food-establishment/:name" element={<FoodEstablishment />}/>
          <Route path="/food/:code" element={<Food />}/>
          <Route path="/search" element={<Search />}/>
      </Route>


      <Route path='/manager' element={<ManagerRoot />}>
          <Route path='/manager' element={<ManagerHome />}/>
          <Route path='/manager/food-establishment/:name' element={<ManagerEstablishment />}/>
          <Route path='/manager/food/:code' element={<ManagerFood />}/>
          <Route path='/manager/add-establishment' element={<ManagerAdd />}/>
          <Route path='/manager/update-establishment/:name' element={<UpdateEstablishment />}/>
      </Route>
      </Routes>
    </div>
  );
};

export default App;
