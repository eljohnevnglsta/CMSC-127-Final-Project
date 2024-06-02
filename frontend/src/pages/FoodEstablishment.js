import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import FoodList from "../components/FoodList";
import EstablishmentReview from "../components/EstablishmentReview";
import DeleteEstablishment from "../components/DeleteEstablishment";
function FoodEstablishment() {
  let { name } = useParams();
  const [showDelete, setShowDelete] = useState(false);
  const [showReview, setShowReview] = useState(false);
  const [businessDetails, setBusinessDetails] = useState({});
  const [establishment, setEstablishment] = useState([]);
  const [userRole, setUserRole] = useState(null);
  const [username, setUsername] = useState(null);
  const admin = localStorage.getItem("admin");
  const user = localStorage.getItem("user");
  useEffect(() => {
    let url = `http://localhost:3001/select-establishment-details/${name}`;
    fetch(url)
      .then((response) => response.json())
      .then((body) => {
        console.log(body[0]);
        setBusinessDetails(body[0]);
      });
  }, []);

  useEffect(() => {
    if (admin) {
      setUserRole("admin");
      setUsername(admin);
    } else if (user) {
      setUserRole("user");
      setUsername(user);
    }
  }, []);

  function handleDelete(establishment) {
    const userToDelete =
      userRole === "admin" ? establishment.username : username;
    fetch("http://localhost:3001/establishment/delete", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        businessid: establishment.businessid,
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
          setEstablishment((prevEstablishments) =>
            prevEstablishments.filter(
              (est) => est.businessid !== establishment.businessid
            )
          );
          alert("Establishment deleted!");
          window.location.replace("/");
          window.scrollTo({ top: 0 });
        } else {
          console.error("Error deleting establishment:", data.message);
        }
      })
      .catch((error) => {
        console.error("Error deleting establishment:", error);
      });
  }

  return (
    <div className="my-10 overflow-hidden mx-20  round shadow-lg h-full">
      <img
        className="h-60 w-full"
        src="https://t4.ftcdn.net/jpg/03/39/43/29/360_F_339432932_UvTfQZoi68BfndE1mPI8nkRo60jNNHCh.jpg"
        alt="Sunset in the mountains"
      ></img>
      <div className="py-10 px-20 ">
        <h1 className="font-bold text-4xl  text-sky-950">{name}</h1>

        <div className="flex ml-8 shadow-md py-7 px-7 w-11/12 round">
          <div className="w-9/12 px-4">
            <p className="text-lg">
              {" "}
              <strong>Average Rating:</strong> {businessDetails.averageRating}
            </p>
            <p className="text-lg">
              <strong>Type:</strong> {businessDetails.type}
            </p>
            <p className="text-lg">
              <strong>Address: </strong> {businessDetails.street},{" "}
              {businessDetails.barangay}, {businessDetails.city},{" "}
              {businessDetails.province}
            </p>
          </div>
          {admin && (
            <button className='bg-red-500 py-3 px-4 mx-2 rounded-full text-white transition hover:scale-105 hover:bg-blue-950 ease-out duration-150' onClick={() => handleDelete(businessDetails)}>
              Delete This Establishment
            </button>
          )}

          {!admin && (
            <Link to={`/write/?reviewType=establishment&establishment=${name}`}>
              <button className="bg-sky-950 py-3 px-6 ml-4 mr-12 rounded-full text-white transition hover:scale-105 hover:bg-blue-950 ease-out duration-150">
                Write a review
                <svg
                  className="inline-block stroke-white ml-2 w-6"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M12 6L12 18" strokeWidth="2" strokeLinecap="round" />
                  <path d="M18 12L6 12" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </button>
            </Link>
          )}
        </div>

        <button
        className='inline-block p-4 border-b-2 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300 px-6'
          onClick={() => {
            setShowReview(false);
          }}
        >
          Foods
        </button>
        <button
          className='inline-block p-4 border-b-2 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300 px-6'
          onClick={() => {
            setShowReview(true);
          }}
        >
          Reviews
        </button>
        {showReview ? (
          <EstablishmentReview name={name} />
        ) : (
          <FoodList name={name} />
        )}
      </div>
    </div>
  );
}

export default FoodEstablishment;
