import * as view from './game-view.js'; 
import { CardEffect } from './game-view.js';
import { Card, CardFeatures } from "./card.js";
import { shuffleArray } from "./util.js";
import { Difficulties, GameModes, GameStates, Plus3CardOptions } from "./gamedata.js";
import { startHome } from './app.js';
import { saveMultiplayer, saveSPNormalMode, saveSPHardMode } from './toplist.js';
import { Timer } from './timer.js';

const playerList = document.querySelector('#player-list');
const gameBoard = document.querySelector('#game-board');

const helperButton = document.querySelector('#helper-button');
const showSetButton = document.querySelector('#showset-button');
const plus3CardButton = document.querySelector('#plus3card-button');
const backToHomeButton = document.querySelector('#backtohome-button');
const playAgainButton = document.querySelector('#playagain-button');

const MAX_CARDS = 12;
const MAX_TIMER = 10000;

let gameData;

let selectedPlayerId;
let ignoredPlayerIds;

let deck;
let selectedCards;
let cardArray;
let cardsInArray;

const turnTimer = new Timer({callbackFn: turnTick});
const elapsedTimer = new Timer({callbackFn: elapsedTick});

export function open(data){
    gameData = data;
    startGame();

    view.showPage();
}
export function close(){
    view.hidePage();
}

function startGame(){
    cardArray = [];
    deck = [];
    turnTimer.restart();
    elapsedTimer.restart();
    selectedPlayerId = -1;
    ignoredPlayerIds = [];
    selectedCards = [];
    cardsInArray = 0;

    gameData.setStartGame();
    gameData.setPointsToZero();

    if(gameData.difficulty === Difficulties.NORMAL){
        fillNormalDeck();
    }
    else {
        fillHardDeck();
    }

    deck = shuffleArray(deck);
    console.log([...deck]);
    
    for(let i = 0; i < MAX_CARDS; i++){
        cardArray.push(drawCard());
    }
    view.setBoard(cardArray);
    view.setPageDisplay(gameData);

    cardArray.forEach((_,i) => view.addCardEffect(i,CardEffect.ADD));

    checkEndGame();

    if(!gameData.hasTurnTimer()){
        selectPlayer(0);
    }

    if(gameData.hasElapsedTimer()){
        elapsedTimer.start();
    }
}

function turnTick(distance){

    let displayTime = Math.floor((distance/1000));
    view.refreshTimer((distance)/MAX_TIMER, (MAX_TIMER/1000)-displayTime);

    if (distance >= MAX_TIMER) {
        turnEnd(false);
        turnTimer.stop();
    }
}
function elapsedTick(distance){
    view.refreshElapsedTimer(new Date((distance)).toISOString().substr(11, 8));
}

function playerListClick(e){
    if(gameData.state === GameStates.END || gameData.playerNumber === 1 || selectedPlayerId !== -1)
        return;

    let element = e.target.closest('li');

    if(playerList.contains(element)){
        const id = [...playerList.children].indexOf(element);
        selectPlayer(id);
        turnTimer.start();
    }
}

function selectPlayer(id){
    if(selectedPlayerId >= 0){
        playerList.children[selectedPlayerId].classList.remove('active');
    }
    if(id !== -1 && !ignoredPlayerIds.includes(id)){
        selectedPlayerId = id;
        playerList.children[selectedPlayerId].classList.add('active');
    }
    else if(id === -1){
        selectedPlayerId = id;
    }
}
function unignorePlayers(){
    ignoredPlayerIds.forEach(id => {
        unignorePlayer(id);
    });
    ignoredPlayerIds = [];
}
function ignorePlayer(id){
    playerList.children[id].classList.add('ignored');

    ignoredPlayerIds.push(id);
}
function unignorePlayer(id){
    playerList.children[id].classList.remove('ignored');
}

function findSet(){
    let out;

    for(let i = 0; i < cardArray.length; i++){
        for(let j = i+1; j < cardArray.length; j++){
            for(let k = j+1; k < cardArray.length; k++){
                
                if(cardArray[i] && cardArray[j] && cardArray[k]){
                    out = [i,j,k];
                    if(checkCards(out))
                        return out;
                }
                
            }
        }
    }

    return [];
}

function selectCard(id){
    if(id < 0 || id > cardArray.length)
        return;
    if(selectedPlayerId === -1){
        view.writeToInfoPanel("Válassz ki egy játékost!", 500);
        return;
    }
    if(selectedCards.length === 3)
        return;
    if(gameData.state === GameStates.END)
        return;

    if(selectedCards.includes(id)){
        selectedCards = selectedCards.filter(cardId => cardId !== id);
        view.addCardEffect(id,CardEffect.DESELECT);
    }
    else {
        view.addCardEffect(id,CardEffect.SELECT);
        selectedCards.push(id);

        if(selectedCards.length === 3){
            if(gameData.hasTurnTimer()){
                turnTimer.stop();
            }
            setTimeout( () => {
                const result = checkCards(selectedCards);

                turnEnd(result);
            }, 1000);
        }
    }
}
function turnEnd(result){
    if(result){
        gameData.players[selectedPlayerId].points += 1;

        selectedCards.forEach(cardId => {
            cardsInArray--;
            view.addCardEffect(cardId,CardEffect.DESELECT);
            view.addCardEffect(cardId,CardEffect.REMOVE);
            delete cardArray[cardId];
        });
        setTimeout( () => {
            if(cardsInArray < MAX_CARDS){
                draw3Card();
            }
            selectedCards = [];
            view.refreshTable(cardArray);
            
            checkEndGame();
            
        }, 500);
        unignorePlayers();
    }
    else 
    {
        gameData.players[selectedPlayerId].points -= 1;
        ignorePlayer(selectedPlayerId);

        if(ignoredPlayerIds.length === gameData.players.length){
            setTimeout( () => {
                unignorePlayers();
            }, 1000);
        }
        selectedCards.forEach(cardId => 
            view.addCardEffect(cardId,CardEffect.DESELECT));
        selectedCards = [];
    }
    view.refreshPlayerListItem(selectedPlayerId, 
        gameData.players[selectedPlayerId].points);

    if(gameData.playerNumber > 1){
        selectPlayer(-1);
    }
}

