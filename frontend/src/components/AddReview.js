import React, { useState, useEffect } from 'react';

const getAllEstablishments = async () => {
    try {
        const response = await fetch('http://localhost:3001/view-all-establishments');
        const data = await response.json();
        const names = data.map(establishment => establishment.name);
        return names;
    } catch (error) {
        console.error('Error fetching establishments:', error);
        return [];
    }
};

const getFoodsByEstablishment = async (establishment) => {
    try {
        const response = await fetch('http://localhost:3001/view-all-food-items-for-establishment', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name: establishment })
        });
        const data = await response.json();
        const foodNames = data.map(food => food.name); // Assuming food objects have a 'name' property
        return foodNames;
    } catch (error) {
        console.error('Error fetching foods:', error);
        return [];
    }
};

// app.post("/get-businessid", checkUserType(1), getBusinessId);
// app.post("/get-foodcode", checkUserType(1), getFoodCode);


const handleSubmit = async (e, reviewType) => {
    // { content, reviewtype, rating, username, businessid, foodcode }
    e.preventDefault();

    var businessid = '';
    try {
        const response = await fetch('http://localhost:3001/get-business', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({name: e.target.businessid.value, searchCriteria: 'name'})
        });
        const data = await response.json();
        console.log(data);
        businessid = data[0].businessid;
    } catch (error) {
        console.error('Error fetching business id:', error);
    }

    var foodcode = null;
    if (reviewType === 'food') {
        try {
            const response = await fetch('http://localhost:3001/get-food', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({name: e.target.foodcode.value, businessid: businessid, searchCriteria: 'name'})
            });
            const data = await response.json();
            console.log(data);
            foodcode = data[0].foodcode;
        } catch (error) {
            console.error('Error fetching food code:', error);
        }
    }

    const data = {
        content: e.target.content.value,
        rating: e.target.rating.value,
        reviewtype: (reviewType === 'food' ? 2 : 1),
        username: localStorage.getItem('user'),
        businessid: businessid,
        foodcode: foodcode
    };
    
    try {
        const response = await fetch('http://localhost:3001/review/add', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        console.log('Review added:', response);
    } catch (error) {
        console.error('Error adding review:', error);
    }
};

export default function AddReview() {
    const [establishments, setEstablishments] = useState([]);
    const [reviewType, setReviewType] = useState('establishment');
    const [selectedEstablishment, setSelectedEstablishment] = useState('');
    const [foods, setFoods] = useState([]);

    useEffect(() => {
        // Fetch establishment names when the component mounts
        const fetchEstablishments = async () => {
            const establishments = await getAllEstablishments();
            setEstablishments(establishments);
        };
        fetchEstablishments();
    }, []);

    useEffect(() => {
        // Fetch foods when the selected establishment changes and review type is food
        const fetchFoods = async () => {
            if (reviewType === 'food' && selectedEstablishment) {
                const foods = await getFoodsByEstablishment(selectedEstablishment);
                setFoods(foods);
            } else {
                setFoods([]);
            }
        };
        fetchFoods();
    }, [selectedEstablishment, reviewType]);

    const handleReviewTypeChange = (e) => {
        setReviewType(e.target.value);
    };

    const handleEstablishmentChange = (e) => {
        setSelectedEstablishment(e.target.value);
    };

    return (
        <div>
            <h1>Add a Review</h1>
            <form onSubmit={(e) => handleSubmit(e, reviewType)}>
                <label>Review Type:</label>
                <input
                    type="radio"
                    id="establishment"
                    name="reviewtype"
                    value="establishment"
                    checked={reviewType === 'establishment'}
                    onChange={handleReviewTypeChange}
                />
                <label htmlFor="establishment">Establishment</label>
                <input
                    type="radio"
                    id="food"
                    name="reviewtype"
                    value="food"
                    checked={reviewType === 'food'}
                    onChange={handleReviewTypeChange}
                />
                <label htmlFor="food">Food</label>
                <br />
                <label>Establishment Name:</label>
                <select
                    id="businessid"
                    name="businessid"
                    value={selectedEstablishment}
                    onChange={handleEstablishmentChange}
                >
                    <option value="" disabled>Select an establishment</option>
                    {establishments.map((name, index) => (
                        <option key={index} value={name}>
                            {name}
                        </option>
                    ))}
                </select>
                <br />
                {reviewType === 'food' && selectedEstablishment && (
                    <>
                        <label>Food:</label>
                        <select id="foodcode" name="foodcode">
                            <option value="" disabled>Select a food</option>
                            {foods.map((food, index) => (
                                <option key={index} value={food}>
                                    {food}
                                </option>
                            ))}
                        </select>
                        <br />
                    </>
                )}
                <label>Rating:</label>
                <select id="rating" name="rating">
                    <option value="" disabled>Select a rating</option>
                    {[1, 2, 3, 4, 5].map((rating) => (
                        <option key={rating} value={rating}>
                            {rating}
                        </option>
                    ))}
                </select>
                <br />
                <label>Content:</label>
                <textarea id="content" name="content" rows="4" cols="50"></textarea>
                <br />
                <button type="submit">Submit</button>
            </form>
        </div>
    );
}
