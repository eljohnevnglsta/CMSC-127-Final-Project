import { Outlet, Link } from 'react-router-dom';

function ManagerRoot (){
    const username = localStorage.getItem("manager");

    return(
        <div className='manager-root'>
            <nav className='manager-header'>
                <ul>
                    <li><Link to={'/manager'}>Home</Link></li>
                    <li><Link to={'/manager/add-establishment'}>Register an Establishment</Link></li>
                </ul>
            </nav>  
            <Outlet context={username}/>
        </div>
    )
}

export default ManagerRoot