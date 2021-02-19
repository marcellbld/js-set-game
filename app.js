import * as home from "./home-main.js";
import * as game from "./game-main.js";

export function startHome(){
    home.open();
    game.close();
}
export function startGame(data){
    home.close();
    game.open(data);
}

startHome();