export const createTimer = (state, seconds) => {
    state.timerState = true;
    let startTime = Date.now();

    const updateTimer = () => {
        const elapsedTime = Math.floor((Date.now() - startTime) / 1000);
        const remainingTime = seconds - elapsedTime;

        if (remainingTime > 0) {
            state.text = remainingTime.toString();
            requestAnimationFrame(updateTimer);
        } else {
            state.text = "";
            state.timerState = false;
        }
    };

    updateTimer();
};