import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import FoodList from '../components/FoodList';
import EstablishmentReview from '../components/EstablishmentReview';
function FoodEstablishment () {
    let {name} = useParams();
   
    const [showReview, setShowReview] = useState(false)

    
    return(
        
        <div className='food-establishment-container'>
            <h1>{name}</h1>
            <button onClick={() =>{
                setShowReview(false)
            }}>Foods</button>
            <button onClick={() => {
                setShowReview(true)
            }}>Reviews</button>
            {
                showReview ? <EstablishmentReview name={name} /> : <FoodList name={name} />
            }
        </div>
    )
}

export default FoodEstablishment