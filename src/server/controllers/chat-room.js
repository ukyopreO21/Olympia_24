const express = require("express");
const multer = require("multer");
const path = require("path");
const serverStatus = require("../../modules/server-side/server-status.js");
const writeLog = require("../log/write-log.js");

const router = express.Router();
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, "../../../public/temp"));
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + "-" + Date.now() + path.extname(file.originalname));
    },
});

const uploadMedia = multer({ storage: storage });

const handle = (io, socket) => {
    socket.on("sendChat", (dataUser) => {
        const time = formatTime(new Date());
        const message = dataUser.message;
        let username = dataUser.username;
        if (dataUser.playerNumber != 0) username = serverStatus.playerName[dataUser.playerNumber - 1] + dataUser.username;
        serverStatus.chatLog.push({
            time: time,
            username: username,
            message: dataUser.message,
        });
        io.emit("_sendChat", { username, message, time });
        writeLog({ user: `${dataUser.playerNumber == 0 ? "admin" : `player${dataUser.playerNumber}`}`, message: message });
    });

    socket.on("sendReady", (data) => {
        serverStatus.isReady[data.playerNumber - 1] = data.ready;
        io.emit("_sendReady", data);
    });

    socket.on("changeChatRules", (rule) => {
        io.emit("_changeChatRules", rule);
    });

    socket.on("chatUI", () => {
        io.emit("_chatUI");
    });

    router.post("/uploadMedia", uploadMedia.any(), (req, res) => {
        const mediaType = String(req.files[0].mimetype).substring(0, 5);
        const time = formatTime(new Date());
        const mediaUrl = path.join("/public/temp", req.files[0].filename);
        const userData = JSON.parse(req.body.userData);
        let username = userData.username;
        if (userData.playerNumber != 0) username = serverStatus.playerName[userData.playerNumber - 1] + userData.username;
        serverStatus.chatLog.push({
            time: time,
            mediaUrl: mediaUrl,
            mediaType: mediaType,
            username: username,
        });
        io.emit("_sendChat", { mediaUrl: mediaUrl, mediaType, username, time });
        writeLog({ user: userData.playerNumber > 0 ? `player${userData.playerNumber}` : "admin", message: mediaUrl });
    });
};

const formatTime = (date) => {
    let hours = date.getHours();
    let minutes = date.getMinutes();
    let seconds = date.getSeconds();

    hours = (hours < 10 ? "0" : "") + hours;
    minutes = (minutes < 10 ? "0" : "") + minutes;
    seconds = (seconds < 10 ? "0" : "") + seconds;

    return hours + ":" + minutes + ":" + seconds;
};

module.exports = { router, handle };
