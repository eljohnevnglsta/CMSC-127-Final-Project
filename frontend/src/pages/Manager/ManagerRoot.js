import { Outlet, Link } from "react-router-dom";

function ManagerRoot() {
  const username = localStorage.getItem("manager");

    return(
      <div className= 'font-Roboto'>
      <div className="root-container bg-orange-50  min-h-screen" >
        
      <nav className="bg-sky-950">
      <img className = "w-60" src={'./images'}></img>
        <ul className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
                    <li  className="text-gray-50 text-lg"><Link to={'/'}>Home</Link></li>
                    <li className="text-gray-50 text-lg"><Link to={'/manager/add-establishment'}>Register an Establishment</Link></li>
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
            <Outlet context={username}/>
        </div>
        </div>
    )
}

export default ManagerRoot;
