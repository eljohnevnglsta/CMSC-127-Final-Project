import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const getAllEstablishments = async () => {
  try {
    const response = await fetch(
      "http://localhost:3001/view-all-establishments"
    );
    const data = await response.json();
    const names = data.map((establishment) => establishment.name);
    return names;
  } catch (error) {
    console.error("Error fetching establishments:", error);
    return [];
  }
};

const getFoodsByEstablishment = async (establishment) => {
  try {
    const response = await fetch(
      "http://localhost:3001/view-all-food-items-for-establishment",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: establishment }),
      }
    );
    const data = await response.json();
    const foodNames = data.map((food) => food.name); // Assuming food objects have a 'name' property
    return foodNames;
  } catch (error) {
    console.error("Error fetching foods:", error);
    return [];
  }
};
//adds the review based on the type of review added by the user
const handleSubmit = async (e, reviewType, navigate) => {
  e.preventDefault();
  if (e.target.businessid.value == "") {
    alert("Please choose establishment first!");
    return;
  }
  var businessid = "";
  try {
    const response = await fetch("http://localhost:3001/get-business", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: e.target.businessid.value,
        searchCriteria: "name",
      }),
    });
    const data = await response.json();
    console.log(data);
    businessid = data[0].businessid;
  } catch (error) {
    console.error("Error fetching business id:", error);
  }

  var foodcode = null;
  if (reviewType === "food") {
    try {
      const response = await fetch("http://localhost:3001/get-food", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: e.target.foodcode.value,
          businessid: businessid,
          searchCriteria: "name",
        }),
      });
      const data = await response.json();
      console.log(data);
      foodcode = data[0].foodcode;
    } catch (error) {
      console.error("Error fetching food code:", error);
    }
  }

  const data = {
    content: e.target.content.value.trim(),
    rating: e.target.rating.value,
    reviewtype: reviewType === "food" ? 2 : 1,
    username: localStorage.getItem("user"),
    businessid: businessid,
    foodcode: foodcode,
  };

  try {
    const response = await fetch("http://localhost:3001/review/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    console.log("Review added:", response);
    window.history.back();
  } catch (error) {
    console.error("Error adding review:", error);
  }
};

export default function AddReview() {
  const [establishments, setEstablishments] = useState([]);
  const [reviewType, setReviewType] = useState("establishment");
  const [selectedEstablishment, setSelectedEstablishment] = useState("");
  const [foods, setFoods] = useState([]);
  const [selectedFood, setSelectedFood] = useState(foods[0]);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch establishment names when the component mounts
    const fetchEstablishments = async () => {
      const establishments = await getAllEstablishments();
      setEstablishments(establishments);
    };
    fetchEstablishments();
  }, []);

  useEffect(() => {
    // Fetch foods when the selected establishment changes and review type is food
    const fetchFoods = async () => {
      if (reviewType === "food" && selectedEstablishment) {
        const foods = await getFoodsByEstablishment(selectedEstablishment);
        setFoods(foods);
      } else {
        setFoods([]);
      }
    };
    fetchFoods();

    const params = new URLSearchParams(window.location.search);
    const reviewTypeParam = params.get("reviewType");
    const establishmentParam = params.get("establishment");
    const foodParam = params.get("food");
    console.log(foodParam);

    if (reviewTypeParam) {
      setReviewType(reviewTypeParam);
    }
    if (establishmentParam) {
      setSelectedEstablishment(establishmentParam);
    }
    if (foodParam && reviewTypeParam === "food") {
      setSelectedFood(foodParam);
    }
  }, [selectedEstablishment, reviewType]);

  const handleReviewTypeChange = (e) => {
    setReviewType(e.target.value);
  };

  const handleEstablishmentChange = (e) => {
    setSelectedEstablishment(e.target.value);
  };

  const handleFoodChange = (event) => {
    setSelectedFood(event.target.value);
  };

  return (
    <div className="my-10 overflow-hidden mx-20 min-h-screen round shadow-lg ">
      <div className="py-10 px-20 ">
        <h1 className="font-bold text-4xl  text-sky-950">Add a Review</h1>
        <div className="flex mt-4 ml-8  py-7 px-7 w-11/12 round">
          <form
            className="w-full"
            onSubmit={(e) => handleSubmit(e, reviewType, navigate)}
          >
            <div className="pb-4">
              <label className="text-xl  font-bold mr-4">Review Type:</label>
              <input
                className="border-sky-950 h-4 w-4 text-sky-950"
                type="radio"
                id="establishment"
                name="reviewtype"
                value="establishment"
                checked={reviewType === "establishment"}
                onChange={handleReviewTypeChange}
              />
              <label
                className="text-xl  font-semibold mr-4"
                htmlFor="establishment"
              >
                Establishment
              </label>
              <input
                className="border-sky-950 h-4 w-4 text-sky-950"
                type="radio"
                id="food"
                name="reviewtype"
                value="food"
                checked={reviewType === "food"}
                onChange={handleReviewTypeChange}
              />
              <label className="text-xl  font-semibold mr-4" htmlFor="food">
                Food
              </label>
              <br />
            </div>

            <div className=" text-xl pb-4">
              <label className="font-bold mr-4">Establishment Name:</label>
              <select
                id="businessid"
                name="businessid"
                value={selectedEstablishment}
                className="border py-1 border-sky-950 rounded-full "
                onChange={handleEstablishmentChange}
              >
                <option value="" disabled>
                  Select an establishment
                </option>
                {establishments.map((name, index) => (
                  <option key={index} value={name}>
                    {name}
                  </option>
                ))}
              </select>
            </div>
            <br />
            <div className=" text-xl pb-4">
              {reviewType === "food" && selectedEstablishment && (
                <>
                  <label className="font-bold mr-4">Food:</label>
                  <select
                    className="border py-1 border-sky-950 rounded-full"
                    id="foodcode"
                    name="foodcode"
                    value={selectedFood}
                    onChange={handleFoodChange}
                  >
                    <option value="" disabled>
                      Select a food
                    </option>
                    {foods.map((food, index) => (
                      <option key={index} value={food}>
                        {food}
                      </option>
                    ))}
                  </select>
                  <br />
                </>
              )}
            </div>
            <div className=" text-xl pb-4">
              <label className="font-bold mr-4">Rating:</label>
              <select
                id="rating"
                className="border  py-1 border-sky-950 rounded-full "
                name="rating"
              >
                <option value="" disabled>
                  Select a rating
                </option>
                {[1, 2, 3, 4, 5].map((rating) => (
                  <option key={rating} value={rating}>
                    {rating}
                  </option>
                ))}
              </select>
            </div>
            <br />
            <div className=" text-xl pb-4">
              <label className="font-bold" htmlFor="review">
                Content:
              </label>
              <textarea
                className="w-full h-48 p-4 border  border-sky-950 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-950 focus:border-transparent text-base"
                id="content"
                name="content"
                placeholder={"Write review here..."}
              ></textarea>
              <br />
            </div>
            <button
              className="bg-sky-950 font-bold text-xl py-3 px-10 mx-2 rounded-full text-white transition hover:scale-105 hover:bg-blue-950 ease-out duration-150"
              type="submit"
            >
              Submit
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
