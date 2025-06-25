import './login.css';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Signup() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();

    const handleSignup = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        try {
            const response = await axios.post('/auth/signup', {
                username,
                email,
                password,
            });

            const { accessToken, user } = response.data;

            localStorage.setItem('user', JSON.stringify({ token: accessToken, user }));
            axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;

            navigate('/Dashboard');
        } catch (err) {
            console.log(err.response);
            if (err.response) {
                setError(err.response.data.error || 'Signup failed');
            } else {
                setError('Network error. Please try again.');
            }
        }
    };

    return (
        <div id='loginContainer' className="loginContainer">
            <div id="loginCard" className='loginCard'>
                <div id="loginHeader" className="loginHeader">Sign Up</div>
                <form onSubmit={handleSignup} style={{ display: 'flex', flexDirection: 'column', gap: '1em' }}>
                    <input
                        type='text'
                        placeholder='Username'
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                    <input
                        type='email'
                        placeholder='Email'
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <input
                        type='password'
                        placeholder='Password'
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    {error && <div style={{ color: 'red' }}>{error}</div>}
                    {success && <div style={{ color: 'green' }}>{success}</div>}
                    <button type='submit'>Sign Up</button>
                </form>
            </div>
        </div>
    );
}
