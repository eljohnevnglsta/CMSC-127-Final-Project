import { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
function EstablishmentReviewManager(props) {
  const name = props.name;
  const [review, setReviews] = useState([]);
  const [error, setError] = useState(false);
  const [startDate, setStartDate] = useState(new Date());

  //automatically fetches the reviews
  useEffect(() => {
    getReviews();
  }, [name]);

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
  //gets the review for the month given the date
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

  //changes the date that will be passed to getMonthReviews
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

  const renderMonthContent = (month, shortMonth, longMonth, day) => {
    const fullYear = new Date(day).getFullYear();
    const tooltipText = `Tooltip for month: ${longMonth} ${fullYear}`;

    return <span title={tooltipText}>{shortMonth}</span>;
  };

  return (
    <div className="reviews-container">
      <div className="border-sky-950 border-b mb-8 flex items-center pb-2">
        <div className="flex justify-end items-center w-full px-4 ">
          <button
            className="border mr-1 ml-2 py-3 px-4 font-medium border-sky-950 rounded-full "
            onClick={() => getReviews()}
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
                        new Date(rev.date_added).getTime() + 8 * 60 * 60 * 1000
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

export default EstablishmentReviewManager;
