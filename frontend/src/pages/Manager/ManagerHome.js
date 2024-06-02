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
            <h1 className='font-bold text-4xl ml-9 my-6 text-sky-950'>Establishments you own</h1>
            <div className='grid lg:grid-cols-4 md:grid-cols-2 pb-32 gap-6 mx-32'>
            {
                businessList.map((business)=>{
                    return(
                        <div className="max-w-sm rounded overflow-hidden shadow-lg hover:shadow">
                        <img class="w-full" src="https://t4.ftcdn.net/jpg/03/39/43/29/360_F_339432932_UvTfQZoi68BfndE1mPI8nkRo60jNNHCh.jpg" alt="Sunset in the mountains"></img>
                <div className='px-8 py-6 '>
                            <Link to={`/manager/food-establishment/${business.name}`}>
                            <h1 className='font-bold text-xl mb-2 text-sky-950'>{business.name}</h1> </Link>
                            <h5><strong className='text-base'>Type:</strong> {business.type}</h5>
                            {business.averageRating ? <h5> <strong className='text-base'> Rating: </strong> {business.averageRating}</h5>: <p>Newly added establishment!</p> }
                        </div>
                        </div>
                        
                        )
                })
            }
            </div>
        </div>
    )
}

export default ManagerHome