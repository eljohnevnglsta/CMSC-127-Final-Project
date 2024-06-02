
import { Navigate, useNavigate } from "react-router-dom";
function DeleteFood (props) {

    const foodcode = props.foodcode
    const setShow = props.setShow
    const username = props.username
    const name = props.name
    const refresh = props.refresh
    const order = props.order
    const navigate = useNavigate();

    function handleDelete () {
        fetch('http://localhost:3001/food-item/delete', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
                foodcode: foodcode,
                username: username
            })
        })
        .then(response => response.json())  // Parse JSON response
        .then( () => {
            setShow() 

            if (refresh && order) {
            refresh(order)} else 
            navigate(`/manager/food-establishment/${name}`)
        });
    } 

 
    function handleCancel () {
        setShow(false)
        // showReview(false)
    }
    return(
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
        <div className="bg-orange-50 rounded-lg pl-6 pt-4 pb-2 pr-6 w-full max-h-xl max-w-xl">
        <div className="flex justify-between items-center mb-4">
        <div className='w-11/12 self-center'>
            <h5 className='font-bold text-xl mb-2 text-sky-950'>Are you sure?</h5>
            <p className=' text-base mb-2 text-sky-950'>Deleting this food will also delete all reviews associated with it.</p>
            <button  className='bg-red-800 py-3 px-6 mx-2 rounded-full text-white transition hover:scale-105 hover:bg-red-950 ease-out duration-150' onClick = {()=> handleDelete()}>Yes, Delete</button>
            <button className='bg-sky-950 py-3 px-6 mx-2 rounded-full text-white transition hover:scale-105 hover:bg-blue-950 ease-out duration-150' onClick={()=> handleCancel()}>Cancel </button>
            </div>
        </div>
        </div>
        </div>
    )
}
 
export default DeleteFood