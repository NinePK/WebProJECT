import axios from "axios";
import { createContext, useEffect, useState } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(
    JSON.parse(localStorage.getItem("user")) || null
  );

  const login = async (inputs) => {
    const res = await axios.post("http://localhost:8000/api/users/login", inputs);
    
    // ตรวจสอบก่อนว่า response มี data และ token หรือไม่
    if (res.data && res.data.token) {
      localStorage.setItem("token", res.data.token); // เก็บ token ไว้ใน local storage
      localStorage.setItem("UserID", res.data.UserID);
      const { token, ...userData } = res.data; // แยก token ออกจากข้อมูลผู้ใช้อื่นๆ
      setCurrentUser(userData); // เก็บข้อมูลผู้ใช้ (ไม่รวม token) ไว้ใน state
    }
  };

  const logout = async () => {
    await axios.post("http://localhost:8000/api/users/logout");
    localStorage.removeItem("token"); 
    localStorage.removeItem("UserID");
    localStorage.removeItem("user"); 
    setCurrentUser(null);
  };

  useEffect(() => {
    localStorage.setItem("user", JSON.stringify(currentUser));
  }, [currentUser]);

  return (
    <AuthContext.Provider value={{ currentUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
