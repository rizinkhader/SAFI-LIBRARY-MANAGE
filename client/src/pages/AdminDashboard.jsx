import { useState, useEffect } from 'react';
import api from '../api/axios';
import Navbar from '../components/Navbar';

const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState('books');
    const [books, setBooks] = useState([]);
    const [transactions, setTransactions] = useState([]);
    const [requests, setRequests] = useState([]);

    // Book Form State
    const [showBookForm, setShowBookForm] = useState(false);
    const [newBook, setNewBook] = useState({ title: '', author: '', isbn: '', category: '', quantity: 1, coverImage: '' });

    useEffect(() => {
        fetchBooks();
        fetchTransactions();
        fetchRequests();
    }, []);

    const fetchBooks = async () => {
        try { const res = await api.get('/books'); setBooks(res.data); } catch (err) { console.error(err); }
    };
    const fetchTransactions = async () => {
        try { const res = await api.get('/transactions'); setTransactions(res.data); } catch (err) { console.error(err); }
    };
    const fetchRequests = async () => {
        try { const res = await api.get('/requests'); setRequests(res.data); } catch (err) { console.error(err); }
    };

    const handleAddBook = async (e) => {
        e.preventDefault();
        try {
            await api.post('/books', newBook);
            fetchBooks();
            setShowBookForm(false);
            setNewBook({ title: '', author: '', isbn: '', category: '', quantity: 1, coverImage: '' });
        } catch (err) { alert(err.response?.data?.msg || 'Error adding book'); }
    };

    const handleDeleteBook = async (id) => {
        if (window.confirm('Are you sure?')) {
            try { await api.delete(`/books/${id}`); fetchBooks(); } catch (err) { alert('Error deleting book'); }
        }
    };

    const handleIssueBook = async (studentId, bookId) => {
        // Simple prompt for now, in a real app use a modal
        if (!studentId) studentId = prompt("Enter User ID (Object ID) or Student ID to issue to:");
        if (!studentId) return;
        try {
            await api.post('/transactions/issue', { studentId, bookId });
            alert('Book Issued!');
            fetchBooks(); fetchTransactions();
        } catch (err) {
            alert(err.response?.data?.msg || 'Issue Failed');
        }
    };

    const handleReturnBook = async (transactionId) => {
        try {
            const res = await api.post('/transactions/return', { transactionId });
            const fine = res.data.fine;
            alert(`Book Returned! Fine to Pay: ${fine} Rs`);
            fetchTransactions(); fetchBooks();
        } catch (err) {
            alert('Return Failed');
        }
    };

    const handleApproveRequest = async (reqId) => {
        try {
            await api.put(`/requests/${reqId}`, { status: 'approved' });
            fetchRequests();
        } catch (err) { alert('Error'); }
    }

    return (
        <div style={{ minHeight: '100vh', background: 'var(--background)' }}>
            <Navbar />
            <div className="container" style={{ paddingTop: '2rem' }}>
                <h1 className="heading" style={{ marginBottom: '1.5rem' }}>Admin Dashboard</h1>

                <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
                    <button className={`btn ${activeTab === 'books' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setActiveTab('books')}>Manage Books</button>
                    <button className={`btn ${activeTab === 'transactions' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setActiveTab('transactions')}>Transactions</button>
                    <button className={`btn ${activeTab === 'requests' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setActiveTab('requests')}>Requests ({requests.filter(r => r.status === 'pending').length})</button>
                </div>

                {activeTab === 'books' && (
                    <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                            <h2>Library Books</h2>
                            <button className="btn btn-primary" onClick={() => setShowBookForm(!showBookForm)}>+ Add New Book</button>
                        </div>

                        {showBookForm && (
                            <div className="card" style={{ marginBottom: '2rem' }}>
                                <form onSubmit={handleAddBook} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                                    <input placeholder="Title" className="input" value={newBook.title} onChange={e => setNewBook({ ...newBook, title: e.target.value })} required />
                                    <input placeholder="Author" className="input" value={newBook.author} onChange={e => setNewBook({ ...newBook, author: e.target.value })} required />
                                    <input placeholder="ISBN" className="input" value={newBook.isbn} onChange={e => setNewBook({ ...newBook, isbn: e.target.value })} required />
                                    <input placeholder="Category" className="input" value={newBook.category} onChange={e => setNewBook({ ...newBook, category: e.target.value })} required />
                                    <input type="number" placeholder="Quantity" className="input" value={newBook.quantity} onChange={e => setNewBook({ ...newBook, quantity: Number(e.target.value) })} required />
                                    <input placeholder="Cover Image URL" className="input" value={newBook.coverImage} onChange={e => setNewBook({ ...newBook, coverImage: e.target.value })} />
                                    <button type="submit" className="btn btn-primary" style={{ gridColumn: '1 / -1' }}>Save Book</button>
                                </form>
                            </div>
                        )}

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
                            {books.map(book => (
                                <div key={book._id} className="card">
                                    {book.coverImage && <img src={book.coverImage} alt={book.title} style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '8px', marginBottom: '1rem' }} />}
                                    <h3 style={{ margin: '0 0 0.5rem 0' }}>{book.title}</h3>
                                    <p style={{ color: 'var(--text-muted)', margin: '0 0 1rem 0' }}>{book.author}</p>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: '1rem' }}>
                                        <span>Inv: {book.availableCount}/{book.quantity}</span>
                                        <span style={{ background: '#EEF2FF', padding: '2px 8px', borderRadius: '4px', color: 'var(--primary)' }}>{book.category}</span>
                                    </div>
                                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                                        <button className="btn btn-secondary" style={{ flex: 1, fontSize: '0.8rem' }} onClick={() => handleIssueBook(null, book._id)}>Issue</button>
                                        <button className="btn btn-danger" style={{ flex: 1, fontSize: '0.8rem' }} onClick={() => handleDeleteBook(book._id)}>Delete</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {activeTab === 'transactions' && (
                    <div className="card">
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ background: '#F9FAFB', textAlign: 'left' }}>
                                    <th style={{ padding: '1rem' }}>Student</th>
                                    <th style={{ padding: '1rem' }}>Book</th>
                                    <th style={{ padding: '1rem' }}>Issue Date</th>
                                    <th style={{ padding: '1rem' }}>Due Date</th>
                                    <th style={{ padding: '1rem' }}>Status</th>
                                    <th style={{ padding: '1rem' }}>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {transactions.map(t => (
                                    <tr key={t._id} style={{ borderBottom: '1px solid var(--border)' }}>
                                        <td style={{ padding: '1rem' }}>{t.user?.name}</td>
                                        <td style={{ padding: '1rem' }}>{t.book?.title}</td>
                                        <td style={{ padding: '1rem' }}>{new Date(t.issueDate).toLocaleDateString()}</td>
                                        <td style={{ padding: '1rem' }}>{new Date(t.dueDate).toLocaleDateString()}</td>
                                        <td style={{ padding: '1rem' }}>
                                            <span style={{
                                                padding: '4px 8px', borderRadius: '4px', fontSize: '0.8rem',
                                                background: t.status === 'returned' ? '#D1FAE5' : t.status === 'overdue' ? '#FEE2E2' : '#EFF6FF',
                                                color: t.status === 'returned' ? '#065F46' : t.status === 'overdue' ? '#B91C1C' : '#1E40AF'
                                            }}>
                                                {t.status}
                                            </span>
                                        </td>
                                        <td style={{ padding: '1rem' }}>
                                            {t.status === 'issued' && (
                                                <button className="btn btn-secondary" style={{ padding: '4px 8px', fontSize: '0.8rem' }} onClick={() => handleReturnBook(t._id)}>Return</button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {activeTab === 'requests' && (
                    <div className="card">
                        <h3>New Book Requests</h3>
                        {requests.map(r => (
                            <div key={r._id} style={{ borderBottom: '1px solid var(--border)', padding: '1rem 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div>
                                    <strong>{r.bookDetails?.title}</strong> by {r.bookDetails?.author}
                                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Requested by {r.user?.name} on {new Date(r.requestDate).toLocaleDateString()}</div>
                                </div>
                                <div>
                                    {r.status === 'pending' ? (
                                        <button className="btn btn-primary" style={{ padding: '0.5rem 1rem' }} onClick={() => handleApproveRequest(r._id)}>Approve</button>
                                    ) : (
                                        <span>{r.status}</span>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}

            </div>
        </div>
    );
};

export default AdminDashboard;
