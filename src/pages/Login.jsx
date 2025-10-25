import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../pages/Login.css";

export default function Login() {

    const [emailText, setEmailText] = useState();
    const [passwordText, setPasswordText] = useState();
    const navigate = useNavigate();

    function handleSubmit(e) {

        e.preventDefault();
        const text = emailText.trim() || passwordText.trim();

        if(!emailText.trim() || !passwordText.trim()) {

            return;

        } 

        navigate("/");
    }

    function handleSignup(e) {
        e.preventDefault();
        navigate("/signup");
    }

    return (
        <div class="login-container">
            <h1>LOGIN</h1>
            
            <form onSubmit={handleSubmit}>
                <div class="input-group">
                    <label for="email">EMAIL</label>
                    <input type="email" id="email" placeholder="your@email.com" onChange={(e) => setEmailText(e.target.value)}/>
                </div>
                
                <div class="input-group">
                    <label for="password">PASSWORD</label>
                    <input type="password" id="password" placeholder="••••••••" onChange={(e) => setPasswordText(e.target.value)}/>
                </div>
                
                <button type="submit" class="submit-button"> SIGN IN </button>
                
                <div class="signup">
                    Don't have an account? 
                    
                    <button onClick={handleSignup}> SIGN UP </button>
                    
                </div>

            </form>
        </div>
    );
}