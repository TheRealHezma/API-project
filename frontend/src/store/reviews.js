// // // //frontend/src/store/reviews.js

// frontend/src/store/reviews.js

import { csrfFetch } from "./csrf";

// Action types
const LOAD = "reviews/LOAD";
const REMOVE = "reviews/REMOVE";
const EDIT = "reviews/EDIT";

// Action creators
const load = (reviews) => ({
  type: LOAD,
  payload: reviews,
});

const remove = (reviewId) => ({
  type: REMOVE,
  reviewId,
});

const edit = (review) => ({
  type: EDIT,
  review,
});

const sortList = (list) => {
  return list.sort((reviewA, reviewB) => {
    const c = new Date(reviewA.updatedAt).getTime();
    const d = new Date(reviewB.updatedAt).getTime();
    return d - c;
  });
};

// Thunks
export const getCurrentSpotReviews = (spotId) => async (dispatch) => {
  const response = await csrfFetch(`/api/spots/${spotId}/reviews`);
  if (response.ok) {
    const list = await response.json();
    const reviews = list.reviews;
    dispatch(load(reviews));
    return reviews;
  }
};

export const createReview = (payload, spotId) => async (dispatch) => {
  const response = await csrfFetch(`/api/spots/${spotId}/reviews`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
  if (response.ok) {
    const review = await response.json();
    dispatch(getCurrentSpotReviews(spotId));
    return review;
  } else {
    const data = await response.json();
    throw data;
  }
};

export const deleteReview = (reviewId) => async (dispatch) => {
  const response = await csrfFetch(`/api/reviews/${reviewId}`, {
    method: "DELETE",
  });
  if (response.ok) {
    dispatch(remove(reviewId));
    return response;
  }
};

export const editReview = (review) => async (dispatch) => {
  const { id, review: reviewText, stars } = review;
  const response = await csrfFetch(`/api/reviews/${id}`, {
    method: 'PUT',
    body: JSON.stringify({ review: reviewText, stars }),
  });

  if (response.ok) {
    const data = await response.json();
    dispatch(edit(data));
  } else {
    const errorData = await response.json();
    return { errors: errorData.errors };
  }
};

const initialState = {
  byId: {},
  sortedReviews: []
};

const reviewReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOAD: {
      const allReviews = {};
      action.payload.forEach(review => {
        allReviews[review.id] = review;
      });
      return {
        ...state,
        byId: allReviews,
        sortedReviews: sortList(action.payload)
      };
    }
    case REMOVE: {
      const newById = { ...state.byId };
      const newSortedReviews = state.sortedReviews.filter(review => review.id !== action.reviewId);
      delete newById[action.reviewId];
      return {
        ...state,
        byId: newById,
        sortedReviews: newSortedReviews
      };
    }
    case EDIT: {
      const newById = { ...state.byId, [action.review.id]: action.review };
      const newSortedReviews = sortList(Object.values(newById));
      return {
        ...state,
        byId: newById,
        sortedReviews: newSortedReviews
      };
    }
    default:
      return state;
  }
};

export default reviewReducer;


// import { csrfFetch } from "./csrf";

// // Action types
// const LOAD = "reviews/LOAD";
// const REMOVE = "reviews/REMOVE";

// // Action creators
// const load = (reviews) => ({
//   type: LOAD,
//   payload: reviews,
// });

// const remove = (reviewId) => ({
//   type: REMOVE,
//   reviewId,
// });

// const sortList = (list) => {
//   return list.sort((reviewA, reviewB) => {
//     const c = new Date(reviewA.updatedAt).getTime();
//     const d = new Date(reviewB.updatedAt).getTime();
//     return d - c;
//   });
// };

// // Thunks
// export const getCurrentSpotReviews = (spotId) => async (dispatch) => {
//   const response = await csrfFetch(`/api/spots/${spotId}/reviews`);
//   if (response.ok) {
//     const list = await response.json();
//     const reviews = list.reviews;
//     dispatch(load(reviews));
//     return reviews;
//   }
// };

// export const createReview = (payload, spotId) => async (dispatch) => {
//   const response = await csrfFetch(`/api/spots/${spotId}/reviews`, {
//     method: "POST",
//     body: JSON.stringify(payload),
//   });
//   if (response.ok) {
//     const review = await response.json();
//     dispatch(getCurrentSpotReviews(spotId));
//     return review;
//   } else {
//     const data = await response.json();
//     throw data;
//   }
// };

// export const deleteReview = (reviewId) => async (dispatch) => {
//   const response = await csrfFetch(`/api/reviews/${reviewId}`, {
//     method: "DELETE",
//   });
//   if (response.ok) {
//     dispatch(remove(reviewId));
//     return response;
//   }
// };

// const initialState = {
//   byId: {},
//   sortedReviews: []
// };

// const reviewReducer = (state = initialState, action) => {
//   switch (action.type) {
//     case LOAD: {
//       const allReviews = {};
//       action.payload.forEach(review => {
//         allReviews[review.id] = review;
//       });
//       return {
//         ...state,
//         byId: allReviews,
//         sortedReviews: sortList(action.payload)
//       };
//     }
//     case REMOVE: {
//       const newById = { ...state.byId };
//       const newSortedReviews = state.sortedReviews.filter(review => review.id !== action.reviewId);
//       delete newById[action.reviewId];
//       return {
//         ...state,
//         byId: newById,
//         sortedReviews: newSortedReviews
//       };
//     }
//     default:
//       return state;
//   }
// };

// export default reviewReducer;
