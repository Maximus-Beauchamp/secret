import React, { useState } from 'react';
import './LoginSignup.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import email_icon from '../Images/email.png';
import password_icon from '../Images/password.png';
import { useAuth } from '../Contexts/AuthContext';

export const EditPassword = () => {
    const { authUser, isLoggedIn } = useAuth();
    const [email, setEmail] = useState('');
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const isValidEmail = email => /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email);

    function handlePasswordChange(event) {
        event.preventDefault();
        if (!isValidEmail(email)) {
            setError('Please enter a valid email address.');
            return;
        }
        if (newPassword !== confirmNewPassword) {
            setError('The new passwords do not match.');
            return;
        }

        const endPoint = isLoggedIn ? 'change-password' : 'forgot-password';
        const payload = isLoggedIn ? { email: authUser?.email || email, currentPassword, newPassword } : { email, newPassword };

        axios.post(`http://localhost:8081/${endPoint}`, payload)
        .then(response => {
            if (response.data.status === "Password updated successfully") {
                navigate(isLoggedIn ? '/profile-info' : '/login'); // Redirecting based on the user's logged-in status
            } else {
                setError(response.data.status || 'An error occurred. Please try again.');
            }
        })
        .catch(error => {
            if (error.response && error.response.data && error.response.data.status) {
                console.error('Error:', error.response.data.status);
                setError(error.response.data.status);
            } else {
                console.error('Error:', error.message);
                setError('Failed to update password. Please try again later.');
            }
        });
    }

    return (
        <div className='login_container'>
            <div className='login_header'>
                <div className='login_text'>{isLoggedIn ? 'Password Reset' : 'Forgot Password'}</div>
                <div className='login_underline'></div>
            </div>
            <div className="login_inputs">
                <div className="login_input">
                    <img src={email_icon} alt="Email Icon" />
                    <input type="email" value={email} placeholder="Email" onChange={e => setEmail(e.target.value)} readOnly={isLoggedIn && authUser?.email} />
                </div>
                {isLoggedIn && (
                    <div className="login_input">
                        <img src={password_icon} alt="Current Password Icon" />
                        <input type="password" placeholder="Current Password" onChange={e => setCurrentPassword(e.target.value)} />
                    </div>
                )}
                <div className="login_input">
                    <img src={password_icon} alt="New Password Icon" />
                    <input type="password" placeholder="New Password" onChange={e => setNewPassword(e.target.value)} />
                </div>
                <div className="login_input">
                    <img src={password_icon} alt="Confirm New Password Icon" />
                    <input type="password" placeholder="Confirm New Password" onChange={e => setConfirmNewPassword(e.target.value)} />
                </div>
            </div>
            {error && <div className="error_message">{error}</div>}
            <div className="login_submit-container">
                <button type="submit" className="login_submit" onClick={handlePasswordChange}>Update Password</button>
            </div>
        </div>
    );
}

export default EditPassword;
