var socket = io();
socket.emit("sendAdminPassword", sessionStorage.getItem("adminPassword"));

function sendAdminPassword() {
    socket.emit("sendAdminPassword", document.getElementById("passwordInput").value);
}

document.getElementById("passwordInput").addEventListener("keyup", function (event) {
    if (event.key === "Enter") sendAdminPassword();
});

socket.on("_sendAdminPassword", function (password) {
    document.getElementById("dbFrame").src = "/database?url=" + password;
    sessionStorage.setItem("adminPassword", password);
    document.getElementById("password").style.display = "none";
    socket.emit("hostEnterRoom");
});

function closeEndPart() {
    document.getElementById("endH3").style.visibility = "hidden";
    document.getElementById("Result").style.visibility = "hidden";
    document.getElementById("EndGame").style.visibility = "hidden";
}

function openEndPart() {
    document.getElementById("endH3").style.visibility = "visible";
    document.getElementById("Result").style.visibility = "visible";
    document.getElementById("EndGame").style.visibility = "visible";
}

var roundID;
var isChatBan = false;
var STR_signalPlayer;
var OBS_rowSelected;
var OBS_imgCornerOpened;
var OBS_pointChange = 0;
var FIN_currentQuestionPoint;
var FIN_isStarOn = false;
var FIN_currentPlayer;
var FIN_signalPlayer = 0;
var SFI_signalPlayer = 0;
var SFI_timeLeft;
var downloadTimer;
var questionAudio = new Audio();

socket.on("serverRestarted", function () {
    alert("Server đã khởi động trở lại, vui lòng F5 để cập nhật lại tình trạng.");
    window.location.reload();
});

//CHAT
document.getElementById("chatInput").addEventListener("keyup", function (event) {
    if (event.key === "Enter" && document.getElementById("chatInput").value != "") {
        let username = "Host";
        var message = document.getElementById("chatInput").value;
        if (message == "/mute all") {
            socket.emit("mute-all");
        } else if (message == "/clear") {
            document.getElementById("chatbox").innerHTML = "";
        } else
            socket.emit("sendChat", {
                username,
                message,
                playerNumber: "0",
            });
        document.getElementById("chatInput").value = "";
    }
});

document.getElementById("chatInput").addEventListener("paste", function (event) {
    let items = (event.clipboardData || event.originalEvent.clipboardData).items;
    for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf("image") !== -1 || items[i].type.indexOf("video") !== -1 || items[i].type.indexOf("audio") !== -1) {
            let blob = items[i].getAsFile();
            let formData = new FormData();
            let username = "Host";
            let userData = JSON.stringify({ username: username, playerNumber: "0" });
            formData.append("media", blob);
            formData.append("userData", userData);
            fetch("/uploadMedia", {
                method: "POST",
                body: formData,
            }).catch((error) => {
                console.error("Error:", error);
            });
            return;
        }
    }
});

function scrollDown() {
    let chatbox = document.getElementById("chatbox");
    let isAtBottom = chatbox.scrollHeight - chatbox.scrollTop <= chatbox.clientHeight * 1.1;
    return isAtBottom;
}

function printChat(data) {
    let box = document.getElementById("chatbox");
    let textColor;
    if (data.username == "Host") textColor = "#FE9D88";
    else textColor = "white";
    if (data.mediaType) {
        if (data.mediaType == "image") {
            box.innerHTML +=
                "<div> <span style='font-family: \"Chivo Mono\", monospace; color: cyan'>" +
                data.time +
                "</span> | <font color='orange'>" +
                data.username +
                "</font>:<br><img class='chatMedia' src='" +
                data.mediaUrl +
                "'></div>";
        } else if (data.mediaType == "video") {
            box.innerHTML +=
                "<div> <span style='font-family: \"Chivo Mono\", monospace; color: cyan'>" +
                data.time +
                "</span> | <font color='orange'>" +
                data.username +
                "</font>:<br><video class='chatMedia' controls src='" +
                data.mediaUrl +
                "'></video></div>";
        } else {
            //audio
            box.innerHTML +=
                "<div> <span style='font-family: \"Chivo Mono\", monospace; color: cyan'>" +
                data.time +
                "</span> | <font color='orange'>" +
                data.username +
                "</font>:<br><audio class='chatMedia' controls src='" +
                data.mediaUrl +
                "'></audio></div>";
        }
    } else {
        box.innerHTML +=
            "<div> <span style='font-family: \"Chivo Mono\", monospace; color: cyan'>" +
            data.time +
            "</span> | <font color='orange'>" +
            data.username +
            "</font>: <font color='" +
            textColor +
            "'>" +
            data.message +
            "</font></div>";
    }
}

socket.on("_sendChat", function (data) {
    let checkScroll = scrollDown();
    let box = document.getElementById("chatbox");
    printChat(data);
    if (checkScroll) box.scrollTop = box.scrollHeight;
});

socket.on("_getVersion", function (appVersion) {
    document.getElementById("currentVersion").textContent = appVersion;
});

socket.on("serverData", function (data) {
    document.getElementById("dbNumber").value = data.databaseChosen;
    for (let i = 1; i <= 4; i++) {
        document.getElementById("player" + i + "Name").value = data.playerName[i - 1];
        document.getElementById("player" + i + "Point").value = data.playerPoint[i - 1];
        document.getElementById("name" + i).textContent = data.playerName[i - 1];
        if (data.isReady[i - 1]) document.getElementById("TS" + i).style.color = "yellowgreen";
    }
});

socket.on("_getPlayerData", () => {
    Confirm();
});

socket.on("sendChatLog", function (chatLog) {
    for (let i = 0; i < chatLog.length; i++) {
        printChat(chatLog[i]);
    }
});

socket.on("_sendReady", function (data) {
    if (data.ready) document.getElementById("TS" + data.playerNumber).style.color = "yellowgreen";
    else document.getElementById("TS" + data.playerNumber).style.color = "white";
});

//MỞ TRANG CSDL
function openDatabase() {
    document.getElementById("blurbg").style.zIndex = 9;
    document.getElementById("dbFrame").style.zIndex = 10;
    document.getElementById("blurbg").style.visibility = "visible";
    document.getElementById("dbFrame").style.visibility = "visible";
}

//MỞ MEDIA NGOÀI
function openMedia() {
    document.getElementById("blurbg").style.zIndex = 9;
    document.getElementById("Media").style.zIndex = 10;
    document.getElementById("blurbg").style.visibility = "visible";
    document.getElementById("Media").style.visibility = "visible";
}

function closeExtraUI() {
    document.getElementById("blurbg").style.zIndex = -9;
    document.getElementById("dbFrame").style.zIndex = -10;
    document.getElementById("Media").style.zIndex = -10;
    document.getElementById("blurbg").style.visibility = "hidden";
    document.getElementById("dbFrame").style.visibility = "hidden";
    document.getElementById("Media").style.visibility = "hidden";
}

//CHỌN CSDL
function chooseDb() {
    let dbNumber = Number(document.getElementById("dbNumber").value);
    socket.emit("adminChooseDb", dbNumber);
}

socket.on("playerDataFromDatabase", function (data) {
    for (let i = 1; i <= 4; i++) {
        document.getElementById("player" + i + "Name").value = data.playerName[i - 1];
        document.getElementById("player" + i + "Point").value = data.playerPoint[i - 1];
    }
    Confirm();
});

//RESET TRẠNG THÁI
function resetStatus() {
    if (roundID == 2) {
        OBS_rowSelected = undefined;
        OBS_imgCornerOpened = undefined;
        OBS_pointChange = 0;
    } else if (roundID == 4) {
        FIN_currentQuestionPoint = undefined;
        FIN_isStarOn = false;
        FIN_currentPlayer = undefined;
        FIN_signalPlayer = 0;
    } else if (roundID == 5) {
        SFI_signalPlayer = 0;
    }
    socket.emit("resetStatus", roundID);
}

