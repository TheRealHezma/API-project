// // src/components/Reviews/EditReviewModal.jsx


import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { editReview } from '../../store/reviews';
import './EditReviewModal.css';

const EditReviewModal = ({ review, closeModal }) => {
    const dispatch = useDispatch();
    const [reviewText, setReviewText] = useState(review.review);
    const [stars, setStars] = useState(review.stars);
    const [hover, setHover] = useState(0);
    const [errors, setErrors] = useState([]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors([]);

        const updatedReview = {
            ...review,
            review: reviewText,
            stars,
        };

        const response = await dispatch(editReview(updatedReview));

        if (response.errors) {
            setErrors(response.errors);
        } else {
            closeModal();
        }
    };

    return (
        <div className="edit-review-modal">
            <h2>Edit Your Review</h2>
            <form onSubmit={handleSubmit}>
                <ul>
                    {errors.map((error, idx) => (
                        <li key={idx}>{error}</li>
                    ))}
                </ul>
                <textarea
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                    required
                />
                <div className="star-rating">
                    {[1, 2, 3, 4, 5].map((num) => (
                        <span
                            key={num}
                            onMouseEnter={() => setHover(num)}
                            onMouseLeave={() => setHover(0)}
                            onClick={() => setStars(num)}
                            className={`star ${stars >= num || hover >= num ? 'active' : ''}`}
                        >
                            {stars >= num || hover >= num ? '★' : '☆'}
                        </span>
                    ))}
                </div>
                <button type="submit">Update Review</button>
                <button type="button" onClick={closeModal}>Cancel</button>
            </form>
        </div>
    );
};

export default EditReviewModal;
