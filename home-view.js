const nameSettingsPopup = document.querySelector('#namesettings-popup');
const advancedOptions = document.querySelector('#advanced-options');
const nameFormPlayerList = document.querySelector('#name-form ul');
const warning = document.querySelector('#warning');

const homePage = document.querySelector('#home-page');

const toplistPlayerList = document.querySelector('#toplist-player-list');
const toplistPageText = document.querySelector('#toplist-page-change span');
const toplistMPPageChange = document.querySelector('#toplist-multiplayer-page-change');
const toplistMPPageText = document.querySelector('#toplist-multiplayer-page-change span');

function genNameFormPlayerListItem(text, placeholder, value){
    return `<li class="my-2" style="list-style-type:none;">
        <div class="input-group">
            <div class="input-group-prepend">
            <span class="input-group-text" id="">${text}</span>
            </div>
            <input type="text" class="form-control" placeholder=${placeholder} value=${value}>
        </div>
    </li>`;
}
function genToplistRow(id, name, points){
    return `
    <li class="d-flex" style="list-style-type:none;">
        <span class="p-2">${id+'.'}</span>
        <span class="p-2">${name}</span>
        <span class="ml-auto p-2">${points}</span>
    </li>`
}

export function showMPPageChange(visible){
    if(visible){
        toplistMPPageChange.classList.remove('d-none');
        toplistMPPageChange.classList.add('d-flex');
    }
    else{
        toplistMPPageChange.classList.remove('d-flex');
        toplistMPPageChange.classList.add('d-none');
    }
}
export function setToplist(datas, pageID, subPageID){
    toplistPlayerList.innerHTML = '';
    if(datas && datas.length > 0){   
        datas.forEach((data,i) => {
            toplistPlayerList.innerHTML += genToplistRow(i+1, data.name, data.points ?? new Date((data.time) * 1000).toISOString().substr(11, 8));
        });
    } else {
        toplistPlayerList.innerText = 'Nincs adat';
    }
    toplistPageText.innerText = pageID+1;
    toplistMPPageText.innerText = subPageID+1;
}


export function showPage(){
    homePage.hidden = false;

    
}
export function hidePage(){
    homePage.hidden = true;
}

export function showAdvancedOptions(){
    advancedOptions.hidden = false;
    warning.classList.remove('d-flex');
}
export function hideAdvancedOptions(){
    advancedOptions.hidden = true;
    warning.classList.add('d-flex');
}

export function setPlayerNamesList(players){
    nameFormPlayerList.innerHTML = '';
    players.forEach( (player,i) => {
        const placeholder = 'Játékos'+(i+1);
        nameFormPlayerList.innerHTML += genNameFormPlayerListItem((i+1)+". Játékos", placeholder, player.name === placeholder ? '' : player.name)}
    );
}

export function showNameSettingsPopup(){
    nameSettingsPopup.classList.add('d-flex');
}

export function hideNameSettingsPopup(){
    nameSettingsPopup.classList.remove('d-flex');
}