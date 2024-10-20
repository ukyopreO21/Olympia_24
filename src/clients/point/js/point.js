const socket = io();

var playerNumber;

const chooseSlot = (btn) => {
    playerNumber = Number(btn.name);
    socket.emit("getPlayerData", playerNumber);
    document.getElementById("prompt-box").style.display = "none";
};

const defaultBackground = () => {
    document.getElementById("main").style.backgroundImage = 'linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url("/src/assets/Others/Background.png")';
};

const signalBackground = () => {
    document.getElementById("main").style.backgroundImage = "linear-gradient(to right bottom, #e76363, #cc5555, #b24848, #983b3b, #7f2f2f)";
};

socket.on("_getPlayerData", (data) => {
    document.getElementById("name").textContent = data.name.toUpperCase();
    document.getElementById("point").textContent = data.point;
});

socket.on("_sendAdminData", (data) => {
    document.getElementById("name").textContent = data.currentPlayerName[playerNumber - 1].toUpperCase();
    document.getElementById("point").textContent = data.currentPlayerPoint[playerNumber - 1];
});

socket.on("_STR_getNextQuestion", () => {
    defaultBackground();
});

socket.on("_STR_blockSignal", (player) => {
    if (playerNumber == player) {
        signalBackground();
    }
});

socket.on("_STR_finishTurn", () => {
    defaultBackground();
});

socket.on("_OBS_signal", (data) => {
    if (playerNumber == data.playerNumber) {
        signalBackground();
    }
});

socket.on("_OBS_rightObs", () => {
    defaultBackground();
});

socket.on("_OBS_wrongObs", () => {
    defaultBackground();
});

socket.on("_FIN_chooseQuestion", () => {
    defaultBackground();
});

socket.on("_FIN_blockSignal", (player) => {
    if (playerNumber == player) {
        signalBackground();
    }
});

socket.on("_FIN_finishTurn", () => {
    defaultBackground();
});

socket.on("_SFI_openQuestion", () => {
    defaultBackground();
});

socket.on("_SFI_blockSignal", (player) => {
    if (playerNumber == player) {
        signalBackground();
    }
});

socket.on("_finishRound", () => {
    defaultBackground();
});
