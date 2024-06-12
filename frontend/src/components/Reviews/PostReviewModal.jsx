//frontend/src/components/Reviews/PostReviewModal.jsx

import { useDispatch, useSelector } from 'react-redux';
import { useState } from 'react';
import { useModal } from '../../context/Modal';
import { getCurrentSpotReviews, createReview } from '../../store/reviews';
import { getSpotDetail } from '../../store/spots';
import './PostReviewModal.css';

function PostReviewModal({ spotId }) {
    const dispatch = useDispatch();
    const [review, setReview] = useState('');
    const [rating, setRating] = useState(0);
    const [hover, setHover] = useState(0);
    const [errors, setErrors] = useState({});
    const sessionUser = useSelector(state => state.session.user);
    const { closeModal } = useModal();

    const toggle = () => {
        if (review.length < 10 || rating === 0) {
            return true;
        }
        return false;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("Submitting review..."); // Debugging log

        const payload = {
            userId: sessionUser.id,
            spotId: spotId,
            review,
            stars: rating
        };

        try {
            // Dispatch createReview thunk to add new review
            await dispatch(createReview(payload, spotId));
            // Dispatch getCurrentSpotReviews to fetch updated reviews for the current spot
            await dispatch(getCurrentSpotReviews(spotId));
            // Dispatch getSpotDetail to fetch updated spot details
            await dispatch(getSpotDetail(spotId));
            // Close the modal
            closeModal();
        } catch (error) {
            // Handle errors if any
            if (error && error.message) {
                setErrors({ message: error.message });
            }
        }
    };

    return (
        <div className="review-modal">
            <h1>How was your stay?</h1>
            {errors.message && <p className="errors">{errors.message}</p>}
            <textarea
                className="text-area"
                placeholder='Leave your review here...'
                value={review}
                onChange={(e) => setReview(e.target.value)}
            ></textarea>
            <div className="star-area">
                {[1, 2, 3, 4, 5].map((num) => (
                    <span
                        key={num}
                        onMouseEnter={() => setHover(num)}
                        onMouseLeave={() => setHover(0)}
                        onClick={() => setRating(num)}
                        className="star"
                    >
                        {(hover || rating) >= num ? <span>&#9733;</span> : <span>&#9734;</span>}
                    </span>
                ))}
                Stars
            </div>
            <div className="buttons-area">
                {/* Disable button if review is too short or rating is not selected */}
                <button disabled={toggle()} className="submit-review-button" onClick={handleSubmit}>Submit Your Review</button>
            </div>
        </div>
    );
}

export default PostReviewModal;



// import { useDispatch, useSelector } from 'react-redux';
// import { useState } from 'react';
// import { useModal } from '../../context/Modal';
// import { getCurrentSpotReviews, createReview } from '../../store/reviews';
// import { getSpotDetail } from '../../store/spots';
// import './PostReviewModal.css';

// function PostReviewModal({ spotId }) {
//     const dispatch = useDispatch();
//     const [review, setReview] = useState('');
//     const [rating, setRating] = useState(0);
//     const [hover, setHover] = useState(0);
//     const [errors, setErrors] = useState({});
//     const sessionUser = useSelector(state => state.session.user);
//     const { closeModal } = useModal();

//     const isSubmitDisabled = review.length < 10 || rating === 0;

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         console.log("Submitting review..."); // Debugging log

//         const payload = {
//             userId: sessionUser.id,
//             spotId: spotId,
//             review,
//             stars: rating
//         };

//         try {
//             const response = await dispatch(createReview(payload, spotId));
//             console.log("Review submitted:", response); // Debugging log

//             await dispatch(getCurrentSpotReviews(spotId));
//             await dispatch(getSpotDetail(spotId));
//             closeModal();
//         } catch (res) {
//             const data = await res.json();
//             if (data && data.message) {
//                 setErrors({ message: data.message });
//             }
//         }
//     };

//     return (
//         <div className="review-modal">
//             <h1>How was your stay?</h1>
//             {errors.message && <p className="errors">{errors.message}</p>}
//             <textarea
//                 className="text-area"
//                 placeholder='Leave your review here...'
//                 value={review}
//                 onChange={(e) => setReview(e.target.value)}
//             ></textarea>
//             <div className="star-area">
//                 {[1, 2, 3, 4, 5].map((num) => (
//                     <span
//                         key={num}
//                         onMouseEnter={() => setHover(num)}
//                         onMouseLeave={() => setHover(0)}
//                         onClick={() => setRating(num)}
//                         className="star"
//                     >
//                         {(hover || rating) >= num ? <span>&#9733;</span> : <span>&#9734;</span>}
//                     </span>
//                 ))}
//                 Stars
//             </div>
//             <div className="buttons-area">
//                 <button
//                     disabled={isSubmitDisabled}
//                     className="submit-review-button"
//                     onClick={handleSubmit}
//                 >
//                     Submit Your Review
//                 </button>
//             </div>
//         </div>
//     );
// }

// export default PostReviewModal;

/////////////////////////////////////////////////////
// import { useDispatch, useSelector } from 'react-redux';
// import { useState } from 'react';
// import { useModal } from '../../context/Modal';
// import { getCurrentSpotReviews, createReview } from '../../store/reviews';
// import { getSpotDetail } from '../../store/spots';
// import './PostReviewModal.css';

// function PostReviewModal({ spotId }) {
//     const dispatch = useDispatch();
//     const [review, setReview] = useState('');
//     const [rating, setRating] = useState(0);
//     const [hover, setHover] = useState(0);
//     const [errors, setErrors] = useState({});
//     const sessionUser = useSelector(state => state.session.user);
//     const { closeModal } = useModal();

//     const toggle = () => {
//         if (review.length < 10 || rating === 0) {
//             return true
//         }
//         return false
//     }

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         console.log("Submitting review..."); // Debugging log

//         const payload = {
//             userId: sessionUser.id,
//             spotId: spotId,
//             review,
//             stars: rating
//         };

//         return dispatch((createReview(payload, spotId)))
//             .then(() => dispatch(getCurrentSpotReviews(spotId)))
//             .then(() => dispatch(getSpotDetail(spotId)))
//             .then(closeModal)
//             .catch(async (res) => {
//                 const data = await res.json();
//                 if (data && data.message) {
//                     setErrors({ message: data.message })
//                 }
//             })
//     };

//     return (
//         <div className="review-modal">
//             <h1>How was your stay?</h1>
//             {errors.message && <p className="errors">{errors.message}</p>}
//             <textarea
//                 className="text-area"
//                 placeholder='Leave your review here...'
//                 value={review}
//                 onChange={(e) => setReview(e.target.value)}
//             ></textarea>
//             <div className="star-area">
//                 {[1, 2, 3, 4, 5].map((num) => (
//                     <span
//                         key={num}
//                         onMouseEnter={() => setHover(num)}
//                         onMouseLeave={() => setHover(0)}
//                         onClick={() => setRating(num)}
//                         className="star"
//                     >
//                         {(hover || rating) >= num ? <span>&#9733;</span> : <span>&#9734;</span>}
//                     </span>
//                 ))}
//                 Stars
//             </div>
//             <div className="buttons-area">
//                 <button disabled={toggle()} className="submit-review-button" onClick={handleSubmit}>Submit Your Review</button>
//                 {/* <button className="submit-review-button" onClick={handleSubmit}>Submit Your Review</button> */}

//             </div>
//         </div>
//     );
// }

// export default PostReviewModal;
///////////////////////////////////////////////////////


// import { useDispatch, useSelector } from 'react-redux';
// import { useState } from 'react';
// import { useModal } from '../../context/Modal';
// import { getCurrentSpotReviews, createReview } from '../../store/reviews';
// import { getSpotDetail } from '../../store/spots';
// import './PostReviewModal.css'


// function PostReviewModal ({ spotId }) {
//     const dispatch = useDispatch();

//     const [review, setReview ] = useState('');
//     const [rating, setRating ] = useState(0);
//     const [hover, setHover] = useState(0)
//     const [errors, setErrors ] = useState({})

//     const sessionUser = useSelector(state => state.session.user)

//     const toggle = () => {
//         if (review.length < 10 || rating === 0 ) {
//           return true
//         }
//         return false
//       }

//     const { closeModal } = useModal();

//     const handleSubmit = (e) => {
//         e.preventDefault();

//         const payload = {
//             userId: sessionUser.id,
//             spotId: spotId,
//             review,
//             stars: rating
//         }

//         return dispatch((createReview(payload, spotId)))
//         .then(() => dispatch(getCurrentSpotReviews(spotId)))
//         .then(() => dispatch(getSpotDetail(spotId)))
//         .then(closeModal)
//         .catch(async (res) => {
//             const data = await res.json();
//             if (data && data.message) {
//                 setErrors({message: data.message})
//             }
//         })
//       };



//     return (
//         <>
//         <div className={`review-modal`}>
//         <h1>How was your stay?</h1>
//         {errors.message && <p className={`errors`}>{errors.message}</p>}
//         <textarea
//             className={`text-area`}
//             placeholder='Leave your review here...'
//             value={review}
//             onChange={(e) => setReview(e.target.value)}
//         ></textarea>
//         <div className={`star-area`}>
//             <span onMouseEnter={() => setHover(1)} onMouseLeave={() => setHover(0)} onClick={() => setRating(1)} className={`star star1`}>{(hover || rating) >= 1 ? <span>&#9733;</span> : <span>&#9734;</span>}</span>
//             <span onMouseEnter={() => setHover(2)} onMouseLeave={() => setHover(0)} onClick={() => setRating(2)} className={`star star1`}>{(hover || rating) >= 2 ? <span>&#9733;</span> : <span>&#9734;</span>}</span>
//             <span onMouseEnter={() => setHover(3)} onMouseLeave={() => setHover(0)} onClick={() => setRating(3)} className={`star star1`}>{(hover || rating) >= 3 ? <span>&#9733;</span> : <span>&#9734;</span>}</span>
//             <span onMouseEnter={() => setHover(4)} onMouseLeave={() => setHover(0)} onClick={() => setRating(4)} className={`star star1`}>{(hover || rating) >= 4 ? <span>&#9733;</span> : <span>&#9734;</span>}</span>
//             <span onMouseEnter={() => setHover(5)} onMouseLeave={() => setHover(0)} onClick={() => setRating(5)} className={`star star1`}>{(hover || rating) >= 5 ? <span>&#9733;</span> : <span>&#9734;</span>}</span> Stars
//         </div>
//         <div></div>
//         <div className={`buttons-area`}>
//           <div>
//             <button disabled={toggle()} className={`submit-review-button`} onClick={handleSubmit}>Submit Your Review</button>
//             </div>
//             <br></br>
//         </div>
//         </div>
//         </>
//     )
// }
// export default PostReviewModal;
