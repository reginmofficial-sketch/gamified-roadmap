import { listenLeaderboard } from "./leaderboard.js";

const leaderboardEl = document.getElementById("leaderboard");

listenLeaderboard(users => {
  console.log("Rendering leaderboard:", users);

  leaderboardEl.innerHTML = "";

  users.forEach((user, index) => {
    leaderboardEl.innerHTML += `
      <div class="flex justify-between p-2 border-b">
        <span>#${index + 1} ${user.displayName || "Anonymous"}</span>
        <span>${user.completedLevelsCount}</span>
      </div>
    `;
  });
});
