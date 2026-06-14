const input = document.getElementById("input");
const wordCountEl = document.getElementById("wordCount");
const charCountEl = document.getElementById("charCount");
const sentenceCountEl = document.getElementById("sentenceCount");
const paragraphCountEl = document.getElementById("paragraphCount");
const avgWordLengthEl = document.getElementById("avgWordLength");
const avgSentenceLengthEl = document.getElementById("avgSentenceLength");
const readingTimeEl = document.getElementById("readingTime");
const verifyBtn = document.getElementById("verifyBtn");
const copyBtn = document.getElementById("copyBtn");
const clearBtn = document.getElementById("clearBtn");
const upperBtn = document.getElementById("upperBtn");
const lowerBtn = document.getElementById("lowerBtn");
const titleBtn = document.getElementById("titleBtn");
const freqBtn = document.getElementById("freqBtn");
const exportBtn = document.getElementById("exportBtn");
const pasteBtn = document.getElementById("pasteBtn");
const themeToggle = document.getElementById("themeToggle");
const freqResultsEl = document.getElementById("freqResults");

function getCounts(text) {
  const chars = text.length;
  const wordMatches = text.match(/\b\S+\b/g) || [];
  const words = text.trim() === "" ? 0 : wordMatches.length;

  const sentences =
    text.trim() === ""
      ? 0
      : text
          .trim()
          .split(/[.!?]+/)
          .filter(Boolean).length;

  const paragraphs =
    text.trim() === ""
      ? 0
      : text
          .trim()
          .split(/\r?\n\s*\r?\n/)
          .filter((p) => p.trim().length > 0).length;

  const totalWordChars = wordMatches.reduce((sum, word) => {
    return sum + word.replace(/[^A-Za-z0-9]/g, "").length;
  }, 0);
  const avgWordLength = words === 0 ? 0 : (totalWordChars / words).toFixed(2);

  const avgSentenceLength =
    sentences === 0 ? 0 : (words / sentences).toFixed(2);
  const readingTime = words === 0 ? "0 min" : `${Math.ceil(words / 200)} min`;

  return {
    words,
    chars,
    sentences,
    paragraphs,
    avgWordLength,
    avgSentenceLength,
    readingTime,
  };
}

// Transformations: simple whole-text transforms
function transformText(mode) {
  if (!input) return;
  let v = input.value || "";
  if (mode === "upper") v = v.toUpperCase();
  if (mode === "lower") v = v.toLowerCase();
  if (mode === "title")
    v = v.toLowerCase().replace(/(^|\s)\S/g, (s) => s.toUpperCase());
  input.value = v;
  autosize();
  updateCounts();
}

