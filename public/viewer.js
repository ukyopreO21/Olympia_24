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

//SOUND NGOÀI
var OUT_introAudio = new Audio();

//Các biến xử lý

var allPlayerName = ["", "", "", ""];
var allPlayerPoint = [0, 0, 0, 0];

var currentRoundID;
var OBS_isOpeningQuestionBox = false;
var OBS_isOpeningRowAnswers = false;
var socket = io();

socket.emit("getVersion");
socket.on("_getVersion", function (appVersion) {
    document.getElementById("currentVersion").textContent = appVersion;
});

socket.emit("getPlayerData");

offContestUI();

//TRẠNG THÁI VÒNG THI

function ContestUI() {
    if (currentRoundID == 1) temp = "Start";
    else if (currentRoundID == 2) temp = "Obstacle";
    else if (currentRoundID == 3) temp = "Acceleration";
    else if (currentRoundID == 4) temp = "Finish";
    else temp = "SubFinish";
    var dad = document.getElementById(temp + "UI");
    var child = dad.querySelectorAll("*");
    for (var i = 0; i < child.length; i++) {
        child[i].style.visibility = "visible";
    }
}

function offContestUI() {
    for (let k = 0; k < 6; k++) {
        if (k == 0) temp = "Start";
        else if (k == 1) temp = "Obstacle";
        else if (k == 2) temp = "Acceleration";
        else if (k == 3) temp = "Finish";
        else if (k == 4) temp = "SubFinish";
        else temp = "Result";
        var dad = document.getElementById(temp + "UI");
        var child = dad.querySelectorAll("*");
        for (var i = 0; i < child.length; i++) {
            child[i].style.visibility = "hidden";
        }
    }
}

function StartUI() {
    var dad = document.getElementById("StartUI");
    var child = dad.querySelectorAll("*");
    for (var i = 0; i < child.length; i++) {
        child[i].style.visibility = "visible";
    }
}

function offStartUI() {
    var dad = document.getElementById("StartUI");
    var child = dad.querySelectorAll("*");
    for (var i = 0; i < child.length; i++) {
        child[i].style.visibility = "hidden";
    }
}

function ObstacleUI() {
    let dad = document.getElementById("OBS_MainUI");
    let child = dad.querySelectorAll("*");
    for (var i = 0; i < child.length; i++) {
        child[i].style.visibility = "visible";
    }
    document.getElementById("OBS_printSignal").style.visibility = "visible";
}

function offObstacleUI() {
    var dad = document.getElementById("OBS_MainUI");
    var child = dad.querySelectorAll("*");
    for (var i = 0; i < child.length; i++) {
        child[i].style.visibility = "hidden";
    }
    document.getElementById("OBS_Shelf").style.visibility = "hidden";

    var dad = document.getElementById("OBS_questionZone");
    dad.style.visibility = "hidden";
    var child = dad.querySelectorAll("*");
    for (var i = 0; i < child.length; i++) {
        child[i].style.visibility = "hidden";
    }
}

function Obstacle_showAnswersUI() {
    var dad = document.getElementById("OBS_Answers");
    var child = dad.querySelectorAll("*");
    for (var i = 0; i < child.length; i++) {
        child[i].style.visibility = "visible";
    }
}

function offObstacle_showAnswersUI() {
    var dad = document.getElementById("OBS_Answers");
    var child = dad.querySelectorAll("*");
    for (var i = 0; i < child.length; i++) {
        child[i].style.visibility = "hidden";
    }

    if (OBS_isOpeningQuestionBox) {
        var dad = document.getElementById("OBS_questionZone");
        dad.style.visibility = "visible";
        var child = dad.querySelectorAll("*");
        for (var i = 0; i < child.length; i++) {
            child[i].style.visibility = "visible";
        }
        document.getElementById("OBS_Shelf").style.visibility = "visible";
    } else {
        var dad = document.getElementById("OBS_questionZone");
        dad.style.visibility = "hidden";
        var child = dad.querySelectorAll("*");
        for (var i = 0; i < child.length; i++) {
            child[i].style.visibility = "hidden";
        }
        document.getElementById("OBS_Shelf").style.visibility = "hidden";
    }
}

function Obstacle_ImageUI() {
    var dad = document.getElementById("OBS_ImageUI");
    var child = dad.querySelectorAll("*");
    for (var i = 0; i < child.length; i++) {
        child[i].style.visibility = "visible";
    }
}

function offObstacle_ImageUI() {
    var dad = document.getElementById("OBS_ImageUI");
    var child = dad.querySelectorAll("*");
    for (var i = 0; i < child.length; i++) {
        child[i].style.visibility = "hidden";
    }
}

function AccelerationUI() {
    document.getElementById("ACC_Shelf").style.visibility = "1";
    var dad = document.getElementById("ACC_questionZone");
    dad.style.visibility = "visible";
    var child = dad.querySelectorAll("*");
    for (var i = 0; i < child.length; i++) {
        child[i].style.visibility = "visible";
    }

    var dad = document.getElementById("ACC_Answers");
    dad.style.visibility = "hidden";
    var child = dad.querySelectorAll("*");
    for (var i = 0; i < child.length; i++) {
        child[i].style.visibility = "hidden";
    }
}

function Acceleration_showAnswerUI() {
    document.getElementById("ACC_Shelf").style.visibility = "hidden";
    var dad = document.getElementById("ACC_questionZone");
    dad.style.visibility = "hidden";
    var child = dad.querySelectorAll("*");
    for (var i = 0; i < child.length; i++) {
        child[i].style.visibility = "hidden";
    }

    var dad = document.getElementById("ACC_Answers");
    dad.style.visibility = "visible";
    var child = dad.querySelectorAll("*");
    for (var i = 0; i < child.length; i++) {
        child[i].style.visibility = "visible";
    }
}

function Acceleration_offQuestion() {
    var dad = document.getElementById("ACC_questionZone");
    var child = dad.querySelectorAll("*");
    for (var i = 0; i < child.length; i++) {
        child[i].style.visibility = "hidden";
    }
}

function Acceleration_openQuestion() {
    var dad = document.getElementById("ACC_questionZone");
    var child = dad.querySelectorAll("*");
    for (var i = 0; i < child.length; i++) {
        child[i].style.visibility = "visible";
    }
}

function offAccelerationUI() {
    var dad = document.getElementById("ACC_questionZone");
    dad.style.visibility = "hidden";
    var child = dad.querySelectorAll("*");
    for (var i = 0; i < child.length; i++) {
        child[i].style.visibility = "hidden";
    }

    var dad = document.getElementById("ACC_showAnswerAnimation");
    dad.style.visibility = "hidden";
    var child = dad.querySelectorAll("*");
    for (var i = 0; i < child.length; i++) {
        child[i].style.visibility = "hidden";
    }
}

