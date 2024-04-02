import React, { useState } from 'react';
import './LoginSignup.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

// Assuming these images exist in your project structure
import user_icon from '../Images/person.png';
import email_icon from '../Images/email.png';
import password_icon from '../Images/password.png';
import {useAuth} from '../Contexts/AuthContext'

export const LoginSignup = () => {
    const {authUser, setAuthUser,isLoggedIn,setIsLoggedIn} = useAuth()
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loginError, setLoginError] = useState('');
    const [signupError, setSignupError] = useState('');
    const navigate = useNavigate();

    // Email validation function
    const isValidEmail = email => /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email);

    function handleLogin(event) {
        event.preventDefault();
        if (!isValidEmail(email)) {
            setLoginError('Please enter a valid email address.');
            return;
        }
        axios.post("http://localhost:8081/login", { email, password })
            .then(res => {
                // Assuming the server response structure is consistent and includes a status property
                if (res.data.status === "Login Successful") {
                    setIsLoggedIn(true)
                    setAuthUser({
                        Name: email
                    })
                    navigate('/dashboard');
                } else {
                    setLoginError(res.data.status || 'Login failed. Please try again.'); // Use the server's error message
                }
            })
            .catch(err => {
                console.log(err);
                setLoginError('An error occurred during login. Please try again.');
            });
    }

    function handleSignup(event) {
        event.preventDefault();
        if (!isValidEmail(email)) {
            setSignupError('Please enter a valid email address.');
            return;
        }
        fetch('http://localhost:8081/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        })
            .then(res => res.json().then(data => ({ ok: res.ok, body: data }))) // Parse JSON body and include response status
            .then(({ ok, body }) => {
                if (ok) {
                    setIsLoggedIn(false)
                    setAuthUser({
                        Name: email
                    })
                    navigate('/profile');
                } else {
                    throw new Error(body.status || 'Signup failed. Please try again.'); // Use the server's error message
                }
            })
            .catch(error => {
                console.error('Error:', error);
                setSignupError(error.message);
            });
    }

    return (
        <div className='login_container'>
            <div className='login_header'>
                <div className='login_text'>Login / Sign Up</div>
                <div className='login_underline'></div>
            </div>
            <div className="login_inputs">
                <div className="login_input">
                    <img src={email_icon} alt="Email Icon" />
                    <input type="email" placeholder="Email" onChange={e => setEmail(e.target.value)} />
                </div>
                <div className="login_input">
                    <img src={password_icon} alt="Password Icon" />
                    <input type="password" placeholder="Password" onChange={e => setPassword(e.target.value)} />
                </div>
            </div>
            {loginError && <div className="error_message">{loginError}</div>}
            {signupError && <div className="error_message">{signupError}</div>}
            <div className="login_submit-container">
                <button type="submit" className="login_submit" onClick={handleLogin}>Login</button>
                <button type="submit" className="login_submit" onClick={handleSignup}>Sign Up</button>
            </div>
        </div>
    );
}

export default LoginSignup;
