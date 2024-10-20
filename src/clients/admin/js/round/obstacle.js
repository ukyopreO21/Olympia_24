import * as main from "../main.js";
import * as funcs from "../funcs.js";

var rowSelected;
var imgCornerOpened;
var pointChange = 0;
var downloadTimer;

export const handle = () => {
    main.socket.on("_OBS_adminGetRoundData", (data) => {
        let temp = "";
        const keyword = data[5].answer;
        const keywordLength = keyword.replace(/\s/g, "").length;
        temp += "<div>Chướng ngại vật có " + keywordLength + " kí tự: <font color='cyan'><b>" + keyword + "</b></font></div>";
        temp += "<table id='OBS_table'>";
        temp += "<tr><th class='OBS_rows'>HN</th><th class='OBS_length'>Kí tự</th><th class='OBS_sound'>Sound</th><th class='OBS_row-status'>Trạng thái</th><th class='OBS_image-status'>Ảnh</th></tr>";

        const order = (rowNumber) => {
            if (rowNumber == 5) return "TT";
            return rowNumber;
        };

        const addMedia = (mediaUrl) => {
            if (funcs.getMediaType(mediaUrl) == "audio") {
                return "Có";
            }
            return "Không";
        };

        for (let i = 1; i <= 5; i++) {
            temp +=
                "<tr><td>" +
                order(i) +
                "</td><td>" +
                data[i - 1].rowLength +
                "</td><td>" +
                addMedia(data[i - 1].mediaUrl) +
                "</td><td id='OBS_row-" +
                i +
                "Status'>Chưa mở</td><td id='OBS_image-corner-" +
                i +
                "Status'>Chưa mở</td></tr>";
        }
        document.getElementById("OBS_info").innerHTML = "";
        document.getElementById("OBS_info").innerHTML += temp;
    });

    main.socket.on("_OBS_showRowQuestion", (questionData) => {
        funcs.updateMediaButton("none");
        if (funcs.getMediaType(questionData.mediaUrl) == "audio") funcs.updateMediaButton("auto");
        funcs.setQuestionData(questionData);
    });

    main.socket.on("_OBS_signal", (signalData) => {
        document.getElementById("signal-" + signalData.playerNumber).innerHTML = signalData.numberOfSignals;
        document.getElementById("player-" + signalData.playerNumber).style.border = "calc(5vw/48) solid #73f7ff";
    });
};

export const assignButton = () => {
    window.changePoint = changePoint;
    window.rowTiming = rowTiming;
    window.deleteSignal = deleteSignal;
    window.showNumberOfCharacter = showNumberOfCharacter;
    window.showRows = showRows;
    window.chooseRow = chooseRow;
    window.showRowQuestion = showRowQuestion;
    window.closeRowQuestion = closeRowQuestion;
    window.start15s = start15s;
    window.last15s = last15s;
    window.AnswerUI = AnswerUI;
    window.showRowAnswer = showRowAnswer;
    window.backScreen = backScreen;
    window.rightRow = rightRow;
    window.wrongRow = wrongRow;
    window.ImageUI = ImageUI;
    window.openCorner = openCorner;
    window.rightObs = rightObs;
    window.wrongObs = wrongObs;
    window.showObstacle = showObstacle;
};

const changePoint = (point) => {
    const currentObsPoint = Number(document.getElementById("OBS_suggest-obs-point").textContent);
    if ((point < 0 && currentObsPoint > 20) || (point > 0 && currentObsPoint < 60)) {
        document.getElementById("OBS_suggest-obs-point").textContent = currentObsPoint + point;
        pointChange += point;
    }
};

const rowTiming = () => {
    clearInterval(downloadTimer);
    document.getElementById("OBS_time").textContent = 15;
    let timeLeft = 14;
    downloadTimer = setInterval(() => {
        document.getElementById("OBS_time").textContent = timeLeft;
        if (timeLeft <= 0) {
            clearInterval(downloadTimer);
        }
        timeLeft -= 1;
    }, 1000);
};

const deleteSignal = () => {
    for (let i = 1; i <= 4; i++) {
        document.getElementById("player-" + i).style.border = "calc(5vw/96) dotted grey";
        document.getElementById("signal-" + i).textContent = "";
        document.getElementById("check-" + i).checked = false;
    }
};

export const adminGetRoundData = () => {
    main.socket.emit("OBS_adminGetRoundData");
};

const showNumberOfCharacter = () => {
    main.socket.emit("OBS_showNumberOfCharacter");
};

