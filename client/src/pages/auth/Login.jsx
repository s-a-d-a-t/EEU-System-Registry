import { useState } from "react";
import {useNavigate} from "react-router-dom";
import {login as loginService} from "../../services/authService";

const Login = ()=>{
    const [email,setEmail]=useState("");
    const [password,setPassword]=useState("");

    return(
        <div className="login-page">
            <h1>EEU System Registry</h1>
                <form >

                    <div>
                        <label >Email</label>
                        <input type="email" 
                               value={email}
                               onChange={(e)=> setEmail(e.target.value)}
                        />
                    </div>

                    <div>
                        <label >Password</label>
                        <input type="password" 
                               value={password}
                               onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    
                    <button type="submit">Login</button>

                </form>

        </div>
    );
};

export default Login;