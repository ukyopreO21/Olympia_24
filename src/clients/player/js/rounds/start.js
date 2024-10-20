import * as audio from "../../../../modules/clients-side/audio.js";
import * as main from "../main.js";
import * as match from "../match-room.js";

var currentPlayer, questionNumber, signalPlayer;
var downloadTimer;

export const handle = () => {
    main.socket.on("_STR_choosePlayer", (turnNumber) => {
        currentPlayer = Number(turnNumber);
        if (currentPlayer != 5)
            document.getElementById("STR_player").innerHTML = "<font color='orange'><i class='fa-solid fa-user'></i>&nbsp&nbspLượt:</font>" + "&nbsp;" + main.allPlayerName[currentPlayer - 1];
        else document.getElementById("STR_player").innerHTML = "<font color='orange'><i class='fa-solid fa-user'></i>&nbsp&nbspLượt:</font>&nbsp" + "Chung";
    });

    main.socket.on("_STR_startPlayerTurn", () => {
        questionNumber = 0;
        match.pushAudioAndPlay(audio.STR_startTurnAudio);
        if (currentPlayer != 5) document.getElementById("STR_progress").innerHTML = "<font color='orange'><i class='fa-solid fa-list'></i>&nbsp&nbspCâu:</font>" + "&nbsp;" + "0/6";
        else document.getElementById("STR_progress").innerHTML = "<font color='orange'><i class='fa-solid fa-list'></i>&nbsp&nbspCâu:</font>" + "&nbsp;" + "0/12";
    });

    main.socket.on("_STR_openQuestionBoard", () => {
        document.getElementById("time-left").textContent = "0";
        match.pushAudioAndPlay(audio.STR_openQuestionBoardAudio);
        questionNumber = 0;
    });

    main.socket.on("_STR_startTurn", (settings) => {
        if (currentPlayer == 5) document.getElementById("signal-button").onclick = sendSignal;
        questionNumber++;
        printNextQuestion(settings);
        printPassStatus();
        match.playStartLoop(1);
    });

    main.socket.on("_STR_timing", (time) => {
        if ((currentPlayer != 5 && questionNumber == 6 && time == 5) || (currentPlayer == 5 && questionNumber == 12 && time == 5)) {
            match.playStartLoop(4, 3);
        }
        if (currentPlayer == 5 && questionNumber == 12 && time == 5 && !signalPlayer) return;
        countDown(time);
    });

    main.socket.on("_STR_blockSignal", (player) => {
        match.useSignalButton("off");
        match.pushAudioAndPlay(audio.FIN_signalAudio);
        signalPlayer = player;
        document.getElementById("current-point-" + player).classList.add("FIN_granted");
    });

    main.socket.on("_STR_right", () => {
        match.pushAudioAndPlay(audio.STR_rightAudio.cloneNode());
    });

    main.socket.on("_STR_wrong", () => {
        match.pushAudioAndPlay(audio.STR_wrongAudio.cloneNode());
    });

    main.socket.on("_STR_openSignal", () => {
        match.useSignalButton("on");
    });

    main.socket.on("_STR_getNextQuestion", (settings) => {
        if (signalPlayer) document.getElementById("current-point-" + signalPlayer).classList.remove("FIN_granted");
        signalPlayer = 0;
        if ((currentPlayer != 5 && questionNumber < 6) || (currentPlayer == 5 && questionNumber < 12)) questionNumber++;
        printNextQuestion(settings);
        printPassStatus();
        if ((currentPlayer != 5 && questionNumber == 3) || (currentPlayer == 5 && questionNumber == 6)) {
            match.playStartLoop(2, 1);
        } else if ((currentPlayer != 5 && questionNumber == 5) || (currentPlayer == 5 && questionNumber == 11)) {
            match.playStartLoop(3, 2);
        }
        clearInterval(downloadTimer);
        document.getElementById("time-left").textContent = 0;
    });

    main.socket.on("_STR_finishTurn", () => {
        match.useSignalButton("off");
        document.getElementById("media").innerHTML = "";
        document.getElementById("signal-button").onclick = "";
        for (let i = 1; i <= 4; i++) document.getElementById("current-point-" + i).classList.remove("FIN_granted");
        document.getElementById("question-text").textContent = "";
        document.getElementById("STR_player").innerHTML = "";
        document.getElementById("STR_progress").innerHTML = "";
        document.getElementById("STR_subject").innerHTML = "";
        match.pushAudioAndPlay(audio.STR_finishTurnAudio);
        match.stopAllStartLoop();
    });
};

const printNextQuestion = (settings) => {
    document.getElementById("media").innerHTML = "";
    if (currentPlayer == 5 && !settings.blockSignal) {
        match.useSignalButton("on");
    }

    match.questionAudio.pause();
    if (match.getMediaType(settings.questionData.mediaUrl) == "image") document.getElementById("media").innerHTML += "<img src='" + settings.questionData.mediaUrl + "'>";
    document.getElementById("question-text").textContent = settings.questionData.question;
    document.getElementById("STR_subject").innerHTML = "<i class='fa-solid fa-pencil'></i>&nbsp&nbsp" + questionNumber + ". " + settings.questionData.subject;
};

const printPassStatus = () => {
    if (currentPlayer != 5) document.getElementById("STR_progress").innerHTML = "<font color='orange'><i class='fa-solid fa-list'></i>&nbsp&nbspCâu:</font>" + "&nbsp;" + questionNumber + "/6";
    else document.getElementById("STR_progress").innerHTML = "<font color='orange'><i class='fa-solid fa-list'></i>&nbsp&nbspCâu:</font>" + "&nbsp;" + questionNumber + "/12";
};

const sendSignal = () => {
    match.useSignalButton("off");
    main.socket.emit("STR_blockSignal", main.playerNumber);
};

const countDown = (time) => {
    document.getElementById("time-left").textContent = time;
    clearInterval(downloadTimer);
    let timeLeft = time - 1;
    downloadTimer = setInterval(() => {
        document.getElementById("time-left").textContent = timeLeft;
        if (timeLeft <= 0) {
            clearInterval(downloadTimer);
            match.useSignalButton("off");
        }
        timeLeft -= 1;
    }, 1000);
};
