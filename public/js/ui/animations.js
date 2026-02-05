export function celebrate() {
  // Dynamically load canvas-confetti if not present
  if (!window.confetti) {
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/canvas-confetti@1.9.2/dist/confetti.browser.min.js';
    script.onload = () => triggerConfetti();
    document.body.appendChild(script);
  } else {
    triggerConfetti();
  }
}

function triggerConfetti() {
  // Fire a burst
  confetti({
    particleCount: 100,
    spread: 70,
    origin: { y: 0.6 }
  });

  // Also add a visual flash
  const flash = document.createElement('div');
  flash.className = 'fixed inset-0 bg-white/20 z-50 pointer-events-none transition-opacity duration-500';
  document.body.appendChild(flash);
  requestAnimationFrame(() => {
    flash.classList.add('opacity-0');
  });
  setTimeout(() => {
    flash.remove();
  }, 500);
}
