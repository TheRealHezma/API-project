//frontend/src/components/Reviews/ReviewTitle.jsx

import './ReviewTitle.css';
import { useSelector } from 'react-redux';
import OpenModalButton from '../DeleteSpotModal/OpenModalDeleteSpot';
import DeleteReviewModal from './DeleteReviewModal';
import EditReviewModal from './EditReviewModal';

function ReviewTitle({ review, spotId }) {
    const monthNames = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    const date = new Date(review?.updatedAt);
    const sessionUser = useSelector(state => state.session.user);

    return (
        <div className="review-item">
            <div className="review-user">
                {review.User?.firstName}
            </div>
            <span className="review-date">
                {monthNames[date.getMonth()]} {date.getFullYear()}
            </span>
            <p className="review-body">{review?.review}</p>
            {sessionUser?.id === review.userId && (
                <div>
                    <OpenModalButton modalComponent={<DeleteReviewModal reviewId={review.id} spotId={spotId} />} deleteButton={true} />
                    {/* <OpenModalButton
                        modalComponent={<EditReviewModal review={review} spotId={spotId} />}
                        buttonText="Edit Review"
                    /> */}

                    {/* <button>Edit</button> */}
                </div>)}
        </div>
    );
}

export default ReviewTitle;



// import './ReviewTitle.css';
// import { useSelector } from 'react-redux';
// import OpenModalButton from '../DeleteSpotModal/OpenModalDeleteSpot';
// import DeleteReviewModal from './DeleteReviewModal';

// function ReviewTitle({ review, spotId }) {
//     const monthNames = [
//         "January", "February", "March", "April", "May", "June",
//         "July", "August", "September", "October", "November", "December"
//     ];

//     const date = new Date(review?.updatedAt);
//     const sessionUser = useSelector(state => state.session.user);

//     return (
//         <div className="review-item">
//             <div className="review-user">
//                 {review.User?.firstName}
//             </div>
//             <span className="review-date">
//                 {monthNames[date.getMonth()]} {date.getFullYear()}
//             </span>
//             <p className="review-body">{review?.review}</p>
//             {sessionUser?.id === review.userId && (
//                 <div>
//                     <OpenModalButton modalComponent={<DeleteReviewModal reviewId={review.id} spotId={spotId} />} />
//                 </div>
//             )}
//         </div>
//     );
// }

// export default ReviewTitle;






// import './ReviewTitle.css'
// import { useSelector } from 'react-redux';
// import OpenModalButton from '../DeleteSpotModal/OpenModalDeleteSpot';
// import DeleteReviewModal from './DeleteReviewModal'

// function ReviewTitle({ review, spotId }) {
//     const monthNames = ["January", "February", "March", "April", "May", "June",
//         "July", "August", "September", "October", "November", "December"
//     ];

//     const date = new Date(review?.updatedAt);
//     const sessionUser = useSelector(state => state.session.user)

//     return (
//         <>
//             <div className={`reviewitem`}>
//                 <br></br>
//                 <div className={`review-user`}>
//                     {review.User?.firstName}
//                 </div>
//                 <span className={`review-date`}>{monthNames[date.getMonth()]} {date.getFullYear()}</span>
//                 <p className={`review-body`}>{review?.review}</p>
//                 {sessionUser?.id === review.userId && <div><OpenModalButton modalComponent={<DeleteReviewModal reviewId={review.id} spotId={spotId} />} /></div>}
//                 <br></br>
//             </div>
//         </>
//     )
// }


// export default ReviewTitle;
