import * as audio from "../../../../modules/clients-side/audio.js";
import * as main from "../main.js";

export const handle = () => {
    main.socket.on("_SFI_startRound", (playerList) => {
        document.getElementById("SFI_question").textContent = "";
        document.getElementById("SFI_round-name").textContent = "CÂU HỎI PHỤ";
        roundInterface();
        const dadEle = document.getElementById("SFI_players-tab");
        dadEle.innerHTML = "";
        for (let i = 0; i < playerList.length; i++) {
            dadEle.innerHTML += '<span class="SFI_player" id=' + "SFI_" + playerList[i] + "><label id=" + "SFI_name-" + playerList[i] + "></label></span>";
            document.getElementById("SFI_" + playerList[i]).style.visibility = "visible";
        }
        printPlayerData();
    });

    main.socket.on("_SFI_openQuestion", (serverData) => {
        for (let i = 1; i <= 4; i++) {
            const ele = document.getElementById("SFI_" + i);
            if (ele) ele.style.backgroundColor = "#313131";
        }
        document.getElementById("SFI_question").textContent = serverData.questionData.question;
        main.autoScaleFontSize(document.getElementById("SFI_question"));
        document.getElementById("SFI_round-name").textContent = "CÂU HỎI PHỤ " + serverData.openedCount + "/3";
        resetStatus();
    });

    main.socket.on("_SFI_closeQuestion", () => {
        document.getElementById("SFI_question").textContent = "";
        document.getElementById("SFI_round-name").textContent = "CÂU HỎI PHỤ";
    });

    main.socket.on("_SFI_timing", (isReset) => {
        for (let i = 1; i <= 4; i++) {
            const ele = document.getElementById("SFI_" + i);
            if (ele) ele.style.backgroundColor = "#313131";
        }
        if (isReset) {
            resetStatus();
            audio.SFI_mainTimeAudio.pause();
            audio.SFI_mainTimeAudio.currentTime = 0;
            audio.SFI_mainTimeAudio.play();
            document.getElementById("SFI_circle").classList.add("move-circle-15");
            document.getElementById("SFI_line").classList.add("move-line-15");
            document.getElementById("SFI_circle").style.animationPlayState = "running";
            document.getElementById("SFI_line").style.animationPlayState = "running";
        } else {
            audio.SFI_mainTimeAudio.play();
            document.getElementById("SFI_circle").style.animationPlayState = "running";
            document.getElementById("SFI_line").style.animationPlayState = "running";
        }
    });

    main.socket.on("_SFI_right", () => {
        audio.FIN_rightAudio.pause();
        audio.FIN_rightAudio.currentTime = 0;
        audio.FIN_rightAudio.play();
    });

    main.socket.on("_SFI_blockSignal", (playerNumber) => {
        audio.SFI_mainTimeAudio.pause();
        audio.FIN_signalAudio.pause();
        audio.FIN_signalAudio.currentTime = 0;
        audio.FIN_signalAudio.play();
        document.getElementById("SFI_" + playerNumber).style.backgroundColor = "#e66f1e";
        document.getElementById("SFI_circle").style.animationPlayState = "paused";
        document.getElementById("SFI_line").style.animationPlayState = "paused";
    });
};

const roundInterface = () => {
    document.getElementById("round-name").style.visibility = "hidden";
    document.getElementById("sub-finish-interface").style.visibility = "visible";
    document.getElementById("SFI_shelf").style.visibility = "visible";
    document.getElementById("SFI_round-name").style.visibility = "visible";
    document.getElementById("SFI_question-zone").style.visibility = "visible";
    document.getElementById("SFI_question").style.visibility = "visible";
    document.getElementById("SFI_circle").style.visibility = "visible";
    document.getElementById("SFI_line").style.visibility = "visible";
};

export const printPlayerData = () => {
    for (let i = 1; i <= 4; i++) {
        const ele = document.getElementById("SFI_name-" + i);
        if (ele) ele.textContent = main.allPlayerName[i - 1];
    }
};

const resetStatus = () => {
    document.getElementById("SFI_circle").classList.remove("move-circle-15");
    document.getElementById("SFI_line").classList.remove("move-line-15");
    const circle = document.getElementById("SFI_circle");
    const line = document.getElementById("SFI_line");
    void circle.offsetWidth;
    void line.offsetWidth;
};
