chrome.storage.sync.get("ratings", function (data) {
  const ratings = data.ratings || {};
  const url = window.location.href;
  const rating = ratings[url];

  if (rating) {
    const banner = document.createElement("div");
    banner.style.position = "fixed";
    banner.style.top = "0";
    banner.style.left = "0";
    banner.style.width = "100%";
    banner.style.textAlign = "center";
    banner.style.fontSize = "20px";
    banner.style.color = "white";
    banner.style.padding = "10px";
    banner.style.zIndex = "10000";

    if (rating === "Positive") {
      banner.style.backgroundColor = "green";
      banner.textContent = "Positive Rated";
    } else if (rating === "Negative") {
      banner.style.backgroundColor = "red";
      banner.textContent = "Negative Rated";
    } else if (rating === "Neutral") {
      banner.style.backgroundColor = "yellow";
      banner.style.color = "black";
      banner.textContent = "Neutral Rated";
    }

    document.body.appendChild(banner);

    // Optionally remove the banner after some time
    setTimeout(() => {
      document.body.removeChild(banner);
    }, 5000); // Removes the banner after 5 seconds
  }
});
