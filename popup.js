document
  .getElementById("positive")
  .addEventListener("click", () => sendMessage("rate", "Positive"));
document
  .getElementById("neutral")
  .addEventListener("click", () => sendMessage("rate", "Neutral"));
document
  .getElementById("negative")
  .addEventListener("click", () => sendMessage("rate", "Negative"));
document
  .getElementById("remove")
  .addEventListener("click", () => sendMessage("rate", "Remove"));
document
  .getElementById("export")
  .addEventListener("click", () => sendMessage("export"));

document.getElementById("open-import").addEventListener("click", function () {
  chrome.windows.create({
    url: chrome.runtime.getURL("import.html"),
    type: "popup",
    width: 400,
    height: 300,
  });
});

function sendMessage(type, data = null) {
  console.log("Sending message:", { type, data });
  chrome.runtime.sendMessage({ type, data }, (response) => {
    console.log("Response:", response);
    window.close();
  });
}

document.getElementById("list-ratings").addEventListener("click", function () {
  chrome.windows.create({
    url: chrome.runtime.getURL("list.html"),
    type: "popup",
    width: 500,
    height: 600,
  });
});