//CHỌN VÒNG THI
closeEndPart();
function openTechnicalZone() {
    document.getElementById("OBS_Info").innerHTML = "";
    document.getElementById("ACC_Info").innerHTML = "";
    document.getElementById("FIN_chooseQuestionBoard").innerHTML = "";
}

function Select() {
    document.getElementById("OBS_Info").innerHTML = "";
    document.getElementById("ACC_Info").innerHTML = "";
    document.getElementById("FIN_chooseQuestionBoard").innerHTML = "";
    roundID = document.getElementById("rounds").value;
    socket.emit("RoundChosen", roundID);
    let temp = document.getElementById("RoundMenu");
    temp.innerHTML = "";
    if (roundID == "1") {
        temp.innerHTML += "<div class='inRound'>TRONG PHẦN THI</div>";
        temp.innerHTML += '<span class="button" onclick="playIntro()"><i class="fa-solid fa-film"></i>&nbsp&nbspIntro</span> ';
        temp.innerHTML += '<span class="button" onclick="startRound()"><i class="fa-solid fa-play"></i>&nbsp&nbspBắt đầu</span> ';
        temp.innerHTML += '<span class="button" onclick="blankSound()"><i class="fa-regular fa-square"></i>&nbsp&nbspKhoảng trắng</span><br>';
        temp.innerHTML += "<span class='text'>Lượt:&nbsp</span>";
        temp.innerHTML +=
            '<select id="STR_ithStart"><option value="1">1</option><option value="2">2</option><option value="3">3</option><option value="4">4</option><option value="5">Chung</option></select> ';
        temp.innerHTML += '<span class="button" onclick="STR_choosePlayer()"><i class="fa-solid fa-check"></i>&nbsp&nbspConfirm</span><br>';
        temp.innerHTML += '<span class="button" onclick="STR_startPlayerTurn()"><i class="fa-solid fa-user-check"></i>&nbsp&nbspVào lượt</span> ';
        temp.innerHTML += '<span class="button" onclick="STR_openQuestionBoard()"><i class="fa-solid fa-chess-board"></i>&nbsp&nbspMở bảng câu hỏi</span> ';
        temp.innerHTML += '<span class="button" onclick="STR_startTurn()"><i class="fa-regular fa-circle-question"></i>&nbsp&nbspBắt đầu lượt thi</span><br>';
        temp.innerHTML += "<span class='text'>Khu vực media:&nbsp</span>";
        temp.innerHTML += '<span class="button" id="playMedia" onclick="playMedia()"><i class="fa-solid fa-play"></i>&nbsp&nbspPhát media</span> ';
        temp.innerHTML += '<span class="button" id="closeMedia" onclick="closeMedia()"><i class="fa-solid fa-pause"></i>&nbsp&nbspDừng media</span><br>';
        temp.innerHTML += "<span class='text'>Thời gian:&nbsp</span>";
        temp.innerHTML += '<span class="text" id="STR_Time">0</span><br>';
        temp.innerHTML += "<span class='text'>Đếm ngược:&nbsp</span>";
        temp.innerHTML += '<span class="button" onclick="STR_5s()"><i class="fa-solid fa-hourglass-start"></i>&nbsp&nbsp5s trả lời</span> ';
        temp.innerHTML += '<span class="button" onclick="STR_3s()"><i class="fa-solid fa-hourglass-start"></i>&nbsp&nbsp3s khoá chuông</span><br>';
        temp.innerHTML += "<span class='text'>Chấm/Đổi:&nbsp</span>";
        temp.innerHTML += '<span class="button" onclick="STR_Right()"><i class="fa-regular fa-circle-check"></i>&nbsp&nbspĐúng</span> ';
        temp.innerHTML += '<span class="button" onclick="STR_Wrong()"><i class="fa-regular fa-circle-xmark"></i>&nbsp&nbspSai</span> ';
        temp.innerHTML += '<span class="button" onclick="STR_getNextQuestion()"><i class="fa-solid fa-angles-right"></i>&nbsp&nbspChuyển câu</span><br>';
        temp.innerHTML += '<span class="button" onclick="STR_finishTurn()"><i class="fa-solid fa-flag-checkered"></i>&nbsp&nbspHoàn thành lượt</span>';
        openEndPart();
    } else if (roundID == "2") {
        OBS_adminGetRoundData();
        temp.innerHTML += "<div class='inRound'>TRONG PHẦN THI</div>";
        temp.innerHTML += '<span class="button" onclick="playIntro()"><i class="fa-solid fa-film"></i>&nbsp&nbspIntro</span> ';
        temp.innerHTML += '<span class="button" onclick="startRound()"><i class="fa-solid fa-play"></i>&nbsp&nbspBắt đầu</span> ';
        temp.innerHTML += '<span class="button" onclick="blankSound()"><i class="fa-regular fa-square"></i>&nbsp&nbspKhoảng trắng</span><br>';
        temp.innerHTML += '<span class="button" onclick="OBS_showNumberOfCharacter()"><i class="fa-solid fa-arrow-down-1-9"></i>&nbsp&nbspTiết lộ số kí tự</span> ';
        temp.innerHTML += '<span class="button" onclick="OBS_showRows()"><i class="fa-solid fa-chess-board"></i>&nbsp&nbspHiện hàng ngang</span><br>';
        temp.innerHTML += "<span class='text'>Chọn hàng ngang số:&nbsp</span>";
        temp.innerHTML +=
            '<select id="OBS_ithRow"><option value="1">1</option><option value="2">2</option><option value="3">3</option><option value="4">4</option><option value="5">Trung tâm</option></select> ';
        temp.innerHTML += '<span class="button" onclick="OBS_chooseRow()"><i class="fa-solid fa-user-check"></i>&nbsp&nbspConfirm</span><br>';
        temp.innerHTML += "<span class='text'>Khu vực câu hỏi:&nbsp</span>";
        temp.innerHTML += '<span class="button" onclick="OBS_showRowQuestion()"><i class="fa-regular fa-circle-question"></i>&nbsp&nbspMở câu hỏi</span> ';
        temp.innerHTML += '<span class="button" onclick="OBS_closeRowQuestion()"><i class="fa-solid fa-eye-slash"></i>&nbsp&nbspTắt câu hỏi</span><br>';
        temp.innerHTML += "<span class='text'>Khu vực media:&nbsp</span>";
        temp.innerHTML += '<span class="button" id="playMedia" onclick="playMedia()"><i class="fa-solid fa-play"></i>&nbsp&nbspPhát media</span> ';
        temp.innerHTML += '<span class="button" id="closeMedia" onclick="closeMedia()"><i class="fa-solid fa-pause"></i>&nbsp&nbspDừng media</span><br>';
        temp.innerHTML += "<span class='text'>Đếm ngược:&nbsp</span>";
        temp.innerHTML += '<span class="button" onclick="OBS_start15s()"><i class="fa-solid fa-hourglass-start"></i>&nbsp&nbsp15 giây</span> ';
        temp.innerHTML += '<span class="button" onclick="OBS_last15s()"><i class="fa-solid fa-hourglass-start"></i>&nbsp&nbsp15 giây cuối</span><br>';
        temp.innerHTML += "<span class='text'>Thời gian:&nbsp</span>";
        temp.innerHTML += '<span class="text" id="OBS_rowObsTime">0</span><br>';
        temp.innerHTML += "<span class='text'>Khu vực hàng ngang:&nbsp</span>";
        temp.innerHTML += '<span class="button" onclick="OBS_showRowAnswer()"><i class="fa-solid fa-eye"></i>&nbsp&nbspHiện đáp án</span> ';
        temp.innerHTML += '<span class="button" onclick="OBS_rightRow()"><i class="fa-regular fa-circle-check"></i>&nbsp&nbspĐúng</span> ';
        temp.innerHTML += '<span class="button" onclick="OBS_wrongRow()"><i class="fa-regular fa-circle-xmark"></i>&nbsp&nbspSai</span><br>';
        temp.innerHTML += "<span class='text'>Khu vực CNV:&nbsp</span>";
        temp.innerHTML += '<span class="button" onclick="OBS_rightObs()"><i class="fa-regular fa-circle-check"></i>&nbsp&nbspĐúng CNV</span> ';
        temp.innerHTML += '<span class="button" onclick="OBS_wrongObs()"><i class="fa-regular fa-circle-xmark"></i>&nbsp&nbspSai CNV</span> ';
        temp.innerHTML += '<span class="button" onclick="OBS_showObstacle()"><i class="fa-solid fa-eye"></i>&nbsp&nbspMở CNV</span><br>';
        temp.innerHTML += "<span class='text'>Khu vực ảnh:&nbsp</span>";
        temp.innerHTML += '<span class="button" onclick="OBS_openCorner()"><i class="fa-solid fa-eye"></i>&nbsp&nbspMở góc ảnh</span><br>';
        temp.innerHTML += "<span class='text'>Giao diện:&nbsp</span>";
        temp.innerHTML += '<span class="button" onclick="OBS_backScreen()"><i class="fa-solid fa-display"></i>&nbsp&nbspHàng ngang</span> ';
        temp.innerHTML += '<span class="button" onclick="OBS_AnswerUI()"><i class="fa-solid fa-display"></i>&nbsp&nbspĐáp án</span> ';
        temp.innerHTML += '<span class="button" onclick="OBS_ImageUI()"><i class="fa-solid fa-display"></i>&nbsp&nbspGiao diện ảnh</span><br>';
        temp.innerHTML += "<span class='text'>Số điểm tối đa:&nbsp</span>";
        temp.innerHTML += '<b><span class="text" id="OBS_maxObsPoint">60</span></b><br>';
        temp.innerHTML += "<span class='text'>Điểm khuyến nghị CNV:&nbsp</span>";
        temp.innerHTML += '<b><span class="text" id="OBS_suggestObsPoint">60</span></b> ';
        temp.innerHTML += '<span class="button" onclick="OBS_changePoint(10)"><i class="fa-solid fa-angles-up"></i>&nbsp10</span> ';
        temp.innerHTML += '<span class="button" onclick="OBS_changePoint(-10)"><i class="fa-solid fa-angles-down"></i>&nbsp10</span><br>';
        temp.innerHTML += '<span class="button" onclick="OBS_deleteSignal()"><i class="fa-solid fa-bell-slash"></i>&nbsp&nbspXoá tín hiệu</span>';
        openEndPart();
    } else if (roundID == "3") {
        ACC_printPlayerVideoStatus();
        temp.innerHTML += "<div class='inRound'>TRONG PHẦN THI</div>";
        temp.innerHTML += '<span class="button" onclick="playIntro()"><i class="fa-solid fa-film"></i>&nbsp&nbspIntro</span> ';
        temp.innerHTML += '<span class="button" onclick="startRound()"><i class="fa-solid fa-play"></i>&nbsp&nbspBắt đầu</span> ';
        temp.innerHTML += '<span class="button" onclick="blankSound()"><i class="fa-regular fa-square"></i>&nbsp&nbspKhoảng trắng</span><br>';
        temp.innerHTML += "<span class='text'>Câu hỏi số:&nbsp</span>";
        temp.innerHTML += '<select id="ACC_ithQuestion"><option value="1">1</option><option value="2">2</option><option value="3">3</option><option value="4">4</option></select> ';
        temp.innerHTML += '<span class="button" onclick="ACC_chooseQuestion()"><i class="fa-solid fa-user-check"></i>&nbsp&nbspConfirm</span><br>';
        temp.innerHTML += '<span class="button" onclick="ACC_openQuestion()"><i class="fa-regular fa-circle-question"></i>&nbsp&nbspMở câu hỏi</span> ';
        temp.innerHTML += '<span class="button" onclick="ACC_startTiming()"><i class="fa-solid fa-hourglass-start"></i>&nbsp&nbspBắt đầu tính giờ</span> ';
        temp.innerHTML += '<span class="button" onclick="ACC_turnOffQuestion()"><i class="fa-solid fa-eye-slash"></i>&nbsp&nbspTắt câu hỏi</span> ';
        temp.innerHTML += '<span class="button" onclick="ACC_clearData()"><i class="fa-regular fa-trash-can"></i>&nbsp&nbspXoá dữ liệu</span><br>';
        temp.innerHTML += "<span class='text'>Thời gian:&nbsp</span>";
        temp.innerHTML += '<span class="text" id="ACC_Time">0</span><br>';
        temp.innerHTML += '<span class="button" onclick="ACC_showAnswers()"><i class="fa-solid fa-eye"></i>&nbsp&nbspHiện đáp án thí sinh</span> ';
        temp.innerHTML += '<span class="button" onclick="ACC_showQuestionAnswer()"><i class="fa-solid fa-eye"></i>&nbsp&nbspHình ảnh đáp án</span><br>';
        temp.innerHTML += '<span class="button" onclick="ACC_Right()"><i class="fa-regular fa-circle-check"></i>&nbsp&nbspĐúng</span> ';
        temp.innerHTML += '<span class="button" onclick="ACC_Wrong()"><i class="fa-regular fa-circle-xmark"></i>&nbsp&nbspSai</span><br>';
        temp.innerHTML += '<span class="button" onclick="ACC_questionScreen()"><i class="fa-solid fa-display"></i>&nbsp&nbspGiao diện câu hỏi</span> ';
        temp.innerHTML += '<span class="button" onclick="ACC_answerScreen()"><i class="fa-solid fa-display"></i>&nbsp&nbspGiao diện đáp án</span>';
        openEndPart();
    } else if (roundID == "4") {
        temp.innerHTML += "<div class='inRound'>TRONG PHẦN THI</div>";
        temp.innerHTML += '<span class="button" onclick="playIntro()"><i class="fa-solid fa-film"></i>&nbsp&nbspIntro</span> ';
        temp.innerHTML += '<span class="button" onclick="startRound()"><i class="fa-solid fa-play"></i>&nbsp&nbspBắt đầu</span> ';
        temp.innerHTML += '<span class="button" onclick="blankSound()"><i class="fa-regular fa-square"></i>&nbsp&nbspKhoảng trắng</span><br>';
        temp.innerHTML += "<span class='text'>Vị trí về đích:</span> ";
        temp.innerHTML += '<select id="FIN_ithPlayer"><option value="1">1</option><option value="2">2</option><option value="3">3</option><option value="4">4</option></select> ';
        temp.innerHTML += '<span class="button" onclick="FIN_choosePlayer()"><i class="fa-solid fa-user-check"></i>&nbsp&nbspConfirm</span><br>';
        temp.innerHTML += '<span class="button" onclick="FIN_showQuestionPack()"><i class="fa-solid fa-cubes"></i>&nbsp&nbspChọn gói</span><br>';
        temp.innerHTML += "<span class='text'>Câu hỏi số:</span> ";
        temp.innerHTML += '<select id="FIN_ithQuestion"><option value="1">1</option><option value="2">2</option><option value="3">3</option></select> ';
        temp.innerHTML += '<span class="button" onclick="FIN_chooseQuestion()"><i class="fa-regular fa-circle-question"></i>&nbsp&nbspMở câu hỏi</span><br>';
        temp.innerHTML += "<span class='text'>Khu vực media:&nbsp</span>";
        temp.innerHTML += '<span class="button" id="playMedia" onclick="playMedia()"><i class="fa-solid fa-play"></i>&nbsp&nbspPhát media</span> ';
        temp.innerHTML += '<span class="button" id="closeMedia" onclick="closeMedia()"><i class="fa-solid fa-pause"></i>&nbsp&nbspDừng media</span><br>';
        temp.innerHTML += '<span class="button" onclick="FIN_Star()"><i class="fa-solid fa-star"></i>&nbsp&nbspNgôi sao hi vọng</span> ';
        temp.innerHTML += '<span class="text" id="FIN_starStatus">Trạng thái: Đang tắt</span><br>';
        temp.innerHTML += '<span class="button" onclick="FIN_startTiming()"><i class="fa-solid fa-hourglass-start"></i>&nbsp&nbspBắt đầu tính giờ</span> ';
        temp.innerHTML += "<span class='text'>Thời gian:&nbsp</span>";
        temp.innerHTML += '<span class="text" id="FIN_Time">0</span><br>';
        temp.innerHTML += '<span class="button" onclick="FIN_Right()"><i class="fa-regular fa-circle-check"></i>&nbsp&nbspĐúng</span> ';
        temp.innerHTML += '<span class="button" onclick="FIN_5s()"><i class="fa-solid fa-hourglass-start"></i>&nbsp&nbsp5 giây giành quyền</span> ';
        temp.innerHTML += '<span class="button" onclick="FIN_Wrong()"><i class="fa-regular fa-circle-xmark"></i>&nbsp&nbspSai</span><br>';
        temp.innerHTML += '<span class="button" onclick="FIN_deleteSignal()"><i class="fa-solid fa-bell-slash"></i>&nbsp&nbspXoá tín hiệu</span><br>';
        temp.innerHTML += '<span class="button" onclick="FIN_finishTurn()"><i class="fa-solid fa-flag-checkered"></i>&nbsp&nbspHoàn thành lượt</span>';
        openEndPart();
    } else if (roundID == "5") {
        temp.innerHTML += "<div class='inRound'>TRONG PHẦN THI</div>";
        temp.innerHTML += '<span class="button" onclick="blankSound()"><i class="fa-regular fa-square"></i>&nbsp&nbspKhoảng trắng</span><br>';
        temp.innerHTML += '<span class="button" onclick="SFI_choosePlayers()"><i class="fa-solid fa-user-check"></i>&nbsp&nbspChọn thí sinh</span><br>';
        temp.innerHTML += '<div id="SFI_Players"></div>';
        temp.innerHTML += "<span class='text'>Câu hỏi số</span> ";
        temp.innerHTML += '<select id="SFI_ithQuestion"><option value="1">1</option><option value="2">2</option><option value="3">3</option></select> ';
        temp.innerHTML += '<span class="button" onclick="SFI_openQuestion()"><i class="fa-regular fa-circle-question"></i>&nbsp&nbspMở câu hỏi</span> ';
        temp.innerHTML += '<span class="button" onclick="SFI_closeQuestion()"><i class="fa-solid fa-eye-slash"></i>&nbsp&nbspTắt câu hỏi</span><br>';
        temp.innerHTML += '<span class="button" onclick="SFI_startTiming()"><i class="fa-solid fa-hourglass-start"></i>&nbsp&nbspBắt đầu tính giờ</span> ';
        temp.innerHTML += "<span class='text'>Thời gian:&nbsp</span>";
        temp.innerHTML += '<span class="text" id="SFI_Time">0</span><br>';
        temp.innerHTML += '<span class="button" onclick="SFI_Right()"><i class="fa-regular fa-circle-check"></i>&nbsp&nbspĐúng</span> ';
        temp.innerHTML += '<span class="button" onclick="SFI_Continue()"><i class="fa-solid fa-pause"></i>&nbsp&nbspĐồng hồ</span> ';
        temp.innerHTML += "<span class='text'>Trạng thái:</span> ";
        temp.innerHTML += '<span class="text" id="SFI_clockStatus">Đang dừng</span><br>';
        temp.innerHTML += '<span class="button" onclick="OBS_deleteSignal()"><i class="fa-solid fa-bell-slash"></i>&nbsp&nbspXoá tín hiệu</span>';
        openEndPart();
    }
}

