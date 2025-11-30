export function notifySuccess(msg) {
  createToast(msg, "success");
}
export function notifyError(msg) {
  createToast(msg, "error");
}
function createToast(msg, type = "info") {
  const el = document.createElement("div");
  el.className = `toast fixed right-4 bottom-4 mb-2 max-w-xs p-3 rounded shadow-lg text-sm ${
    type === "success"
      ? "bg-green-600 text-white"
      : type === "error"
      ? "bg-red-600 text-white"
      : "bg-slate-800 text-white"
  }`;
  el.style.zIndex = 9999;
  el.innerText = msg;
  document.body.appendChild(el);
  setTimeout(() => {
    el.style.transition = "opacity .25s, transform .25s";
    el.style.opacity = "0";
    el.style.transform = "translateY(12px)";
  }, 2300);
  setTimeout(() => {
    document.body.removeChild(el);
  }, 2600);
}