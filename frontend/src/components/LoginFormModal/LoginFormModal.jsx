// frontend/src/components/LoginFormModal/LoginFormModal.jsx

import { useState } from 'react';
import * as sessionActions from '../../store/session';
import { useDispatch } from 'react-redux';
import { useModal } from '../../context/Modal';
import './LoginForm.css';

function LoginFormModal() {
  const dispatch = useDispatch();
  const [credential, setCredential] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    try {
      await dispatch(sessionActions.login({ credential, password }));
      closeModal();
    } catch (res) {
      const data = await res.json();
      if (data && data.errors) {
        setErrors(data.errors);
      }
    }
  };

  // Check if login button should be disabled
  const isLoginDisabled = credential.length < 4 || password.length < 6;

  const demoUser = (e) => {
    const credential = 'Demo-lition';
    const password = 'password';
    e.preventDefault();
    return dispatch(sessionActions.login({ credential, password }))
      .then(() => {
        setErrors({});
      })
      .then(closeModal);
  };

  return (
    <>
      <h1>Log In</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Username or Email
          <input
            type="text"
            value={credential}
            onChange={(e) => setCredential(e.target.value)}
            required
          />
        </label>
        <label>
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        {errors.credential && (
          <p>{errors.credential}</p>
        )}
        <button type="submit" disabled={isLoginDisabled}>Log In</button>
      </form>
      <p>
        Or log in as{' '}
        <span className="demo-link" onClick={demoUser}>
          Demo User
        </span>
      </p>
    </>
  );
}

export default LoginFormModal;



// import { useState } from 'react';
// import * as sessionActions from '../../store/session';
// import { useDispatch } from 'react-redux';
// import { useModal } from '../../context/Modal';
// import './LoginForm.css';

// function LoginFormModal() {
//   const dispatch = useDispatch();
//   const [credential, setCredential] = useState("");
//   const [password, setPassword] = useState("");
//   const [errors, setErrors] = useState({});
//   const { closeModal } = useModal();

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setErrors({});
//     try {
//       await dispatch(sessionActions.login({ credential, password }));
//       closeModal();
//     } catch (res) {
//       const data = await res.json();
//       if (data && data.errors) {
//         setErrors(data.errors);
//       }
//     }
//   };

//   // Check if login button should be disabled
//   const isLoginDisabled = credential.length < 4 || password.length < 6;

//   const handleDemoLogin = (e) => {
//     const credential = 'Demo-lition';
//     const password = 'password';
//     e.preventDefault();
//     return dispatch(sessionActions.login({ credential, password }))
//       .then(() => {
//         setErrors({});
//       })
//       .then(closeModal);
//   };

//   // const handleDemoLogin = async () => {
//   //   setCredential("Demo-lition");
//   //   setPassword("password");
//   //   await handleSubmit({ preventDefault: () => { } });
//   // };

//   return (
//     <>
//       <h1>Log In</h1>
//       <form onSubmit={handleSubmit}>
//         <label>
//           Username or Email
//           <input
//             type="text"
//             value={credential}
//             onChange={(e) => setCredential(e.target.value)}
//             required
//           />
//         </label>
//         <label>
//           Password
//           <input
//             type="password"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             required
//           />
//         </label>
//         {errors.credential && (
//           <p>{errors.credential}</p>
//         )}
//         <button type="submit" disabled={isLoginDisabled}>Log In</button>
//       </form>
//       <p>Or log in as <button onClick={handleDemoLogin}>Demo User</button></p>
//     </>
//   );
// }

// export default LoginFormModal;



// import { useState } from 'react';
// import * as sessionActions from '../../store/session';
// import { useDispatch } from 'react-redux';
// import { useModal } from '../../context/Modal';
// import './LoginForm.css';

// function LoginFormModal() {
//   const dispatch = useDispatch();
//   const [credential, setCredential] = useState("");
//   const [password, setPassword] = useState("");
//   const [errors, setErrors] = useState({});
//   const { closeModal } = useModal();

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     setErrors({});
//     return dispatch(sessionActions.login({ credential, password }))
//       .then(closeModal)
//       .catch(async (res) => {
//         const data = await res.json();
//         if (data && data.errors) {
//           setErrors(data.errors);
//         }
//       });
//   };

//   return (
//     <>
//       <h1>Log In</h1>
//       <form onSubmit={handleSubmit}>
//         <label>
//           Username or Email
//           <input
//             type="text"
//             value={credential}
//             onChange={(e) => setCredential(e.target.value)}
//             required
//           />
//         </label>
//         <label>
//           Password
//           <input
//             type="password"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             required
//           />
//         </label>
//         {errors.credential && (
//           <p>{errors.credential}</p>
//         )}
//         <button type="submit">Log In</button>
//       </form>
//     </>
//   );
// }

// export default LoginFormModal;
