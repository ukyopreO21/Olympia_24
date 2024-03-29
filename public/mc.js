var socket = io();
socket.emit("sendAdminPassword", sessionStorage.getItem("adminPassword"));

function sendAdminPassword() {
    socket.emit("sendAdminPassword", document.getElementById("passwordInput").value);
}

document.getElementById("passwordInput").addEventListener("keyup", function (event) {
    if (event.key === "Enter") sendAdminPassword();
});

socket.on("_sendAdminPassword", function (password) {
    sessionStorage.setItem("adminPassword", password);
    document.getElementById("password").style.display = "none";
    socket.emit("hostEnterRoom");
    socket.emit("getVersion");
});

socket.on("serverRestarted", function () {
    alert("Server đã khởi động trở lại, vui lòng F5 để cập nhật lại tình trạng.");
    window.location.reload();
});

socket.on("_getVersion", function (appVersion) {
    document.getElementById("currentVersion").textContent = appVersion;
});

socket.on("serverRestarted", function () {
    alert("Server đã khởi động trở lại, vui lòng F5 để cập nhật lại tình trạng.");
    window.location.reload();
});

var roundName = ["CHƯA BẮT ĐẦU", "KHỞI ĐỘNG", "VƯỢT CHƯỚNG NGẠI VẬT", "TĂNG TỐC", "VỀ ĐÍCH", "CÂU HỎI PHỤ"];
var englishRoundName = ["", "start", "obstacle", "acceleration", "finish", "subFinish"];
var currentRoundID;
var allPlayerName = [];
var allPlayerPoint = [];
var downloadTimer;

socket.on("_RoundChosen", function (roundID) {
    currentRoundID = roundID;
    document.getElementById("roundName").innerHTML = roundName[roundID];
    for (let i = 1; i < englishRoundName.length; i++) {
        if (i == currentRoundID) document.getElementById(englishRoundName[i] + "UI").style.visibility = "visible";
        else document.getElementById(englishRoundName[i] + "UI").style.visibility = "hidden";
    }
});

socket.on("serverData", function (data) {
    for (let i = 1; i <= 4; i++) {
        allPlayerName[i - 1] = data.playerName[i - 1];
        allPlayerPoint[i - 1] = data.playerPoint[i - 1];
        document.getElementById("Name" + i).textContent = allPlayerName[i - 1];
        document.getElementById("Point" + i).textContent = allPlayerPoint[i - 1];
    }
});

socket.on("_sendAdminData", function (adminData) {
    for (let i = 1; i <= 4; i++) {
        document.getElementById("Name" + i).textContent = adminData.currentPlayerName[i - 1];
        document.getElementById("Point" + i).textContent = adminData.currentPlayerPoint[i - 1];
        allPlayerPoint[i - 1] = adminData.currentPlayerPoint[i - 1];
        allPlayerName[i - 1] = adminData.currentPlayerName[i - 1];
    }
});

function countDown(time) {
    document.getElementById("timeLeft").textContent = time;
    clearInterval(downloadTimer);
    let timeLeft = time - 1;
    downloadTimer = setInterval(function () {
        document.getElementById("timeLeft").textContent = timeLeft;
        if (timeLeft <= 0) {
            clearInterval(downloadTimer);
        }
        timeLeft -= 1;
    }, 1000);
}

function templateLabel(label) {
    return "<font color='orange'>" + label + "</font>";
}

socket.on("_endGame", function () {
    for (let i = 1; i < englishRoundName.length; i++) {
        document.getElementById(englishRoundName[i] + "UI").style.visibility = "hidden";
    }
    for (let i = 1; i <= 4; i++) {
        document.getElementById("currentPoint" + i).classList.remove("granted");
    }
    document.getElementById("timeLeft").textContent = "";
    let answerNames = document.querySelectorAll(".answerName");
    let answerTexts = document.querySelectorAll(".answerText");
    answerNames.forEach((answerName) => {
        answerName.textContent = "";
    });
    answerTexts.forEach((answerText) => {
        answerText.textContent = "";
    });
});

var STR_currentPlayer;
var STR_ithQuestion;
var STR_signalPlayer;

