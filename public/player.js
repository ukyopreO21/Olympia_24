const urlParams = new URLSearchParams(window.location.search);
const playerNumber = Number(urlParams.get("url"));

var element = document.documentElement;

document.getElementById("yourStartPosition").textContent = "Vị trí xuất phát: " + playerNumber;

function sendReady() {
    if (document.getElementById("readyButton").textContent == "SẴN SÀNG") {
        document.getElementById("readyButton").classList.add("active");
        socket.emit("sendReady", { playerNumber, ready: true });
        document.getElementById("readyButton").textContent = "HUỶ SẴN SÀNG";
    } else {
        document.getElementById("readyButton").classList.remove("active");
        socket.emit("sendReady", { playerNumber, ready: false });
        document.getElementById("readyButton").textContent = "SẴN SÀNG";
    }
}

if (playerNumber != 1 && playerNumber != 2 && playerNumber != 3 && playerNumber != 4) {
    signOutReason = "playerNumberInvalid";
    window.location.replace("http://" + window.location.host);
    sessionStorage.clear();
}
//Xử lý vi phạm mã nguồn
document.addEventListener("keydown", function (event) {
    if (event.ctrlKey && (event.key === "u" || event.key === "U")) {
        event.preventDefault();
    }
});

document.addEventListener("contextmenu", function (event) {
    event.preventDefault();
});

document.addEventListener("keydown", function (event) {
    if (event.ctrlKey && (event.key === "s" || event.key === "S")) {
        event.preventDefault();
    }
});

document.addEventListener("keydown", function (event) {
    if (event.keyCode == 123) {
        // 123 là mã phím cho F12
        event.preventDefault();
    }
});

//ÂM THANH
var resultAudio = new Audio("./Others/Sounds/PointSummary.mp3");
var startRoundAudio = new Audio();
var questionAudio = new Audio();

//KHỞI ĐỘNG
var STR_startTurn = new Audio("./Start/Sounds/KDVaoLuotThi.mp3");
var STR_openQuestionBoard = new Audio("./Start/Sounds/KDHienCauHoi.mp3");
var STR_mainTime = new Audio();
var STR_finishTurn = new Audio("./Start/Sounds/KDHetPhanThi.mp3");

//VƯỢT CHƯỚNG NGẠI VẬT
var OBS_numberOfCharacter = new Audio("./Obstacle/Sounds/VCNVSoKiTu.mp3");
var OBS_showRowsAudio = new Audio("./Obstacle/Sounds/VCNVHienThiHangNgang.mp3");
var OBS_chosenRow = new Audio("./Obstacle/Sounds/VCNVChonHangNgang.mp3");
var OBS_questionShow = new Audio("./Obstacle/Sounds/VCNVMoCauHoi.mp3");
var OBS_playObsTime = new Audio("./Obstacle/Sounds/VCNV15Giay.mp3");
var OBS_obsSignalAudio = new Audio("./Obstacle/Sounds/VCNVTinHieuCNV.mp3");
var OBS_showRowAnswerAudio = new Audio("./Obstacle/Sounds/VCNVMoDapAnThiSinh.mp3");
var OBS_rightRowAudio = new Audio("./Obstacle/Sounds/VCNVDungHangNgang.mp3");
var OBS_wrongAudio = new Audio("./Obstacle/Sounds/VCNVSaiHangNgangHoacCNV.mp3");
var OBS_openCornerAudio = new Audio("./Obstacle/Sounds/VCNVMoGocHinhAnh.mp3");
var OBS_rightObsAudio = new Audio("./Obstacle/Sounds/VCNVDungCNV.mp3");

//TĂNG TỐC
var ACC_openQuestion = new Audio("./Acceleration/Sounds/TTHienCauHoi.mp3");
var ACC_mainTime = new Audio();
var ACC_showAnswersAudio = new Audio("./Acceleration/Sounds/TTHienDapAnThiSinh.mp3");
var ACC_RightAudio = new Audio("./Acceleration/Sounds/TTTraLoiDung.mp3");
var ACC_WrongAudio = new Audio("./Acceleration/Sounds/TTTraLoiSai.mp3");

//VỀ ĐÍCH
var FIN_startTurnAudio = new Audio("./Finish/Sounds/VDLenViTriVeDich.mp3");
var FIN_showQuestionPackAudio = new Audio("./Finish/Sounds/VDHienCacGoiCauHoi.mp3");
var FIN_packChosen = new Audio("./Finish/Sounds/VDXacNhanGoiCauHoi.mp3");
var FIN_10seconds = new Audio("./Finish/Sounds/VD10GiayO21.mp3");
var FIN_15seconds = new Audio("./Finish/Sounds/VD15GiayO21.mp3");
var FIN_20seconds = new Audio("./Finish/Sounds/VD20GiayO21.mp3");
var FIN_RightAudio = new Audio("./Finish/Sounds/VDTraLoiDung.mp3");
var FIN_WrongAudio = new Audio("./Finish/Sounds/VDTraLoiSai.mp3");
var FIN_5seconds = new Audio("./Finish/Sounds/VD5GiayGianhQuyenTraLoi.mp3");
var FIN_StarAudio = new Audio("./Finish/Sounds/VDNgoiSaoHiVong.mp3");
var FIN_signalAudio = new Audio("./Finish/Sounds/VDTinHieuGianhQuyen.mp3");
var FIN_finishTurnAudio = new Audio("./Finish/Sounds/VDKetThucLuotThi.mp3");

//CÂU HỎI PHỤ
var SFI_mainTime = new Audio("./Obstacle/Sounds/VCNV_15GiayCuoi_CHP_15Giay.mp3");

//CHUNG
var rickRoll = new Audio("./Others/Sounds/RickRoll.mp3");

//Các biến xử lý
var roundName = ["CHƯA BẮT ĐẦU", "KHỞI ĐỘNG", "VƯỢT CHƯỚNG NGẠI VẬT", "TĂNG TỐC", "VỀ ĐÍCH", "CÂU HỎI PHỤ"];

