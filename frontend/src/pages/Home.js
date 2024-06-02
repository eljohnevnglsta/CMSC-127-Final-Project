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
            <div className="text-sm font-medium text-center text-gray-500 border-b border-gray-200 dark:text-gray-400 dark:border-gray-700 my-7 pl-8">
            <div className="flex flex-wrap -mb-px">
               
            <button className='inline-block p-4 border-b-2 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300 px-6' onClick={()=>{handleAll()}}>Show All</button>
            <button className='inline-block p-4 border-b-2 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300 px-6'onClick={()=>{handleFilter()}}>Show Highly Rated Places!</button>
            </div>
            </div>
            <h1 className='font-bold text-xl ml-9 my-6 text-sky-950'>Share your experience with these establishments. </h1>
            <div className='grid lg:grid-cols-4 md:grid-cols-2 pb-32 gap-6 mx-32'>
                {
                    establishment.map((business) =>{
                        return(
                            <div className="max-w-sm rounded overflow-hidden shadow-lg hover:shadow">
                                <img class="w-full" src="https://t4.ftcdn.net/jpg/03/39/43/29/360_F_339432932_UvTfQZoi68BfndE1mPI8nkRo60jNNHCh.jpg" alt="Sunset in the mountains"></img>
                        <div className='px-8 py-6 '>
                            <Link to={`/food-establishment/${business.name}`}>
                            <h1 className='font-bold text-xl mb-2 text-sky-950'>{business.name}</h1> </Link>
                            <h5><strong className='text-base'>Type:</strong> {business.type}</h5>
                            {business.averageRating ? <h5> <strong className='text-base'> Rating: </strong> {business.averageRating}</h5>: <p>No reviews yet!</p> }
                        </div>
                        </div>
                        
                        )
                    })
                }

            </div>
        </div>
    )
}

export default Home