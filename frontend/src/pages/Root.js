import { Outlet, Link } from "react-router-dom";

function Root() {
  return (
    <div className= 'font-Roboto'>
    <div className="root-container bg-orange-50  min-h-screen" >
      
      <nav className="bg-sky-950">
      <img className = "w-60" src={'./images'}></img>
        <ul className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        <li className="text-gray-50 text-lg">
          <Link to="/">Home</Link>
        </li>
        <li  className="text-gray-50 text-lg">
          <Link to="/search">Search</Link>
        </li>
        <li  className="text-gray-50 text-lg">
          <Link to="/write">Write a review <svg className="inline-block stroke-white ml-2 w-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 6L12 18" strokeWidth="2" strokeLinecap="round"/>
                        <path d="M18 12L6 12" strokeWidth="2" strokeLinecap="round"/>
                        </svg></Link>
        </li>
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