var signOutReason = undefined;
var isAllowBlankAnswer;
var downloadTimer;
var currentRoundID;
var allPlayerName = ["", "", "", ""];
var allPlayerPoint = [0, 0, 0, 0];
var ACC_startTime;
var SFI_chosenToPlay = false;
var SFI_startTime;
var SFI_pauseTime;
var SFI_timeLeft;
var socket = io();

socket.on("serverRestarted", function () {
    alert("Server đã khởi động trở lại, vui lòng F5 để cập nhật lại tình trạng.");
    window.location.reload();
    sessionStorage.clear();
});

socket.emit("getVersion");
socket.on("_getVersion", function (appVersion) {
    document.getElementById("currentVersion").textContent = appVersion;
});

function defaultState() {
    document.getElementById("Media").innerHTML = "";
    document.getElementById("questionText").textContent = "";
    document.getElementById("timeLeft").textContent = "";
    defaultPlayerFunction();
    for (let i = 1; i <= 4; i++) {
        document.getElementById("answerName" + i).textContent = "";
        document.getElementById("answerText" + i).textContent = "";
    }
}

socket.emit("playerEnterRoom", playerNumber);

socket.on("_sendReady", function (data) {
    if (data.ready) document.getElementById("waitingRoom_player" + data.playerNumber).innerHTML += '<img class="ready" src="./Others/Ready.png"></img>';
    else {
        let ready = document.querySelector("#waitingRoom_player" + data.playerNumber + " .ready");
        ready.parentNode.removeChild(ready);
    }
});

function legitLogIn() {
    socket.emit("legitLogIn", playerNumber);
    socket.emit("getCurrentUI");
}

socket.on("firstLogIn", function () {
    let userID = Math.floor(Date.now());
    userID = userID.toString();
    sessionStorage.setItem("userID", userID);
    socket.emit("_firstLogIn", { playerNumber, userID });
    legitLogIn();
});

socket.on("checkLogIn", function (data) {
    if (data != sessionStorage.getItem("userID")) {
        signOutReason = "differentUserID";
        window.location.replace("http://" + window.location.host);
        sessionStorage.clear();
    } else {
        legitLogIn();
    }
});

socket.on("sendPlayersData", function (data) {
    document.getElementById("waitingRoom_player" + playerNumber).style.color = "orange";
    for (let i = 1; i <= 4; i++) {
        //phòng chờ
        document.getElementById("waitingRoom_name" + i).textContent = data.playerName[i - 1];
        document.getElementById("waitingRoom_point" + i).textContent = data.playerPoint[i - 1];
        if (data.isReady[i - 1]) document.getElementById("waitingRoom_player" + i).innerHTML += '<img class="ready" src="./Others/Ready.png"></img>';
        //trong phòng thi
        allPlayerName[i - 1] = data.playerName[i - 1];
        allPlayerPoint[i - 1] = data.playerPoint[i - 1];
        document.getElementById("Name" + i).textContent = allPlayerName[i - 1];
        document.getElementById("Point" + i).textContent = allPlayerPoint[i - 1];
    }
});

window.addEventListener("beforeunload", function () {
    if (signOutReason != "differentUserID") socket.emit("signOut", playerNumber);
    socket.emit("sendReady", { playerNumber, ready: false });
});

ChatUI();
offContestUI();
document.getElementById("message-input").addEventListener("keypress", sendText);

//Xử lý khi player đăng nhập
socket.on("_playerEnterRoom", function () {
    if (sessionStorage.getItem("allowBlankAnswer") == undefined) {
        sessionStorage.setItem("allowBlankAnswer", false);
        isAllowBlankAnswer = false;
    } else isAllowBlankAnswer = sessionStorage.getItem("allowBlankAnswer");
    if (isAllowBlankAnswer) {
        document.getElementById("allowBlankAnswer").textContent = "Nộp đáp án rỗng: Có";
    } else {
        isAllowBlankAnswer = false;
        document.getElementById("allowBlankAnswer").textContent = "Nộp đáp án rỗng: Không";
    }
});

socket.on("_sendCurrentUI", function (UIData) {
    currentRoundID = UIData.roundID;
    document.getElementById("roundName").innerHTML = roundName[currentRoundID];
    document.getElementById("currentRound").innerHTML = roundName[currentRoundID];
    if (UIData.UIName == "Phòng chat") {
        ChatUI();
        offContestUI();
    } else {
        roundUI();
        offChatUI();
    }
    if (UIData.isChatBan == false) document.getElementById("message-input").addEventListener("keypress", sendText);
    else document.getElementById("message-input").removeEventListener("keypress", sendText);
});

//RESET TRẠNG THÁI VÒNG THI
socket.on("_resetStatus", function (roundID) {
    if (roundID == 2) {
        for (let i = 0; i < 4; i++) document.getElementById("OBS_Row" + (i + 1)).style.color = "white";
    }
});

//Giao diện phòng chat

//TRẠNG THÁI VÒNG THI
socket.on("_RoundChosen", function (roundID) {
    currentRoundID = roundID;
    document.getElementById("currentRound").innerHTML = roundName[roundID];
    document.getElementById("roundName").innerHTML = roundName[roundID];
});

//XỬ LÝ CHAT
function sendText(event) {
    if (event.keyCode == 13 && document.getElementById("message-input").value != "") {
        let username = document.getElementById("username").value;
        username = username.trim();
        let message = document.getElementById("message-input").value;
        if (message == "/clear") {
            document.getElementById("chatBox").innerHTML = "";
        } else if (message == "/rickroll") {
            rickRoll.currentTime = 0;
            rickRoll.play();
        } else if (message == "/stoprickroll") {
            rickRoll.pause();
        } else
            socket.emit("sendChat", {
                username,
                message,
                playerNumber: playerNumber,
            });
        document.getElementById("message-input").value = "";
    }
}

function scrollDown() {
    let chatBox = document.getElementById("chatBox");
    return chatBox.scrollHeight - chatBox.scrollTop <= chatBox.clientHeight * 1.1;
}

