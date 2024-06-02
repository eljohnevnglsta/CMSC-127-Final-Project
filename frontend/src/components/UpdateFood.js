import { useEffect, useState } from "react";

function UpdateFood (props) {
    const username = props.username;
    const show = props.show;
    const food = props.food
    const [name, setName] = useState('');
    const [price, setPrice] = useState(0);
    const [foodtype, setFoodType] = useState([])
    const [typeSelection, setFoodTypeSelection] = useState([])
    const foodDetails = props.food

    useEffect(() =>{
        let url = "http://localhost:3001/select-type";
        fetch(url)
        .then((response) => response.json())
        .then((body) => {
            setFoodTypeSelection(body);
            console.log(body)
        });

        setName(foodDetails.name)
        setPrice(foodDetails.price)
        setFoodType(foodDetails.foodtype)
        
    }, [foodDetails])

    const handleCheckboxChange = (event) => {
        const value = event.target.value;
        setFoodType((prevFoodType) =>
            prevFoodType.includes(value)
                ? prevFoodType.filter((type) => type !== value)
                : [...prevFoodType, value]
        );
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        
        fetch('http://localhost:3001/food-item/update', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
                username : username,
                name: name, 
                price: price,
                foodtype: foodtype,
                foodcode: foodDetails.foodcode
            })
        })
        .then( () => {
            setName('')
            setPrice(0)
            setFoodType([])
            show(false) // Update state with the parsed data
            window.location.reload()
        });
    };

    function handleCancel () {
        show(false)
        // showReview(false)
    }

    return (
        <div>
        <form onSubmit={handleSubmit}>
            <div>
                <label>Name:</label>
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
            </div>
            <div>
                <label>Price:</label>
                <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                />
            </div>
            <div>
                <label>Food Types:</label>
                {typeSelection.map((type, index) => (
                    <div key={index}>
                        <input
                            type="checkbox"
                            value={type.foodtype}
                            checked={foodtype.includes(type.foodtype)}
                            onChange={handleCheckboxChange}
                        />
                        <label>{type.foodtype}</label>
                    </div>
                ))}
            </div>
            <button type="submit">Update Food</button>
        </form>
        <button onClick={handleCancel}>Cancel</button>
        </div>
    );
}


export default UpdateFood