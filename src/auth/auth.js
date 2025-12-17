import { auth, db } from "../config/firebase.js";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.7.0/firebase-auth.js";
import { doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js";

const emailBtn = document.getElementById("emailLogin");
const googleBtn = document.getElementById("googleLogin");

if (emailBtn) {
  emailBtn.onclick = async () => {
    const email = email.value;
    const password = password.value;

    try {
      const res = await signInWithEmailAndPassword(auth, email, password);
      await ensureUser(res.user);
      location.href = "app.html";
    } catch {
      const res = await createUserWithEmailAndPassword(auth, email, password);
      await ensureUser(res.user);
      location.href = "app.html";
    }
  };
}

if (googleBtn) {
  googleBtn.onclick = async () => {
    const provider = new GoogleAuthProvider();
    const res = await signInWithPopup(auth, provider);
    await ensureUser(res.user);
    location.href = "app.html";
  };
}

async function ensureUser(user) {
  const ref = doc(db, "users", user.uid);
  const snap = await getDoc(ref);
  if (!snap.exists()) {
    await setDoc(ref, {
      displayName: user.displayName || "User",
      completedLevelsCount: 0,
      currentStreak: 0,
      lastCompletionDate: null,
      createdAt: new Date()
    });
  }
}

onAuthStateChanged(auth, user => {
  if (user && location.pathname.includes("index")) {
    location.href = "app.html";
  }
});
