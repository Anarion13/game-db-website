import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDD4RmS8088o4uyqehj5nT2u6UnQD0MRTU",
  authDomain: "game-db-website-48cbd.firebaseapp.com",
  projectId: "game-db-website-48cbd",
  storageBucket: "game-db-website-48cbd.appspot.com",
  messagingSenderId: "760041523195",
  appId: "1:760041523195:web:f09366460aa94042eead5e",
  measurementId: "G-SF72SSWN9W"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(app);

export { auth };