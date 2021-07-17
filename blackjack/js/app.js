/*----- constants -----*/
const suits = ['d', 'h', 's', 'c'];
const cardTypes = ['02', '03', '04', '05', '06', '07', '08', '09', '10', 'J', 'Q', 'K', 'A'];
const cards = [];

/*----- app's state (variables) -----*/
let playersHand = [];
let dealersHand = [];
let wltScore = [0, 0, 0];
let outputMessage = "";
let playersHandTotal = 0;
let dealersHandTotal = 0;

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
    if (evt.target === playBtn) {
        init();
    } else if (evt.target === standBtn) {
        handleStand();
    } else if (evt.target === hitBtn) {
        handleHit();
    }
}

function init() {
    playerStartingCards();

}

function playerStartingCards(){
    // Initialize the player's starting hand
    playerArea.innerHTML = "";
    let playerCard1 = document.createElement('div');
    let playerCard2 = document.createElement('div');

    playersHand = [];
    playersHandTotal = 0;
    firstTwo(playersHand);

    playerCard1.classList.add('card', `${playersHand[0].face}`);
    playersHandTotal += playersHand[0].value;
    playerCard2.classList.add('card', `${playersHand[1].face}`);
    playersHandTotal += playersHand[1].value;

    playersHandTotal = checkAce(playersHand, playersHandTotal);

    playerArea.appendChild(playerCard1);
    playerArea.appendChild(playerCard2);
    
    console.log(playersHand);
    console.log(playersHandTotal);
}

function dealerStartingCards(){

}

function firstTwo(hand) {
    // Function to push two random and different cards to the hand
    while (hand.length < 2) {
        let card = cards[Math.floor(Math.random()*cards.length)];
        if (!hand.includes(card)) {
            hand.push(card);
        }
    }
}

function checkAce(hand, total){
    // Function to return an updated total hand value if an Ace is drawn and the total is over 21
    for (let i = 0; i < hand.length; i++){
        if (hand[i].face.includes("A") && hand[i].value === 11 && total > 21) {
            hand[i].value = 1;
            total -= 10;
        }
    }
    return total;
}

createDeck();

console.log(playersHand);