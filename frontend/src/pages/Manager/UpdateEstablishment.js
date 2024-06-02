import { useEffect, useState } from 'react';
import { Link, useParams, useOutletContext, useNavigate } from 'react-router-dom';

function UpdateEstablishment (props) {
    const name = props.name
    const show = props.show
    const username = useOutletContext();
    const [businessDetails, setBusinessDetails] = useState({});
    const [street, setStreet] = useState('');
    const [barangay, setBarangay] = useState('');
    const [city, setCity] = useState('');
    const [province, setProvince] = useState(''); 
    const navigate = useNavigate();
    useEffect(()=>{
        let url = `http://localhost:3001/select-establishment-details/${name}`
        fetch(url)
          .then(response => response.json())
          .then(body => {
            console.log(body[0])
            setBusinessDetails(body[0])
            setCity(body[0].city)
            setStreet(body[0].street)
            setBarangay(body[0].barangay)
            setProvince(body[0].province)
        })
    }, [])

    const handleEditEstablishment = (e) =>{
        e.preventDefault()

        fetch('http://localhost:3001/establishment/update', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
                username : username,
                businessid : businessDetails.businessid,
                name : businessDetails.name,
                type: businessDetails.type,
                averageRating: businessDetails.averageRating,
                street: street,
                barangay: barangay, 
                city: city, 
                province: province
            })
        })
        .then( () => {
            setCity('')
            setStreet('')
            setBarangay('')
            setProvince('')
            show(false)
            window.location.reload() // Update state with the parsed data
        });
    }

    function handleCancel () {
        show(false)
        // showReview(false)
    }
    return(
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
        <div className="bg-orange-50 rounded-lg p-6 w-full max-h-xl max-w-3xl">
            <div className="flex justify-between items-center mb-4">
            <div className='w-full'>
            <h3 className='font-bold text-xl mb-2 text-sky-950'>Update business details</h3>
            <h1 className='font-semibold text-lg mb-2 text-sky-950'>{businessDetails.name}</h1>
            <p className='text-lg mb-2 text-sky-950'> <strong>Average Rating:</strong> {businessDetails.averageRating}</p>
            <p className=' text-lg mb-2 text-sky-950'> <strong>Type: </strong> {businessDetails.type}</p>
            <form onSubmit={handleEditEstablishment}>
            <div className=' text-lg pb-2' >
                <label className='font-bold mr-4'>Street: </label>
                <br/>
                <input className='p-4 border-slate-300 rounded-lg border h-10 focus:shadow-md border-sky-950 py-2 text-lg ml-4 w-11/12 text-sky-950' type='text' required value={street} onChange={(e) => setStreet(e.target.value)}/>
                </div>
                <br/>
                <div className=' text-lg pb-2' >
                <label className='font-bold mr-4'>Barangay: </label>
                <input className='p-4 border-slate-300 rounded-lg border h-10  focus:shadow-md border-sky-950 py-2 text-lg ml-4 w-11/12 text-sky-950' type='text' required value={barangay} onChange={(e) => setBarangay(e.target.value)}/>
                </div>
                <br/>
                <div className=' text-lg pb-2' >
                <label className='font-bold mr-4'>City: </label>
                <br/>
                <input className='p-4 border-slate-300 rounded-lg border h-10 focus:shadow-md border-sky-950 py-2 text-lg ml-4 w-11/12 text-sky-950' type='text' required value={city} onChange={(e) => setCity(e.target.value)}/>
                </div>
                <br/>
                <div className=' text-lg pb-2' >
                <label className='font-bold mr-4'>Province: </label>
                <br/>
                <input className='p-4 border-slate-300 rounded-lg border h-10  focus:shadow-md border-sky-950 py-2 text-lg ml-4 w-11/12 text-sky-950' type='text' required value={province} onChange={(e) => setProvince(e.target.value)}/>
                </div>
                <br/>

                <button  className='bg-sky-950 py-3 px-6 mx-2 rounded-full text-white transition hover:scale-105 hover:bg-blue-950 ease-out duration-150' type='submit'>Confirm</button>
                <button  className='bg-red-800 py-3 px-6 mx-2 rounded-full text-white transition hover:scale-105 hover:bg-red-950 ease-out duration-150' onClick={handleCancel}>Cancel</button>

            </form>
            </div>
        </div>
        </div>
        </div>
    );
}
export default UpdateEstablishment