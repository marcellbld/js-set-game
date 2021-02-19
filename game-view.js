import { CardFeatures } from "./card.js";
import { Plus3CardOptions } from "./gamedata.js";

const gamePage = document.querySelector('#game-page');
const gameBoard = document.querySelector('#game-board');
const timer = document.querySelector('#timer');
const timerProgress = document.querySelector('#timer-progress');
const timerText = document.querySelector('#timer-text');
const deckNumberText = document.querySelector('#deck-number');
const infoPanelText = document.querySelector('#info-panel');
const elapsedTimer = document.querySelector('#elapsed-timer');

const resultListContainer = document.querySelector('#result-list-container');
const playerListContainer = document.querySelector('#player-list-container');

const resultList = document.querySelector('#result-list');
const playerList = document.querySelector('#player-list');

const helperButton = document.querySelector('#helper-button');
const showSetButton = document.querySelector('#showset-button');
const plus3CardButton = document.querySelector('#plus3card-button');
const backToHomeButton = document.querySelector('#backtohome-button');
const playAgainButton = document.querySelector('#playagain-button');

export const CardEffect = {
    SELECT:'set-card-active',
    DESELECT:'',
    FOUND:'set-card-found',
    REMOVE:'set-card-disappear',
    ADD:'set-card-appear',
    INACTIVE:'set-card-inactive',
};

let infoPanelTimer;

export function setPageDisplay(gameData){
    playerListContainer.hidden = false;
    resultListContainer.hidden = true;
    deckNumberText.hidden = false;

    setPlayerList(gameData.players);
    setTimer(gameData.hasTurnTimer());
    setElapsedTimer(gameData.hasElapsedTimer());

    setButtonVisibility(helperButton, gameData.helperButton);
    setButtonVisibility(showSetButton, gameData.showSetButton);
    setButtonVisibility(plus3CardButton, gameData.plus3Card === Plus3CardOptions.BUTTON);
    setButtonVisibility(backToHomeButton, false);
    setButtonVisibility(playAgainButton, false);
    
    writeToInfoPanel('', -1);
}

export function setEndPageDisplay(gameData, players){
    playerListContainer.hidden = true;
    resultListContainer.hidden = false;
    deckNumberText.hidden = true;

    setResultList(players);
    setTimer(false);
    
    setButtonVisibility(helperButton, false);
    setButtonVisibility(showSetButton, false);
    setButtonVisibility(plus3CardButton, false);
    setButtonVisibility(backToHomeButton, true);
    setButtonVisibility(playAgainButton, gameData.playerNumber > 1);
}

function setPlayerList(players){
    playerList.innerHTML = '';
    players.forEach(player => {
        playerList.innerHTML += renderPlayerListItem(player);
    });
}

function setButtonVisibility(button, show){
    button.hidden = !show;
}

function setResultList(players){
    resultList.innerHTML = '';
    players.forEach((player,i) => {
        resultList.innerHTML += renderResultListItem(player, i+1);
    });
}

export function refreshPlayerListItem(id, points){
    playerList.children[id].children[1].innerText = points;
}
export function writeToInfoPanel(text, time){
    infoPanelText.innerText = text;

    clearTimeout(infoPanelTimer);
    
    if(time !== -1){
        infoPanelTimer = setTimeout(() => {
            writeToInfoPanel("", -1);
        }, time);
    }
}
export function refreshDeckNumber(number){
    if(number === 0){
        deckNumberText.innerText = 'A pakli üres';
    }
    else{
        deckNumberText.innerText = 'A pakliban: '+number;
    }
}

function setDFlexVisibility(element, visible){
    if(visible) {
        element.classList.remove('d-none');
        element.classList.add('d-flex');
    }
    else {
        element.classList.remove('d-flex');
        element.classList.add('d-none');
    }
}

function setElapsedTimer(hasTimer){
    setDFlexVisibility(elapsedTimer, hasTimer);
}
export function refreshElapsedTimer(text){
    elapsedTimer.innerText = text;
}

function setTimer(hasTimer){
    setDFlexVisibility(timer, hasTimer);
}
export function refreshTimer(percentage, seconds){
    timerText.innerText = seconds;
    const size = Math.min(5,(5*percentage));
    timerProgress.style.width = size+"rem";
    timerProgress.style.height = size+"rem";
}

function renderPlayerListItem(player){
    return `<li class="px-2 py-2 text-center d-flex justify-content-between" style="list-style-type:none;">
                <span>${player.name}</span>
                <span>${player.points}</span>
            </li>`;
}
function renderResultListItem(player, number){
    return `<li class="px-2 py-2 text-center d-flex justify-content-between" style="list-style-type:none;">
                <span>${number+"."}</span>
                <span>${player.name}</span>
                <span>${player.points}</span>
            </li>`;
}
function getCardImg(id){
    const rowId = Math.floor(id/4);
    const cellId = Math.floor(id%4);

    if(!gameBoard.rows[rowId]){

       let row = gameBoard.insertRow(-1);
       for(let i = 0; i < 4; i++){
            let cell = row.insertCell(i);
            let img = document.createElement('IMG');
            img.classList.add('set-card');
            img.classList.add('set-card-disappear');
            cell.appendChild(img);
       }
    }

    return gameBoard.rows[rowId].cells[cellId].querySelector('img');
}
function removeCardEffects(card){
    card.classList.remove(CardEffect.ADD);
    card.classList.remove(CardEffect.SELECT);
    card.classList.remove(CardEffect.REMOVE);
    card.classList.remove(CardEffect.FOUND);
    void card.offsetWidth;
}

export function addCardEffect(id, effect) {
    let card = getCardImg(id);
    removeCardEffects(card);
    if(effect){
        card.classList.add(effect);
    }
}

export function setBoard(cards){
    gameBoard.innerHTML = '';

    let tr;
    cards.forEach( (card,i) => {
        if(i % 4 == 0){
            tr = document.createElement('TR');
            gameBoard.appendChild(tr);
        }
        let td = document.createElement('TD');
        let img = renderCard(getCardSvg(card));
        td.appendChild(img);
        tr.appendChild(td);
    });
}

export function setCard(id, card){
    getCardImg(id).src = 'icons/'+getCardSvg(card);
}
export function refreshTable(cards){
    let i = Math.floor((cards.length-1)/4);
    while(i > 2){
        let arr = cards.slice((4*i), (4*i)+4);

        if(arr.every(elem => elem === undefined)){
            if(gameBoard.rows.length > i){
                gameBoard.deleteRow(i);
            }
        }
        else
        {
            break;
        }
        i--;
    }
}

const SVG_COLOR = ['r', 'g', 'p'];
const SVG_SHAPE = ['P', 'S', 'D'];
const SVG_SHADING = ['S', 'O', 'H'];

function renderCard(fileName){
    let img = document.createElement('IMG');
    img.src = 'icons/'+fileName;
    img.classList.add('set-card');
    return img;
}
function getCardSvg(card){
    let name = '';
    name += CardFeatures.Numbers[card.number]+1;
    name += SVG_SHADING[CardFeatures.Shades[card.shade]];
    name += SVG_COLOR[CardFeatures.Colors[card.color]];
    name += SVG_SHAPE[CardFeatures.Shapes[card.shape]];
    return name+".svg";
}

export function showPage(){
    gamePage.hidden = false;
}
export function hidePage(){
    gamePage.hidden = true;
}