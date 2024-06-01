import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import DatePicker from "react-datepicker";

function Food() {
  let { code } = useParams();
  const [fooddata, setFoodData] = useState([]);
  const [review, setReviews] = useState([]);
  const [error, setError] = useState(false);
  const [startDate, setStartDate] = useState(new Date());
  const [userRole, setUserRole] = useState(null);
  const [username, setUsername] = useState(null);
  useEffect(() => {
    fetch("http://localhost:3001/select-food", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        foodcode: code,
      }),
    })
      .then((response) => response.json()) // Parse JSON response
      .then((data) => {
        // setError(false)
        console.log(data);
        setFoodData(data); // Update state with the parsed data
      });
  }, []);

  useEffect(() => {
    getFoodReviews();
  }, [code]);

  useEffect(() => {
    const admin = localStorage.getItem("admin");
    const manager = localStorage.getItem("manager");
    const user = localStorage.getItem("user");

    if (admin) {
      setUserRole("admin");
      setUsername(admin);
    } else if (manager) {
      setUserRole("manager");
      setUsername(manager);
    } else if (user) {
      setUserRole("user");
      setUsername(user);
    } else {
      setUserRole("guest");
    }
  }, []);

  function handleDelete(review) {
    const userToDelete = userRole === "admin" ? review.username : username;
    fetch("http://localhost:3001/review/delete", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        reviewid: review.reviewid,
        username: userToDelete,
      }),
    })
      .then((response) => {
        if (!response.ok) {
          console.log(response);
          throw new Error(response.statusText);
        }
        console.log(response);
        return response.json();
      })
      .then((data) => {
        if (data.affectedRows > 0) {
          setReviews((prevReviews) =>
            prevReviews.filter((rev) => rev.reviewid !== review.reviewid)
          );
        } else {
          console.error("Error deleting review:", data.message);
        }
      })
      .catch((error) => {
        console.error("Error deleting review:", error);
      });
  }

  function getFoodReviews() {
    fetch("http://localhost:3001/view-all-reviews-for-food-item", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        foodcode: code,
      }),
    })
      .then((response) => response.json()) // Parse JSON response
      .then((data) => {
        setError(false);
        setReviews(data); // Update state with the parsed data
      })
      .catch((error) => {
        setError(true);
      });
  }

  function getMonthReviews(passDate) {
    fetch("http://localhost:3001/select-food-review-month", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        foodcode: code,
        date: passDate,
      }),
    })
      .then((response) => response.json()) // Parse JSON response
      .then((data) => {
        setError(false);
        setReviews(data); // Update state with the parsed data
      })
      .catch((error) => {
        setError(true);
        // setReviews([])
      });
  }
  const handleDateChange = (date) => {
    setStartDate(date);
    console.log(date);

    // Adjusting the date to Philippine Standard Time (UTC+8)
    const localDate = new Date(date.getTime() + 8 * 60 * 60 * 1000);

    // Formatting the date
    const formattedDate = localDate
      .toISOString()
      .slice(0, 10)
      .replace("T", " ");
    console.log(formattedDate);
    getMonthReviews(formattedDate);
    // setPassDate(formattedDate);
  };


    return(
        <div className="food-container">

        {
            fooddata.map((food) =>{
                return(
                    <div className="food-details">
                        <h1>{food.name}</h1>
                        <h3>From: {food.est}</h3>
                        <h3>Type: {food.foodtype}</h3>
                        {food.averageRating ? <h5>Rating: {food.averageRating}</h5>: <p>Newly added food!</p> }
                        {food.isspecialty === 1? <p>Specialty!</p> : null}
                        {food.isbestseller === 1? <p>Best Seller!</p>: null}
                        <Link to={`/write/?reviewType=food&establishment=${food.est}&food=${food.name}`}><button>Write a review</button></Link>
                    </div>
                )
            })
        }

      <h1>Reviews</h1>
      <div className="reviews-container">
        <button onClick={() => getFoodReviews()}> Show all reviews</button>
        <label>Select review from a specific month: </label>
        <DatePicker
          dateFormat="MMMM yyyy"
          showMonthYearPicker
          selected={startDate}
          onChange={handleDateChange}
        />
        {!error ? (
          <>
            {review.map((rev) => {
              return (
                <div className="review-card">
                  <h2>{rev.username}</h2>
                  <h3>Rating: {rev.rating} </h3>
                  <p>{rev.content}</p>
                  {(userRole == "admin" || username == rev.username) && (
                    <button onClick={() => handleDelete(rev)}>Delete</button>
                  )}
                  {/* <p>{rev.date_added}</p> */}
                  {/* format date dapat */}
                </div>
              );
            })}{" "}
          </>
        ) : (
          <p>No reviews found.</p>
        )}
      </div>
    </div>
  );
}

export default Food;
