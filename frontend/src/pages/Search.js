import { useEffect, useState } from "react";
import { Link, useParams } from 'react-router-dom';

function Search() {
    const [foodSearch, setFoodSearch] = useState(false);
    const [search, setSearch] = useState('');
    const [results, setResults] = useState([]);
    const [unfilteredResults, setUnfilteredResults] = useState([]); // New state to hold unfiltered results
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');

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
            setUnfilteredResults(data); // Update unfiltered results
        }).catch(error => {
            setResults([]);
            setUnfilteredResults([]); // Clear unfiltered results on error
        });
    }

    function searchFoodItemsByPrice() {
        if (search.length === 0) {
            fetch('http://localhost:3001/search-food-items-by-price', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    minprice: minPrice,
                    maxprice: maxPrice,
                })
            })
            .then(response => response.json())
            .then(data => {
                console.log(data);
                setResults(data);
            }).catch(error => setResults([]));
        } else {
            searchFoods(search);
        }
    }

    useEffect(() => {
        if (foodSearch && unfilteredResults.length > 0) {
            setResults(unfilteredResults.filter((food) => {
                const price = parseFloat(food.price);
                return price >= parseFloat(minPrice) && price <= parseFloat(maxPrice);
            }));
        }
    }, [minPrice, maxPrice, unfilteredResults, foodSearch]);

    return (
        <div className="search-container">
            <input type="text" onChange={e => setSearch(e.target.value)} value={search}></input>
            <button onClick={() => setFoodSearch(false)}>Search a Food Establishment</button>
            <button onClick={() => setFoodSearch(true)}>Search Foods</button>

            {foodSearch ? 
            <div className="price-range">
                <input 
                    type="number" 
                    placeholder="₱ MIN" 
                    value={minPrice} 
                    onChange={(e) => setMinPrice(e.target.value)}
                />
                <input 
                    type="number" 
                    placeholder="₱ MAX" 
                    value={maxPrice} 
                    onChange={(e) => setMaxPrice(e.target.value)}
                />
                <button onClick={searchFoodItemsByPrice}>APPLY</button>
            </div> 
            : null}
                
            {!foodSearch ? 
                <>
                {results.length > 0 ? 
                    results.map((res) => (
                        <Link to={`/food-establishment/${res.name}`} key={res.name}><h3>{res.name}</h3></Link>
                    )) 
                : null}
                </> 
            : 
                <>
                {results.length > 0 ? 
                    results.map((food) => (
                        <Link to={`/food/${food.foodcode}`} key={food.foodcode}><h3>{food.name}</h3></Link>
                    )) 
                : null}
                </>
            }
        </div>
    );
}

export default Search;
