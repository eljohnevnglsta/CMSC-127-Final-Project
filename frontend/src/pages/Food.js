import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import DatePicker from "react-datepicker";
import EditReview from "../components/EditReview";
import 'react-datepicker/dist/react-datepicker.css';
function Food() {
  let { code } = useParams();
  const [fooddata, setFoodData] = useState([]);
  const [review, setReviews] = useState([]);
  const [error, setError] = useState(false);
  const [startDate, setStartDate] = useState(new Date());
  const [userRole, setUserRole] = useState(null);
  const [username, setUsername] = useState(null);
  // const [showUpdate, setShowUpdate] = useState(false)
  const [activeEdit, setActiveEdit] = useState(null);
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
        setFoodData([data]); // Update state with the parsed data
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

  const handleEdit = (productId) => {
    setActiveEdit(productId);
  };

  const handleCloseEdit = () => {
      setActiveEdit(null);
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


  const renderMonthContent = (month, shortMonth, longMonth, day) => {
    const fullYear = new Date(day).getFullYear();
    const tooltipText = `Tooltip for month: ${longMonth} ${fullYear}`;

    return <span title={tooltipText}>{shortMonth}</span>;
  };

    return(
      <div className="my-10 overflow-hidden mx-20 min-h-screen round shadow-lg ">
        <img className="h-60 w-full" src="https://t4.ftcdn.net/jpg/03/39/43/29/360_F_339432932_UvTfQZoi68BfndE1mPI8nkRo60jNNHCh.jpg" alt="Sunset in the mountains"></img>
        <div className="py-10 px-20 ">
        {
            fooddata.map((food) =>{
                return(
                  <>
                        <h1 className='font-bold text-4xl  text-sky-950'>{food.name}</h1>
                        <div className="flex mt-4 ml-8 shadow-md py-7 px-7 w-11/12 round">
                      <div className="w-9/12 px-4">
                        <h3  className='text-lg'> <strong>From: </strong>{food.est}</h3>
                        <div className="flex">
                        <h3  className='text-lg'><strong>Type: </strong></h3> 
                        {food.foodtype.map((element, index) => (
                            <u><h3  className='ml-2 text-lg' key={index}> {element } 
                            
                            </h3></u>
                        ))}
                        </div>
                        
                        {food.averageRating ? <h5  className='text-lg'> <strong>Rating: </strong> {food.averageRating}</h5>: <p className='text-lg'>Newly added food!</p> }
                        {food.isspecialty === 1? <p  className='text-lg font-semibold'>Specialty!</p> : null}
                        {food.isbestseller === 1? <p  className='text-lg font-semibold'>Best Seller!</p>: null}
                      </div>
                        <Link to={`/write/?reviewType=food&establishment=${food.est}&food=${food.name}`}><button
                        className='bg-sky-950 py-3 px-6 ml-4 mr-12 rounded-full text-white transition hover:scale-105 hover:bg-blue-950 ease-out duration-150'
                        >Write a review
                        <svg className="inline-block stroke-white ml-2 w-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 6L12 18" strokeWidth="2" strokeLinecap="round"/>
                        <path d="M18 12L6 12" strokeWidth="2" strokeLinecap="round"/>
                        </svg>
                        </button></Link>
                    </div>
                    </>
                )
            })
        } 

      <div className="flex mt-4 ml-8 shadow-md py-7 px-7 w-11/12 round">
      <div className="reviews-container w-full">
      <h1 className='font-bold text-4xl  text-sky-950'>Reviews</h1>
      
      <div className="border-sky-950 border-b mb-8 flex items-center pb-2">
      <div className='flex justify-end items-center w-full px-4 '>
      <button className='border mr-1 ml-2 py-3 px-4 font-medium border-sky-950 rounded-full 'onClick={() => getFoodReviews()}> Show all reviews</button>
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
                <div className="p-4 my-4 border-s-4 border-gray-300  dark:border-gray-500 dark:bg-gray-800">
                <p className="text-base italic">{rev.content}</p>
                </div>
                {(userRole == "admin" || username == rev.username) && (
                  <button className='bg-sky-950 py-3 px-4 mx-2 rounded-full text-white transition hover:scale-105 hover:bg-blue-950 ease-out duration-150' onClick={() => handleDelete(rev)}>Delete</button>
                )}

                  { username == rev.username && (
                    <button className='bg-sky-950 py-3 px-4 mx-2 rounded-full text-white transition hover:scale-105 hover:bg-blue-950 ease-out duration-150' onClick={() => handleEdit(rev.reviewid)}>Edit</button>
                  )}
                  
                  { 
                    activeEdit === rev.reviewid && (

                      <EditReview 
                      
                      closeEdit = {handleCloseEdit}
                      resetEstablishment = {getFoodReviews}
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
      </div>
      </div>
    </div>
  );
}

export default Food;
