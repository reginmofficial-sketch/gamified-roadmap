import { db } from "../config/firebase.js";
import { doc, setDoc } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js";

const milestones = [1, 5, 10, 25];

export async function checkBadges(uid, count) {
  if (!milestones.includes(count)) return;

  await setDoc(doc(db, "users", uid, "badges", `LEVEL_${count}`), {
    earnedAt: new Date()
  });
}
