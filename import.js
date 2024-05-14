document.getElementById("file-input").addEventListener("change", function () {
  const fileInput = this;
  if (fileInput.files.length > 0) {
    const reader = new FileReader();
    reader.onload = function (e) {
      const ratings = JSON.parse(e.target.result);
      chrome.runtime.sendMessage({ type: "import", data: ratings }, () => {
        alert("Ratings imported successfully!");
        window.close(); // Close the popup after import
      });
    };
    reader.readAsText(fileInput.files[0]);
  }
});