function checkEndGame(){

    let setExists = findSet().length > 0;

    if(deck.length === 0 && !setExists){
        endGame();
    } else if(gameData.plus3Card === Plus3CardOptions.AUTO){
        while(!setExists && deck.length > 0){
            view.writeToInfoPanel("Nem található Set. Kiegészítve 3 lappal.", 2000);
            draw3Card();
            setExists = findSet().length > 0;
        }
    }
}

function endGame(){
    turnTimer.stop();
    elapsedTimer.stop();

    gameData.setEndGame();
    cardArray.forEach((card,i) => {
        if(card){
            view.addCardEffect(i,CardEffect.INACTIVE);
        }
    });

    view.writeToInfoPanel("A játék véget ért.", -1);

    const playerResults = gameData.players.sort((p1, p2) => p2.points - p1.points);

    view.setEndPageDisplay(gameData, playerResults);

    if(gameData.mode === GameModes.COMPETITION){
        if(gameData.playerNumber === 1){
            if(gameData.difficulty === Difficulties.NORMAL){
                saveSPNormalMode(playerResults[0].name, elapsedTimer.elapsedTime);
            }
            else{
                saveSPHardMode(playerResults[0].name, elapsedTimer.elapsedTime);
            }
        }
        else{
            saveMultiplayer(playerResults);
        }
    }
}

function checkCards(cards){
    let featureArrays = Array.from(new Array(4), () => []);

    cards.forEach(cardId => {
        let card = cardArray[cardId];
        featureArrays[0].push(card.number);
        featureArrays[1].push(card.shape);
        featureArrays[2].push(card.color);
        featureArrays[3].push(card.shade);
    });

    featureArrays = featureArrays.map(array => [...new Set(array)]);

    let passedFeatures = featureArrays.filter(array => {return array.length === 1 || array.length === 3}).length;

    return passedFeatures === 4;
}

function cardClick(e){
    if(e.target.matches('img')){
        const parent = e.target.parentElement;
        const cellId = parent.cellIndex;
        const rowId = parent.parentNode.rowIndex;

        const id = cellId + rowId*4;
        selectCard(id);
    }
}

function fillHardDeck(){

    for(let i = 0; i < 3; i++){
        for(let j = 0; j < 3; j++){
            for(let k = 0; k < 3; k++){
                for(let l = 0; l < 3; l++){
                    deck.push(new Card(
                        {
                            shape: Object.keys(CardFeatures.Shapes)[i],
                            color: Object.keys(CardFeatures.Colors)[j],
                            number: Object.keys(CardFeatures.Numbers)[k],
                            shade: Object.keys(CardFeatures.Shades)[l]
                        }
                    ));
                }
            }
        }
    }
}
function fillNormalDeck(){

    for(let i = 0; i < 3; i++){
        for(let j = 0; j < 3; j++){
            for(let k = 0; k < 3; k++){
                deck.push(new Card(
                    {
                        shape: Object.keys(CardFeatures.Shapes)[i],
                        color: Object.keys(CardFeatures.Colors)[j],
                        number: Object.keys(CardFeatures.Numbers)[k],
                        shade: Object.keys(CardFeatures.Shades)[0]
                    }
                ));
            }
        }
    }

}
function drawCard(){
    if(deck.length === 0)
        return;
        
    let id = 0;
    const out = deck.splice(id, 1)[0];
    view.refreshDeckNumber(deck.length);
    cardsInArray++;
    return out;
}

function helperButtonClick(e){
    let setExists = findSet().length > 0;
    view.writeToInfoPanel(setExists ? "Van Set a leosztásban." : "Nincs Set a leosztásban.", 2000);
}

function backToHomeButtonClick(e){
    startHome();
}

function showSetButtonClick(e){
    let set = findSet();
    set.forEach(id => {
        view.addCardEffect(id,CardEffect.FOUND)});
}
function plus3CardButtonClick(e){
    draw3Card();
}

function draw3Card(){
    for(let i = 0; i < 3; i++){
        let cardId = findEmptyPlaceOnBoard();
        let card = drawCard();
        if(card){
            cardArray[cardId] = card;
            view.setCard(cardId, cardArray[cardId]);
            
            view.addCardEffect(cardId,CardEffect.ADD);
        }
    }
}
function playAgainClick(e){
    startGame();
}

function findEmptyPlaceOnBoard(){
    let emptyId = cardArray.findIndex(card => card === undefined);
    if(emptyId === -1){
        cardArray.push(undefined);
        return findEmptyPlaceOnBoard();
    }
    return emptyId;
}

playerList.addEventListener('click', playerListClick);
gameBoard.addEventListener('click', cardClick);
helperButton.addEventListener('click', helperButtonClick);
showSetButton.addEventListener('click', showSetButtonClick);
plus3CardButton.addEventListener('click', plus3CardButtonClick);
backToHomeButton.addEventListener('click', backToHomeButtonClick);
playAgainButton.addEventListener('click', playAgainClick);