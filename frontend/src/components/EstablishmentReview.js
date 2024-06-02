import { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import EditReview from "../components/EditReview";
import 'react-datepicker/dist/react-datepicker.css';
import { Dialog } from "@material-tailwind/react";
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

  
    
  const renderMonthContent = (month, shortMonth, longMonth, day) => {
    const fullYear = new Date(day).getFullYear();
    const tooltipText = `Tooltip for month: ${longMonth} ${fullYear}`;

    return <span title={tooltipText}>{shortMonth}</span>;
  };


  return (
    <div className="reviews-container">

    <div className="border-sky-950 border-b mb-8 flex items-center pb-2">
      <div className='flex justify-end items-center w-full px-4 '>
      <button className='border mr-1 ml-2 py-3 px-4 font-medium border-sky-950 rounded-full 'onClick={() => getReviews()}> Show all reviews</button>
      <label>Select review from a specific month: </label>

     
            <DatePicker
            className='border mr-1 ml-2 py-3 px-4 font-medium border-sky-950 rounded-full '
            dateFormat="MMMM yyyy"
            renderMonthContent={renderMonthContent}
            showMonthYearPicker
            selected={startDate}
            onChange={handleDateChange}
            />
         
     
      
      
      </div>
      </div>

      {!error ? (
        <>

      <div className='grid lg:grid-cols-3 md:grid-cols-2  pb-32 gap-6 mx-32'>
          {review.map((rev) => {
            return (
              <div className="max-w-sm rounded overflow-hidden px-8 py-6 shadow-lg hover:shadow">
                <div className="flex mb-2">
                <img class="w-10 h-10 rounded-full" src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png" alt="Rounded avatar"></img>
                <h2 className='font-bold text-xl pl-2 mb-2 text-sky-950'>{rev.username} says...</h2>
                </div>
                <h3 className="text-xl"> <strong>Rating:</strong> {rev.rating} </h3>
                <div className="p-4 my-4 border-s-4 border-gray-300  dark:border-gray-500 dark:bg-gray-800 rounded-lg">
                <p className="text-base italic text-white">{rev.content}</p>
                </div>
                {(userRole == "admin" || username == rev.username) && (
                  <button className='bg-red-500 py-3 px-6 mx-2 rounded-full text-white transition hover:scale-105 hover:bg-blue-950 ease-out duration-150' onClick={() => handleDelete(rev)}>Delete</button>
                )}

                  { username == rev.username && (
                    <button className='bg-sky-950 py-3 px-6 mx-2 rounded-full text-white transition hover:scale-105 hover:bg-blue-950 ease-out duration-150' onClick={() => handleEdit(rev.reviewid)}>Edit</button>
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
        </div>
        </>
      ) : (
        <p>No reviews found.</p>
      )}
    </div>
  );
}

export default EstablishmentReview;