function FinishUI() {
    //bật khu câu hỏi
    document.getElementById("FIN_Shelf").style.visibility = "visible";
    var dad = document.getElementById("FIN_MainUI");
    dad.style.visibility = "visible";
    var child = dad.querySelectorAll("*");
    for (var i = 0; i < child.length; i++) {
        child[i].style.visibility = "visible";
    }
    //media
    document.getElementById("FIN_Image").style.visibility = "visible";
    document.getElementById("FIN_Video").style.visibility = "visible";
}

function SubFinishUI() {
    document.getElementById("start").style.visibility = "hidden";
    document.getElementById("SubFinishUI").style.visibility = "visible";
    document.getElementById("SFI_Shelf").style.visibility = "visible";
    document.getElementById("SFI_roundName").style.visibility = "visible";
    document.getElementById("SFI_questionBox").style.visibility = "visible";
    document.getElementById("SFI_Question").style.visibility = "visible";
    document.getElementById("SFI_Circle").style.visibility = "visible";
    document.getElementById("SFI_Line").style.visibility = "visible";
}

function offFinishUI() {
    //tắt giao diện chọn gói
    var dad = document.getElementById("FIN_packAnimation");
    dad.style.visibility = "hidden";
    var child = dad.querySelectorAll("*");
    for (var i = 0; i < child.length; i++) {
        child[i].style.visibility = "hidden";
    }

    //tắt khu câu hỏi
    document.getElementById("FIN_Shelf").style.visibility = "hidden";
    var dad = document.getElementById("FIN_MainUI");
    dad.style.visibility = "hidden";
    var child = dad.querySelectorAll("*");
    for (var i = 0; i < child.length; i++) {
        child[i].style.visibility = "hidden";
    }

    document.getElementById("FIN_Image").style.visibility = "hidden";
    document.getElementById("FIN_Video").style.visibility = "hidden";
}

function offResultUI() {
    var dad = document.getElementById("ResultUI");
    var child = dad.querySelectorAll("*");
    for (var i = 0; i < child.length; i++) {
        child[i].style.visibility = "hidden";
    }
}

function ResultUI() {
    var dad = document.getElementById("ResultUI");
    var child = dad.querySelectorAll("*");
    for (var i = 0; i < child.length; i++) {
        child[i].style.visibility = "visible";
    }
}

//Giao diện phòng chơi

//Xử lý chuẩn bị
document.getElementById("intro").style.visibility = "hidden";
document.getElementById("start").style.visibility = "hidden";

socket.on("serverRestarted", function () {
    window.location.reload();
});

//RESET TRẠNG THÁI VÒNG THI
socket.on("_resetStatus", function (roundID) {
    if (roundID == 2) {
    } else if (roundID == 5) {
    } else if (roundID == 6) {
    }
});

//XỬ LÝ TRUYỀN ĐIỂM
socket.on("_sendAdminData", function (adminData) {
    for (let i = 1; i <= 4; i++) {
        allPlayerName[i - 1] = adminData.currentPlayerName[i - 1];
        allPlayerPoint[i - 1] = adminData.currentPlayerPoint[i - 1];
    }
    STR_printPlayerData();
    FIN_printPlayerData();
    SFI_printPlayerData();
    document.getElementById("FIN_currentPoint").textContent = allPlayerPoint[Number(FIN_currentPlayer) - 1];
});

//Xử lý TRONG PHẦN THI
socket.on("_blankSound", () => {
    let blankSound = new Audio("./Others/Sounds/blank.mp3");
    blankSound.play();
});

socket.on("_RoundChosen", function (roundID) {
    currentRoundID = roundID;
});

socket.on("_playIntro", function (roundID) {
    currentRoundID = roundID;
    document.getElementById("intro").style.visibility = "visible";
    let intro = document.getElementById("intro");
    intro.onended = function () {
        document.getElementById("intro").style.visibility = "hidden";
        document.getElementById("start").style.visibility = "visible";
    };
    if (roundID == "1") {
        intro.src = "./Start/Start.mp4";
        start.src = "./Start/Start.png";
        document.getElementById("StartUI").style.visibility = "visible";
        document.getElementById("ObstacleUI").style.visibility = "hidden";
        document.getElementById("AccelerationUI").style.visibility = "hidden";
        document.getElementById("FinishUI").style.visibility = "hidden";
        document.getElementById("SubFinishUI").style.visibility = "hidden";
    } else if (roundID == "2") {
        intro.src = "./Obstacle/Obstacle.mp4";
        start.src = "./Obstacle/Obstacle.png";
        document.getElementById("StartUI").style.visibility = "hidden";
        document.getElementById("ObstacleUI").style.visibility = "visible";
        document.getElementById("AccelerationUI").style.visibility = "hidden";
        document.getElementById("FinishUI").style.visibility = "hidden";
        document.getElementById("SubFinishUI").style.visibility = "hidden";
    } else if (roundID == "3") {
        intro.src = "./Acceleration/Acceleration.mp4";
        start.src = "./Acceleration/Acceleration.png";
        document.getElementById("StartUI").style.visibility = "hidden";
        document.getElementById("ObstacleUI").style.visibility = "hidden";
        document.getElementById("AccelerationUI").style.visibility = "visible";
        document.getElementById("FinishUI").style.visibility = "hidden";
        document.getElementById("SubFinishUI").style.visibility = "hidden";
    } else if (roundID == "4") {
        intro.src = "./Finish/Finish.mp4";
        start.src = "./Finish/Finish.png";
        document.getElementById("StartUI").style.visibility = "hidden";
        document.getElementById("ObstacleUI").style.visibility = "hidden";
        document.getElementById("AccelerationUI").style.visibility = "hidden";
        document.getElementById("FinishUI").style.visibility = "visible";
        document.getElementById("SubFinishUI").style.visibility = "hidden";
    } else if (roundID == "5") {
        document.getElementById("StartUI").style.visibility = "hidden";
        document.getElementById("ObstacleUI").style.visibility = "hidden";
        document.getElementById("AccelerationUI").style.visibility = "hidden";
        document.getElementById("FinishUI").style.visibility = "hidden";
        document.getElementById("SubFinishUI").style.visibility = "visible";
    }
    intro.play();
});

socket.on("_startRound", function () {
    document.getElementById("intro").style.visibility = "hidden";
    document.getElementById("start").style.visibility = "hidden";
    if (currentRoundID == "1") {
        startRoundAudio.src = "./Start/Sounds/KDBatDauVongThi.mp3";
    } else if (currentRoundID == "2") {
        startRoundAudio.src = "./Obstacle/Sounds/VCNVBatDauVongThi.mp3";
    } else if (currentRoundID == "3") {
        startRoundAudio.src = "./Acceleration/Sounds/TTBatDauVongThi.mp3";
    } else if (currentRoundID == "4") {
        startRoundAudio.src = "./Finish/Sounds/VDBatDauVongThi.mp3";
    }
    startRoundAudio.pause();
    startRoundAudio.currentTime = 0;
    startRoundAudio.play();
});

var downloadTimer;

function getMediaType(mediaUrl) {
    if (mediaUrl) {
        let extension = mediaUrl.split(".").pop().toLowerCase();
        if (extension === "jpg" || extension === "jpeg" || extension === "png" || extension === "gif") return "image";
        else if (extension === "mp4" || extension === "avi" || extension === "mov" || extension === "wmv") return "video";
        else if (extension === "mp3" || extension === "wav" || extension === "ogg") return "audio";
    }
    return "unknown";
}

