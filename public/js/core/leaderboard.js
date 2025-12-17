import { db } from "../config/firebase.js";
import { collection, query, orderBy, onSnapshot }
from "https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js";

export function listenLeaderboard(cb) {
  const q = query(
    collection(db, "users"),
    orderBy("completedLevelsCount", "desc")
  );

  onSnapshot(q, snap => {
    console.log("Leaderboard snapshot size:", snap.size);
    cb(snap.docs.map(d => ({ id: d.id, ...d.data() })));
  });
}
