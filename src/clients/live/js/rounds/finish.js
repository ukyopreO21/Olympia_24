import * as audio from "../../../../modules/clients-side/audio.js";
import * as main from "../main.js";

const mainTimeAudio = new Audio();
export var currentPlayer;

export const handle = () => {
    main.socket.on("_FIN_choosePlayer", (playerNumber) => {
        roundInterface("hidden");
        for (let i = 1; i <= 4; i++) {
            document.getElementById("FIN_point-" + i).classList.remove("FIN_different-point");
            document.getElementById("FIN_point-" + i).classList.remove("FIN_granted");
        }
        audio.FIN_startTurnAudio.pause();
        audio.FIN_startTurnAudio.currentTime = 0;
        audio.FIN_startTurnAudio.play();
        currentPlayer = playerNumber;
    });

    main.socket.on("_FIN_showQuestionPack", () => {
        audio.FIN_showQuestionPackAudio.pause();
        audio.FIN_showQuestionPackAudio.currentTime = 0;
        audio.FIN_showQuestionPackAudio.play();

        document.getElementById("FIN_pack-shelf").classList.remove("FIN_hide-shelf");
        for (let i = 2; i <= 3; i++) {
            for (let j = 1; j <= 3; j++) {
                const tempId = "FIN_" + j + "." + 10 * i;
                document.getElementById(tempId).classList.remove("FIN_hide-pick-" + 10 * i + j);
            }
            document.getElementById("FIN_pack-" + 10 * i).classList.remove("FIN_hide-pack-" + 10 * i);
        }

        for (let i = 1; i <= 3; i++) {
            for (let j = 20; j <= 30; j += 10) {
                document.getElementById("FIN_" + i + "." + j).innerHTML = "";
                document.getElementById("FIN_" + i + "." + j).classList.remove("FIN_picked-question");
            }
        }

        document.getElementById("FIN_pack-interface").style.visibility = "visible";
        const dad = document.getElementById("FIN_pack-interface");
        dad.style.visibility = "visible";
        const child = dad.querySelectorAll("*");
        for (let i = 0; i < child.length; i++) {
            child[i].style.visibility = "visible";
        }

        document.getElementById("FIN_pack-shelf").classList.remove("FIN_move-shelf");
        const shelf = document.getElementById("FIN_pack-shelf");
        void shelf.offsetWidth;
        document.getElementById("FIN_pack-shelf").classList.add("FIN_move-shelf");

        for (let i = 2; i <= 3; i++) {
            document.getElementById("FIN_pack-" + 10 * i).classList.remove("FIN_move-pack-" + 10 * i);
            const pack = document.getElementById("FIN_pack-" + 10 * i);
            void pack.offsetWidth;
            document.getElementById("FIN_pack-" + 10 * i).classList.add("FIN_move-pack-" + 10 * i);

            for (let j = 1; j <= 3; j++) {
                const tempId = "FIN_" + j + "." + 10 * i;
                document.getElementById(tempId).classList.remove("FIN_show-pick-" + 10 * i + j);
                const pick = document.getElementById(tempId);
                void pick.offsetWidth;
                document.getElementById(tempId).classList.add("FIN_show-pick-" + 10 * i + j);
            }
        }
    });

    main.socket.on("_FIN_choose", (chooseData) => {
        audio.FIN_pickQuestionAudio.cloneNode().play();
        for (let i = 20; i <= 30; i += 10) {
            document.getElementById("FIN_" + chooseData.questionNumber + "." + i).innerHTML = "";
        }
        const addCheck = document.getElementById("FIN_" + chooseData.questionNumber + "." + chooseData.questionPoint);
        addCheck.innerHTML += '<img src="/src/assets/Others/Check.png" width="100%" height="100%" class="FIN_checked"></img>';
    });

    main.socket.on("_FIN_packChosen", (list) => {
        let countAnimation = 0;
        document.getElementById("FIN_question").textContent = "";
        roundInterface("visible");
        audio.FIN_packChosenAudio.pause();
        audio.FIN_packChosenAudio.currentTime = 0;
        audio.FIN_packChosenAudio.play();

        document.getElementById("FIN_pack-shelf").classList.remove("FIN_hide-shelf");
        const packShelf = document.getElementById("FIN_pack-shelf");
        void packShelf.offsetWidth;
        document.getElementById("FIN_pack-shelf").classList.add("FIN_hide-shelf");
        for (let i = 1; i <= 3; i++) {
            const tempId = "FIN_" + i + "." + list[i - 1];
            document.getElementById(tempId).classList.add("FIN_picked-question");
            for (let j = 1; j <= 3; j++) {
                const tempId = "FIN_" + j + "." + 10 * i;
                if (i != 1) {
                    document.getElementById(tempId).classList.remove("FIN_hide-pick-" + 10 * i + j);
                    const pick = document.getElementById(tempId);
                    void pick.offsetWidth;
                    document.getElementById(tempId).classList.add("FIN_hide-pick-" + 10 * i + j);
                    document.getElementById("FIN_pack-" + 10 * i).classList.remove("FIN_hide-pack-" + 10 * i);
                    const pack = document.getElementById("FIN_pack-" + 10 * i);
                    void pack.offsetWidth;
                    document.getElementById("FIN_pack-" + 10 * i).classList.add("FIN_hide-pack-" + 10 * i);
                }
            }
        }
        for (let i = 1; i <= 3; i++) {
            document.getElementById("FIN_" + i).innerHTML = list[i - 1];
            document.getElementById("FIN_" + i).classList.remove("FIN_chosen-question");
        }

        document.getElementById("FIN_shelf").classList.remove("FIN_move-question-shelf");
        const shelf = document.getElementById("FIN_shelf");
        void shelf.offsetWidth;
        document.getElementById("FIN_shelf").classList.add("FIN_move-question-shelf");

        document.getElementById("FIN_point-" + currentPlayer).classList.remove("FIN_different-point");
        document.getElementById("FIN_question-zone").classList.remove("FIN_question-zone-move");
        document.getElementById("FIN_question-status").classList.remove("FIN_move-point-and-status");
        document.getElementById("FIN_current-point").classList.remove("FIN_move-point-and-status");
        for (let i = 1; i <= 4; i++) {
            const temp = document.getElementById("FIN_point-" + i);
            const text = document.getElementById("FIN_data-" + i);
            temp.classList.remove("FIN_show-point-bar-" + i);
            void temp.offsetWidth;
            void text.offsetWidth;
            document.getElementById("FIN_data-" + i).textContent = "";
        }
        const box = document.getElementById("FIN_question-zone");
        void box.offsetWidth;
        const status = document.getElementById("FIN_question-status");
        void status.offsetWidth;
        const cPoint = document.getElementById("FIN_current-point");
        void cPoint.offsetWidth;
        document.getElementById("FIN_question-zone").classList.add("FIN_question-zone-move");
        document.getElementById("FIN_question-status").classList.add("FIN_move-point-and-status");
        document.getElementById("FIN_current-point").classList.add("FIN_move-point-and-status");
        for (let i = 1; i <= 4; i++) {
            document.getElementById("FIN_point-" + i).addEventListener("animationend", (event) => {
                if (event.animationName === "FIN_show-point-bar") {
                    countAnimation++;
                    if (countAnimation == 4) {
                        const diff = document.getElementById("FIN_point-" + currentPlayer);
                        void diff.offsetWidth;
                        document.getElementById("FIN_point-" + currentPlayer).classList.add("FIN_different-point");
                    }
                }
            });
            document.getElementById("FIN_point-" + i).classList.add("FIN_show-point-bar-" + i);
        }
        printPlayerData();
    });

    main.socket.on("_FIN_chooseQuestion", (data) => {
        for (let i = 1; i <= 3; i++) {
            if (i == Number(data.questionNumber)) document.getElementById("FIN_" + i).classList.add("FIN_chosen-question");
            else document.getElementById("FIN_" + i).classList.remove("FIN_chosen-question");
        }
        document.getElementById("FIN_question").textContent = data.questionData.question;
        main.autoScaleFontSize(document.getElementById("FIN_question"));
        for (let i = 1; i <= 4; i++) {
            document.getElementById("FIN_point-" + i).classList.remove("FIN_granted");
        }
    });

    main.socket.on("_FIN_startTiming", (questionTime) => {
        for (let i = 10; i <= 20; i += 5) {
            document.getElementById("FIN_circle").classList.remove("move-circle-" + i);
            document.getElementById("FIN_line").classList.remove("move-line-" + i);
        }

        mainTimeAudio.pause();
        if (questionTime == 15) mainTimeAudio.src = audio.FIN_15secondsAudio.src;
        else mainTimeAudio.src = audio.FIN_20secondsAudio.src;
        mainTimeAudio.currentTime = 0;
        mainTimeAudio.play();

        const circle = document.getElementById("FIN_circle");
        void circle.offsetWidth;
        const line = document.getElementById("FIN_line");
        void line.offsetWidth;
        document.getElementById("FIN_circle").classList.add("move-circle-" + questionTime);
        document.getElementById("FIN_line").classList.add("move-line-" + questionTime);
    });

    main.socket.on("_FIN_star", (isStarOn) => {
        if (isStarOn) {
            audio.FIN_starAudio.pause();
            audio.FIN_starAudio.currentTime = 0;
            audio.FIN_starAudio.play();
            document.getElementById("FIN_star").src = "/src/assets/Finish/Star.gif";
        } else document.getElementById("FIN_star").src = "";
    });

    main.socket.on("_FIN_blockSignal", (playerNumber) => {
        audio.FIN_signalAudio.pause();
        audio.FIN_signalAudio.currentTime = 0;
        audio.FIN_signalAudio.play();
        document.getElementById("FIN_point-" + playerNumber).classList.add("FIN_granted");
    });

    main.socket.on("_FIN_right", () => {
        audio.FIN_rightAudio.pause();
        audio.FIN_rightAudio.currentTime = 0;
        audio.FIN_rightAudio.play();
    });

    main.socket.on("_FIN_wrong", () => {
        audio.FIN_wrongAudio.pause();
        audio.FIN_wrongAudio.currentTime = 0;
        audio.FIN_wrongAudio.play();
    });

    main.socket.on("_FIN_5s", () => {
        for (let i = 1; i <= 4; i++) {
            document.getElementById("FIN_point-" + i).classList.remove("FIN_granted");
        }
        audio.FIN_5secondsAudio.pause();
        audio.FIN_5secondsAudio.currentTime = 0;
        audio.FIN_5secondsAudio.play();
    });

    main.socket.on("_FIN_finishTurn", () => {
        audio.FIN_finishTurnAudio.pause();
        audio.FIN_finishTurnAudio.currentTime = 0;
        audio.FIN_finishTurnAudio.play();
        roundInterface("hidden");
        document.getElementById("FIN_question").textContent = "";
        document.getElementById("FIN_current-point").textContent = "";
        for (let i = 1; i <= 4; i++) {
            document.getElementById("FIN_point-" + i).classList.remove("FIN_different-point");
            document.getElementById("FIN_point-" + i).classList.remove("FIN_granted");
        }
    });
};

