import React from "react";
import ReactDOM from "react-dom/client";

import { BrowserRouter } from "react-router-dom";
import App from "./App.js";
import EditReview from "./components/EditReview.js";
import AddReview from "./components/AddReview.js";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      {/* <App /> */}
      <EditReview reviewid={10}/>
      {/* <AddReview /> */}
    </BrowserRouter>
  </React.StrictMode>
);