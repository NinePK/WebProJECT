import React, { useContext, useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import '../css/home.css';
import logogroovy from '../picture/groovy.png';
import { AuthContext } from '../context/authContext';
import Login from './login';
import Register from './register';
import { Form, Input, Button, message } from 'antd';
function Nav() {
    const { currentUser, logout } = useContext(AuthContext); // ใช้ useContext เพื่อเข้าถึง currentUser และ logout
    const hamIconRef = useRef(null);
    const mobileMenuRef = useRef(null);
    const [open, setOpen] = React.useState(false);

    const handleClose = () => {
        setOpen(false);
    };
    const handleLogout = () => {
        logout();
        window.location.href = '/';
    };
    const handleOpen = () => {
        setOpen(true);
        setTimeout(() => {
            window.location.href = '/login';
        }, 1000);
    };
    const handleOpen2 = () => {
        setOpen(true);
        setTimeout(() => {
            window.location.href = '/register';
        }, 1000);
    };

    useEffect(() => {
        const toggleMenu = () => {
            const display = mobileMenuRef.current.style.display;
            mobileMenuRef.current.style.display = display === 'block' ? 'none' : 'block';
            hamIconRef.current.classList.toggle('change');
        };

        const hamIcon = hamIconRef.current;
        hamIcon.addEventListener('click', toggleMenu);

        return () => {
            hamIcon.removeEventListener('click', toggleMenu);
        };
    }, []);

    return (
        <div>
            <div className="container">
                <div className="nav-con">
                    <ul className='menu logo-container'>
                        <li className="logo">
                            <img src={logogroovy} />
                            <a href="#">Groovy&nbsp;Design</a>
                        </li>
                    </ul>
                    <div className="MENU_NO_LOGO">
                        <ul className='menu'>
                            <li><a href="#">Kitchen</a></li>
                            <li><a href="#">Bathroom</a></li>
                            <li><a href="#">Bedroom</a></li>
                            <li><a href="#">Workspace</a></li>
                            <li><a href="#">Livingroom</a></li>
                        </ul>
                        <ul className='menu button-container'>
                            {currentUser ? (
                                <li>
                                    <div className="auth-box">
                                        <button className="nav-login-btn" onClick={handleLogout}>LOGOUT</button>
                                    </div>
                                </li>
                            ) : (
                                <li>
                                    <div className="auth-box">
                                        <Link to="/login"><button className="nav-login-btn">LOGIN</button></Link>
                                    </div>
                                    <div className="auth-box">
                                        <Link to="/register"><button className="nav-signup-btn">SIGNUP</button></Link>
                                    </div>
                                </li>
                            )}
                        </ul>
                    </div>
                    <div className="hamburger-icon" ref={hamIconRef}>
                        <div className="bar1"></div>
                        <div className="bar2"></div>
                        <div className="bar3"></div>
                    </div>
                </div>
            </div>
            <div >
                <ul className="moblie-menu" ref={mobileMenuRef}>
                    <li><a href="#">Bed Room</a></li>
                    <li><a href="#">Living Room</a></li>
                    <li><a href="#">Bath Room</a></li>
                    <li><a href="#">Kitchen Room</a></li>
                    <li><a href="#">Work Space</a></li>
                    {currentUser ? (
                        <li><button onClick={handleLogout}>Logout</button></li>
                    ) : (
                        <React.Fragment>
                            <li><Link to="/login" onClick={handleOpen}>Login</Link></li>
                            <li><Link to="/register" onClick={handleOpen2}>Signup</Link></li>
                        </React.Fragment>
                    )}
                </ul>
            </div>
            <Backdrop open={open} onClick={handleClose}>
                <CircularProgress color="inherit" />
            </Backdrop>
        </div>
    );
}

export default Nav;
