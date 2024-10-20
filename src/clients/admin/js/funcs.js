import * as main from "./main.js";
import * as start from "./round/start.js";
import * as obstacle from "./round/obstacle.js";
import * as acceleration from "./round/acceleration.js";
import * as finish from "./round/finish.js";
import * as subFinish from "./round/sub-finish.js";

export const assignButton = () => {
    //head
    window.closeExtraUI = closeExtraUI;
    window.openDatabase = openDatabase;
    window.openMedia = openMedia;

    //tech
    window.chooseDatabase = chooseDatabase;
    window.chooseRound = chooseRound;
    window.changeInterface = changeInterface;
    window.resetStatus = resetStatus;
    window.summarize = summarize;
    window.finishRound = finishRound;
    window.playIntro = playIntro;
    window.startRound = startRound;
    window.blankSound = blankSound;
    window.playMedia = playMedia;
    window.closeMedia = closeMedia;

    //player
    window.sendPlayerData = sendPlayerData;
};

export const sendPlayerData = () => {
    const currentPlayerPoint = [];
    const currentPlayerName = [];
    for (let i = 1; i <= 4; i++) {
        currentPlayerPoint[i - 1] = Number(document.getElementById("player-point-" + i).value);
        currentPlayerName[i - 1] = document.getElementById("player-name-" + i).value;
        document.getElementById("name-" + i).textContent = currentPlayerName[i - 1];
    }
    main.socket.emit("sendAdminData", { currentPlayerPoint, currentPlayerName });
};

export const closeEndPart = () => {
    document.getElementById("finish-round").style.visibility = "hidden";
};

export const openEndPart = () => {
    document.getElementById("finish-round").style.visibility = "visible";
};

//MỞ TRANG CSDL
const openDatabase = () => {
    document.getElementById("blur-background").style.zIndex = 9;
    document.getElementById("database-interface").style.zIndex = 10;
    document.getElementById("blur-background").style.visibility = "visible";
    document.getElementById("database-interface").style.visibility = "visible";
};

//MỞ MEDIA NGOÀI
const openMedia = () => {
    document.getElementById("blur-background").style.zIndex = 9;
    document.getElementById("media").style.zIndex = 10;
    document.getElementById("blur-background").style.visibility = "visible";
    document.getElementById("media").style.visibility = "visible";
};

const closeExtraUI = () => {
    document.getElementById("blur-background").style.zIndex = -9;
    document.getElementById("database-interface").style.zIndex = -10;
    document.getElementById("media").style.zIndex = -10;
    document.getElementById("blur-background").style.visibility = "hidden";
    document.getElementById("database-interface").style.visibility = "hidden";
    document.getElementById("media").style.visibility = "hidden";
};

//CHỌN CSDL
const chooseDatabase = () => {
    const databaseNumber = Number(document.getElementById("database-number").value);
    main.socket.emit("adminChooseDb", databaseNumber);
};

const resetStatus = () => {
    if (main.roundID == 2) {
        obstacle.resetRound();
    } else if (main.roundID == 4) {
        finish.resetRound();
    } else if (main.roundID == 5) {
        subFinish.resetRound();
    }
    main.socket.emit("resetStatus", main.roundID);
};

