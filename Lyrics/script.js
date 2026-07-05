const LYRICS = [
 {text: "I text a postcard sent to you", delay: 1500},
  {text: "Did it go through?", delay: 2400},
  {text: "Sendin' all my love to you", delay: 5400},
  {text: "You are the moonlight of my life", delay: 1200},
  {text: "Every night", delay: 3000},
  {text: "Givin' all my love to you", delay: 5450},
  {text: "My beatin' heart belongs to you", delay: 4700},
  {text: "I walked for miles 'til I found you", delay: 5200},
  {text: "I'm here to honour you", delay: 1100},
  {text: "If I lose everything in the fire", delay: 2500},
  {text: "I'm sendin' all my love to you.", delay: 10000},
];

const disc      = document.getElementById('disc');
const tonearm   = document.getElementById('tonearm');
const lyricEl   = document.getElementById('lyricLine');
const dotsWrap  = document.getElementById('dots');
const playBtn   = document.getElementById('playBtn');
const resetBtn  = document.getElementById('resetBtn');

let running = false;
let cancelled = false;

LYRICS.forEach((_, i) => {
  const d = document.createElement('span');
  d.dataset.i = i;
  dotsWrap.appendChild(d);
});
const dotEls = [...dotsWrap.children];

function setActiveDot(i){
  dotEls.forEach((d, idx) => d.classList.toggle('active', idx === i));
}

function typeLine(text, speed = 90){
  return new Promise(resolve => {
    lyricEl.innerHTML = '<span class="cursor"></span>';
    let i = 0;
    const cursor = lyricEl.querySelector('.cursor');
    const interval = setInterval(() => {
      if (cancelled){ clearInterval(interval); resolve(); return; }
      if (i >= text.length){
        clearInterval(interval);
        resolve();
        return;
      }
      const ch = document.createTextNode(text[i]);
      lyricEl.insertBefore(ch, cursor);
      i++;
    }, speed);
  });
}

function wait(ms){
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function play(){
  if (running) return;
  running = true;
  cancelled = false;
  playBtn.disabled = true;
  playBtn.textContent = '♪ Playing…';

  tonearm.classList.add('dropped');
  await wait(500);

  for (let i = 0; i < LYRICS.length; i++){
    if (cancelled) break;
    setActiveDot(i);
    const line = LYRICS[i];
    await typeLine(line.text);
    await wait(line.delay);
  }

  if (!cancelled){
    playBtn.disabled = false;
    playBtn.textContent = '▶ Play again';
  }
  running = false;
}

function reset(){
  cancelled = true;
  running = false;
  tonearm.classList.remove('dropped');
  lyricEl.innerHTML = '<span class="cursor"></span>';
  setActiveDot(-1);
  playBtn.disabled = false;
  playBtn.textContent = '▶ Drop the needle';
}

playBtn.addEventListener('click', play);
resetBtn.addEventListener('click', reset);


