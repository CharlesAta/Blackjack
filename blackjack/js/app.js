/*----- constants -----*/
const suits = ['d', 'h', 's', 'c'];
const cardTypes = ['02', '03', '04', '05', '06', '07', '08', '09', '10', 'J', 'Q', 'K', 'A'];
const cards = [];

const winMessages = ['CONGRATULATION! YOU WIN!', 'GREAT JOB! YOU WON!', 'YOU WIN! THE DEALER NEVER STOOD A CHANCE', "YOU WIN! ARE YOU COUNTING CARDS? YOU'RE TOO GOOD!"];
const lossMessages = ['YOU LOST! BETTER LUCK NEXT TIME!', "GUESS IT'S NOT YOUR LUCKY DAY! YOU LOST!", 'YOU LOST! TIME TO PAY UP!'];
const tieMessages = ["NOT A WIN BUT NOT A LOSS, IT'S A TIE", "IT'S A TIE!"];

const ACE_HIGH = 11;
const ACE_LOW = 1;
const ACE_DIFF = ACE_HIGH - ACE_LOW;

const TWENTY_ONE = 21;

/*----- app's state (variables) -----*/
let playersHand = [];
let dealersHand = [];
let wltScore = [0, 0, 0];
let outputMessage = '';
let playersHandTotal = 0;
let dealersHandTotal = 0;
let winner = '';
let hit = false;
let cardsInPlay = [];
let startClickCount = false;
let resetScore = false;
let flip = false;

/*----- cached element references -----*/
const playBtn = document.querySelector('#play-btn');
const hitBtn = document.querySelector('#hit-btn');
const standBtn = document.querySelector('#stand-btn');
const options = document.querySelector('#options');

const message = document.querySelector('#message');

const winScore = document.querySelector('#win > span');
const lossScore = document.querySelector('#loss > span');
const tieScore = document.querySelector('#tie > span');
const resetScoreBtn = document.querySelector('#reset-btn');

const dealerArea = document.querySelector('#dealer');
const playerArea = document.querySelector('#player');

const currentHandArea = document.querySelector('#currentHand > span');
const dealerCurrentHandArea = document.querySelector('#dealerCurrentHand > span');


/*----- event listeners -----*/
options.addEventListener('click', handleClick);
resetScoreBtn.addEventListener('click', resetScoreboard);

/*----- functions -----*/

function createDeck(){
    // Function to create an array of objects for all 52 cards in the deck
        for(let i = 0; i < suits.length; i++) {
            for(let j = 0; j < cardTypes.length; j++) {
                let cardValue;
                if (cardTypes[j] === 'J' || cardTypes[j] === 'Q' || cardTypes[j] === 'K') {
                    cardValue = 10;
                } else if (cardTypes[j] === 'A') {
                    cardValue = 11;
                } else {
                    cardValue = parseInt(cardTypes[j]);
                }
                cards.push({
                    face: `${suits[i]}${cardTypes[j]}`, 
                    value: cardValue
                });
            }
        }
    }

function onLoad() {
    // Function to be called on the intial loading of the JS to the page
    disableMoves();
    changeMesageLights();
}

function handleClick(evt) {
    // Function to handle buttons being clicked
    if (evt.target === playBtn) {
        init();
    } else if (evt.target === standBtn) {
        handleStand();
    } else if (evt.target === hitBtn) {
        handleHit();
    }
}

function init() {
    // Function to initialize starting values
    changeMesageLights();
    resetWinnerGlow();

    flip = false;
    
    startClick = true;
    if (startClick){
        playButtonText('reset');
    }
    winner = '';
    startingCards(playerArea, playersHand, playersHandTotal, 'player');
    startingCards(dealerArea, dealersHand, dealersHandTotal, 'dealer');
    
    enableMoves();
    updateCurrHandTotal();
    updateDealerHandTotal();
    render();
}

function startingCards(area, hand, total, holder){
    // Initialize the starting hand
    area.innerHTML = '';
    let card1 = document.createElement('div');
    let card2 = document.createElement('div');

    hand = [];
    total = 0;
    // Add two cards to the holder's hand
    firstTwo(hand);

    // Create card templates
    card1.classList.add('card', `${hand[0].face}`);
    total += hand[0].value;
    if (holder == 'player') {
        card2.classList.add('card', `${hand[1].face}`);
    } else {
        card2.classList.add('card', 'back-blue');
    }
    total += hand[1].value;

    // Update global hand total variables
    if (holder == 'player') {
        playersHandTotal = checkAce(hand, total);
        playersHand = hand;
    } else {
        dealersHandTotal = checkAce(hand, total);
        dealersHand = hand;
    }

    // Add cards to HTML
    area.appendChild(card1);
    area.appendChild(card2);
}

