import { useEffect, useState } from 'react';
import { Link, useParams, useOutletContext, useNavigate } from 'react-router-dom';
import FoodListManager from '../../components/FoodListManager';
import EstablishmentReviewManager from '../../components/EstablishmentReviewManager';
import UpdateEstablishment from './UpdateEstablishment';
import DeleteEstablishment from '../../components/DeleteEstablishment';

function ManagerEstablishment (){
    let {name} = useParams();
    const username = useOutletContext();
    const [showReview, setShowReview] = useState(false)
    const [showUpdate, setShowUpdate] = useState(false)
    const [showDelete, setShowDelete] = useState(false)
    const [businessId, setBusinessid] = useState(0)
    const navigate = useNavigate();
    const [businessDetails, setBusinessDetails] = useState({});
    useEffect(()=>{
        let url = `http://localhost:3001/select-establishment-details/${name}`
        fetch(url)
          .then(response => response.json())
          .then(body => {
            setBusinessDetails(body[0])
            setBusinessid(body[0].businessid)
        })
    }, [])
    return(
        
        <div className='food-establishment-container'>
            <h1>{name}</h1>

            <p>Average Rating: {businessDetails.averageRating}</p>
            <p>Type: {businessDetails.type}</p>
            <p>Address: {businessDetails.street}, {businessDetails.barangay}, {businessDetails.city}, {businessDetails.province}</p>
            <button onClick={()=> navigate(`/manager/update-establishment/${name}`)}>Update This Establishment </button>
            <button onClick={()=>setShowDelete(true)}>Delete This Establishment </button>

            {
                showDelete? <DeleteEstablishment show = {setShowDelete} businessid = {businessId} username = {username} /> : null
            }
            <button onClick={() =>{
                setShowReview(false)
            }}>Foods</button>
            <button onClick={() => {
                setShowReview(true)
            }}>Reviews</button>
            {
                showReview ? <EstablishmentReviewManager name={name} /> : <FoodListManager username = {username} name={name} />
            }
        </div>
    )
}

export default ManagerEstablishment