import { createContext, useState ,useEffect, useContext} from "react";
export const AuthContext = createContext();
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);

//login 
const login = (userData, userToken) => {
    setUser(userData);
    setToken(userToken);

    //saving the token and user in local storage 
    localStorage.setItem("token", userToken);
    localStorage.setItem("user", JSON.stringify(userData));
};

//logout
const logout = () => {
    setUser(null);
    setToken(null);

    localStorage.removeItem("token");
    localStorage.removeItem("user");
};


//restore login
useEffect(() => {
    const savedToken = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");
    const userData = savedUser ? JSON.parse(savedUser) : null;

    if(savedToken && userData){
        setToken(savedToken);
        setUser(userData);
    }
},
[]);
    return (
        <AuthContext.Provider
            value={{
                user,
                token,
                login,
                logout
            }}
        >

            {children}

        </AuthContext.Provider>
    );
};
// Custom hook
export const useAuth = () => {

    return useContext(AuthContext);

};
