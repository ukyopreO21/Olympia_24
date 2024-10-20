import * as main from "../main.js";

export const handle = () => {
    main.socket.on("_FIN_choosePlayer", (playerNumber) => {
        for (let i = 1; i <= 4; i++) document.getElementById("current-point-" + i).classList.remove("granted");
        document.getElementById("FIN_turn").innerHTML = main.templateLabel("Lượt:") + "&nbsp;" + main.allPlayerName[playerNumber - 1];
    });

    main.socket.on("_FIN_choose", (chooseData) => {
        document.getElementById("FIN_question-" + chooseData.questionNumber).textContent = chooseData.questionPoint;
    });

    main.socket.on("_FIN_chooseQuestion", (data) => {
        for (let i = 1; i <= 4; i++) document.getElementById("current-point-" + i).classList.remove("granted");
        for (let i = 1; i <= 3; i++) document.getElementById("FIN_question-" + i).classList.remove("granted");
        document.getElementById("FIN_question-" + data.questionNumber).classList.add("granted");
        document.querySelector("#FIN_question .question-content label").textContent = data.questionData.question;
        document.querySelector("#FIN_answer .answer-content label").textContent = data.questionData.answer;
        document.querySelector("#FIN_note .note-content label").textContent = data.questionData.note;
    });

    main.socket.on("_FIN_startTiming", (questionTime) => {
        main.countDown(questionTime);
    });

    main.socket.on("_FIN_star", (isStarOn) => {
        if (isStarOn) {
            document.getElementById("FIN_star").style.visibility = "visible";
        } else document.getElementById("FIN_star").style.visibility = "hidden";
    });

    main.socket.on("_FIN_blockSignal", (playerNumber) => {
        document.getElementById("current-point-" + playerNumber).classList.add("granted");
    });

    main.socket.on("_FIN_5s", () => {
        for (let i = 1; i <= 4; i++) document.getElementById("current-point-" + i).classList.remove("granted");
        main.countDown(5);
    });

    main.socket.on("_FIN_finishTurn", () => {
        for (let i = 1; i <= 4; i++) document.getElementById("current-point-" + i).classList.remove("granted");
        for (let i = 1; i <= 3; i++) {
            document.getElementById("FIN_question-" + i).classList.remove("granted");
            document.getElementById("FIN_question-" + i).textContent = "";
        }
        document.querySelector("#FIN_question .question-content label").textContent = "";
        document.querySelector("#FIN_answer .answer-content label").textContent = "";
        document.querySelector("#FIN_note .note-content label").textContent = "";
        document.getElementById("FIN_star").style.visibility = "hidden";
    });
};
