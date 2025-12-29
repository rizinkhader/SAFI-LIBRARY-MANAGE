import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        studentId: '',
        department: '',
        role: 'student' // default
    });
    const { register } = useAuth();
    const navigate = useNavigate();
    const [error, setError] = useState('');

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await register(formData);
            navigate('/student');
        } catch (err) {
            setError(err.response?.data?.msg || 'Registration failed');
        }
    };

    return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #f0f2f5 0%, #e0e7ff 100%)' }}>
            <div className="card" style={{ width: '100%', maxWidth: '500px' }}>
                <h2 className="heading text-gradient" style={{ textAlign: 'center', fontSize: '2rem', marginBottom: '0.5rem' }}>Join SAFI</h2>
                <p style={{ textAlign: 'center', marginBottom: '2rem', color: 'var(--text-muted)' }}>Create your student account</p>

                {error && <div style={{ color: 'var(--secondary)', marginBottom: '1rem', textAlign: 'center' }}>{error}</div>}

                <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1rem' }}>
                    <input type="text" name="name" placeholder="Full Name" className="input" onChange={handleChange} required />
                    <input type="email" name="email" placeholder="Email Address" className="input" onChange={handleChange} required />
                    <input type="password" name="password" placeholder="Password" className="input" onChange={handleChange} required />

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <input type="text" name="studentId" placeholder="Student ID" className="input" onChange={handleChange} required />
                        <input type="text" name="department" placeholder="Department" className="input" onChange={handleChange} required />
                    </div>

                    <button type="submit" className="btn btn-primary" style={{ marginTop: '1rem' }}>
                        Register
                    </button>
                </form>

                <p style={{ textAlign: 'center', marginTop: '1.5rem', color: 'var(--text-muted)' }}>
                    Already have an account? <Link to="/login" style={{ color: 'var(--primary)', fontWeight: '600' }}>Login</Link>
                </p>
            </div>
        </div>
    );
};

export default Register;
