import React, { useEffect, useState } from "react";
import axios from "axios";

const FoodEstablishments = () => {
  const [establishments, setEstablishments] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:3001/view-all-establishments")
      .then((response) => {
        setEstablishments(response.data);
      })
      .catch((error) => {
        console.error("There was an error fetching the establishments!", error);
      });
  }, []);

  return (
    <div>
      <h1>Food Establishments</h1>
      <ul>
        {establishments.map((establishment) => (
          <li key={establishment.businessid}>
            {establishment.name} - {establishment.type} -{" "}
            {establishment.averageRating}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FoodEstablishments;
