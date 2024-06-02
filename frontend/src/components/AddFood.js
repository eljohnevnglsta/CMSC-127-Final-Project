import { useEffect, useState } from "react";

function AddFood (props) {
    const username = props.username;
    const show = props.show;
    const businessid = props.businessid
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
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
            <h1 className='font-bold text-2xl mb-2 text-sky-950'>Add a Food </h1>
        <form onSubmit={handleSubmit}>
                <div className=' text-lg pb-2' >
                <label className='font-bold mr-4'>Name:</label>
                <input
                    className='border-slate-300 rounded-lg border h-10 focus:shadow-md border-sky-950 pl-2 text-lg ml-4 w-11/12 text-sky-950'
                    type="text" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
            </div>
            <div className=' text-lg pb-2' >
                <label className='font-bold mr-4'>Price:</label>
                <input
                    className='border-slate-300 rounded-lg border h-10 focus:shadow-md border-sky-950 pl-2 text-lg ml-4 w-11/12 text-sky-950'
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                />
            </div>
            <div className=' text-lg pb-2' >
                <label className='font-bold mr-4'>Food Types:</label>
                <div className="pl-8">
                <div className='grid lg:grid-cols-3 md:grid-cols-2  pb-6 mx-4'>
                {typeSelection.map((type, index) => (
                    <div key={index}>
                        <input
                            type="checkbox" 
                            value={type.foodtype}
                           
                            onChange={handleCheckboxChange}
                        />
                        <label className='font-semibold mr-4' >{type.foodtype}</label>
                    </div>
                ))}
                </div>
                </div>
            </div>
            <button className='bg-sky-950 py-3 px-6 mx-2 rounded-full text-white transition hover:scale-105 hover:bg-blue-950 ease-out duration-150' type="submit">Confirm</button>
            <button  className='bg-red-800 py-3 px-6 mx-2 rounded-full text-white transition hover:scale-105 hover:bg-red-950 ease-out duration-150' onClick={handleCancel}>Cancel</button>
        </form>
        
        </div>
        </div>
        </div>
        </div>
    );
}

export default AddFood