import axios from "axios";
import { useEffect } from "react";
import { useContext } from "react";
import { createContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import secureLocalStorage from "react-secure-storage";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

    const login = secureLocalStorage.getItem("user")

    const test = secureLocalStorage.getItem("logged")

    const [userData, setUserData] = useState(JSON.parse(login) || "")

    const [TestAuth, setTestAuth] = useState(JSON.parse(test) || false)

    const [Page, setPage] = useState(1)

    const Token = secureLocalStorage.getItem("token")

    const headers = {
        'Authorization': `Bearer ${Token}`
    }

    return (
        <AuthContext.Provider value={{ headers, userData, setTestAuth, TestAuth, Token, setUserData, Page, setPage }}>
            {children}
        </AuthContext.Provider>
    )
}