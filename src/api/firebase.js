// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

// TODO: Add SDKs for Firebase products that you want to use
import { getFirestore } from "firebase/firestore"
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyAAiWRT71cF-WP1suUG7PYlAYnUD18ArdE",
    authDomain: "arrowstreet-5499c.firebaseapp.com",
    projectId: "arrowstreet-5499c",
    storageBucket: "arrowstreet-5499c.appspot.com",
    messagingSenderId: "237211806800",
    appId: "1:237211806800:web:daa4dc94f438b9e7087555",
    measurementId: "G-PEX107FD05"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export default getFirestore();