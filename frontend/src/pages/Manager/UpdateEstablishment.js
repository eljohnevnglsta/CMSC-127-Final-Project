import { useEffect, useState } from 'react';
import { Link, useParams, useOutletContext, useNavigate } from 'react-router-dom';

function UpdateEstablishment (props) {
    let {name} = useParams();
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
            navigate(`/manager/food-establishment/${name}`) // Update state with the parsed data
        });
    }
    return(
        <div className='update-container'>
            <h3>Update business details</h3>
            <h1>{businessDetails.name}</h1>
            <p>Average Rating: {businessDetails.averageRating}</p>
            <p>Type: {businessDetails.type}</p>
            <form onSubmit={handleEditEstablishment}>
                <label>Street: </label>
                <input type='text' required value={street} onChange={(e) => setStreet(e.target.value)}/>
                <label>Barangay: </label>
                <input type='text' required value={barangay} onChange={(e) => setBarangay(e.target.value)}/>
                <label>City: </label>
                <input type='text' required value={city} onChange={(e) => setCity(e.target.value)}/>
                <label>Province: </label>
                <input type='text' required value={province} onChange={(e) => setProvince(e.target.value)}/>

                <button type='submit'>Confirm</button>
                <Link to={`/manager/food-establishment/${name}`}><button>Cancel</button></Link>
            </form>
        </div>
    )
}
export default UpdateEstablishment