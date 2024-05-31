import React from "react";
import Root from "./pages/Root";
import Home from "./pages/Home";
import FoodEstablishment from "./pages/FoodEstablishment";
import Food from "./pages/Food";
import Search from "./pages/Search";
import { Routes, Route, Navigate } from 'react-router-dom';
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
      </Routes>
    </div>
  );
};

export default App;
