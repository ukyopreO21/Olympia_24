import * as main from "../main.js";
import * as funcs from "../funcs.js";

var currentQuestionPoint;
var isStarOn = false;
var currentPlayer;
var signalPlayer = 0;
var downloadTimer;

export const handle = () => {
    main.socket.on("_FIN_chooseQuestion", (question) => {
        funcs.setQuestionData(question.questionData);
        document.getElementById("FIN_media").innerHTML = "";
        funcs.updateMediaButton("none");
        const mediaType = funcs.getMediaType(question.questionData.mediaUrl);
        if (mediaType == "audio" || mediaType == "video") funcs.updateMediaButton("auto");
        else if (mediaType == "image") document.getElementById("FIN_media").innerHTML += "<img src='" + question.questionData.mediaUrl + "'>";
        currentQuestionPoint = Number(question.questionData.point);
        if (currentQuestionPoint == 10) document.getElementById("FIN_time").textContent = 10;
        else if (currentQuestionPoint == 20) document.getElementById("FIN_time").textContent = 15;
        else document.getElementById("FIN_time").textContent = 20;
    });

    main.socket.on("_FIN_blockSignal", (playerNumber) => {
        signalPlayer = playerNumber;
        document.getElementById("player-" + playerNumber).style.border = "calc(5vw/48) solid #73f7ff";
    });
};

export const assignButton = () => {
    window.choosePlayer = choosePlayer;
    window.showQuestionPack = showQuestionPack;
    window.choose = choose;
    window.packChosen = packChosen;
    window.chooseQuestion = chooseQuestion;
    window.startTiming = startTiming;
    window.star = star;
    window.right = right;
    window.count5s = count5s;
    window.deleteSignal = deleteSignal;
    window.wrong = wrong;
    window.finishTurn = finishTurn;
};

const choosePlayer = () => {
    currentPlayer = Number(document.getElementById("FIN_player-number").value);
    main.socket.emit("FIN_choosePlayer", currentPlayer);
    document.getElementById("FIN_choose-question-board").innerHTML = "";
};

const showQuestionPack = () => {
    document.getElementById("FIN_choose-question-board").innerHTML = "";
    let temp = '<table id="FIN_board">';
    temp += "<tr>";
    temp += '<th id="blank"><button id="FIN_pack-chosen" onclick="packChosen()">CHỐT GÓI</button></th>';
    temp += "<th>Câu 1</th>";
    temp += "<th>Câu 2</th>";
    temp += "<th>Câu 3</th>";
    temp += "</tr>";
    temp += "<tr>";
    temp += '<td style="color: orange">20 điểm</td>';
    temp += '<td><input type="radio" name="1" value="20" onclick="choose(this)"></td>';
    temp += '<td><input type="radio" name="2" value="20" onclick="choose(this)"></td>';
    temp += '<td><input type="radio" name="3" value="20" onclick="choose(this)"></td>';
    temp += "</tr>";
    temp += "<tr>";
    temp += '<td style="color: orange">30 điểm</td>';
    temp += '<td><input type="radio" name="1" value="30" onclick="choose(this)"></td>';
    temp += '<td><input type="radio" name="2" value="30" onclick="choose(this)"></td>';
    temp += '<td><input type="radio" name="3" value="30" onclick="choose(this)"></td>';
    temp += "</tr>";
    temp += "</table>";
    document.getElementById("FIN_choose-question-board").innerHTML += temp;
    document.getElementById("FIN_choose-question-board").style.visibility = "visible";
    main.socket.emit("FIN_showQuestionPack");
};

const choose = (input) => {
    const questionNumber = input.name;
    const questionPoint = input.value;
    main.socket.emit("FIN_choose", { questionNumber, questionPoint });
};

