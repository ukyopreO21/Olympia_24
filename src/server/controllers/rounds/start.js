const { databaseData } = require("../../database/database.js");
const serverStatus = require("../../../modules/server-side/server-status.js");
const writeLog = require("../../log/write-log.js");

const handle = (io, socket) => {
    socket.on("STR_choosePlayer", (playerNumber) => {
        io.emit("_STR_choosePlayer", playerNumber);
        serverStatus.STR_Status.playerNumber = playerNumber;
        writeLog({ user: "admin", message: `Lượt Khởi động số ${playerNumber}` });
    });

    socket.on("STR_startPlayerTurn", () => {
        io.emit("_STR_startPlayerTurn");
    });

    socket.on("STR_openQuestionBoard", () => {
        io.emit("_STR_openQuestionBoard");
        serverStatus.currentUI = "STR_questionBoard";
    });

    socket.on("STR_startTurn", (settings) => {
        serverStatus.STR_Status.questionNumber = 1;
        io.emit("_STR_startTurn", { questionData: getQuestion(settings.playerNumber), blockSignal: settings.blockSignal });
    });

    socket.on("STR_getNextQuestion", (settings) => {
        serverStatus.STR_Status.questionNumber++;
        serverStatus.playerGranted = 0;
        io.emit("_STR_getNextQuestion", { questionData: getQuestion(settings.playerNumber), blockSignal: settings.blockSignal });
    });

    socket.on("STR_timing", (time) => {
        if (time == 3) serverStatus.playerGranted = 0;
        io.emit("_STR_timing", time);
    });

    socket.on("STR_blockSignal", (playerNumber) => {
        if (!serverStatus.playerGranted) {
            io.emit("_STR_blockSignal", playerNumber);
            serverStatus.playerGranted = playerNumber;
            writeLog({ user: `player${playerNumber}`, message: `Thí sinh ${playerNumber} giành quyền trả lời` });
        }
    });

    socket.on("STR_right", () => {
        io.emit("_STR_right");
        writeLog({ user: "admin", message: `Thí sinh trả lời đúng` });
    });

    socket.on("STR_wrong", () => {
        io.emit("_STR_wrong");
        writeLog({ user: "admin", message: `Thí sinh trả lời sai` });
    });

    socket.on("STR_openSignal", () => {
        io.emit("_STR_openSignal");
    });

    socket.on("STR_finishTurn", () => {
        io.emit("_STR_finishTurn");
        serverStatus.playerGranted = 0;
        serverStatus.currentUI = "STR_hideQuestionBoard";
    });
};

const getQuestion = (playerNumber) => {
    const questionNumber = serverStatus.STR_Status.questionNumber;
    if ((playerNumber < 5 && questionNumber > 6) || (playerNumber == 5 && questionNumber > 12)) return undefined;
    serverStatus.mediaUrl = databaseData.STR[playerNumber - 1][questionNumber - 1].mediaUrl;
    return databaseData.STR[playerNumber - 1][questionNumber - 1];
};

module.exports = handle;
