import { Outlet, Link } from "react-router-dom";
import logo from '../images/logo.png.png';
function Root() {
  const admin = localStorage.getItem("admin");
  return (
    <div className= 'font-Roboto'>
    <div className="root-container bg-orange-50  min-h-screen" >
      
      <nav className="max-h-30 top-0 pt-0 bg-sky-950">
      
        <ul className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        <img className = " max-h-20 bottom-0 top-0" src={logo}></img>
        <li className="text-gray-50 hover:scale-125 text-lg">
          <Link to="/">Home</Link>
        </li>
        <li  className="text-gray-50 hover:scale-125 text-lg">  
          <Link to="/search">Search</Link>
        </li>
        {!admin && (<li  className="hover:scale-125 text-gray-50 text-lg">
          <Link to="/write">Write a review <svg className="inline-block stroke-white ml-2 w-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 6L12 18" strokeWidth="2" strokeLinecap="round"/>
                        <path d="M18 12L6 12" strokeWidth="2" strokeLinecap="round"/>
                        </svg></Link>
        </li>)}
        <li
         className="text-gray-50 hover:scale-125 text-lg"
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
