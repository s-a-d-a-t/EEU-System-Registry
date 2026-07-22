import { Navigate, Outlet } from "react-router-dom";
import {useAuth} from "../context/AuthContext";

const ProtectedRoute = () =>{
    const {token} = useAuth();

    if(!token){
        return <Navigate to = "/login" replace />;
    }

    // render protected page
    return <Outlet />; 

};

export default ProtectedRoute;