socket.on("_playMedia", (mediaUrl) => {
    let mediaType = getMediaType(mediaUrl);
    if (mediaType == "audio") {
        questionAudio.pause();
        questionAudio.src = mediaUrl;
        questionAudio.currentTime = 0;
        questionAudio.play();
    } else if (mediaType == "video") {
        let media = document.getElementById("FIN_Video");
        media.src = mediaUrl;
        if (media) {
            media.play();
            media.onended = () => {
                document.getElementById("FIN_Video").src = "";
            };
        }
    }
});

socket.on("_closeMedia", () => {
    questionAudio.pause();
    let media = document.getElementById("FIN_Video");
    if (media) {
        media.pause();
        document.getElementById("FIN_Video").src = "";
    }
});

//TÍN HIỆU PHẦN KĐ
var STR_currentPlayer;
var STR_ithQuestion;
var STR_signalPlayer;

socket.on("_STR_choosePlayer", function (ithStart) {
    STR_removeAllGranted();
    STR_currentPlayer = Number(ithStart);
    if (STR_currentPlayer != 5) document.getElementById("STR_Player" + STR_currentPlayer).classList.add("STR_Granted");
});

socket.on("_STR_startPlayerTurn", function () {
    STR_ithQuestion = 0;
    STR_startTurn.pause();
    STR_startTurn.currentTime = 0;
    STR_startTurn.play();
});

function STR_printPlayerData() {
    for (let i = 0; i < 4; i++) {
        document.getElementById("STR_Name" + (i + 1)).textContent = i + 1 + ". " + allPlayerName[i];
        document.getElementById("STR_Point" + (i + 1)).textContent = allPlayerPoint[i];
    }
}

socket.on("_STR_openQuestionBoard", function () {
    StartUI();
    STR_printPlayerData();
    STR_openQuestionBoard.pause();
    STR_openQuestionBoard.currentTime = 0;
    STR_openQuestionBoard.play();
    document.getElementById("StartUI").style.visibility = "visible";
    let questionBox = document.getElementById("STR_questionBox");
    questionBox.classList.remove("STR_moveBoard");
    void questionBox.offsetWidth;
    let shelf = document.getElementById("STR_Shelf");
    shelf.classList.remove("STR_moveQuestionShelf");
    void shelf.offsetWidth;
    let status = document.getElementById("STR_statusZone");
    status.classList.remove("STR_moveStatus");
    void status.offsetWidth;
    let players = document.querySelectorAll(".STR_Player");
    for (let i = 0; i < players.length; i++) {
        players[i].classList.remove("STR_movePlayer");
        players[i].offsetWidth;
        players[i].classList.add("STR_movePlayer");
        document.getElementById(players[i].id).style.animationDelay = (i + 1) * 250 + "ms";
    }
    questionBox.classList.add("STR_moveBoard");
    shelf.classList.add("STR_moveQuestionShelf");
    status.classList.add("STR_moveStatus");
});

function STR_removeAllGranted() {
    for (let i = 1; i <= 4; i++) {
        document.getElementById("STR_Player" + i).classList.remove("STR_Granted");
    }
}

function STR_printNextQuestion(question) {
    document.getElementById("STR_Image").innerHTML = "";
    questionAudio.pause();
    if (getMediaType(question.media) == "image") document.getElementById("STR_Image").innerHTML += "<img src='" + question.media + "'>";
    document.getElementById("STR_Question").textContent = question.question;
    if (STR_currentPlayer == 5) STR_removeAllGranted();
}

function STR_printPassStatus() {
    if (STR_currentPlayer != 5) document.getElementById("STR_Status").textContent = "Câu " + STR_ithQuestion + "/6";
    else document.getElementById("STR_Status").textContent = "Câu " + STR_ithQuestion + "/12";
}

socket.on("_STR_startTurn", function (question) {
    STR_ithQuestion++;
    STR_printNextQuestion(question);
    STR_printPassStatus();
    STR_mainTime.src = "./Start/Sounds/KDLoop1.mp3";
    STR_mainTime.play();
});

function STR_countDown(time) {
    clearInterval(downloadTimer);
    document.getElementById("STR_Time").textContent = time;
    let timeLeft = time - 1;
    downloadTimer = setInterval(function () {
        document.getElementById("STR_Time").textContent = timeLeft;
        if (timeLeft <= 0) {
            clearInterval(downloadTimer);
        }
        timeLeft -= 1;
    }, 1000);
}

socket.on("_STR_Timing", function (time) {
    if (STR_currentPlayer != 5 && STR_ithQuestion == 6 && time == 5) {
        STR_mainTime.src = "./Start/Sounds/KDLoop4.mp3";
        STR_mainTime.play();
    } else if (STR_currentPlayer == 5 && STR_ithQuestion == 12 && time == 5) {
        STR_mainTime.src = "./Start/Sounds/KDLoop4.mp3";
        STR_mainTime.play();
        if (!STR_signalPlayer) return;
    }
    STR_countDown(time);
});

socket.on("_STR_blockSignal", function (player) {
    FIN_signalAudio.pause();
    FIN_signalAudio.currentTime = 0;
    FIN_signalAudio.play();
    document.getElementById("STR_Player" + player).classList.add("STR_Granted");
    STR_signalPlayer = player;
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
    if (STR_currentPlayer == 5) STR_removeAllGranted();
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
    document.getElementById("STR_Time").textContent = "";
});

socket.on("_STR_finishTurn", function () {
    document.getElementById("STR_Image").innerHTML = "";
    document.getElementById("STR_Time").textContent = "";
    STR_removeAllGranted();
    offStartUI();
    STR_mainTime.pause();
    document.getElementById("STR_Question").textContent = "";
    document.getElementById("STR_Status").textContent = "";
    STR_finishTurn.pause();
    STR_finishTurn.currentTime = 0;
    STR_finishTurn.play();
    document.getElementById("StartUI").style.visibility = "hidden";
});

socket.on("_OBS_showNumberOfCharacter", function () {
    OBS_numberOfCharacter.pause();
    OBS_numberOfCharacter.currentTime = 0;
    OBS_numberOfCharacter.play();
});

socket.on("_OBS_showRows", function (OBS_Data) {
    OBS_showRowsAudio.pause();
    OBS_showRowsAudio.currentTime = 0;
    OBS_showRowsAudio.play();
    document.getElementById("OBS_Image").src = OBS_Data.media;
    socket.emit("OBS_getRowsLength");
    for (let i = 1; i <= 5; i++) document.getElementById("OBS_Q" + i).style.opacity = 1;
});

socket.on("_OBS_getRowsLength", function (data) {
    for (let i = 0; i < 4; i++) {
        for (let j = data[i].startPos; j < data[i].startPos + data[i].rowLength; j++) {
            document.getElementById("OBS_Char" + (i + 1) + "." + j).style.opacity = 1;
        }
    }
    ObstacleUI();
});

