import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function Home() {
  const [establishment, setEstablishment] = useState([]);
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
    handleAll();
  }, []);

  function handleAll() {
    let url = "http://localhost:3001/view-all-establishments";
    fetch(url)
      .then((response) => response.json())
      .then((body) => {
        setEstablishment(body);
      });
  }

  function handleDelete(establishment) {
    const userToDelete =
      userRole === "admin" ? establishment.username : username;
    console.log("user:" + userToDelete);
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
          window.scrollTo({ top: 0 });
        } else {
          console.error("Error deleting establishment:", data.message);
        }
      })
      .catch((error) => {
        console.error("Error deleting establishment:", error);
      });
  }
  function handleFilter() {
    let url = "http://localhost:3001/view-highly-rated-establishments";
    fetch(url)
      .then((response) => response.json())
      .then((body) => {
        setEstablishment(body);
      });
  }
  return (
    <div className="home-container">
      <div className="text-sm font-medium text-center text-gray-500 border-b border-gray-200 dark:text-gray-400 dark:border-gray-700 my-7 pl-8">
        <div className="flex flex-wrap -mb-px">
          <button
            className="inline-block p-4 border-b-2 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300 px-6"
            onClick={() => {
              handleAll();
            }}
          >
            Show All
          </button>
          <button
            className="inline-block p-4 border-b-2 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300 px-6"
            onClick={() => {
              handleFilter();
            }}
          >
            Show Highly Rated Places!
          </button>
        </div>
      </div>
      {user && (
        <h1 className="font-bold text-xl ml-9 my-6 text-sky-950">
          Share your experience with these establishments.{" "}
        </h1>
      )}
      {admin && (
        <h1 className="font-bold text-xl ml-9 my-6 text-sky-950">
          Hi Admin! You can delete foods, reviews, and food establishments from
          here{" "}
        </h1>
      )}
      <div className="grid lg:grid-cols-4 md:grid-cols-2 pb-32 gap-6 mx-32">
        {establishment.map((business) => {
          return (
            <div className="max-w-sm rounded overflow-hidden shadow-lg hover:shadow">
              <img
                class="w-full"
                src="https://t4.ftcdn.net/jpg/03/39/43/29/360_F_339432932_UvTfQZoi68BfndE1mPI8nkRo60jNNHCh.jpg"
                alt="Sunset in the mountains"
              ></img>
              <div className="px-8 py-6 ">
                <Link to={`/food-establishment/${business.name}`}>
                  <h1 className="font-bold text-xl mb-2 text-sky-950">
                    {business.name}
                  </h1>{" "}
                </Link>
                <h5>
                  <strong className="text-base">Type:</strong> {business.type}
                </h5>
                {business.averageRating ? (
                  <h5>
                    {" "}
                    <strong className="text-base"> Rating: </strong>{" "}
                    {business.averageRating}
                  </h5>
                ) : (
                  <p>No reviews yet!</p>
                )}
                {(userRole == "admin" || username == business.username) && (
                  <button
                    className="bg-red-500 py-3 px-4 my-3 rounded-lg text-white transition hover:scale-105 hover:bg-blue-950 ease-out duration-150"
                    onClick={() => handleDelete(business)}
                  >
                    Delete
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Home;