const packChosen = () => {
    const list = ["", "", ""];
    const selection = document.getElementById("FIN_choose-question-board");
    for (let i = 1; i <= 3; i++) {
        const temp = selection.querySelectorAll(`input[name="${i}"]`);
        for (let j = 0; j < 3; j++) {
            if (temp[j].checked) {
                list[i - 1] = temp[j].value;
                break;
            }
        }
    }
    main.socket.emit("FIN_packChosen", list);
    document.getElementById("FIN_board").style.pointerEvents = "none";
};

const chooseQuestion = () => {
    const questionNumber = document.getElementById("FIN_question-number").value;
    main.socket.emit("FIN_chooseQuestion", questionNumber);
};

const startTiming = () => {
    let timeLeft;
    clearInterval(downloadTimer);
    timeLeft = 9 + (currentQuestionPoint - 10) / 2;
    const questionTime = timeLeft + 1;
    document.getElementById("FIN_time").textContent = questionTime;
    main.socket.emit("FIN_startTiming", questionTime);
    timeLeft = 9 + (currentQuestionPoint - 10) / 2;
    downloadTimer = setInterval(() => {
        document.getElementById("FIN_time").textContent = timeLeft;
        if (timeLeft <= 0) {
            clearInterval(downloadTimer);
        }
        timeLeft -= 1;
    }, 1000);
};

const star = () => {
    main.socket.emit("FIN_star", !isStarOn);
    if (isStarOn) {
        isStarOn = false;
        document.getElementById("FIN_star-status").textContent = "Trạng thái: Đang tắt";
    } else {
        isStarOn = true;
        document.getElementById("FIN_star-status").textContent = "Trạng thái: Đang bật";
    }
};

const right = () => {
    if (signalPlayer) {
        //có người giật chuông đúng
        const signalPoint = document.getElementById("player-point-" + signalPlayer);
        signalPoint.value = Number(signalPoint.value) + currentQuestionPoint;
        if (!isStarOn) {
            //không sao thì trừ điểm hút
            const currentPoint = document.getElementById("player-point-" + currentPlayer);
            currentPoint.value = Number(currentPoint.value) - currentQuestionPoint;
            if (currentPoint.value < 0) currentPoint.value = 0;
        }
    } else {
        //main đúng
        const point = document.getElementById("player-point-" + currentPlayer);
        if (isStarOn) point.value = Number(point.value) + 2 * currentQuestionPoint;
        else point.value = Number(point.value) + currentQuestionPoint;
    }
    funcs.sendPlayerData();
    main.socket.emit("FIN_right");
};

const count5s = () => {
    if (isStarOn) {
        const point = document.getElementById("player-point-" + currentPlayer);
        point.value = Number(point.value) - currentQuestionPoint;
        if (point.value < 0) point.value = 0;
    }
    main.socket.emit("FIN_5s");
    clearInterval(downloadTimer);
    document.getElementById("FIN_time").textContent = 5;
    let timeLeft = 4;
    downloadTimer = setInterval(() => {
        document.getElementById("FIN_time").textContent = timeLeft;
        if (timeLeft <= 0) {
            clearInterval(downloadTimer);
        }
        timeLeft -= 1;
    }, 1000);
    funcs.sendPlayerData();
};

const deleteSignal = () => {
    signalPlayer = 0;
    for (let i = 1; i <= 4; i++) {
        document.getElementById("player-" + i).style.border = "calc(5vw/96) dotted grey";
    }
};

const wrong = () => {
    if (signalPlayer) {
        const point = document.getElementById("player-point-" + signalPlayer);
        point.value = Number(point.value) - currentQuestionPoint / 2;
        if (point.value < 0) point.value = 0;
    }
    funcs.sendPlayerData();
    main.socket.emit("FIN_wrong");
};

const finishTurn = () => {
    funcs.updateMediaButton("none");
    document.getElementById("FIN_media").innerHTML = "";
    document.getElementById("FIN_question-number").value = "";
    document.getElementById("FIN_choose-question-board").innerHTML = "";
    main.socket.emit("FIN_finishTurn");
};

export const resetRound = () => {
    currentQuestionPoint = undefined;
    isStarOn = false;
    currentPlayer = undefined;
    signalPlayer = 0;
};
