import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav style={{ background: 'var(--surface)', borderBottom: '1px solid var(--border)', padding: '1rem 0' }}>
            <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Link to="/" className="heading" style={{ fontSize: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem', textDecoration: 'none' }}>
                    <img src="/safi-logo.png" alt="SAFI Logo" style={{ height: '60px', objectFit: 'contain' }} />
                </Link>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                    {user ? (
                        <>
                            <span style={{ color: 'var(--text-muted)' }}>Hello, <strong>{user.name}</strong></span>
                            <button onClick={handleLogout} className="btn btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}>Logout</button>
                        </>
                    ) : (
                        <Link to="/login" className="btn btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}>Login</Link>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
