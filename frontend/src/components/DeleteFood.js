
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
            setShow() // Update state with the parsed data

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
        <div className="delete-establishment">
            <h5>Are you sure?</h5>
            <p>Deleting this food will also delete all reviews associated with it.</p>
            <button onClick = {()=> handleDelete()}>Yes, Delete</button>
            <button onClick={()=> handleCancel()}>Cancel </button>
        </div>
    )
}

export default DeleteFood