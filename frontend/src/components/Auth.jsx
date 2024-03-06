import React, { useState } from 'react';
import { AiOutlineMail, AiOutlineLock } from 'react-icons/ai';
import { RiLockPasswordLine } from 'react-icons/ri';
import { FaUser } from 'react-icons/fa'; // Import FaUser icon

import { useCookies } from 'react-cookie';

const Auth = ({ onSignout }) => {
    const [cookies, setCookie, removeCookie] = useCookies(['Email', 'AuthToken']);
    const [isLogIn, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [userName, setUserName] = useState('');
    const [error, setError] = useState('');

    const viewLogin = (status) => {
        setError('');
        setIsLogin(status);
    };

    const handleSignout = () => {
        // Remove cookies and call onSignout function
        removeCookie('Email');
        removeCookie('AuthToken');
        onSignout();
    };

    const handleSubmit = async (e, endpoint) => {
        e.preventDefault();
        if (!isLogIn && password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        try {
            const data = {
                email,
                password,
                user_name: userName // Include user_name in the data sent to the server
            };

            const response = await fetch(`http://localhost:8000/${endpoint}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });

            if (response.ok) {
                const responseData = await response.json();
                setCookie('Email', responseData.email);
                setCookie('AuthToken', responseData.token);
                window.location.reload();
            } else {
                const responseData = await response.json();
                setError(responseData.message || 'Invalid Email or Password');
            }
        } catch (err) {
            console.error('Error:', err);
            setError('Invalid Email or Password');
        }
    };

    return (
        <div className='auth-container'>
            <div className="auth-container-box">
                <form>
                    <h2>{isLogIn ? 'Login' : 'Signup'}</h2>
                    {!isLogIn && (
                        <div className="input-group">
                            <FaUser className="input-icon" />
                            <input type='text' placeholder='Enter Username' value={userName} onChange={(e) => setUserName(e.target.value)}/>
                        </div>
                    )}
                    <div className="input-group">
                        <AiOutlineMail className="input-icon" />
                        <input type='email' placeholder='Enter Email' value={email} onChange={(e) => setEmail(e.target.value)} />
                    </div>
                    <div className="input-group">
                        <AiOutlineLock className="input-icon" />
                        <input type='password' placeholder='Enter Password' value={password} onChange={(e) => setPassword(e.target.value)} />
                    </div>
                    {!isLogIn && (
                        <div className="input-group">
                            <RiLockPasswordLine className="input-icon" />
                            <input type='password' placeholder='Confirm Password' value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                        </div>
                    )}
                    
                    <input type='submit' value={isLogIn ? 'Login' : 'Signup'} onClick={(e) => handleSubmit(e, isLogIn ? 'login' : 'signup')} />
                    <p>{error}</p>
                </form>
                <div className='auth-options'>
                    {cookies.Email && (
                        <button onClick={handleSignout}>Signout</button>
                    )}
                    <p className="auth-switch" onClick={() => viewLogin(!isLogIn)} style={{ margin: '10px', padding: '10px', display: 'flex', cursor: 'pointer', alignItems: 'center' }}>
                        {isLogIn ?
                            <span>
                                <span style={{ color: '#363636' }}>Don't have an account?</span> <span style={{ color: '#3d79f3' }}>Sign Up</span>
                            </span>
                            :
                            <span>
                                <span style={{ color: '#363636' }}>Already have an account?</span> <span style={{ color: '#3d79f3' }}>Login</span>
                            </span>
                        }
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Auth;
