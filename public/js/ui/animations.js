export function celebrate() {
  document.body.classList.add("bg-green-100");
  setTimeout(() => document.body.classList.remove("bg-green-100"), 300);
}