socket.on("_sendChat", function (data) {
    let checkScroll = scrollDown();
    let box = document.getElementById("chatBox");
    if (data.username == "Host") {
        box.innerHTML +=
            "<div> <span style='font-family: \"Chivo Mono\", monospace; color: cyan'>" +
            data.time +
            "</span> | <font color='orange'>" +
            data.username +
            "</font>: <font color='#FE9D88'>" +
            data.message +
            "</font></div>";
    } else box.innerHTML += "<div> <span style='font-family: \"Chivo Mono\", monospace; color: cyan'>" + data.time + "</span> | <font color='orange'>" + data.username + "</font>: " + data.message + "</div>";
    if (checkScroll) box.scrollTop = box.scrollHeight;
});

function ChatUI() {
    let parentElement = document.getElementById("ChatUI");
    let childElements = parentElement.getElementsByTagName("*");

    for (let i = 0; i < childElements.length; i++) {
        childElements[i].style.visibility = "visible";
    }
}

function offChatUI() {
    let parentElement = document.getElementById("ChatUI");
    let childElements = parentElement.getElementsByTagName("*");
    for (let i = 0; i < childElements.length; i++) {
        childElements[i].style.visibility = "hidden";
    }
}

function ContestUI() {
    let parentElement = document.getElementById("ContestUI");
    let childElements = parentElement.getElementsByTagName("*");
    let Obstacle = document.querySelector("#MainUI #ObstacleUI");
    let Finish = document.querySelector("#MainUI #FinishUI");
    for (let i = 0; i < childElements.length; i++) {
        if (!Obstacle.contains(childElements[i]) && !Finish.contains(childElements[i])) childElements[i].style.visibility = "visible";
    }
}

function offContestUI() {
    let parentElement = document.getElementById("ContestUI");
    let childElements = parentElement.getElementsByTagName("*");
    for (let i = 0; i < childElements.length; i++) {
        childElements[i].style.visibility = "hidden";
    }
}

function ObstacleUI() {
    let parentElement = document.getElementById("ObstacleUI");
    let childElements = parentElement.getElementsByTagName("*");
    for (let i = 0; i < childElements.length; i++) {
        childElements[i].style.visibility = "visible";
    }
}

function offObstacleUI() {
    let parentElement = document.getElementById("ObstacleUI");
    let childElements = parentElement.getElementsByTagName("*");
    for (let i = 0; i < childElements.length; i++) {
        childElements[i].style.visibility = "hidden";
    }
}

function FinishUI() {
    let parentElement = document.getElementById("FinishUI");
    let childElements = parentElement.getElementsByTagName("*");
    for (let i = 0; i < childElements.length; i++) {
        childElements[i].style.visibility = "visible";
    }
}

function offFinishUI() {
    let parentElement = document.getElementById("FinishUI");
    let childElements = parentElement.getElementsByTagName("*");
    for (let i = 0; i < childElements.length; i++) {
        childElements[i].style.visibility = "hidden";
    }
}

socket.on("_ContestUI", function () {
    offChatUI();
    ContestUI();
});

socket.on("_ChatUI", function () {
    offContestUI();
    ChatUI();
});

//Giao diện phòng chơi

//Xử lý chuẩn bị

socket.on("_changeChatRules", function (rule) {
    let chatbotText = document.getElementById("messages");
    if (rule == false) {
        document.getElementById("message-input").addEventListener("keypress", sendText);
        chatbotText.innerHTML += '<li style="color: #f1a621">[' + "Chatbot" + "]: " + "Server đã mở chat" + "</li>";
    } else {
        document.getElementById("message-input").removeEventListener("keypress", sendText);
        chatbotText.innerHTML += '<li style="color: #f1a621">[' + "Chatbot" + "]: " + "Server đã tắt chat" + "</li>";
    }
});

//NHẬN ADMIN DATA
socket.on("_sendAdminData", function (adminData) {
    for (i = 1; i <= 4; i++) {
        document.getElementById("Name" + i).textContent = adminData.currentPlayerName[i - 1];
        document.getElementById("Point" + i).textContent = adminData.currentPlayerPoint[i - 1];
        document.getElementById("waitingRoom_point" + i).textContent = adminData.currentPlayerPoint[i - 1];
        document.getElementById("waitingRoom_name" + i).textContent = adminData.currentPlayerName[i - 1];
        allPlayerPoint[i - 1] = adminData.currentPlayerPoint[i - 1];
        allPlayerName[i - 1] = adminData.currentPlayerName[i - 1];
    }
});

//Xử lý TRONG PHẦN THI
document.getElementById("currentPoint" + playerNumber).style.color = "orange";

function defaultPlayerFunction() {
    document.getElementById("answerInput").value = "";
    document.getElementById("answerInput").disabled = true;
    document.getElementById("Answer").style.opacity = 0.5;
    document.getElementById("saveAnswerText").style.color = "white";
    document.getElementById("saveAnswerText").textContent = "";
    document.getElementById("saveAnswer").style.opacity = 0.5;
    document.getElementById("sendSignal").disabled = true;
    document.getElementById("sendSignal").style.opacity = 0.5;
    document.getElementById("sendSignal").textContent = "";
    document.getElementById("sendSignal").onmouseover = "";
    document.getElementById("sendSignal").style.backgroundColor = "#FF6961";
    document.getElementById("sendSignal").style.cursor = "default";
}

function resetAnswerZone() {
    for (let i = 1; i <= 4; i++) {
        document.getElementById("Answer" + i).style.opacity = 1;
        document.getElementById("answerName" + i).textContent = "";
        document.getElementById("answerText" + i).textContent = "";
    }
}

function useAnswerInput() {
    document.getElementById("Answer").style.opacity = 1;
    document.getElementById("answerInput").disabled = false;
    document.getElementById("saveAnswer").style.opacity = 1;
}

function offUseAnswerInput() {
    document.getElementById("answerInput").value = "";
    document.getElementById("answerInput").disabled = true;
    document.getElementById("Answer").style.opacity = 0.5;
    document.getElementById("saveAnswer").style.opacity = 0.5;
}

