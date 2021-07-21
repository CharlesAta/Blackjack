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

const HAND_DIV_MIN_LIMIT = 3;
const HAND_DIV_MAX_LIMIT = 4;

const player = new Audio();
const sounds = {
    playSound: './css/sounds/playSound.mp3',
    refreshSound: './css/sounds/refreshSound.mp3',
    winSound: './css/sounds/winSound.mp3',
    lossSound: './css/sounds/lossSound.mp3',
    dealSound: './css/sounds/dealSound.mp3',
    drawSound: './css/sounds/drawSound.mp3',
    tieSound: './css/sounds/tieSound.mp3'
}

const STARTING_MONEY = 1000;
const ONE_HUNDRED = 100;
const FIVE_HUNDRED = 500;
const ONE_THOUSAND = 1000;

/*----- app's state (variables) -----*/
let playersHand = [];
let dealersHand = [];
let playersHandTotal = 0;
let dealersHandTotal = 0;
let cardsInPlay = [];

let wltScore = [0, 0, 0];
let winner = '';

let outputMessage = '';

let hit = false;
let startClickCount = false;
let resetScore = false;
let flip = false;
let inPlay = false;
let madeBet = false;
let resetBet = false;

let wallet = 0;
let bet = 0;
let earnings = 0;

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

const currentHandArea = document.querySelector('#current-hand > span');
const dealerCurrentHandArea = document.querySelector('#dealer-current-hand > span');

const bgPlayer = document.querySelector('#bg-player');

const bettingArea = document.querySelector('#betting-area');
const walletAmount = document.querySelector('#wallet-amount > p');
const betAmount = document.querySelector('#bet-amount > p');
const bet100 = document.querySelector('#bet-100');
const bet500 = document.querySelector('#bet-500');
const bet1000 = document.querySelector('#bet-1000');
const betResetButton = document.querySelector('#bet-reset');
const earningsAmount = document.querySelector('#earnings-amount > p');
const doubleButton = document.querySelector('#double-btn');

/*----- event listeners -----*/
options.addEventListener('click', handleClick);
resetScoreBtn.addEventListener('click', resetScoreboard);
bettingArea.addEventListener('click', handleBet);

/*----- code ------*/
bgPlayer.volume = .02;
player.volume = .03;

onLoad();
createDeck();

