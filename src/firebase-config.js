// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
// import { getAnalytics } from 'firebase/analytics';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyBkpRONojDane59C003kXUbU-UeRgFa_bk',
  authDomain: 'chattestapp-52d56.firebaseapp.com',
  projectId: 'chattestapp-52d56',
  storageBucket: 'chattestapp-52d56.firebasestorage.app',
  messagingSenderId: '62066358173',
  appId: '1:62066358173:web:325cd1034bdd21d30e6174',
  measurementId: 'G-0X609D3G1N'
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const dataBase = getFirestore(app);

const storage = getStorage(app);
// const analytics = getAnalytics(app);
export { auth, dataBase, storage };
