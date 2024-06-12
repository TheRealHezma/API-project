//frontend/src/components/Spots/ManageSpotsBrowser.jsx

import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getCurrentUserSpots } from '../../store/spots.js';
import SpotTile from './SpotTile.jsx';
import OpenModalButton from '../DeleteSpotModal/OpenModalDeleteSpot.jsx';
import DeleteSpotModal from '../DeleteSpotModal/DeleteSpotModal';
import './SpotTile.css';
import './ManageSpotsBrowser.css';

function ManageSpotsBrowser() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const sessionUser = useSelector(state => state.session.user);
    const spots = useSelector(state => state.spots.byId);

    useEffect(() => {
        dispatch(getCurrentUserSpots());
    }, [dispatch]);

    const filteredSpots = Object.values(spots).filter(spot => spot.ownerId === sessionUser?.id);

    if (!sessionUser) {
        navigate('/');
        return null; // Early return if no user is logged in
    }

    return (
        <div>
            <div className="header">
                <h2>Manage Spots</h2>
            </div>
            <div className="spots-container">
                {filteredSpots.length === 0 ? (
                    <div>
                        No Spots Currently Owned!
                        <div>
                            <button onClick={() => navigate('/spots/new')} className="create-spots-button">
                                Create a New Spot
                            </button>
                        </div>
                    </div>
                ) : (
                    filteredSpots.map((spot) => (
                        <div key={spot.id} className="spot-item">
                            <SpotTile spot={spot} onClick={() => navigate(`/spots/${spot.id}`)} />
                            <div className="buttons-area">
                                <button className="update-button" onClick={() => navigate(`/spots/${spot.id}/edit`)}>
                                    Update
                                </button>
                                <OpenModalButton
                                    className="delete-button"
                                    buttonText="Delete"
                                    modalComponent={<DeleteSpotModal spotId={spot.id} />}
                                />
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

export default ManageSpotsBrowser;



// import { useState, useEffect } from 'react';
// import { useSelector, useDispatch } from 'react-redux';
// import { useNavigate } from 'react-router-dom';
// import { getCurrentUserSpots } from '../../store/spots.js';
// import SpotTile from './SpotTile.jsx';
// import OpenModalButton from '../DeleteSpotModal/OpenModalDeleteSpot.jsx';
// import DeleteSpotModal from '../DeleteSpotModal/DeleteSpotModal';
// import './SpotTile.css';
// import './ManageSpotsBrowser.css';

// function ManageSpotsBrowser() {
//     const dispatch = useDispatch();
//     const navigate = useNavigate();
//     const sessionUser = useSelector(state => state.session.user);
//     const spots = useSelector(state => state.spots.byId);

//     useEffect(() => {
//         dispatch(getCurrentUserSpots());
//     }, [dispatch]);

//     const filteredSpots = Object.values(spots).filter(spot => spot.ownerId === sessionUser?.id);

//     if (!sessionUser) {
//         navigate('/');
//         return null; // Early return if no user is logged in
//     }

//     return (
//         <div>
//             <div className="header">
//                 <h2>Manage Spots</h2>
//             </div>
//             <div className="spots-container">
//                 {filteredSpots.length === 0 ? (
//                     <div>
//                         No Spots Currently Owned!
//                         <div>
//                             <button onClick={() => navigate('/spots/new')} className="create-spots-button">
//                                 Create a New Spot
//                             </button>
//                         </div>
//                     </div>
//                 ) : (
//                     filteredSpots.map((spot) => (
//                         <div key={spot.id} className="spot-item">
//                             <SpotTile spot={spot} onClick={() => navigate(`/spots/${spot.id}`)} />
//                             <div className="buttons-area">
//                                 <button className="update-button" onClick={() => navigate(`/spots/${spot.id}/edit`)}>
//                                     Update
//                                 </button>
//                                 <OpenModalButton
//                                     className="delete-button"
//                                     buttonText="Delete"
//                                     modalComponent={<DeleteSpotModal spotId={spot.id} />}
//                                 />
//                             </div>
//                         </div>
//                     ))
//                 )}
//             </div>
//         </div>
//     );
// }

// export default ManageSpotsBrowser;


///////////////////////////////////////////
// import { useState } from 'react';
// import { useSelector } from 'react-redux';
// import { useDispatch } from 'react-redux';
// import { useEffect } from 'react';
// import { getCurrentUserSpots } from '../../store/spots.js';
// import SpotTile from './SpotTile.jsx';
// import './SpotTile.css'
// import { useNavigate } from 'react-router-dom';
// import OpenModalButton from '../DeleteSpotModal/OpenModalDeleteSpot.jsx';
// import DeleteSpotModal from '../DeleteSpotModal/DeleteSpotModal';


// function ManageSpotsBrowser() {
//     const dispatch = useDispatch();
//     const navigate = useNavigate();
//     const sessionUser = useSelector(state => state.session.user);
//     const spots = useSelector(state => state.spots.byId);
//     const filteredSpots = [];

//     if (!sessionUser) {
//         navigate('/')
//     }

//     for (const spot of Object.values(spots)) {
//         if (sessionUser && sessionUser.id === spot.ownerId) {
//             filteredSpots.push(spot)
//         }
//     }

//     const [isLoaded, setIsLoaded] = useState(false);

//     useEffect(() => {
//         dispatch(getCurrentUserSpots()).then(() => {
//             setIsLoaded(true)
//         })
//     }, [isLoaded, dispatch])

//     return (
//         <>
//             <div>
//                 <div className={`header`}>
//                     <h2>Manage Spots</h2>
//                 </div>
//                 <br></br>
//                 <br></br>
//                 <br></br>
//                 <div className={`spotscontainer`}>
//                     {filteredSpots.length === 0 && <div>No Spots Currently Owned! <div><button onClick={() => { navigate(`/spots/new`) }} className={`create-spots-button`}>Create a New Spot</button></div></div>}
//                     {Object.values(filteredSpots).map((spot) => (
//                         <>
//                             <div>
//                                 <SpotTile onClick={() => { navigate(`/spots/${spot.id}`) }} key={`${spot.id}`} spot={spot} />
//                                 <div className={`buttons-area`}><span><button className={`update-button`} key={`update-${spot.id}`} onClick={() => { navigate(`/spots/${spot.id}/edit`) }}>Update</button>
//                                     <OpenModalButton className={`delete-button`} modalComponent={<DeleteSpotModal spotId={spot.id} />} /></span></div>
//                             </div>
//                         </>
//                     ))}

//                 </div>
//             </div>
//         </>
//     )
// }

// export default ManageSpotsBrowser;