const chooseRound = () => {
    document.getElementById("OBS_info").innerHTML = "";
    document.getElementById("ACC_info").innerHTML = "";
    document.getElementById("FIN_choose-question-board").innerHTML = "";
    main.updateRoundID(Number(document.getElementById("rounds").value));
    main.socket.emit("roundChosen", main.roundID);
    const temp = document.getElementById("round-controller");
    temp.innerHTML = "";
    if (main.roundID == "1") {
        temp.innerHTML += "<div class='technical-title'>TRONG PHẦN THI</div>";
        temp.innerHTML += '<span class="button" onclick="playIntro()"><i class="fa-solid fa-film"></i>&nbsp&nbspIntro</span> ';
        temp.innerHTML += '<span class="button" onclick="startRound()"><i class="fa-solid fa-play"></i>&nbsp&nbspBắt đầu</span> ';
        temp.innerHTML += '<span class="button" onclick="blankSound()"><i class="fa-regular fa-square"></i>&nbsp&nbspKhoảng trắng</span><br>';
        temp.innerHTML += "<span class='text'>Lượt:&nbsp</span>";
        temp.innerHTML +=
            '<select id="STR_player-number"><option value="1">1</option><option value="2">2</option><option value="3">3</option><option value="4">4</option><option value="5">Chung</option></select> ';
        temp.innerHTML += '<span class="button" onclick="choosePlayer()"><i class="fa-solid fa-check"></i>&nbsp&nbspXác nhận</span><br>';
        temp.innerHTML += '<span class="button" onclick="startPlayerTurn()"><i class="fa-solid fa-user-check"></i>&nbsp&nbspVào lượt</span> ';
        temp.innerHTML += '<span class="button" onclick="openQuestionBoard()"><i class="fa-solid fa-chess-board"></i>&nbsp&nbspMở bảng câu hỏi</span> ';
        temp.innerHTML += '<span class="button" onclick="startTurn()"><i class="fa-regular fa-circle-question"></i>&nbsp&nbspBắt đầu lượt thi</span><br>';
        temp.innerHTML += "<span class='text'>Khu vực media:&nbsp</span>";
        temp.innerHTML += '<span class="button" id="play-media" onclick="playMedia()"><i class="fa-solid fa-play"></i>&nbsp&nbspPhát media</span> ';
        temp.innerHTML += '<span class="button" id="close-media" onclick="closeMedia()"><i class="fa-solid fa-pause"></i>&nbsp&nbspDừng media</span><br>';
        temp.innerHTML += "<span class='text'>Thời gian:&nbsp</span>";
        temp.innerHTML += '<span class="text" id="STR_time">0</span><br>';
        temp.innerHTML += "<span class='text'>Đếm ngược:&nbsp</span>";
        temp.innerHTML += '<span class="button" onclick="count5s()"><i class="fa-solid fa-hourglass-start"></i>&nbsp&nbsp5s trả lời</span> ';
        temp.innerHTML += '<span class="button" onclick="count3s()"><i class="fa-solid fa-hourglass-start"></i>&nbsp&nbsp3s khoá chuông</span><br>';
        temp.innerHTML += "<span class='text'>Chấm/Đổi:&nbsp</span>";
        temp.innerHTML += '<span class="button" onclick="right()"><i class="fa-regular fa-circle-check"></i>&nbsp&nbspĐúng</span> ';
        temp.innerHTML += '<span class="button" onclick="wrong()"><i class="fa-regular fa-circle-xmark"></i>&nbsp&nbspSai</span> ';
        temp.innerHTML += '<span class="button" onclick="getNextQuestion()"><i class="fa-solid fa-angles-right"></i>&nbsp&nbspChuyển câu</span><br>';
        temp.innerHTML += "<span class='text'>Khoá chuông 3s khi sang câu mới:&nbsp</span>";
        temp.innerHTML += '<span class="button" onclick="block3s()" id="block-signal"><i class="fa-solid fa-hourglass-start"></i>&nbsp&nbspMở</span><br>';
        temp.innerHTML += '<span class="button" onclick="finishTurn()"><i class="fa-solid fa-flag-checkered"></i>&nbsp&nbspHoàn thành lượt</span>';
        openEndPart();
        start.assignButton();
    } else if (main.roundID == "2") {
        obstacle.adminGetRoundData();
        temp.innerHTML += "<div class='technical-title'>TRONG PHẦN THI</div>";
        temp.innerHTML += '<span class="button" onclick="playIntro()"><i class="fa-solid fa-film"></i>&nbsp&nbspIntro</span> ';
        temp.innerHTML += '<span class="button" onclick="startRound()"><i class="fa-solid fa-play"></i>&nbsp&nbspBắt đầu</span> ';
        temp.innerHTML += '<span class="button" onclick="blankSound()"><i class="fa-regular fa-square"></i>&nbsp&nbspKhoảng trắng</span><br>';
        temp.innerHTML += '<span class="button" onclick="showNumberOfCharacter()"><i class="fa-solid fa-arrow-down-1-9"></i>&nbsp&nbspTiết lộ số kí tự</span> ';
        temp.innerHTML += '<span class="button" onclick="showRows()"><i class="fa-solid fa-chess-board"></i>&nbsp&nbspHiện hàng ngang</span><br>';
        temp.innerHTML += "<span class='text'>Chọn hàng ngang số:&nbsp</span>";
        temp.innerHTML +=
            '<select id="OBS_row-number"><option value="1">1</option><option value="2">2</option><option value="3">3</option><option value="4">4</option><option value="5">Trung tâm</option></select> ';
        temp.innerHTML += '<span class="button" onclick="chooseRow()"><i class="fa-solid fa-user-check"></i>&nbsp&nbspXác nhận</span><br>';
        temp.innerHTML += "<span class='text'>Khu vực câu hỏi:&nbsp</span>";
        temp.innerHTML += '<span class="button" onclick="showRowQuestion()"><i class="fa-regular fa-circle-question"></i>&nbsp&nbspMở câu hỏi</span> ';
        temp.innerHTML += '<span class="button" onclick="closeRowQuestion()"><i class="fa-solid fa-eye-slash"></i>&nbsp&nbspTắt câu hỏi</span><br>';
        temp.innerHTML += "<span class='text'>Khu vực media:&nbsp</span>";
        temp.innerHTML += '<span class="button" id="play-media" onclick="playMedia()"><i class="fa-solid fa-play"></i>&nbsp&nbspPhát media</span> ';
        temp.innerHTML += '<span class="button" id="close-media" onclick="closeMedia()"><i class="fa-solid fa-pause"></i>&nbsp&nbspDừng media</span><br>';
        temp.innerHTML += "<span class='text'>Đếm ngược:&nbsp</span>";
        temp.innerHTML += '<span class="button" onclick="start15s()"><i class="fa-solid fa-hourglass-start"></i>&nbsp&nbsp15 giây</span> ';
        temp.innerHTML += '<span class="button" onclick="last15s()"><i class="fa-solid fa-hourglass-start"></i>&nbsp&nbsp15 giây cuối</span><br>';
        temp.innerHTML += "<span class='text'>Thời gian:&nbsp</span>";
        temp.innerHTML += '<span class="text" id="OBS_time">0</span><br>';
        temp.innerHTML += "<span class='text'>Khu vực hàng ngang:&nbsp</span>";
        temp.innerHTML += '<span class="button" onclick="showRowAnswer()"><i class="fa-solid fa-eye"></i>&nbsp&nbspHiện đáp án</span> ';
        temp.innerHTML += '<span class="button" onclick="rightRow()"><i class="fa-regular fa-circle-check"></i>&nbsp&nbspĐúng</span> ';
        temp.innerHTML += '<span class="button" onclick="wrongRow()"><i class="fa-regular fa-circle-xmark"></i>&nbsp&nbspSai</span><br>';
        temp.innerHTML += "<span class='text'>Khu vực CNV:&nbsp</span>";
        temp.innerHTML += '<span class="button" onclick="rightObs()"><i class="fa-regular fa-circle-check"></i>&nbsp&nbspĐúng CNV</span> ';
        temp.innerHTML += '<span class="button" onclick="wrongObs()"><i class="fa-regular fa-circle-xmark"></i>&nbsp&nbspSai CNV</span> ';
        temp.innerHTML += '<span class="button" onclick="showObstacle()"><i class="fa-solid fa-eye"></i>&nbsp&nbspMở CNV</span><br>';
        temp.innerHTML += "<span class='text'>Khu vực ảnh:&nbsp</span>";
        temp.innerHTML += '<span class="button" onclick="openCorner()"><i class="fa-solid fa-eye"></i>&nbsp&nbspMở góc ảnh</span><br>';
        temp.innerHTML += "<span class='text'>Giao diện:&nbsp</span>";
        temp.innerHTML += '<span class="button" onclick="backScreen()"><i class="fa-solid fa-display"></i>&nbsp&nbspHàng ngang</span> ';
        temp.innerHTML += '<span class="button" onclick="AnswerUI()"><i class="fa-solid fa-display"></i>&nbsp&nbspĐáp án</span> ';
        temp.innerHTML += '<span class="button" onclick="ImageUI()"><i class="fa-solid fa-display"></i>&nbsp&nbspGiao diện ảnh</span><br>';
        temp.innerHTML += "<span class='text'>Số điểm tối đa:&nbsp</span>";
        temp.innerHTML += '<b><span class="text">60</span></b><br>';
        temp.innerHTML += "<span class='text'>Điểm khuyến nghị CNV:&nbsp</span>";
        temp.innerHTML += '<b><span class="text" id="OBS_suggest-obs-point">60</span></b> ';
        temp.innerHTML += '<span class="button" onclick="changePoint(10)"><i class="fa-solid fa-angles-up"></i>&nbsp10</span> ';
        temp.innerHTML += '<span class="button" onclick="changePoint(-10)"><i class="fa-solid fa-angles-down"></i>&nbsp10</span><br>';
        temp.innerHTML += '<span class="button" onclick="deleteSignal()"><i class="fa-solid fa-bell-slash"></i>&nbsp&nbspXoá tín hiệu</span>';
        openEndPart();
        obstacle.assignButton();
    } else if (main.roundID == "3") {
        acceleration.printPlayerVideoStatus();
        temp.innerHTML += "<div class='technical-title'>TRONG PHẦN THI</div>";
        temp.innerHTML += '<span class="button" onclick="playIntro()"><i class="fa-solid fa-film"></i>&nbsp&nbspIntro</span> ';
        temp.innerHTML += '<span class="button" onclick="startRound()"><i class="fa-solid fa-play"></i>&nbsp&nbspBắt đầu</span> ';
        temp.innerHTML += '<span class="button" onclick="blankSound()"><i class="fa-regular fa-square"></i>&nbsp&nbspKhoảng trắng</span><br>';
        temp.innerHTML += "<span class='text'>Câu hỏi số:&nbsp</span>";
        temp.innerHTML += '<select id="ACC_question-number"><option value="1">1</option><option value="2">2</option><option value="3">3</option><option value="4">4</option></select> ';
        temp.innerHTML += '<span class="button" onclick="chooseQuestion()"><i class="fa-solid fa-user-check"></i>&nbsp&nbspXác nhận</span><br>';
        temp.innerHTML += '<span class="button" onclick="openQuestion()"><i class="fa-regular fa-circle-question"></i>&nbsp&nbspMở câu hỏi</span> ';
        temp.innerHTML += '<span class="button" onclick="startTiming()"><i class="fa-solid fa-hourglass-start"></i>&nbsp&nbspBắt đầu tính giờ</span> ';
        temp.innerHTML += '<span class="button" onclick="turnOffQuestion()"><i class="fa-solid fa-eye-slash"></i>&nbsp&nbspTắt câu hỏi</span> ';
        temp.innerHTML += '<span class="button" onclick="clearData()"><i class="fa-regular fa-trash-can"></i>&nbsp&nbspXoá dữ liệu</span><br>';
        temp.innerHTML += "<span class='text'>Thời gian:&nbsp</span>";
        temp.innerHTML += '<span class="text" id="ACC_time">0</span><br>';
        temp.innerHTML += '<span class="button" onclick="showAnswers()"><i class="fa-solid fa-eye"></i>&nbsp&nbspHiện đáp án thí sinh</span> ';
        temp.innerHTML += '<span class="button" onclick="showQuestionAnswer()"><i class="fa-solid fa-eye"></i>&nbsp&nbspHình ảnh đáp án</span><br>';
        temp.innerHTML += '<span class="button" onclick="right()"><i class="fa-regular fa-circle-check"></i>&nbsp&nbspĐúng</span> ';
        temp.innerHTML += '<span class="button" onclick="wrong()"><i class="fa-regular fa-circle-xmark"></i>&nbsp&nbspSai</span><br>';
        temp.innerHTML += '<span class="button" onclick="questionScreen()"><i class="fa-solid fa-display"></i>&nbsp&nbspGiao diện câu hỏi</span> ';
        temp.innerHTML += '<span class="button" onclick="answerScreen()"><i class="fa-solid fa-display"></i>&nbsp&nbspGiao diện đáp án</span>';
        openEndPart();
        acceleration.assignButton();
    } else if (main.roundID == "4") {
        temp.innerHTML += "<div class='technical-title'>TRONG PHẦN THI</div>";
        temp.innerHTML += '<span class="button" onclick="playIntro()"><i class="fa-solid fa-film"></i>&nbsp&nbspIntro</span> ';
        temp.innerHTML += '<span class="button" onclick="startRound()"><i class="fa-solid fa-play"></i>&nbsp&nbspBắt đầu</span> ';
        temp.innerHTML += '<span class="button" onclick="blankSound()"><i class="fa-regular fa-square"></i>&nbsp&nbspKhoảng trắng</span><br>';
        temp.innerHTML += "<span class='text'>Vị trí về đích:</span> ";
        temp.innerHTML += '<select id="FIN_player-number"><option value="1">1</option><option value="2">2</option><option value="3">3</option><option value="4">4</option></select> ';
        temp.innerHTML += '<span class="button" onclick="choosePlayer()"><i class="fa-solid fa-user-check"></i>&nbsp&nbspXác nhận</span><br>';
        temp.innerHTML += '<span class="button" onclick="showQuestionPack()"><i class="fa-solid fa-cubes"></i>&nbsp&nbspChọn gói</span><br>';
        temp.innerHTML += "<span class='text'>Câu hỏi số:</span> ";
        temp.innerHTML += '<select id="FIN_question-number"><option value="1">1</option><option value="2">2</option><option value="3">3</option></select> ';
        temp.innerHTML += '<span class="button" onclick="chooseQuestion()"><i class="fa-regular fa-circle-question"></i>&nbsp&nbspMở câu hỏi</span><br>';
        temp.innerHTML += "<span class='text'>Khu vực media:&nbsp</span>";
        temp.innerHTML += '<span class="button" id="play-media" onclick="playMedia()"><i class="fa-solid fa-play"></i>&nbsp&nbspPhát media</span> ';
        temp.innerHTML += '<span class="button" id="close-media" onclick="closeMedia()"><i class="fa-solid fa-pause"></i>&nbsp&nbspDừng media</span><br>';
        temp.innerHTML += '<span class="button" onclick="star()"><i class="fa-solid fa-star"></i>&nbsp&nbspNgôi sao hi vọng</span> ';
        temp.innerHTML += '<span class="text" id="FIN_star-status">Trạng thái: Đang tắt</span><br>';
        temp.innerHTML += '<span class="button" onclick="startTiming()"><i class="fa-solid fa-hourglass-start"></i>&nbsp&nbspBắt đầu tính giờ</span> ';
        temp.innerHTML += "<span class='text'>Thời gian:&nbsp</span>";
        temp.innerHTML += '<span class="text" id="FIN_time">0</span><br>';
        temp.innerHTML += '<span class="button" onclick="right()"><i class="fa-regular fa-circle-check"></i>&nbsp&nbspĐúng</span> ';
        temp.innerHTML += '<span class="button" onclick="count5s()"><i class="fa-solid fa-hourglass-start"></i>&nbsp&nbsp5 giây giành quyền</span> ';
        temp.innerHTML += '<span class="button" onclick="wrong()"><i class="fa-regular fa-circle-xmark"></i>&nbsp&nbspSai</span><br>';
        temp.innerHTML += '<span class="button" onclick="deleteSignal()"><i class="fa-solid fa-bell-slash"></i>&nbsp&nbspXoá tín hiệu</span><br>';
        temp.innerHTML += '<span class="button" onclick="finishTurn()"><i class="fa-solid fa-flag-checkered"></i>&nbsp&nbspHoàn thành lượt</span>';
        openEndPart();
        finish.assignButton();
    } else if (main.roundID == "5") {
        temp.innerHTML += "<div class='technical-title'>TRONG PHẦN THI</div>";
        temp.innerHTML += '<span class="button" onclick="blankSound()"><i class="fa-regular fa-square"></i>&nbsp&nbspKhoảng trắng</span><br>';
        temp.innerHTML += '<span class="button" onclick="choosePlayers()"><i class="fa-solid fa-user-check"></i>&nbsp&nbspChọn thí sinh</span><br>';
        temp.innerHTML += '<div id="SFI_players"></div>';
        temp.innerHTML += "<span class='text'>Câu hỏi số</span> ";
        temp.innerHTML += '<select id="SFI_question-number"><option value="1">1</option><option value="2">2</option><option value="3">3</option></select> ';
        temp.innerHTML += '<span class="button" onclick="openQuestion()"><i class="fa-regular fa-circle-question"></i>&nbsp&nbspMở câu hỏi</span> ';
        temp.innerHTML += '<span class="button" onclick="closeQuestion()"><i class="fa-solid fa-eye-slash"></i>&nbsp&nbspTắt câu hỏi</span><br>';
        temp.innerHTML += '<span class="button" onclick="startTiming()"><i class="fa-solid fa-hourglass-start"></i>&nbsp&nbspBắt đầu tính giờ</span> ';
        temp.innerHTML += "<span class='text'>Thời gian:&nbsp</span>";
        temp.innerHTML += '<span class="text" id="SFI_time">0</span><br>';
        temp.innerHTML += '<span class="button" onclick="right()"><i class="fa-regular fa-circle-check"></i>&nbsp&nbspĐúng</span> ';
        temp.innerHTML += '<span class="button" onclick="continueTiming()"><i class="fa-solid fa-pause"></i>&nbsp&nbspĐồng hồ</span> ';
        temp.innerHTML += "<span class='text'>Trạng thái:</span> ";
        temp.innerHTML += '<span class="text" id="SFI_clock-status">Đang dừng</span><br>';
        temp.innerHTML += '<span class="button" onclick="deleteSignal()"><i class="fa-solid fa-bell-slash"></i>&nbsp&nbspXoá tín hiệu</span>';
        openEndPart();
        subFinish.assignButton();
    }
    if (main.roundID < 5) window.startRound = startRound;
};

