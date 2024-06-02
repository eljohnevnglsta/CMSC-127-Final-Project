import { useEffect, useState } from 'react';

//using this component needs to pass (reviewid) as a prop

const getReview = async (reviewid) => {
    try {
        const response = await fetch('http://localhost:3001/get-review', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ reviewid: reviewid })
        });
        const data = await response.json();
        return data[0];
    } catch (error) {
        console.error('Error fetching review:', error);
    }
}

const getEstablishment = async (businessid) => {
    try {
        const response = await fetch('http://localhost:3001/get-business', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ businessid: businessid, searchCriteria: "businessid"})
        });
        const data = await response.json();
        return data[0];
    } catch (error) {
        console.error('Error fetching establishment:', error);
    }
}

const getFood = async (foodcode) => {
    try {
        const response = await fetch('http://localhost:3001/get-food', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ foodcode: foodcode, searchCriteria: "foodcode"})
        });
        const data = await response.json();
        return data[0];
    } catch (error) {
        console.error('Error fetching food:', error);
    }
}

const handleSubmit = async (e, review, closeEdit) => {
    e.preventDefault();

    const data = {
        reviewid: review.reviewid,
        content: e.target.review.value,
        rating: e.target.rating.value,
        username: localStorage.getItem('user')
    };

    try {
        const response = await fetch('http://localhost:3001/review/update', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        console.log('Review edited:', response);
        closeEdit();
        window.location.reload(); //hindi tama toh pero di ko alam kung pano tatawagin yung call kasi galing sya sa magkaibang render
    } catch (error) {
        console.error('Error editing review:', error);
    }
}

export default function EditReview({ reviewid, closeEdit }) {
    const [review, setReview] = useState(null);
    const [establishment, setEstablishment] = useState(null);
    const [food, setFood] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            const reviewData = await getReview(reviewid);
            setReview(reviewData);

            if (reviewData.reviewtype === 1) {
                const establishmentData = await getEstablishment(reviewData.businessid);
                setEstablishment(establishmentData);
            } else {
                const foodData = await getFood(reviewData.foodcode);
                setFood(foodData);
                const establishmentData = await getEstablishment(foodData.businessid);
                setEstablishment(establishmentData);
            }
        };
        fetchData();
        
    }, [reviewid]);

    if (!review) {
        return <div>Loading...</div>;
    }

    const reviewTypeText = review.reviewtype === 1 ? "Establishment" : "Food";
    const reviewForText = review.reviewtype === 1 ? establishment?.name : `${establishment?.name}'s ${food?.name}`;

    return (
        <div>
            <h1>Editing {reviewTypeText} Review</h1>
            <p>Review for {reviewForText}</p>
            <form onSubmit={(e) => handleSubmit(e, review, closeEdit)}>
                <label htmlFor="rating">Rating:</label>
                <select id="rating" name="rating" defaultValue={review.rating}>
                    <option value="" disabled>Select a rating</option>
                    {[1, 2, 3, 4, 5].map((rating) => (
                        <option key={rating} value={rating}>
                            {rating}
                        </option>
                    ))}
                </select>
                <br />
                <label htmlFor="review">Content:</label>
                <textarea id="review" name="review" defaultValue={review.content}></textarea>
                <br />
                <button type="submit">Submit</button>
            </form>
        </div>
    )
}
