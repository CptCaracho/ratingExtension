chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.set({ ratings: {} });
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log("Message received:", request);
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs.length === 0) {
      return; // No active tabs found
    }
    const url = tabs[0].url;
    if (request.type === "rate") {
      handleRating(request, url, tabs[0].id);
      sendResponse();
    } else if (request.type === "export") {
      exportRatings();
      sendResponse();
    } else if (request.type === "import" && request.data) {
      importRatings(request.data);
      sendResponse();
      return true; // Indicates asynchronous response handling
    }
  });
  return true;
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === "complete") {
    updateIconBasedOnRating(tabId, tab.url);
  }
});

chrome.tabs.onActivated.addListener((activeInfo) => {
  chrome.tabs.get(activeInfo.tabId, (tab) => {
    updateIconBasedOnRating(tab.id, tab.url);
  });
});

function handleRating(request, url, tabId) {
  chrome.storage.sync.get("ratings", (data) => {
    let ratings = data.ratings || {};
    if (request.data === "Remove") {
      delete ratings[url];
    } else {
      ratings[url] = request.data;
    }
    chrome.storage.sync.set({ ratings: ratings }, () => {
      console.log(`Rating for ${url} updated to ${request.data}`);
      updateIcon(tabId, ratings[url]);
    });
  });
}

function updateIcon(tabId, rating) {
  console.log("Updating icon:", tabId, "Rating:", rating);
  if (rating) {
    const iconPath = `icon16_${rating}.png`;
    chrome.action.setIcon({ path: iconPath, tabId: tabId });
  } else {
    chrome.action.setIcon({
      path: {
        16: "icon16.png",
        48: "icon48.png",
        128: "icon128.png",
      },
      tabId: tabId,
    });
  }
}

function updateIconBasedOnRating(tabId, url) {
  chrome.storage.sync.get("ratings", (data) => {
    let ratings = data.ratings || {};
    const rating = ratings[url];
    updateIcon(tabId, rating);
  });
}

function exportRatings() {
  chrome.storage.sync.get("ratings", (data) => {
    const ratings = data.ratings || {};
    const blob = new Blob([JSON.stringify(ratings, null, 2)], {
      type: "application/json",
    });
    const reader = new FileReader();
    reader.onload = function () {
      chrome.downloads.download({
        url: reader.result,
        filename: "ratings.json",
      });
    };
    reader.readAsDataURL(blob);
  });
}

function importRatings(data) {
  chrome.storage.sync.set({ ratings: data }, () => {
    console.log("Ratings imported successfully.");
    chrome.tabs.query({}, (tabs) => {
      tabs.forEach((tab) => {
        const rating = data[tab.url];
        updateIcon(tab.id, rating);
      });
    });
  });
}
