import * as audio from "../../../../modules/clients-side/audio.js";
import * as main from "../main.js";

var isOpeningQuestionZone = false;
var isRowsInterfaceCurrent = false;

export const handle = () => {
    main.socket.on("_OBS_showNumberOfCharacter", () => {
        audio.OBS_numberOfCharacterAudio.pause();
        audio.OBS_numberOfCharacterAudio.currentTime = 0;
        audio.OBS_numberOfCharacterAudio.play();
    });

    main.socket.on("_OBS_showRows", (roundData) => {
        audio.OBS_showRowsAudio.pause();
        audio.OBS_showRowsAudio.currentTime = 0;
        audio.OBS_showRowsAudio.play();
        document.getElementById("OBS_image").src = roundData[5].mediaUrl;
        document.getElementById("OBS_print-signal").style.visibility = "visible";
        main.socket.emit("OBS_getRowsLength");
        for (let i = 1; i <= 5; i++) document.getElementById("OBS_hider-" + i).style.opacity = 1;
    });

    main.socket.on("_OBS_getRowsLength", (data) => {
        for (let i = 0; i < 4; i++) {
            for (let j = data[i].startPos; j < data[i].startPos + data[i].rowLength; j++) {
                document.getElementById("OBS_char-" + (i + 1) + "." + j).style.opacity = 1;
            }
        }
        rowsInterface("visible");
    });

    main.socket.on("_OBS_chooseRow", (data) => {
        audio.OBS_chosenRowAudio.pause();
        audio.OBS_chosenRowAudio.currentTime = 0;
        audio.OBS_chosenRowAudio.play();

        const elements = document.getElementsByClassName("OBS_char");
        for (let i = 0; i < elements.length; i++) {
            elements[i].classList.remove("OBS_chosen");
        }

        if (data.rowNumber != 5) {
            for (let j = data.OBS[Number(data.rowNumber - 1)].startPos; j < data.OBS[Number(data.rowNumber - 1)].startPos + data.OBS[Number(data.rowNumber - 1)].rowLength; j++) {
                setTimeout(() => {
                    const ele = document.getElementById("OBS_char-" + data.rowNumber + "." + j);
                    ele.classList.remove("OBS_chosen");
                    void ele.offsetWidth;
                    ele.classList.add("OBS_chosen");
                }, (j - data.OBS[Number(data.rowNumber - 1)].startPos) * 50);
            }
        }
    });

    main.socket.on("_OBS_showRowQuestion", (questionData) => {
        isOpeningQuestionZone = true;
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
        isOpeningQuestionZone = false;
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
        addSignal(signalData);
    });

    main.socket.on("_OBS_answerUI", () => {
        rowsInterface("hidden");
        imageInterface("hidden");
        answerInterface("visible");
    });

    main.socket.on("_OBS_showRowAnswer", (rowAnswerData) => {
        rowsInterface("hidden");
        imageInterface("hidden");
        answerInterface("visible");
        document.querySelectorAll(".OBS_player").forEach((element) => {
            element.style.opacity = "1";
        });
        audio.OBS_showRowAnswerAudio.pause();
        audio.OBS_showRowAnswerAudio.currentTime = 0;
        audio.OBS_showRowAnswerAudio.play();
        document.getElementById("OBS_outer-line").classList.remove("OBS_extend-outer");
        void document.getElementById("OBS_outer-line").offsetWidth;
        document.getElementById("OBS_outer-line").classList.add("OBS_extend-outer");
        for (let i = 0; i < 4; i++) {
            document.getElementById("OBS_pinner-" + (i + 1)).classList.remove("OBS_move-pinner-" + (i + 1));
            void document.getElementById("OBS_pinner-" + (i + 1)).offsetWidth;
            document.getElementById("OBS_pinner-" + (i + 1)).classList.add("OBS_move-pinner-" + (i + 1));
            document.getElementById("OBS_player-" + (i + 1)).classList.remove("OBS_show-answer-" + (i + 1));
            void document.getElementById("OBS_player-" + (i + 1)).offsetWidth;
            document.getElementById("OBS_player-" + (i + 1)).classList.add("OBS_show-answer-" + (i + 1));
            document.querySelector("#OBS_player-" + (i + 1) + " .OBS_name-text").textContent = rowAnswerData.name[i];
            document.querySelector("#OBS_player-" + (i + 1) + " .OBS_answer-text").textContent = rowAnswerData.answer[i];
        }
    });

    main.socket.on("_OBS_rowsUI", () => {
        answerInterface("hidden");
        imageInterface("hidden");
        rowsInterface("visible");
    });

    main.socket.on("_OBS_wrongRow", (wrongPlayers) => {
        for (let i = 0; i < wrongPlayers.length; i++) {
            document.getElementById("OBS_player-" + wrongPlayers[i]).style.opacity = 0.3;
        }
    });

    main.socket.on("_OBS_rightRow", (rowData) => {
        isOpeningQuestionZone = false;
        audio.OBS_rightRowAudio.pause();
        audio.OBS_rightRowAudio.currentTime = 0;
        audio.OBS_rightRowAudio.play();
        const currentRowAnswer = String(rowData.questionData.answer).replace(/\s+/g, "");
        for (let j = rowData.questionData.startPos; j < rowData.questionData.startPos + rowData.questionData.rowLength; j++) {
            document.getElementById("OBS_char-" + rowData.rowNumber + "." + j).textContent = currentRowAnswer[j - rowData.questionData.startPos];
            document.getElementById("OBS_char-" + rowData.rowNumber + "." + j).classList.add("OBS_right-row");
        }
    });

    main.socket.on("_OBS_playWrongRow", (rowNumber) => {
        isOpeningQuestionZone = false;
        wrongAudioPlay();
        for (let i = 1; i <= 18; i++) {
            document.getElementById("OBS_char-" + rowNumber + "." + i).classList.add("OBS_wrong-row");
        }
    });

    main.socket.on("_OBS_imageUI", () => {
        rowsInterface("hidden");
        answerInterface("hidden");
        imageInterface("visible");
    });

    main.socket.on("_OBS_openCorner", (rowNumber) => {
        rowsInterface("hidden");
        answerInterface("hidden");
        imageInterface("visible");
        audio.OBS_openCornerAudio.pause();
        audio.OBS_openCornerAudio.currentTime = 0;
        audio.OBS_openCornerAudio.play();
        document.getElementById("OBS_hider-" + rowNumber).style.opacity = 0;
    });

    main.socket.on("_OBS_rightObs", (data) => {
        audio.OBS_rightObsAudio.pause();
        audio.OBS_rightObsAudio.currentTime = 0;
        audio.OBS_rightObsAudio.play();
        document.getElementById("out-sources-media").pause();
        showObstacle(data.roundData);
        for (let i = 1; i <= 4; i++) {
            if (i != data.rightPlayerSignal && document.getElementById("OBS_signal-" + i)) document.getElementById("OBS_signal-" + i).style.opacity = "0.5";
        }
    });

    main.socket.on("_OBS_wrongObs", () => {
        wrongAudioPlay();
        document.getElementById("OBS_print-signal").innerHTML = "";
    });

    main.socket.on("_OBS_last15s", () => {
        mainObsTime(1);
    });

    main.socket.on("_OBS_showObs", (roundData) => {
        showObstacle(roundData);
        document.getElementById("OBS_print-signal").innerHTML = "";
    });
};

