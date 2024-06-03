import { useEffect, useState } from "react";
import { Link, useParams, useOutletContext } from "react-router-dom";
import DatePicker from "react-datepicker";
import DeleteFood from "../../components/DeleteFood";
import UpdateFood from "../../components/UpdateFood";

import "react-datepicker/dist/react-datepicker.css";
function ManagerFood() {
  let { code } = useParams();
  const username = useOutletContext();
  const [fooddata, setFoodData] = useState([]);
  const [review, setReviews] = useState([]);
  const [error, setError] = useState(false);
  const [startDate, setStartDate] = useState(new Date());
  const [activeDelete, setActiveDelete] = useState(null);
  const [showUpdate, setShowUpdate] = useState(false);
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
        
        setFoodData([data]); // Update state with the parsed data
      });
  }, []);

  useEffect(() => {
    getFoodReviews();
  }, [code]);

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
    

    // Adjusting the date to Philippine Standard Time (UTC+8)
    const localDate = new Date(date.getTime() + 8 * 60 * 60 * 1000);

    // Formatting the date
    const formattedDate = localDate
      .toISOString()
      .slice(0, 10)
      .replace("T", " ");
   
    getMonthReviews(formattedDate);
    // setPassDate(formattedDate);
  };

  const handleDelete = (productId) => {
    setActiveDelete(productId);
  };

  const handleCloseDelete = () => {
    setActiveDelete(null);
  };

  const renderMonthContent = (month, shortMonth, longMonth, day) => {
    const fullYear = new Date(day).getFullYear();
    const tooltipText = `Tooltip for month: ${longMonth} ${fullYear}`;

    return <span title={tooltipText}>{shortMonth}</span>;
  };
  return (
    <div className="my-10 overflow-hidden mx-20 min-h-screen round shadow-lg ">
      <img
        className="h-60 w-full"
        src="https://t4.ftcdn.net/jpg/03/39/43/29/360_F_339432932_UvTfQZoi68BfndE1mPI8nkRo60jNNHCh.jpg"
        alt="Sunset in the mountains"
      ></img>
      <div className="py-10 px-20 ">
        {fooddata.map((food) => {
          return (
            <div className="food-details">
              <h1 className="font-bold text-4xl  text-sky-950">{food.name}</h1>
              <h3 className="text-lg py-2">
                {" "}
                <strong>Price: </strong>PhP {food.price}
              </h3>
              <div className="flex mt-4 ml-8 shadow-md py-7 px-7 w-11/12 round">
                <div className="w-9/12 px-4">
                  <h3 className="text-lg">
                    {" "}
                    <strong>From: </strong>
                    {food.est}
                  </h3>
                  <div className="flex">
                    <h3 className="text-lg">
                      <strong>Type: </strong>
                    </h3>
                    {food.foodtype.map((element, index) => (
                      <u>
                        <h3 className="ml-2 text-lg" key={index}>
                          {" "}
                          {element}
                        </h3>
                      </u>
                    ))}
                  </div>

                  {food.averageRating ? (
                    <h5 className="text-lg">
                      {" "}
                      <strong>Rating: </strong> {food.averageRating}
                    </h5>
                  ) : (
                    <p className="text-lg">Newly added food!</p>
                  )}
                  {food.isspecialty === 1 ? (
                    <p className="text-lg font-semibold">Specialty!</p>
                  ) : null}
                  {food.isbestseller === 1 ? (
                    <p className="text-lg font-semibold">Best Seller!</p>
                  ) : null}
                </div>
                <div className="flex flex-col w-6/12">
                  <button
                    className="bg-sky-950 py-3 px-6 mb-4 rounded-full text-white transition hover:scale-105 hover:bg-blue-950 ease-out duration-150"
                    onClick={() => handleDelete(food.foodcode)}
                  >
                    Delete Food{" "}
                  </button>
                  <button
                    className="bg-sky-950 py-3 px-6 mb-4 rounded-full text-white transition hover:scale-105 hover:bg-blue-950 ease-out duration-150"
                    onClick={() => setShowUpdate(true)}
                  >
                    Update details
                  </button>
                </div>
                {activeDelete === food.foodcode && (
                  <DeleteFood
                    setShow={handleCloseDelete}
                    foodcode={food.foodcode}
                    // refresh = {showAllFood}
                    // order = {order}
                    username={username}
                    name={food.est}
                  />
                )}

                {showUpdate && (
                  <UpdateFood
                    show={setShowUpdate}
                    username={username}
                    food={food}
                  />
                )}
              </div>
            </div>
          );
        })}

        <div className="flex mt-4 ml-8 shadow-md py-7 px-7 w-11/12 round">
          <div className="reviews-container w-full">
            <h1 className="font-bold text-4xl  text-sky-950">Reviews</h1>

            <div className="border-sky-950 border-b mb-8 flex items-center pb-2">
              <div className="flex justify-end items-center w-full px-4 ">
                <button
                  className="border mr-1 ml-2 py-3 px-4 font-medium border-sky-950 rounded-full "
                  onClick={() => getFoodReviews()}
                >
                  {" "}
                  Show all reviews
                </button>
                <label>Select review from a specific month: </label>

                <DatePicker
                  className="border mr-1 ml-2 py-3 px-4 font-medium border-sky-950 rounded-full "
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
                <div className="grid lg:grid-cols-3 md:grid-cols-2  pb-32 gap-6 mx-32">
                  {review.map((rev) => {
                    return (
                      <div className="max-w-sm rounded overflow-hidden px-8 py-6 shadow-lg hover:shadow">
                        <div className="flex mb-2">
                          <img
                            class="w-10 h-10 rounded-full"
                            src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"
                            alt="Rounded avatar"
                          ></img>
                          <h2 className="font-bold text-xl pl-2 mb-2 text-sky-950">
                            {rev.username} says...
                          </h2>
                        </div>
                        <h3 className="text-xl">
                          {" "}
                          <strong>Rating:</strong> {rev.rating}{" "}
                        </h3>
                        <p className="text-base">
                          {"Published: " +
                            new Date(
                              new Date(rev.date_added).getTime() +
                                8 * 60 * 60 * 1000
                            ).toLocaleString("en-US", {
                              timeZone: "Asia/Manila",
                              month: "long",
                              day: "2-digit",
                              year: "numeric",
                            })}
                        </p>
                        {rev.date_updated && (
                          <p className="text-base">
                            {"Edited: " +
                              new Date(
                                new Date(rev.date_updated).getTime() +
                                  8 * 60 * 60 * 1000
                              ).toLocaleString("en-US", {
                                timeZone: "Asia/Manila",
                                month: "long",
                                day: "2-digit",
                                year: "numeric",
                              })}
                          </p>
                        )}
                        {rev.content ? (
                          <div className="p-4 my-4 border-s-4 border-gray-600  ">
                            <p className="text-base italic text-sky-950">
                              {rev.content}
                            </p>
                          </div>
                        ) : (
                          <div className="p-4 my-4"></div>
                        )}

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

export default ManagerFood;
