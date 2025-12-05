function countAll() {
      const text = document.getElementById("input").value.trim();

      // Count words
      const words = text === "" ? 0 : text.split(/\s+/).filter(w => w !== "").length;

      // Count characters (including spaces)
      const chars = text.length;

      // Update UI
      document.getElementById("wordCount").textContent = words + " Words";
      document.getElementById("charCount").textContent = chars + " Letters";
    }