function useSendSignal() {
    document.getElementById("sendSignal").disabled = false;
    document.getElementById("sendSignal").style.opacity = 1;
    document.getElementById("sendSignal").onmouseover = function () {
        document.getElementById("sendSignal").style.backgroundColor = "orange";
        document.getElementById("sendSignal").style.cursor = "pointer";
    };
    document.getElementById("sendSignal").onmouseout = function () {
        document.getElementById("sendSignal").style.backgroundColor = "#FF6961";
        document.getElementById("sendSignal").style.cursor = "default";
    };
}

function offUseSendSignal() {
    document.getElementById("sendSignal").disabled = true;
    document.getElementById("sendSignal").style.opacity = 0.5;
    document.getElementById("sendSignal").onmouseover = "";
    document.getElementById("sendSignal").style.borderColor = "orange";
    document.getElementById("sendSignal").style.cursor = "default";
}

function changeFontSize(button) {
    let element = document.getElementById("questionText");
    let style = window.getComputedStyle(element);
    let value = parseFloat(style.getPropertyValue("font-size"));
    let vw = (value / window.innerWidth) * 100;
    if (button.id == "upFont" && vw < 10) vw += 0.1;
    else if (button.id == "downFont" && vw > 0.5) vw -= 0.1;
    element.style.fontSize = vw + "vw";
}

function allowBlankAnswer() {
    isAllowBlankAnswer = !isAllowBlankAnswer;
    if (isAllowBlankAnswer) {
        document.getElementById("allowBlankAnswer").textContent = "Nộp đáp án rỗng: Có";
    } else {
        document.getElementById("allowBlankAnswer").textContent = "Nộp đáp án rỗng: Không";
    }
    sessionStorage.setItem("allowBlankAnswer", isAllowBlankAnswer);
}

function roundUI() {
    ContestUI();
    defaultPlayerFunction();
    let parent = document.getElementById("customStatus");
    parent.innerHTML = "";

    if (currentRoundID == "1") {
        parent.innerHTML += '<div id="STR_Player"></div><div id="STR_Progress"></div><div id="STR_Subject"></div>';
        document.getElementById("sendSignal").textContent = "GIÀNH QUYỀN TRẢ LỜI";
        startRoundAudio.src = "./Start/Sounds/KDBatDauVongThi.mp3";
    } else if (currentRoundID == "2") {
        parent.innerHTML += '<div id="OBS_ACC_SFI_Status"></div>';
        useAnswerInput();
        useSendSignal();
        document.getElementById("sendSignal").textContent = "TRẢ LỜI CHƯỚNG NGẠI VẬT";
        startRoundAudio.src = "./Obstacle/Sounds/VCNVBatDauVongThi.mp3";
    } else if (currentRoundID == "3") {
        parent.innerHTML += '<div id="OBS_ACC_SFI_Status"></div>';
        startRoundAudio.src = "./Acceleration/Sounds/TTBatDauVongThi.mp3";
    } else if (currentRoundID == "4") {
        parent.innerHTML += '<div id="FIN_Star"><img></div><div id="FIN_Player"></div><div id="FIN_Pack"></div><div id="FIN_Question"></div>';
        document.getElementById("sendSignal").textContent = "GIÀNH QUYỀN TRẢ LỜI";
        startRoundAudio.src = "./Finish/Sounds/VDBatDauVongThi.mp3";
    }
}

socket.on("_startRound", function () {
    roundUI();
    startRoundAudio.pause();
    startRoundAudio.currentTime = 0;
    startRoundAudio.play();
});

function countDown(startTime, offGranted) {
    document.getElementById("answerInput").focus();
    if (currentRoundID == 2) document.getElementById("answerInput").addEventListener("keypress", sendAnswer);

    document.getElementById("timeLeft").textContent = startTime;
    clearInterval(downloadTimer);
    let timeLeft = startTime - 1;
    downloadTimer = setInterval(function () {
        document.getElementById("timeLeft").textContent = timeLeft;
        if (timeLeft <= 0) {
            clearInterval(downloadTimer);
            if (offGranted) offUseSendSignal();
            if (currentRoundID == 2) document.getElementById("answerInput").removeEventListener("keypress", sendAnswer);
        }
        timeLeft -= 1;
    }, 1000);
}

socket.on("_OBS_showNumberOfCharacter", function () {
    OBS_numberOfCharacter.pause();
    OBS_numberOfCharacter.currentTime = 0;
    OBS_numberOfCharacter.play();
});

socket.on("_OBS_showRows", function (data) {
    OBS_showRowsAudio.pause();
    OBS_showRowsAudio.currentTime = 0;
    OBS_showRowsAudio.play();
    document.getElementById("OBS_imageKey").src = data.media;
    let charNumber = String(data.answer.replace(/\s+/g, ""));
    document.getElementById("OBS_Key").textContent = "CHƯỚNG NGẠI VẬT CÓ " + charNumber.length + " KÍ TỰ";
    ObstacleUI();
    document.getElementById("sendSignal").onclick = OBS_Signal;
    socket.emit("OBS_getRowsLength");
});

socket.on("_OBS_getRowsLength", function (data) {
    for (let i = 0; i < 4; i++) document.getElementById("OBS_Row" + (i + 1)).textContent = "Hàng ngang " + (i + 1) + " (" + data[i].rowLength + " kí tự)";
});

socket.on("_OBS_chooseRow", function (data) {
    OBS_chosenRow.pause();
    OBS_chosenRow.currentTime = 0;
    OBS_chosenRow.play();
    resetAnswerZone();
    if (data.rowIth == 5) document.getElementById("OBS_ACC_SFI_Status").textContent = "Ô trung tâm";
    else {
        document.getElementById("OBS_Row" + data.rowIth).style.color = "orange";
        document.getElementById("OBS_ACC_SFI_Status").textContent = "Hàng ngang " + data.rowIth;
    }
});

socket.on("_OBS_showRowQuestion", function (questionIth) {
    OBS_questionShow.pause();
    OBS_questionShow.currentTime = 0;
    OBS_questionShow.play();
    document.getElementById("questionText").textContent = questionIth.question;
});

