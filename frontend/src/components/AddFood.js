import { useEffect, useState } from "react";

function AddFood (props) {
    const username = props.username;
    const show = props.show;
    const businessid = props.businessid
    const [name, setName] = useState('');
    const [price, setPrice] = useState(0);
    const [foodtype, setFoodType] = useState([])
    const [typeSelection, setFoodTypeSelection] = useState([])


    useEffect(() =>{
        let url = "http://localhost:3001/select-type";
        fetch(url)
        .then((response) => response.json())
        .then((body) => {
            setFoodTypeSelection(body);
            console.log(body)
        });

    }, [])

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
        
        fetch('http://localhost:3001/food-item/add', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
                username : username,
                businessid: businessid,
                name: name, 
                price: price,
                foodtype: foodtype,
                
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
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
        <div className="bg-orange-50 rounded-lg p-6 w-full max-h-xl max-w-3xl">
            <div className="flex justify-between items-center mb-4">
            <div className='w-full'>
            <h1 className='font-bold text-xl mb-2 text-sky-950'>Add a Food </h1>
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
                           
                            onChange={handleCheckboxChange}
                        />
                        <label>{type.foodtype}</label>
                    </div>
                ))}
            </div>
            <button type="submit">Confirm</button>
            <button onClick={handleCancel}>Cancel</button>
        </form>
        
        </div>
        </div>
        </div>
        </div>
    );
}

export default AddFood