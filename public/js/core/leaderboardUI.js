import { listenLeaderboard } from "./leaderboard.js";
import { toggleMute, getMuteState } from "../core/audio.js";

// Sidebar & Mute Logic (Duplicated from uiManager for simplicity on standalone page)
const sidebar = document.getElementById("sidebar");
const mobileMenuBtn = document.getElementById("mobileMenuBtn");
const muteBtn = document.getElementById("muteBtn");

if (mobileMenuBtn && sidebar) {
  mobileMenuBtn.onclick = () => {
    sidebar.classList.toggle("-translate-x-full");
  };
}

if (muteBtn) {
  const updateMuteBtn = (isMuted) => {
    muteBtn.innerHTML = isMuted ? "<span>🔇 Sound Off</span>" : "<span>🔊 Sound On</span>";
    muteBtn.className = `w-full text-left p-3 rounded-lg transition-colors flex items-center justify-between ${isMuted ? "text-gray-500 hover:bg-gray-800" : "text-gray-300 hover:bg-gray-700/50"
      }`;
  };

  // Init state
  updateMuteBtn(getMuteState());

  muteBtn.onclick = () => {
    const isMuted = toggleMute();
    updateMuteBtn(isMuted);
  };
}


const leaderboardEl = document.getElementById("leaderboard");

if (leaderboardEl) {
  listenLeaderboard(users => {
    leaderboardEl.innerHTML = "";

    if (users.length === 0) {
      leaderboardEl.innerHTML = '<p class="text-center text-gray-400 py-4">No data yet.</p>';
      return;
    }

    users.forEach((user, index) => {
      const rank = index + 1;
      let rankClass = "bg-gray-800/50 text-gray-400";
      let icon = "";

      if (rank === 1) {
        rankClass = "bg-yellow-500/20 text-yellow-500 border-yellow-500/30";
        icon = "👑";
      } else if (rank === 2) {
        rankClass = "bg-gray-400/20 text-gray-300 border-gray-400/30";
        icon = "🥈";
      } else if (rank === 3) {
        rankClass = "bg-orange-700/20 text-orange-400 border-orange-700/30";
        icon = "🥉";
      }

      leaderboardEl.innerHTML += `
                <div class="flex items-center justify-between p-4 rounded-lg border border-transparent hover:border-gray-700 transition-all ${rank === 1 ? 'glass-card' : 'bg-gray-900/30'} mb-2">
                    <div class="flex items-center gap-4">
                        <div class="flex items-center justify-center w-8 h-8 rounded-full font-bold ${rankClass} border">
                            ${rank}
                        </div>
                        <div class="font-medium text-lg">
                            ${user.displayName || "Anonymous"} ${icon}
                        </div>
                    </div>
                    <div class="text-right">
                        <span class="text-indigo-400 font-bold text-xl">${user.completedLevelsCount || 0}</span>
                        <span class="text-gray-500 text-sm">levels</span>
                    </div>
                </div>
            `;
    });
  });
}
