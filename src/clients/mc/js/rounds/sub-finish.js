import * as main from "../main.js";

const hash = [];
var startTime;
var pauseTime;
var timeLeft;
var downloadTimer;

export const handle = () => {
    main.socket.on("_SFI_startRound", (playerList) => {
        for (let i = 0; i < playerList.length; i++) {
            hash[playerList[i] - 1] = i + 1;
            document.getElementById("answer-name-" + (i + 1)).textContent = main.allPlayerName[playerList[i] - 1];
        }
    });

    main.socket.on("_SFI_openQuestion", (serverData) => {
        document.getElementById("SFI_question-number").innerHTML = main.templateLabel("Câu hỏi số:") + "&nbsp" + serverData.openedCount;
        document.querySelector("#SFI_question .question-content label").textContent = serverData.questionData.question;
        document.querySelector("#SFI_answer .answer-content label").textContent = serverData.questionData.answer;
        document.querySelector("#SFI_note .note-content label").textContent = serverData.questionData.note;
        document.getElementById("time-left").textContent = 15;
        timeLeft = 15;
        for (let i = 1; i <= 4; i++) document.getElementById("current-point-" + i).classList.remove("granted");
    });

    main.socket.on("_SFI_closeQuestion", () => {
        document.querySelector("#SFI_question .question-content label").textContent = "";
        document.querySelector("#SFI_answer .answer-content label").textContent = "";
        document.querySelector("#SFI_note .note-content label").textContent = "";
    });

    main.socket.on("_SFI_timing", () => {
        startTime = Date.now() / 1000;
        clearInterval(main.downloadTimer);
        timing(startTime, Number(timeLeft));
        for (let i = 1; i <= 4; i++) document.getElementById("current-point-" + i).classList.remove("granted");
    });

    main.socket.on("_SFI_blockSignal", (playerNumber) => {
        clearInterval(downloadTimer);
        pauseTime = Date.now() / 1000;
        timeLeft = timeLeft - (pauseTime - Number(startTime));
        document.getElementById("current-point-" + playerNumber).classList.add("granted");
    });
};

const timing = (startTime, timeLeft) => {
    let currentTime;
    clearInterval(downloadTimer);
    downloadTimer = setInterval(() => {
        currentTime = Date.now() / 1000;
        document.getElementById("time-left").textContent = Math.floor(Number(timeLeft - (currentTime - startTime))) + 1;
        if (Number(currentTime) >= Number(startTime) + timeLeft) {
            document.getElementById("time-left").textContent = 0;
            clearInterval(downloadTimer);
        }
    }, 1);
};
