const { databaseData } = require("../../database/database.js");
const serverStatus = require("../../../modules/server-side/server-status.js");
const writeLog = require("../../log/write-log.js");

const handle = (io, socket) => {
    socket.on("OBS_adminGetRoundData", () => {
        io.emit("_OBS_adminGetRoundData", databaseData.OBS);
    });

    socket.on("OBS_showNumberOfCharacter", () => {
        io.emit("_OBS_showNumberOfCharacter");
    });

    socket.on("OBS_showRows", () => {
        serverStatus.OBS_Status.signals = [];
        io.emit("_OBS_showRows", databaseData.OBS);
        serverStatus.currentUI = "OBS_rowsUI";
    });

    socket.on("OBS_getRowsLength", () => {
        io.emit("_OBS_getRowsLength", databaseData.OBS);
    });

    socket.on("OBS_chooseRow", (rowNumber) => {
        io.emit("_OBS_chooseRow", { rowNumber, OBS: databaseData.OBS });
    });

    socket.on("OBS_showRowQuestion", (rowNumber) => {
        serverStatus.mediaUrl = databaseData.OBS[rowNumber - 1].mediaUrl;
        io.emit("_OBS_showRowQuestion", databaseData.OBS[rowNumber - 1]);
        serverStatus.OBS_Status.rowsStatus[rowNumber - 1].isOpening = true;
        writeLog({ user: "admin", message: `Mở câu hỏi hàng ngang số ${rowNumber}` });
    });

    socket.on("OBS_closeRowQuestion", () => {
        io.emit("_OBS_closeRowQuestion");
    });

    socket.on("OBS_start15s", () => {
        io.emit("_OBS_start15s");
    });

    socket.on("OBS_sendAnswer", (answerData) => {
        io.emit("_OBS_sendAnswer", answerData);
        writeLog({ user: `player${answerData.playerNumber}`, message: `Thí sinh ${answerData.playerNumber} gửi câu trả lời: ${answerData.playerAnswer}` });
    });

    socket.on("OBS_signal", (playerNumber) => {
        serverStatus.OBS_Status.signals.push(playerNumber);
        io.emit("_OBS_signal", { playerNumber, numberOfSignals: serverStatus.OBS_Status.signals.length });
        writeLog({ user: `player${playerNumber}`, message: `Thí sinh ${playerNumber} gửi tín hiệu trả lời Chướng ngại vật` });
    });

    socket.on("OBS_showRowAnswer", (rowData) => {
        io.emit("_OBS_showRowAnswer", rowData);
    });

    socket.on("OBS_answerUI", () => {
        io.emit("_OBS_answerUI");
    });

    socket.on("OBS_rowsUI", () => {
        io.emit("_OBS_rowsUI");
    });

    socket.on("OBS_wrongRow", (wrongPlayers) => {
        io.emit("_OBS_wrongRow", wrongPlayers);
        writeLog({ user: "admin", message: `Thí sinh ${wrongPlayers} trả lời sai hàng ngang` });
    });

    socket.on("OBS_rightRow", (rowNumber) => {
        io.emit("_OBS_rightRow", {
            rowNumber,
            questionData: databaseData.OBS[rowNumber - 1],
        });
        writeLog({ user: "admin", message: `Thí sinh trả lời đúng hàng ngang số ${rowNumber}` });
    });

    socket.on("OBS_playWrongRow", (rowNumber) => {
        io.emit("_OBS_playWrongRow", rowNumber);
    });

    socket.on("OBS_imageUI", () => {
        io.emit("_OBS_imageUI");
    });

    socket.on("OBS_openCorner", (rowNumber) => {
        io.emit("_OBS_openCorner", rowNumber);
        writeLog({ user: "admin", message: `Mở góc ảnh số ${rowNumber}` });
    });

    socket.on("OBS_rightObs", (value) => {
        io.emit("_OBS_rightObs", { roundData: databaseData.OBS, rightPlayerSignal: value });
        writeLog({ user: "admin", message: `Thí sinh ${value} trả lời đúng chướng ngại vật` });
    });

    socket.on("OBS_wrongObs", () => {
        serverStatus.OBS_Status.signals = [];
        io.emit("_OBS_wrongObs");
        writeLog({ user: "admin", message: `Thí sinh trả lời sai chướng ngại vật` });
    });

    socket.on("OBS_last15s", () => {
        io.emit("_OBS_last15s");
        writeLog({ user: "admin", message: `15 giây cuối cùng` });
    });

    socket.on("OBS_showObs", () => {
        io.emit("_OBS_showObs", databaseData.OBS);
        writeLog({ user: "admin", message: `Hiển thị Chướng ngại vật` });
    });
};

module.exports = handle;
