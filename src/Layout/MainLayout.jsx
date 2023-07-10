import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../Page/Shared/Navbar';

const MainLayout = () => {
    return (
        <div>
            <Navbar/>
            <Outlet/>
            {/* you can add footer here */}
            
        </div>
    );
};

export default MainLayout;