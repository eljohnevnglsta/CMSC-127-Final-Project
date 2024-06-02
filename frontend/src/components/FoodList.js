import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function FoodList(props) {
  const name = props.name;
  const [foodList, setFoodList] = useState([]);
  const [foodTypes, setFoodTypes] = useState([]);
  const [selectedOption, setSelectedOption] = useState("");
  const [error, setError] = useState(false);
  const [order, setOrder] = useState("ASC");
  const admin = localStorage.getItem("admin");
  const user = localStorage.getItem("user");
  const manager = localStorage.getItem("manager");
  const [userRole, setUserRole] = useState(null);
  const [username, setUsername] = useState(null);

  useEffect(() => {
    if (admin) {
      setUserRole("admin");
      setUsername(admin);
    } else if (user) {
      setUserRole("user");
      setUsername(user);
    } else if (manager) {
      setUserRole("manager");
      setUsername(manager);
    }
  }, []);

  useEffect(() => {
    let url = "http://localhost:3001/select-type";
    fetch(url)
      .then((response) => response.json())
      .then((body) => {
        setFoodTypes(body);
        // console.log(body)
      });
    showAllFood(order);
  }, []);

  useEffect(() => {
    showAllFood(order);
  }, [name, order]);

  useEffect(() => {
    if (selectedOption) {
      selectByType(selectedOption, order);
    }
  }, [selectedOption, order]);

  function selectByType(type, orderby) {
    fetch(
      "http://localhost:3001/view-all-food-items-for-establishment-by-type",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name,
          foodtype: type,
          order: orderby,
        }),
      }
    )
      .then((response) => response.json()) // Parse JSON response
      .then((data) => {
        setError(false);
        setFoodList(data); // Update state with the parsed data
      })
      .catch((error) => {
        setError(true);
      });
  }

  function showAllFood(orderby) {
    fetch(
      "http://localhost:3001/view-all-food-items-for-establishment-by-price",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name,
          order: orderby,
        }),
      }
    )
      .then((response) => response.json()) // Parse JSON response
      .then((data) => {
        setError(false);
        setFoodList(data); // Update state with the parsed data
      })
      .catch((error) => console.error("Error fetching data:", error));
  }

  function handleDelete(food) {
    const userToDelete = userRole === "admin" ? food.username : username;
    fetch("http://localhost:3001/food-item/delete", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        foodcode: food.foodcode,
        username: userToDelete,
      }),
    })
      .then((response) => {
        if (!response.ok) {
          console.log(response);
          throw new Error(response.statusText);
        }
        console.log(response);
        return response.json();
      })
      .then((data) => {
        if (data.affectedRows > 0) {
          setFoodList((prevfoods) =>
            prevfoods.filter((est) => est.foodcode !== food.foodcode)
          );
          alert("Food deleted!");
          window.scrollTo({ top: 0 });
        } else {
          console.error("Error deleting food:", data.message);
        }
      })
      .catch((error) => {
        console.error("Error deleting food:", error);
      });
  }

  return (
    <div className="food-list">
      <button onClick={() => showAllFood(order)}>Show All Food</button>
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
      <label>Arrange By Price: </label>
      <button onClick={() => setOrder("ASC")}> Ascending </button>
      <button onClick={() => setOrder("DESC")}> Descending </button>
      {!error || selectedOption.length === 0 ? (
        <>
          {foodList.map((food, index) => {
            return (
              <div key={index} className="food-card">
                <Link to={`/food/${food.foodcode}`}>
                  <h3>{food.name}</h3>
                </Link>
                <p>{food.price}</p>

                {food.averageRating ? (
                  <h5>Rating: {food.averageRating}</h5>
                ) : (
                  <p>Newly added food!</p>
                )}
                {food.isspecialty === 1 ? <p>Specialty!</p> : null}
                {food.isbestseller === 1 ? <p>Best Seller!</p> : null}
                {(userRole == "admin" || username == food.username) && (
                  <button onClick={() => handleDelete(food)}>Delete</button>
                )}
              </div>
            );
          })}{" "}
        </>
      ) : (
        <p>No food of this category. Sorry!</p>
      )}
    </div>
  );
}

export default FoodList;
