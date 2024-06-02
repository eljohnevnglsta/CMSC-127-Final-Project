import { useEffect, useState } from 'react';
import { Link, useParams, useOutletContext, useNavigate } from 'react-router-dom';
import FoodListManager from '../../components/FoodListManager';
import EstablishmentReviewManager from '../../components/EstablishmentReviewManager';
import UpdateEstablishment from './UpdateEstablishment';
import DeleteEstablishment from '../../components/DeleteEstablishment';
import AddFood from '../../components/AddFood';
function ManagerEstablishment (){
    let {name} = useParams();
    const username = useOutletContext();
    const [showReview, setShowReview] = useState(false)
    const [updateWindow, setUpdateWindow] = useState(false)
    const [showDelete, setShowDelete] = useState(false)
    const [businessId, setBusinessid] = useState(0)
    const [addWindow, setAddWindow] = useState(false)
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
        
        <div className="my-10 overflow-hidden mx-20 min-h-screen round shadow-lg ">
            <img className="h-60 w-full" src="https://t4.ftcdn.net/jpg/03/39/43/29/360_F_339432932_UvTfQZoi68BfndE1mPI8nkRo60jNNHCh.jpg" alt="Sunset in the mountains"></img>
        <div className="py-10 px-20 ">
            <h1 className='font-bold text-4xl  text-sky-950'>{name}</h1>
            <div className="flex mt-4 ml-8 shadow-md py-7 px-7 w-11/12 round">
            <div className="w-9/12 px-4">
            <p className='text-lg' > <strong>Average Rating:</strong> {businessDetails.averageRating}</p>
            <p className='text-lg'><strong>Type:</strong> {businessDetails.type}</p>
            <p className='text-lg'><strong>Address: </strong>  {businessDetails.street}, {businessDetails.barangay}, {businessDetails.city}, {businessDetails.province}</p>
            </div>
            <div className='flex flex-col w-6/12'>
            <button className='bg-sky-950 py-3 px-6  mb-4 rounded-full text-white transition hover:scale-105 hover:bg-blue-950 ease-out duration-150' 
            
            onClick={()=> setUpdateWindow(true)}>Update This Establishment </button>

            <button className='bg-sky-950 py-3 px-6 mb-4 rounded-full text-white transition hover:scale-105 hover:bg-blue-950 ease-out duration-150' onClick={()=>setShowDelete(true)}>Delete This Establishment </button>
            <button  className='bg-sky-950 py-3 px-6 mb-4 rounded-full text-white transition hover:scale-105 hover:bg-blue-950 ease-out duration-150' onClick={()=> setAddWindow(true)}> Add a Food
            <svg className="inline-block stroke-white ml-2 w-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 6L12 18" strokeWidth="2" strokeLinecap="round"/>
                    <path d="M18 12L6 12" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
            </button>
            </div>
            </div>
            {
                updateWindow? <UpdateEstablishment show = {setUpdateWindow} name={name} /> : null
            }
            {
                addWindow? <AddFood show={setAddWindow} businessid={businessId} username={username} /> : null
            }

            {
                showDelete? <DeleteEstablishment show = {setShowDelete} businessid = {businessId} username = {username} /> : null
            }

            <div className="text-sm font-medium text-center text-gray-500 border-b border-gray-200 dark:text-gray-400 dark:border-gray-700 my-7 pl-8">
            <div className="flex flex-wrap -mb-px"> 
            <button className='inline-block p-4 border-b-2 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300 px-6' onClick={() =>{
                setShowReview(false)
            }}>Foods</button>
            <button className='inline-block p-4 border-b-2 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300 px-6'  onClick={() => {
                setShowReview(true)
            }}>Reviews</button>

            </div>
            </div>
            {
                showReview ? <EstablishmentReviewManager name={name} /> : <FoodListManager username = {username} name={name} />
            }
           
        </div>
        </div>
    )
}

export default ManagerEstablishment