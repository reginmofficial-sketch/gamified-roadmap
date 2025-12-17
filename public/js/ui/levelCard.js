export function renderLevel(level, unlocked, completed, onComplete) {
  const div = document.createElement("div");
  div.className = "bg-white p-4 rounded shadow";

  div.innerHTML = `
    <h3 class="font-bold">${level.levelName}</h3>
    <p class="text-sm">${level.description}</p>
    <p class="text-xs text-gray-500">${level.instructions}</p>
  `;

  if (unlocked && !completed) {
    const btn = document.createElement("button");
    btn.textContent = "Completed";
    btn.className = "mt-2 bg-green-600 text-white px-3 py-1 rounded";
    btn.onclick = onComplete;
    div.appendChild(btn);
  }

  if (!unlocked) {
    div.classList.add("opacity-50");
  }

  return div;
}
