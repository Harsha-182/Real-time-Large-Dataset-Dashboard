import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import Login from './components/Auth/Login';

const NavRoutes = () => {
    return(
        <Router>
            <Routes>
                <Route path="/dashboard/*" Component={Dashboard}/>
                <Route path="/login" Component={Login}/>
            </Routes>
        </Router>
    )
};

export default NavRoutes;