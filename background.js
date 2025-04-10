
let activeTab = null;
let startTime = Date.now();

chrome.tabs.onActivated.addListener(({ tabId }) => {
  trackTime();
  activeTab = tabId;
  startTime = Date.now();
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (tab.active && tab.url) {
    trackTime();
    activeTab = tabId;
    startTime = Date.now();
  }
});

chrome.idle.onStateChanged.addListener((newState) => {
  if (newState === "idle" || newState === "locked") {
    trackTime();
  }
});

function trackTime() {
  if (activeTab !== null) {
    chrome.tabs.get(activeTab, (tab) => {
      const endTime = Date.now();
      const timeSpent = (endTime - startTime) / 1000;

      chrome.storage.local.get(["usage"], (result) => {
        const usage = result.usage || {};
        const domain = new URL(tab.url).hostname;

        if (!usage[domain]) usage[domain] = 0;
        usage[domain] += timeSpent;

        chrome.storage.local.set({ usage });
      });
    });
  }
}