const showRows = () => {
    funcs.sendPlayerData();
    main.socket.emit("OBS_showRows");
    rowSelected = [false, false, false, false, false];
    imgCornerOpened = [false, false, false, false, false];
    document.getElementById("OBS_info").innerHTML += "<div></div>";
};

const chooseRow = () => {
    const rowNumber = Number(document.getElementById("OBS_row-number").value);
    rowSelected[rowNumber - 1] = true;
    let count = 0;
    for (let i = 0; i < 5; i++) {
        if (rowSelected[i] == true) count++;
    }
    document.getElementById("OBS_suggest-obs-point").textContent = 60 - (count - 1) * 10 + pointChange >= 20 ? 60 - (count - 1) * 10 + pointChange : 20;

    for (let i = 1; i <= 4; i++) {
        document.getElementById("answer-" + i).textContent = "";
    }
    main.socket.emit("OBS_chooseRow", rowNumber);
};

const showRowQuestion = () => {
    const rowNumber = Number(document.getElementById("OBS_row-number").value);
    main.socket.emit("OBS_showRowQuestion", rowNumber);
};

const closeRowQuestion = () => {
    funcs.updateMediaButton("none");
    main.socket.emit("OBS_closeRowQuestion");
};

const start15s = () => {
    rowTiming();
    main.socket.emit("OBS_start15s");
};

const last15s = () => {
    rowTiming();
    main.socket.emit("OBS_last15s");
};

const AnswerUI = () => {
    main.socket.emit("OBS_answerUI");
};

const showRowAnswer = () => {
    const answer = ["", "", "", ""];
    const name = ["", "", "", ""];
    for (let i = 0; i < 4; i++) {
        answer[i] = document.getElementById("answer-" + (i + 1)).textContent;
        name[i] = document.getElementById("name-" + (i + 1)).textContent;
    }
    main.socket.emit("OBS_showRowAnswer", { answer, name });
};

const backScreen = () => {
    main.socket.emit("OBS_rowsUI", imgCornerOpened);
};

const rightRow = () => {
    funcs.updateMediaButton("none");
    const rowNumber = Number(document.getElementById("OBS_row-number").value);
    main.socket.emit("OBS_rightRow", rowNumber);
    const wrongPlayers = [];
    for (let i = 1; i <= 4; i++) {
        if (document.getElementById("check-" + i).checked == true) {
            const point = document.getElementById("player-point-" + i);
            point.value = Number(point.value) + 10;
        } else wrongPlayers.push(i);
        document.getElementById("check-" + i).checked = false;
    }
    main.socket.emit("OBS_wrongRow", wrongPlayers);
    funcs.sendPlayerData();
};

const wrongRow = () => {
    funcs.updateMediaButton("none");
    const rowNumber = document.getElementById("OBS_row-number").value;
    for (let i = 1; i <= 4; i++) document.getElementById("check-" + i).checked = false;
    main.socket.emit("OBS_wrongRow", [1, 2, 3, 4]);
    main.socket.emit("OBS_playWrongRow", rowNumber);
};

const ImageUI = () => {
    main.socket.emit("OBS_imageUI");
};

const openCorner = () => {
    const rowNumber = Number(document.getElementById("OBS_row-number").value);
    imgCornerOpened[rowNumber - 1] = true;
    main.socket.emit("OBS_openCorner", rowNumber);
};

const rightObs = () => {
    const currentObsPoint = Number(document.getElementById("OBS_suggest-obs-point").textContent);
    for (let i = 1; i <= 4; i++) {
        if (document.getElementById("check-" + i).checked == true) {
            const value = Number(document.getElementById("signal-" + i).textContent);
            main.socket.emit("OBS_rightObs", value);
            const point = document.getElementById("player-point-" + i);
            point.value = Number(point.value) + currentObsPoint;
        }
        document.getElementById("check-" + i).checked = false;
    }
    funcs.sendPlayerData();
};

const wrongObs = () => {
    for (let i = 1; i <= 4; i++) {
        document.getElementById("player-" + i).style.border = "calc(5vw/96) dotted grey";
        document.getElementById("signal-" + i).textContent = "";
        document.getElementById("check-" + i).checked = false;
    }
    main.socket.emit("OBS_wrongObs");
};

const showObstacle = () => {
    funcs.updateMediaButton("none");
    main.socket.emit("OBS_showObs");
};

export const resetRound = () => {
    rowSelected = undefined;
    imgCornerOpened = undefined;
    pointChange = 0;
};