//GỬI DỮ LIỆU THÍ SINH
function Confirm() {
    let currentPlayerPoint = [];
    let currentPlayerName = [];
    for (let i = 1; i <= 4; i++) {
        currentPlayerPoint[i - 1] = Number(document.getElementById("player" + i + "Point").value);
        currentPlayerName[i - 1] = document.getElementById("player" + i + "Name").value;
        document.getElementById("name" + i).textContent = currentPlayerName[i - 1];
    }
    socket.emit("sendAdminData", { currentPlayerPoint, currentPlayerName });
}

//CHUẨN BỊ
function playIntro() {
    roundID = document.getElementById("rounds").value;
    socket.emit("playIntro", roundID);
}

function startRound() {
    Confirm();
    socket.emit("startRound");
    if (document.getElementById("UIName").textContent == "Phòng chat") UI();
}

function changeChatRules() {
    if (isChatBan == false) {
        isChatBan = true;
        document.getElementById("chatStatus").innerHTML = "Trạng thái: Đang tắt";
    } else {
        isChatBan = false;
        document.getElementById("chatStatus").innerHTML = "Trạng thái: Đang bật";
    }
    socket.emit("changeChatRules", isChatBan);
}

function blankSound() {
    socket.emit("blankSound");
}

socket.on("_mute-all", function () {
    changeChatRules();
});

