const { databaseData } = require("../../database/database.js");
const serverStatus = require("../../../modules/server-side/server-status.js");
const writeLog = require("../../log/write-log.js");

const handle = (io, socket) => {
    socket.on("FIN_choosePlayer", (playerNumber) => {
        serverStatus.FIN_Status.playerNumber = Number(playerNumber);
        io.emit("_FIN_choosePlayer", playerNumber);
        writeLog({ user: "admin", message: `Thí sinh ${playerNumber} được chọn về đích` });
    });

    socket.on("FIN_showQuestionPack", () => {
        io.emit("_FIN_showQuestionPack");
    });

    socket.on("FIN_choose", (chooseData) => {
        io.emit("_FIN_choose", chooseData);
    });

    socket.on("FIN_packChosen", (list) => {
        const numbersOfQuestion = [0, 0];
        for (let i = 0; i < 3; i++) {
            if (Number(list[i]) == 20) {
                serverStatus.FIN_Status.packChosen[i] = {};
                serverStatus.FIN_Status.packChosen[i].point = 20;
                serverStatus.FIN_Status.packChosen[i].pos = numbersOfQuestion[0];
                numbersOfQuestion[0]++;
            } else {
                serverStatus.FIN_Status.packChosen[i] = {};
                serverStatus.FIN_Status.packChosen[i].point = 30;
                serverStatus.FIN_Status.packChosen[i].pos = numbersOfQuestion[1];
                numbersOfQuestion[1]++;
            }
        }
        writeLog({ user: "admin", message: `Chọn gói câu hỏi: ${list}` });
        io.emit("_FIN_packChosen", list);
    });

    socket.on("FIN_chooseQuestion", (questionNumber) => {
        writeLog({ user: "admin", message: `Chọn câu hỏi số ${questionNumber}` });
        io.emit("_FIN_chooseQuestion", { questionNumber, questionData: getQuestion(questionNumber) });
    });

    socket.on("FIN_startTiming", (questionTime) => {
        io.emit("_FIN_startTiming", questionTime);
    });

    socket.on("FIN_star", (isStarOn) => {
        writeLog({ user: "admin", message: `Ngôi sao hi vọng: ${isStarOn}` });
        io.emit("_FIN_star", isStarOn);
    });

    socket.on("FIN_right", () => {
        writeLog({ user: "admin", message: "Trả lời đúng" });
        io.emit("_FIN_right");
    });

    socket.on("FIN_wrong", () => {
        writeLog({ user: "admin", message: "Trả lời sai" });
        io.emit("_FIN_wrong");
    });

    socket.on("FIN_5s", () => {
        writeLog({ user: "admin", message: "5 giây giành quyền" });
        serverStatus.playerGranted = 0;
        io.emit("_FIN_5s");
    });

    socket.on("FIN_blockSignal", (playerNumber) => {
        if (!serverStatus.playerGranted) {
            serverStatus.playerGranted = playerNumber;
            io.emit("_FIN_blockSignal", playerNumber);
            writeLog({ user: `player${playerNumber}`, message: `Người chơi ${playerNumber} đã giành quyền trả lời` });
        }
    });

    socket.on("FIN_finishTurn", () => {
        io.emit("_FIN_finishTurn");
    });
};

const getQuestion = (questionNumber) => {
    if (serverStatus.FIN_Status.packChosen[questionNumber - 1].point == 20) {
        const questionData = databaseData.FIN[serverStatus.FIN_Status.playerNumber - 1][serverStatus.FIN_Status.packChosen[questionNumber - 1].pos];
        serverStatus.mediaUrl = questionData.mediaUrl;
        return questionData;
    } else {
        const questionData = databaseData.FIN[serverStatus.FIN_Status.playerNumber - 1][3 + serverStatus.FIN_Status.packChosen[questionNumber - 1].pos];
        serverStatus.mediaUrl = questionData.mediaUrl;
        return questionData;
    }
};

module.exports = handle;