socket.on("_OBS_chooseRow", function (data) {
    OBS_chosenRow.pause();
    OBS_chosenRow.currentTime = 0;
    OBS_chosenRow.play();

    let elements = document.getElementsByClassName("OBS_Char");
    for (let i = 0; i < elements.length; i++) {
        elements[i].classList.remove("OBS_Chosen");
    }

    if (data.rowIth != 5) {
        for (let j = data.OBS_QnA[Number(data.rowIth - 1)].startPos; j < data.OBS_QnA[Number(data.rowIth - 1)].startPos + data.OBS_QnA[Number(data.rowIth - 1)].rowLength; j++) {
            setTimeout(function () {
                let ele = document.getElementById("OBS_Char" + data.rowIth + "." + j);
                ele.classList.remove("OBS_Chosen");
                void ele.offsetWidth;
                ele.classList.add("OBS_Chosen");
            }, (j - data.OBS_QnA[Number(data.rowIth - 1)].startPos) * 50);
        }
    }
});

socket.on("_OBS_showRowQuestion", function (questionIth) {
    OBS_isOpeningQuestionBox = true;
    OBS_questionShow.pause();
    OBS_questionShow.currentTime = 0;
    OBS_questionShow.play();
    document.getElementById("OBS_Shelf").style.visibility = "visible";

    document.getElementById("OBS_Shelf").classList.remove("OBS_moveShelf");
    document.getElementById("OBS_questionZone").classList.remove("OBS_moveQuestionBox");
    var shelf = document.getElementById("OBS_Shelf");
    var ques = document.getElementById("OBS_questionZone");
    void shelf.offsetWidth;
    void ques.offsetWidth;
    document.getElementById("OBS_Shelf").classList.add("OBS_moveShelf");
    document.getElementById("OBS_questionZone").classList.add("OBS_moveQuestionBox");

    let dad = document.getElementById("OBS_questionZone");
    dad.style.visibility = "visible";
    let child = dad.querySelectorAll("*");
    for (var i = 0; i < child.length; i++) {
        child[i].style.visibility = "visible";
    }
    document.getElementById("OBS_Question").innerHTML = questionIth.question;
});

socket.on("_OBS_closeRowQuestion", function () {
    OBS_isOpeningQuestionBox = false;
    let dad = document.getElementById("OBS_questionZone");
    dad.style.visibility = "hidden";
    let child = dad.querySelectorAll("*");
    for (var i = 0; i < child.length; i++) {
        child[i].style.visibility = "hidden";
    }
    document.getElementById("OBS_Shelf").style.visibility = "hidden";
});

function OBS_mainObsTime() {
    OBS_playObsTime.pause();
    OBS_playObsTime.currentTime = 0;
    OBS_playObsTime.play();
}

socket.on("_OBS_start15s", function () {
    //audio
    OBS_mainObsTime();

    //animation
    document.getElementById("OBS_Circle").classList.remove("OBS_circleMove");
    document.getElementById("OBS_Line").classList.remove("OBS_lineMove");
    var circle = document.getElementById("OBS_Circle");
    void circle.offsetWidth;
    var line = document.getElementById("OBS_Line");
    void line.offsetWidth;
    document.getElementById("OBS_Circle").classList.add("OBS_circleMove");
    document.getElementById("OBS_Line").classList.add("OBS_lineMove");
});

socket.on("_OBS_serverObsSignal", function (signalData) {
    OBS_obsSignalAudio.pause();
    OBS_obsSignalAudio.currentTime = 0;
    OBS_obsSignalAudio.play();

    var dad = document.getElementById("OBS_printSignal");
    dad.innerHTML += '<div class="OBS_Signal" id="OBS_Signal' + signalData.OBS_numberOfObsSignal + '"></div>';
    document.getElementById("OBS_Signal" + signalData.OBS_numberOfObsSignal).style.left = "calc(" + (Number(signalData.OBS_numberOfObsSignal) - 1) * 21 + "%)";
    document.getElementById("OBS_Signal" + signalData.OBS_numberOfObsSignal).textContent = signalData.OBS_numberOfObsSignal + ". " + signalData.signalDataFromAdmin.name;
});

socket.on("_OBS_AnswerUI", function () {
    offObstacleUI();
    Obstacle_showAnswersUI();
    offObstacle_ImageUI();
});

socket.on("_OBS_showRowAnswer", function (rowAnswerData) {
    offObstacleUI();
    Obstacle_showAnswersUI();
    offObstacle_ImageUI();
    OBS_isOpeningRowAnswers = true;
    document.querySelectorAll(".OBS_Player").forEach((element) => {
        element.style.opacity = "1";
    });
    OBS_showRowAnswerAudio.pause();
    OBS_showRowAnswerAudio.currentTime = 0;
    OBS_showRowAnswerAudio.play();
    document.getElementById("OBS_outerLine").classList.remove("OBS_extendOuter");
    void document.getElementById("OBS_outerLine").offsetWidth;
    document.getElementById("OBS_outerLine").classList.add("OBS_extendOuter");
    for (let i = 0; i < 4; i++) {
        document.getElementById("OBS_Pinner" + (i + 1)).classList.remove("OBS_movePinner" + (i + 1));
        void document.getElementById("OBS_Pinner" + (i + 1)).offsetWidth;
        document.getElementById("OBS_Pinner" + (i + 1)).classList.add("OBS_movePinner" + (i + 1));
        document.getElementById("OBS_Player" + (i + 1)).classList.remove("OBS_showAnswer" + (i + 1));
        void document.getElementById("OBS_Player" + (i + 1)).offsetWidth;
        document.getElementById("OBS_Player" + (i + 1)).classList.add("OBS_showAnswer" + (i + 1));
        document.querySelector("#OBS_Player" + (i + 1) + " .OBS_Name").textContent = rowAnswerData.name[i];
        document.querySelector("#OBS_Player" + (i + 1) + " .OBS_answerText").textContent = rowAnswerData.answer[i];
    }
});

socket.on("_OBS_backScreen", function () {
    OBS_isOpeningRowAnswers = false;
    offObstacle_showAnswersUI();
    offObstacle_ImageUI();
    ObstacleUI();
});

socket.on("_OBS_wrongRow", function (numberOfWrongPlayer) {
    document.getElementById("OBS_Player" + numberOfWrongPlayer).style.opacity = "0.5";
});

socket.on("_OBS_playRightRow", function (data) {
    OBS_isOpeningQuestionBox = false;
    OBS_rightRowAudio.pause();
    OBS_rightRowAudio.currentTime = 0;
    OBS_rightRowAudio.play();
    let currentRowAnswer = String(data.questionData.answer).replace(/\s+/g, "");
    for (let j = data.questionData.startPos; j < data.questionData.startPos + data.questionData.rowLength; j++) {
        document.getElementById("OBS_Char" + data.currentRow + "." + j).textContent = currentRowAnswer[j - data.questionData.startPos];
        document.getElementById("OBS_Char" + data.currentRow + "." + j).style.backgroundImage = "linear-gradient(to right bottom, #2b8ba6, #0083b0, #007ab9, #006ec0, #0060c1)";
    }
});

