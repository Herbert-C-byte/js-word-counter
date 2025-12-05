function countWords() {
      const text = document.getElementById("input").value.trim();

      // Split by spaces and remove empty results
      const words = text === "" ? 0 : text.split(/\s+/).filter(w => w !== "").length;

      document.getElementById("count").textContent = words;
    }