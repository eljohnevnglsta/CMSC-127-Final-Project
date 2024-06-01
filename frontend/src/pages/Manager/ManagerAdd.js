import { useEffect, useState } from 'react';
import { Link, useParams, useOutletContext, useNavigate } from 'react-router-dom';
function ManagerAdd (){
    const username = useOutletContext();
    const [name, setName] = useState('');
    const [type, setType] = useState('') 
    const [street, setStreet] = useState('');
    const [barangay, setBarangay] = useState('');
    const [city, setCity] = useState('');
    const [province, setProvince] = useState(''); 
    const navigate = useNavigate();

    const handleAddEstablishment = (e) =>{
        e.preventDefault()

        fetch('http://localhost:3001/establishment/add', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
                username : username,                
                name : name,
                type: type,
                street: street,
                barangay: barangay, 
                city: city, 
                province: province
            })
        })
        .then( () => {
            setName('')
            setType('')
            setCity('')
            setStreet('')
            setBarangay('')
            setProvince('')
            navigate(`/manager/`) // Update state with the parsed data
        });
    }
    return(
            <div className='manager-add'>
                <h1>Add your business here!</h1>
             <form onSubmit={handleAddEstablishment}>
             <label>Name: </label>
                <input type='text' required value={name} onChange={(e) => setName(e.target.value)}/>
                <label>Type: </label>
                <input type='text' required value={type} onChange={(e) => setType(e.target.value)}/>
                <label>Street: </label>
                <input type='text' required value={street} onChange={(e) => setStreet(e.target.value)}/>
                <label>Barangay: </label>
                <input type='text' required value={barangay} onChange={(e) => setBarangay(e.target.value)}/>
                <label>City: </label>
                <input type='text' required value={city} onChange={(e) => setCity(e.target.value)}/>
                <label>Province: </label>
                <input type='text' required value={province} onChange={(e) => setProvince(e.target.value)}/>

                <button type='submit'>Confirm</button>
                <Link to={`/manager`}><button>Cancel</button></Link>
            </form>
    
        </div>
    )
}

export default ManagerAdd