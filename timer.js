export class Timer {

    constructor({callbackFn}){
        this.callbackFn = callbackFn;
        this.elapsedTime = 0;
    }
    start(){
        this.startTime = new Date().getTime();

        this.timer = setInterval(() => {this.tick(this.callbackFn)}, 1);
    }
    stop() {
        clearInterval(this.timer);
    }
    restart(){
        this.stop();
        this.elapsedTime = 0;
    }
    tick(callbackFn) {
        let now = new Date().getTime();

        let distance = now - this.startTime;

        this.elapsedTime = Math.floor((distance/1000));

        callbackFn(distance);
    }
}