function getTopWords(text, limit = 10) {
  const words = (text.match(/\b\S+\b/g) || [])
    .map((w) => w.toLowerCase().replace(/[^a-z0-9']/g, ""))
    .filter(Boolean);
  const freq = {};
  for (const w of words) freq[w] = (freq[w] || 0) + 1;
  const arr = Object.keys(freq).map((k) => ({ word: k, count: freq[k] }));
  arr.sort((a, b) => b.count - a.count || a.word.localeCompare(b.word));
  return arr.slice(0, limit);
}

function renderFreq(results) {
  if (!freqResultsEl) return;
  if (!results || results.length === 0) {
    freqResultsEl.textContent = "No words to analyze.";
    return;
  }
  const lines = results.map((r) => `${r.word} — ${r.count}`);
  freqResultsEl.innerHTML = `<strong>Top words</strong><br>${lines.join("<br>")}`;
}

function exportText() {
  const text = input.value || "";
  const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "text.txt";
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

async function pasteFromClipboard() {
  try {
    const txt = await navigator.clipboard.readText();
    input.value = (input.value || "") + txt;
    autosize();
    updateCounts();
  } catch (e) {
    console.warn("Paste failed", e);
  }
}

function applyTheme(dark) {
  document.documentElement.classList.toggle("dark", dark);
  try {
    localStorage.setItem("wc-dark", dark ? "1" : "0");
  } catch (e) {}
}

function animateValue(el, start, end, duration = 300) {
  start = Number(start) || 0;
  end = Number(end) || 0;
  if (start === end) {
    el.textContent = end;
    return;
  }

  const startTime = performance.now();
  function frame(now) {
    const t = Math.min((now - startTime) / duration, 1);
    const value = Math.round(start + (end - start) * t);
    el.textContent = value;
    if (t < 1) requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
}

function updateCounts() {
  const text = input.value || "";
  const {
    words,
    chars,
    sentences,
    paragraphs,
    avgWordLength,
    avgSentenceLength,
    readingTime,
  } = getCounts(text);
  const curWords = parseInt(wordCountEl.textContent) || 0;
  const curChars = parseInt(charCountEl.textContent) || 0;
  const curSentences = parseInt(sentenceCountEl.textContent) || 0;
  const curParagraphs = parseInt(paragraphCountEl.textContent) || 0;
  animateValue(wordCountEl, curWords, words, 300);
  animateValue(charCountEl, curChars, chars, 300);
  animateValue(sentenceCountEl, curSentences, sentences, 300);
  animateValue(paragraphCountEl, curParagraphs, paragraphs, 300);
  avgWordLengthEl.textContent = avgWordLength;
  avgSentenceLengthEl.textContent = avgSentenceLength;
  readingTimeEl.textContent = readingTime;
}

function debounce(fn, wait = 220) {
  let t;
  return (...args) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...args), wait);
  };
}

const debouncedUpdate = debounce(updateCounts, 220);

function autosize() {
  if (!input) return;
  input.style.height = "auto";
  input.style.height =
    Math.min(input.scrollHeight, window.innerHeight * 0.5) + "px";
}

function copyText() {
  const text = input.value || "";
  if (!navigator.clipboard) return;
  const btn = copyBtn;
  navigator.clipboard
    .writeText(text)
    .then(() => {
      const original = btn.textContent;
      btn.textContent = "Copied!";
      btn.style.transform = "scale(1.04)";
      btn.style.background = "#0a0";
      setTimeout(() => {
        btn.textContent = original;
        btn.style.transform = "";
        btn.style.background = "";
      }, 900);
    })
    .catch(() => {
      // fallback: select + execCommand (old browsers)
      input.select();
      try {
        document.execCommand("copy");
      } catch (e) {}
      window.getSelection().removeAllRanges();
    });
}

function clearText() {
  input.value = "";
  autosize();
  updateCounts();
}

// Events
input.addEventListener("input", () => {
  autosize();
  debouncedUpdate();
});
verifyBtn && verifyBtn.addEventListener("click", updateCounts);
copyBtn && copyBtn.addEventListener("click", copyText);
clearBtn && clearBtn.addEventListener("click", clearText);
upperBtn && upperBtn.addEventListener("click", () => transformText("upper"));
lowerBtn && lowerBtn.addEventListener("click", () => transformText("lower"));
titleBtn && titleBtn.addEventListener("click", () => transformText("title"));
freqBtn &&
  freqBtn.addEventListener("click", () =>
    renderFreq(getTopWords(input.value || "", 10)),
  );
exportBtn && exportBtn.addEventListener("click", exportText);
pasteBtn && pasteBtn.addEventListener("click", pasteFromClipboard);
themeToggle &&
  themeToggle.addEventListener("click", () => {
    const dark = !document.documentElement.classList.contains("dark");
    applyTheme(dark);
  });

// Initialize
document.addEventListener("DOMContentLoaded", () => {
  autosize();
  updateCounts();
  try {
    const pref = localStorage.getItem("wc-dark");
    applyTheme(pref === "1");
  } catch (e) {}
  if (freqResultsEl) freqResultsEl.textContent = "";
});
