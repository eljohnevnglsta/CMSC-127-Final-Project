import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import FoodList from "../components/FoodList";
import EstablishmentReview from "../components/EstablishmentReview";
function FoodEstablishment() {
  let { name } = useParams();

  const [showReview, setShowReview] = useState(false);
  const [businessDetails, setBusinessDetails] = useState({});

  useEffect(() => {
    let url = `http://localhost:3001/select-establishment-details/${name}`;
    fetch(url)
      .then((response) => response.json())
      .then((body) => {
        console.log(body[0]);
        setBusinessDetails(body[0]);
      });
  }, []);
  const isAdmin = !!localStorage.getItem("admin");
  return (
    <div className="food-establishment-container">
      <h1>{name}</h1>
            <p>Average Rating: {businessDetails.averageRating}</p>
            <p>Type: {businessDetails.type}</p>
            <p>Address: {businessDetails.street}, {businessDetails.barangay}, {businessDetails.city}, {businessDetails.province}</p>
            <Link to={`/write/?reviewType=establishment&establishment=${name}`}><button>Write a review</button></Link>
      <button
        onClick={() => {
          setShowReview(false);
        }}
      >
        Foods
      </button>
      <button
        onClick={() => {
          setShowReview(true);
        }}
      >
        Reviews
      </button>
      {showReview ? (
        <EstablishmentReview name={name} />
      ) : (
        <FoodList name={name} />
      )}
    </div>
  );
}

export default FoodEstablishment;
