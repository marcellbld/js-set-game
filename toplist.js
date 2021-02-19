export function saveSPNormalMode(name, time){
    let data = loadSPNormalMode();
    data.push({name, time});
    data = data.sort((d1, d2) => d1.time - d2.time).slice(0,10);

    localStorage.setItem('sp-normal-toplist', JSON.stringify(data));
}
export function saveSPHardMode(name, time){

    let data = loadSPHardMode();
    data.push({name, time});
    data = data.sort((d1, d2) => d2.time + d1.time).slice(0,10);

    localStorage.setItem('sp-hard-toplist', JSON.stringify(data));
}
export function saveMultiplayer(players){
    let data = loadMultiplayer();
    data.unshift(players);

    data = data.slice(0,10);

    localStorage.setItem('mp-toplist', JSON.stringify(data));
}

export function loadSPNormalMode(){
    return JSON.parse(localStorage.getItem('sp-normal-toplist')) ?? [];
}
export function loadSPHardMode(){
    return JSON.parse(localStorage.getItem('sp-hard-toplist')) ?? [];
}
function loadMultiplayer(){
    const list = JSON.parse(localStorage.getItem('mp-toplist'));
    return list ?? [];
}
export function loadMultiplayerMode(id){
    const list = loadMultiplayer();
    return list ? list[id] : [];
}