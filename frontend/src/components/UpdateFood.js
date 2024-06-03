import { useEffect, useState } from "react";

function UpdateFood(props) {
  const { username, show, food: foodDetails } = props;
  const [name, setName] = useState("");
  const [price, setPrice] = useState(0);
  const [foodtype, setFoodType] = useState([]);
  const [typeSelection, setFoodTypeSelection] = useState([]);
  const [bestSeller, setIsBestSeller] = useState(false);
  const [specialty, setIsSpecialty] = useState(false);
  const [others, setOthers] = useState('')
  useEffect(() => {
    let url = "http://localhost:3001/select-type";
    fetch(url)
      .then((response) => response.json())
      .then((body) => {
        setFoodTypeSelection(body);
       
      });

    setName(foodDetails.name);
    setPrice(foodDetails.price);
    setFoodType(foodDetails.foodtype);

    if (foodDetails.isbestseller === 1){
      setIsBestSeller(true)
    }

    if (foodDetails.isspecialty === 1){
      setIsSpecialty(true)
    }
    // setIsBestSeller(foodDetails.isbestseller);
    // setIsSpecialty(foodDetails.isspecialty);
  }, [foodDetails]);

  const handleCheckboxChange = (event) => {
    const value = event.target.value;
    setFoodType((prevFoodType) =>
      prevFoodType.includes(value)
        ? prevFoodType.filter((type) => type !== value)
        : [...prevFoodType, value]
    );
  };
  const checkIfExists = (foodTypeToCheck) => {
    return Object.values(typeSelection).some(foodObj => foodObj.foodtype.toLowerCase() === foodTypeToCheck.toLowerCase());
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const exists = checkIfExists(others);
    if (exists){
      
      alert("The food type you're entering is already in the system. Please select the appropriate checkbox.")
      setOthers('')
      return;
    }

    if(others.length !== 0){
      foodtype.push(others) 
      
    }
    if (foodtype.length === 0) {
      alert("Please select at least one food type.");
      return;
    }
    
    fetch("http://localhost:3001/food-item/update", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: username,
        name: name,
        price: price,
        foodtype: foodtype,
        foodcode: foodDetails.foodcode,
        isspecialty: specialty,
        isbestseller: bestSeller,
      }),
    }).then(() => {
      setName("");
      setPrice(0);
      setFoodType([]);
      setIsBestSeller(false);
      setIsSpecialty(false);
      show(false); // Update state with the parsed data
      window.location.reload();
    });
  };

  const handleCancel = () => {
    show(false);
  };

  const handleSpecialtyChange = (event) => {
    setIsSpecialty(event.target.checked ? true : false);
  };

  const handleSellerChange = (event) => {
    setIsBestSeller(event.target.checked ? true : false);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-orange-50 rounded-lg p-6 w-full max-h-xl max-w-3xl">
        <div className="flex justify-between items-center mb-4">
          <div className="w-full">
            <h1 className="font-bold text-2xl mb-2 text-sky-950">
              Update {name} details
            </h1>
            <form onSubmit={handleSubmit}>
              <div className=" text-lg pb-2">
                <label className="font-bold mr-4">Name:</label>
                <input
                  className="border-slate-300 rounded-lg border h-10 focus:shadow-md border-sky-950 pl-2 text-lg ml-4 w-11/12 text-sky-950"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className=" text-lg pb-2">
                <label className="font-bold mr-4">Price:</label>
                <input
                  className="border-slate-300 rounded-lg border h-10 focus:shadow-md border-sky-950 pl-2 text-lg ml-4 w-11/12 text-sky-950"
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  required
                />
              </div>
              <div className="grid lg:grid-cols-2 md:grid-cols-2  py-4 pl-4">
                <div>
                  <input
                    className="border-sky-950 h-4 w-4 text-sky-950"
                    type="checkbox"
                    checked={specialty}
                    onChange={handleSpecialtyChange}
                  />
                  <label
                    className="text-xl  font-semibold ml-2 mr-4"
                    htmlFor="establishment"
                  >
                    Specialty
                  </label>
                </div>
                <div>
                  <input
                    className="border-sky-950 h-4 w-4 text-sky-950"
                    type="checkbox"
                    checked={bestSeller}
                    onChange={handleSellerChange}
                  />
                  <label
                    className="text-xl  font-semibold ml-2 mr-4"
                    htmlFor="establishment"
                  >
                    Best Seller
                  </label>
                </div>
              </div>
              <div className=" text-lg pb-2">
                <label className="font-bold mr-4">Food Types:</label>
                <div className="pl-8 ">
                  <div className="grid lg:grid-cols-4 md:grid-cols-2 mt-2 mx-4">
                    {typeSelection.map((type, index) => (
                      <div key={index}>
                        <input
                          type="checkbox"
                          value={type.foodtype}
                          checked={foodtype.includes(type.foodtype)}
                          onChange={handleCheckboxChange}
                        />
                        <label className="font-semibold mr-4">
                          {type.foodtype}
                        </label>
                      </div>
                    ))}

                      
                  </div>
                </div>
              </div>
              <div className="mb-4 pl-8">
                    <input
                        className="border-slate-300 rounded-lg border w-30 pl-6 h-8 py-2 focus:shadow-md border-sky-950 text-base text-sky-950"
                        type="text"
                        placeholder="Insert other type here"
                        value={others}
                        onChange={(e) => setOthers(e.target.value)}
                      />
                    </div>
              <button
                className="bg-sky-950 py-3 px-6 mx-2 rounded-full text-white transition hover:scale-105 hover:bg-blue-950 ease-out duration-150"
                type="submit"
              >
                Update Food
              </button>
              <button
                className="bg-red-800 py-3 px-6 mx-2 rounded-full text-white transition hover:scale-105 hover:bg-red-950 ease-out duration-150"
                onClick={handleCancel}
              >
                Cancel
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UpdateFood;
