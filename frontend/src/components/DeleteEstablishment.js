import { Navigate, useNavigate } from "react-router-dom";


function DeleteEstablishment (props) {
    const setShow = props.show
    const businessId = props.businessid
    const username = props.username 
    const navigate = useNavigate();
    // const showReview = props.showReview

    function handleDelete () {
        fetch('http://localhost:3001/establishment/delete', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
                username : username,
                businessid : businessId
            })
        })
        .then(response => response.json())  // Parse JSON response
        .then( () => {
            navigate('/manager') // Update state with the parsed data
        });
    } 


    function handleCancel () {
        setShow(false)
        // showReview(false)
    }
    return(
        <div className="delete-establishment">
            <h5>Are you sure?</h5>
            <p>Deleting this establishment means all data will be deleted. This includes food items and all reviews associated.</p>
            <button onClick = {()=> handleDelete()}>Yes, Delete</button>
            <button onClick={()=> handleCancel()}>Cancel </button>
        </div>
    )
}
export default DeleteEstablishment