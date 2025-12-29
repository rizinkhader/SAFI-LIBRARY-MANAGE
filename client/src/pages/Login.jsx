import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const user = await login(email, password);
            if (user.role === 'admin') navigate('/admin');
            else navigate('/student');
        } catch (err) {
            setError(err.response?.data?.msg || 'Login failed');
        }
    };

    return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #f0f2f5 0%, #e0e7ff 100%)' }}>
            <div className="card" style={{ width: '100%', maxWidth: '400px' }}>
                <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                    <img src="/safi-logo.png" alt="SAFI Logo" style={{ maxWidth: '250px', height: 'auto' }} />
                </div>
                <h3 style={{ textAlign: 'center', marginBottom: '2rem', color: 'var(--text-muted)' }}>Welcome Back</h3>

                {error && <div style={{ color: 'var(--secondary)', marginBottom: '1rem', textAlign: 'center' }}>{error}</div>}

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <input
                        type="email"
                        placeholder="Email Address"
                        className="input"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        className="input"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <button type="submit" className="btn btn-primary" style={{ marginTop: '1rem' }}>
                        Login
                    </button>
                </form>

                <p style={{ textAlign: 'center', marginTop: '1.5rem', color: 'var(--text-muted)' }}>
                    New Student? <Link to="/register" style={{ color: 'var(--primary)', fontWeight: '600' }}>Create Account</Link>
                </p>
            </div>
        </div>
    );
};

export default Login;