socket.on("_STR_choosePlayer", function (ithStart) {
    STR_currentPlayer = Number(ithStart);
    if (STR_currentPlayer != 5) document.getElementById("STR_turn").innerHTML = templateLabel("Lượt:") + "&nbsp;" + allPlayerName[STR_currentPlayer - 1];
    else document.getElementById("STR_turn").innerHTML = templateLabel("Lượt:") + "&nbsp;" + "Chung";
});

socket.on("_STR_startPlayerTurn", function () {
    STR_ithQuestion = 0;
    if (STR_currentPlayer != 5) document.getElementById("STR_questionNumber").innerHTML = templateLabel("Câu hỏi số:") + "&nbsp;" + "0/6";
    else document.getElementById("STR_questionNumber").innerHTML = templateLabel("Câu hỏi số:") + "&nbsp;" + "0/12";
});

function STR_printNextQuestion(question) {
    document.querySelector("#STR_question label").textContent = question.question;
    document.querySelector("#STR_answer label").textContent = question.answer;
    document.querySelector("#STR_note label").textContent = question.note;
}

function STR_printPassStatus() {
    if (STR_currentPlayer != 5) document.getElementById("STR_questionNumber").innerHTML = templateLabel("Câu hỏi số:") + "&nbsp;" + STR_ithQuestion + "/6";
    else document.getElementById("STR_questionNumber").innerHTML = templateLabel("Câu hỏi số:") + "&nbsp;" + STR_ithQuestion + "/12";
}

socket.on("_STR_openQuestionBoard", function () {
    document.getElementById("timeLeft").textContent = "0";
});

socket.on("_STR_startTurn", function (question) {
    STR_ithQuestion++;
    STR_printNextQuestion(question);
    STR_printPassStatus();
});

socket.on("_STR_Timing", function (time) {
    countDown(time);
});

socket.on("_STR_blockSignal", function (player) {
    STR_signalPlayer = player;
    document.getElementById("currentPoint" + player).classList.add("granted");
});

socket.on("_STR_getNextQuestion", function (questionData) {
    if (STR_signalPlayer) document.getElementById("currentPoint" + STR_signalPlayer).classList.remove("granted");
    STR_signalPlayer = 0;
    STR_ithQuestion++;
    STR_printNextQuestion(questionData);
    STR_printPassStatus();
    clearInterval(downloadTimer);
    document.getElementById("timeLeft").textContent = 0;
});

socket.on("_STR_finishTurn", function () {
    for (let i = 1; i <= 4; i++) document.getElementById("currentPoint" + i).classList.remove("granted");
    document.getElementById("STR_turn").innerHTML = templateLabel("Lượt:");
    document.getElementById("STR_questionNumber").innerHTML = templateLabel("Câu hỏi số:");
    document.querySelector("#STR_question label").textContent = "";
    document.querySelector("#STR_answer label").textContent = "";
    document.querySelector("#STR_note label").textContent = "";
});

socket.on("_OBS_adminGetRoundData", function (data) {
    for (let i = 0; i < 6; i++) {
        if (i < 5) {
            let td = document.querySelectorAll("#OBS_row" + (i + 1) + " td");
            td[1].textContent = data.OBS_QnA[i].rowLength;
            td[2].textContent = data.OBS_QnA[i].answer;
        } else {
            let td = document.querySelectorAll("#OBS_key td");
            td[1].textContent = String(data.OBS_CNV.answer).replace(/\s/g, "").length;
            td[2].textContent = String(data.OBS_CNV.answer).toUpperCase();
            document.getElementById("OBS_image").src = data.OBS_CNV.media;
        }
    }
});

socket.on("_OBS_showRowQuestion", function (questionData) {
    document.querySelector("#OBS_question .questionContent label").textContent = questionData.question;
    document.querySelector("#OBS_answer .answerContent label").textContent = questionData.answer;
});

socket.on("_OBS_closeRowQuestion", function () {
    document.querySelector("#OBS_question .questionContent label").textContent = "";
    document.querySelector("#OBS_answer .answerContent label").textContent = "";
});

socket.on("_OBS_start15s", function () {
    countDown(15);
});