const playIntro = () => {
    main.socket.emit("playIntro", main.roundID);
};

const startRound = () => {
    sendPlayerData();
    main.socket.emit("startRound");
    if (document.getElementById("interface-name").textContent == "Phòng chat") changeInterface();
};

const blankSound = () => {
    main.socket.emit("blankSound");
};

export const setQuestionData = (questionData) => {
    document.getElementById("question-text").textContent = questionData.question;
    document.getElementById("answer-text").textContent = questionData.answer;
    document.getElementById("note-text").textContent = questionData.note;
};

export const changeInterface = () => {
    if (document.getElementById("interface-name").textContent == "Phòng chat") {
        document.getElementById("interface-name").innerHTML = "Phòng thi";
        main.socket.emit("contestUI");
    } else {
        document.getElementById("interface-name").innerHTML = "Phòng chat";
        main.socket.emit("chatUI");
    }
};

const playMedia = () => {
    main.socket.emit("playMedia");
};

const closeMedia = () => {
    main.socket.emit("closeMedia");
};

export const getMediaType = (mediaUrl) => {
    if (mediaUrl) {
        const extension = mediaUrl.split(".").pop().toLowerCase();
        if (extension === "jpg" || extension === "jpeg" || extension === "png" || extension === "gif") return "image";
        else if (extension === "mp4" || extension === "avi" || extension === "mov" || extension === "wmv") return "video";
        else if (extension === "mp3" || extension === "wav" || extension === "ogg") return "audio";
    }
    return "unknown";
};

export const updateMediaButton = (status) => {
    if (!document.getElementById("play-media") || !document.getElementById("close-media")) return;
    if (status == "auto") {
        document.getElementById("play-media").style.opacity = 1;
        document.getElementById("close-media").style.opacity = 1;
    } else {
        document.getElementById("play-media").style.opacity = 0.5;
        document.getElementById("close-media").style.opacity = 0.5;
    }
    document.getElementById("play-media").style.pointerEvents = status;
    document.getElementById("close-media").style.pointerEvents = status;
};

const summarize = () => {
    main.socket.emit("summarize");
};

const finishRound = () => {
    resetStatus();
    main.socket.emit("finishRound");
    updateMediaButton("none");
    document.getElementById("round-controller").innerHTML = "";
    document.getElementById("STR_info").innerHTML = "";
    document.getElementById("OBS_info").innerHTML = "";
    document.getElementById("ACC_info").innerHTML = "";
    document.getElementById("FIN_media").innerHTML = "";
    document.getElementById("FIN_choose-question-board").innerHTML = "";
    closeEndPart();
    if (document.getElementById("interface-name").textContent == "Phòng thi") changeInterface();
};
