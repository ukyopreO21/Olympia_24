import * as audio from "../../../../modules/clients-side/audio.js";
import * as main from "../main.js";
import * as match from "../match-room.js";

const mainTimeAudio = new Audio();
var currentPlayer;
var downloadTimer;

export const handle = () => {
    main.socket.on("_FIN_choosePlayer", (playerNumber) => {
        for (let i = 1; i <= 4; i++) document.getElementById("current-point-" + i).classList.remove("FIN_granted");
        match.pushAudioAndPlay(audio.FIN_startTurnAudio);
        currentPlayer = playerNumber;
        document.getElementById("FIN_player").innerHTML = "<font color='orange'><i class='fa-solid fa-user'></i>&nbsp&nbspLượt:</font>" + "&nbsp;" + main.allPlayerName[currentPlayer - 1];
    });

    main.socket.on("_FIN_showQuestionPack", () => {
        match.pushAudioAndPlay(audio.FIN_showQuestionPackAudio);
        FinishUI();
    });

    main.socket.on("_FIN_choose", (chooseData) => {
        match.pushAudioAndPlay(audio.FIN_pickQuestionAudio.cloneNode());
        const list = document.querySelectorAll(".FIN_question-" + chooseData.questionNumber);
        for (let i = 0; i < list.length; i++) {
            list[i].textContent = "";
        }
        document.querySelector("#FIN_pack-" + chooseData.questionPoint + " .FIN_question-" + chooseData.questionNumber).innerHTML = "✓";
    });

    main.socket.on("_FIN_packChosen", (list) => {
        FinishUI();
        match.pushAudioAndPlay(audio.FIN_packChosenAudio);
        let totalPack = 0;
        for (let i = 0; i < 3; i++) {
            document.querySelector("#FIN_pack-" + list[i] + " .FIN_question-" + (i + 1)).classList.add("FIN_chosen");
            totalPack += Number(list[i]);
        }
        setTimeout(() => {
            resetBoard();
            offFinishUI();
        }, 3000);
        document.getElementById("FIN_pack").innerHTML =
            "<font color='orange'><i class='fa-solid fa-cubes'></i>&nbsp&nbspBộ" + "&nbsp;" + totalPack + " điểm:</font>" + "&nbsp;" + list[0] + " - " + list[1] + " - " + list[2];
    });

    main.socket.on("_FIN_chooseQuestion", (data) => {
        document.getElementById("media").innerHTML = "";
        for (let i = 1; i <= 4; i++) document.getElementById("current-point-" + i).classList.remove("FIN_granted");
        document.getElementById("FIN_question").innerHTML = "<i class='fa-solid fa-pencil'></i>&nbsp&nbspCâu " + data.questionNumber + " - " + data.questionData.point + " điểm";
        if (match.getMediaType(data.questionData.mediaUrl) == "image") document.getElementById("media").innerHTML = "<img src='" + data.questionData.mediaUrl + "'>";
        document.getElementById("question-text").textContent = data.questionData.question;
    });

    main.socket.on("_FIN_startTiming", (questionTime) => {
        mainTimeAudio.pause();
        countDown(questionTime);
        if (questionTime == 15) {
            mainTimeAudio.src = audio.FIN_15secondsAudio.src;
        } else {
            mainTimeAudio.src = audio.FIN_20secondsAudio.src;
        }
        match.pushAudioAndPlay(mainTimeAudio);
    });

    main.socket.on("_FIN_star", (isStarOn) => {
        const star = document.querySelector("#FIN_star img");
        if (isStarOn) {
            match.pushAudioAndPlay(audio.FIN_starAudio);
            star.src = "/src/assets/Finish/PlayerStar.gif";
        } else star.src = "";
    });

    main.socket.on("_FIN_blockSignal", (playerNumber) => {
        document.getElementById("signal-button").onclick = "";
        match.pushAudioAndPlay(audio.FIN_signalAudio);
        document.getElementById("current-point-" + playerNumber).classList.add("FIN_granted");
    });

    main.socket.on("_FIN_right", () => {
        match.pushAudioAndPlay(audio.FIN_rightAudio);
    });

    main.socket.on("_FIN_wrong", () => {
        match.pushAudioAndPlay(audio.FIN_wrongAudio);
    });

    main.socket.on("_FIN_5s", () => {
        for (let i = 1; i <= 4; i++) document.getElementById("current-point-" + i).classList.remove("FIN_granted");
        document.getElementById("signal-button").onclick = signal;
        if (main.playerNumber != currentPlayer) match.useSignalButton("on");
        countDown(5);
        match.pushAudioAndPlay(audio.FIN_5secondsAudio);
    });

    main.socket.on("_FIN_finishTurn", () => {
        for (let i = 1; i <= 4; i++) document.getElementById("current-point-" + i).classList.remove("FIN_granted");
        match.pushAudioAndPlay(audio.FIN_finishTurnAudio);
        document.getElementById("question-text").textContent = "";
        document.getElementById("FIN_player").innerHTML = "";
        document.getElementById("FIN_pack").innerHTML = "";
        document.getElementById("FIN_question").innerHTML = "";
    });
};

const FinishUI = () => {
    const parentElement = document.getElementById("finish-interface");
    const childElements = parentElement.getElementsByTagName("*");
    for (let i = 0; i < childElements.length; i++) {
        childElements[i].style.visibility = "visible";
    }
};

const offFinishUI = () => {
    const parentElement = document.getElementById("finish-interface");
    const childElements = parentElement.getElementsByTagName("*");
    for (let i = 0; i < childElements.length; i++) {
        childElements[i].style.visibility = "hidden";
    }
};

const resetBoard = () => {
    const list = document.querySelectorAll(".FIN_question");
    for (let i = 0; i < list.length; i++) {
        list[i].classList.remove("FIN_chosen");
        list[i].textContent = "";
    }
};

const signal = () => {
    match.useSignalButton("off");
    document.getElementById("signal-button").onclick = "";
    main.socket.emit("FIN_blockSignal", main.playerNumber);
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