socket.on("getroundID", function () {
    socket.emit("_getroundID", document.getElementById("rounds").value);
});

socket.on("getCurrentUI", function () {
    let roundID = document.getElementById("rounds").value;
    let UIName = document.getElementById("UIName").textContent;
    socket.emit("sendCurrentUI", { isChatBan, roundID, UIName });
});

function setQuestionData(questionData) {
    document.getElementById("questionText").textContent = questionData.question;
    document.getElementById("answerText").textContent = questionData.answer;
    document.getElementById("noteText").textContent = questionData.note;
}

function UI() {
    if (document.getElementById("UIName").textContent == "Phòng chat") {
        document.getElementById("UIName").innerHTML = "Phòng thi";
        socket.emit("ContestUI");
    } else {
        document.getElementById("UIName").innerHTML = "Phòng chat";
        socket.emit("ChatUI");
    }
}

function playMedia() {
    socket.emit("playMedia");
}

function closeMedia() {
    socket.emit("closeMedia");
}

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
        document.getElementById("FIN_Media").innerHTML += "<video preload='auto' disablePictureInPicture controlsList='nodownload' src='" + mediaUrl + "'></video>";
        let media = document.querySelector("#FIN_Media video");
        if (media) {
            media.play();
            media.onended = () => {
                document.getElementById("FIN_Media").innerHTML = "";
            };
        }
    }
});

socket.on("_closeMedia", () => {
    questionAudio.pause();
    let media = document.querySelector("#Media video");
    if (media) {
        media.pause();
        document.getElementById("Media").innerHTML = "";
    }
});

function updateMediaButton(status) {
    if (status == "auto") {
        document.getElementById("playMedia").style.opacity = 1;
        document.getElementById("closeMedia").style.opacity = 1;
    } else {
        document.getElementById("playMedia").style.opacity = 0.5;
        document.getElementById("closeMedia").style.opacity = 0.5;
    }
    document.getElementById("playMedia").style.pointerEvents = status;
    document.getElementById("closeMedia").style.pointerEvents = status;
}

//KHỞI ĐỘNG
function STR_choosePlayer() {
    let ithStart = document.getElementById("STR_ithStart").value;
    socket.emit("STR_choosePlayer", ithStart);
}

function STR_startPlayerTurn() {
    socket.emit("STR_startPlayerTurn");
}

function STR_openQuestionBoard() {
    socket.emit("STR_openQuestionBoard");
}

function STR_startTurn() {
    let ithStart = document.getElementById("STR_ithStart").value;
    socket.emit("STR_startTurn", ithStart);
}

