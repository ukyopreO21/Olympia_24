import * as audio from "../../../../modules/clients-side/audio.js";
import * as main from "../main.js";

var currentPlayer, questionNumber, signalPlayer, downloadTimer;

export const handle = () => {
    main.socket.on("_STR_choosePlayer", (turnNumber) => {
        removeAllGranted();
        currentPlayer = Number(turnNumber);
        if (currentPlayer != 5) document.getElementById("STR_player-" + currentPlayer).classList.add("STR_granted");
    });

    main.socket.on("_STR_startPlayerTurn", () => {
        questionNumber = 0;
        audio.STR_startTurnAudio.pause();
        audio.STR_startTurnAudio.currentTime = 0;
        audio.STR_startTurnAudio.play();
    });

    main.socket.on("_STR_openQuestionBoard", () => {
        roundInterface("visible");
        printPlayerData();
        audio.STR_openQuestionBoardAudio.pause();
        audio.STR_openQuestionBoardAudio.currentTime = 0;
        audio.STR_openQuestionBoardAudio.play();
        document.getElementById("start-interface").style.visibility = "visible";
        const questionBox = document.getElementById("STR_question-zone");
        questionBox.classList.remove("STR_move-board");
        void questionBox.offsetWidth;
        const shelf = document.getElementById("STR_shelf");
        shelf.classList.remove("STR_move-question-shelf");
        void shelf.offsetWidth;
        const status = document.getElementById("STR_status-zone");
        status.classList.remove("STR_move-status");
        void status.offsetWidth;
        const players = document.querySelectorAll(".STR_player");
        for (let i = 0; i < players.length; i++) {
            players[i].classList.remove("STR_move-player");
            players[i].offsetWidth;
            players[i].classList.add("STR_move-player");
            document.getElementById(players[i].id).style.animationDelay = (i + 1) * 250 + "ms";
        }
        questionBox.classList.add("STR_move-board");
        shelf.classList.add("STR_move-question-shelf");
        status.classList.add("STR_move-status");
    });

    main.socket.on("_STR_startTurn", (settings) => {
        questionNumber++;
        printNextQuestion(settings.questionData);
        printPassStatus();
        audio.STR_loop1Audio.currentTime = 0;
        audio.STR_loop1Audio.play();
    });

    main.socket.on("_STR_timing", (time) => {
        if ((currentPlayer != 5 && questionNumber == 6 && time == 5) || (currentPlayer == 5 && questionNumber == 12 && time == 5)) {
            fadeOutAndPlay(audio.STR_loop4Audio, audio.STR_loop3Audio);
        }
        if (currentPlayer == 5 && questionNumber == 12 && time == 5 && !signalPlayer) return;
        countDown(time);
    });

    main.socket.on("_STR_blockSignal", (playerNumber) => {
        audio.FIN_signalAudio.pause();
        audio.FIN_signalAudio.currentTime = 0;
        audio.FIN_signalAudio.play();
        document.getElementById("STR_player-" + playerNumber).classList.add("STR_granted");
        signalPlayer = playerNumber;
    });

    main.socket.on("_STR_right", () => {
        const right = audio.STR_rightAudio.cloneNode();
        right.play();
    });

    main.socket.on("_STR_wrong", () => {
        const wrong = audio.STR_wrongAudio.cloneNode();
        wrong.play();
    });

    main.socket.on("_STR_getNextQuestion", (settings) => {
        if (currentPlayer == 5) removeAllGranted();
        signalPlayer = 0;
        questionNumber++;
        printNextQuestion(settings.questionData);
        printPassStatus();
        if ((currentPlayer != 5 && questionNumber == 3) || (currentPlayer == 5 && questionNumber == 6)) {
            fadeOutAndPlay(audio.STR_loop2Audio, audio.STR_loop1Audio);
        }
        if ((currentPlayer != 5 && questionNumber == 5) || (currentPlayer == 5 && questionNumber == 11)) {
            fadeOutAndPlay(audio.STR_loop3Audio, audio.STR_loop2Audio);
        }

        clearInterval(downloadTimer);
        document.getElementById("STR_time").textContent = "";
    });

    main.socket.on("_STR_finishTurn", () => {
        document.getElementById("STR_image").innerHTML = "";
        document.getElementById("STR_time").textContent = "";
        removeAllGranted();
        roundInterface("hidden");
        audio.STR_loop1Audio.pause();
        audio.STR_loop2Audio.pause();
        audio.STR_loop3Audio.pause();
        audio.STR_loop4Audio.pause();
        audio.STR_loop1Audio.volume = 1;
        audio.STR_loop2Audio.volume = 1;
        audio.STR_loop3Audio.volume = 1;
        audio.STR_loop4Audio.volume = 1;
        document.getElementById("STR_question").textContent = "";
        document.getElementById("STR_status").textContent = "";
        audio.STR_finishTurnAudio.pause();
        audio.STR_finishTurnAudio.currentTime = 0;
        audio.STR_finishTurnAudio.play();
    });
};

const roundInterface = (visibility) => {
    const dad = document.getElementById("start-interface");
    const child = dad.querySelectorAll("*");
    for (let i = 0; i < child.length; i++) {
        child[i].style.visibility = visibility;
    }
};

export const printPlayerData = () => {
    for (let i = 0; i < 4; i++) {
        document.getElementById("STR_name-" + (i + 1)).textContent = i + 1 + ". " + main.allPlayerName[i];
        document.getElementById("STR_point-" + (i + 1)).textContent = main.allPlayerPoint[i];
    }
};

const removeAllGranted = () => {
    for (let i = 1; i <= 4; i++) {
        document.getElementById("STR_player-" + i).classList.remove("STR_granted");
    }
};

const printNextQuestion = (questionData) => {
    main.questionAudio.pause();
    document.getElementById("STR_image").innerHTML = "";
    if (main.getMediaType(questionData.mediaUrl) == "image") {
        document.getElementById("STR_question").style.right = "30%";
        document.getElementById("STR_image").innerHTML += "<img src='" + questionData.mediaUrl + "'>";
    } else document.getElementById("STR_question").style.right = "0%";
    document.getElementById("STR_question").textContent = questionData.question;
    main.autoScaleFontSize(document.getElementById("STR_question"));
    if (currentPlayer == 5) removeAllGranted();
};

const printPassStatus = () => {
    if (currentPlayer != 5) document.getElementById("STR_status").textContent = "Câu " + questionNumber + "/6";
    else document.getElementById("STR_status").textContent = "Câu " + questionNumber + "/12";
};

const countDown = (time) => {
    clearInterval(downloadTimer);
    document.getElementById("STR_time").textContent = time;
    let timeLeft = time - 1;
    downloadTimer = setInterval(() => {
        document.getElementById("STR_time").textContent = timeLeft;
        if (timeLeft <= 0) {
            clearInterval(downloadTimer);
        }
        timeLeft -= 1;
    }, 1000);
};

const fadeOutAndPlay = (nextAudio, currentAudio) => {
    const volumeStep = 0.01;
    const interval = 5;
    nextAudio.play();
    const fadeOutInterval = setInterval(() => {
        currentAudio.volume = Math.max(currentAudio.volume - volumeStep, 0);
        if (currentAudio.volume === 0) {
            currentAudio.pause();
            currentAudio.currentTime = 0;
            clearInterval(fadeOutInterval);
        }
    }, interval);
};
