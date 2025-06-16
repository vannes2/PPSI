import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../CSS_Admin/AdminReview.css';

const StarRating = ({ rating }) => {
    const stars = Array.from({ length: 5 }, (_, i) => (
        <span key={i} style={{ color: i < rating ? '#ffc107' : '#e4e5e9' }}>&#9733;</span>
    ));
    return <div>{stars}</div>;
};

const AdminReviewPage = () => {
    const [allReviews, setAllReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [editingReviewId, setEditingReviewId] = useState(null);
    const [editFormData, setEditFormData] = useState({ rating: '', komentar: '' });

    const [showAddForm, setShowAddForm] = useState(false);
    const [newReviewData, setNewReviewData] = useState({
        pengacara_id: '',
        user_id: '',
        rating: 5,
        komentar: ''
    });

    useEffect(() => {
        const controller = new AbortController();
        const fetchAllReviews = async () => {
            try {
                setLoading(true);
                // Hanya mengambil data ulasan
                const response = await axios.get('http://localhost:5000/api/reviews/all', { signal: controller.signal });
                setAllReviews(response.data);
            } catch (err) {
                if (err.name !== 'CanceledError') {
                    setError('Gagal memuat data ulasan.');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchAllReviews();
        return () => { controller.abort(); };
    }, []);

    const handleNewReviewChange = (e) => {
        const { name, value } = e.target;
        setNewReviewData(prev => ({ ...prev, [name]: value }));
    };

    const handleNewReviewSubmit = async (e) => {
        e.preventDefault();
        if (!newReviewData.pengacara_id || !newReviewData.user_id) {
            alert('Silakan isi ID Pengacara dan ID Pengguna.');
            return;
        }
        try {
            const response = await axios.post('http://localhost:5000/api/reviews/admin-create', newReviewData);
            setAllReviews(prev => [response.data.review, ...prev]);
            setShowAddForm(false);
            setNewReviewData({ pengacara_id: '', user_id: '', rating: 5, komentar: '' });
            alert('Ulasan baru berhasil ditambahkan!');
        } catch (error) {
            alert('Gagal menambahkan ulasan baru.');
        }
    };

    const filteredReviews = allReviews.filter(review => {
        const term = searchTerm.toLowerCase();
        const hasKomentar = review.komentar && review.komentar.toLowerCase().includes(term);
        const hasUserName = review.user_name && review.user_name.toLowerCase().includes(term);
        const hasPengacaraName = review.pengacara_name && review.pengacara_name.toLowerCase().includes(term);
        return hasKomentar || hasUserName || hasPengacaraName;
    });

    // ... (Fungsi handleEdit, handleCancel, handleUpdate, handleDelete tetap sama persis)
    const handleEditClick = (review) => { setEditingReviewId(review.id); setEditFormData({ rating: review.rating, komentar: review.komentar || '' }); };
    const handleCancelClick = () => { setEditingReviewId(null); };
    const handleUpdateSubmit = async (reviewId) => { try { const response = await axios.put(`http://localhost:5000/api/reviews/${reviewId}`, editFormData); const updatedReview = response.data.review; setAllReviews(prev => prev.map(review => (review.id === reviewId ? { ...review, ...updatedReview } : review))); setEditingReviewId(null); alert('Ulasan berhasil diperbarui.'); } catch (error) { alert('Gagal memperbarui ulasan.'); } };
    const handleEditFormChange = (e) => { const { name, value } = e.target; const processedValue = name === 'rating' ? parseInt(value, 10) || 0 : value; setEditFormData(prev => ({ ...prev, [name]: processedValue })); };
    const handleDelete = async (reviewId) => { if (window.confirm('Apakah Anda yakin?')) { try { await axios.delete(`http://localhost:5000/api/reviews/${reviewId}`); setAllReviews(prev => prev.filter(review => review.id !== reviewId)); alert('Ulasan berhasil dihapus.'); } catch (err) { alert('Gagal menghapus ulasan.'); } } };


    if (loading) return <p style={{ textAlign: 'center' }}>Memuat data...</p>;
    if (error) return <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>;

    return (
        <div className="admin-review-container">
            <h1>Manajemen Ulasan Pengacara</h1>
            <button onClick={() => setShowAddForm(!showAddForm)} className="add-review-button">
                {showAddForm ? 'Tutup Form Tambah' : 'Tambah Ulasan Baru'}
            </button>

            {showAddForm && (
                <div className="add-form-container">
                    <h3>Form Tambah Ulasan Manual</h3>
                    <form onSubmit={handleNewReviewSubmit}>
                        <div className="form-grid">
                            <input type="number" name="pengacara_id" placeholder="ID Pengacara" value={newReviewData.pengacara_id} onChange={handleNewReviewChange} required />
                            <input type="number" name="user_id" placeholder="ID Pengguna" value={newReviewData.user_id} onChange={handleNewReviewChange} required />
                            <input type="number" name="rating" min="1" max="5" value={newReviewData.rating} onChange={handleNewReviewChange} />
                        </div>
                        <textarea name="komentar" placeholder="Tulis komentar..." value={newReviewData.komentar} onChange={handleNewReviewChange} rows="3"></textarea>
                        <button type="submit">Simpan Ulasan</button>
                    </form>
                </div>
            )}

            <input 
                type="text"
                placeholder="Cari ulasan..."
                className="search-input"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="table-container">
                 {/* ... (Isi tabel JSX tetap sama persis seperti kode sebelumnya) ... */}
                 <form onSubmit={(e) => e.preventDefault()}><table><thead><tr><th>ID</th><th>Pengacara</th><th>Pengguna</th><th>Rating</th><th>Komentar</th><th>Tanggal</th><th style={{width: '180px'}}>Aksi</th></tr></thead><tbody>{filteredReviews.map(review => (<tr key={review.id}>{(editingReviewId === review.id) ? (<><td>{review.id}</td><td>{review.pengacara_name}</td><td>{review.user_name}</td><td><input type="number" name="rating" min="1" max="5" value={editFormData.rating} onChange={handleEditFormChange} style={{width: '50px'}} /></td><td><textarea name="komentar" value={editFormData.komentar} onChange={handleEditFormChange} rows="3" style={{width: '100%'}}></textarea></td><td>{new Date(review.tanggal_review).toLocaleDateString('id-ID')}</td><td><button type="button" className="save-button" onClick={() => handleUpdateSubmit(review.id)}>Simpan</button><button type="button" className="cancel-button" onClick={handleCancelClick}>Batal</button></td></>) : (<><td>{review.id}</td><td>{review.pengacara_name}</td><td>{review.user_name}</td><td><StarRating rating={review.rating} /></td><td>{review.komentar || '-'}</td><td>{new Date(review.tanggal_review).toLocaleDateString('id-ID')}</td><td><button type="button" className="edit-button" onClick={() => handleEditClick(review)}>Edit</button><button type="button" className="delete-button" onClick={() => handleDelete(review.id)}>Hapus</button></td></>)}</tr>))}</tbody></table></form>
            </div>
        </div>
    );
};

export default AdminReviewPage;