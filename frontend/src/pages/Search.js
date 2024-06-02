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
    const [establishment, setEstablishment] = useState([]);
    const [unfilteredResults, setUnfilteredResults] = useState([]); // New state to hold unfiltered results
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');

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
        }else{
            handleAll()
        }
    },[foodSearch])

    useEffect(() => {
        if (search.length !== 0) {
            if (!foodSearch) {
                searchFoodEstablishment(search);
            } else {
                searchFoods(search);
            }
        } else {
            setResults([]);
            setUnfilteredResults([]); // Clear unfiltered results as well
        }
    }, [search]);

    function allFood () {
        let url = "http://localhost:3001/select-all-food"
        fetch(url)
          .then(response => response.json())
          .then(body => {
            setError(false)
            setFoodList(body)
        })
    }

    function searchFoodEstablishment(search) {
        fetch('http://localhost:3001/establishment/search', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                keyword: search,
            })
        })
        .then(response => response.json())
        .then(data => {
            console.log(data);
            setResults(data);
            setUnfilteredResults(data); // Update unfiltered results
        }).catch(error => {
            setResults([]);
            setUnfilteredResults([]); // Clear unfiltered results on error
        });
    }

    function searchFoods(search) {
        fetch('http://localhost:3001/food-item/search', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                keyword: search,
            })
        })
        .then(response => response.json())
        .then(data => {
            console.log(data);
   
            setResults(data);
            // setUnfilteredResults(data); // Update unfiltered results
        }).catch(error => {
  
            setResults([]);
            // setUnfilteredResults([]); // Clear unfiltered results on error
        });
    }


    useEffect(() => {
        if (foodSearch && unfilteredResults.length > 0) {
            setResults(unfilteredResults.filter((food) => {
                const price = parseFloat(food.price);
                return price >= parseFloat(minPrice) && price <= parseFloat(maxPrice);
            }));
        }
    }, [minPrice, maxPrice, unfilteredResults, foodSearch]);

    function handleAll(){
        let url = "http://localhost:3001/view-all-establishments"
        fetch(url)
          .then(response => response.json())
          .then(body => {
            setEstablishment(body)
            setSelectedOption('');
        })
    }

    function handleApplyFilters() {
        fetch("http://localhost:3001/search-by-filter", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                foodtype: selectedOption,
                minprice: parseFloat(minPrice),
                maxprice: parseFloat(maxPrice),
            }),
        })
            .then((response) => response.json())
            .then((data) => {
                console.log(data);
                setFoodList(data);
            })
            .catch((error) => {
                console.log(error);
                setFoodList([]);
            });
        }

    return(
        <div className="search-container" >
            <div className="text-sm font-medium text-center text-gray-500 border-b border-gray-200 dark:text-gray-400 dark:border-gray-700 my-7 pl-8">
            <div className="flex flex-wrap -mb-px">
            <button className="inline-block p-4 font-semibold border-b-2 border-transparent rounded-t-lg hover:border-b-sky-950 hover:text-gray-600 text-sky-950 px-6" onClick={() => 
                {setFoodSearch(false)
                    setResults([])
                    setError(false)
                    setSearch('')
                }}>Search a Food Establishment</button>
            <button  className="inline-block p-4 font-semibold border-b-2 border-transparent rounded-t-lg hover:border-b-sky-950 hover:text-gray-600 text-sky-950 px-6" onClick={()=>{setFoodSearch(true)
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
            <input type="text" className='block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500' placeholder='Search food item or establishment...'
             onChange={e => 
                {
             setSearch(e.target.value)}} value={search}></input>
            </div>
            </form>
            

            {
                !foodSearch ? 
                <>
                { search.length > 0 ?
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
                </div> : 
                    <>
                    <div className="my-10 overflow-hidden px-8 mx-10 min-h-screen round shadow-lg ">
                    <h1 className='font-bold text-4xl my-2 text-sky-950 mb-4'>Registered Establishments</h1>
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
                   </>
                }
                </> 
                
                : 
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
                    
                    <div  className="my-10 overflow-hidden px-8 mx-10 min-h-screen round shadow-lg ">
                        <h1 className='font-bold text-4xl my-2 text-sky-950'>Foods</h1>
                        <div className="border-sky-950 border-b mb-8 flex items-center pb-2">
                        <div className='flex justify-end items-center w-full px-4 '>
                        <button  className='border mr-1 ml-2 py-3 px-4 font-medium border-sky-950 rounded-full ' onClick={() => allFood()}>Show All Food</button>
                            <label>Filters: </label>
                            <select
                                className='border mr-1 ml-2 py-3 px-4 font-medium border-sky-950 rounded-full '
                                value={selectedOption}
                                onChange={(e) => {
                                setSelectedOption(e.target.value);
                                console.log(e.target.value);
                                }}
                            >
                                <option value="">Select a type</option>
                                {foodTypes.map((type) => {
                                return <option value={type.foodtype}>{type.foodtype}</option>;
                                })}
                            </select>

                            <input 
                                type="number" 
                                className='border mr-1 ml-2 py-3 px-4 font-medium border-sky-950 rounded-full '
                                placeholder="₱ MIN" 
                                value={minPrice} 
                                onChange={(e) => setMinPrice(e.target.value)}
                            />
                            <input 
                                type="number" 
                                className='border mr-1 ml-2 py-3 px-4 font-medium border-sky-950 rounded-full '
                                placeholder="₱ MAX" 
                                value={maxPrice} 
                                onChange={(e) => setMaxPrice(e.target.value)}
                            />
                            <button className='font-semibold hover:shadow round px-4' onClick={handleApplyFilters}>APPLY</button>
                        
                        </div>
                        </div>

                        {
                            !error?
                            <>
                            <div className='grid lg:grid-cols-4 md:grid-cols-2  pb-32 gap-6 mx-32'>
                             {foodList.map((food, index) => {
                               return (
                                 <div className="max-w-sm rounded overflow-hidden shadow-lg hover:shadow">
                                 <img class="w-full" src="https://t4.ftcdn.net/jpg/03/39/43/29/360_F_339432932_UvTfQZoi68BfndE1mPI8nkRo60jNNHCh.jpg" alt="Sunset in the mountains"></img>
                                <div className='px-8 py-6 '>
                                 
                                   <Link to={`/food/${food.foodcode}`}>
                                     <h3  className='font-bold text-xl mb-2 text-sky-950'>{food.name}</h3>
                                   </Link>
                                   <p  className="text-base" > &#8369; {food.price}</p>
                   
                                   {food.averageRating ? <h5 className="text-base"> <strong>Rating: </strong> {food.averageRating}</h5>: <p className="text-sm">Newly added food!</p> }
                                   {food.isspecialty === 1 ? <p className="text-sm" >Specialty!</p> : null}
                                   {food.isbestseller === 1 ? <p className="text-sm"> Best Seller!</p> : null}
                                 </div>
                                 </div>
                   
                               );
                             })}{" "}
                             </div>
                           </> :<p>No food of this type. Sorry!</p> }
                    </div> 
                }
                </>
            }
        </div>
    )
}

export default Search;
