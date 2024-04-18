import React, { useState } from 'react';
import './LoginSignup.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import user_icon from '../Images/person.png';
import email_icon from '../Images/email.png';
import password_icon from '../Images/password.png';
import { useAuth } from '../Contexts/AuthContext';

export const LoginSignup = () => {
    const { setAuthUser, setIsLoggedIn } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loginError, setLoginError] = useState('');
    const [signupError, setSignupError] = useState('');
    const navigate = useNavigate();

    const isValidEmail = email => /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email);

    const fetchUserJournal = (email) => {
        axios.get(`http://localhost:8081/mealJournal?username=${encodeURIComponent(email)}`)
            .then(response => {
                localStorage.setItem('mealJournal', JSON.stringify(response.data));
            })
            .catch(error => {
                console.error('Failed to fetch meal journal:', error);
            });
    };

    function handleLogin(event) {
        event.preventDefault();
        if (!isValidEmail(email)) {
            setLoginError('Please enter a valid email address.');
            return;
        }
        axios.post("http://localhost:8081/login", { email, password })
            .then(res => {
                if (res.data.status === "Login Successful") {
                    setIsLoggedIn(true);
                    setAuthUser({ Name: email });
                    //fetchUserJournal(email); // Fetch and store the meal journal entries
                    navigate('/profile-info');
                } else {
                    setLoginError(res.data.status || 'Login failed. Please try again.');
                }
            })
            .catch(err => {
                console.error('An error occurred during login:', err);
                setLoginError('An error occurred during login. Please try again.');
            });
    }

    function handleSignup(event) {
        event.preventDefault();
        if (!isValidEmail(email)) {
            setSignupError('Please enter a valid email address.');
            return;
        }
        axios.post('http://localhost:8081/signup', { email, password })
            .then(res => {
                if (res.data.status === "User created successfully.") {
                    setIsLoggedIn(true);
                    setAuthUser({ Name: email });
                    navigate('/profile-info');
                } else {
                    throw new Error(res.data.status || 'Signup failed. Please try again.');
                }
            })
            .catch(error => {
                console.error('Signup error:', error);
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
            <div className="forgot_password_container" style={{textAlign: 'center', marginTop: '20px'}}>
            <a href="/editpassword" className="forgot_password_link">Forgot Password?</a>
            </div>
        </div>
    );
}

export default LoginSignup;
