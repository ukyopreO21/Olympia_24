import * as audio from "../../../../modules/clients-side/audio.js";
import * as main from "../main.js";
import * as match from "../match-room.js";

const SFI_Hash = [];
var downloadTimer;
var isEliminated;
var chosenToPlay = false;
var startTime;
var pauseTime;
var timeLeft;

export const handle = () => {
    main.socket.on("_SFI_startRound", (playerList) => {
        match.contestUI("on");
        match.defaultPlayerFunction();
        if (playerList.indexOf(main.playerNumber) > -1) {
            chosenToPlay = true;
            match.useSignalButton("on");
        }
        document.getElementById("signal-button").innerHTML = "<i class='fa-solid fa-bell'></i>&nbsp&nbspGIÀNH QUYỀN TRẢ LỜI";
        for (let i = 0; i < playerList.length; i++) {
            SFI_Hash[playerList[i] - 1] = i + 1;
            document.getElementById("answer-name-" + (i + 1)).textContent = main.allPlayerName[playerList[i] - 1];
        }
        document.getElementById("custom-status").innerHTML += '<div id="OBS_ACC_SFI_status"></div>';
    });

    main.socket.on("_SFI_openQuestion", (serverData) => {
        isEliminated = false;
        document.getElementById("OBS_ACC_SFI_status").innerHTML = "<i class='fa-solid fa-pencil'></i>&nbsp&nbspCâu hỏi số " + serverData.openedCount;
        document.getElementById("question-text").textContent = serverData.questionData.question;
        document.getElementById("time-left").textContent = 15;
        timeLeft = 15;
        for (let i = 1; i <= 4; i++) document.getElementById("current-point-" + i).classList.remove("FIN_granted");
    });

    main.socket.on("_SFI_closeQuestion", () => {
        document.getElementById("question-text").textContent = "";
    });

    main.socket.on("_SFI_timing", (isReset) => {
        if (chosenToPlay && !isEliminated) {
            document.getElementById("signal-button").onclick = sendSignal;
            match.useSignalButton("on");
        }
        startTime = Date.now() / 1000;
        timing(startTime, Number(timeLeft));
        if (isReset) {
            match.pushAudioAndPlay(audio.SFI_mainTimeAudio);
        } else {
            audio.SFI_mainTimeAudio.play();
        }
        for (let i = 1; i <= 4; i++) document.getElementById("current-point-" + i).classList.remove("FIN_granted");
    });

    main.socket.on("_SFI_right", () => {
        match.pushAudioAndPlay(audio.FIN_rightAudio);
    });

    main.socket.on("_SFI_blockSignal", (playerNumber) => {
        clearInterval(downloadTimer);
        pauseTime = Date.now() / 1000;
        timeLeft = timeLeft - (pauseTime - Number(startTime));
        audio.SFI_mainTimeAudio.pause();
        document.getElementById("current-point-" + playerNumber).classList.add("FIN_granted");
        match.useSignalButton("off");
        match.pushAudioAndPlay(audio.FIN_signalAudio);
    });

    main.socket.on("_SFI_blockButton", () => {
        match.useSignalButton("off");
    });
};

const sendSignal = () => {
    match.useSignalButton("off");
    main.socket.emit("SFI_blockSignal", main.playerNumber);
    isEliminated = true;
};

const timing = (startTime, timeLeft) => {
    clearInterval(main.downloadTimer);
    clearInterval(downloadTimer);
    let currentTime;
    downloadTimer = setInterval(() => {
        currentTime = Date.now() / 1000;
        document.getElementById("time-left").textContent = Math.floor(Number(timeLeft - (currentTime - startTime))) + 1;
        if (Number(currentTime) >= Number(startTime) + timeLeft) {
            document.getElementById("time-left").textContent = 0;
            clearInterval(downloadTimer);
        }
    }, 1);
};
