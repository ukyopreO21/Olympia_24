import * as audio from "../../../../modules/clients-side/audio.js";
import * as main from "../main.js";

export const handle = () => {
    main.socket.on("_OBS_showNumberOfCharacter", () => {
        audio.OBS_numberOfCharacterAudio.pause();
        audio.OBS_numberOfCharacterAudio.currentTime = 0;
        audio.OBS_numberOfCharacterAudio.play();
    });

    main.socket.on("_OBS_showRows", () => {
        document.getElementById("OBS_print-signal").style.visibility = "visible";
        audio.OBS_showRowsAudio.pause();
        audio.OBS_showRowsAudio.currentTime = 0;
        audio.OBS_showRowsAudio.play();
    });

    main.socket.on("_OBS_chooseRow", () => {
        audio.OBS_chosenRowAudio.pause();
        audio.OBS_chosenRowAudio.currentTime = 0;
        audio.OBS_chosenRowAudio.play();
    });

    main.socket.on("_OBS_showRowQuestion", (questionData) => {
        audio.OBS_questionShowAudio.pause();
        audio.OBS_questionShowAudio.currentTime = 0;
        audio.OBS_questionShowAudio.play();
        questionInterface("visible");
        document.getElementById("OBS_shelf").classList.remove("OBS_move-shelf");
        document.getElementById("OBS_question-zone").classList.remove("OBS_move-question-zone");
        const shelf = document.getElementById("OBS_shelf");
        const ques = document.getElementById("OBS_question-zone");
        void shelf.offsetWidth;
        void ques.offsetWidth;
        document.getElementById("OBS_shelf").classList.add("OBS_move-shelf");
        document.getElementById("OBS_question-zone").classList.add("OBS_move-question-zone");

        document.getElementById("OBS_question").innerHTML = questionData.question;
        main.autoScaleFontSize(document.getElementById("OBS_question"));
    });

    main.socket.on("_OBS_closeRowQuestion", () => {
        questionInterface("hidden");
    });

    main.socket.on("_OBS_start15s", () => {
        //audio
        mainObsTime(0);

        //animation
        document.getElementById("OBS_circle").classList.remove("move-circle-15");
        document.getElementById("OBS_line").classList.remove("move-line-15");
        const circle = document.getElementById("OBS_circle");
        void circle.offsetWidth;
        const line = document.getElementById("OBS_line");
        void line.offsetWidth;
        document.getElementById("OBS_circle").classList.add("move-circle-15");
        document.getElementById("OBS_line").classList.add("move-line-15");
    });

    main.socket.on("_OBS_signal", (signalData) => {
        audio.OBS_signalAudio.pause();
        audio.OBS_signalAudio.currentTime = 0;
        audio.OBS_signalAudio.play();

        const dad = document.getElementById("OBS_print-signal");
        dad.innerHTML += '<div class="OBS_signal" id="OBS_signal-' + signalData.numberOfSignals + '"></div>';
        document.getElementById("OBS_signal-" + signalData.numberOfSignals).style.left = "calc(" + (Number(signalData.numberOfSignals) - 1) * 25.25 + "%)";
        document.getElementById("OBS_signal-" + signalData.numberOfSignals).textContent = signalData.numberOfSignals + ". " + main.allPlayerName[signalData.playerNumber - 1];
    });

    main.socket.on("_OBS_showRowAnswer", () => {
        questionInterface("hidden");
        audio.OBS_showRowAnswerAudio.pause();
        audio.OBS_showRowAnswerAudio.currentTime = 0;
        audio.OBS_showRowAnswerAudio.play();
    });

    main.socket.on("_OBS_rightRow", () => {
        audio.OBS_rightRowAudio.pause();
        audio.OBS_rightRowAudio.currentTime = 0;
        audio.OBS_rightRowAudio.play();
    });

    main.socket.on("_OBS_playWrongRow", () => {
        wrongAudioPlay();
    });

    main.socket.on("_OBS_openCorner", () => {
        audio.OBS_openCornerAudio.pause();
        audio.OBS_openCornerAudio.currentTime = 0;
        audio.OBS_openCornerAudio.play();
    });

    main.socket.on("_OBS_rightObs", () => {
        audio.OBS_rightObsAudio.pause();
        audio.OBS_rightObsAudio.currentTime = 0;
        audio.OBS_rightObsAudio.play();
    });

    main.socket.on("_OBS_wrongObs", () => {
        wrongAudioPlay();
        document.getElementById("OBS_print-signal").innerHTML = "";
    });

    main.socket.on("_OBS_last15s", () => {
        mainObsTime(1);
    });

    main.socket.on("_OBS_showObs", () => {
        document.getElementById("OBS_print-signal").innerHTML = "";
    });
};

const questionInterface = (visibility) => {
    const dad = document.getElementById("OBS_question-zone");
    dad.style.visibility = visibility;
    const child = dad.querySelectorAll("*");
    for (let i = 0; i < child.length; i++) {
        child[i].style.visibility = visibility;
    }
    document.getElementById("OBS_shelf").style.visibility = visibility;
};

const mainObsTime = (type) => {
    if (type == 0) {
        audio.OBS_mainTimeAudio.pause();
        audio.OBS_mainTimeAudio.currentTime = 0;
        audio.OBS_mainTimeAudio.play();
    } else {
        audio.SFI_mainTimeAudio.pause();
        audio.SFI_mainTimeAudio.currentTime = 0;
        audio.SFI_mainTimeAudio.play();
    }
};

const wrongAudioPlay = () => {
    audio.OBS_wrongAudio.pause();
    audio.OBS_wrongAudio.currentTime = 0;
    audio.OBS_wrongAudio.play();
};
