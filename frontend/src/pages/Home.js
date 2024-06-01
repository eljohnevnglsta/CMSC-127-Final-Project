import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';


function Home () {
    const [establishment, setEstablishment] = useState([]);

    useEffect(()=>{
        handleAll()
    }, [])

    function handleAll(){
        let url = "http://localhost:3001/view-all-establishments"
        fetch(url)
          .then(response => response.json())
          .then(body => {
            setEstablishment(body)
        })
    }
    function handleFilter(){
        let url = "http://localhost:3001/view-highly-rated-establishments"
        fetch(url)
          .then(response => response.json())
          .then(body => {
            setEstablishment(body)
        })
    }
    return(
        <div className='home-container'>
            <button onClick={()=>{handleAll()}}>Show All</button>
            <button onClick={()=>{handleFilter()}}>Show Highly Rated Places!</button>
            <div className='establishment-container'>
                {
                    establishment.map((business) =>{
                        return(
                        
                        <div className={business.businessid}>
                            <Link to={`/food-establishment/${business.name}`}>
                            <h1>{business.name}</h1> </Link>
                            <h5>Type: {business.type}</h5>
                            {business.averageRating ? <h5>Rating: {business.averageRating}</h5>: <p>Newly added establishment!</p> }
                        </div>
                        
                        )
                    })
                }

            </div>
        </div>
    )
}

export default Home