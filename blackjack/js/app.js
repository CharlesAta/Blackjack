/*----- constants -----*/
const suits = ['d', 'h', 's', 'c'];
const cardTypes = ['02', '03', '04', '05', '06', '07', '08', '09', '10', 'J', 'Q', 'K', 'A'];
const cards = [];

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

/*----- cached element references -----*/
const playBtn = document.querySelector('#play-btn');
const hitBtn = document.querySelector('#hit-btn');
const standBtn = document.querySelector('#stand-btn');
const options = document.querySelector('#options');

const message = document.querySelector('#message');
const winScore = document.querySelector('#win > span');
const lossScore = document.querySelector('#loss > span');
const tieScore = document.querySelector('#tie > span');

const dealerArea = document.querySelector('#dealer');
const playerArea = document.querySelector('#player');

/*----- event listeners -----*/
options.addEventListener('click', handleClick);

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
    winner = '';
    startingCards(playerArea, playersHand, playersHandTotal, 'player');
    startingCards(dealerArea, dealersHand, dealersHandTotal, 'dealer');
    enableMoves();
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
        dealersHandTotal = total;
        dealersHand = hand;
    }

    // Add cards to HTML
    area.appendChild(card1);
    area.appendChild(card2);
}

function firstTwo(hand) {
    // Function to push two random, different cards to the hand
    while (hand.length < 2) {
        let card = cards[Math.floor(Math.random()*cards.length)];
        if (!cardsInPlay.includes(card)) {
            hand.push(card);
            cardsInPlay.push(card);
        }
    }
}

function checkAce(hand, total){
    // Function to return an updated total hand value if an Ace is drawn and the total is over 21
    for (let i = 0; i < hand.length; i++){
        if (hand[i].face.includes('A') && hand[i].value === 11 && total > 21) {
            hand[i].value = 1;
            total -= 10;
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

    // Define when player wins
    if (playersHandTotal === 21 || 
        (playersHandTotal > dealersHandTotal && playersHandTotal < 21)){
            winner = 'player';
    }
    // Define when dealer wins
    else if (dealersHandTotal === 21 ||
        (dealersHandTotal > playersHandTotal && dealersHandTotal < 21) || 
        playersHandTotal > 21){
            winner = 'dealer';
    } 
    // Define when a tie
    else if (playersHandTotal === dealersHandTotal){
            winner = 'tie';
    }
    render();
    // Delete this when done
    console.log(winner)
    console.log(playersHandTotal)
    console.log(dealersHandTotal)
    // Delete this when done
}

function handleHit() {
    // Function to handle when the hit button is clicked.
    // Add a new card to the player's hand.
    hit = true;
    let newCard = document.createElement('div');

    let currentHandLength = playersHand.length;

    // Add a new card that is not already in play
    while (playersHand.length <= currentHandLength) {
        let card = cards[Math.floor(Math.random()*cards.length)];
        if (!cardsInPlay.includes(card)) {
            playersHand.push(card);
            cardsInPlay.push(card);
            playersHandTotal += card.value;
        }
    }

    if (playersHand.length === 5){
        let childDivs = document.querySelectorAll('#player > div');
        childDivs.forEach(div => {
            div.classList.add('small');
        })
    } 
    
    if (playersHand.length >= 5) {
        newCard.classList.add('card', `${playersHand[playersHand.length - 1].face}`, 'small');
    } else {
        newCard.classList.add('card', `${playersHand[playersHand.length - 1].face}`);
    }
    
    playerArea.appendChild(newCard);
    playersHandTotal = checkAce(playersHand, playersHandTotal);

    (playersHandTotal >= 21) ? checkWinner() : render();
}

function flipDealerCard() {
    // Function to flip the dealer's card over visually
    let dealerHiddenCard = document.querySelector('#dealer > div:last-child');
    dealerHiddenCard.classList.add(`${dealersHand[1].face}`)
    dealerHiddenCard.classList.remove('back-blue')
}


function render(){
    // Function to update the state variables and render to DOM
    if (winner) {
        flipDealerCard();
        disableMoves();
    }
    if (hit) {
        hit = false;
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

createDeck();

// Delete this when done
console.log(playersHand);
console.log(dealersHand);
// Delete this when done