function OBS_wrongAudioPlay() {
    OBS_wrongAudio.pause();
    OBS_wrongAudio.currentTime = 0;
    OBS_wrongAudio.play();
}

socket.on("_OBS_playWrongRow", function (currentRow) {
    OBS_isOpeningQuestionBox = false;
    OBS_wrongAudioPlay();
    for (let i = 1; i <= 18; i++) {
        document.getElementById("OBS_Char" + currentRow + "." + i).style.backgroundImage = "linear-gradient(to right bottom, #000000, #1b1b1b, #2e2e2e, #444444, #5a5a5a)";
    }
});

socket.on("_OBS_ImageUI", function () {
    offObstacleUI();
    offObstacle_showAnswersUI();
    Obstacle_ImageUI();
});

socket.on("_OBS_openCorner", function (currentRow) {
    offObstacleUI();
    offObstacle_showAnswersUI();
    Obstacle_ImageUI();
    OBS_openCornerAudio.pause();
    OBS_openCornerAudio.currentTime = 0;
    OBS_openCornerAudio.play();
    document.getElementById("OBS_Q" + currentRow).style.opacity = 0;
});

function OBS_showObstacle(obsData) {
    document.getElementById("OBS_Q5").style.opacity = 0;
    for (let i = 1; i <= 4; i++) {
        document.getElementById("OBS_Q" + i).style.opacity = 0;
        for (let j = obsData.OBS_QnA[i - 1].startPos; j < obsData.OBS_QnA[i - 1].startPos + obsData.OBS_QnA[i - 1].rowLength; j++) {
            let currentRowAnswer = String(obsData.OBS_QnA[i - 1].answer).replace(/\s+/g, "");
            document.getElementById("OBS_Char" + i + "." + j).textContent = currentRowAnswer[j - obsData.OBS_QnA[i - 1].startPos];
            document.getElementById("OBS_Char" + i + "." + j).style.backgroundImage = "linear-gradient(to right bottom, #2b8ba6, #0083b0, #007ab9, #006ec0, #0060c1)";
        }
    }
}

socket.on("_OBS_rightObs", function (obsData) {
    OBS_rightObsAudio.pause();
    OBS_rightObsAudio.currentTime = 0;
    OBS_rightObsAudio.play();
    OBS_showObstacle(obsData);
});

socket.on("OBS_keepRightObs", function (value) {
    document.getElementById("OBS_Signal" + value).style.opacity = "1";
    for (let i = 1; i <= 4; i++) {
        if (i != Number(value) && document.getElementById("OBS_Signal" + i)) document.getElementById("OBS_Signal" + i).style.opacity = "0.5";
    }
});

socket.on("_OBS_wrongObs", function () {
    OBS_wrongAudioPlay();
    document.getElementById("OBS_printSignal").innerHTML = "";
});

socket.on("_OBS_last15s", function () {
    OBS_mainObsTime();
});

socket.on("_OBS_showObs", function (obsData) {
    OBS_showObstacle(obsData);
    document.getElementById("OBS_printSignal").innerHTML = "";
});

//TĂNG TỐC
socket.on("_ACC_chooseQuestion", function () {
    Acceleration_openQuestion();
    document.getElementById("ACC_questionZone").addEventListener("animationend", function (event) {
        if (event.animationName === "ACC_moveMainUI") {
            document.getElementById("ACC_questionZone").classList.remove("ACC_showBoard");
            void document.getElementById("ACC_questionZone").offsetHeight;
            document.getElementById("ACC_questionZone").classList.add("ACC_showBoard");
        }
    });
    document.getElementById("ACC_questionZone").addEventListener("animationend", function (event) {
        if (event.animationName === "ACC_showBoard") {
            document.getElementById("ACC_questionBar").classList.remove("ACC_showQuestionBar");
            void document.getElementById("ACC_questionBar").offsetHeight;
            document.getElementById("ACC_questionBar").classList.add("ACC_showQuestionBar");
        }
    });
    //chạy animation
    document.getElementById("ACC_questionZone").classList.remove("ACC_moveMainUI");
    document.getElementById("ACC_questionZone").classList.remove("ACC_showBoard");
    document.getElementById("ACC_questionBar").classList.remove("ACC_showQuestionBar");
    void document.getElementById("ACC_questionZone").offsetHeight;
    void document.getElementById("ACC_questionBar").offsetHeight;
    document.getElementById("ACC_questionZone").classList.add("ACC_moveMainUI");

    ACC_openQuestion.pause();
    ACC_openQuestion.currentTime = 0;
    ACC_openQuestion.play();
    AccelerationUI();
});

socket.on("_ACC_openQuestion", function (ACC_questionData) {
    document.getElementById("ACC_videoMedia").style.visibility = "hidden";
    document.getElementById("ACC_Question").textContent = ACC_questionData.question;
    if (ACC_questionData.type == "Video") {
        document.getElementById("ACC_imageMedia").style.display = "none";
        document.getElementById("ACC_videoMedia").style.display = "block";
        document.getElementById("ACC_imageMedia").src = "";
        document.getElementById("ACC_videoMedia").src = ACC_questionData.source;
    } else {
        document.getElementById("ACC_videoMedia").style.display = "none";
        document.getElementById("ACC_imageMedia").style.display = "block";
        document.getElementById("ACC_videoMedia").src = "";
        document.getElementById("ACC_imageMedia").src = ACC_questionData.source;
    }
});

function ACC_timing(time) {
    document.getElementById("ACC_videoMedia").style.visibility = "visible";
    if (ACC_videoMedia) ACC_videoMedia.play();
    ACC_mainTime.pause();
    ACC_mainTime.src = "./Acceleration/Sounds/TT" + time + "s.mp3";
    ACC_mainTime.currentTime = 0;
    ACC_mainTime.play();
}

function ACC_removeAllTimingAnimation() {
    for (let i = 10; i <= 40; i += 10) {
        document.getElementById("ACC_Line").classList.remove("ACC_moveLine" + i);
        document.getElementById("ACC_Circle").classList.remove("ACC_moveCircle" + i);
    }
}

socket.on("_ACC_startTiming", function (timeData) {
    ACC_timing(timeData.ithQuestion * 10);
    ACC_removeAllTimingAnimation();
    var circle = document.getElementById("ACC_Circle");
    void circle.offsetWidth;
    var line = document.getElementById("ACC_Line");
    void line.offsetWidth;
    document.getElementById("ACC_Circle").classList.add("ACC_moveCircle" + timeData.ithQuestion * 10);
    document.getElementById("ACC_Line").classList.add("ACC_moveLine" + timeData.ithQuestion * 10);
});

