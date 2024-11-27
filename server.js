const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

let players = [];
let owner = null;
const playerNames = {};
let groupA = [];
let groupB = [];
let questionIndex = 0;
let gameStarted = false;
let buzzedPlayer = null;
let points = { A: 0, B: 0 };

const questions = [
  { 
    question: "O que significa AWS?", 
    options: ["Amazon Web Services", "Advanced Web System", "Active Web Server", "Application Web Services"], 
    answer: "Amazon Web Services" 
  },
  { 
    question: "Qual serviço da AWS é usado para armazenar objetos?", 
    options: ["Amazon EC2", "Amazon RDS", "Amazon S3", "AWS Lambda"], 
    answer: "Amazon S3" 
  },
  { 
    question: "O que é Amazon EC2?", 
    options: ["Um banco de dados relacional", "Um serviço de armazenamento de objetos", "Um serviço de computação em nuvem", "Um serviço de balanceamento de carga"], 
    answer: "Um serviço de computação em nuvem" 
  },
  { 
    question: "Qual serviço da AWS é ideal para bancos de dados relacionais?", 
    options: ["Amazon S3", "Amazon RDS", "AWS Lambda", "Amazon DynamoDB"], 
    answer: "Amazon RDS" 
  },
  { 
    question: "O que o AWS Lambda permite?", 
    options: ["Criar máquinas virtuais", "Executar código sem gerenciar servidores", "Armazenar dados em blocos", "Criar redes virtuais privadas"], 
    answer: "Executar código sem gerenciar servidores" 
  },
  { 
    question: "Qual serviço da AWS oferece balanceamento de carga?", 
    options: ["Amazon ELB", "Amazon RDS", "AWS Glue", "Amazon VPC"], 
    answer: "Amazon ELB" 
  },
  { 
    question: "O que é Amazon VPC?", 
    options: ["Um serviço para criar redes virtuais privadas", "Um banco de dados em nuvem", "Uma ferramenta de monitoramento", "Um serviço de armazenamento de blocos"], 
    answer: "Um serviço para criar redes virtuais privadas" 
  },
  { 
    question: "Qual serviço é usado para monitorar recursos da AWS?", 
    options: ["Amazon EC2", "Amazon CloudWatch", "Amazon Route 53", "Amazon S3"], 
    answer: "Amazon CloudWatch" 
  },
  { 
    question: "Qual serviço da AWS oferece um CDN?", 
    options: ["Amazon CloudFront", "Amazon S3", "Amazon EC2", "Amazon DynamoDB"], 
    answer: "Amazon CloudFront" 
  },
  { 
    question: "Qual serviço da AWS gerencia chaves de criptografia?", 
    options: ["Amazon KMS", "Amazon RDS", "Amazon S3", "AWS IAM"], 
    answer: "Amazon KMS" 
  },
  { 
    question: "O que é Amazon DynamoDB?", 
    options: ["Um serviço de banco de dados não relacional", "Um serviço de balanceamento de carga", "Um serviço de análise de dados", "Um serviço de redes privadas"], 
    answer: "Um serviço de banco de dados não relacional" 
  },
  { 
    question: "Qual serviço da AWS é usado para controle de acesso?", 
    options: ["Amazon VPC", "AWS IAM", "Amazon CloudTrail", "Amazon EC2"], 
    answer: "AWS IAM" 
  },
  { 
    question: "O que é Amazon CloudTrail?", 
    options: ["Um serviço de monitoramento de rede", "Um serviço para auditoria e logs", "Um serviço de análise de dados", "Um serviço de automação"], 
    answer: "Um serviço para auditoria e logs" 
  },
  { 
    question: "Qual é o principal serviço de orquestração de containers da AWS?", 
    options: ["Amazon ECS", "Amazon S3", "AWS Glue", "AWS Lambda"], 
    answer: "Amazon ECS" 
  },
  { 
    question: "Qual serviço da AWS é usado para criar pipelines de dados?", 
    options: ["AWS Glue", "Amazon VPC", "Amazon EC2", "Amazon RDS"], 
    answer: "AWS Glue" 
  },
  { 
    question: "Qual serviço oferece IA e aprendizado de máquina na AWS?", 
    options: ["Amazon Sagemaker", "Amazon S3", "Amazon EC2", "Amazon DynamoDB"], 
    answer: "Amazon Sagemaker" 
  },
  { 
    question: "O que o AWS Fargate permite?", 
    options: ["Gerenciar clusters Kubernetes", "Executar containers sem gerenciar servidores", "Criar redes privadas", "Monitorar logs de eventos"], 
    answer: "Executar containers sem gerenciar servidores" 
  },
  { 
    question: "O que o Amazon Route 53 faz?", 
    options: ["Gerencia armazenamento", "Executa bancos de dados", "Oferece DNS e roteamento", "Gerencia máquinas virtuais"], 
    answer: "Oferece DNS e roteamento" 
  },
  { 
    question: "O que o AWS CloudFormation permite?", 
    options: ["Armazenar dados estruturados", "Gerenciar chaves de criptografia", "Automatizar infraestrutura como código", "Monitorar consumo de recursos"], 
    answer: "Automatizar infraestrutura como código" 
  },
  { 
    question: "Qual serviço é usado para backups automáticos?", 
    options: ["AWS Backup", "Amazon S3", "AWS IAM", "Amazon EC2"], 
    answer: "AWS Backup" 
  }
];

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.render('index');
});

