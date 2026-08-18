import { showToast } from '../ui/modals.js';

function getRecognition() {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) return null;
  const recognition = new SpeechRecognition();
  recognition.lang = 'he-IL';
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;
  return recognition;
}

export function initVoiceInput() {
  const btn = document.getElementById('voiceBtn');
  const nameInput = document.getElementById('itemName');

  btn.addEventListener('click', () => {
    const recognition = getRecognition();
    if (!recognition) {
      showToast('זיהוי קול אינו נתמך בדפדפן זה');
      return;
    }
    btn.textContent = '🔴';
    recognition.start();

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      nameInput.value = transcript;
      nameInput.dispatchEvent(new Event('input'));
    };
    recognition.onerror = () => {
      showToast('שגיאה בזיהוי הקול, נסו שוב');
    };
    recognition.onend = () => {
      btn.textContent = '🎤';
    };
  });
}
