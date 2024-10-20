import * as main from "../main.js";
import * as funcs from "../funcs.js";

var signalPlayer, downloadTimer, blockSignalTimer;
var blockSignal = true;

export const handle = () => {
    main.socket.on("_STR_startTurn", (settings) => {
        funcs.updateMediaButton("none");
        document.getElementById("STR_info").innerHTML = "";
        const mediaType = funcs.getMediaType(settings.questionData.mediaUrl);
        if (mediaType == "audio") funcs.updateMediaButton("auto");
        else if (mediaType == "image") document.getElementById("STR_info").innerHTML += "<img src='" + settings.questionData.mediaUrl + "'>";
        funcs.setQuestionData(settings.questionData);
        const playerNumber = Number(document.getElementById("STR_player-number").value);
        if (playerNumber == 5 && blockSignal) {
            clearTimeout(blockSignalTimer);
            blockSignalTimer = setTimeout(() => {
                main.socket.emit("STR_openSignal");
            }, 3000);
        }
    });

    main.socket.on("_STR_getNextQuestion", (settings) => {
        funcs.updateMediaButton("none");
        document.getElementById("STR_info").innerHTML = "";
        const mediaType = funcs.getMediaType(settings.questionData.mediaUrl);
        if (mediaType == "audio") funcs.updateMediaButton("auto");
        else if (mediaType == "image") document.getElementById("STR_info").innerHTML += "<img src='" + settings.questionData.mediaUrl + "'>";
        funcs.setQuestionData(settings.questionData);
        if (signalPlayer) document.getElementById("player-" + signalPlayer).style.border = "calc(5vw/96) dotted grey";
        signalPlayer = undefined;
        clearInterval(downloadTimer);
        document.getElementById("STR_time").textContent = 0;
    });

    main.socket.on("_STR_blockSignal", (playerNumber) => {
        signalPlayer = playerNumber;
        document.getElementById("player-" + playerNumber).style.border = "calc(5vw/48) solid #73f7ff";
    });
};

export const assignButton = () => {
    window.choosePlayer = choosePlayer;
    window.startPlayerTurn = startPlayerTurn;
    window.openQuestionBoard = openQuestionBoard;
    window.startTurn = startTurn;
    window.count5s = count5s;
    window.count3s = count3s;
    window.getNextQuestion = getNextQuestion;
    window.right = right;
    window.wrong = wrong;
    window.block3s = block3s;
    window.finishTurn = finishTurn;
};

const choosePlayer = () => {
    const playerNumber = Number(document.getElementById("STR_player-number").value);
    main.socket.emit("STR_choosePlayer", playerNumber);
};

const startPlayerTurn = () => {
    main.socket.emit("STR_startPlayerTurn");
};

const openQuestionBoard = () => {
    main.socket.emit("STR_openQuestionBoard");
};

const startTurn = () => {
    const playerNumber = Number(document.getElementById("STR_player-number").value);
    main.socket.emit("STR_startTurn", { playerNumber: playerNumber, blockSignal: blockSignal });
};

const timing = (time) => {
    clearInterval(downloadTimer);
    document.getElementById("STR_time").textContent = time;
    let timeLeft = time - 1;
    downloadTimer = setInterval(() => {
        document.getElementById("STR_time").textContent = timeLeft;
        if (timeLeft <= 0) {
            clearInterval(downloadTimer);
        }
        timeLeft -= 1;
    }, 1000);
};

const count5s = () => {
    main.socket.emit("STR_timing", 5);
    timing(5);
};

const count3s = () => {
    main.socket.emit("STR_timing", 3);
    timing(3);
    if (blockSignal) {
        clearTimeout(blockSignalTimer);
        main.socket.emit("STR_openSignal");
    }
};

const getNextQuestion = () => {
    const playerNumber = Number(document.getElementById("STR_player-number").value);
    main.socket.emit("STR_getNextQuestion", { playerNumber: playerNumber, blockSignal: blockSignal });
    if (playerNumber == 5 && blockSignal) {
        clearTimeout(blockSignalTimer);
        blockSignalTimer = setTimeout(() => {
            main.socket.emit("STR_openSignal");
        }, 3000);
    }
};

const right = () => {
    const playerNumber = document.getElementById("STR_player-number").value;
    if (playerNumber != 5) {
        const point = document.getElementById("player-point-" + playerNumber);
        point.value = Number(point.value) + 10;
    } else {
        const point = document.getElementById("player-point-" + signalPlayer);
        point.value = Number(point.value) + 10;
    }
    main.socket.emit("STR_right");
    funcs.sendPlayerData();
};

const wrong = () => {
    const playerNumber = document.getElementById("STR_player-number").value;
    if (playerNumber == 5 && signalPlayer) {
        const point = document.getElementById("player-point-" + signalPlayer);
        if (Number(point.value - 5) >= 0) point.value = Number(point.value) - 5;
    }
    main.socket.emit("STR_wrong");
    funcs.sendPlayerData();
};

const block3s = () => {
    if (blockSignal) {
        document.getElementById("block-signal").innerHTML = '<i class="fa-solid fa-hourglass-start"></i>&nbsp&nbspĐóng';
    } else document.getElementById("block-signal").innerHTML = '<i class="fa-solid fa-hourglass-start"></i>&nbsp&nbspMở';
    blockSignal = !blockSignal;
};

const finishTurn = () => {
    main.socket.emit("STR_finishTurn");
    funcs.updateMediaButton("none");
    document.getElementById("STR_info").innerHTML = "";
    if (signalPlayer) document.getElementById("player-" + signalPlayer).style.border = "calc(5vw/96) dotted grey";
};
