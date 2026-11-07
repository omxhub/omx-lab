(() => {
  const root = document.documentElement;
  let theme = matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
  try {
    const saved = localStorage.getItem("omxhub-theme");
    if (saved === "light" || saved === "dark") theme = saved;
  } catch {}
  root.setAttribute("data-theme", theme);
  document
    .getElementById("meta-theme")
    ?.setAttribute("content", theme === "dark" ? "#141e30" : "#edf0f4");
})();
