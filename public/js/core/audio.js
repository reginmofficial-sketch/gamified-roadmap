/**
 * Simple Audio Manager
 */
export const AudioType = {
    COMPLETE: 'complete',
    ACHIEVEMENT: 'achievement'
};

const sounds = {
    [AudioType.COMPLETE]: new Audio('https://assets.mixkit.co/active_storage/sfx/2000/2000-preview.mp3'), // "Software Interface Start" type sound/ding
    [AudioType.ACHIEVEMENT]: new Audio('https://assets.mixkit.co/active_storage/sfx/2013/2013-preview.mp3') // "Success" fanfare
};

// Preload
Object.values(sounds).forEach(audio => {
    audio.volume = 0.5;
    audio.load();
});

let isMuted = localStorage.getItem("isMuted") === "true";

export function toggleMute() {
    isMuted = !isMuted;
    localStorage.setItem("isMuted", isMuted);
    return isMuted;
}

export function getMuteState() {
    return isMuted;
}

export function playSound(type) {
    if (isMuted) return;

    if (sounds[type]) {
        // Clone to allow overlap
        const clone = sounds[type].cloneNode();
        clone.volume = 0.4;
        clone.play().catch(e => console.warn("Audio blocked:", e));
    }
}
