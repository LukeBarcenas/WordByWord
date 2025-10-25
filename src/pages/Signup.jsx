import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../pages/Signup.css";

export default function Signup() {

    const [emailText, setEmailText] = useState();
    const [passwordText, setPasswordText] = useState();
    const [verifyText, setVerifyText] = useState();
    const navigate = useNavigate();

    function handleSubmit(e) {
        e.preventDefault();

        const text = emailText.trim() || passwordText.trim();

        if(!emailText.trim() || !passwordText.trim() || (verifyText != passwordText)) {

            return;

        } 

        navigate("/login");
    }

    return (
        <div class="login-container">
            <h1>CREATE ACCOUNT</h1>
            
            <form onSubmit={handleSubmit}>
                <div class="input-group">
                    <label for="email">EMAIL</label>
                    <input type="email" id="email" placeholder="your@email.com" onChange={(e) => setEmailText(e.target.value)}/>
                </div>
                
                <div class="input-group">
                    <label for="password">PASSWORD</label>
                    <input type="password" id="password" placeholder="••••••••" onChange={(e) => setPasswordText(e.target.value)}/>
                </div>

                <div class="input-group">
                    <label for="password">VERIFY PASSWORD</label>
                    <input type="password" id="password" placeholder="••••••••" onChange={(e) => setVerifyText(e.target.value)}/>
                </div>
                
                <button type="submit"> SIGN UP </button>
            </form>
        </div>
    );
}