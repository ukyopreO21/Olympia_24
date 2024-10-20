import * as audio from "../../../../modules/clients-side/audio.js";
import * as main from "../main.js";

const mainTimeAudio = new Audio();

export const handle = () => {
    main.socket.on("_ACC_chooseQuestion", () => {
        audio.ACC_openQuestionAudio.pause();
        audio.ACC_openQuestionAudio.currentTime = 0;
        audio.ACC_openQuestionAudio.play();
    });

    main.socket.on("_ACC_startTiming", (data) => {
        timing(data.questionNumber * 10);
    });

    main.socket.on("_ACC_showAnswer", () => {
        audio.ACC_showAnswersAudio.pause();
        audio.ACC_showAnswersAudio.currentTime = 0;
        audio.ACC_showAnswersAudio.play();
    });

    main.socket.on("_ACC_right", () => {
        audio.ACC_rightAudio.pause();
        audio.ACC_rightAudio.currentTime = 0;
        audio.ACC_rightAudio.play();
    });

    main.socket.on("_ACC_wrong", () => {
        audio.ACC_wrongAudio.pause();
        audio.ACC_wrongAudio.currentTime = 0;
        audio.ACC_wrongAudio.play();
    });
};

const timing = (time) => {
    if (time == 10) mainTimeAudio.src = audio.ACC_10secondsAudio.src;
    else if (time == 20) mainTimeAudio.src = audio.ACC_20secondsAudio.src;
    else if (time == 30) mainTimeAudio.src = audio.ACC_30secondsAudio.src;
    else mainTimeAudio.src = audio.ACC_40secondsAudio.src;
    mainTimeAudio.currentTime = 0;
    mainTimeAudio.play();
};
