const { databaseData } = require("../../database/database.js");
const serverStatus = require("../../../modules/server-side/server-status.js");
const writeLog = require("../../log/write-log.js");

const openedQuestion = [false, false, false];

const handle = (io, socket) => {
    socket.on("SFI_startRound", (playerList) => {
        for (let i = 0; i < 3; i++) openedQuestion[i] = false;
        serverStatus.SFI_Status.playerNumbers = playerList;
        io.emit("_SFI_startRound", playerList);
        writeLog({ user: "admin", message: `Danh sách thí sinh tham gia Câu hỏi phụ ${playerList}` });
    });

    socket.on("SFI_openQuestion", (questionNumber) => {
        openedQuestion[questionNumber - 1] = true;
        io.emit("_SFI_openQuestion", { questionData: databaseData.SFI[questionNumber - 1], openedCount: countOpened() });
    });

    socket.on("SFI_closeQuestion", () => {
        io.emit("_SFI_closeQuestion");
    });

    socket.on("SFI_timing", (isReset) => {
        serverStatus.playerGranted = 0;
        io.emit("_SFI_timing", isReset);
    });

    socket.on("SFI_right", () => {
        io.emit("_SFI_right");
        writeLog({ user: "admin", message: `Thí sinh trả lời đúng` });
    });

    socket.on("SFI_blockSignal", (playerNumber) => {
        if (!serverStatus.playerGranted) {
            serverStatus.playerGranted = Number(playerNumber);
            io.emit("_SFI_blockSignal", playerNumber);
            writeLog({ user: `player${playerNumber}`, message: `Thí sinh ${playerNumber} giành quyền trả lời` });
        }
    });

    socket.on("SFI_blockButton", () => {
        io.emit("_SFI_blockButton");
    });
};

const countOpened = () => {
    let count = 0;
    for (let i = 0; i < 3; i++) if (openedQuestion[i]) count++;
    return count;
};

module.exports = handle;