socket.on("_OBS_closeRowQuestion", function () {
    document.getElementById("questionText").textContent = "";
});

function sendAnswer(event) {
    let playerAnswer = document.getElementById("answerInput").value;
    playerAnswer = playerAnswer.trim().toUpperCase();
    if (event.key === "Enter" && (isAllowBlankAnswer || playerAnswer != "")) {
        socket.emit("sendAnswer", {
            playerNumber,
            playerAnswer,
        });
        document.getElementById("answerInput").value = "";
        document.getElementById("saveAnswerText").innerHTML = playerAnswer;
    }
}

function OBS_mainObsTime() {
    OBS_playObsTime.pause();
    OBS_playObsTime.currentTime = 0;
    OBS_playObsTime.play();
}

socket.on("_OBS_start15s", function () {
    OBS_mainObsTime();
    countDown(15);
});

function OBS_Signal() {
    offUseSendSignal();
    offUseAnswerInput();
    socket.emit("OBS_playerObsSignal", playerNumber);
}

socket.on("_OBS_serverObsSignal", function (signalData) {
    OBS_obsSignalAudio.pause();
    OBS_obsSignalAudio.currentTime = 0;
    OBS_obsSignalAudio.play();
    if (playerNumber == Number(signalData.signalDataFromAdmin.numberOfPlayer)) document.getElementById("answerInput").removeEventListener("keypress", sendAnswer);
    let print = document.getElementById("OBS_printSignal");
    print.innerHTML +=
        '<div class="OBS_Signal" id="OBS_Signal' +
        signalData.OBS_numberOfObsSignal +
        '">' +
        signalData.OBS_numberOfObsSignal +
        ". " +
        signalData.signalDataFromAdmin.name +
        "</div>";
    document.getElementById("OBS_Signal" + signalData.OBS_numberOfObsSignal).style.left = 25 * (Number(signalData.OBS_numberOfObsSignal) - 1) + "%";
});

var showAnswer;

socket.on("_OBS_showRowAnswer", function (rowAnswerData) {
    OBS_showRowAnswerAudio.pause();
    OBS_showRowAnswerAudio.currentTime = 0;
    OBS_showRowAnswerAudio.play();
    for (let i = 1; i <= 4; i++) {
        document.getElementById("answerName" + i).textContent = rowAnswerData.name[i - 1];
        document.getElementById("answerText" + i).textContent = rowAnswerData.answer[i - 1];
    }
});

socket.on("_OBS_playRightRow", function (data) {
    OBS_rightRowAudio.pause();
    OBS_rightRowAudio.currentTime = 0;
    OBS_rightRowAudio.play();
    if (data.currentRow != 5) {
        document.getElementById("OBS_Row" + data.currentRow).textContent = data.questionData.answer;
        document.getElementById("OBS_Row" + data.currentRow).style.color = "cyan";
    }
});

function OBS_wrongAudioPlay() {
    OBS_wrongAudio.pause();
    OBS_wrongAudio.currentTime = 0;
    OBS_wrongAudio.play();
}

socket.on("_OBS_wrongRow", function (number) {
    document.getElementById("Answer" + number).style.opacity = 0.5;
});

socket.on("_OBS_playWrongRow", function (currentRow) {
    OBS_wrongAudioPlay();
    document.getElementById("OBS_Row" + currentRow).style.color = "black";
});

socket.on("_OBS_openCorner", function (currentRow) {
    OBS_openCornerAudio.pause();
    OBS_openCornerAudio.currentTime = 0;
    OBS_openCornerAudio.play();
    document.getElementById("OBS_Q" + currentRow).style.visibility = "hidden";
});

function OBS_showObstacle(obsData) {
    document.getElementById("sendSignal").onclick = "";
    for (let i = 1; i <= 5; i++) {
        document.getElementById("OBS_Q" + i).style.visibility = "hidden";
    }
    document.getElementById("OBS_Key").textContent = "CHƯỚNG NGẠI VẬT: " + obsData.CNV;
    for (i = 0; i < 4; i++) {
        document.getElementById("OBS_Row" + (i + 1)).textContent = obsData.OBS_QnA[i].answer;
        document.getElementById("OBS_Row" + (i + 1)).style.color = "cyan";
    }
}

socket.on("_OBS_rightObs", function (obsData) {
    OBS_rightObsAudio.pause();
    OBS_rightObsAudio.currentTime = 0;
    OBS_rightObsAudio.play();
    OBS_showObstacle(obsData);
});

socket.on("OBS_keepRightObs", function (value) {
    for (let i = 1; i <= 4; i++) {
        if (i != Number(value) && document.getElementById("OBS_Signal" + i)) document.getElementById("OBS_Signal" + i).style.opacity = 0.5;
    }
});

socket.on("_OBS_wrongObs", function () {
    OBS_wrongAudioPlay();
    document.getElementById("OBS_printSignal").innerHTML = "";
});

socket.on("_OBS_last15s", function () {
    SFI_mainTime.pause();
    SFI_mainTime.currentTime = 0;
    SFI_mainTime.play();
    document.getElementById("OBS_ACC_SFI_Status").textContent = "15 giây cuối cùng";
    countDown(15, true);
});

socket.on("_OBS_showObs", function (obsData) {
    OBS_showObstacle(obsData);
});

var showResult, repeat;

//TÍN HIỆU PHẦN KĐ
var STR_currentPlayer;
var STR_ithQuestion;
var STR_signalPlayer;

socket.on("_STR_choosePlayer", function (ithStart) {
    STR_currentPlayer = Number(ithStart);
    if (STR_currentPlayer != 5) document.getElementById("STR_Player").innerHTML = "<font color='orange'>Lượt:</font>" + "&nbsp;" + allPlayerName[STR_currentPlayer - 1];
    else document.getElementById("STR_Player").innerHTML = "<font color='orange'>Lượt:</font>&nbsp" + "Chung";
});

