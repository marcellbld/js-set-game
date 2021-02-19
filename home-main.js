import * as view from './home-view.js';
import { Difficulties, GameData, GameModes, Plus3CardOptions } from './gamedata.js';
import { startGame } from './app.js';
import { loadMultiplayerMode, loadSPHardMode, loadSPNormalMode } from './toplist.js';
 
const mainForm = document.querySelector('#main-form');
const nameForm = document.querySelector('#name-form');

const playersSelect = mainForm.querySelector('#players-select');
const nameSettingsButton = mainForm.querySelector('#namesettings-button');
const gameModeRadio = mainForm.querySelector('#gamemode');
const plus3CardRadio = mainForm.querySelector('#plus3card');
const gamedifficultyRadio = mainForm.querySelector('#gamedifficulty');
const helperButtonCheckbox = mainForm.querySelector('#helperbtn-checkbox');
const showSetButtonCheckbox = mainForm.querySelector('#showsetbtn-checkbox');

const toplistPlayerList = document.querySelector('#toplist-player-list');
const toplistPageChange = document.querySelector('#toplist-page-change');
const toplistMPPageChange = document.querySelector('#toplist-multiplayer-page-change');

const MAX_PAGE = 3;
const MAX_MPPAGE = 10;

let toplistPage = 0;
let toplistMPPage = 0;

let gameData;

export function open(){
    reset();
    view.showPage();

    view.setToplist(loadSPNormalMode(), toplistPage, toplistMPPage);
    view.showMPPageChange(toplistPage === 2);
}
function reset(){
    gameData = new GameData({});

    playersSelect.value = 2;
    helperButtonCheckbox.checked = false;
    showSetButtonCheckbox.checked = false;

    plus3CardRadio.firstElementChild.firstElementChild.checked = true;
    gameModeRadio.firstElementChild.firstElementChild.checked = true;
    gamedifficultyRadio.firstElementChild.firstElementChild.checked = true;

    toplistPage = 0;
    toplistMPPage = 0;

    view.showAdvancedOptions();

}
export function close(){
    view.hidePage();
}

function handleGameDifficultyRadioChange(e){
    const option = e.target.value;
    gameData.difficulty = Difficulties[Object.keys(Difficulties)[option]];

}

function handleGameModeRadioChange(e){
    const option = e.target.value;
    gameData.mode = GameModes[Object.keys(GameModes)[option]];

    switch(gameData.mode){
        case GameModes.PRACTICE:
            view.showAdvancedOptions();
            break;
        case GameModes.COMPETITION:
            view.hideAdvancedOptions();
            break;
    }
}
function handlePlus3CardRadioChange(e){
    const option = e.target.value;

    gameData.plus3Card = Plus3CardOptions[Object.keys(Plus3CardOptions)[option]];
}
function handlePlayersSelectChange(e){
    const size = +e.target.value;
    gameData.changePlayerNumber(size);
}

function handlePlayerNameButtonClick(e){
    view.setPlayerNamesList(gameData.players);
    view.showNameSettingsPopup();
}
function nameFormSubmit(e){
    e.preventDefault();

    const nameInputs = e.target.querySelectorAll('input');
    gameData.changePlayerNames([...nameInputs].map(input => input.value));

    view.hideNameSettingsPopup();
}
function mainFormSubmit(e){
    e.preventDefault();

    gameData.helperButton = gameData.mode === GameModes.COMPETITION ? false : helperButtonCheckbox.checked;
    gameData.showSetButton = gameData.mode === GameModes.COMPETITION ? false : showSetButtonCheckbox.checked;
    gameData.plus3Card = gameData.mode === GameModes.COMPETITION ? Plus3CardOptions.AUTO : gameData.plus3Card;
    
    startGame(gameData);
}

function handlePageChange(e){
    const btn = e.target.closest('button');

    if(btn){
        const change = +btn.dataset.change;

        toplistPage += change;

        if(toplistPage >= MAX_PAGE)
            toplistPage = 0;
        else if(toplistPage < 0){
            toplistPage = MAX_PAGE-1;
        }

        switch(toplistPage){
            case 0:
                view.setToplist(loadSPNormalMode(), toplistPage, toplistMPPage);
                break;
            case 1:
                view.setToplist(loadSPHardMode(), toplistPage, toplistMPPage);
                break;
            case 2:
                view.setToplist(loadMultiplayerMode(toplistMPPage), toplistPage, toplistMPPage);
                break;
        }
        view.showMPPageChange(toplistPage === 2);
    }

}
function handleMPPageChange(e){

    const btn = e.target.closest('button');

    if(btn){
        const change = +btn.dataset.change;

        toplistMPPage += change;

        if(toplistMPPage >= MAX_MPPAGE)
            toplistMPPage = 0;
        else if(toplistMPPage < 0){
            toplistMPPage = MAX_MPPAGE-1;
        }

        view.setToplist(loadMultiplayerMode(toplistMPPage),toplistPage, toplistMPPage);
    }
}
gamedifficultyRadio.addEventListener('change', handleGameDifficultyRadioChange);
gameModeRadio.addEventListener('change', handleGameModeRadioChange);
plus3CardRadio.addEventListener('change', handlePlus3CardRadioChange);
playersSelect.addEventListener('change', handlePlayersSelectChange);
nameSettingsButton.addEventListener('click', handlePlayerNameButtonClick);
nameForm.addEventListener('submit', nameFormSubmit);
mainForm.addEventListener('submit', mainFormSubmit);

toplistPageChange.addEventListener('click', handlePageChange);
toplistMPPageChange.addEventListener('click', handleMPPageChange);

export default {open};