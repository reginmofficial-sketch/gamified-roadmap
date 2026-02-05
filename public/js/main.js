import { gameService } from "./services/gameService.js";
import { uiManager } from "./ui/uiManager.js";
import { logger } from "./core/logger.js";

/**
 * Main Controller
 */
async function initApp() {
  logger.info("Application starting...");

  gameService.initAuth(async (state) => {
    if (state.error) {
      logger.error("State error:", state.error);
      uiManager.showError("Failed to load data: " + state.error.message);
      return;
    }

    const { user, userData, levels } = state;

    if (!user) {
      // Redirect if not logged in
      // Check if we are already on index.html to avoid loop
      if (!window.location.pathname.endsWith("index.html") && window.location.pathname !== "/") {
        logger.info("Redirecting to login...");
        window.location.href = "index.html";
      }
      return;
    }

    // We are logged in
    if (userData && levels && levels.length > 0) {
      // Update Header
      uiManager.updateHeader(user, userData);

      // Render Roadmap
      render(levels, userData.completedLevelIds);
    } else {
      logger.warn("Data missing or empty.");
      uiManager.updateHeader(user, userData || { displayName: "Explorer" });
      uiManager.showError("No roadmap levels found.");
    }
  });
}

function render(levels, completedLevelIds) {
  uiManager.renderRoadmap(levels, completedLevelIds, async (level) => {
    try {
      await gameService.completeLevel(level);
      uiManager.showCelebration();

      // Refresh Data to re-render
      const user = gameService.currentUser;
      const newData = await gameService.getUserData(user.uid);

      // Optimistic update or full re-render
      uiManager.updateHeader(user, newData);
      render(levels, newData.completedLevelIds);

      logger.info("Level completion flow finished.");
    } catch (error) {
      logger.error("Error in level completion flow", error);
      alert("Something went wrong completing the level. Check console.");
    }
  });
}

// Start
initApp();