socket.on("_STR_startTurn", function (question) {
    updateMediaButton("none");
    document.getElementById("STR_Info").innerHTML = "";
    let mediaType = getMediaType(question.media);
    if (mediaType == "audio") updateMediaButton("auto");
    else if (mediaType == "image") document.getElementById("STR_Info").innerHTML += "<img src='" + question.media + "'>";
    setQuestionData(question);
});

function STR_timing(time) {
    clearInterval(downloadTimer);
    document.getElementById("STR_Time").textContent = time;
    let timeleft = time - 1;
    downloadTimer = setInterval(function () {
        document.getElementById("STR_Time").textContent = timeleft;
        if (timeleft <= 0) {
            clearInterval(downloadTimer);
        }
        timeleft -= 1;
    }, 1000);
}

function STR_5s() {
    socket.emit("STR_Timing", 5);
    STR_timing(5);
}

function STR_3s() {
    socket.emit("STR_Timing", 3);
    STR_timing(3);
}

function STR_getNextQuestion() {
    let ithStart = document.getElementById("STR_ithStart").value;
    socket.emit("STR_getNextQuestion", ithStart);
}

socket.on("_STR_getNextQuestion", function (questionData) {
    updateMediaButton("none");
    document.getElementById("STR_Info").innerHTML = "";
    let mediaType = getMediaType(questionData.media);
    if (mediaType == "audio") updateMediaButton("auto");
    else if (mediaType == "image") document.getElementById("STR_Info").innerHTML += "<img src='" + questionData.media + "'>";
    setQuestionData(questionData);
    if (STR_signalPlayer) document.getElementById("p" + STR_signalPlayer).style.border = "calc(5vw/96) dotted grey";
    STR_signalPlayer = undefined;
    clearInterval(downloadTimer);
    document.getElementById("STR_Time").textContent = 0;
});

socket.on("_STR_blockSignal", function (playerNumber) {
    STR_signalPlayer = playerNumber;
    document.getElementById("p" + playerNumber).style.border = "calc(5vw/48) solid #73f7ff";
});

function STR_Right() {
    let ithStart = document.getElementById("STR_ithStart").value;
    if (ithStart != 5) {
        let point = document.getElementById("player" + ithStart + "Point").value;
        document.getElementById("player" + ithStart + "Point").value = Number(point) + 10;
    } else {
        let point = document.getElementById("player" + STR_signalPlayer + "Point").value;
        document.getElementById("player" + STR_signalPlayer + "Point").value = Number(point) + 10;
    }
    socket.emit("STR_Right");
    Confirm();
}

function STR_Wrong() {
    let ithStart = document.getElementById("STR_ithStart").value;
    if (ithStart == 5 && STR_signalPlayer) {
        let point = document.getElementById("player" + STR_signalPlayer + "Point").value;
        document.getElementById("player" + STR_signalPlayer + "Point").value = Number(point) - 5;
    }
    socket.emit("STR_Wrong");
    Confirm();
}

function STR_finishTurn() {
    socket.emit("STR_finishTurn");
    updateMediaButton("none");
    document.getElementById("STR_Info").innerHTML = "";
    if (STR_signalPlayer) document.getElementById("p" + STR_signalPlayer).style.border = "calc(5vw/96) dotted grey";
}

function OBS_changePoint(point) {
    let currentObsPoint = Number(document.getElementById("OBS_suggestObsPoint").textContent);
    if ((point < 0 && currentObsPoint > 20) || (point > 0 && currentObsPoint < 60)) {
        document.getElementById("OBS_suggestObsPoint").textContent = currentObsPoint + point;
        OBS_pointChange += point;
    }
}

function OBS_rowTiming() {
    clearInterval(downloadTimer);
    document.getElementById("OBS_rowObsTime").textContent = 15;
    let timeleft = 14;
    downloadTimer = setInterval(function () {
        document.getElementById("OBS_rowObsTime").textContent = timeleft;
        if (timeleft <= 0) {
            clearInterval(downloadTimer);
        }
        timeleft -= 1;
    }, 1000);
}

function OBS_deleteSignal() {
    for (let i = 1; i <= 4; i++) {
        document.getElementById("p" + i).style.border = "calc(5vw/96) dotted grey";
        document.getElementById("signal" + i).textContent = "";
        document.getElementById("check" + i).checked = false;
    }
}

function OBS_adminGetRoundData() {
    socket.emit("OBS_adminGetRoundData");
}

socket.on("_OBS_adminGetRoundData", function (data) {
    let temp = "";
    let OBS_Length = data.OBS_CNV.answer.replace(/\s/g, "").length;
    temp += "<div>Chướng ngại vật có " + OBS_Length + " kí tự: <font color='cyan'><b>" + data.OBS_CNV.answer + "</b></font></div>";
    temp += "<table id='OBS_Table'>";
    temp += "<tr><th class='OBS_rows'>HN</th><th class='OBS_length'>Kí tự</th><th class='OBS_sound'>Sound</th><th class='OBS_rowStatus'>Trạng thái</th><th class='OBS_imgStatus'>Ảnh</th></tr>";

    function order(i) {
        if (i == 5) return "TT";
        return i;
    }

    function addMedia(mediaUrl) {
        if (getMediaType(mediaUrl) == "audio") {
            return "Có";
        }
        return "Không";
    }

    for (let i = 1; i <= 5; i++) {
        temp +=
            "<tr><td>" +
            order(i) +
            "</td><td>" +
            data.OBS_QnA[i - 1].rowLength +
            "</td><td>" +
            addMedia(data.OBS_QnA[i - 1].media) +
            "</td><td id='OBS_row" +
            i +
            "Status'>Chưa mở</td><td id='OBS_imgCorner" +
            i +
            "Status'>Chưa mở</td></tr>";
    }
    document.getElementById("OBS_Info").innerHTML = "";
    document.getElementById("OBS_Info").innerHTML += temp;
});

function OBS_showNumberOfCharacter() {
    socket.emit("OBS_showNumberOfCharacter");
}

function OBS_showRows() {
    Confirm();
    socket.emit("OBS_showRows");
    OBS_rowSelected = [false, false, false, false, false];
    OBS_imgCornerOpened = [false, false, false, false, false];
    document.getElementById("OBS_Info").innerHTML += "<div></div>";
}

function OBS_chooseRow() {
    let rowIth = Number(document.getElementById("OBS_ithRow").value);
    OBS_rowSelected[rowIth - 1] = true;
    let count = 0;
    for (let i = 0; i < 5; i++) {
        if (OBS_rowSelected[i] == true) count++;
    }
    document.getElementById("OBS_suggestObsPoint").textContent = 60 - (count - 1) * 10 + OBS_pointChange >= 20 ? 60 - (count - 1) * 10 + OBS_pointChange : 20;

    for (let i = 1; i <= 4; i++) {
        document.getElementById("answer" + i).textContent = "";
    }
    socket.emit("OBS_chooseRow", rowIth);
}

function OBS_showRowQuestion() {
    let rowIth = document.getElementById("OBS_ithRow").value;
    socket.emit("OBS_showRowQuestion", rowIth);
}

socket.on("_OBS_showRowQuestion", function (question) {
    updateMediaButton("none");
    if (getMediaType(question.media) == "audio") updateMediaButton("auto");
    setQuestionData(question);
});

function OBS_closeRowQuestion() {
    updateMediaButton("none");
    socket.emit("OBS_closeRowQuestion");
}

function OBS_start15s() {
    OBS_rowTiming();
    socket.emit("OBS_start15s");
}

function OBS_last15s() {
    OBS_rowTiming();
    socket.emit("OBS_last15s");
}

socket.on("_sendAnswer", function (answerData) {
    let answerLabel = "answer" + answerData.playerNumber;
    document.getElementById(answerLabel).innerHTML = answerData.playerAnswer;
});

