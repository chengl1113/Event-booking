import React from 'react';
import NavigationBar from './navbar';
import useAuth from '../hooks/useAuth';
import Button from 'react-bootstrap/Button';


const Account = () => {
    const { auth, setAuth } = useAuth();

    const userEmail = auth.email;
    const userName = auth.name;
    const userIsAdmin = auth.isAdmin;

    const handleLogOut = () => {
        // Reset auth context
        setAuth({})
    }

    return (
        <div>
            <NavigationBar />
            <div className='container d-flex flex-column justify-content-center align-items-center mt-5'>
                <h1>Account Information</h1>

                <div className='container d-flex flex-column justify-content-center mt-5'>
                    <p><strong>Name:</strong> {userName}</p>
                    <p><strong>Email:</strong> {userEmail}</p>
                    <p><strong>Role:</strong> {userIsAdmin ? 'Admin' : 'User'}</p>
                    <Button variant='danger' onClick={handleLogOut}>Log Out</Button>
                </div>
            </div>
        </div>
    )
}

export default Account