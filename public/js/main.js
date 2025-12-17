import { auth, db } from "./config/firebase.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-auth.js";
import { doc, getDoc, updateDoc, increment } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js";

import { fetchLevels } from "./core/levels.js";
import { getUserProgress, completeLevel } from "./core/progress.js";
import { updateStreak } from "./core/streak.js";
import { checkBadges } from "./core/badges.js";
import { renderLevel } from "./ui/levelCard.js";
import { celebrate } from "./ui/animations.js";

onAuthStateChanged(auth, async user => {
  if (!user) location.href = "index.html";

  const levels = await fetchLevels();
  const progress = await getUserProgress(user.uid);

  const userRef = doc(db, "users", user.uid);
  const userSnap = await getDoc(userRef);
  const userData = userSnap.data();

  document.getElementById("userInfo").textContent =
    userData.displayName;

  document.getElementById("streak").textContent =
    `🔥 ${userData.currentStreak}`;

  const container = document.getElementById("levelsContainer");

  levels.forEach((level, index) => {
    const completed = progress.includes(level.order);
    const unlocked = completed || index === progress.length;

    const card = renderLevel(
      level,
      unlocked,
      completed,
      async () => {
        await completeLevel(user.uid, level.order);
        await updateDoc(userRef, {
          completedLevelsCount: increment(1)
        });
        await updateStreak(user.uid, userData.lastCompletionDate);
        await checkBadges(user.uid, userData.completedLevelsCount + 1);
        celebrate();
        location.reload();
      }
    );

    container.appendChild(card);
  });
});
