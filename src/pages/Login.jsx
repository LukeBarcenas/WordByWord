import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLogin } from "../hooks/useLogin";
import "../pages/Login.css";

export default function Login() {

    const [emailText, setEmailText] = useState();
    const [passwordText, setPasswordText] = useState();
    const {login, error, isLoading} = useLogin()
    const navigate = useNavigate();

    const handleSubmit = async (e) => {

        e.preventDefault();
        const text = emailText.trim() || passwordText.trim();

        if(!emailText.trim() || !passwordText.trim()) {

            return;

        } 

        await login(emailText, passwordText)
   
    }

    function handleSignup(e) {
        e.preventDefault();
        navigate("/signup");
    }

    return (
        <div className="login-container">
            <h1>LOGIN</h1>
            
            <form onSubmit={handleSubmit}>
                <div className="input-group">
                    <label htmlFor="email">EMAIL</label>
                    <input type="email" id="email" placeholder="your@email.com" onChange={(e) => setEmailText(e.target.value)}/>
                </div>
                
                <div className="input-group">
                    <label htmlFor="password">PASSWORD</label>
                    <input type="password" id="password" placeholder="••••••••" onChange={(e) => setPasswordText(e.target.value)}/>
                </div>
                
                <button type="submit" className="submit-button" disabled={isLoading}> SIGN IN </button>
                {error && <div className="error"> {error} </div>}
                
                <div className="signup">
                    Don't have an account? 
                    
                    <button onClick={handleSignup}> SIGN UP </button>
                    
                </div>

            </form>
        </div>
    );
}