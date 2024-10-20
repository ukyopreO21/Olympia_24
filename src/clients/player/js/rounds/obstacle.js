import * as audio from "../../../../modules/clients-side/audio.js";
import * as main from "../main.js";
import * as match from "../match-room.js";

var downloadTimer;

export const handle = () => {
    main.socket.on("_OBS_showNumberOfCharacter", () => {
        match.pushAudioAndPlay(audio.OBS_numberOfCharacterAudio);
    });

    main.socket.on("_OBS_showRows", (data) => {
        match.pushAudioAndPlay(audio.OBS_showRowsAudio);
        document.getElementById("OBS_image-key").src = data[5].mediaUrl;
        const charNumber = String(data[5].answer).replace(/\s+/g, "");
        document.getElementById("OBS_keyword").textContent = "CHƯỚNG NGẠI VẬT CÓ " + charNumber.length + " KÍ TỰ";
        ObstacleUI();
        document.getElementById("signal-button").onclick = sendSignal;
        main.socket.emit("OBS_getRowsLength");
    });

    main.socket.on("_OBS_getRowsLength", (data) => {
        for (let i = 0; i < 4; i++) document.getElementById("OBS_row-" + (i + 1)).textContent = "Hàng ngang " + (i + 1) + " (" + data[i].rowLength + " kí tự)";
    });

    main.socket.on("_OBS_chooseRow", (data) => {
        match.pushAudioAndPlay(audio.OBS_chosenRowAudio);
        match.resetAnswerZone();
        if (data.rowNumber == 5) document.getElementById("OBS_ACC_SFI_status").innerHTML = "<i class='fa-solid fa-pencil'></i>&nbsp&nbspÔ trung tâm";
        else {
            document.getElementById("OBS_row-" + data.rowNumber).style.color = "orange";
            document.getElementById("OBS_ACC_SFI_status").innerHTML = "<i class='fa-solid fa-pencil'></i>&nbsp&nbspHàng ngang " + data.rowNumber;
        }
    });

    main.socket.on("_OBS_showRowQuestion", (questionData) => {
        match.pushAudioAndPlay(audio.OBS_questionShowAudio);
        document.getElementById("question-text").textContent = questionData.question;
    });

    main.socket.on("_OBS_closeRowQuestion", () => {
        document.getElementById("question-text").textContent = "";
    });

    main.socket.on("_OBS_start15s", () => {
        document.getElementById("answer-input").focus();
        mainObsTime(0);
        countDown(15, 0);
    });

    main.socket.on("_OBS_signal", (signalData) => {
        match.pushAudioAndPlay(audio.OBS_signalAudio.cloneNode());
        const print = document.getElementById("OBS_print-signal");
        print.innerHTML +=
            '<div class="OBS_signal" id="OBS_signal-' + signalData.numberOfSignals + '">' + signalData.numberOfSignals + ". " + main.allPlayerName[signalData.playerNumber - 1] + "</div>";
        document.getElementById("OBS_signal-" + signalData.numberOfSignals).style.left = 25 * (Number(signalData.numberOfSignals) - 1) + "%";
    });

    main.socket.on("_OBS_showRowAnswer", (rowAnswerData) => {
        match.pushAudioAndPlay(audio.OBS_showRowAnswerAudio);
        for (let i = 1; i <= 4; i++) {
            document.getElementById("answer-name-" + i).textContent = rowAnswerData.name[i - 1];
            document.getElementById("answer-text-" + i).textContent = rowAnswerData.answer[i - 1];
        }
    });

    main.socket.on("_OBS_rightRow", (data) => {
        match.pushAudioAndPlay(audio.OBS_rightRowAudio);
        if (data.rowNumber != 5) {
            document.getElementById("OBS_row-" + data.rowNumber).textContent = data.questionData.answer;
            document.getElementById("OBS_row-" + data.rowNumber).style.color = "cyan";
        }
    });

    main.socket.on("_OBS_wrongRow", (wrongPlayers) => {
        for (let i = 0; i < wrongPlayers.length; i++) {
            document.getElementById("answer-" + wrongPlayers[i]).style.opacity = 0.5;
        }
    });

    main.socket.on("_OBS_playWrongRow", (rowNumber) => {
        wrongAudioPlay();
        document.getElementById("OBS_row-" + rowNumber).style.color = "black";
    });

    main.socket.on("_OBS_openCorner", (rowNumber) => {
        match.pushAudioAndPlay(audio.OBS_openCornerAudio);
        document.getElementById("OBS_hider-" + rowNumber).style.visibility = "hidden";
    });

    main.socket.on("_OBS_rightObs", (data) => {
        match.pushAudioAndPlay(audio.OBS_rightObsAudio);
        showObstacle(data.roundData);
        for (let i = 1; i <= 4; i++) {
            if (i != data.rightPlayerSignal && document.getElementById("OBS_signal" + i)) document.getElementById("OBS_signal" + i).style.opacity = 0.5;
        }
    });

    main.socket.on("_OBS_wrongObs", () => {
        wrongAudioPlay();
        document.getElementById("OBS_print-signal").innerHTML = "";
    });

    main.socket.on("_OBS_last15s", () => {
        mainObsTime(1);
        document.getElementById("OBS_ACC_SFI_status").innerHTML = "<i class='fa-solid fa-pencil'></i>&nbsp&nbsp15 giây cuối cùng";
        countDown(15, 1);
    });

    main.socket.on("_OBS_showObs", (roundData) => {
        showObstacle(roundData);
    });
};

