const input = document.getElementById('input');
const wordCountEl = document.getElementById('wordCount');
const charCountEl = document.getElementById('charCount');
const sentenceCountEl = document.getElementById('sentenceCount');
const paragraphCountEl = document.getElementById('paragraphCount');
const avgWordLengthEl = document.getElementById('avgWordLength');
const avgSentenceLengthEl = document.getElementById('avgSentenceLength');
const verifyBtn = document.getElementById('verifyBtn');
const copyBtn = document.getElementById('copyBtn');
const clearBtn = document.getElementById('clearBtn');

function getCounts(text){
  const chars = text.length;
  const words = text.trim() === '' ? 0 : (text.match(/\b\S+\b/g) || []).length;
  
  // Sentences: split by period, exclamation, or question mark
  const sentences = text.trim() === '' ? 0 : (text.match(/[.!?]+/g) || []).length;
  
  // Paragraphs: split by double newlines or single newlines
  const paragraphs = text.trim() === '' ? 0 : text.trim().split(/\n\n+|\n/).filter(p => p.trim().length > 0).length;
  
  // Average word length
  const avgWordLength = words === 0 ? 0 : (chars / words).toFixed(2);
  
  // Average sentence length
  const avgSentenceLength = sentences === 0 ? 0 : (words / sentences).toFixed(2);
  
  return { words, chars, sentences, paragraphs, avgWordLength, avgSentenceLength };
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
  const { words, chars, sentences, paragraphs, avgWordLength, avgSentenceLength } = getCounts(text);
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
