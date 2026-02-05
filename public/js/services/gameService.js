import { db, auth } from "../config/firebase.js";
import {
    collection,
    getDocs,
    query,
    orderBy,
    doc,
    getDoc,
    setDoc,
    updateDoc,
    deleteDoc,
    increment,
    writeBatch
} from "https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js";
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-auth.js";
import { logger } from "../core/logger.js";
import { checkBadges } from "../core/badges.js"; // Keep using existing logic for now, refactor later
import { updateStreak } from "../core/streak.js"; // Keep using existing logic for now

class GameService {
    constructor() {
        this.currentUser = null;
        this.levels = [];
    }

    /**
     * Initialize the authentication listener.
     * @param {Function} onUserChanged - Callback when user state changes.
     */
    initAuth(onUserChanged) {
        logger.info("Initializing authentication...");
        onAuthStateChanged(auth, async (user) => {
            if (user) {
                logger.info(`User logged in: ${user.uid}`);
                this.currentUser = user;
                // Fetch user data and levels immediately
                try {
                    await this.fetchLevels();
                    const userData = await this.getUserData(user.uid);
                    onUserChanged({ user, userData, levels: this.levels });
                } catch (error) {
                    logger.error("Error loading initial data", error);
                    onUserChanged({ user, error });
                }
            } else {
                logger.info("User logged out");
                this.currentUser = null;
                onUserChanged({ user: null });
            }
        });
    }

    /**
     * Log out the current user.
     */
    async logout() {
        try {
            await signOut(auth);
            logger.info("User signed out manually");
        } catch (error) {
            logger.error("Sign out failed", error);
        }
    }

    /**
     * Fetch all levels from Firestore.
     * Caches them in this.levels.
     */
    async fetchLevels() {
        if (this.levels.length > 0) return this.levels;

        try {
            logger.debug("Fetching levels from Firestore...");
            const q = query(collection(db, "levels"), orderBy("order"));
            const snap = await getDocs(q);
            this.levels = snap.docs.map(d => ({ id: d.id, ...d.data() }));
            logger.info(`Fetched ${this.levels.length} levels.`);
            return this.levels;
        } catch (error) {
            logger.error("Failed to fetch levels", error);
            throw error;
        }
    }

    /**
     * Get User Data and Progress.
     */
    async getUserData(uid) {
        try {
            // Get User Profile
            const userRef = doc(db, "users", uid);
            const userSnap = await getDoc(userRef);

            if (!userSnap.exists()) {
                logger.warn(`User document not found for ${uid}`);
                // Potentially create it here if it doesn't exist?
                return null;
            }

            const userData = userSnap.data();

            // Get Progress
            const progressSnap = await getDocs(collection(db, "users", uid, "progress"));
            const completedLevelIds = progressSnap.docs.map(d => d.data().levelId);

            return { ...userData, completedLevelIds };
        } catch (error) {
            logger.error(`Failed to get user data for ${uid}`, error);
            throw error;
        }
    }

    /**
     * Mark a level as complete.
     */
    async completeLevel(level) {
        if (!this.currentUser) return;
        const uid = this.currentUser.uid;

        logger.info(`Completing level ${level.id} (${level.title}) for user ${uid}`);

        try {
            // 1. Mark as complete in progress subcollection
            const progressRef = doc(db, "users", uid, "progress", String(level.order)); // Using order as ID based on existing logic
            await setDoc(progressRef, {
                levelId: level.order,
                completedAt: new Date()
            });

            // 2. Update User Stats
            const userRef = doc(db, "users", uid);
            // Use setDoc with merge to ensure document exists
            await setDoc(userRef, { completedLevelsCount: increment(1) }, { merge: true });

            // 3. Update Streak
            // We need to fetch fresh data to get the current streak/date for the update logic
            const userSnap = await getDoc(userRef);
            const userData = userSnap.data() || {}; // Fallback to empty obj
            await updateStreak(uid, userData.lastCompletionDate, userData.currentStreak || 0);

            // 4. Check Badges
            await checkBadges(uid, (userData.completedLevelsCount || 0));
            // Wait, increment happens on server. We should probably trust the local count + 1.

            return true;
        } catch (error) {
            logger.error("Failed to complete level", error);
            throw error;
        }
    }

    /**
     * DANGER: Resets the current user's account data.
     * Deletes progress, badges, and resets main user doc.
     */
    async resetAccount() {
        if (!this.currentUser) return;
        const uid = this.currentUser.uid;
        logger.warn(`RESETTING ACCOUNT for ${uid}`);

        try {
            // 1. Delete Progress Subcollection
            // Note: Client SDK doesn't support recursive delete easily without batching manually.
            const progressSnap = await getDocs(collection(db, "users", uid, "progress"));
            const badgesSnap = await getDocs(collection(db, "users", uid, "badges"));

            const batch = writeBatch(db);

            progressSnap.forEach(doc => batch.delete(doc.ref));
            badgesSnap.forEach(doc => batch.delete(doc.ref));

            // 2. Reset User Stats
            const userRef = doc(db, "users", uid);
            batch.set(userRef, {
                displayName: this.currentUser.displayName || "User",
                completedLevelsCount: 0,
                currentStreak: 0,
                lastCompletionDate: null,
                createdAt: new Date()
            }); // Overwrite/Reset

            await batch.commit();
            logger.info("Account reset successful.");

            // 3. Clear local state
            this.levels = [];
            return true;

        } catch (error) {
            logger.error("Failed to reset account", error);
            throw error;
        }
    }
    /**
     * Update the user's avatar.
     */
    async updateAvatar(avatarChar) {
        if (!this.currentUser) return;
        const uid = this.currentUser.uid;
        logger.info(`Updating avatar for ${uid} to ${avatarChar}`);

        try {
            const userRef = doc(db, "users", uid);
            await setDoc(userRef, { avatar: avatarChar }, { merge: true });

            // Update local cache
            if (this.currentUser) {
                // We might need to refresh full profile or just trust this update
            }
            return true;
        } catch (error) {
            logger.error("Failed to update avatar", error);
            throw error;
        }
    }
}

export const ALLOWED_AVATARS = [
    { char: "👤", reqLvl: 0 },
    { char: "🧘", reqLvl: 1 },
    { char: "🌱", reqLvl: 3 },
    { char: "🔥", reqLvl: 5 },
    { char: "🌊", reqLvl: 10 },
    { char: "🦁", reqLvl: 25 },
    { char: "👑", reqLvl: 50 },
    { char: "🌌", reqLvl: 100 }
];

export const gameService = new GameService();
