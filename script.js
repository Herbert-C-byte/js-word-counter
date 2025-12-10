function animateValue(id, start, end, duration, suffix = "") {
  
  // Evita animação impossível (divisão por zero)
  if (start === end) {
    document.getElementById(id).textContent = end + suffix;
    return;
  }

  const obj = document.getElementById(id);
  const range = end - start;
  // Garante tempo mínimo entre updates
  const stepTime = Math.max(duration / Math.abs(range), 10);
  let current = start;
  const increment = end > start ? 1 : -1;
  console.log("This is working")

  const timer = setInterval(() => {
    current += increment;
    obj.textContent = current + suffix;

    if (current === end) clearInterval(timer);
  }, stepTime);
}

function countAll() {
  const text = document.getElementById("input").value.trim();

  const wordCount = text === "" ? 0 : text.split(/\s+/).filter(w => w.length > 0).length;
  const charCount = text.length;
 

  // Get current numbers to animate smoothly
  const currentWords = parseInt(document.getElementById("wordCount").textContent) || 0;
  const currentChars = parseInt(document.getElementById("charCount").textContent) || 0;

  animateValue("wordCount", currentWords, wordCount, 10, " Words");
  animateValue("charCount", currentChars, charCount, 10, " Characters");
}

function copyText() {
  const text = document.getElementById("input").value;
  navigator.clipboard.writeText(text).then(() => {
    const btn = document.querySelector(".copy-btn");
    const original = btn.textContent;
    console.log("Text copied to clipboard");

    btn.textContent = "Copied!";
    btn.style.transform = "scale(1.08)";
    btn.style.background = "#0a0";

    setTimeout(() => {
      btn.textContent = original;
      btn.style.transform = "scale(1)";
      btn.style.background = "#444";
    }, 1000);
  });
}
