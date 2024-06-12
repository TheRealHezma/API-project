//frontend/src/store/reviews.js

import { csrfFetch } from "./csrf";

// Action types
const LOAD = "reviews/LOAD";
const REMOVE = "reviews/REMOVE";

// Action creators
const load = (reviews) => ({
  type: LOAD,
  payload: reviews,
});

const remove = (reviewId) => ({
  type: REMOVE,
  reviewId,
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
    const reviews = list.Reviews;
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
// const load = reviews => ({
//   type: LOAD,
//   payload: reviews
// });

// const remove = (reviewId) => ({
//   type: REMOVE,
//   reviewId
// });

// const sortList = (list) => {
//   return list.sort((reviewA, reviewB) => {
//     var c = new Date(reviewA.updatedAt).getTime();
//     var d = new Date(reviewB.updatedAt).getTime();
//     return d - c;
//   });
// };

// // Thunks
// export const getCurrentSpotReviews = (spotId) => async (dispatch) => {
//   const response = await csrfFetch(`/api/spots/${spotId}/reviews`);
//   if (response.ok) {
//     const list = await response.json();
//     const reviews = list.Reviews;
//     dispatch(load(reviews));
//     return reviews;
//   }
// }

// export const createReview = (payload, spotId) => async (dispatch) => {
//   const response = await csrfFetch(`/api/spots/${spotId}/reviews`, {
//     method: "POST",
//     body: JSON.stringify(payload)
//   });
//   if (response.ok) {
//     const review = await response.json();
//     dispatch(getCurrentSpotReviews(spotId));
//     return review;
//   } else {
//     const data = await response.json();
//     throw data;
//   }
// }

// export const deleteReview = (reviewId) => async (dispatch) => {
//   const response = await csrfFetch(`/api/reviews/${reviewId}`, {
//     method: "DELETE"
//   });
//   if (response.ok) {
//     const spot = await response.json();
//     dispatch(remove(reviewId));
//     return spot;
//   }
// }

// const initialState = {
//   byId: {},
//   sortedReviews: []
// };

// // Reducer
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



// import { csrfFetch } from "./csrf";
// //action type
// const LOAD = "reviews/LOAD";
// const REMOVE = "reviews/REMOVE"

// //action creators
// const load = reviews => ({
//   type: LOAD,
//   payload: reviews
// });

// const remove = (reviewId) => ({
//   type: REMOVE,
//   reviewId
// });

// const sortList = (list) => {
//   return list.sort((reviewA, reviewB) => {
//     var c = new Date(reviewA.updatedAt).getTime();
//     var d = new Date(reviewB.updatedAt).getTime();
//     return d - c;
//   })
// };

// //Thunks
// export const getCurrentSpotReviews = (spotId) => async (dispatch) => {
//   const response = await csrfFetch(`/api/spots/${spotId}/reviews`);
//   if (response.ok) {
//     const list = await response.json();
//     const reviews = list.Reviews;
//     dispatch(load(reviews))
//     return reviews
//   }
// }

// export const createReview = (payload, spotId) => async () => {
//   const response = await csrfFetch(`/api/spots/${spotId}/reviews`, {
//     method: "POST",
//     body: JSON.stringify(payload)
//   });
//   if (response.ok) {
//     const review = await response.json();
//     return review;
//   }
// }


// export const deleteReview = (reviewId) => async (dispatch) => {
//   const response = await csrfFetch(`/api/reviews/${reviewId}`, {
//     method: "DELETE"
//   });
//   if (response.ok) {
//     const spot = await response.json();
//     dispatch(remove(reviewId));
//     return spot
//   }
// }



// const initialState = {
//   byId: {},
//   sortedReviews: []
// };

// //Reducer
// const reviewReducer = (state = initialState, action) => {
//   switch (action.type) {
//     case LOAD: {
//       const allReviews = {};
//       //  const allReviews = { ...state };
//       action.payload.forEach(review => {
//         allReviews.byId[review.id] = review;
//       });
//       return {
//         // ...allReviews,
//         ...state,
//         byId: allReviews,
//         sortedReviews: sortList(action.payload)
//       };
//     }
//     case REMOVE: {
//       // const newState = { ...state };
//       const newById = { ...state.byId };
//       const newSortedReviews = state.sortedReviews.filter(review => review.id != action.reviewId)
//       delete newById[action.reviewId];
//       // newState.byId = newById;
//       // newState.sortedReviews = newSortedReviews
//       // return newState;
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
