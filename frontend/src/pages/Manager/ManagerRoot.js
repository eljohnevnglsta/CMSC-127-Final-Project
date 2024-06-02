import { Outlet, Link } from "react-router-dom";
import logo from '../../images/logo.png.png';
function ManagerRoot() {
  const username = localStorage.getItem("manager");

    return(
      <div className= 'font-Roboto'>
      <div className="root-container bg-orange-50  min-h-screen" >
        
      <nav className="bg-sky-950"> 
      
        <ul className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        <img className = " max-h-20 bottom-0 top-0" src={logo}></img>
                    <li  className=" hover:scale-125 text-gray-50 text-lg"><Link to={'/'}>Home</Link></li>
                    <li className="  hover:scale-125 text-gray-50 text-lg"><Link to={'/manager/add-establishment'}>Register an Establishment</Link></li>
                    <li
                    
                    className="text-gray-50   hover:scale-125 text-lg"
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
            <Outlet context={username}/>
        </div>
        </div>
    )
}

export default ManagerRoot;
