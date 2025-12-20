const faq = [
  { pergunta: "ração", resposta: "Misture 70kg milho, 25kg soja, 5kg núcleo mineral / 100kg ração (1,5% PV/dia). Fonte: SENAR/CNA." },
  { pergunta: "vacina", resposta: "Vacine clostridiose aos 3, 4 e 6 meses, depois anual. Consulte calendário CNA/SENAR." },
  { pergunta: "praga", resposta: "Observe manchas/furos/insetos. Envie foto para possível análise, ou leve ao técnico." },
  { pergunta: "financeiro", resposta: "Fotografe nota/comprovante e salve! Controle simples, offline." }
];
const msgs = document.getElementById('msgs');
const duvida = document.getElementById('duvida');
const formMsg = document.getElementById('form-msg');
const sendBtn = document.getElementById('sendBtn');
const imageBtn = document.getElementById('imageBtn');
const audioBtn = document.getElementById('audioBtn');
const imageInput = document.getElementById('imageInput');

function falarAssis(texto) {
  if ('speechSynthesis' in window) {
    let msg = new SpeechSynthesisUtterance(texto);
    msg.lang = 'pt-BR';
    window.speechSynthesis.speak(msg);
  }
}

function criarMsg(texto, autor, img=null, fala=false) {
  let card = document.createElement('div');
  card.className = 'card' + (autor==='user' ? ' user':'');
  let balloon = '';
  if (autor === 'assis') {
    balloon = `<div class="avatar"><img src="img/icone.png"/></div>
      <div class="assis-balloon" tabindex="0">${texto}
        <button class="play-audio-btn" title="Ouvir resposta" onclick="falarAssis('${texto.replace(/'/g,"\\'")}')" aria-label="ouvir resposta">
          <svg width="17" height="17" viewBox="0 0 24 24"><path d="M5 3v18l15-9L5 3z" fill="#fff"/></svg>
        </button>
      </div>`;
  } else {
    balloon = `<div class="user-balloon">${texto}</div>`;
    if (img) balloon += `<img src="${img}" class="foto-preview" alt="Imagem enviada" />`;
  }
  card.innerHTML = balloon;
  msgs.appendChild(card);
  msgs.scrollTop = msgs.scrollHeight;
  if (autor === 'assis' && fala) falarAssis(texto);
}

function buscarResposta(pergunta) {
  pergunta = pergunta.toLowerCase();
  for(const item of faq) {
    if(pergunta.includes(item.pergunta)) return item.resposta;
  }
  if(pergunta.includes('ração')) return "Me envie animal, peso e ingredientes para calcular a fórmula!";
  return "Sem resposta cadastrada. Procure um técnico CNA/SENAR ou aguarde atualização!";
}

formMsg.onsubmit = () => {
  const texto = duvida.value.trim();
  if(!texto) return false;
  criarMsg(texto, 'user');
  setTimeout(()=>{
    let resp = buscarResposta(texto);
    criarMsg(resp, 'assis', null, true);
  }, 250);
  duvida.value = '';
  return false;
};

imageBtn.onclick = () => imageInput.click();
imageInput.onchange = () => {
  const file = imageInput.files[0];
  if(!file) return;
  const url = URL.createObjectURL(file);
  criarMsg('Foto enviada:', 'user', url);
  setTimeout(()=>{
    criarMsg('Imagem registrada! Diagnóstico automático em breve.', 'assis', null, true);
  }, 250);
  imageInput.value = '';
};

let recognition = null;
if ('webkitSpeechRecognition' in window) {
  recognition = new webkitSpeechRecognition();
  recognition.lang = "pt-BR";
  recognition.continuous = false;
  recognition.interimResults = false;
  recognition.onresult = function(ev) {
    const texto = ev.results[0][0].transcript;
    duvida.value = texto;
    criarMsg(texto,'user');
    setTimeout(()=>{
      let resp = buscarResposta(texto);
      criarMsg(resp,'assis',null,true);
    },220);
  }
}
audioBtn.onclick = () => {
  if (!recognition) return alert("Gravação por voz não disponível neste navegador.");
  audioBtn.style.background='#1a8a4d';
  recognition.start();
  setTimeout(()=>{audioBtn.style.background='#29b86e';},1000);
};
