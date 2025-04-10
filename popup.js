
chrome.storage.local.get("usage", (result) => {
  const usage = result.usage || {};
  const container = document.getElementById("usage");

  Object.entries(usage).forEach(([site, seconds]) => {
    const minutes = (seconds / 60).toFixed(2);
    const div = document.createElement("div");
    div.textContent = `${site}: ${minutes} min`;
    container.appendChild(div);
  });
});