socket.on("_OBS_playerObsSignal", function (signalData) {
    document.getElementById("signal" + signalData.playerNumber).innerHTML = signalData.OBS_numberOfObsSignal;
    document.getElementById("p" + signalData.playerNumber).style.border = "calc(5vw/48) solid #73f7ff";
    let name = document.getElementById("name" + signalData.playerNumber).textContent;
    let numberOfPlayer = signalData.playerNumber;
    socket.emit("OBS_serverObsSignal", { name, numberOfPlayer });
});

function OBS_AnswerUI() {
    socket.emit("OBS_AnswerUI");
}

function OBS_showRowAnswer() {
    let answer = ["", "", "", ""];
    let name = ["", "", "", ""];
    for (let i = 0; i < 4; i++) {
        answer[i] = document.getElementById("answer" + (i + 1)).textContent;
        name[i] = document.getElementById("name" + (i + 1)).textContent;
    }
    socket.emit("OBS_showRowAnswer", { answer, name });
}

function OBS_backScreen() {
    socket.emit("OBS_backScreen", OBS_imgCornerOpened);
}

function OBS_rightRow() {
    updateMediaButton("none");
    let currentRow = document.getElementById("OBS_ithRow").value;
    let point;
    socket.emit("OBS_playRightRow", currentRow);
    for (let i = 1; i <= 4; i++) {
        if (document.getElementById("check" + i).checked == true) {
            point = document.getElementById("player" + i + "Point").value;
            document.getElementById("player" + i + "Point").value = Number(point) + 10;
        } else {
            socket.emit("OBS_wrongRow", i);
        }
        document.getElementById("check" + i).checked = false;
    }
    Confirm();
}

function OBS_wrongRow() {
    updateMediaButton("none");
    let currentRow = document.getElementById("OBS_ithRow").value;
    for (let i = 1; i <= 4; i++) {
        document.getElementById("check" + i).checked = false;
        socket.emit("OBS_wrongRow", i);
    }
    socket.emit("OBS_playWrongRow", currentRow);
}

function OBS_ImageUI() {
    socket.emit("OBS_ImageUI");
}

function OBS_openCorner() {
    let currentRow = document.getElementById("OBS_ithRow").value;
    OBS_imgCornerOpened[Number(currentRow) - 1] = true;
    socket.emit("OBS_openCorner", currentRow);
}

function OBS_rightObs() {
    let currentObsPoint = Number(document.getElementById("OBS_suggestObsPoint").textContent);
    for (let i = 1; i <= 4; i++) {
        if (document.getElementById("check" + i).checked == true) {
            let value = document.getElementById("signal" + i).textContent;
            socket.emit("OBS_rightObs", value);
            let point = Number(document.getElementById("player" + i + "Point").value);
            document.getElementById("player" + i + "Point").value = point + currentObsPoint;
        }
        document.getElementById("check" + i).checked = false;
    }
    Confirm();
}

function OBS_wrongObs() {
    for (let i = 1; i <= 4; i++) {
        document.getElementById("p" + i).style.border = "calc(5vw/96) dotted grey";
        document.getElementById("signal" + i).textContent = "";
        document.getElementById("check" + i).checked = false;
    }
    socket.emit("OBS_wrongObs");
}

function OBS_showObstacle() {
    updateMediaButton("none");
    socket.emit("OBS_showObs");
}

//TĂNG TỐC
function ACC_printPlayerVideoStatus() {
    let dad = document.getElementById("ACC_Info");
    dad.innerHTML += "<div id='ACC_playerVideoStatus'>";
    let status = document.getElementById("ACC_playerVideoStatus");
    status.innerHTML = "";
    status.innerHTML += "<div>Trạng thái load video của thí sinh:</div>";
    status.innerHTML += "<div id='ACC_Status1'>TS1: <font color='#FF6961'>Chưa tải được video</font></div>";
    status.innerHTML += "<div id='ACC_Status2'>TS2: <font color='#FF6961'>Chưa tải được video</font></div>";
    status.innerHTML += "<div id='ACC_Status3'>TS3: <font color='#FF6961'>Chưa tải được video</font></div>";
    status.innerHTML += "<div id='ACC_Status4'>TS4: <font color='#FF6961'>Chưa tải được video</font></div>";
    dad.innerHTML += "<div id='ACC_Media'>";
    let media = document.getElementById("ACC_Media");
    media.innerHTML += "<img id='ACC_Image'>";
    media.innerHTML += "<video id='ACC_Video'></video>";
}

function ACC_chooseQuestion() {
    socket.emit("ACC_chooseQuestion");
    Confirm();
}

function ACC_openQuestion() {
    for (let i = 1; i <= 4; i++) {
        document.getElementById("ACC_Status" + i).innerHTML = "TS" + i + ": <font color='#FF6961'>Chưa tải được video</font></div>";
    }
    let ithQuestion = Number(document.getElementById("ACC_ithQuestion").value);
    socket.emit("ACC_openQuestion", ithQuestion);
}

socket.on("_ACC_openQuestion", function (question) {
    setQuestionData(question);
    if (question.type == "Video") {
        document.getElementById("ACC_Video").src = question.source;
        document.getElementById("ACC_Video").style.visibility = "visible";
        document.getElementById("ACC_Image").style.visibility = "hidden";
    } else {
        document.getElementById("ACC_Image").src = question.source;
        document.getElementById("ACC_Video").style.visibility = "hidden";
        document.getElementById("ACC_Image").style.visibility = "visible";
    }
});

socket.on("_ACC_checkVideoSource", function (playerNumber) {
    document.getElementById("ACC_Status" + playerNumber).innerHTML = "TS" + playerNumber + ": <font color='greenyellow'>Đã tải được video</font>";
});

function ACC_timing(time) {
    clearInterval(downloadTimer);
    document.getElementById("ACC_Time").textContent = time;
    let timeleft = time - 1;
    downloadTimer = setInterval(function () {
        document.getElementById("ACC_Time").textContent = timeleft;
        if (timeleft <= 0) {
            clearInterval(downloadTimer);
        }
        timeleft -= 1;
    }, 1000);
}

function ACC_startTiming() {
    for (let i = 1; i <= 4; i++) {
        document.getElementById("time" + i).textContent = "0.00";
        document.getElementById("answer" + i).textContent = "";
    }
    let ithQuestion = Number(document.getElementById("ACC_ithQuestion").value);
    ACC_timing(ithQuestion * 10);
    socket.emit("ACC_startTiming", ithQuestion);
}

socket.on("_ACC_startTiming", function () {
    document.getElementById("ACC_Video").play();
});

socket.on("_ACC_sentAnswer", function (serverData) {
    let answerLabel = "answer" + serverData.answerData.playerNumber;
    document.getElementById(answerLabel).innerHTML = serverData.answerData.playerAnswer;
    let timeLabel = "time" + serverData.answerData.playerNumber;
    document.getElementById(timeLabel).innerHTML = serverData.costTime;
});

function ACC_showAnswers() {
    let answerData = [];
    for (let i = 0; i < 4; i++) {
        answerData[i] = {};
        answerData[i].answer = document.getElementById("answer" + (i + 1)).textContent;
        answerData[i].name = document.getElementById("name" + (i + 1)).textContent;
        answerData[i].time = Number(document.getElementById("time" + (i + 1)).textContent);
    }
    answerData.sort(function (a, b) {
        return a.time - b.time;
    });

    let ACC_rank = 0;
    for (let i = 0; i < 4; i++) {
        if (answerData[i].time == 0) answerData[i].time = "0.00";
        for (let j = 0; j < 4; j++) {
            if (document.getElementById("time" + (j + 1)).textContent == answerData[i].time && answerData[i].answer != "") {
                document.getElementById("signal" + (j + 1)).textContent = ++ACC_rank;
                break;
            }
        }
    }
    socket.emit("ACC_showAnswers", answerData);
}

function ACC_showQuestionAnswer() {
    let ithQuestion = Number(document.getElementById("ACC_ithQuestion").value);
    socket.emit("ACC_showQuestionAnswer", ithQuestion);
}