const roundInterface = (visibility) => {
    //tắt giao diện chọn gói
    if (visibility == "hidden") {
        const dad1 = document.getElementById("FIN_pack-interface");
        dad1.style.visibility = visibility;
        const child1 = dad1.querySelectorAll("*");
        for (let i = 0; i < child1.length; i++) {
            child1[i].style.visibility = visibility;
        }
    }

    //tắt khu câu hỏi
    document.getElementById("FIN_shelf").style.visibility = visibility;
    const dad2 = document.getElementById("FIN_main-interface");
    dad2.style.visibility = visibility;
    const child2 = dad2.querySelectorAll("*");
    for (let i = 0; i < child2.length; i++) {
        child2[i].style.visibility = visibility;
    }

    document.getElementById("FIN_video").style.visibility = visibility;
};

export const printPlayerData = () => {
    for (let i = 0; i < 4; i++) {
        const playerName = main.allPlayerName[i];
        const playerPoint = main.allPlayerPoint[i];
        if (i + 1 != Number(currentPlayer)) document.getElementById("FIN_data-" + (i + 1)).textContent = playerName + " (" + playerPoint + ")";
        else document.getElementById("FIN_data-" + (i + 1)).textContent = playerName;
    }
    if (currentPlayer) document.getElementById("FIN_current-point").innerHTML = main.allPlayerPoint[Number(currentPlayer) - 1];
};