socket.on("_STR_startPlayerTurn", function () {
    STR_ithQuestion = 0;
    STR_startTurn.pause();
    STR_startTurn.currentTime = 0;
    STR_startTurn.play();
    if (STR_currentPlayer != 5) document.getElementById("STR_Progress").innerHTML = "<font color='orange'>Câu:</font>" + "&nbsp;" + "0/6";
    else document.getElementById("STR_Progress").innerHTML = "<font color='orange'>Câu:</font>" + "&nbsp;" + "0/12";
});

socket.on("_STR_openQuestionBoard", function () {
    document.getElementById("timeLeft").textContent = "0";
    STR_openQuestionBoard.pause();
    STR_openQuestionBoard.currentTime = 0;
    STR_openQuestionBoard.play();
    STR_ithQuestion = 0;
});

function STR_printNextQuestion(question) {
    if (STR_currentPlayer == 5) useSendSignal();
    document.getElementById("sendSignal").onclick = STR_Signal;
    questionAudio.pause();
    if (question.subject && question.subject.toUpperCase() == "TIẾNG ANH") {
        questionAudio.src = question.media;
        questionAudio.play();
    }
    document.getElementById("questionText").textContent = question.question;
    document.getElementById("STR_Subject").textContent = STR_ithQuestion + ". " + question.subject;
}

function STR_printPassStatus() {
    if (STR_currentPlayer != 5) document.getElementById("STR_Progress").innerHTML = "<font color='orange'>Câu:</font>" + "&nbsp;" + STR_ithQuestion + "/6";
    else document.getElementById("STR_Progress").innerHTML = "<font color='orange'>Câu:</font>" + "&nbsp;" + STR_ithQuestion + "/12";
}

socket.on("_STR_startTurn", function (question) {
    STR_ithQuestion++;
    STR_printNextQuestion(question);
    STR_printPassStatus();
    STR_mainTime.src = "./Start/Sounds/KDLoop1.mp3";
    STR_mainTime.play();
});

function STR_Signal() {
    offUseSendSignal();
    document.getElementById("sendSignal").onclick = "";
    socket.emit("STR_blockSignal", playerNumber);
}

socket.on("_STR_Timing", function (time) {
    if (time == 3) {
        countDown(time, true);
    } else {
        if (STR_currentPlayer != 5 && STR_ithQuestion == 6) {
            STR_mainTime.src = "./Start/Sounds/KDLoop4.mp3";
            STR_mainTime.play();
        } else if (STR_currentPlayer == 5 && STR_ithQuestion == 12) {
            STR_mainTime.src = "./Start/Sounds/KDLoop4.mp3";
            STR_mainTime.play();
            if (!STR_signalPlayer) return;
        }
        countDown(time);
    }
});

socket.on("_STR_blockSignal", function (player) {
    document.getElementById("sendSignal").onclick = "";
    FIN_signalAudio.pause();
    FIN_signalAudio.currentTime = 0;
    FIN_signalAudio.play();
    STR_signalPlayer = player;
    document.getElementById("currentPoint" + player).classList.add("FIN_Granted");
});

socket.on("_STR_Right", function () {
    let STR_Right = new Audio("./Start/Sounds/KDDung.mp3");
    STR_Right.play();
});

socket.on("_STR_Wrong", function () {
    let STR_Wrong = new Audio("./Start/Sounds/KDSai.mp3");
    STR_Wrong.play();
});

socket.on("_STR_getNextQuestion", function (questionData) {
    if (STR_signalPlayer) document.getElementById("currentPoint" + STR_signalPlayer).classList.remove("FIN_Granted");
    STR_signalPlayer = 0;
    STR_ithQuestion++;
    STR_printNextQuestion(questionData);
    STR_printPassStatus();
    if (STR_currentPlayer != 5) {
        if (STR_ithQuestion == 3) {
            STR_mainTime.src = "./Start/Sounds/KDLoop2.mp3";
            STR_mainTime.play();
        } else if (STR_ithQuestion == 5) {
            STR_mainTime.src = "./Start/Sounds/KDLoop3.mp3";
            STR_mainTime.play();
        }
    } else {
        if (STR_ithQuestion == 6) {
            STR_mainTime.src = "./Start/Sounds/KDLoop2.mp3";
            STR_mainTime.play();
        } else if (STR_ithQuestion == 11) {
            STR_mainTime.src = "./Start/Sounds/KDLoop3.mp3";
            STR_mainTime.play();
        }
    }
    clearInterval(downloadTimer);
    document.getElementById("timeLeft").textContent = 0;
});

socket.on("_STR_finishTurn", function () {
    offUseSendSignal();
    document.getElementById("sendSignal").onclick = "";
    for (let i = 1; i <= 4; i++) document.getElementById("currentPoint" + i).classList.remove("FIN_Granted");
    document.getElementById("questionText").textContent = "";
    document.getElementById("STR_Player").textContent = "";
    document.getElementById("STR_Progress").textContent = "";
    document.getElementById("STR_Subject").textContent = "";
    STR_mainTime.pause();
    STR_finishTurn.pause();
    STR_finishTurn.currentTime = 0;
    STR_finishTurn.play();
});

socket.on("_result", function () {
    resultAudio.pause();
    resultAudio.currentTime = 0;
    resultAudio.play();
});

socket.on("_endGame", function () {
    defaultState();
    resetAnswerZone();
    offContestUI();
    ChatUI();
    document.getElementById("customStatus").innerHTML = "";
});

//TĂNG TỐC
socket.on("_ACC_chooseQuestion", function () {
    ACC_openQuestion.pause();
    ACC_openQuestion.currentTime = 0;
    ACC_openQuestion.play();
    offUseAnswerInput();
});

socket.on("_ACC_openQuestion", function (ACC_questionData) {
    document.getElementById("questionText").textContent = ACC_questionData.question;
    document.getElementById("Media").innerHTML = "";
    if (ACC_questionData.type == "Video") {
        let sourceNum = ACC_questionData.source.length;
        document.getElementById("Media").innerHTML +=
            "<video poster='none.png' preload='auto' disablePictureInPicture controlsList='nodownload'><source src='" +
            ACC_questionData.source +
            "' type='video/mp4'></source></video>";
        socket.emit("ACC_checkVideoSource", { sourceNum, playerNumber });
    } else {
        document.getElementById("Media").innerHTML += "<img src='" + ACC_questionData.source + "'>";
    }
    resetAnswerZone();
});

