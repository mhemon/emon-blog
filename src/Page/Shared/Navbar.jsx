import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import Swal from 'sweetalert2';
import useAuthor from '../../hooks/useAuthor';

const Navbar = () => {
    const { user, logout } = useAuth()
    const [isAuthor] = useAuthor()
    const navigate = useNavigate()

    const handleLogout = () => {
        logout()
            .then(() => {
                navigate('/')
            })
            .catch(error => {
                console.error(error)
                Swal.fire({
                    icon: 'error',
                    title: `${error.code}`,
                    text: `${error.message}`
                })
            })
    }

    const navItems = <>
        <li><NavLink to='/'>Blogs</NavLink></li>
        {user && (
            isAuthor && <li><NavLink to='/myblogs'>My Blogs</NavLink></li>
        )}
        {user && (
            isAuthor && <li><NavLink to='/newblog'>Add New Blog</NavLink></li>
        )}
    </>
    return (
        <div className="navbar bg-base-100">
            <div className="navbar-start">
                <div className="dropdown">
                    <label tabIndex={0} className="btn btn-ghost lg:hidden">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" /></svg>
                    </label>
                    <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
                        {navItems}
                    </ul>
                </div>
                <Link to="/" className="btn btn-ghost normal-case text-xl">Emon Blog</Link>
            </div>
            <div className="navbar-center hidden lg:flex">
                <ul className="menu menu-horizontal px-1">
                    {navItems}
                </ul>
            </div>
            <div className="navbar-end">
                {user ? <>
                    <div className="tooltip tooltip-bottom" data-tip={user?.displayName}>
                        <div className="avatar hidden md:block">
                            <div className=" w-12 me-2 rounded-full">
                                <img src={user?.photoURL} />
                            </div>
                        </div>
                    </div>
                    <button onClick={handleLogout} className="btn btn-outline btn-error px-2">Logout</button>
                </> : <>
                    <Link to='/login'><button className='btn btn-sm btn-primary btn-outline normal-case md:btn md:btn-primary md:normal-case rounded-lg md:btn-outline'>Login</button></Link>
                </>}
            </div>
        </div>
    );
};

export default Navbar;