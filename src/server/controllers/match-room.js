const { set, get } = require("../database/database.js");
const serverStatus = require("../../modules/server-side/server-status.js");
const writeLog = require("../log/write-log.js");
const { writeCandidates } = require("../database/candidates.js");

const handle = (io, socket) => {
    socket.on("chooseDb", async (dbNumber) => {
        const data = await get(dbNumber);
        socket.emit("_chooseDb", data);
    });

    socket.on("adminChooseDb", (dbNumber) => {
        serverStatus.databaseChosen = dbNumber;
        writeLog({ user: "admin", message: "Chọn database " + dbNumber });
        set(dbNumber);
    });

    socket.on("sendAdminData", (adminData) => {
        for (let i = 0; i < 4; i++) {
            serverStatus.playerName[i] = adminData.currentPlayerName[i];
            serverStatus.playerPoint[i] = adminData.currentPlayerPoint[i];
        }
        io.emit("_sendAdminData", adminData);
        writeLog({ user: "admin", message: adminData.currentPlayerPoint });
        writeCandidates();
    });

    socket.on("roundChosen", (roundID) => {
        serverStatus.currentRoundID = Number(roundID);
        io.emit("_roundChosen", roundID);
        writeLog({ user: "admin", message: `Chọn vòng thi ${roundID}` });
    });

    socket.on("playIntro", (roundID) => {
        io.emit("_playIntro", roundID);
    });

    socket.on("startRound", () => {
        io.emit("_startRound");
    });

    socket.on("blankSound", () => {
        io.emit("_blankSound");
    });

    socket.on("contestUI", () => {
        io.emit("_contestUI");
    });

    socket.on("playMedia", () => {
        io.emit("_playMedia", serverStatus.mediaUrl);
    });

    socket.on("closeMedia", () => {
        io.emit("_closeMedia");
    });

    socket.on("resetStatus", (roundID) => {
        io.emit("_resetStatus", roundID);
        writeLog({ user: "admin", message: `Reset trạng thái vòng thi ${roundID}` });
    });

    socket.on("summarize", () => {
        io.emit("_summarize");
    });

    socket.on("finishRound", () => {
        io.emit("_finishRound");
    });

    socket.on("getPlayerData", (playerNumber) => {
        const data = {
            name: serverStatus.playerName[Number(playerNumber) - 1],
            point: serverStatus.playerPoint[Number(playerNumber) - 1],
        };
        socket.emit("_getPlayerData", data);
    });
};

module.exports = handle;
