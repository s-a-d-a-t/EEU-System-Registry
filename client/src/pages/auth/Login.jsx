import { useState } from "react";
import {useNavigate} from "react-router-dom";
import {login as loginService} from "../../services/authService";
import {useAuth} from "../../context/AuthContext"

const Login = ()=>{
    //login form state
    const [email,setEmail]=useState("");
    const [password,setPassword]=useState("");

    //navigation
    const navigate = useNavigate();

    // auth context
    const {login} = useAuth();

    //Handle login
    const handleSubmit = async (e) => {
        e.preventDefault();

        try{
            const data = await loginService(email,password);

            if (data.success){
                login (data.user, data.token);
                navigate("/registry");
            } else{
                alert(data.message);
            } 
            }catch (error){
                console.error(error);
                alert("something went wrong. please try again.");

        }
    };

    return(
        <div className="login-page">
            <h1>EEU System Registry</h1>
                <form onSubmit={handleSubmit} >

                  <div>

                    <label>Email</label>

                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email"
                        required
                    />

                </div>

                <div>

                    <label>Password</label>

                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter your password"
                        required
                    />

                </div>

                <button type="submit">

                    Login

                </button>

            </form>

        </div>

    );

};

export default Login;