import React, { useState } from 'react';
import { AiOutlineMail, AiOutlineLock } from 'react-icons/ai';
import { RiLockPasswordLine } from 'react-icons/ri';

const Auth = () => {
    const [isLogIn, setIsLogin] = useState(true);
    const [error, setError] = useState(null);

    const viewLogin = (status) => {
        setError(null);
        setIsLogin(status);
    }

    return (
        <div className='auth-container'>
            <div className="auth-container-box">
                <form>
                    <h2>{isLogIn ? 'Login' : 'Signup'}</h2>
                    <div className="input-group">
                        <AiOutlineMail className="input-icon" />
                        <input type='email' placeholder='Enter Email' />
                    </div>
                    <div className="input-group">
                        <AiOutlineLock className="input-icon" />
                        <input type='password' placeholder='Enter Password' />
                    </div>
                    {!isLogIn && (
                        <div className="input-group">
                            <RiLockPasswordLine className="input-icon" />
                            <input type='password' placeholder='Confirm Password' />
                        </div>
                    )}
                    <input type='submit' value={isLogIn ? 'Login' : 'Signup'} />
                    <p>{error}</p>
                </form>
                <div className='auth-options'>
                    <button onClick={() => viewLogin(false)}>Signup</button>
                    <button onClick={() => viewLogin(true)}>Login</button>
                </div>
            </div>
        </div>
    );
}

export default Auth;
