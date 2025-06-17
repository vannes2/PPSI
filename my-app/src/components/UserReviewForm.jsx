import React, { useState } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import './UserReviewForm.css'; // File CSS untuk styling pop-up

// Komponen kecil untuk input bintang
const StarInput = ({ rating, setRating }) => {
    return (
        <div className="star-input-user">
            {[1, 2, 3, 4, 5].map(star => (
                <span
                    key={star}
                    className={star <= rating ? 'active' : ''}
                    onClick={() => setRating(star)}
                >
                    &#9733;
                </span>
            ))}
        </div>
    );
};

// Komponen Utama Pop-up
const UserReviewForm = ({ userId, lawyer, interaction, interactionType, onClose, onSuccess }) => {
    const [rating, setRating] = useState(5);
    const [komentar, setKomentar] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError('');

        const reviewData = {
            user_id: userId,
            pengacara_id: lawyer.id,
            rating,
            komentar
        };

        if (interactionType === 'kasus') {
            reviewData.kasus_id = interaction.id;
        } else if (interactionType === 'konsultasi') {
            reviewData.konsultasi_id = interaction.id;
        }

        try {
            await axios.post('http://localhost:5000/api/reviews', reviewData);
            onSuccess(interaction.id);
            onClose();
        } catch (err) {
            const errorMsg = err.response?.data?.message || 'Gagal mengirim ulasan. Mungkin Anda sudah pernah memberi ulasan.';
            setError(errorMsg);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h3>Beri Ulasan untuk {lawyer.nama}</h3>
                    <button onClick={onClose} className="close-button">&times;</button>
                </div>
                <div className="modal-body">
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>Rating Anda</label>
                            <StarInput rating={rating} setRating={setRating} />
                        </div>
                        <div className="form-group">
                            <label htmlFor="komentar">Ulasan Anda</label>
                            <textarea
                                id="komentar"
                                rows="5"
                                placeholder={`Bagaimana pengalaman Anda dengan ${lawyer.nama}?`}
                                value={komentar}
                                onChange={(e) => setKomentar(e.target.value)}
                                required
                            ></textarea>
                        </div>
                        {error && <p className="error-message">{error}</p>}
                        <div className="modal-footer">
                            <button type="button" className="btn-secondary" onClick={onClose} disabled={isSubmitting}>
                                Batal
                            </button>
                            <button type="submit" className="btn-primary" disabled={isSubmitting}>
                                {isSubmitting ? 'Mengirim...' : 'Kirim Ulasan'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

// Validasi tipe data props untuk mencegah error
UserReviewForm.propTypes = {
    userId: PropTypes.number.isRequired,
    lawyer: PropTypes.object.isRequired,
    interaction: PropTypes.object.isRequired,
    interactionType: PropTypes.oneOf(['kasus', 'konsultasi']).isRequired,
    onClose: PropTypes.func.isRequired,
    onSuccess: PropTypes.func.isRequired,
};

export default UserReviewForm;