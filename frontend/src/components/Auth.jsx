import React, { useState } from 'react';
import { AiOutlineMail, AiOutlineLock } from 'react-icons/ai';
import { RiLockPasswordLine } from 'react-icons/ri';
import { useCookies } from 'react-cookie';

const Auth = () => {
    const [cookies, setCookie] = useCookies(['Email', 'AuthToken']);
    const [isLogIn, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');

    const viewLogin = (status) => {
        setError('');
        setIsLogin(status);
    };

    const handleSubmit = async (e, endpoint) => {
        e.preventDefault();
        if (!isLogIn && password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        try {
            const response = await fetch(`http://localhost:8000/${endpoint}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();
            if (response.ok) {
                setCookie('Email', data.email);
                setCookie('AuthToken', data.token);
                window.location.reload();
            } else {
                setError(data.detail || 'Something went wrong');
            }
        } catch (err) {
            console.error('Error:', err);
            setError('Something went wrong');
        }
    };

    return (
        <div className='auth-container'>
            <div className="auth-container-box">
                <form>
                    <h2>{isLogIn ? 'Login' : 'Signup'}</h2>
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
                    <button onClick={() => viewLogin(false)}>Signup</button>
                    <button onClick={() => viewLogin(true)}>Login</button>
                </div>
            </div>
        </div>
    );
};

export default Auth;