socket.on("ACC_sendQuestionNumber", function (number) {
    document.getElementById("OBS_ACC_SFI_Status").textContent = "Tăng tốc " + number;
});

socket.on("_ACC_sentAnswer", function (serverData) {
    if (playerNumber == serverData.answerData.playerNumber) {
        document.getElementById("answerInput").value = "";
        document.getElementById("saveAnswerText").textContent = serverData.answerData.playerAnswer + " (" + serverData.costTime + ")";
    }
});

function ACC_keypressHandler(event) {
    let playerAnswer = document.getElementById("answerInput").value;
    playerAnswer = playerAnswer.trim().toUpperCase();
    if (event.key === "Enter" && (isAllowBlankAnswer || playerAnswer != "")) {
        socket.emit("ACC_sentAnswer", {
            playerNumber,
            playerAnswer,
        });
    }
}

function ACC_timing(time) {
    let media = document.querySelector("#Media video");
    if (media) media.play();
    useAnswerInput();
    document.getElementById("answerInput").addEventListener("keypress", ACC_keypressHandler);
    ACC_mainTime.pause();
    ACC_mainTime.src = "./Acceleration/Sounds/TT" + time + "s.mp3";
    ACC_mainTime.currentTime = 0;
    ACC_mainTime.play();
}

socket.on("_ACC_startTiming", function (timeData) {
    ACC_startTime = timeData.startTime;
    ACC_timing(timeData.ithQuestion * 10);
    countDown(timeData.ithQuestion * 10);
});

socket.on("_ACC_showAnswer", function (answerData) {
    document.getElementById("answerInput").removeEventListener("keypress", ACC_keypressHandler);
    ACC_showAnswersAudio.pause();
    ACC_showAnswersAudio.currentTime = 0;
    ACC_showAnswersAudio.play();
    for (i = 1; i <= 4; i++) {
        document.getElementById("answerName" + i).textContent = answerData[i - 1].name;
        let time = String(answerData[i - 1].time);
        if (time[time.length - 2] == ".") time += "0";
        document.getElementById("answerText" + i).innerHTML = answerData[i - 1].answer + "<br>" + "[" + time + "]";
    }
});

socket.on("_ACC_showQuestionAnswer", function (ACC_Data) {
    document.getElementById("Media").innerHTML = "";
    if (ACC_Data.type == "Image") {
        document.getElementById("Media").innerHTML += "<img src='" + ACC_Data.answerImage + "'>";
    }
});

socket.on("_ACC_Right", function (answerData) {
    ACC_RightAudio.pause();
    ACC_RightAudio.currentTime = 0;
    ACC_RightAudio.play();
    for (i = 0; i < 4; i++) {
        if (answerData[i].checked == false) document.getElementById("Answer" + (i + 1)).style.opacity = "0.5";
    }
});

socket.on("_ACC_Wrong", function () {
    ACC_WrongAudio.pause();
    ACC_WrongAudio.currentTime = 0;
    ACC_WrongAudio.play();
    for (i = 0; i < 4; i++) {
        document.getElementById("Answer" + (i + 1)).style.opacity = "0.5";
    }
});

socket.on("_ACC_turnOffQuestion", function () {
    document.getElementById("questionText").textContent = "";
    document.getElementById("Media").innerHTML = "";
    resetAnswerZone();
});

//VỀ ĐÍCH
var FIN_currentPlayer;

socket.on("_FIN_choosePlayer", function (player) {
    for (let i = 1; i <= 4; i++) document.getElementById("currentPoint" + i).classList.remove("FIN_Granted");
    FIN_startTurnAudio.pause();
    FIN_startTurnAudio.currentTime = 0;
    FIN_startTurnAudio.play();
    FIN_currentPlayer = player;
    document.getElementById("FIN_Player").innerHTML = "<font color='orange'>Lượt:</font>" + "&nbsp;" + allPlayerName[FIN_currentPlayer - 1];
});

socket.on("_FIN_showQuestionPack", function () {
    FIN_showQuestionPackAudio.pause();
    FIN_showQuestionPackAudio.currentTime = 0;
    FIN_showQuestionPackAudio.play();
    FinishUI();
});

socket.on("_FIN_Choose", function (chooseData) {
    let FIN_questionChooseAudio = new Audio("./Finish/Sounds/VDTickCauHoi.mp3");
    FIN_questionChooseAudio.play();
    let list = document.querySelectorAll(".FIN_Question" + chooseData.ithQuestion);
    for (let i = 0; i < list.length; i++) {
        list[i].textContent = "";
    }
    document.querySelector("#FIN_Pack" + chooseData.ithPoint + " .FIN_Question" + chooseData.ithQuestion).innerHTML = "✓";
});

function FIN_resetBoard() {
    let list = document.querySelectorAll(".FIN_Question");
    for (let i = 0; i < list.length; i++) {
        list[i].classList.remove("FIN_Chosen");
        list[i].textContent = "";
    }
}

socket.on("_FIN_packChosen", function (list) {
    FinishUI();
    FIN_packChosen.pause();
    FIN_packChosen.currentTime = 0;
    FIN_packChosen.play();
    let totalPack = 0;
    for (let i = 0; i < 3; i++) {
        document.querySelector("#FIN_Pack" + list[i] + " .FIN_Question" + (i + 1)).classList.add("FIN_Chosen");
        totalPack += Number(list[i]);
    }
    setTimeout(function () {
        FIN_resetBoard();
        offFinishUI();
    }, 3000);
    document.getElementById("FIN_Pack").innerHTML =
        "<font color='orange'>Bộ" + "&nbsp;" + totalPack + " điểm:</font>" + "&nbsp;" + list[0] + " - " + list[1] + " - " + list[2];
});