/*----- functions -----*/
function createDeck(){
    // Function to create an array of objects for all 52 cards in the deck
        for(let i = 0; i < suits.length; i++) {
            for(let j = 0; j < cardTypes.length; j++) {
                let cardValue;
                if (cardTypes[j] === 'J' || cardTypes[j] === 'Q' || cardTypes[j] === 'K') {
                    cardValue = 10;
                } else if (cardTypes[j] === 'A') {
                    cardValue = ACE_HIGH;
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
    startingWallet();
}

function handleClick(evt) {
    // Function to handle buttons being clicked
    if (evt.target === playBtn) {
        playSound('playSound');
        setTimeout(init, 600);
    } else if (evt.target === standBtn) {
        playSound('standSound');
        setTimeout(handleStand, 500);
    } else if (evt.target === hitBtn) {
        playSound('drawSound');
        setTimeout(handleHit, 200);
    }
}

function init() {
    // Function to initialize starting values
    inPlay = true;
    winner = '';
    cardsInPlay = [];
    flip = false;
    startClick = true;
    lockBetWindow();
    disableBets();
    changeMesageLights();
    resetWinnerGlow();
    setEarningsToZero();
    updateEarnings();

    if (inPlay && bet > 0){
        disablePlay();
    }

    if (startClick){
        playButtonText('reset');
    }
    
    playSound('dealSound');
    startingCards(playerArea, playersHand, playersHandTotal, 'player');
    startingCards(dealerArea, dealersHand, dealersHandTotal, 'dealer');
    
    enableMoves();
    updateCurrHandTotal();
    updateDealerHandTotal();

    if (playersHandTotal === TWENTY_ONE){
        checkWinner();
    } else {
        render();
    }
}

function startingCards(area, hand, total, holder){
    // Initialize the starting hand
    area.innerHTML = '';
    let firstCard = document.createElement('div');
    let secondCard = document.createElement('div');

    hand = [];
    total = 0;
    // Add two cards to the holder's hand
    firstTwo(hand);

    // Create card templates
    if (holder == 'player') {
        firstCard.classList.add('card', 'large', `${hand[0].face}`);
        secondCard.classList.add('card', 'large', `${hand[1].face}`);
    } else {
        firstCard.classList.add('card', `${hand[0].face}`);
        secondCard.classList.add('card', 'back-blue');
    }
    total += hand[0].value;
    total += hand[1].value;

    // Update global hand total variables
    if (holder == 'player') {
        playersHandTotal = checkAce(hand, total);
        playersHand = hand;
        area.style.alignContent = 'center';
    } else {
        dealersHandTotal = checkAce(hand, total);
        dealersHand = hand;
    }


    // Add cards to HTML
    area.appendChild(firstCard);
    area.appendChild(secondCard);
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

    // Define when a tie
    if (playersHandTotal === dealersHandTotal || playersHandTotal > TWENTY_ONE && dealersHandTotal > TWENTY_ONE){
        winner = 'tie';
        playerArea.style.alignContent = 'center';
        playSound('tieSound');
    }
    // Define when player wins
    else if (playersHandTotal === TWENTY_ONE || 
        (playersHandTotal > dealersHandTotal && playersHandTotal < TWENTY_ONE) ||
        dealersHandTotal > TWENTY_ONE){
            winner = 'player';
            playerArea.style.alignContent = 'center';
            playSound('winSound');
    }
    // Define when dealer wins
    else if (dealersHandTotal === TWENTY_ONE ||
        (dealersHandTotal > playersHandTotal && dealersHandTotal < TWENTY_ONE) || 
        playersHandTotal > TWENTY_ONE){
            winner = 'dealer';
            playSound('lossSound');
            
    } 
    if (winner) {
        addWinnerGlow(winner);
        updateWinnings();
        updateEarnings();
        enablePlay();
        inPlay = false;
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
    if (madeBet && !inPlay || resetBet && !inPlay) {
        updateBet();
        return;
    }
    
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
        unlockBetWindow();
        enableBets();
        setBetToZero();
        updateWallet();
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
        playSound('refreshSound')
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
    // Function to update the dealer's hand total in the DOM
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
    
    while (dealersHandTotal < 16) {
        addNewCard(dealersHand, dealersHandTotal, dealerArea,  'dealer');
    }
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
    
    if (holder === "player") {
        let childDivs = document.querySelectorAll(`#${holder} > div`);
        area.style.alignContent = 'flex-start';
        if (hand.length === HAND_DIV_MIN_LIMIT){
            childDivs.forEach(div => {
                div.classList.remove('large');
            })
        } else if (hand.length === HAND_DIV_MAX_LIMIT) {
            childDivs.forEach(div => {
                div.classList.add('small');
            })
        }
        if (hand.length < HAND_DIV_MAX_LIMIT) {
            newCard.classList.add('card', `${hand[hand.length - 1].face}`);
        } else if (hand.length >= HAND_DIV_MAX_LIMIT) {
            newCard.classList.add('card', `${hand[hand.length - 1].face}`, 'small');
        }
    } else {
        let childDivs = document.querySelectorAll(`#${holder} > div`);
        if (hand.length === HAND_DIV_MIN_LIMIT){
            childDivs.forEach(div => {
                div.classList.add('small');
            })
        } 
        if (hand.length >= HAND_DIV_MIN_LIMIT) {
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
        if (playersHandTotal === TWENTY_ONE) {
            playerArea.style.boxShadow = '0 0 100px #ffb700 inset, 0 0 20px #ffb700';
        } else {
            playerArea.style.boxShadow = '0 0 100px #fff inset, 0 0 20px #fff';
        }
    } else if (winner === 'dealer') {
        if (dealersHandTotal === TWENTY_ONE) {
            dealerArea.style.boxShadow = '0 0 100px #ffb700 inset, 0 0 20px #ffb700';
        } else {
            dealerArea.style.boxShadow = '0 0 100px #fff inset, 0 0 20px #fff';
        }
    } else {
        playerArea.style.boxShadow = '0 0 100px #fff inset, 0 0 20px #fff';
        dealerArea.style.boxShadow = '0 0 100px #fff inset, 0 0 20px #fff';
    }
}

function resetWinnerGlow() {
    // Function to reset the area glow
    playerArea.style.boxShadow = null;
    dealerArea.style.boxShadow = null;
}

function playSound(name) {
    // Function to play the sound effects
    player.src = sounds[name];
    player.play();
}

function startingWallet() {
    // Function to intiialize the starting wallet amount
    wallet = STARTING_MONEY;
    walletAmount.textContent = `$${wallet}`;
}

function handleBet(evt) {
    // Function to handle a bet
    if (evt.target === bet100){
        addBet(ONE_HUNDRED);
    } else if (evt.target === bet500) {
        addBet(FIVE_HUNDRED);
    } else if (evt.target === bet1000) {
        addBet(ONE_THOUSAND);
    } else if (evt.target === betResetButton) {
        clearBet();
    }
}

function addBet(amount) {
    // Function to add a bet
    madeBet = true;
    if (wallet - amount >= 0){
        unlockBetWindow();
        bet += amount;
        wallet -= amount;
        updateWallet();
        render();
    } else if (wallet - amount < 0) {
        betAmount.style.color = 'red';
        if (amount === ONE_HUNDRED){
            disableBet100();
        } else if (amount === FIVE_HUNDRED){
            disableBet500();
        } else if (amount === ONE_THOUSAND){
            disableBet1000();
        }
    }
    madeBet = false;
}

function updateBet() {
    // Function to update the text of the bet amount in the DOM
    betAmount.textContent = `$${bet}`;
}

function clearBet() {
    // Function to clear the bets when the clear button is pressed
    resetBet = true;
    updateWallet();
    bet = 0;
    render();
    unlockBetWindow();
    enableBets();
    resetBet = false;
}

function updateWallet() {
    // Function to update the wallet
    if (resetBet) {
        wallet += bet;
    }
    walletAmount.textContent = `$${wallet}`
}

function lockBetWindow() {
    // Function to set the styling of the bet window to grey
    betAmount.style.color = 'grey';
}

function unlockBetWindow() {
    // Function to reset the styling of the bet window 
    betAmount.style.color = 'white';
}

function updateEarnings() {
    // Function to update the earnings
    earnings = bet;
    if (winner === 'tie' || winner === '') {
        earningsAmount.style.color = 'white';
        earningsAmount.textContent = `$0`;
    } else if (winner === 'player') {
        earningsAmount.style.color = 'green';
        earningsAmount.textContent = `+$${earnings}`;
    } else if (winner === 'dealer') {
        earningsAmount.style.color = 'red';
        earningsAmount.textContent = `-$${earnings}`;
    }
}

function disableBets() {
    // Function to disable all the bet buttons as group
    disableBet100();
    disableBet500();
    disableBet1000();
    betResetButton.disabled = true;
}

function enableBets() {
    // Function to enable all the bet buttons as a group
    bet100.disabled = false;
    bet500.disabled = false;
    bet1000.disabled = false;
    betResetButton.disabled = false;
}

function disableBet1000() {
    // Function to individually disable the $1000 bet
    bet1000.disabled = true;
}

function disableBet500() {
    // Function to individually disable the $500 bet
    bet500.disabled = true;
}

function disableBet100() {
    // Function to individually disable the $100 bet
    bet100.disabled = true;
}

function setBetToZero() {
    // Function to set the bet to zero
    bet = 0;
    betAmount.textContent = `$${bet}`
}

function setEarningsToZero() {
    earnings = 0;
}

function updateWinnings() {
    if (winner === 'player') {
        wallet += bet * 2;
    } else if (winner === 'tie') {
        wallet += bet;
    }
}

function disablePlay() {
    playBtn.disabled = true;
}

function enablePlay() {
    playBtn.disabled = false;
}

function disableDouble() {
    doubleButton.disabled = true;
}

function enableDouble() {
    doubleButton.disabled = false;
}