socket.on("_ACC_showQuestionAnswer", function (ACC_Data) {
    if (ACC_Data.type == "Image") {
        document.getElementById("ACC_Image").src = ACC_Data.answerImage;
    }
});

function ACC_countPoint(ACC_playerAnswerInfo) {
    let currentPoint = 40;
    let firstRight = false;
    let point = 0;
    for (let i = 0; i < 4; i++) {
        if (ACC_playerAnswerInfo[i].checked) {
            if (!firstRight) {
                ACC_playerAnswerInfo[i].point = currentPoint;
                firstRight = true;
            } else {
                if (ACC_playerAnswerInfo[i].time != ACC_playerAnswerInfo[i - 1].time) {
                    currentPoint -= 10;
                }
                ACC_playerAnswerInfo[i].point = currentPoint;
            }
        }
        document.getElementById("check" + (i + 1)).checked = false;
        point = Number(document.getElementById("player" + ACC_playerAnswerInfo[i].playerNumber + "Point").value);
        document.getElementById("player" + ACC_playerAnswerInfo[i].playerNumber + "Point").value = point + ACC_playerAnswerInfo[i].point;
    }
    Confirm();
}

function ACC_Right() {
    let ACC_playerAnswerInfo = [];
    for (let i = 1; i <= 4; i++) {
        ACC_playerAnswerInfo[i - 1] = {};
        ACC_playerAnswerInfo[i - 1].time = Number(document.getElementById("time" + i).textContent);
        ACC_playerAnswerInfo[i - 1].playerNumber = i;
        ACC_playerAnswerInfo[i - 1].checked = document.getElementById("check" + i).checked;
        ACC_playerAnswerInfo[i - 1].point = 0;
        ACC_playerAnswerInfo[i - 1].signal = document.getElementById("signal" + i).textContent;
    }
    ACC_playerAnswerInfo.sort(function (a, b) {
        return a.time - b.time;
    });
    socket.emit("ACC_Right", ACC_playerAnswerInfo);
    ACC_countPoint(ACC_playerAnswerInfo);
}

function ACC_Wrong() {
    for (let i = 1; i <= 4; i++) {
        document.getElementById("check" + i).checked = false;
    }
    socket.emit("ACC_Wrong");
}

function ACC_turnOffQuestion() {
    socket.emit("ACC_turnOffQuestion");
}

function ACC_clearData() {
    for (let i = 1; i <= 4; i++) {
        document.getElementById("signal" + i).textContent = "";
        document.getElementById("answer" + i).textContent = "";
        document.getElementById("time" + i).textContent = "0.00";
    }
}

function ACC_questionScreen() {
    socket.emit("ACC_questionScreen");
}

function ACC_answerScreen() {
    socket.emit("ACC_answerScreen");
}

function FIN_choosePlayer() {
    FIN_currentPlayer = document.getElementById("FIN_ithPlayer").value;
    socket.emit("FIN_choosePlayer", FIN_currentPlayer);
    document.getElementById("FIN_chooseQuestionBoard").innerHTML = "";
}

function FIN_showQuestionPack() {
    document.getElementById("FIN_chooseQuestionBoard").innerHTML = "";
    let temp = '<table id="FIN_Board">';
    temp += "<tr>";
    temp += '<th id="blank"><button id="FIN_packChosen" onclick="FIN_packChosen()">CHỐT GÓI</button></th>';
    temp += "<th>Câu 1</th>";
    temp += "<th>Câu 2</th>";
    temp += "<th>Câu 3</th>";
    temp += "</tr>";
    temp += "<tr>";
    temp += '<td style="color: #f1a621">20 điểm</td>';
    temp += '<td><input type="radio" name="1" value="20" onclick="FIN_Choose(this)"></td>';
    temp += '<td><input type="radio" name="2" value="20" onclick="FIN_Choose(this)"></td>';
    temp += '<td><input type="radio" name="3" value="20" onclick="FIN_Choose(this)"></td>';
    temp += "</tr>";
    temp += "<tr>";
    temp += '<td style="color: #f1a621">30 điểm</td>';
    temp += '<td><input type="radio" name="1" value="30" onclick="FIN_Choose(this)"></td>';
    temp += '<td><input type="radio" name="2" value="30" onclick="FIN_Choose(this)"></td>';
    temp += '<td><input type="radio" name="3" value="30" onclick="FIN_Choose(this)"></td>';
    temp += "</tr>";
    temp += "</table>";
    document.getElementById("FIN_chooseQuestionBoard").innerHTML += temp;
    document.getElementById("FIN_chooseQuestionBoard").style.visibility = "visible";
    socket.emit("FIN_showQuestionPack");
}

function FIN_Choose(input) {
    let ithQuestion = input.name;
    let ithPoint = input.value;
    socket.emit("FIN_Choose", { ithQuestion, ithPoint });
}

function FIN_packChosen() {
    let list = ["", "", ""];
    let selection = document.getElementById("FIN_chooseQuestionBoard");
    for (let i = 1; i <= 3; i++) {
        let temp = selection.querySelectorAll(`input[name="${i}"]`);
        for (let j = 0; j < 3; j++) {
            if (temp[j].checked) {
                list[i - 1] = temp[j].value;
                break;
            }
        }
    }
    socket.emit("FIN_packChosen", list);
    document.getElementById("FIN_Board").style.pointerEvents = "none";
}

function FIN_chooseQuestion() {
    let ithQuestion = document.getElementById("FIN_ithQuestion").value;
    socket.emit("FIN_chooseQuestion", ithQuestion);
}

socket.on("_FIN_chooseQuestion", function (question) {
    setQuestionData(question.questionData);
    document.getElementById("FIN_Media").innerHTML = "";
    updateMediaButton("none");
    let mediaType = getMediaType(question.questionData.media);
    if (mediaType == "audio" || mediaType == "video") updateMediaButton("auto");
    else if (mediaType == "image") document.getElementById("FIN_Media").innerHTML += "<img src='" + question.questionData.media + "'>";
    FIN_currentQuestionPoint = Number(question.questionData.point);
    if (FIN_currentQuestionPoint == 10) document.getElementById("FIN_Time").textContent = 10;
    else if (FIN_currentQuestionPoint == 20) document.getElementById("FIN_Time").textContent = 15;
    else document.getElementById("FIN_Time").textContent = 20;
});

function FIN_startTiming() {
    let timeleft;
    clearInterval(downloadTimer);
    timeleft = 9 + (FIN_currentQuestionPoint - 10) / 2;
    questionTime = timeleft + 1;
    document.getElementById("FIN_Time").textContent = questionTime;
    socket.emit("FIN_startTiming", questionTime);
    timeleft = 9 + (FIN_currentQuestionPoint - 10) / 2;
    downloadTimer = setInterval(function () {
        document.getElementById("FIN_Time").textContent = timeleft;
        if (timeleft <= 0) {
            clearInterval(downloadTimer);
        }
        timeleft -= 1;
    }, 1000);
}

function FIN_Star() {
    socket.emit("FIN_Star", !FIN_isStarOn);
    if (FIN_isStarOn) {
        FIN_isStarOn = false;
        document.getElementById("FIN_starStatus").textContent = "Trạng thái: Đang tắt";
    } else {
        FIN_isStarOn = true;
        document.getElementById("FIN_starStatus").textContent = "Trạng thái: Đang bật";
    }
}

function FIN_Right() {
    if (FIN_signalPlayer) {
        //có người giật chuông đúng
        point = Number(document.getElementById("player" + FIN_signalPlayer + "Point").value);
        point += FIN_currentQuestionPoint;
        document.getElementById("player" + FIN_signalPlayer + "Point").value = point;
        if (!FIN_isStarOn) {
            //không sao thì trừ điểm hút
            point = Number(document.getElementById("player" + FIN_currentPlayer + "Point").value);
            point -= FIN_currentQuestionPoint;
            if (point < 0) point = 0;
            document.getElementById("player" + FIN_currentPlayer + "Point").value = point;
        }
    } else {
        //main đúng
        point = Number(document.getElementById("player" + FIN_currentPlayer + "Point").value);
        if (FIN_isStarOn) point += 2 * FIN_currentQuestionPoint;
        else point += FIN_currentQuestionPoint;
        document.getElementById("player" + FIN_currentPlayer + "Point").value = point;
    }
    Confirm();
    socket.emit("FIN_Right");
}