socket.on("_OBS_serverObsSignal", function (signalData) {
    let print = document.querySelector("#OBS_signals .OBS_printSignal");
    print.innerHTML +=
        '<div class="OBS_signal" id="OBS_signal' +
        signalData.OBS_numberOfObsSignal +
        '">' +
        signalData.OBS_numberOfObsSignal +
        ". " +
        signalData.signalDataFromAdmin.name +
        "</div>";
    document.getElementById("OBS_signal" + signalData.OBS_numberOfObsSignal).style.left = 25 * (Number(signalData.OBS_numberOfObsSignal) - 1) + "%";
});

socket.on("_OBS_showRowAnswer", function (rowAnswerData) {
    for (let i = 1; i <= 4; i++) {
        document.getElementById("answerName" + i).textContent = rowAnswerData.name[i - 1];
        document.getElementById("answerText" + i).textContent = rowAnswerData.answer[i - 1];
    }
});

socket.on("_OBS_openCorner", function (currentRow) {
    let hiders = document.querySelectorAll(".OBS_hider");
    hiders[currentRow - 1].style.visibility = "hidden";
});

function OBS_showImage() {
    let hiders = document.querySelectorAll(".OBS_hider");
    hiders.forEach((hider) => {
        hider.style.visibility = "hidden";
    });
}

socket.on("_OBS_rightObs", function () {
    OBS_showImage();
});

socket.on("_OBS_wrongObs", function () {
    document.getElementById("OBS_signals").innerHTML = "";
});

socket.on("_OBS_last15s", function () {
    countDown(15);
});

socket.on("_OBS_showObs", function () {
    OBS_showImage();
});

socket.on("_ACC_openQuestion", function (ACC_questionData) {
    document.querySelector("#ACC_question .questionContent label").textContent = ACC_questionData.question;
    document.querySelector("#ACC_answer .answerContent label").textContent = ACC_questionData.answer;
    document.querySelector("#ACC_note .noteContent label").textContent = ACC_questionData.note;
    if (ACC_questionData.type == "Video") {
        document.getElementById("ACC_video").src = ACC_questionData.source;
    } else {
        document.getElementById("ACC_image").src = ACC_questionData.source;
    }
});

socket.on("ACC_sendQuestionNumber", function (number) {
    document.getElementById("ACC_questionNumber").innerHTML = templateLabel("Câu hỏi số:") + "&nbsp;" + number;
});

socket.on("_ACC_startTiming", function (timeData) {
    countDown(timeData.ithQuestion * 10);
    document.getElementById("ACC_video").play();
});

socket.on("_ACC_showAnswer", function (answerData) {
    for (i = 1; i <= 4; i++) {
        document.getElementById("answerName" + i).textContent = answerData[i - 1].name;
        let time = String(answerData[i - 1].time);
        if (time[time.length - 2] == ".") time += "0";
        document.getElementById("answerText" + i).innerHTML = answerData[i - 1].answer + "<br>" + "[" + time + "]";
    }
});

socket.on("_ACC_showQuestionAnswer", function (ACC_Data) {
    if (ACC_Data.type == "Image") {
        document.getElementById("ACC_image").src = ACC_Data.answerImage;
    }
});

socket.on("_ACC_turnOffQuestion", function () {
    document.getElementById("ACC_questionNumber").innerHTML = templateLabel("Câu hỏi số:");
    document.querySelector("#ACC_question .questionContent label").textContent = ACC_questionData.question;
    document.querySelector("#ACC_answer .answerContent label").textContent = ACC_questionData.answer;
    document.querySelector("#ACC_note .noteContent label").textContent = ACC_questionData.note;
    document.getElementById("ACC_video").src = "";
    document.getElementById("ACC_image").src = "";
});

socket.on("_FIN_choosePlayer", function (player) {
    for (let i = 1; i <= 4; i++) document.getElementById("currentPoint" + i).classList.remove("granted");
    document.getElementById("FIN_turn").innerHTML = templateLabel("Lượt:") + "&nbsp;" + allPlayerName[player - 1];
});

socket.on("_FIN_Choose", function (chooseData) {
    document.getElementById("FIN_q" + chooseData.ithQuestion).textContent = chooseData.ithPoint;
});