socket.on("_ACC_showAnswer", function (answerData) {
    Acceleration_showAnswerUI();
    ACC_showAnswersAudio.pause();
    ACC_showAnswersAudio.currentTime = 0;
    ACC_showAnswersAudio.play();
    document.getElementById("ACC_outerLine").classList.remove("ACC_extendOuter");
    void document.getElementById("ACC_outerLine").offsetWidth;
    document.getElementById("ACC_outerLine").classList.add("ACC_extendOuter");
    for (let i = 1; i <= 4; i++) {
        document.getElementById("ACC_Player" + i).style.opacity = "1";
        document.querySelector("#ACC_Player" + i + " .ACC_Name").textContent = answerData[i - 1].name;
        let time = String(answerData[i - 1].time);
        if (time[time.length - 2] == ".") time += "0";
        document.querySelector("#ACC_Player" + i + " .ACC_timeText").textContent = time;
        document.querySelector("#ACC_Player" + i + " .ACC_answerText").textContent = answerData[i - 1].answer;

        let player = document.getElementById("ACC_Player" + i);
        document.getElementById("ACC_Pinner" + i).classList.remove("ACC_movePinner" + i);
        void document.getElementById("ACC_Pinner" + i).offsetWidth;
        document.getElementById("ACC_Pinner" + i).classList.add("ACC_movePinner" + i);
        player.classList.remove("ACC_showAnswer" + i);
        void player.offsetWidth;
        player.classList.add("ACC_showAnswer" + i);
        player.querySelector(".ACC_Time").classList.remove("ACC_moveTime" + i);
        void player.querySelector(".ACC_Time").offsetWidth;
        player.querySelector(".ACC_Time").classList.add("ACC_moveTime" + i);
    }
});

socket.on("_ACC_showQuestionAnswer", function (ACC_Data) {
    if (ACC_Data.type == "Image") {
        document.getElementById("ACC_imageMedia").src = ACC_Data.answerImage;
    }
});

socket.on("_ACC_Right", function (answerData) {
    ACC_RightAudio.pause();
    ACC_RightAudio.currentTime = 0;
    ACC_RightAudio.play();
    for (let i = 0; i < 4; i++) {
        if (answerData[i].checked == false) {
            document.getElementById("ACC_Player" + (i + 1)).style.opacity = "0.5";
        }
    }
});

socket.on("_ACC_Wrong", function () {
    ACC_WrongAudio.pause();
    ACC_WrongAudio.currentTime = 0;
    ACC_WrongAudio.play();
    for (let i = 0; i < 4; i++) {
        document.getElementById("ACC_Player" + (i + 1)).style.opacity = "0.5";
    }
});

socket.on("_ACC_turnOffQuestion", function () {
    document.getElementById("ACC_Question").textContent = "";
    document.getElementById("ACC_videoMedia").src = "";
    document.getElementById("ACC_imageMedia").src = "";
    Acceleration_offQuestion();
});

socket.on("_ACC_questionScreen", function () {
    AccelerationUI();
});

socket.on("_ACC_answerScreen", function () {
    Acceleration_showAnswerUI();
});

//VỀ ĐÍCH
var FIN_currentPlayer;

socket.on("_FIN_choosePlayer", function (player) {
    offFinishUI();
    for (let i = 1; i <= 4; i++) {
        document.getElementById("FIN_Point" + i).classList.remove("FIN_differentPoint");
        document.getElementById("FIN_Point" + i).classList.remove("FIN_Granted");
    }
    FIN_startTurnAudio.pause();
    FIN_startTurnAudio.currentTime = 0;
    FIN_startTurnAudio.play();
    FIN_currentPlayer = player;
});

socket.on("_FIN_Choose", function (chooseData) {
    var FIN_questionChooseAudio = new Audio("./Finish/Sounds/VDTickCauHoi.mp3");
    FIN_questionChooseAudio.play();
    for (let i = 20; i <= 30; i += 10) {
        document.getElementById("FIN_" + chooseData.ithQuestion + "." + i).innerHTML = "";
    }
    var addCheck = document.getElementById("FIN_" + chooseData.ithQuestion + "." + chooseData.ithPoint);
    addCheck.innerHTML += '<img src="./Others/Check.png" width="100%" height="100%" class="FIN_Checked"></img>';
});

socket.on("_FIN_showQuestionPack", function () {
    FIN_showQuestionPackAudio.pause();
    FIN_showQuestionPackAudio.currentTime = 0;
    FIN_showQuestionPackAudio.play();

    document.getElementById("FIN_packShelf").classList.remove("FIN_hideShelf");
    for (let i = 2; i <= 3; i++) {
        for (let j = 1; j <= 3; j++) {
            var tempId = "FIN_" + j + "." + 10 * i;
            document.getElementById(tempId).classList.remove("FIN_hidePick" + 10 * i + j);
        }
        document.getElementById("FIN_Pack" + 10 * i).classList.remove("FIN_hidePack" + 10 * i);
    }

    for (let i = 1; i <= 3; i++) {
        for (let j = 20; j <= 30; j += 10) {
            document.getElementById("FIN_" + i + "." + j).innerHTML = "";
            document.getElementById("FIN_" + i + "." + j).classList.remove("FIN_pickedQuestion");
        }
    }

    document.getElementById("FIN_packAnimation").style.visibility = "visible";
    var dad = document.getElementById("FIN_packAnimation");
    dad.style.visibility = "visible";
    var child = dad.querySelectorAll("*");
    for (var i = 0; i < child.length; i++) {
        child[i].style.visibility = "visible";
    }

    document.getElementById("FIN_packShelf").classList.remove("FIN_moveShelf");
    var shelf = document.getElementById("FIN_packShelf");
    void shelf.offsetWidth;
    document.getElementById("FIN_packShelf").classList.add("FIN_moveShelf");

    for (let i = 2; i <= 3; i++) {
        document.getElementById("FIN_Pack" + 10 * i).classList.remove("FIN_movePack" + 10 * i);
        var pack = document.getElementById("FIN_Pack" + 10 * i);
        void pack.offsetWidth;
        document.getElementById("FIN_Pack" + 10 * i).classList.add("FIN_movePack" + 10 * i);

        for (let j = 1; j <= 3; j++) {
            var tempId = "FIN_" + j + "." + 10 * i;
            document.getElementById(tempId).classList.remove("FIN_showPick" + 10 * i + j);
            var pick = document.getElementById(tempId);
            void pick.offsetWidth;
            document.getElementById(tempId).classList.add("FIN_showPick" + 10 * i + j);
        }
    }
});

function FIN_printPlayerData() {
    for (let i = 0; i < 4; i++) {
        playerName = allPlayerName[i];
        playerPoint = allPlayerPoint[i];
        if (i + 1 != Number(FIN_currentPlayer)) document.getElementById("FIN_Data" + (i + 1)).textContent = playerName + " (" + playerPoint + ")";
        else document.getElementById("FIN_Data" + (i + 1)).textContent = playerName;
    }
    if (FIN_currentPlayer) document.getElementById("FIN_currentPoint").innerHTML = allPlayerPoint[Number(FIN_currentPlayer) - 1];
}

