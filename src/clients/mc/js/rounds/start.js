import * as main from "../main.js";

var currentPlayer;
var questionNumber;
var signalPlayer;

export const handle = () => {
    main.socket.on("_STR_choosePlayer", (turnNumber) => {
        currentPlayer = Number(turnNumber);
        if (currentPlayer != 5) document.getElementById("STR_turn").innerHTML = main.templateLabel("Lượt:") + "&nbsp;" + main.allPlayerName[currentPlayer - 1];
        else document.getElementById("STR_turn").innerHTML = main.templateLabel("Lượt:") + "&nbsp;" + "Chung";
    });

    main.socket.on("_STR_startPlayerTurn", () => {
        questionNumber = 0;
        if (currentPlayer != 5) document.getElementById("STR_question-number").innerHTML = main.templateLabel("Câu hỏi số:") + "&nbsp;" + "0/6";
        else document.getElementById("STR_question-number").innerHTML = main.templateLabel("Câu hỏi số:") + "&nbsp;" + "0/12";
    });

    main.socket.on("_STR_openQuestionBoard", () => {
        document.getElementById("time-left").textContent = "0";
    });

    main.socket.on("_STR_startTurn", (settings) => {
        questionNumber++;
        printNextQuestion(settings.questionData);
        printPassStatus();
    });

    main.socket.on("_STR_timing", (time) => {
        main.countDown(time);
    });

    main.socket.on("_STR_blockSignal", (playerNumber) => {
        signalPlayer = playerNumber;
        document.getElementById("current-point-" + playerNumber).classList.add("granted");
    });

    main.socket.on("_STR_getNextQuestion", (settings) => {
        if (signalPlayer) document.getElementById("current-point-" + signalPlayer).classList.remove("granted");
        signalPlayer = 0;
        questionNumber++;
        printNextQuestion(settings.questionData);
        printPassStatus();
        clearInterval(main.downloadTimer);
        document.getElementById("time-left").textContent = 0;
    });

    main.socket.on("_STR_finishTurn", () => {
        for (let i = 1; i <= 4; i++) document.getElementById("current-point-" + i).classList.remove("granted");
        document.getElementById("STR_turn").innerHTML = main.templateLabel("Lượt:");
        document.getElementById("STR_question-number").innerHTML = main.templateLabel("Câu hỏi số:");
        document.querySelector("#STR_question label").textContent = "";
        document.querySelector("#STR_answer label").textContent = "";
        document.querySelector("#STR_note label").textContent = "";
    });
};

const printNextQuestion = (questionData) => {
    document.querySelector("#STR_question label").textContent = questionData.question;
    document.querySelector("#STR_answer label").textContent = questionData.answer;
    document.querySelector("#STR_note label").textContent = questionData.note;
};

const printPassStatus = () => {
    if (currentPlayer != 5) document.getElementById("STR_question-number").innerHTML = main.templateLabel("Câu hỏi số:") + "&nbsp;" + questionNumber + "/6";
    else document.getElementById("STR_question-number").innerHTML = main.templateLabel("Câu hỏi số:") + "&nbsp;" + questionNumber + "/12";
};
