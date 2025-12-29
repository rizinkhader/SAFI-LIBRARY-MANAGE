import { useState, useEffect } from 'react';
import api from '../api/axios';
import Navbar from '../components/Navbar';

const StudentDashboard = () => {
    const [myTransactions, setMyTransactions] = useState([]);
    const [books, setBooks] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [showRequestForm, setShowRequestForm] = useState(false);
    const [requestData, setRequestData] = useState({ title: '', author: '', additionalInfo: '' });

    useEffect(() => {
        fetchMyTransactions();
        fetchBooks();
    }, []);

    const fetchMyTransactions = async () => {
        try { const res = await api.get('/transactions/me'); setMyTransactions(res.data); } catch (err) { console.error(err); }
    };
    const fetchBooks = async () => {
        try { const res = await api.get('/books'); setBooks(res.data); } catch (err) { console.error(err); }
    };

    const handleRequestBook = async (e) => {
        e.preventDefault();
        try {
            await api.post('/requests', requestData);
            alert('Request Submitted!');
            setShowRequestForm(false);
            setRequestData({ title: '', author: '', additionalInfo: '' });
        } catch (err) { alert('Error requesting book'); }
    }

    const handleReserveBook = async (bookId) => {
        if (!window.confirm('Do you want to reserve this book to pick up later?')) return;
        try {
            await api.post('/transactions/reserve', { bookId });
            alert('Book Reserved Successfully! Please pick it up within 2 days.');
            fetchBooks();
            fetchMyTransactions();
        } catch (err) {
            alert(err.response?.data?.msg || 'Error reserving book');
        }
    }

    const filteredBooks = books.filter(b => b.title.toLowerCase().includes(searchTerm.toLowerCase()) || b.author.toLowerCase().includes(searchTerm.toLowerCase()));

    // Calculate total fine
    const totalFine = myTransactions.reduce((acc, curr) => acc + (curr.fine || 0), 0);

    return (
        <div style={{ minHeight: '100vh', background: 'var(--background)' }}>
            <Navbar />
            <div className="container" style={{ paddingTop: '2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                    <h1 className="heading">My Library</h1>
                    <div className="card" style={{ padding: '0.8rem 1.5rem', background: totalFine > 0 ? '#FEE2E2' : '#D1FAE5', color: totalFine > 0 ? '#B91C1C' : '#065F46', border: 'none' }}>
                        Fines Due: <strong>₹{totalFine}</strong>
                    </div>
                </div>

                {/* My Books Section */}
                <h3 className="heading" style={{ marginBottom: '1rem' }}>My Borrowed Books</h3>
                {myTransactions.filter(t => t.status === 'issued').length === 0 ? (
                    <p style={{ color: 'var(--text-muted)' }}>You have no books currently borrowed.</p>
                ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
                        {myTransactions.filter(t => t.status === 'issued').map(t => (
                            <div key={t._id} className="card" style={{ borderLeft: '4px solid var(--primary)' }}>
                                <h3>{t.book?.title}</h3>
                                <p style={{ color: 'var(--text-muted)' }}>Due: {new Date(t.dueDate).toLocaleDateString()}</p>
                                <div style={{ marginTop: '1rem', fontSize: '0.9rem' }}>
                                    {new Date(t.dueDate) < new Date() ? <span style={{ color: 'red' }}>Overdue!</span> : <span style={{ color: 'green' }}>On Time</span>}
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Browse Books Section */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', marginTop: '2rem' }}>
                    <h3 className="heading">Browse Collection</h3>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <input
                            placeholder="Search books..."
                            className="input"
                            style={{ width: '300px' }}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <button className="btn btn-secondary" onClick={() => setShowRequestForm(true)}>Request New Book</button>
                    </div>
                </div>

                {showRequestForm && (
                    <div className="card" style={{ marginBottom: '2rem', maxWidth: '600px', margin: '0 auto 2rem auto' }}>
                        <h3>Request a Book</h3>
                        <form onSubmit={handleRequestBook} style={{ display: 'grid', gap: '1rem' }}>
                            <input placeholder="Book Title" className="input" value={requestData.title} onChange={e => setRequestData({ ...requestData, title: e.target.value })} required />
                            <input placeholder="Author" className="input" value={requestData.author} onChange={e => setRequestData({ ...requestData, author: e.target.value })} required />
                            <textarea placeholder="Additional Info" className="input" value={requestData.additionalInfo} onChange={e => setRequestData({ ...requestData, additionalInfo: e.target.value })} />
                            <div style={{ display: 'flex', gap: '1rem' }}>
                                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>Submit Request</button>
                                <button type="button" className="btn btn-secondary" onClick={() => setShowRequestForm(false)}>Cancel</button>
                            </div>
                        </form>
                    </div>
                )}

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1.5rem', paddingBottom: '3rem' }}>
                    {filteredBooks.map(book => (
                        <div key={book._id} className="card" style={{ transition: 'transform 0.2s' }}>
                            {book.coverImage && <img src={book.coverImage} alt={book.title} style={{ width: '100%', height: '150px', objectFit: 'cover', borderRadius: '8px', marginBottom: '0.8rem' }} />}
                            <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1.1rem' }}>{book.title}</h4>
                            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>{book.author}</p>
                            <span style={{ fontSize: '0.8rem', background: '#F3F4F6', padding: '2px 6px', borderRadius: '4px', marginTop: '0.5rem', display: 'inline-block' }}>{book.category}</span>
                            <div style={{ marginTop: '0.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ fontSize: '0.9rem', color: book.availableCount > 0 ? 'green' : 'red' }}>
                                    {book.availableCount > 0 ? 'Available' : 'Out of Stock'}
                                </span>
                                {book.availableCount > 0 && (
                                    <button className="btn btn-primary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }} onClick={() => handleReserveBook(book._id)}>
                                        Book Now
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

            </div>
        </div>
    );
};

export default StudentDashboard;
