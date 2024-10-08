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

  //automatically determines the role and the username of the user
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

  //gets the food type and parses the result into the foodTypes array
  useEffect(() => {
    let url = "http://localhost:3001/select-type";
    fetch(url)
      .then((response) => response.json())
      .then((body) => {
        setFoodTypes(body);
      });
    showAllFood(order);
  }, []);

  //automatically gets all the food when there is changes in the name and order
  useEffect(() => {
    showAllFood(order);
  }, [name, order]);

  useEffect(() => {
    if (selectedOption) {
      selectByType(selectedOption, order); //automatically invokes when the selected option and order is changed
    }
  }, [selectedOption, order]);

  //automatically gets the food items by passing the type
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

  //deletes the food by passing the foodcode and the username of the one that added the food
  function handleDelete(food) {
    const userToDelete = userRole === "admin" ? food.username : username; //if the user role is admin, the username to pass is the username of the one who added the food
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
          setFoodList(
            (prevfoods) =>
              prevfoods.filter((est) => est.foodcode !== food.foodcode) //removes the food from the foodlist array
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
  //shows all the food owned by the establishment
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
          order: orderby, //whether it is ascending or descending
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

  return (
    <div className="food-list">
      <div className="border-sky-950 border-b mb-8 flex items-center pb-2">
        <div className="flex justify-end items-center w-full mx-2 px-4 ">
          <button
            className="border mr-1 ml-2 py-3 px-4 font-medium border-sky-950 rounded-full "
            onClick={() => showAllFood(order)}
          >
            Show All Food
          </button>

          <select
            className="border mr-1 ml-2 py-3 px-4 font-medium border-sky-950 rounded-full "
            value={selectedOption}
            onChange={(e) => {
              setSelectedOption(e.target.value);
            }}
          >
            <option value="">Select a type </option>
            {foodTypes.map((type) => {
              return <option value={type.foodtype}>{type.foodtype}</option>;
            })}
          </select>
          <label>Arrange By Price: </label>
          <button
            className=" hover:border-sky-950 border-slate-500 border p-4 rounded-full mr-1"
            onClick={() => setOrder("ASC")}
          >
            {" "}
            <svg
              width="16"
              height="11"
              viewBox="0 0 16 13"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M7.27787 1.04679C7.67437 0.459683 8.53879 0.459683 8.93529 1.04679L15.3161 10.4949C15.7646 11.159 15.2888 12.0545 14.4874 12.0545L1.72579 12.0545C0.924383 12.0545 0.448551 11.159 0.897079 10.4949L7.27787 1.04679Z"
                fill="#074528"
              />
            </svg>
          </button>
          <button
            className=" hover:border-sky-950 border-slate-500 border p-4 rounded-full mr-1"
            onClick={() => setOrder("DESC")}
          >
            <svg
              width="16"
              height="11"
              viewBox="0 0 16 12"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M8.72213 11.5587C8.32563 12.1458 7.46121 12.1458 7.06471 11.5587L0.683919 2.11059C0.235391 1.44645 0.711223 0.55092 1.51263 0.55092L14.2742 0.550921C15.0756 0.550921 15.5515 1.44646 15.1029 2.11059L8.72213 11.5587Z"
                fill="#074528"
              />
            </svg>
          </button>
        </div>
      </div>
      {!error || selectedOption.length === 0 ? (
        <>
          <div className="grid lg:grid-cols-3 md:grid-cols-2  pb-32 gap-6 mx-32">
            {foodList.map((food, index) => {
              return (
                <div className="max-w-sm rounded overflow-hidden shadow-lg hover:shadow">
                  <img
                    class="w-full"
                    src="https://t4.ftcdn.net/jpg/03/39/43/29/360_F_339432932_UvTfQZoi68BfndE1mPI8nkRo60jNNHCh.jpg"
                    alt="Sunset in the mountains"
                  ></img>
                  <div className="px-8 py-6 ">
                    <Link to={`/food/${food.foodcode}`}>
                      <h3 className="font-bold text-xl mb-2 text-sky-950">
                        {food.name}
                      </h3>
                    </Link>
                    <p className="text-base"> &#8369; {food.price}</p>

                    {food.averageRating ? (
                      <h5 className="text-base">
                        {" "}
                        <strong>Rating: </strong> {food.averageRating}
                      </h5>
                    ) : (
                      <p className="text-sm">Newly added food!</p>
                    )}
                    {food.isspecialty === 1 ? (
                      <p className="text-sm">Specialty!</p>
                    ) : null}
                    {food.isbestseller === 1 ? (
                      <p className="text-sm"> Best Seller!</p>
                    ) : null}
                    {(userRole == "admin" || username == food.username) && (
                      <button
                        className="bg-red-500 py-3 px-4 my-3 rounded-lg text-white transition hover:scale-105 hover:bg-blue-950 ease-out duration-150"
                        onClick={() => handleDelete(food)}
                      >
                        Delete
                      </button>
                    )}
                  </div>
                </div>
              );
            })}{" "}
          </div>
        </>
      ) : (
        <p>No food of this category. Sorry!</p>
      )}
    </div>
  );
}

export default FoodList;
