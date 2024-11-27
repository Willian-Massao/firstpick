
# Quiz Challenge 🎯

Bem-vindo ao **Quiz Challenge**, um projeto desenvolvido como um desafio pessoal em apenas 1 dia! A aplicação é um quiz interativo, focado em proporcionar uma experiência dinâmica, com cores vivas e uma interface minimalista.

Este projeto foi inspirado pelo repositório [firstpick](https://github.com/Willian-Massao/firstpick) e adaptado para atender ao conceito de um quiz.

## 🛠️ Tecnologias Utilizadas

- **Front-end:**
  - HTML5, CSS3, JavaScript
  - Design minimalista com cores vivas
- **Back-end:**
  - Node.js com Express.js
  - Integração com Socket.IO para comunicação em tempo real
- **Hospedagem:**
  - Hospedagem propria, confira em https://quiz.japoneix.com

## 🚀 Funcionalidades

1. **Sistema de Perguntas e Respostas**  
   - Cada rodada apresenta uma pergunta com múltiplas alternativas.  
   - Pontuação calculada com base na resposta correta e no tempo de resposta.

2. **Ranking Dinâmico**  
   - Pontuação acumulada para cada jogador ao longo de múltiplas rodadas.  
   - Ranking atualizado em tempo real no front-end.

3. **Salas de Jogo**  
   - Compartilhamento de sala para que amigos possam jogar juntos.

4. **Design Vibrante**  
   - Interface estilosa com foco em cores vivas para manter o jogo dinâmico e divertido.  

## 📂 Estrutura do Projeto

```bash
firstpick-quiz/
├── public/
│   ├── css/
│   │   └── style.css         # Estilos do front-end
│   ├── js/
│   │   └── script.js         # Lógica do quiz e interações
│   └── index.html            # Página principal do quiz
├── src/
│   ├── routes/
│   │   └── quizRoutes.js     # Rotas específicas do jogo
│   ├── controllers/
│   │   └── quizController.js # Lógica do servidor
│   └── app.js                # Configuração do servidor Express
├── config/
│   └── db.js                 # Configuração do banco de dados
└── README.md                 # Documentação
```

## ⚙️ Como Rodar o Projeto

1. Clone o repositório:
   ```bash
   git clone https://github.com/Willian-Massao/firstpick
   cd firstpick
   ```

2. Instale as dependências:
   ```bash
   npm install
   ```

3. Configure o banco de dados:  
   - Crie um banco com o esquema fornecido no arquivo `quiz.sql`.  
   - Atualize as credenciais no arquivo `config/db.js`.

4. Inicie o servidor:
   ```bash
   npm start
   ```

5. Acesse no navegador:
   ```bash
   http://localhost:3000
   ```

## 📈 Próximos Passos

- Adicionar níveis de dificuldade ao quiz.  
- Implementar um timer para limitar o tempo de resposta.  
- Integrar com APIs externas para perguntas dinâmicas.

---

Com esse README, você pode documentar claramente seu projeto e facilitar a replicação por outros desenvolvedores. 🎉
