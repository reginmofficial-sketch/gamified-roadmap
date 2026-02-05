import { celebrate } from "./animations.js";
import { logger } from "../core/logger.js";
import { playSound, AudioType, toggleMute, getMuteState } from "../core/audio.js";

export class UIManager {
    constructor() {
        this.container = document.getElementById("levelsContainer");
        this.userInfo = document.getElementById("userInfo");

        // Mobile Sidebar
        this.sidebar = document.getElementById("sidebar");
        this.mobileMenuBtn = document.getElementById("mobileMenuBtn");
        if (this.mobileMenuBtn) {
            this.mobileMenuBtn.onclick = () => {
                this.sidebar.classList.toggle("-translate-x-full");
            };
        }

        // Zen Card Share
        this.shareBtn = document.getElementById("shareBtn");
        if (this.shareBtn) {
            this.shareBtn.onclick = () => {
                this.generateZenCard();
            };
        }

        // Mute Toggle
        this.muteBtn = document.getElementById("muteBtn");
        this.updateMuteBtn();
        if (this.muteBtn) {
            this.muteBtn.onclick = () => {
                const isMuted = toggleMute();
                this.updateMuteBtn(isMuted);
            };
        }
    }

    updateMuteBtn(isMuted = getMuteState()) {
        if (!this.muteBtn) return;
        this.muteBtn.innerHTML = isMuted ? "<span>🔇 Sound Off</span>" : "<span>🔊 Sound On</span>";
        this.muteBtn.className = `w-full text-left p-3 rounded-lg transition-colors flex items-center justify-between ${isMuted ? "text-gray-500 hover:bg-gray-800" : "text-gray-300 hover:bg-gray-700/50"
            }`;
    }

    /**
     * Render the Top Bar (User Info & Streak)
     */
    updateHeader(user, userData) {
        if (!userData) return;

        logger.debug("Updating header UI");
        this.userInfo.innerHTML = `
            <div class="flex items-center gap-3">
                <button id="avatarBtn" class="w-12 h-12 rounded-full bg-indigo-500/20 text-2xl flex items-center justify-center border border-indigo-500/30 hover:bg-indigo-500/40 transition-colors" title="Change Avatar">
                    ${userData.avatar || "👤"}
                </button>
                <div>
                   <div class="flex items-center gap-2">
                        <span class="font-bold text-gray-800 text-lg">${userData.displayName}</span>
                        <div class="flex items-center gap-1 bg-orange-100 text-orange-600 px-2 py-0.5 rounded-full font-bold text-xs">
                            <span>🔥</span>
                            <span>${userData.currentStreak || 0}</span>
                        </div>
                   </div>
                   <span class="text-xs text-gray-500">Lvl ${userData.completedLevelsCount || 0}</span>
                </div>
            </div>
        `;

        const avatarBtn = document.getElementById("avatarBtn");
        if (avatarBtn) {
            avatarBtn.onclick = () => this.showAvatarSelector(userData.completedLevelsCount || 0);
        }

        this.renderBadges(userData.completedLevelsCount || 0);
    }

    renderBadges(count) {
        const container = document.getElementById("badgesList");
        if (!container) return;

        const milestones = [1, 5, 10, 25, 50, 100];
        container.innerHTML = "";

        milestones.forEach(m => {
            const unlocked = count >= m;
            const el = document.createElement("div");
            el.className = `w-8 h-8 rounded-full flex items-center justify-center text-xs border ${unlocked
                ? "bg-yellow-500/20 border-yellow-500 text-yellow-500 shadow-[0_0_10px_rgba(234,179,8,0.3)]"
                : "bg-gray-800 border-gray-700 text-gray-600 grayscale opacity-50"
                }`;
            el.title = `Level ${m} Badge`;
            el.innerHTML = unlocked ? "🏆" : "🔒";

            if (unlocked) {
                // Add a little glow animation if newly unlocked (could logic verify this later)
                el.classList.add("animate-pulse");
            }

            container.appendChild(el);
        });
    }

    /**
     * Render the Levels as a Roadmap
     * @param {Array} levels - List of all levels
     * @param {Array} completedLevelIds - List of IDs of completed levels
     * @param {Function} onCompleteLevel - Callback when a level is completed
     */
    renderRoadmap(levels, completedLevelIds, onCompleteLevel) {
        logger.debug("Rendering roadmap UI");
        this.container.innerHTML = ""; // Clear existing

        const roadmapTrack = document.createElement("div");
        roadmapTrack.className = "relative border-l-4 border-blue-200 ml-4 my-6 pl-6 space-y-8";

        // Find which is the logical "next" level to unlock
        // Assuming strict linear progression for now based on 'order'
        const completionSet = new Set(completedLevelIds);
        let firstLockedFound = false;

        levels.forEach((level, index) => {
            const isCompleted = completionSet.has(level.order); // specific logic relying on 'order' as ID
            // If previous one is completed, this one is unlocked.
            // Or if it's the very first one.
            const previousLevel = levels[index - 1];
            const isUnlocked = index === 0 || (previousLevel && completionSet.has(previousLevel.order));

            // If we found a locked level, all subsequent ones are also locked and we might want to hide them or dim them
            // Implementation Plan said: "Hide all upcoming levels after the first unlocked one"
            // Let's stick to that for now, or maybe show just the next one locked.

            if (!isUnlocked && firstLockedFound) {
                // Return here to hide future levels completely? 
                // Or render them as "Unknown"? Let's just return to keep it clean like before.
                return;
            }
            if (!isUnlocked) firstLockedFound = true; // Mark that we've hit the wall

            const node = this.createLevelNode(level, isCompleted, isUnlocked, onCompleteLevel);
            roadmapTrack.appendChild(node);
        });

        this.container.appendChild(roadmapTrack);
    }

