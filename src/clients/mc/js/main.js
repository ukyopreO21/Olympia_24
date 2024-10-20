import * as version from "../../../modules/clients-side/version.js";
import * as password from "./password.js";
import * as start from "./rounds/start.js";
import * as obstacle from "./rounds/obstacle.js";
import * as acceleration from "./rounds/acceleration.js";
import * as finish from "./rounds/finish.js";
import * as subFinish from "./rounds/sub-finish.js";

export const socket = io();

export const roundName = ["CHƯA BẮT ĐẦU", "KHỞI ĐỘNG", "VƯỢT CHƯỚNG NGẠI VẬT", "TĂNG TỐC", "VỀ ĐÍCH", "CÂU HỎI PHỤ"];
export const englishRoundName = ["", "start", "obstacle", "acceleration", "finish", "sub-finish"];
var currentRoundID;
export const allPlayerName = [];
const allPlayerPoint = [];
export var downloadTimer;

socket.on("serverRestarted", () => {
    alert("Server đã khởi động trở lại, vui lòng F5 để cập nhật lại tình trạng.");
    window.location.reload();
});

socket.on("_roundChosen", (roundID) => {
    currentRoundID = roundID;
    document.getElementById("round-name").innerHTML = roundName[roundID];
    for (let i = 1; i < englishRoundName.length; i++) {
        if (i == currentRoundID) document.getElementById(englishRoundName[i] + "-interface").style.visibility = "visible";
        else document.getElementById(englishRoundName[i] + "-interface").style.visibility = "hidden";
    }
});

socket.on("serverData", (data) => {
    for (let i = 1; i <= 4; i++) {
        allPlayerName[i - 1] = data.playerName[i - 1];
        allPlayerPoint[i - 1] = data.playerPoint[i - 1];
        document.getElementById("Name" + i).textContent = allPlayerName[i - 1];
        document.getElementById("Point" + i).textContent = allPlayerPoint[i - 1];
    }
});

socket.on("_sendAdminData", (adminData) => {
    for (let i = 1; i <= 4; i++) {
        document.getElementById("Name" + i).textContent = adminData.currentPlayerName[i - 1];
        document.getElementById("Point" + i).textContent = adminData.currentPlayerPoint[i - 1];
        allPlayerPoint[i - 1] = adminData.currentPlayerPoint[i - 1];
        allPlayerName[i - 1] = adminData.currentPlayerName[i - 1];
    }
});

socket.on("_finishRound", () => {
    for (let i = 1; i < englishRoundName.length; i++) {
        document.getElementById(englishRoundName[i] + "-interface").style.visibility = "hidden";
    }
    for (let i = 1; i <= 4; i++) {
        document.getElementById("current-point-" + i).classList.remove("granted");
    }
    document.getElementById("time-left").textContent = "";
    const answerNames = document.querySelectorAll(".answer-name");
    const answerTexts = document.querySelectorAll(".answer-text");
    answerNames.forEach((answerName) => {
        answerName.textContent = "";
    });
    answerTexts.forEach((answerText) => {
        answerText.textContent = "";
    });
});

export const countDown = (time) => {
    document.getElementById("time-left").textContent = time;
    clearInterval(downloadTimer);
    let timeLeft = time - 1;
    downloadTimer = setInterval(() => {
        document.getElementById("time-left").textContent = timeLeft;
        if (timeLeft <= 0) {
            clearInterval(downloadTimer);
        }
        timeLeft -= 1;
    }, 1000);
};

export const templateLabel = (label) => {
    return "<font color='orange'>" + label + "</font>";
};

version.requestVersion(socket);
password.handle();
start.handle();
obstacle.handle();
acceleration.handle();
finish.handle();
subFinish.handle();
