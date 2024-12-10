document.addEventListener('DOMContentLoaded', () => {
  const gameContainer = document.getElementById('gameContainer');
  const startButton = document.getElementById('startGame');
  const timerDisplay = document.getElementById('timer');
  const clicksDisplay = document.getElementById('clicks');
  const scoreDisplay = document.getElementById('score');
  const messageDisplay = document.getElementById('message');
  const difficultySelector = document.getElementById('difficulty');

  let flippedCards = [];
  let matchedPairs = 0;
  let timer;
  let gameDuration = 0;
  let totalClicks = 0;

  // Emojis usados para representar as cartas
  const emojis = [
    '🍎', '🍌', '🍇', '🍉', '🍒', '🍍', '🍓', '🥝', '🍑', '🍋', '🍈', '🥥'
  ];

  startButton.addEventListener('click', startGame);

  function startGame() {
    clearInterval(timer);
    resetGame();
    const difficulty = difficultySelector.value;

    let numberOfPairs = getPairsByDifficulty(difficulty);
    let emojiDeck = shuffle([...emojis.slice(0, numberOfPairs), ...emojis.slice(0, numberOfPairs)]);

    emojiDeck.forEach(emoji => {
      const card = createCard(emoji);
      gameContainer.appendChild(card);
    });

    timer = setInterval(() => {
      gameDuration++;
      const minutes = Math.floor(gameDuration / 60);
      const seconds = gameDuration % 60;
      timerDisplay.textContent = `${minutes}m ${seconds}s`;
    }, 1000);
  }

  function resetGame() {
    gameContainer.innerHTML = '';
    messageDisplay.textContent = '';
    flippedCards = [];
    matchedPairs = 0;
    totalClicks = 0;
    gameDuration = 0;
    clicksDisplay.textContent = 0;
    timerDisplay.textContent = '0m 0s';
  }

  function createCard(emoji) {
    const card = document.createElement('div');
    card.classList.add('card');
    card.dataset.emoji = emoji;

    const frontFace = document.createElement('div');
    frontFace.classList.add('card-front');
    frontFace.textContent = emoji;

    const backFace = document.createElement('div');
    backFace.classList.add('card-back');

    card.appendChild(frontFace);
    card.appendChild(backFace);

    card.addEventListener('click', () => handleCardClick(card));
    return card;
  }

  function handleCardClick(card) {
    if (card.classList.contains('flipped') || flippedCards.length === 2) return;

    card.classList.add('flipped');
    flippedCards.push(card);

    if (flippedCards.length === 2) {
      totalClicks++;
      clicksDisplay.textContent = totalClicks;

      if (flippedCards[0].dataset.emoji === flippedCards[1].dataset.emoji) {
        flippedCards.forEach(card => card.classList.add('matched'));
        flippedCards = [];
        matchedPairs++;
        if (matchedPairs === getPairsByDifficulty(difficultySelector.value)) {
          clearInterval(timer);
          messageDisplay.textContent = 'Parabéns! Você venceu!';
        }
      } else {
        setTimeout(() => {
          flippedCards.forEach(card => card.classList.remove('flipped'));
          flippedCards = [];
        }, 1000);
      }
    }
  }

  function getPairsByDifficulty(difficulty) {
    switch (difficulty) {
      case 'easy':
        return 6; // 12 cartas
      case 'medium':
        return 8; // 16 cartas
      case 'hard':
        return 10; // 20 cartas
      case 'extreme':
        return 12; // 24 cartas
      default:
        return 8;
    }
  }

  function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }
});
