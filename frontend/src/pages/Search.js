import { useEffect, useState } from "react";
import { Link, useParams } from 'react-router-dom';


function Search () {
    const [foodSearch, setFoodSearch] = useState(false)
    const [search, setSearch] = useState('')
    const [results, setResults] = useState ([])

    useEffect(() =>{

        if (search.length !==0){
        if(!foodSearch){
            searchFoodEstablishment(search)
        }else{
            searchFoods(search)
        }
    }else{
        setResults([])
    }
    }, [search])

    function searchFoodEstablishment (search) {
        fetch('http://localhost:3001/establishment/search', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
                keyword: search,
                
            })
        })
        .then(response => response.json())  // Parse JSON response
        .then(data => {
            // setError(false)
            console.log(data)
            setResults(data);  // Update state with the parsed data
        }).catch(error => setResults([]));
    }

    function searchFoods(){
        fetch('http://localhost:3001/food-item/search', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
                keyword: search,
                
            })
        })
        .then(response => response.json())  // Parse JSON response
        .then(data => {
            // setError(false)
            console.log(data)
            setResults(data);  // Update state with the parsed data
        }).catch(error => setResults([]));
    }
    return(
        <div className="search-container" >
            <input type="text" onChange={e => setSearch(e.target.value)} value={search}></input>
            <button onClick={() => setFoodSearch(false)}>Search a Food Establishment</button>
            <button onClick={()=>setFoodSearch(true)}>Search Foods </button>


            {
                !foodSearch ? 
                <>
                {
                    results.length > 0 ? <> {results.map((res)=>{
                        return(
                        <Link to={`/food-establishment/${res.name}`}><h3>{res.name}</h3></Link>
                        )
                    }) } </> : null
                }
                </> : 
                <>
                
                {
                    results.length > 0 ? <> {results.map((food)=>{
                        return(
                            <Link to = {`/food/${food.foodcode}`}><h3>{food.name}</h3></Link> 
                        )
                    }) } </> : null
                }
                </>
            }
        </div>
    )
}

export default Search