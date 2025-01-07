export const createTimer = ( state, secounds)=> {
    state.timerState = true;
    let countdownTime = secounds;
    const countdownInterval = setInterval(() => {
        if (countdownTime > 0) {
            countdownTime--;
            state.text = (countdownTime + 1 ).toString();
        } else {
            clearInterval(countdownInterval);
            state.text = "";
            state.timerState = false;
        }
    }, 1000);
}