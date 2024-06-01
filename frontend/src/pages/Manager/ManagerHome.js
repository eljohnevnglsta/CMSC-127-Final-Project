import { useEffect, useState } from "react";
import { useOutletContext, Link } from "react-router-dom";

function ManagerHome (){

    const username = useOutletContext();
    const [businessList, setBusinessList] = useState([]);

    useEffect(()=>{
        console.log(username)
        let url = `http://localhost:3001/view-all-establishment-manager/${username}`
        fetch(url)
          .then(response => response.json())
          .then(body => {
            setBusinessList(body)
        })
    }, [])

    return(
        <div className="establishment-container">
            <h1>Establishments you own</h1>

            {
                businessList.map((business)=>{
                    return(
                        
                        <div className={business.businessid}>
                            <Link to={`/manager/food-establishment/${business.name}`}>
                            <h1>{business.name}</h1> </Link>
                            <h5>Type: {business.type}</h5>
                            <h5>Rating: {business.averageRating}</h5>
                        </div>
                        
                        )
                })
            }
        </div>
    )
}

export default ManagerHome