function firstTwo(hand) {
    // Function to push two random, different cards to the hand
    while (hand.length < 2) {
        let card = randomizer(cards);
        if (!cardsInPlay.includes(card)) {
            hand.push(card);
            cardsInPlay.push(card);
        }
    }
}

function checkAce(hand, total){
    // Function to return an updated total hand value if an Ace is drawn and the total is over 21
    for (let i = 0; i < hand.length; i++){
        if (hand[i].face.includes('A') && hand[i].value === ACE_HIGH && total > TWENTY_ONE) {
            hand[i].value = ACE_LOW;
            total -= ACE_DIFF;
        }
    }
    return total;
}

function handleStand() {
    // Function to handle the stand button being clicked
    checkWinner();
}

function checkWinner() {
    // Function to check the winner
    // Dealer pulls any cards before the check
    dealerPulls();
    // Define when player wins
    if (playersHandTotal === TWENTY_ONE || 
        (playersHandTotal > dealersHandTotal && playersHandTotal < TWENTY_ONE) ||
        dealersHandTotal > TWENTY_ONE){
            winner = 'player';
            addWinnerGlow(winner);
    }
    // Define when dealer wins
    else if (dealersHandTotal === TWENTY_ONE ||
        (dealersHandTotal > playersHandTotal && dealersHandTotal < TWENTY_ONE) || 
        playersHandTotal > TWENTY_ONE){
            winner = 'dealer';
            addWinnerGlow(winner);
    } 
    // Define when a tie
    else if (playersHandTotal === dealersHandTotal){
            winner = 'tie';
    }
    render();
}

function handleHit() {
    // Function to handle when the hit button is clicked.
    // Add a new card to the player's hand.
    hit = true;

    addNewCard(playersHand, playersHandTotal, playerArea, 'player');

    (playersHandTotal >= TWENTY_ONE) ? checkWinner() : render();
}

function flipDealerCard() {
    // Function to flip the dealer's card over visually
    flip = true;
    let dealerHiddenCards = document.querySelectorAll('#dealer > div');
    dealerHiddenCards.forEach((card, idx) => {
        if (card.classList.contains('back-blue')) {
            card.classList.remove('back-blue')
            card.classList.add(`${dealersHand[idx].face}`)
        }
    })
}

function render(){
    // Function to update the state variables and render to DOM
    // If the player hits, update their hand
    if (hit) {
        hit = false;
        updateCurrHandTotal();
    }

    // If a winner exists
    if (winner) {
        flipDealerCard();
        updateDealerHandTotal();
        disableMoves();
        updateScoreboard();
        playButtonText('play again?');
    }
    
    // If the scoreboard is reset
    if (resetScore) {
        updateScoreboard();
        resetScore = false;
    } else {
        updateMessage();
    }
}

function disableMoves() {
    // Function to disable the stand and hit buttons
    standBtn.disabled = true;
    hitBtn.disabled = true;
}

function enableMoves(){
    // Function to enable the stand and hit buttons
    standBtn.disabled = false;
    hitBtn.disabled = false;
}

function updateScoreboard() {
    // If the scoreboard is to be reset
    if (resetScore) {
        winScore.textContent = "";
        lossScore.textContent = "";
        tieScore.textContent = "";
        return;
    }

    // Otherwise, if a winner exists
    switch (winner) {
        case 'player':
            wltScore[0] += 1;
            winScore.textContent = wltScore[0];  
            break;
        case 'dealer':
            wltScore[1] += 1;
            lossScore.textContent = wltScore[1];
            break;
        case 'tie':
            wltScore[2] += 1;
            tieScore.textContent = wltScore[2];
            break;
    }
}

function resetScoreboard(evt) {
    // Function to handle a click event to reset the scoreboard 
    resetScore = true;
    if (evt.target === resetScoreBtn) {
        wltScore = [0, 0, 0];
    }

    render();
}

