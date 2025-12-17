// ui/levelCard.js
export function renderLevel(level, unlocked, completed, onComplete) {
  const card = document.createElement("div");
  card.className = "level-card p-4 mb-3 border rounded bg-white shadow";

  const title = document.createElement("h2");
  title.textContent = level.levelName;
  title.className = "font-bold text-lg mb-2";
  card.appendChild(title);

  const desc = document.createElement("p");
  desc.textContent = level.description;
  card.appendChild(desc);

  if (!completed) {
    const btn = document.createElement("button");
    btn.textContent = "Completed ✅";
    btn.className = "mt-2 bg-green-500 text-white py-1 px-3 rounded";
    btn.disabled = !unlocked;
    btn.addEventListener("click", onComplete);
    card.appendChild(btn);
  } else {
    const done = document.createElement("span");
    done.textContent = "✅ Completed";
    done.className = "mt-2 text-green-600 font-bold";
    card.appendChild(done);
  }

  return card;
}
