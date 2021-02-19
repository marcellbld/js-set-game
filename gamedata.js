export const GameModes = {
    PRACTICE: 0,
    COMPETITION: 1
}
export const Plus3CardOptions = {
    AUTO: 0,
    BUTTON: 1
}

export const GameStates = {
    PLAY: 0,
    END: 1
}

export const Difficulties = {
    NORMAL: 0,
    HARD: 1
}

export class GameData {

    constructor({playerNumber = 2, 
        mode = GameModes.PRACTICE,
        helperButton = false,
        showSetButton = false,
        plus3Card = Plus3CardOptions.AUTO,
        difficulty = Difficulties.NORMAL
    }){
        this.mode = mode;
        this.helperButton = helperButton;
        this.showSetButton = showSetButton;
        this.plus3Card = plus3Card;
        this.state = GameStates.PLAY;
        this.difficulty = difficulty;

        this.changePlayerNumber(playerNumber);
    }

    hasTurnTimer(){
        return this.playerNumber > 1;
    }
    hasElapsedTimer(){
        return this.playerNumber === 1 && this.mode === GameModes.COMPETITION;
    }

    setStartGame(){
        this.state = GameStates.PLAY;
    }

    setEndGame(){
        this.state = GameStates.END;
    }

    setPointsToZero(){
        this.players.forEach(player => {player.points = 0});
    }

    changePlayerNumber(size) {
        this.playerNumber = size;

        this.players = Array.from(new Array(size), (_,i) => ({
            name: this.players && this.players[i] ? this.players[i].name : "Játékos"+(i+1), 
            points: 0
        }));
    }
    changePlayerNames(names){
        names.forEach((name,i) => {this.players[i].name = name.trim() !== "" ? name.trim() : this.players[i].name});
    }
}