const ObstacleUI = () => {
    const parentElement = document.getElementById("obstacle-interface");
    const childElements = parentElement.getElementsByTagName("*");
    for (let i = 0; i < childElements.length; i++) {
        childElements[i].style.visibility = "visible";
    }
};

const mainObsTime = (type) => {
    if (type == 0) {
        match.pushAudioAndPlay(audio.OBS_mainTimeAudio);
    } else {
        match.pushAudioAndPlay(audio.SFI_mainTimeAudio);
    }
};

const sendSignal = () => {
    match.useSignalButton("off");
    match.useAnswerInput("off");
    document.getElementById("answer-input").removeEventListener("keypress", match.sendAnswer);
    main.socket.emit("OBS_signal", main.playerNumber);
};

const sendAnswer = (event) => {
    const playerAnswer = String(document.getElementById("answer-input").value).trim().toUpperCase();
    if (event.key === "Enter" && (match.isAllowBlankAnswer || playerAnswer != "")) {
        main.socket.emit("OBS_sendAnswer", {
            playerNumber: main.playerNumber,
            playerAnswer,
        });
        document.getElementById("answer-input").value = "";
        document.getElementById("save-answer-text").innerHTML = playerAnswer;
    }
};

const wrongAudioPlay = () => {
    audio.OBS_wrongAudio.pause();
    audio.OBS_wrongAudio.currentTime = 0;
    audio.OBS_wrongAudio.play();
    match.pushAudioAndPlay(audio.OBS_wrongAudio);
};

const showObstacle = (roundData) => {
    document.getElementById("signal-button").onclick = "";
    for (let i = 1; i <= 5; i++) {
        document.getElementById("OBS_hider-" + i).style.visibility = "hidden";
    }
    document.getElementById("OBS_keyword").textContent = "CHƯỚNG NGẠI VẬT: " + roundData[5].answer;
    for (let i = 0; i < 4; i++) {
        document.getElementById("OBS_row-" + (i + 1)).textContent = roundData[i].answer;
        document.getElementById("OBS_row-" + (i + 1)).style.color = "cyan";
    }
};

const countDown = (time, offGranted) => {
    document.getElementById("answer-input").focus();
    document.getElementById("answer-input").addEventListener("keypress", sendAnswer);
    document.getElementById("time-left").textContent = time;
    clearInterval(downloadTimer);
    let timeLeft = time - 1;
    downloadTimer = setInterval(() => {
        document.getElementById("time-left").textContent = timeLeft;
        if (timeLeft <= 0) {
            clearInterval(downloadTimer);
            if (offGranted) useSignalButton("off");
            document.getElementById("answer-input").removeEventListener("keypress", sendAnswer);
        }
        timeLeft -= 1;
    }, 1000);
};
