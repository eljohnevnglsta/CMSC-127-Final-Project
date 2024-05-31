import React, { useEffect, useState } from "react";
import { Link } from 'react-router-dom';
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
          
          <div key={establishment.businessid}>

            <Link to>{establishment.name}</Link> - {establishment.type} -{" "}
            {establishment.averageRating}
          </div>
        ))}
      </ul>
    </div>
  );
};

export default FoodEstablishments;
