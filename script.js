const input = document.getElementById('input');
const wordCountEl = document.getElementById('wordCount');
const charCountEl = document.getElementById('charCount');
const verifyBtn = document.getElementById('verifyBtn');
const copyBtn = document.getElementById('copyBtn');
const clearBtn = document.getElementById('clearBtn');

function getCounts(text){
  const chars = text.length;
  const words = text.trim() === '' ? 0 : (text.match(/\b\S+\b/g) || []).length;
  return { words, chars };
}

function animateValue(el, start, end, duration = 300){
  start = Number(start) || 0;
  end = Number(end) || 0;
  if(start === end){ el.textContent = end; return; }

  const startTime = performance.now();
  function frame(now){
    const t = Math.min((now - startTime) / duration, 1);
    const value = Math.round(start + (end - start) * t);
    el.textContent = value;
    if(t < 1) requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
}

function updateCounts(){
  const text = input.value || '';
  const { words, chars } = getCounts(text);
  const curWords = parseInt(wordCountEl.textContent) || 0;
  const curChars = parseInt(charCountEl.textContent) || 0;
  animateValue(wordCountEl, curWords, words, 300);
  animateValue(charCountEl, curChars, chars, 300);
}

function debounce(fn, wait = 220){
  let t;
  return (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), wait); };
}

const debouncedUpdate = debounce(updateCounts, 220);

function autosize(){
  if(!input) return;
  input.style.height = 'auto';
  input.style.height = Math.min(input.scrollHeight, window.innerHeight * 0.5) + 'px';
}

function copyText(){
  const text = input.value || '';
  if(!navigator.clipboard) return;
  const btn = copyBtn;
  navigator.clipboard.writeText(text).then(() => {
    const original = btn.textContent;
    btn.textContent = 'Copied!';
    btn.style.transform = 'scale(1.04)';
    btn.style.background = '#0a0';
    setTimeout(() => { btn.textContent = original; btn.style.transform = ''; btn.style.background = ''; }, 900);
  }).catch(() => {
    // fallback: select + execCommand (old browsers)
    input.select();
    try{ document.execCommand('copy'); }catch(e){}
    window.getSelection().removeAllRanges();
  });
}

function clearText(){
  input.value = '';
  autosize();
  updateCounts();
}

// Events
input.addEventListener('input', () => { autosize(); debouncedUpdate(); });
verifyBtn && verifyBtn.addEventListener('click', updateCounts);
copyBtn && copyBtn.addEventListener('click', copyText);
clearBtn && clearBtn.addEventListener('click', clearText);

// Initialize
document.addEventListener('DOMContentLoaded', () => { autosize(); updateCounts(); });
