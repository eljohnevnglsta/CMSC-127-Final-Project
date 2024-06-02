import { Outlet, Link } from "react-router-dom";

function Root() {
  const admin = localStorage.getItem("admin");
  return (
    <div className="font-Roboto">
      <div className="root-container bg-orange-50  min-h-screen">
        <nav className="bg-sky-950">
          <img className="w-60" src={"./images"}></img>
          <ul className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
            <li className="text-gray-50 text-lg">
              <Link to="/">Home</Link>
            </li>
            <li className="text-gray-50 text-lg">
              <Link to="/search">Search</Link>
            </li>
            {!admin && (
              <li className="text-gray-50 text-lg">
                <Link to="/write">Write a review</Link>
              </li>
            )}
            <li
              className="text-gray-50 text-lg"
              style={{ cursor: "pointer" }}
              onClick={() => {
                localStorage.removeItem("admin");
                localStorage.removeItem("manager");
                localStorage.removeItem("user");
                window.location.replace("/");
              }}
            >
              Log Out
            </li>
          </ul>
        </nav>
        <div className="h-full">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default Root;