function updateMessage() {
    // Function to update the output message
    switch (winner) {
        case 'player':
            outputMessage = randomizer(winMessages);
            message.innerHTML = outputMessage;
            changeMesageLights("3bceac", "0ead69");
            break;
        case 'dealer':
            outputMessage = randomizer(lossMessages);
            message.innerHTML = outputMessage;
            changeMesageLights("ff7096", "ff0a54");
            break;
        case 'tie':
            outputMessage = randomizer(tieMessages);
            message.innerHTML = outputMessage;
            changeMesageLights("00b4d8", "0077b6");
            break;
        default:
            changeMesageLights("7400b8", "5390d9");
            message.textContent = "MAKE YOUR MOVE BELOW";
    }
}

function randomizer(arr){
    // Function to select a random element from an array
    return arr[Math.floor(Math.random() * arr.length)]
}

function playButtonText(str) {
    // Function to update the play button
    let words = playBtn.querySelector('div.text');
    let letters = str.toUpperCase().split('');
    let lettersArr = [];
    for (let letter of letters){
            lettersArr.push(`<p>${letter}</p>`);
    }
    if (str.length > 5){
        words.style.fontSize = '2rem';
    } else {
        words.style.fontSize = '3rem';
    }
    words.innerHTML = lettersArr.join('');
}

function updateCurrHandTotal() {
    // Function to update the player's hand total in the DOM
    currentHandArea.textContent = playersHandTotal;
}

function updateDealerHandTotal() {
    if (flip) {
        dealerCurrentHandArea.textContent = dealersHandTotal;
    } else {
        dealerCurrentHandArea.textContent = dealersHand[0].value;
    }
}

function dealerPulls() {
    // Function to add new cards to the dealer's hand
    if (dealersHandTotal >= 16){
        return;
    } 
    
    addNewCard(dealersHand, dealersHandTotal, dealerArea,  'dealer');
}

function addNewCard(hand, total, area,  holder){
    // Function to add new cards
    let newCard = document.createElement('div');

    let currentHandLength = hand.length;

    while (hand.length <= currentHandLength) {
        let card = randomizer(cards);
        if (!cardsInPlay.includes(card)) {
            hand.push(card);
            total += card.value;
            cardsInPlay.push(card);
        }
    }

    if (hand.length === 5){
        let childDivs = document.querySelectorAll(`#${holder} > div`);
        childDivs.forEach(div => {
            div.classList.add('small');
        })
    } 
    
    if (holder === "player") {
        if (hand.length >= 5) {
            newCard.classList.add('card', `${hand[hand.length - 1].face}`, 'small');
        } else {
            newCard.classList.add('card', `${hand[hand.length - 1].face}`);
        }
    } else {
        if (hand.length >= 5) {
            newCard.classList.add('card', 'back-blue', 'small');
        } else {
            newCard.classList.add('card', 'back-blue');
        }
    }
    
    area.appendChild(newCard);
    
    if (holder === "player") {
        playersHandTotal = checkAce(hand, total);
    } else {
        dealersHandTotal = checkAce(hand, total);
    }
}

function changeMesageLights(text = 'ac1066', border = '0091ad') {
    // Function to change the lights of the message board
    document.body.style.setProperty('--neon-text-color', `#${text}`);
    document.body.style.setProperty('--neon-border-color', `#${border}`);
}

function addWinnerGlow(winner) {
    // Function to add glow to the winning area
    if (winner === 'player'){
        playerArea.style.boxShadow = '0 0 100px #ffb700 inset, 0 0 20px #ffb700';
        playerArea.style.borderRadius = '40px';
    } else if (winner === 'dealer') {
        dealerArea.style.boxShadow = '0 0 100px #ffb700 inset, 0 0 20px #ffb700';
        dealerArea.style.borderRadius = '40px';
    } else {
        playerArea.style.boxShadow = '0 0 100px #ffb700 inset, 0 0 20px #ffb700';
        playerArea.style.borderRadius = '40px';
        dealerArea.style.boxShadow = '0 0 100px #ffb700 inset, 0 0 20px #ffb700';
        dealerArea.style.borderRadius = '40px';
    }
}

function resetWinnerGlow() {
    // Function to reset the area glow
    playerArea.style.boxShadow = null;
    playerArea.style.borderRadius = null;
    dealerArea.style.boxShadow = null;
    dealerArea.style.borderRadius = null;
}

onLoad();
createDeck();