import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';

import Appbar from './Appbar';
import UnauthorizedModal from './UnAuthorizedModal';
import MainGrid from './MainGrid';
import AddUser from './Users/AddUser';
import UnknownPage from './UnknownPage';
import UserMainBoard from './UserMainBoard';

const Dashboard = () => {
    const navigate = useNavigate();
    const userRole = localStorage.getItem('userRole');
    const requestedUrl = window.location.pathname;
    const [showUnauthorizedModal, setShowUnauthorizedModal] = useState(false);
    const [message, setMessage] = useState('');


    const adminAccess = ['/dashboard/', '/dashboard/admin/adduser'];
    const userAccess = ['/dashboard/user/'];

    const preferredLocation = (role) => {
        if(role === 'super-admin' && adminAccess.includes(requestedUrl)) {
            navigate(requestedUrl);
        } else if(role === 'manager' && userAccess.includes(requestedUrl)) {
            navigate(requestedUrl);
        } else if(role === 'user' && userAccess.includes(requestedUrl)) {
            navigate(requestedUrl);
        } else {
            setShowUnauthorizedModal(true);
            setMessage('You do not have access to this page.')
        }
    }

    const sideNavItems = 
        userRole === 'super-admin'?
            ['Dashboard', 'Users'] :
            ['Dashboard']

    useEffect(() => {
        const accessToken = localStorage.getItem('authToken');
        if(accessToken) {
            if(userRole) {
                preferredLocation(userRole);
            } else {
                setShowUnauthorizedModal(true);
                setMessage('Your Role is not assigned yet.')
            }
        } else {
            navigate('/login');
        }
    }, [])

    const closeModal = () => {
        setShowUnauthorizedModal(false);
        navigate('/login');
    };

    return (
        <div>
            <Routes>
                <Route element={showUnauthorizedModal? false: 
                    <Appbar 
                        items = {sideNavItems}
                        role={userRole}/>}
                    >
                    <Route exact path="/" Component={MainGrid} />
                    <Route path="/admin/adduser" Component={AddUser}/>
                    <Route path="/user/" Component={UserMainBoard}/>
                    <Route path="/*" Component={UnknownPage}/>
                </Route>
            </Routes>
            <UnauthorizedModal showModal={showUnauthorizedModal} onClose={closeModal} message={message} />
        </div>
    );
}

export default Dashboard;