socket.on("_FIN_packChosen", function (list) {
    let countAnimation = 0;
    document.getElementById("FIN_Question").textContent = "";
    FinishUI();
    FIN_packChosen.pause();
    FIN_packChosen.currentTime = 0;
    FIN_packChosen.play();

    document.getElementById("FIN_packShelf").classList.remove("FIN_hideShelf");
    var shelf = document.getElementById("FIN_packShelf");
    void shelf.offsetWidth;
    document.getElementById("FIN_packShelf").classList.add("FIN_hideShelf");
    for (let i = 1; i <= 3; i++) {
        var tempId = "FIN_" + i + "." + list[i - 1];
        document.getElementById(tempId).classList.add("FIN_pickedQuestion");
        for (let j = 1; j <= 3; j++) {
            var tempId = "FIN_" + j + "." + 10 * i;
            if (i != 1) {
                document.getElementById(tempId).classList.remove("FIN_hidePick" + 10 * i + j);
                var pick = document.getElementById(tempId);
                void pick.offsetWidth;
                document.getElementById(tempId).classList.add("FIN_hidePick" + 10 * i + j);
                document.getElementById("FIN_Pack" + 10 * i).classList.remove("FIN_hidePack" + 10 * i);
                var pack = document.getElementById("FIN_Pack" + 10 * i);
                void pack.offsetWidth;
                document.getElementById("FIN_Pack" + 10 * i).classList.add("FIN_hidePack" + 10 * i);
            }
        }
    }
    for (let i = 1; i <= 3; i++) {
        document.getElementById("FIN_" + i).innerHTML = list[i - 1];
        document.getElementById("FIN_" + i).classList.remove("FIN_chosenQuestion");
    }

    document.getElementById("FIN_Shelf").classList.remove("FIN_moveQuestionShelf");
    var shelf = document.getElementById("FIN_Shelf");
    void shelf.offsetWidth;
    document.getElementById("FIN_Shelf").classList.add("FIN_moveQuestionShelf");

    document.getElementById("FIN_Point" + FIN_currentPlayer).classList.remove("FIN_differentPoint");
    document.getElementById("FIN_questionBox").classList.remove("FIN_questionBoxMove");
    document.getElementById("FIN_questionStatus").classList.remove("FIN_movePointAndStatus");
    document.getElementById("FIN_currentPoint").classList.remove("FIN_movePointAndStatus");
    for (let i = 1; i <= 4; i++) {
        var temp = document.getElementById("FIN_Point" + i);
        var text = document.getElementById("FIN_Data" + i);
        temp.classList.remove("FIN_showPointBar" + i);
        text.classList.remove("FIN_showPointText");
        void temp.offsetWidth;
        void text.offsetWidth;
        document.getElementById("FIN_Data" + i).textContent = "";
    }
    var box = document.getElementById("FIN_questionBox");
    void box.offsetWidth;
    var status = document.getElementById("FIN_questionStatus");
    void status.offsetWidth;
    var cPoint = document.getElementById("FIN_currentPoint");
    void cPoint.offsetWidth;
    document.getElementById("FIN_questionBox").classList.add("FIN_questionBoxMove");
    document.getElementById("FIN_questionStatus").classList.add("FIN_movePointAndStatus");
    document.getElementById("FIN_currentPoint").classList.add("FIN_movePointAndStatus");
    for (let i = 1; i <= 4; i++) {
        document.getElementById("FIN_Point" + i).addEventListener("animationend", function (event) {
            if (event.animationName === "FIN_showPointBar") {
                countAnimation++;
                if (countAnimation == 4) {
                    var diff = document.getElementById("FIN_Point" + FIN_currentPlayer);
                    void diff.offsetWidth;
                    document.getElementById("FIN_Point" + FIN_currentPlayer).classList.add("FIN_differentPoint");
                }
            }
        });
        document.getElementById("FIN_Point" + i).classList.add("FIN_showPointBar" + i);
    }
    FIN_printPlayerData();
});

socket.on("_FIN_chooseQuestion", function (question) {
    document.getElementById("FIN_Image").innerHTML = "";
    if (getMediaType(question.questionData.media) == "image") document.getElementById("FIN_Image").innerHTML += "<img src='" + question.questionData.media + "'>";
    for (let i = 1; i <= 3; i++) {
        if (i == Number(question.ithQuestion)) document.getElementById("FIN_" + i).classList.add("FIN_chosenQuestion");
        else document.getElementById("FIN_" + i).classList.remove("FIN_chosenQuestion");
    }
    document.getElementById("FIN_Question").textContent = question.questionData.question;
    for (let i = 1; i <= 4; i++) {
        document.getElementById("FIN_Point" + i).classList.remove("FIN_Granted");
    }
});

socket.on("_FIN_startTiming", function (questionTime) {
    for (let i = 10; i <= 20; i += 5) {
        document.getElementById("FIN_Circle").classList.remove("FIN_moveCircle" + i);
        document.getElementById("FIN_Line").classList.remove("FIN_moveLine" + i);
    }
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
    var circle = document.getElementById("FIN_Circle");
    void circle.offsetWidth;
    var line = document.getElementById("FIN_Line");
    void line.offsetWidth;
    document.getElementById("FIN_Circle").classList.add("FIN_moveCircle" + questionTime);
    document.getElementById("FIN_Line").classList.add("FIN_moveLine" + questionTime);
});

socket.on("_FIN_Star", function (isStarOn) {
    if (isStarOn) {
        FIN_StarAudio.pause();
        FIN_StarAudio.currentTime = 0;
        FIN_StarAudio.play();
        document.getElementById("FIN_Star").src = "./Finish/Star.gif";
    } else document.getElementById("FIN_Star").src = "";
});

socket.on("_FIN_blockSignal", function (player) {
    FIN_signalAudio.pause();
    FIN_signalAudio.currentTime = 0;
    FIN_signalAudio.play();

    //thêm hiệu ứng giật quyền
    document.getElementById("FIN_Point" + player).classList.add("FIN_Granted");
});

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
    let bg = document.getElementById("FIN_5sBackground");
    bg.classList.remove("FIN_changeBackground");
    void bg.offsetWidth;
    bg.classList.add("FIN_changeBackground");
    for (let i = 1; i <= 4; i++) {
        document.getElementById("FIN_Point" + i).classList.remove("FIN_Granted");
    }
    FIN_5seconds.pause();
    FIN_5seconds.currentTime = 0;
    FIN_5seconds.play();
});

socket.on("_FIN_finishTurn", function () {
    document.getElementById("FIN_Image").innerHTML = "";
    FIN_finishTurnAudio.pause();
    FIN_finishTurnAudio.currentTime = 0;
    FIN_finishTurnAudio.play();
    offFinishUI();
    document.getElementById("FIN_Question").textContent = "";
    document.getElementById("FIN_currentPoint").textContent = "";
    for (let i = 1; i <= 4; i++) {
        document.getElementById("FIN_Point" + i).classList.remove("FIN_differentPoint");
        document.getElementById("FIN_Point" + i).classList.remove("FIN_Granted");
    }
});

