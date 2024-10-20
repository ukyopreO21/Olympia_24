import * as main from "../main.js";
import * as funcs from "../funcs.js";

var signalPlayer = 0;
var timeLeft;
var downloadTimer;

export const handle = () => {
    main.socket.on("_SFI_openQuestion", (data) => {
        funcs.setQuestionData(data.questionData);
    });

    main.socket.on("_SFI_blockSignal", (playerNumber) => {
        timeLeft = Number(document.getElementById("SFI_time").textContent);
        signalPlayer = playerNumber;
        clearInterval(downloadTimer);
        document.getElementById("player-" + playerNumber).style.border = "calc(5vw/48) solid #73f7ff";
        document.getElementById("SFI_clock-status").textContent = "Đang dừng";
    });
};

export const assignButton = () => {
    window.choosePlayers = choosePlayers;
    window.pick = pick;
    window.startRound = startRound;
    window.openQuestion = openQuestion;
    window.closeQuestion = closeQuestion;
    window.startTiming = startTiming;
    window.right = right;
    window.continueTiming = continueTiming;
    window.deleteSignal = deleteSignal;
};

const choosePlayers = () => {
    document.getElementById("SFI_players").style.pointerEvents = "auto";
    if (document.getElementById("SFI_start-round")) document.getElementById("SFI_start-round").style.display = "block";
    const temp = document.getElementById("SFI_players");
    temp.innerHTML = "";
    for (let i = 1; i <= 4; i++) {
        temp.innerHTML += '<span class="SFI_player" data-picked="false" onclick="pick(this)" id="SFI_' + i + '"></span> ';
        const button = document.getElementById("SFI_" + i);
        button.textContent = document.getElementById("player-name-" + i).value;
    }
    temp.innerHTML += '<span class="button" id="SFI_start-round" onclick="startRound()">Bắt đầu vòng thi</span>';
    temp.innerHTML += "<br>";
};

const pick = (buttonData) => {
    const button = document.getElementById(buttonData.id);
    if (button.getAttribute("data-picked") == "false") {
        button.style.borderColor = "orange";
        button.dataset.picked = "true";
    } else {
        button.style.borderColor = "#a80000";
        button.dataset.picked = "false";
    }
};

const startRound = () => {
    if (document.getElementById("interface-name").textContent == "Phòng chat") funcs.changeInterface();
    const chosen = [];
    document.getElementById("SFI_players").style.pointerEvents = "none";
    document.getElementById("SFI_start-round").style.display = "none";
    for (let i = 1; i <= 4; i++) {
        if (document.getElementById("SFI_" + i).getAttribute("data-picked") == "true") {
            chosen.push(Number(i));
        }
    }
    main.socket.emit("SFI_startRound", chosen);
};

const openQuestion = () => {
    document.getElementById("SFI_time").textContent = "15.00";
    deleteSignal();
    const questionNumber = Number(document.getElementById("SFI_question-number").value);
    main.socket.emit("SFI_openQuestion", questionNumber);
};

const closeQuestion = () => {
    main.socket.emit("SFI_closeQuestion");
};

const timing = (startTime, leftTime) => {
    let currentTime;
    document.getElementById("SFI_clock-status").textContent = "Đang chạy";
    downloadTimer = setInterval(() => {
        currentTime = (Date.now() / 1000).toFixed(2);
        document.getElementById("SFI_time").textContent = (leftTime - (Number(currentTime) - Number(startTime))).toFixed(2);
        if (Number(currentTime) >= Number(startTime) + leftTime) {
            document.getElementById("SFI_time").textContent = "0.00";
            clearInterval(downloadTimer);
            main.socket.emit("SFI_blockButton");
        }
    }, 1);
};

const startTiming = () => {
    clearInterval(downloadTimer);
    const startTime = (Date.now() / 1000).toFixed(2);
    timing(startTime, 15);
    main.socket.emit("SFI_timing", true);
};

const right = () => {
    main.socket.emit("SFI_right");
};

const continueTiming = () => {
    deleteSignal();
    clearInterval(downloadTimer);
    const startTime = (Date.now() / 1000).toFixed(2);
    timing(startTime, timeLeft);
    main.socket.emit("SFI_timing", false);
};

const deleteSignal = () => {
    for (let i = 1; i <= 4; i++) {
        document.getElementById("player-" + i).style.border = "calc(5vw/96) dotted grey";
    }
};

export const resetRound = () => {
    signalPlayer = 0;
};
