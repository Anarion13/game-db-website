import React from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import './Login.css';

function Login() {
  const navigate = useNavigate();

  const signInWithGoogle = () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider)
      .then(() => {
        navigate('/');
      })
      .catch((error) => {
        console.error("Error signing in: ", error);
      });
  };

  return (
    <div className="login-container">
      <h2>Sign in to Games Database</h2>
      <button onClick={signInWithGoogle} className="google-signin-btn">
        <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google logo" />
        Sign in with Google
      </button>
    </div>
  );
}

export default Login;