const addSignal = (signalData) => {
    const dad = document.getElementById("OBS_print-signal");
    if (dad.classList.contains("OBS_landscape-signals")) {
        dad.innerHTML += '<div class="OBS_signal OBS_landscape-signal OBS-landscape-' + signalData.numberOfSignals + '" id="OBS_signal-' + signalData.numberOfSignals + '"></div>';
    } else {
        dad.innerHTML += '<div class="OBS_signal OBS_portrait-signal OBS-portrait-' + signalData.numberOfSignals + '" id="OBS_signal-' + signalData.numberOfSignals + '"></div>';
    }
    document.getElementById("OBS_signal-" + signalData.numberOfSignals).textContent = signalData.numberOfSignals + ". " + main.allPlayerName[signalData.playerNumber - 1];
};

const landscapeSignals = () => {
    document.getElementById("OBS_print-signal").classList.remove("OBS_portrait-signals");
    document.getElementById("OBS_print-signal").classList.add("OBS_landscape-signals");
    const signals = document.querySelectorAll(".OBS_signal");
    for (let i = 0; i < signals.length; i++) {
        signals[i].classList.remove("OBS_portrait-signal");
        signals[i].classList.remove("OBS_portrait-" + (i + 1));
        signals[i].classList.add("OBS_landscape-signal");
        signals[i].classList.add("OBS_landscape-" + (i + 1));
    }
};