    /**
     * Create a single level node.
     */
    createLevelNode(level, isCompleted, isUnlocked, onCompleteLevel) {
        const item = document.createElement("div");
        item.className = "relative";

        // Dot indicator on the line
        const dot = document.createElement("div");
        dot.className = `absolute -left-[41px] bg-white border-4 w-8 h-8 rounded-full flex items-center justify-center transition-colors duration-300 ${isCompleted ? "border-green-500 text-green-500" : (isUnlocked ? "border-blue-500 text-blue-500" : "border-gray-300 text-gray-300")
            }`;

        dot.innerHTML = isCompleted ? "✓" : (isUnlocked ? "●" : "🔒");
        item.appendChild(dot);

        // Content Card
        const card = document.createElement("div");
        card.className = `p-5 rounded-xl border transition-all duration-300 ${isUnlocked ? "bg-white shadow-lg hover:shadow-xl border-gray-100 cursor-pointer transform hover:-translate-y-1" : "bg-gray-50 border-gray-200 opacity-70 cursor-not-allowed"
            }`;

        // Title & Description
        const content = `
            <h3 class="font-bold text-lg text-gray-800 mb-1">${level.levelName}</h3>
            <p class="text-sm text-gray-600 mb-4">${level.description}</p>
        `;
        card.innerHTML = content;

        // Action Button
        if (isUnlocked && !isCompleted) {
            const btn = document.createElement("button");
            btn.className = "w-full py-2 px-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg font-semibold shadow hover:from-blue-600 hover:to-indigo-700 transition-all";
            btn.textContent = "Complete Level";
            btn.onclick = (e) => {
                e.stopPropagation(); // Prevent card click if we add that later
                onCompleteLevel(level);
            };
            card.appendChild(btn);
        } else if (isCompleted) {
            const status = document.createElement("div");
            status.className = "text-green-600 font-semibold text-sm flex items-center gap-1";
            status.innerHTML = "<span>🎉</span> Completed";
            card.appendChild(status);
        }

        item.appendChild(card);
        return item;
    }

    showCelebration() {
        celebrate();
        playSound(AudioType.COMPLETE);
    }

    showError(msg) {
        this.container.innerHTML = `
            <div class="glass-card p-8 rounded-xl text-center border-red-500/50">
                <h3 class="text-red-400 font-bold mb-2">Error Loading</h3>
                <p class="text-gray-400">${msg}</p>
                <div class="mt-4">
                     <p class="text-xs text-gray-500 mb-2">If this is a fresh install, you might need to seed the database.</p>
                     <button onclick="import('./js/core/importLevels.js').then(() => alert('Keep an eye on the console (F12) for progress...'))" class="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded text-sm text-white">
                        Seed Levels
                     </button>
                </div>
            </div>
        `;
    }

    showAvatarSelector(userLvl) {
        import("../services/gameService.js").then(({ ALLOWED_AVATARS, gameService }) => {
            // Create Modal
            const modal = document.createElement("div");
            modal.className = "fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4";
            modal.innerHTML = `
                <div class="glass-panel p-6 rounded-2xl max-w-sm w-full relative animate-float">
                    <button id="closeModal" class="absolute top-4 right-4 text-gray-400 hover:text-white">✕</button>
                    <h3 class="text-xl font-bold mb-4 text-center">Choose Identity</h3>
                    <div class="grid grid-cols-4 gap-4">
                        ${ALLOWED_AVATARS.map(av => {
                const locked = userLvl < av.reqLvl;
                return `
                                <button class="avatar-option w-12 h-12 rounded-xl flex items-center justify-center text-2xl border transition-all ${locked
                        ? "bg-gray-800 border-gray-700 opacity-50 cursor-not-allowed"
                        : "bg-indigo-500/10 border-indigo-500/30 hover:bg-indigo-500/30 hover:scale-110 cursor-pointer"}"
                                    data-char="${av.char}" ${locked ? "disabled" : ""}>
                                    ${locked ? "🔒" : av.char}
                                </button>
                            `;
            }).join("")}
                    </div>
                </div>
            `;

            document.body.appendChild(modal);

            // Bind Events
            modal.querySelector("#closeModal").onclick = () => modal.remove();

            modal.querySelectorAll(".avatar-option").forEach(btn => {
                if (!btn.disabled) {
                    btn.onclick = async () => {
                        const char = btn.dataset.char;
                        await gameService.updateAvatar(char);
                        modal.remove();
                        window.location.reload(); // Simple reload to reflect changes
                    };
                }
            });
        });
    }

    async generateZenCard() {
        if (typeof html2canvas === 'undefined') {
            alert("Sharing module not loaded yet.");
            return;
        }

        const template = document.getElementById("zenCardTemplate");
        const nameEl = document.getElementById("cardName");
        const lvlEl = document.getElementById("cardLvl");
        const streakEl = document.getElementById("cardStreak");
        const avEl = document.getElementById("cardAvatar");

        import("../services/gameService.js").then(({ gameService }) => {
            gameService.getUserData(gameService.currentUser.uid).then(data => {
                if (!data) return;

                nameEl.textContent = data.displayName;
                lvlEl.textContent = data.completedLevelsCount || 0;
                streakEl.textContent = data.currentStreak || 0;
                avEl.textContent = data.avatar || "👤";

                // Generate
                html2canvas(template, {
                    backgroundColor: "#0f172a",
                    scale: 2 // High res
                }).then(canvas => {
                    const link = document.createElement("a");
                    link.download = `mindful-card-${Date.now()}.png`;
                    link.href = canvas.toDataURL();
                    link.click();
                    playSound(AudioType.COMPLETE); // Nice feedback
                });
            });
        });
    }
}

export const uiManager = new UIManager();
