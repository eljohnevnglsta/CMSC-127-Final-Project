import { Outlet, Link } from 'react-router-dom';

function Root () {
    return(
        <div className="root-container">
            <nav className="nav-bar">
                <li><Link to='/'>Home</Link></li>
                <li><Link to='/search'>Search</Link></li>
            </nav>
            <Outlet />
        </div>
    )
}

export default Root