const portraitSignals = () => {
    document.getElementById("OBS_print-signal").classList.remove("OBS_landscape-signals");
    document.getElementById("OBS_print-signal").classList.add("OBS_portrait-signals");
    const signals = document.querySelectorAll(".OBS_signal");
    for (let i = 0; i < signals.length; i++) {
        signals[i].classList.remove("OBS_landscape-signal");
        signals[i].classList.remove("OBS_landscape-" + (i + 1));
        signals[i].classList.add("OBS_portrait-signal");
        signals[i].classList.add("OBS_portrait-" + (i + 1));
    }
};

const questionInterface = (visibility) => {
    if ((isRowsInterfaceCurrent && isOpeningQuestionZone) || visibility == "hidden") {
        const dad = document.getElementById("OBS_question-zone");
        dad.style.visibility = visibility;
        const child = dad.querySelectorAll("*");
        for (let i = 0; i < child.length; i++) {
            child[i].style.visibility = visibility;
        }
        document.getElementById("OBS_shelf").style.visibility = visibility;
    }
};

const rowsInterface = (visibility) => {
    const dad = document.getElementById("OBS_main-interface");
    const child = dad.querySelectorAll("*");
    for (let i = 0; i < child.length; i++) {
        child[i].style.visibility = visibility;
    }
    if (visibility == "visible") {
        isRowsInterfaceCurrent = true;
        questionInterface("visible");
        landscapeSignals();
    } else {
        isRowsInterfaceCurrent = false;
        questionInterface("hidden");
    }
};

const answerInterface = (visibility) => {
    const dad = document.getElementById("OBS_answers");
    const child = dad.querySelectorAll("*");
    for (let i = 0; i < child.length; i++) {
        child[i].style.visibility = visibility;
    }
    if (visibility == "visible") portraitSignals();
};

const imageInterface = (visibility) => {
    const dad = document.getElementById("OBS_image-interface");
    const child = dad.querySelectorAll("*");
    for (let i = 0; i < child.length; i++) {
        child[i].style.visibility = visibility;
    }
    if (visibility == "visible") portraitSignals();
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

const showObstacle = (roundData) => {
    document.getElementById("OBS_hider-5").style.opacity = 0;
    for (let i = 1; i <= 4; i++) {
        document.getElementById("OBS_hider-" + i).style.opacity = 0;
        for (let j = roundData[i - 1].startPos; j < roundData[i - 1].startPos + roundData[i - 1].rowLength; j++) {
            const currentRowAnswer = roundData[i - 1].answer.replace(/\s+/g, "");
            document.getElementById("OBS_char-" + i + "." + j).textContent = currentRowAnswer[j - roundData[i - 1].startPos];
            document.getElementById("OBS_char-" + i + "." + j).classList.add("OBS_right-row");
        }
    }
};
