const socket = io();
let role;
const delay = ms => new Promise(res => setTimeout(res, ms));
let myGroup = "";

function playMusic(musica) {
  const audio = new Audio(musica + '.mp3');
  audio.play();

  audio.volume = 0.2;
}

document.getElementById('joinBtn').addEventListener('click', () => {
  const name = document.getElementById('name').value;
  if (name) {
    socket.emit('join', name);
    document.getElementById('login').style.display = 'none';
    document.getElementById('lobby').style.display = 'block';
  }
});

socket.on('role', (assignedRole) => {
  role = assignedRole;
  if (role === 'owner') {
    document.getElementById('startGameBtn').style.display = 'block';
  }
});

function generateRandomNeonColor() {
  const neonHex = [
      '#00FF00', '#FF00FF', '#00FFFF', '#FF0000', '#FFFF00', 
      '#00FFCC', '#FF33CC', '#33FF00', '#FF6600', '#CC00FF', 
      '#33FFFF', '#FF0066', '#99FF00', '#CCFF00', '#FF6699'
  ];

  // Escolhe uma cor aleatória
  const selectedColor = neonHex[Math.floor(Math.random() * neonHex.length)];

  // Calcula a versão 5% mais clara da cor
  const lighterColor = neonHex[Math.floor(Math.random() * neonHex.length)];

  // Gera um ângulo aleatório para o gradiente (de 0 a 360)
  const angle = Math.floor(Math.random() * 361);

  // Cria o gradiente CSS com o ângulo e as duas cores
  const gradient = `linear-gradient(${angle}deg, ${selectedColor}, ${lighterColor})`;
  const boxshadow = `0px 0px 5px 0px ${selectedColor}, 0px 0px 5px 0px ${lighterColor}`

  return { selectedColor, lighterColor, gradient, boxshadow };
}

socket.on('updatePlayers', ({ owner, players }) => {
  const playersList = document.getElementById('playersList');
  playersList.innerHTML = '';

  if (owner) {
    const ownerItem = document.createElement('div');
    ownerItem.textContent = `Owner:${owner.name}`;
    ownerItem.className = "playercard"
    playersList.appendChild(ownerItem);
  }

  players.forEach((player) => {
    const playerItem = document.createElement('div');
    playerItem.textContent = player.name;
    playerItem.className = "playercard"
    playersList.appendChild(playerItem);
  });

  let playerList = document.getElementsByClassName("playercard");
  for(let player of playerList){
    let gradValue = generateRandomNeonColor();
    player.style.background = gradValue.gradient;
    player.style.boxShadow  = gradValue.boxshadow;
  }
});

document.getElementById('startGameBtn').addEventListener('click', () => {
  socket.emit('startGame');
});

socket.on('gameStarted', ({ groupA, groupB, points }) => {
    document.getElementById('lobby').style.display = 'none';
    document.getElementById('game').style.display = 'block';
    document.getElementById('pointsA').textContent = points.A;
    document.getElementById('pointsB').textContent = points.B;

    playMusic('loop');
  
    if (role === 'player') {
      document.getElementById('buzzBtn').style.display = 'block'; // Mostra o botão para jogadores
    } else if (role === 'owner') {
      document.getElementById('ownerControls').style.display = 'block'; // Controles do dono
    }
  });
socket.on('nextQuestion', async (question) => {
  let questionLetter = ['A', 'B', 'C', 'D']
  document.getElementById('question').textContent = question.question;
  document.getElementById('question_view').textContent = question.question;
  let letterIndex = question.options.indexOf(question.answer);

  document.getElementById('answer').textContent = questionLetter[letterIndex] + ". " + question.answer;

  let resposta = document.getElementsByClassName('resp_text');
  resposta[0].textContent = question.options[0];
  resposta[1].textContent = question.options[1];
  resposta[2].textContent = question.options[2];
  resposta[3].textContent = question.options[3];
  await delay(2000);
  startAni();
  playMusic('musica_tema');
});

socket.on('updatePoints', (points) => {
  document.getElementById('pointsA').textContent = points.A;
  document.getElementById('pointsB').textContent = points.B;
});

socket.on('playerBuzzed', ({ playerName, playerGroup }) => {
  document.getElementById('buzzedPlayer').textContent = `${playerName} from Team ${playerGroup} buzzed in!`;
});
  
socket.on('statusMusica', () => {
  console.log(correct);
  if(correct){
    playMusic('certa');
  }else{
    playMusic('errou');
  }
});

document.getElementById('buzzBtn').addEventListener('click', () => {
  socket.emit('buzz');
});

document.getElementById('correctBtn').addEventListener('click', () => {
  socket.emit('judge', { correct: true });
  document.getElementById('buzzedPlayer').textContent = `Esperando algum player apertar o botão`;
  endAni();
});

document.getElementById('wrongBtn').addEventListener('click', () => {
  socket.emit('judge', { correct: false });
  document.getElementById('buzzedPlayer').textContent = `Esperando algum player apertar o botão`;
  endAni();
});

socket.on('musica', (data)=>{
  playMusic(data);
})


socket.on('gameOver', (points) => {
  alert(`Game Over! Final Score - Team A: ${points.A}, Team B: ${points.B}`);
  document.getElementById('buzzBtn').style.display = 'none';
});

socket.on('groupInfo', (group) => {
  const roleElement = document.getElementById('role');
  roleElement.textContent = `You are in Team ${group}`;
  roleElement.style.color = group === 'A' ? 'blue' : 'red';
  myGroup = group;
});

async function startAni(){
  let aniQuest = document.getElementById('question_container');
  let aniResp = document.getElementsByClassName('resposta');

  aniQuest.style.opacity = "1";
  for(let i of aniResp){
    i.style.marginLeft = "0%";
    await delay(300);
  }
}

function endAni(){
  let aniQuest = document.getElementById('question_container');
  let aniResp = document.getElementsByClassName('resposta');

  aniQuest.style.opacity = "0";
  for(let i of aniResp){
    i.style.marginLeft = "-100%";
  }
}
  
