
import { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
function EstablishmentReview (props){
    const name = props.name;
    const [review, setReviews] = useState([]);
    const [error, setError] = useState(false);
    const [startDate, setStartDate] = useState(new Date());
    // const [passDate, setPassDate] = useState([]);
    useEffect(() => {
        getReviews()
    }, [name]); 

    function getReviews() {
        fetch('http://localhost:3001/view-establishment-review', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
                name: name
            })
        })
        .then(response => response.json())  // Parse JSON response
        .then(data => {
            setError(false)
            setReviews(data);  // Update state with the parsed data
        })
        .catch(error => {
            setError(true);
            // setReviews([])
        });
    }

    function getMonthReviews (passDate) {
        fetch('http://localhost:3001/view-all-reviews-for-month', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
                name: name,
                date: passDate
            })
        })
        .then(response => response.json())  // Parse JSON response
        .then(data => {
            setError(false)
            setReviews(data);  // Update state with the parsed data
        })
        .catch(error => {
            setError(true);
            // setReviews([])
        });
    }

    const handleDateChange = (date) => {
        setStartDate(date);
        console.log(date);

        // Adjusting the date to Philippine Standard Time (UTC+8)
        const localDate = new Date(date.getTime() + (8 * 60 * 60 * 1000));

        // Formatting the date
        const formattedDate = localDate.toISOString().slice(0, 10).replace('T', ' ');
        console.log(formattedDate);
        getMonthReviews(formattedDate)
        // setPassDate(formattedDate);
    };
    return(
        <div className="reviews-container">
            <button onClick={() =>getReviews()}> Show all reviews</button>
            <label>Select review from a specific month: </label>
            <DatePicker
            dateFormat="MMMM yyyy"
            showMonthYearPicker
            selected={startDate}
            onChange={handleDateChange}
            />
            {
                !error ? <>{
                    review.map((rev) =>{
                        return(
                            <div className="review-card">
                                <h2>{rev.username}</h2>
                                <h3>Rating: {rev.rating} </h3>
                                <p>{rev.content}</p>
                                {/* <p>{rev.date_added}</p> */} 
                                {/* format date dapat */}
                            </div>
                            
                        )
                    })
                } </>: <p>No reviews found.</p>
            }

        </div>
    )
}

export default EstablishmentReview