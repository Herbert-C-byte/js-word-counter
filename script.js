function animateValue(id, start, end, duration, suffix = "") {
  const obj = document.getElementById(id);
  const range = end - start;
  const stepTime = Math.abs(Math.floor(duration / range)) || 20;
  let current = start;
  const increment = end > start ? 1 : -1;

  const timer = setInterval(() => {
    current += increment;
    obj.textContent = current + suffix;

    if (current === end) clearInterval(timer);
  }, stepTime);
}

function countAll() {
  const text = document.getElementById("input").value.trim();

  const wordCount = text === "" ? 0 : text.split(/\s+/).length;
  const charCount = text.length;

  // Get current numbers to animate smoothly
  const currentWords = parseInt(document.getElementById("wordCount").textContent);
  const currentChars = parseInt(document.getElementById("charCount").textContent);

  animateValue("wordCount", currentWords, wordCount, 400, " Words");
  animateValue("charCount", currentChars, charCount, 400, " Characters");
}

function copyText() {
  const text = document.getElementById("input").value;
  navigator.clipboard.writeText(text).then(() => {
    const btn = document.querySelector(".copy-btn");
    const original = btn.textContent;
    console.log("Text copied to clipboard");

    btn.textContent = "Copied!";
    btn.style.transform = "scale(1.05)";
    btn.style.background = "#0a0";

    setTimeout(() => {
      btn.textContent = original;
      btn.style.transform = "scale(1)";
      btn.style.background = "#444";
    }, 1000);
  });
}
