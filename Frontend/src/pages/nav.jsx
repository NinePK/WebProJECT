import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import Button from '@mui/material/Button';
import Cookies from 'js-cookie';
import '../css/home.css';
import logogroovy from '../picture/groovy.png';

function Nav() {
    const hamIconRef = useRef(null);
    const mobileMenuRef = useRef(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [open, setOpen] = React.useState(false);

    const handleClose = () => {
        setOpen(false);
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

            const checkLoginStatus = () => {
                const token = Cookies.get('token'); // อ่านคุกกี้ชื่อ 'token'
                if (token) {
                    setIsLoggedIn(true); // ถ้ามี token, ตั้งค่า isLoggedIn เป็น true
                } else {
                    setIsLoggedIn(false); // ถ้าไม่มี token, ตั้งค่า isLoggedIn เป็น false
                }
            };

            checkLoginStatus();

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
                        <ul className='menu button-container'>
                            <li><a href="#">Kitchen</a></li>
                            <li><a href="#">Bathroom</a></li>
                            <li><a href="#">Bedroom</a></li>
                            <li><a href="#">Workspace</a></li>
                            <li><a href="#">Livingroom</a></li>
                        </ul>
                        <ul className='menu button-container'>
                            <li>
                                <div className="auth-box">
                                    {isLoggedIn ? (
                                        // ถ้าล็อกอินแล้ว, แสดงปุ่ม Logout
                                        <button className="nav-logout-btn" onClick={() => { Cookies.remove('token'); setIsLoggedIn(false); }}>LOGOUT</button>
                                    ) : (
                                        // ถ้ายังไม่ล็อกอิน, แสดงปุ่ม Login และ Signup
                                        <>
                                            <Link to="/login"><button className="nav-login-btn" onClick={handleOpen}>LOGIN</button></Link>
                                            <Link to="/register"><button className="nav-signup-btn" onClick={handleOpen2}>SIGNUP</button></Link>
                                        </>
                                    )}
                                </div>
                            </li>
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
                    <li><Link to="/login" onClick={handleOpen}>Login</Link></li>
                    <li><Link to="/register" onClick={handleOpen2}>Signup</Link></li>
                </ul>
            </div>
            <Backdrop open={open} onClick={handleClose}>
                <CircularProgress color="inherit" />
            </Backdrop>
        </div>
    );
}

export default Nav;
