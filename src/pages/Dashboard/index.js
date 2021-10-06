import React from 'react';
import {useAuth} from '../../contexts/auth';

const Dashboard = () => {

    const { signOut, user } = useAuth()

    const handleSignOut = _ =>{
        signOut()
    }

    return (
        <div>
            <h1>Dashboard</h1>
            <h2>Hi, {user?.name}</h2>
            
            <button onClick={()=> handleSignOut()}>Log out</button>
        </div>
    );
};

export default Dashboard;