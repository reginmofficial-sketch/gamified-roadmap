import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyADz_yfsox-vSoFkkX-As6SoPD9khlXlmU",
    authDomain: "roadmap-gamified.firebaseapp.com",
    projectId: "roadmap-gamified",
    storageBucket: "roadmap-gamified.firebasestorage.app",
    messagingSenderId: "631908422746",
    appId: "1:631908422746:web:dd05a6cf437d5d50c9f463"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
