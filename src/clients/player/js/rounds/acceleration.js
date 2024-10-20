import * as audio from "../../../../modules/clients-side/audio.js";
import * as main from "../main.js";
import * as match from "../match-room.js";

const mainTimeAudio = new Audio();
var downloadTimer;

export const handle = () => {
    main.socket.on("_ACC_chooseQuestion", () => {
        match.pushAudioAndPlay(audio.ACC_openQuestionAudio);
        match.useAnswerInput("off");
    });

    main.socket.on("_ACC_openQuestion", (questionData) => {
        document.getElementById("question-text").textContent = questionData.question;
        document.getElementById("media").innerHTML = "";
        if (questionData.type == "Video") {
            const sourceNum = questionData.mediaUrl.length;
            document.getElementById("media").innerHTML +=
                "<video preload='auto' disablePictureInPicture controlsList='nodownload'><source src='" + questionData.mediaUrl + "' type='video/mp4'></source></video>";
            main.socket.emit("ACC_checkVideoSource", { sourceNum, playerNumber: main.playerNumber });
        } else {
            document.getElementById("media").innerHTML += "<img src='" + questionData.mediaUrl + "'>";
        }
        match.resetAnswerZone();
    });

    main.socket.on("ACC_sendQuestionNumber", (questionNumber) => {
        document.getElementById("OBS_ACC_SFI_status").innerHTML = "<i class='fa-solid fa-pencil'></i>&nbsp&nbspTăng tốc " + questionNumber;
    });

    main.socket.on("_ACC_sendAnswer", (serverData) => {
        if (main.playerNumber == serverData.answerData.playerNumber) {
            document.getElementById("answer-input").value = "";
            document.getElementById("save-answer-text").textContent = serverData.answerData.playerAnswer + " (" + serverData.costTime + ")";
        }
    });

    main.socket.on("_ACC_startTiming", (data) => {
        timing(data.questionNumber * 10);
        countDown(data.questionNumber * 10);
    });

    main.socket.on("_ACC_showAnswer", (answerData) => {
        document.getElementById("answer-input").removeEventListener("keypress", keypressHandler);
        match.pushAudioAndPlay(audio.ACC_showAnswersAudio);
        for (let i = 1; i <= 4; i++) {
            document.getElementById("answer-name-" + i).textContent = answerData[i - 1].name;
            let time = String(answerData[i - 1].time);
            if (time[time.length - 2] == ".") time += "0";
            document.getElementById("answer-text-" + i).innerHTML = answerData[i - 1].answer + "<br>" + "[" + time + "]";
        }
    });

    main.socket.on("_ACC_showQuestionAnswer", (data) => {
        document.getElementById("media").innerHTML = "";
        if (data.type == "Image") {
            document.getElementById("media").innerHTML += "<img src='" + data.answerImage + "'>";
        }
    });

    main.socket.on("_ACC_right", (answerData) => {
        match.pushAudioAndPlay(audio.ACC_rightAudio);
        for (let i = 0; i < 4; i++) {
            if (!answerData[i].checked) document.getElementById("answer-" + (i + 1)).style.opacity = "0.5";
        }
    });

    main.socket.on("_ACC_wrong", () => {
        match.pushAudioAndPlay(audio.ACC_wrongAudio);
        for (let i = 1; i <= 4; i++) {
            document.getElementById("answer-" + i).style.opacity = "0.5";
        }
    });

    main.socket.on("_ACC_closeQuestion", () => {
        document.getElementById("question-text").textContent = "";
        document.getElementById("media").innerHTML = "";
        match.resetAnswerZone();
    });
};

const keypressHandler = (event) => {
    const playerAnswer = String(document.getElementById("answer-input").value).trim().toUpperCase();
    if (event.key === "Enter" && (match.isAllowBlankAnswer || playerAnswer != "")) {
        main.socket.emit("ACC_sendAnswer", {
            playerNumber: main.playerNumber,
            playerAnswer,
        });
    }
};

const timing = (time) => {
    const media = document.querySelector("#media video");
    if (media) media.play();
    match.useAnswerInput("on");
    document.getElementById("answer-input").focus();
    document.getElementById("answer-input").addEventListener("keypress", keypressHandler);
    mainTimeAudio.pause();
    if (time == 10) mainTimeAudio.src = audio.ACC_10secondsAudio.src;
    else if (time == 20) mainTimeAudio.src = audio.ACC_20secondsAudio.src;
    else if (time == 30) mainTimeAudio.src = audio.ACC_30secondsAudio.src;
    else mainTimeAudio.src = audio.ACC_40secondsAudio.src;
    match.pushAudioAndPlay(mainTimeAudio);
};

const countDown = (time) => {
    document.getElementById("answer-input").focus();
    document.getElementById("time-left").textContent = time;
    clearInterval(downloadTimer);
    let timeLeft = time - 1;
    downloadTimer = setInterval(() => {
        document.getElementById("time-left").textContent = timeLeft;
        if (timeLeft <= 0) clearInterval(downloadTimer);
        timeLeft -= 1;
    }, 1000);
};