function FIN_5s() {
    if (FIN_isStarOn) {
        let currentPlayer = document.getElementById("FIN_ithPlayer").value;
        let point = Number(document.getElementById("player" + currentPlayer + "Point").value);
        point -= FIN_currentQuestionPoint;
        if (point < 0) point = 0;
        document.getElementById("player" + currentPlayer + "Point").value = point;
    }
    socket.emit("FIN_5s");
    clearInterval(downloadTimer);
    document.getElementById("FIN_Time").textContent = 5;
    let timeleft = 4;
    downloadTimer = setInterval(function () {
        document.getElementById("FIN_Time").textContent = timeleft;
        if (timeleft <= 0) {
            clearInterval(downloadTimer);
        }
        timeleft -= 1;
    }, 1000);
    Confirm();
}

socket.on("_FIN_blockSignal", function (playerNumber) {
    FIN_signalPlayer = playerNumber;
    document.getElementById("p" + playerNumber).style.border = "calc(5vw/48) solid #73f7ff";
});

function FIN_deleteSignal() {
    FIN_signalPlayer = 0;
    for (let i = 1; i <= 4; i++) {
        document.getElementById("p" + i).style.border = "calc(5vw/96) dotted grey";
    }
}

function FIN_Wrong() {
    if (FIN_signalPlayer) {
        let point = Number(document.getElementById("player" + FIN_signalPlayer + "Point").value);
        point -= FIN_currentQuestionPoint / 2;
        if (point < 0) point = 0;
        document.getElementById("player" + FIN_signalPlayer + "Point").value = point;
    }
    Confirm();
    socket.emit("FIN_Wrong");
}

function FIN_finishTurn() {
    updateMediaButton("none");
    document.getElementById("FIN_Media").innerHTML = "";
    document.getElementById("FIN_ithQuestion").value = "";
    document.getElementById("FIN_chooseQuestionBoard").innerHTML = "";
    socket.emit("FIN_finishTurn");
}

function SFI_choosePlayers() {
    document.getElementById("SFI_Players").style.pointerEvents = "auto";
    if (document.getElementById("SFI_startRound")) document.getElementById("SFI_startRound").style.display = "block";
    temp = document.getElementById("SFI_Players");
    temp.innerHTML = "";
    for (let i = 1; i <= 4; i++) {
        temp.innerHTML += '<span class="button" data-ispicked="false" id="SFI_' + i + '" onclick="SFI_Pick(this)"></span> ';
        document.getElementById("SFI_" + i).textContent = document.getElementById("player" + i + "Name").value;
    }
    temp.innerHTML += '<span class="button" id="SFI_startRound" onclick="SFI_startRound()">Bắt đầu vòng thi</span>';
    temp.innerHTML += "<br>";
}

function SFI_Pick(buttonData) {
    if (buttonData.getAttribute("data-ispicked") == "false") {
        document.getElementById(buttonData.id).style.border = "calc(5vw/48) solid #df2453";
        document.getElementById(buttonData.id).dataset.ispicked = "true";
    } else {
        document.getElementById(buttonData.id).style.border = "calc(5vw/48) solid #f1a621";
        document.getElementById(buttonData.id).dataset.ispicked = "false";
    }
}

function SFI_startRound() {
    if (document.getElementById("UIName").textContent == "Phòng chat") UI();
    let SFI_Chosen = [];
    document.getElementById("SFI_Players").style.pointerEvents = "none";
    document.getElementById("SFI_startRound").style.display = "none";
    for (let i = 1; i <= 4; i++) {
        if (document.getElementById("SFI_" + i).getAttribute("data-ispicked") == "true") {
            socket.emit("SFI_chosenPlayer", i);
            SFI_Chosen.push(Number(i));
        }
    }
    socket.emit("SFI_startRound", SFI_Chosen);
}

function SFI_openQuestion() {
    document.getElementById("SFI_Time").textContent = "15.00";
    SFI_deleteSignal();
    let ithQuestion = document.getElementById("SFI_ithQuestion").value;
    socket.emit("SFI_openQuestion", ithQuestion);
}

socket.on("_SFI_openQuestion", function (question) {
    setQuestionData(question.questionData);
});

function SFI_closeQuestion() {
    socket.emit("SFI_closeQuestion");
}

function SFI_Timing(startTime, leftTime) {
    let currentTime;
    document.getElementById("SFI_clockStatus").textContent = "Đang chạy";
    downloadTimer = setInterval(function () {
        currentTime = (Date.now() / 1000).toFixed(2);
        document.getElementById("SFI_Time").textContent = (leftTime - (Number(currentTime) - Number(startTime))).toFixed(2);
        if (Number(currentTime) >= Number(startTime) + leftTime) {
            document.getElementById("SFI_Time").textContent = "0.00";
            clearInterval(downloadTimer);
            socket.emit("SFI_blockButton");
        }
    }, 1);
}

function SFI_startTiming() {
    clearInterval(downloadTimer);
    let startTime = (Date.now() / 1000).toFixed(2);
    SFI_Timing(startTime, 15);
    socket.emit("SFI_Timing", true);
}

function SFI_Right() {
    socket.emit("SFI_Right");
}

function SFI_Continue() {
    SFI_deleteSignal();
    clearInterval(downloadTimer);
    let startTime = (Date.now() / 1000).toFixed(2);
    SFI_Timing(startTime, SFI_timeLeft);
    socket.emit("SFI_Timing", false);
}

socket.on("_SFI_blockSignal", function (playerNumber) {
    SFI_timeLeft = Number(document.getElementById("SFI_Time").textContent);
    SFI_signalPlayer = playerNumber;
    clearInterval(downloadTimer);
    document.getElementById("p" + playerNumber).style.border = "calc(5vw/48) solid #73f7ff";
    document.getElementById("SFI_clockStatus").textContent = "Đang dừng";
});

function SFI_deleteSignal() {
    for (let i = 1; i <= 4; i++) {
        document.getElementById("p" + i).style.border = "calc(5vw/96) dotted grey";
    }
}

function result() {
    socket.emit("result");
}

function endGame() {
    socket.emit("endGame");
    updateMediaButton("none");
    document.getElementById("RoundMenu").innerHTML = "";
    document.getElementById("STR_Info").innerHTML = "";
    document.getElementById("OBS_Info").innerHTML = "";
    document.getElementById("ACC_Info").innerHTML = "";
    document.getElementById("FIN_Media").innerHTML = "";
    document.getElementById("FIN_chooseQuestionBoard").innerHTML = "";
    closeEndPart();
    if (document.getElementById("UIName").textContent == "Phòng thi") UI();
}

//SOUND NGOÀI
function OUT_introVideo() {
    socket.emit("OUT_introVideo");
}

function OUT_introAudio() {
    socket.emit("OUT_introAudio");
}

function OUT_MC() {
    socket.emit("OUT_MC");
}

function OUT_Player() {
    socket.emit("OUT_Player");
}

function OUT_Introduce(button) {
    socket.emit("OUT_Introduce", button.name);
}

function OUT_Flower(button) {
    socket.emit("OUT_Flower", button.name);
}

function OUT_Ambience() {
    socket.emit("OUT_Ambience");
}

function OUT_Result(button) {
    socket.emit("OUT_Result", button.name);
}

function OUT_Prize(button) {
    socket.emit("OUT_Prize", button.name);
}

function OUT_closeAllAudio() {
    socket.emit("OUT_closeAllAudio");
}
