import axios from "axios";
import { createContext, useEffect, useState } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    // เรียกใช้งานเมื่อ component mount เพื่อตรวจสอบว่าผู้ใช้เข้าสู่ระบบอยู่หรือไม่
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      setCurrentUser(user);
    }
  }, []);

  const login = async (email, password) => {
    // ที่นี่คุณจะต้องทำการเรียก API เพื่อเข้าสู่ระบบ
    // สมมติว่า API ตอบกลับมาพร้อมกับข้อมูลผู้ใช้และ token
    const response = await fetch('/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });
    const data = await response.json();
    if (response.ok) {
      setCurrentUser(data.user);
      localStorage.setItem('user', JSON.stringify(data.user));
      localStorage.setItem('token', data.token);
    } else {
      throw new Error(data.message || 'Failed to login');
    }
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  const value = {
    currentUser,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
