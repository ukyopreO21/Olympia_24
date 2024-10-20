const serverStatus = require("../../modules/server-side/server-status.js");
const adminPassword = require("../start-server/admin-password.js");
const writeLog = require("../log/write-log.js");

const userID = ["", "", "", ""];
const validSlot = [true, true, true, true];
const disconnectTimes = [];

const handle = (io, socket) => {
    socket.on("connecting", () => {
        socket.emit("sendSlot", { validSlot, playerName: serverStatus.playerName });
    });

    socket.on("signIn", (slot) => {
        if (validSlot[slot - 1]) {
            socket.emit("_signIn", { check: true, slot });
            validSlot[slot - 1] = false;
            io.emit("sendSlot", { validSlot, playerName: serverStatus.playerName });
        } else socket.emit("_signIn", false);
    });

    socket.on("_firstLogIn", (data) => {
        userID[data.playerNumber - 1] = data.userID;
        validSlot[data.playerNumber - 1] = false;
    });

    socket.on("legitLogIn", (playerNumber) => {
        clearInterval(disconnectTimes[playerNumber - 1]);
        socket.emit("_playerEnterRoom");
        socket.emit("sendPlayersData", { playerName: serverStatus.playerName, playerPoint: serverStatus.playerPoint, isReady: serverStatus.isReady });
        socket.emit("sendChatLog", serverStatus.chatLog);
        io.emit("getCurrentUI");
        console.log(`Thí sinh ${playerNumber} đã vào phòng`);
        writeLog({ user: `player${playerNumber}`, message: `Thí sinh ${playerNumber} đã vào phòng` });
    });

    socket.on("getPlayerData", () => {
        io.emit("_getPlayerData");
    });

    socket.on("playerEnterRoom", (playerNumber) => {
        if (!validSlot[playerNumber - 1] && userID[playerNumber - 1] != "") {
            socket.emit("checkLogIn", userID[playerNumber - 1]);
        } else {
            socket.emit("firstLogIn");
        }
    });

    socket.on("hostEnterRoom", () => {
        socket.emit("serverData", {
            playerName: serverStatus.playerName,
            playerPoint: serverStatus.playerPoint,
            isReady: serverStatus.isReady,
            databaseChosen: serverStatus.databaseChosen,
            serverStatus,
        });
        socket.emit("sendChatLog", serverStatus.chatLog);
    });

    socket.on("signOut", (playerNumber) => {
        let count = 0;
        clearInterval(disconnectTimes[playerNumber - 1]);
        disconnectTimes[playerNumber - 1] = setInterval(() => {
            if (count == 5) {
                validSlot[playerNumber - 1] = true;
                userID[playerNumber - 1] = "";
                io.emit("sendSlot", { validSlot, playerName: serverStatus.playerName });
                clearInterval(disconnectTimes[playerNumber - 1]);
            }
            count++;
        }, 1000);
    });

    socket.on("sendCurrentUI", (UIData) => {
        io.emit("_sendCurrentUI", UIData);
        serverStatus.currentUI = UIData.UIName;
    });

    socket.on("sendAdminPassword", (password) => {
        if (Number(password) == adminPassword) socket.emit("_sendAdminPassword", password);
    });
};

module.exports = handle;