socket.on("_FIN_chooseQuestion", function (question) {
    for (let i = 1; i <= 4; i++) document.getElementById("currentPoint" + i).classList.remove("granted");
    for (let i = 1; i <= 3; i++) document.getElementById("FIN_q" + i).classList.remove("granted");
    document.getElementById("FIN_q" + question.ithQuestion).classList.add("granted");
    document.querySelector("#FIN_question .questionContent label").textContent = question.questionData.question;
    document.querySelector("#FIN_answer .answerContent label").textContent = question.questionData.answer;
    document.querySelector("#FIN_note .noteContent label").textContent = question.questionData.note;
});

socket.on("_FIN_startTiming", function (questionTime) {
    countDown(questionTime);
});

socket.on("_FIN_Star", function (isStarOn) {
    if (isStarOn) {
        document.getElementById("FIN_star").style.visibility = "visible";
    } else document.getElementById("FIN_star").style.visibility = "hidden";
});

socket.on("_FIN_blockSignal", function (player) {
    document.getElementById("currentPoint" + player).classList.add("granted");
});

socket.on("_FIN_5s", function () {
    for (let i = 1; i <= 4; i++) document.getElementById("currentPoint" + i).classList.remove("granted");
    countDown(5);
});

socket.on("_FIN_finishTurn", function () {
    for (let i = 1; i <= 4; i++) document.getElementById("currentPoint" + i).classList.remove("granted");
    for (let i = 1; i <= 3; i++) {
        document.getElementById("FIN_q" + i).classList.remove("granted");
        document.getElementById("FIN_q" + i).textContent = "";
    }
    document.querySelector("#FIN_question .questionContent label").textContent = "";
    document.querySelector("#FIN_answer .answerContent label").textContent = "";
    document.querySelector("#FIN_note .noteContent label").textContent = "";
    document.getElementById("FIN_star").style.visibility = "hidden";
});

var SFI_Hash = [];
var SFI_startTime;
var SFI_pauseTime;
var SFI_timeLeft;

socket.on("_SFI_startRound", function (playerList) {
    for (let i = 0; i < playerList.length; i++) {
        SFI_Hash[playerList[i] - 1] = i + 1;
        document.getElementById("answerName" + (i + 1)).textContent = allPlayerName[playerList[i] - 1];
    }
});

socket.on("_SFI_openQuestion", function (serverData) {
    document.getElementById("SFI_questionNumber").innerHTML = templateLabel("Câu hỏi số:") + "&nbsp" + serverData.openedCount;
    document.querySelector("#SFI_question .questionContent label").textContent = serverData.questionData.question;
    document.querySelector("#SFI_answer .answerContent label").textContent = serverData.questionData.answer;
    document.querySelector("#SFI_note .noteContent label").textContent = serverData.questionData.note;
    document.getElementById("timeLeft").textContent = 15;
    SFI_timeLeft = 15;
    for (let i = 1; i <= 4; i++) document.getElementById("currentPoint" + i).classList.remove("granted");
});

socket.on("_SFI_closeQuestion", function () {
    document.querySelector("#SFI_question .questionContent label").textContent = "";
    document.querySelector("#SFI_answer .answerContent label").textContent = "";
    document.querySelector("#SFI_note .noteContent label").textContent = "";
});

function SFI_Timing(startTime, timeLeft) {
    let currentTime;
    clearInterval(downloadTimer);
    downloadTimer = setInterval(function () {
        currentTime = Date.now() / 1000;
        document.getElementById("timeLeft").textContent = Math.floor(Number(timeLeft - (currentTime - startTime))) + 1;
        if (Number(currentTime) >= Number(startTime) + timeLeft) {
            document.getElementById("timeLeft").textContent = 0;
            clearInterval(downloadTimer);
        }
    }, 1);
}

socket.on("_SFI_Timing", function (isReset) {
    SFI_startTime = Date.now() / 1000;
    SFI_Timing(SFI_startTime, Number(SFI_timeLeft));
    for (let i = 1; i <= 4; i++) document.getElementById("currentPoint" + i).classList.remove("granted");
});

socket.on("_SFI_blockSignal", function (player) {
    clearInterval(downloadTimer);
    SFI_pauseTime = Date.now() / 1000;
    SFI_timeLeft = SFI_timeLeft - (SFI_pauseTime - Number(SFI_startTime));
    document.getElementById("currentPoint" + player).classList.add("granted");
});
