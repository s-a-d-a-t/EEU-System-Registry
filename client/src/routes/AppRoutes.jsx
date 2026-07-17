import { BrowserRouter, Routes, Route } from "react-router-dom";

import MainLayout from "../layouts/MainLayout";

import Login from "../pages/auth/Login";
import Registry from "../pages/registry/Registry";
import Create from "../pages/applications/Create";
import Edit from "../pages/applications/Edit";
import Details from "../pages/applications/Details";
import Users from "../pages/users/Users";


const AppRoutes = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route 
                    path="/login" 
                    element={<Login />} 
                />

                <Route 
                    path="/" 
                    element={<MainLayout />}
                >
                    <Route 
                        path="registry" 
                        element={<Registry />} 
                    />

                    <Route path="applications">

                        <Route 
                            path="create" 
                            element={<Create />} 
                        />

                        <Route 
                            path=":id" 
                            element={<Details />} 
                        />

                        <Route 
                            path=":id/edit" 
                            element={<Edit />} 
                        />
                    </Route>
                    <Route 
                        path="users" 
                        element={<Users />} 
                    />

                </Route>

            </Routes>

        </BrowserRouter>
    );
};

export default AppRoutes;