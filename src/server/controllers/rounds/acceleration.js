const { databaseData } = require("../../database/database.js");
const serverStatus = require("../../../modules/server-side/server-status.js");
const writeLog = require("../../log/write-log.js");

var startTime;

const handle = (io, socket) => {
    socket.on("ACC_chooseQuestion", () => {
        writeLog({ user: "admin", message: "Chọn câu hỏi tăng tốc" });
        io.emit("_ACC_chooseQuestion");
    });

    socket.on("ACC_openQuestion", (questionNumber) => {
        serverStatus.ACC_Status.questionNumber = questionNumber;
        io.emit("_ACC_openQuestion", databaseData.ACC[questionNumber - 1]);
        io.emit("ACC_sendQuestionNumber", questionNumber);
    });

    socket.on("ACC_checkVideoSource", (playerData) => {
        if (playerData.sourceNum == databaseData.ACC[serverStatus.ACC_Status.questionNumber - 1].mediaUrl.length) {
            writeLog({ user: `player${playerData.playerNumber}`, message: `Thí sinh ${playerData.playerNumber} tải video tăng tốc ${serverStatus.ACC_Status.questionNumber} thành công` });
            console.log(`Thí sinh ${playerData.playerNumber} tải video tăng tốc ${serverStatus.ACC_Status.questionNumber} thành công`);
            io.emit("_ACC_checkVideoSource", playerData.playerNumber);
        } else {
            writeLog({ user: `player${playerData.playerNumber}`, message: `Thí sinh ${playerData.playerNumber} không thể tải video tăng tốc ${serverStatus.ACC_Status.questionNumber}` });
            console.log(`Thí sinh ${playerData.playerNumber} không thể tải video tăng tốc ${serverStatus.ACC_Status.questionNumber}`);
        }
    });

    socket.on("ACC_startTiming", (questionNumber) => {
        startTime = Date.now();
        io.emit("_ACC_startTiming", { questionNumber, startTime });
        writeLog({ user: "server", message: `Bắt đầu đếm thời gian câu hỏi tăng tốc ${questionNumber} tại ${startTime}` });
    });

    socket.on("ACC_sendAnswer", (answerData) => {
        const catchTime = Date.now() - 2;
        let costTime = (catchTime - startTime) / 1000;
        if (costTime <= serverStatus.ACC_Status.questionNumber * 10) {
            costTime = costTime.toFixed(2);
            io.emit("_ACC_sendAnswer", { answerData, costTime });
        }
        writeLog({
            user: `player${answerData.playerNumber}`,
            message: `Thí sinh ${answerData.playerNumber} trả lời câu hỏi tăng tốc ${serverStatus.ACC_Status.questionNumber} với thời gian ${costTime}s`,
        });
    });

    socket.on("ACC_showAnswers", (answerData) => {
        io.emit("_ACC_showAnswer", answerData);
    });

    socket.on("ACC_showQuestionAnswer", (questionNumber) => {
        io.emit("_ACC_showQuestionAnswer", databaseData.ACC[questionNumber - 1]);
    });

    socket.on("ACC_right", (answerData) => {
        io.emit("_ACC_right", answerData);
    });

    socket.on("ACC_wrong", () => {
        io.emit("_ACC_wrong");
        writeLog({ user: "admin", message: `Tất cả thí sinh trả lời sai câu hỏi tăng tốc ${serverStatus.ACC_Status.questionNumber}` });
    });

    socket.on("ACC_closeQuestion", () => {
        io.emit("_ACC_closeQuestion");
    });

    socket.on("ACC_questionUI", () => {
        io.emit("_ACC_questionUI");
    });

    socket.on("ACC_answerUI", () => {
        io.emit("_ACC_answerUI");
    });
};

module.exports = handle;
