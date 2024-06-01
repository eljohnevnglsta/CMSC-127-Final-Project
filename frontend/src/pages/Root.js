import { Outlet, Link } from "react-router-dom";

function Root() {
  return (
    <div className="root-container">
      <nav className="nav-bar">
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/search">Search</Link>
        </li>
        <li>
          <Link to="/write">Write a review</Link>
        </li>
        <li
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
      </nav>
      <Outlet />
    </div>
  );
}

export default Root;