document.addEventListener("DOMContentLoaded", function () {
  chrome.storage.sync.get("ratings", function (data) {
    const ratings = data.ratings || {};
    const listContainer = document.getElementById("ratings-list");

    for (const [url, rating] of Object.entries(ratings)) {
      const item = document.createElement("div");

      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.id = url;
      checkbox.style.marginRight = "10px";

      const urlDiv = document.createElement("div");
      urlDiv.className = "url";
      urlDiv.textContent = url;

      const ratingDiv = document.createElement("div");
      ratingDiv.className = "rating " + rating;
      ratingDiv.textContent = rating;

      item.appendChild(checkbox);
      item.appendChild(urlDiv);
      item.appendChild(ratingDiv);
      listContainer.appendChild(item);
    }
  });

  document
    .getElementById("remove-selected")
    .addEventListener("click", function () {
      if (confirm("Are you sure you want to remove selected ratings?")) {
        const checkboxes = document.querySelectorAll(
          'input[type="checkbox"]:checked',
        );
        chrome.storage.sync.get("ratings", function (data) {
          let ratings = data.ratings || {};
          checkboxes.forEach((chk) => {
            delete ratings[chk.id];
          });
          chrome.storage.sync.set({ ratings }, () => {
            window.close(); // Close the window after updating the ratings
          });
        });
      }
    });

  document
    .getElementById("close-window")
    .addEventListener("click", function () {
      window.close(); // Manually close the window
    });
});