io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);

  socket.on('join', (name) => {
    playerNames[socket.id] = name;

    if (!owner) {
      owner = { id: socket.id, name };
      io.to(socket.id).emit('role', 'owner');
    } else {
      players.push({ id: socket.id, name });
      io.to(socket.id).emit('role', 'player');
    }

    io.emit('updatePlayers', { owner, players });
  });

  socket.on('startGame', () => {
    if (socket.id === owner.id && !gameStarted) {
      divideIntoGroups();
      gameStarted = true;
      questionIndex = 0;
      points = { A: 0, B: 0 };
      buzzedPlayer = null;
  
      io.emit('gameStarted', { groupA, groupB, points });
      io.emit('nextQuestion', questions[questionIndex]);
  
      // Informe cada jogador sobre o grupo dele
      groupA.forEach((playerId) => {
        io.to(playerId).emit('groupInfo', 'A');
      });
      groupB.forEach((playerId) => {
        io.to(playerId).emit('groupInfo', 'B');
      });
    }
  });
  socket.on('buzz', () => {
    if (gameStarted && !buzzedPlayer) {
      buzzedPlayer = socket.id;
      const playerName = playerNames[socket.id];
  
      // Descobrir o time do jogador
      const playerGroup = groupA.includes(socket.id) ? 'A' : 'B';
  
      // Enviar para o dono a informação de qual jogador apertou o botão e seu time
      io.to(owner.id).emit('playerBuzzed', {
        playerId: socket.id,
        playerName,
        playerGroup, // Informa o time do jogador
      });
    }
  });
  

  socket.on('judge', ({ playerId, correct }) => {
    if (socket.id === owner.id) {
      const group = groupA.includes(buzzedPlayer) ? 'A' : 'B';
      if (correct) {
        points[group] += 100;
        io.emit('musica', 'certa');
      } else {
        const otherGroup = group === 'A' ? 'B' : 'A';
        points[otherGroup] += 100;
        io.emit('musica', 'errou');
      }

      questionIndex++;
      buzzedPlayer = null;

      if (questionIndex < questions.length) {
        io.emit('updatePoints', points);
        io.emit('nextQuestion', questions[questionIndex]);
      } else {
        io.emit('gameOver', points);
        gameStarted = false;
      }
    }
  });

  socket.on('disconnect', () => {
    if (socket.id === owner?.id) {
      owner = null;
      players = [];
      groupA = [];
      groupB = [];
      gameStarted = false;
    } else {
      players = players.filter((player) => player.id !== socket.id);
      groupA = groupA.filter((id) => id !== socket.id);
      groupB = groupB.filter((id) => id !== socket.id);
    }
    delete playerNames[socket.id];
    io.emit('updatePlayers', { owner, players });
  });

  function divideIntoGroups() {
    groupA = [];
    groupB = [];
    players.sort(() => Math.random() - 0.5); // Shuffle players
    players.forEach((player, index) => {
      if (index % 2 === 0) {
        groupA.push(player.id);
      } else {
        groupB.push(player.id);
      }
    });
  }
});

server.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});
