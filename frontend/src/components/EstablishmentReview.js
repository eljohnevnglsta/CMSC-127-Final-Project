import { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import EditReview from "../components/EditReview";
function EstablishmentReview(props) {
  const name = props.name;
  const [review, setReviews] = useState([]);
  const [error, setError] = useState(false);
  const [startDate, setStartDate] = useState(new Date());
  const [userRole, setUserRole] = useState(null);
  const [username, setUsername] = useState(null);
  const [activeEdit, setActiveEdit] = useState(null);
  // const [passDate, setPassDate] = useState([]);
  useEffect(() => {
    getReviews();
  }, [name]);

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
  console.log(userRole);
  console.log(username);
  function getReviews() {
    fetch("http://localhost:3001/view-establishment-review", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: name,
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
  function getMonthReviews(passDate) {
    fetch("http://localhost:3001/view-all-reviews-for-month", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: name,
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

  const handleEdit = (productId) => {
    setActiveEdit(productId);
  };

  const handleCloseEdit = () => {
      setActiveEdit(null);
  }
  return (
    <div className="reviews-container">
      <button onClick={() => getReviews()}> Show all reviews</button>
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

                  { username == rev.username && (
                    <button onClick={() => handleEdit(rev.reviewid)}>Edit</button>
                  )}
                  
                  { 
                    activeEdit === rev.reviewid && (
                      <EditReview 
                      closeEdit = {handleCloseEdit}
                      resetEstablishment = {getReviews}
                      reviewid = {rev.reviewid}/>
                    )
                  }
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
  );
}

export default EstablishmentReview;