socket.on("_FIN_chooseQuestion", function (question) {
    for (let i = 1; i <= 4; i++) document.getElementById("currentPoint" + i).classList.remove("FIN_Granted");
    document.getElementById("FIN_Question").textContent = "Câu " + question.ithQuestion + " - " + question.questionData.point + " điểm";
    document.getElementById("questionText").textContent = question.questionData.question;
});

socket.on("_FIN_startTiming", function (questionTime) {
    countDown(questionTime, 0);
    if (questionTime == 10) {
        FIN_10seconds.pause();
        FIN_10seconds.currentTime = 0;
        FIN_10seconds.play();
    } else if (questionTime == 15) {
        FIN_15seconds.pause();
        FIN_15seconds.currentTime = 0;
        FIN_15seconds.play();
    } else {
        FIN_20seconds.pause();
        FIN_20seconds.currentTime = 0;
        FIN_20seconds.play();
    }
});

socket.on("_FIN_Star", function (isStarOn) {
    let star = document.querySelector("#FIN_Star img");
    if (isStarOn) {
        FIN_StarAudio.pause();
        FIN_StarAudio.currentTime = 0;
        FIN_StarAudio.play();
        star.src = "./Finish/PlayerStar.gif";
    } else star.src = "";
});

socket.on("_FIN_blockSignal", function (player) {
    document.getElementById("sendSignal").onclick = "";
    FIN_signalAudio.pause();
    FIN_signalAudio.currentTime = 0;
    FIN_signalAudio.play();
    document.getElementById("currentPoint" + player).classList.add("FIN_Granted");
});

function FIN_Signal() {
    offUseSendSignal();
    document.getElementById("sendSignal").onclick = "";
    socket.emit("FIN_blockSignal", playerNumber);
}

socket.on("_FIN_Right", function () {
    FIN_RightAudio.pause();
    FIN_RightAudio.currentTime = 0;
    FIN_RightAudio.play();
});

socket.on("_FIN_Wrong", function () {
    FIN_WrongAudio.pause();
    FIN_WrongAudio.currentTime = 0;
    FIN_WrongAudio.play();
});

socket.on("_FIN_5s", function () {
    for (let i = 1; i <= 4; i++) document.getElementById("currentPoint" + i).classList.remove("FIN_Granted");
    document.getElementById("sendSignal").onclick = FIN_Signal;
    if (playerNumber != FIN_currentPlayer) useSendSignal();
    countDown(5, true);
    FIN_5seconds.pause();
    FIN_5seconds.currentTime = 0;
    FIN_5seconds.play();
});

socket.on("_FIN_finishTurn", function () {
    for (let i = 1; i <= 4; i++) document.getElementById("currentPoint" + i).classList.remove("FIN_Granted");
    FIN_finishTurnAudio.pause();
    FIN_finishTurnAudio.currentTime = 0;
    FIN_finishTurnAudio.play();
    document.getElementById("questionText").textContent = "";
    document.getElementById("FIN_Player").textContent = "";
    document.getElementById("FIN_Pack").textContent = "";
    document.getElementById("FIN_Question").textContent = "";
});

//CÂU HỎI PHỤ
var SFI_Eliminated;
var SFI_Hash = [];

socket.on("_SFI_chosenPlayer", function (chosenPlayer) {
    if (playerNumber == chosenPlayer) SFI_chosenToPlay = true;
});

socket.on("_SFI_startRound", function (playerList) {
    ContestUI();
    defaultPlayerFunction();
    document.getElementById("sendSignal").textContent = "GIÀNH QUYỀN TRẢ LỜI";
    for (let i = 0; i < playerList.length; i++) {
        SFI_Hash[playerList[i] - 1] = i + 1;
        document.getElementById("answerName" + (i + 1)).textContent = allPlayerName[playerList[i] - 1];
    }
    document.getElementById("customStatus").innerHTML += '<div id="OBS_ACC_SFI_Status"></div>';
});

socket.on("_SFI_openQuestion", function (serverData) {
    SFI_Eliminated = false;
    document.getElementById("OBS_ACC_SFI_Status").textContent = "Câu hỏi số " + serverData.openedCount;
    document.getElementById("questionText").textContent = serverData.questionData.question;
    document.getElementById("timeLeft").textContent = 15;
    SFI_timeLeft = 15;
    for (let i = 1; i <= 4; i++) document.getElementById("currentPoint" + i).classList.remove("FIN_Granted");
});

socket.on("_SFI_closeQuestion", function () {
    document.getElementById("questionText").textContent = "";
});

function SFI_sendSignal() {
    offUseSendSignal();
    socket.emit("SFI_blockSignal", playerNumber);
    SFI_Eliminated = true;
}

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
    if (SFI_chosenToPlay && !SFI_Eliminated) {
        document.getElementById("sendSignal").onclick = SFI_sendSignal;
        useSendSignal();
    }
    SFI_startTime = Date.now() / 1000;
    SFI_Timing(SFI_startTime, Number(SFI_timeLeft));
    if (isReset) {
        SFI_mainTime.pause();
        SFI_mainTime.currentTime = 0;
        SFI_mainTime.play();
    } else {
        SFI_mainTime.play();
    }
    for (let i = 1; i <= 4; i++) document.getElementById("currentPoint" + i).classList.remove("FIN_Granted");
});

socket.on("_SFI_Right", function () {
    FIN_RightAudio.pause();
    FIN_RightAudio.currentTime = 0;
    FIN_RightAudio.play();
});

socket.on("_SFI_blockSignal", function (player) {
    clearInterval(downloadTimer);
    SFI_pauseTime = Date.now() / 1000;
    SFI_timeLeft = SFI_timeLeft - (SFI_pauseTime - Number(SFI_startTime));
    SFI_mainTime.pause();
    document.getElementById("currentPoint" + player).classList.add("FIN_Granted");
    offUseSendSignal();
    FIN_signalAudio.pause();
    FIN_signalAudio.currentTime = 0;
    FIN_signalAudio.play();
});

socket.on("_SFI_blockButton", function () {
    offUseSendSignal();
});
