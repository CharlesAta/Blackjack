# Project-1

## 1. Analyze the app's functionality
<!-- 
The app's features, from the user's point of view, should be described using User Stories. User stories follow this template: As a [role], I want [feature] because [reason]. Example user story: As a player, I want to see a list of high-scores so that I know what I have to score to make the list. -->

As a player, I want to see what cards I am dealt.
As a player, I want the option to stay with my current hand.
As a player, I want the option the option to ask for another card (ie. "hit me")
As a player, I want to be able to see one of the dealer's cards
As a player, I want to be able to know whether I won.
As a player I want to be able to know whether I lost.
As a player, I want to be able to know if there is a tie.
As a player, I want to know know what my current hand adds to.
As a player, I want to be able to start/reset the game.
As a player, I want to know if my initial hand is equal to 21.

Future implementations:
- Add a betting option

## 2. Think about the overall design (look & feel) of the app

<!-- Take the users (audience) of the app into consideration.

Should the app have a clean/minimalist UI (current trend), or should it be themed to match the app's purpose? -->
The app can either have a minimalistic look, or take place in a casino setting (like on a table).

## 3. Wireframe the UI

<!-- Wireframes provide a blueprint for the HTML & CSS.
Wireframes also help reveal an application's data (state) and functionality. -->

## 4. Pseudocode

1) Define required constants
    1.1) Use an object to represent all available cards in the deck and their numeric value
    1.2) 

2) Define required variables used to track the state of the game
    2.1) Array to hold the player's hand
    2.2) Variable to know whether it's a tie, win, loss and the respective score
    2.3) Variable to hold the current hand 
    2.4) Variable to hold the dealer's hand total value

3) Store elements on the page that will be accessed in code more than once in variables to make code more concise, readable and performant.
    3.1) Store play btn
    3.2) Store Stand btn
    3.3) Store hit btn

4) Upon loading the app should:
	4.1) Initialize the state variables
        4.1.1) Start with an empty game, no cards dealt yet
        4.1.2) W T L set to 0
        4.1.3) Message saying "Press play to start"
        4.1.4) Stand and Hit buttons must not do anything until the game is in progress
	4.2) Render the state variables to the page once the game begins
        4.2.1) Show one of the dealer's cards
        4.2.2) Show both player's cards
        4.2.3) Show the player's current hand total
        4.2.4) Show message prompting the player to hit or stand
	4.3) Wait for the user to click a button

5) Handle a player clicking stand
    5.1) If the player clicks stand, the dealer's second card is shown
    5.2) If the player has a hand larger than the dealer's and it is below 21, the player wins
    5.3) if the player has a hand smaller than the dealer's, the dealer wins
    5.4) if the player and the dealer have the same hand total, it's a tie and a tie message is rendered

6) Handle a player clicking hit
    6.1) If the player clicks hit, the next card is added to the player's hand and the player's current hand total is updated. The render function is then called to update the state variables
    6.2) If the hand is less than 21, the player has the option to hit or stand
    6.3) If the hand is more than 21, the player loses, and a loss message is rendered
    6.4) If the hand is equal to 21, the player wins, and a win message is rendered

7) Handle a win, loss, or tie
    7.1) If a W L T, the stand and hit btns must no longer do anything. the play button must be pressed for a new round.

8) Handle a player clicking the play button
    8.1) If the pressed, the dealer and player hands are reset to two initial cards each

9) Possible Game Note
    8.1) If a player gets an Ace, they can use it as a 1 or an 11
    8.2) MEssage prompting user whether Ace will be equal to 1 or 11 if Ace is drawn