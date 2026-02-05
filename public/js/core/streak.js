import { doc, updateDoc, setDoc } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js";
import { db } from "../config/firebase.js";
import { logger } from "./logger.js";

/**
 * Updates the user's streak based on their last completion date.
 * @param {string} uid - User ID
 * @param {string} lastDate - Date string of last completion
 * @param {number} currentStreak - Current streak count
 */
export async function updateStreak(uid, lastDate, currentStreak = 0) {
  const today = new Date().toDateString();
  const yesterday = new Date(Date.now() - 86400000).toDateString();

  let newStreak = 1; // Default if broken

  if (lastDate === today) {
    logger.debug("Streak update skipped - already completed something today.");
    return; // Already updated today
  }

  if (lastDate === yesterday) {
    newStreak = currentStreak + 1;
    logger.info(`Streak incremented to ${newStreak} 🔥`);
  } else {
    logger.info(`Streak reset (Last active: ${lastDate}) 😢`);
  }

  await setDoc(doc(db, "users", uid), {
    currentStreak: newStreak,
    lastCompletionDate: today
  }, { merge: true });

  return newStreak;
}
