import * as version from "../../../modules/clients-side/version.js";
import * as authorize from "./authorize.js";
import * as login from "./login.js";
import * as violate from "./violate-source.js";
import * as chat from "./chat-room.js";
import * as match from "./match-room.js";
import * as start from "./rounds/start.js";
import * as obstacle from "./rounds/obstacle.js";
import * as acceleration from "./rounds/acceleration.js";
import * as finish from "./rounds/finish.js";
import * as subFinish from "./rounds/sub-finish.js";

export const socket = io();
const urlParams = new URLSearchParams(window.location.search);
export const playerNumber = Number(urlParams.get("url"));
export var signOutReason = undefined;
export var currentRoundID;
export const roundName = ["CHƯA BẮT ĐẦU", "KHỞI ĐỘNG", "VƯỢT CHƯỚNG NGẠI VẬT", "TĂNG TỐC", "VỀ ĐÍCH", "CÂU HỎI PHỤ"];
export const allPlayerName = ["", "", "", ""];
export const allPlayerPoint = [0, 0, 0, 0];

export const updateRoundID = (roundID) => {
    currentRoundID = roundID;
};

export const updateSignOutReason = (reason) => {
    signOutReason = reason;
};

socket.on("_roundChosen", (roundID) => {
    currentRoundID = roundID;
    document.getElementById("current-round").innerHTML = roundName[roundID];
    document.getElementById("round-name").innerHTML = roundName[roundID];
    match.roundUI();
});

socket.on("_sendAdminData", (adminData) => {
    for (let i = 1; i <= 4; i++) {
        document.getElementById("name-" + i).textContent = adminData.currentPlayerName[i - 1];
        document.getElementById("point-" + i).textContent = adminData.currentPlayerPoint[i - 1];
        document.getElementById("chat-room-point-" + i).textContent = adminData.currentPlayerPoint[i - 1];
        document.getElementById("chat-room-name-" + i).textContent = adminData.currentPlayerName[i - 1];
        allPlayerPoint[i - 1] = adminData.currentPlayerPoint[i - 1];
        allPlayerName[i - 1] = adminData.currentPlayerName[i - 1];
    }
});

chat.ChatUI();
match.contestUI("off");
login.logIn();
version.requestVersion(socket);
authorize.authorize();
violate.violateSource();
chat.handle();
match.handle();
start.handle();
obstacle.handle();
acceleration.handle();
finish.handle();
subFinish.handle();
