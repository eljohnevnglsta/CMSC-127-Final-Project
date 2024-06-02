import { useEffect, useState } from "react";
import { Link, useParams, useOutletContext } from 'react-router-dom';
import DatePicker from "react-datepicker";
import DeleteFood from "../../components/DeleteFood";
import UpdateFood from "../../components/UpdateFood";

function ManagerFood (){
    let {code} = useParams();
    const username = useOutletContext(); 
    const [fooddata, setFoodData] = useState([])
    const [review, setReviews] = useState([])
    const [error, setError] = useState(false);
    const [startDate, setStartDate] = useState(new Date());
    const [activeDelete, setActiveDelete] = useState(null);
    const [showUpdate, setShowUpdate] = useState(false)
    useEffect(()=>{
        fetch('http://localhost:3001/select-food', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
                foodcode: code,
                
            }) 
        })
        .then(response => response.json())  // Parse JSON response
        .then(data => {
            // setError(false)
            console.log(data)
            setFoodData([data]);  // Update state with the parsed data
        });
    }, [])

    useEffect(()=>{
        getFoodReviews()
    }, [code])

    function getFoodReviews() {
       
        fetch('http://localhost:3001/view-all-reviews-for-food-item', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
                foodcode: code
            })
        })
        .then(response => response.json())  // Parse JSON response
        .then(data => {
            setError(false)
            setReviews(data);  // Update state with the parsed data
        })
        .catch(error => {
            setError(true);
        });
        
    }

    function getMonthReviews (passDate) {
        fetch('http://localhost:3001/select-food-review-month', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
                foodcode: code,
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

    const handleDelete = (productId) => {
        setActiveDelete(productId);
    };

    const handleCloseDelete = () => {
        setActiveDelete(null);
    }
    return(
        <div className="food-container">

        {
            fooddata.map((food) =>{
                return(
                    <div className="food-details">
                        <h1>{food.name}</h1>
                        <h3>From: {food.est}</h3>
                        <h3>Price: {food.price}</h3>
                        <h3>Type: </h3>
                        {food.foodtype.map((element, index) => (
                            <h3 key={index}>{element}</h3>
                        ))}
                        {food.averageRating ? <h5>Rating: {food.averageRating}</h5>: <p>Newly added food!</p> }
                        {food.isspecialty === 1? <p>Specialty!</p> : null}
                        {food.isbestseller === 1? <p>Best Seller!</p>: null}
                        <button onClick={()=> handleDelete(food.foodcode)}>Delete Food </button>
                        <button onClick={()=> setShowUpdate(true)}>Update details</button>
                            {
                                activeDelete === food.foodcode && (
                                    <DeleteFood 
                                        setShow = {handleCloseDelete}
                                        foodcode = {food.foodcode}
                                        // refresh = {showAllFood}
                                        // order = {order}
                                        username = {username}
                                        name = {food.est}
                                    />
                                )
                            }

                            { showUpdate&& (
                                <UpdateFood 
                                    show = {setShowUpdate}
                                    username = {username}
                                    food = {food}
                                />
                            )}
                        
                    </div>
                )
            })
        }

        <h1>Reviews</h1>
        <div className="reviews-container">
            <button onClick={() =>getFoodReviews()}> Show all reviews</button>
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
        </div>
    )
}

export default ManagerFood