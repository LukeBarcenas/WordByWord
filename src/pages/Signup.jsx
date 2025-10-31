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

        if((verifyText != passwordText)) {

            return;

        } 

        await signup(emailText, passwordText)

    }

    function handleLogin(e) {

        e.preventDefault();
        navigate("/login");
        
    }

    return (
        <div className="signup-container">
            <h1>CREATE ACCOUNT</h1>
            
            <form onSubmit={handleSubmit}>
                <div className="input-group">
                    <label htmlFor="email">EMAIL</label>
                    <input type="email" id="email" placeholder="your@email.com" onChange={(e) => setEmailText(e.target.value)}/>
                </div>

                <div className="password-details">
                    <span className="title">Password Requirements: </span><br />
                    * Minimum Length: 5 characters <br />
                    * At least 1 Uppercase Letter <br />
                    * At least 1 Lowercase Letter <br />
                    * At least 1 Number
                </div>
                
                <div className="input-group">
                    <label htmlFor="password">PASSWORD</label>
                    <input type="password" id="password" placeholder="••••••••" onChange={(e) => setPasswordText(e.target.value)}/>
                </div>

                <div className="input-group">
                    <label htmlFor="password">VERIFY PASSWORD</label>
                    <input type="password" id="password" placeholder="••••••••" onChange={(e) => setVerifyText(e.target.value)}/>
                </div>
                
                <button type="submit" disabled={isLoading} className="signup-button"> SIGN UP </button>

                {error && <div className="error"> {error} </div>}

                <div className="login">
                    Already have an account? 
                    
                    <button onClick={handleLogin} disabled={isLoading}> LOGIN </button>
                    
                </div>
            </form>
        </div>
    );
}