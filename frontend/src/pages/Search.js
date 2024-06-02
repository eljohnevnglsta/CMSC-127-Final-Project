import { useEffect, useState } from "react";
import { Link, useParams } from 'react-router-dom';


function Search () {
    const [foodSearch, setFoodSearch] = useState(false)
    const [search, setSearch] = useState('')
    const [results, setResults] = useState ([])
    const [foodTypes, setFoodTypes] = useState([]);
    const [error, setError] = useState(false);
    const [selectedOption, setSelectedOption] = useState("");
    const [foodList, setFoodList] = useState([])

    useEffect(() => {
        let url = "http://localhost:3001/select-type";
        fetch(url)
          .then((response) => response.json())
          .then((body) => {
            setFoodTypes(body);
            // console.log(body)
          });
        
      }, []);


    useEffect (() =>{
        if (foodSearch) {
           allFood()
        }
    },[foodSearch])


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

    useEffect(() => {
        if (selectedOption) {
          selectByType(selectedOption);
          console.log(selectedOption)
        }
      }, [selectedOption]);

      function selectByType(type) {
        fetch(
          "http://localhost:3001/search-food-items-by-type",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              foodtype: type

            }),
          }
        )
          .then((response) => response.json()) // Parse JSON response
          .then((data) => {
            setError(false);
            setFoodList(data); // Update state with the parsed data
          })
          .catch((error) => {
            console.log(error)
            setError(true);
          });
      }

    function allFood () {
        let url = "http://localhost:3001/select-all-food"
        fetch(url)
          .then(response => response.json())
          .then(body => {
            setError(false)
            setFoodList(body)
        })
    }
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
            <div className="text-sm font-medium text-center text-gray-500 border-b border-gray-200 dark:text-gray-400 dark:border-gray-700 my-7 pl-8">
            <div className="flex flex-wrap -mb-px">
            <button className='inline-block p-4 border-b-2 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300 px-6' onClick={() => 
                {setFoodSearch(false)
                    setResults([])
                    setError(false)
                    setSearch('')
                }}>Search a Food Establishment</button>
            <button  className='inline-block p-4 border-b-2 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300 px-6' onClick={()=>{setFoodSearch(true)
                setError(false)
                setResults([])
                setSearch('')
            }}>Search Foods </button>
            </div>
            </div>
            <form className="max-w-md mx-auto mt-10">
            <div class="relative">
            <div class="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
            <svg class="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
            </svg>
            </div>
            <input type="text" className='block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500' placeholder='Search food item or establishment...'
             onChange={e => 
                {
             setSearch(e.target.value)}} value={search}></input>
            </div>
            </form>
            
            


            {
                !foodSearch ? 
                <>
                <div className="rounded pt-5 px-8 pb-20 flex justify-center">
                <div className="w-2/4 shadow-lg">
                {
                    results.length > 0 ? <> {results.map((res)=>{
                        return(
                           
                        <Link to={`/food-establishment/${res.name}`}><h3 className="font-bold px-8 py-2 text-base mb-2 text-gray-500 hover:text-sky-950">{res.name}</h3> </Link>
                        )
                    }) } </> : null
                }
                </div>
                </div>
                </> : 
                <>
                
                {
                    search.length > 0 ? 
                        <>
                        <div className="rounded pt-5 px-8 pb-20 flex justify-center">
                    <div className="w-2/4 shadow-lg">
                        { results.length > 0 ?
                        <>
                            {results.map((food)=>{
                                return(
                                    <Link to = {`/food/${food.foodcode}`}><h3 className="font-bold px-8 py-2 text-base mb-2 text-gray-500 hover:text-sky-950">{food.name}</h3></Link> 
                                )}) } 
                        </> : null
                        }
                        </div>
                        </div>
                        </>
                        
                        :
                    
                    <div>
                        <h1>Foods</h1>
                        <button onClick={() => allFood()}>Show All Food</button>
                            <label>Select By Type: </label>
                            <select
                                value={selectedOption}
                                onChange={(e) => {
                                setSelectedOption(e.target.value);
                                // selectByType(e.target.value, order)
                                console.log(e.target.value);
                                }}
                            >
                                <option value="">Select a type</option>
                                {foodTypes.map((type) => {
                                return <option value={type.foodtype}>{type.foodtype}</option>;
                                })}
                            </select>

                        {
                            !error?
                        <>
                        {foodList.map((food, index) => {
                            return (
                            <div key={index} className="food-card">
                                <Link to={`/food/${food.foodcode}`}>
                                <h3>{food.name}</h3>
                                </Link>
                                <p>{food.price}</p>

                                {food.averageRating ? <h5>Rating: {food.averageRating}</h5>: <p>Newly added food!</p> }
                                {food.isspecialty === 1 ? <p>Specialty!</p> : null}
                                {food.isbestseller === 1 ? <p>Best Seller!</p> : null}
                            </div>
                            );
                        })}</> :<p>No food of this type. Sorry!</p> }
                    </div> 
                }
                </>
            }
        </div>
    )
}

export default Search