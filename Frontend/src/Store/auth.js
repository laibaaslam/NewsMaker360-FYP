import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import toast from 'react-hot-toast';
// creating context
export const AuthContext = createContext();
// Provider 
export const AuthProvider = ({ children }) => {
    const [token, settoken] = useState(localStorage.getItem('Token'));
    const [User, setUser] = useState("");
    const [isLoading, setisLoading] = useState(true);
    const authorizationToken = `Bearer ${token}`;
    // for conditional rendering of logout page
    const isLoggedIn = !!token;
    // console.log(isLoggedIn);
    const StoreTokenInLS = (serverJWTToken) => {
        settoken(serverJWTToken);
        // console.log("Hi 2 ");
        return localStorage.setItem('Token', serverJWTToken);
    }
    const LogoutUser = () => {
        settoken("");
        setUser("");
        return localStorage.removeItem('Token');
    }
    // Authentication to get currentlty logged in user data 
    const userAuthentication = async () => {
        try {
            setisLoading(true);
            const response = await axios.get('http://localhost:8080/api/auth/user', {
                headers: {
                    // Set the Authorization header with the JWT token
                    'Authorization': authorizationToken,
                },
            });
            // console.log(response);
            if (response.data && response.data.success) {

                const userData = response.data.user;
                // console.log(userData);
                setUser(userData);
                // console.log(response.data.message);
                setisLoading(false);
            } else {

                // Authentication  failed
                console.log(response.message || "Error in Authentication");
                setisLoading(false);
            }

        } catch (error) {
            // Error occurred during registration process
            if (error.response) {
                // Conflict error (user already exists)
                console.log(error.response.data.message);

            } else {
                // Network error or other client-side error
                // console.error("Client error:", error.message);
                console.log("An error occurred. Please try again later.");
            }
        }
    }
    //    changed from empty to token depdency
    useEffect(() => {
        // only once
        userAuthentication();

    }, [token]);
    return (
        <AuthContext.Provider value={{ User, isLoggedIn, StoreTokenInLS, LogoutUser, authorizationToken, isLoading }}>
            {children}
        </AuthContext.Provider>
    );
}
// consumer 
export const useAuth = () => {
    const authContextValue = useContext(AuthContext);

    if (!authContextValue) {

        throw new Error("useAuth used outside of the Provider");

    }
    return authContextValue;
}