//CÂU HỎI PHỤ
function SFI_printPlayerData() {
    for (let i = 1; i <= 4; i++) {
        let ele = document.getElementById("SFI_Name" + i);
        if (ele) ele.textContent = allPlayerName[i - 1];
    }
}

socket.on("_SFI_startRound", function (playerList) {
    document.getElementById("SFI_Question").textContent = "";
    document.getElementById("SFI_roundName").textContent = "CÂU HỎI PHỤ";
    SubFinishUI();
    let dadEle = document.getElementById("SFI_playersTab");
    dadEle.innerHTML = "";
    for (let i = 0; i < playerList.length; i++) {
        dadEle.innerHTML += '<span class="SFI_Player" id=' + "SFI_" + playerList[i] + "><label id=" + "SFI_Name" + playerList[i] + "></label></span>";
        document.getElementById("SFI_" + playerList[i]).style.visibility = "visible";
    }
    SFI_printPlayerData();
});

function SFI_resetStatus() {
    document.getElementById("SFI_Circle").classList.remove("FIN_moveCircle15");
    document.getElementById("SFI_Line").classList.remove("FIN_moveLine15");
    var circle = document.getElementById("SFI_Circle");
    var line = document.getElementById("SFI_Line");
    void circle.offsetWidth;
    void line.offsetWidth;
}

socket.on("_SFI_openQuestion", function (serverData) {
    for (let i = 1; i <= 4; i++) {
        let ele = document.getElementById("SFI_" + i);
        if (ele) ele.style.backgroundColor = "#313131";
    }
    document.getElementById("SFI_Question").textContent = serverData.questionData.question;
    document.getElementById("SFI_roundName").textContent = "CÂU HỎI PHỤ " + serverData.openedCount + "/3";
    SFI_resetStatus();
});

socket.on("_SFI_closeQuestion", function () {
    document.getElementById("SFI_Question").textContent = "";
    document.getElementById("SFI_roundName").textContent = "CÂU HỎI PHỤ";
});

socket.on("_SFI_Timing", function (isReset) {
    for (let i = 1; i <= 4; i++) {
        let ele = document.getElementById("SFI_" + i);
        if (ele) ele.style.backgroundColor = "#313131";
    }
    if (isReset) {
        SFI_resetStatus();
        SFI_mainTime.pause();
        SFI_mainTime.currentTime = 0;
        SFI_mainTime.play();
        document.getElementById("SFI_Circle").classList.add("FIN_moveCircle15");
        document.getElementById("SFI_Line").classList.add("FIN_moveLine15");
        document.getElementById("SFI_Circle").style.animationPlayState = "running";
        document.getElementById("SFI_Line").style.animationPlayState = "running";
    } else {
        SFI_mainTime.play();
        document.getElementById("SFI_Circle").style.animationPlayState = "running";
        document.getElementById("SFI_Line").style.animationPlayState = "running";
    }
});

socket.on("_SFI_Right", function () {
    FIN_RightAudio.pause();
    FIN_RightAudio.currentTime = 0;
    FIN_RightAudio.play();
});

socket.on("_SFI_blockSignal", function (player) {
    SFI_mainTime.pause();
    FIN_signalAudio.pause();
    FIN_signalAudio.currentTime = 0;
    FIN_signalAudio.play();
    document.getElementById("SFI_" + player).style.backgroundColor = "#df2453";
    document.getElementById("SFI_Circle").style.animationPlayState = "paused";
    document.getElementById("SFI_Line").style.animationPlayState = "paused";
});

var showResult, repeat;

socket.on("_result", function () {
    offContestUI();
    ResultUI();
    clearTimeout(showResult);
    clearInterval(repeat);
    document.getElementById("resultName").textContent = "";
    document.getElementById("resultPoint").textContent = "";
    var sortedList = new Array(4);
    for (var i = 1; i <= 4; i++) {
        var playerName = allPlayerName[i - 1];
        var playerPoint = allPlayerPoint[i - 1];
        sortedList.push({ name: playerName, point: playerPoint });
    }

    sortedList.sort(function (a, b) {
        return a.point - b.point;
    });

    resultAudio.pause();
    resultAudio.currentTime = 0;
    resultAudio.play();
    document.querySelector(".Namebar").classList.remove("namebarMove");
    var namebarMove = document.getElementById("Namebar");
    void namebarMove.offsetWidth;
    document.querySelector(".Namebar").classList.add("namebarMove");

    document.querySelector(".Pointbar").classList.remove("pointbarMove");
    var pointbarMove = document.getElementById("Pointbar");
    void pointbarMove.offsetWidth;
    document.querySelector(".Pointbar").classList.add("pointbarMove");

    function setNameAndPoint(name, point) {
        document.getElementById("resultName").textContent = name;
        document.getElementById("resultPoint").textContent = point;
    }

    showResult = setTimeout(function () {
        var count = 0;
        setNameAndPoint(sortedList[count].name, sortedList[count].point);
        repeat = setInterval(function () {
            count++;
            setNameAndPoint(sortedList[count].name, sortedList[count].point);
            if (count == 3) clearInterval(repeat);
        }, 3000);
    }, 1000);
});

socket.on("_endGame", function () {
    offContestUI();
});

//SOUND NGOÀI
var audio = new Audio();
document.body.appendChild(audio);

socket.on("_OUT_introVideo", function () {
    document.getElementById("intro").style.visibility = "visible";
    intro.src = "./Others/Intro.mp4";
    intro.play();
    intro.onended = function () {
        document.getElementById("intro").style.visibility = "hidden";
    };
});

socket.on("_OUT_introAudio", function () {
    audio.pause();
    audio.src = "./Others/Sounds/Intro.mp3";
    audio.play();
});

socket.on("_OUT_MC", function () {
    audio.pause();
    audio.src = "./Others/Sounds/MCLenSanKhau.mp3";
    audio.play();
});

socket.on("_OUT_Player", function () {
    audio.pause();
    audio.src = "./Others/Sounds/ThiSinhLenSanKhau.mp3";
    audio.play();
});

socket.on("_OUT_Introduce", function (num) {
    audio.pause();
    audio.src = "./Others/Sounds/misc_introduction" + num + ".mp3";
    audio.play();
});

socket.on("_OUT_Flower", function (num) {
    audio.pause();
    audio.src = "./Others/Sounds/TangHoa" + num + ".mp3";
    audio.play();
});

socket.on("_OUT_Ambience", function () {
    audio.pause();
    audio.src = "./Others/Sounds/Anticipation.mp3";
    audio.play();
});

socket.on("_OUT_Result", function (num) {
    audio.pause();
    audio.src = "./Others/Sounds/Ve" + num + ".mp3";
    audio.play();
});

socket.on("_OUT_Prize", function (num) {
    audio.pause();
    audio.src = "./Others/Sounds/Award" + num + ".mp3";
    audio.play();
});

socket.on("_OUT_closeAllAudio", function () {
    let allMediaElements = document.querySelectorAll("audio, video");
    allMediaElements.forEach(function (mediaElement) {
        mediaElement.src = "";
        mediaElement.pause(); // Tắt âm thanh
    });
});
