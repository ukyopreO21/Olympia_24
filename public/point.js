var socket = io();
var playerNumber;

function chooseSlot(btn) {
	playerNumber = Number(btn.name);
	socket.emit("getPlayerData", playerNumber);
	document.getElementById("promptBox").style.display = "none";
	document.getElementById("answerZone").style.visibility = "visible";
}

function defaultBackground() {
	document.getElementById("main").style.backgroundImage =
		'linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url("./Others/Background.png")';
}

function signalBackground() {
	document.getElementById("main").style.backgroundImage =
		"linear-gradient(to right bottom, #e76363, #cc5555, #b24848, #983b3b, #7f2f2f)";
}

socket.on("_getPlayerData", function (data) {
	document.getElementById("name").textContent = data.name.toUpperCase();
	document.getElementById("point").textContent = data.point;
});

socket.on("_sendAdminData", function (data) {
	document.getElementById("name").textContent =
		data.currentPlayerName[playerNumber - 1];
	document.getElementById("point").textContent =
		data.currentPlayerPoint[playerNumber - 1];
});

socket.on("_sendAnswer", function (answerData) {
	if (playerNumber == answerData.playerNumber)
		document.getElementById("answer").textContent =
			answerData.playerAnswer.toUpperCase();
});

socket.on("_ACC_sentAnswer", function (serverData) {
	if (playerNumber == serverData.answerData.playerNumber) {
		document.getElementById("answer").textContent =
			serverData.answerData.playerAnswer.toUpperCase();
	}
});

socket.on("_STR_getNextQuestion", function () {
	defaultBackground();
});

socket.on("_STR_blockSignal", function (player) {
	if (playerNumber == player) {
		signalBackground();
	}
});

socket.on("_OBS_playerObsSignal", function (data) {
	if (playerNumber == data.playerNumber) {
		signalBackground();
	}
});

socket.on("_OBS_rightObs", function () {
	defaultBackground();
});

socket.on("_OBS_wrongObs", function () {
	defaultBackground();
});

socket.on("_FIN_chooseQuestion", function () {
	defaultBackground();
});

socket.on("_FIN_blockSignal", function (player) {
	if (playerNumber == player) {
		signalBackground();
	}
});

socket.on("_FIN_finishTurn", function () {
	defaultBackground();
});

socket.on("_SFI_openQuestion", function () {
	defaultBackground();
});

socket.on("_SFI_blockSignal", function (player) {
	if (playerNumber == player) {
		signalBackground();
	}
});

socket.on("_endGame", function () {
	document.getElementById("answer").textContent = "";
	defaultBackground();
});
