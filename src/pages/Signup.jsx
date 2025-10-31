import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSignup } from "../hooks/useSignup";
import "../pages/Signup.css";
import { useAuthContext } from "../hooks/useAuthContext";

export default function Signup() {

    const [emailText, setEmailText] = useState();
    const [passwordText, setPasswordText] = useState();
    const [verifyText, setVerifyText] = useState();
    const {signup, error, isLoading} = useSignup();
    
    const navigate = useNavigate();

    const handleSubmit = async (e) => {

        e.preventDefault();


        const text = emailText.trim() || passwordText.trim();

        if(!emailText.trim() || !passwordText.trim() || (verifyText != passwordText)) {

            return;

        } 

        await signup(emailText, passwordText)

    }

    return (
        <div className="login-container">
            <h1>CREATE ACCOUNT</h1>
            
            <form onSubmit={handleSubmit}>
                <div className="input-group">
                    <label htmlFor="email">EMAIL</label>
                    <input type="email" id="email" placeholder="your@email.com" onChange={(e) => setEmailText(e.target.value)}/>
                </div>
                
                <div className="input-group">
                    <label htmlFor="password">PASSWORD</label>
                    <input type="password" id="password" placeholder="••••••••" onChange={(e) => setPasswordText(e.target.value)}/>
                </div>

                <div className="input-group">
                    <label htmlFor="password">VERIFY PASSWORD</label>
                    <input type="password" id="password" placeholder="••••••••" onChange={(e) => setVerifyText(e.target.value)}/>
                </div>
                
                <button type="submit" disabled={isLoading}> SIGN UP </button>

                {error && <div className="error"> {error} </div>}
            </form>
        </div>
    );
}