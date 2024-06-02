import { Outlet, Link } from "react-router-dom";

function ManagerRoot() {
  const username = localStorage.getItem("manager");

  return (
    <div className="manager-root">
      <nav className="manager-header">
        <ul>
          <li>
            <Link to={"/"}>Home</Link>
          </li>
          <li>
            <Link to={"/manager/add-establishment"}>
              Register an Establishment
            </Link>
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
        </ul>
      </nav>
      <Outlet context={username} />
    </div>
  );
}

export default ManagerRoot;
