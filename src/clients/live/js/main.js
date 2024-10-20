import * as audio from "../../../modules/clients-side/audio.js";
import * as start from "./rounds/start.js";
import * as obstacle from "./rounds/obstacle.js";
import * as acceleration from "./rounds/acceleration.js";
import * as finish from "./rounds/finish.js";
import * as subFinish from "./rounds/sub-finish.js";

export const socket = io();
const roundName = ["Start", "Obstacle", "Finish", "Sub-Finish"];
export const allPlayerName = ["", "", "", ""];
export const allPlayerPoint = [0, 0, 0, 0];
var currentRoundID;
const startRoundAudio = new Audio();
export const questionAudio = new Audio();
var showResult, repeat;

export const getMediaType = (mediaUrl) => {
    if (mediaUrl) {
        const extension = mediaUrl.split(".").pop().toLowerCase();
        if (extension === "jpg" || extension === "jpeg" || extension === "png" || extension === "gif") return "image";
        else if (extension === "mp4" || extension === "avi" || extension === "mov" || extension === "wmv") return "video";
        else if (extension === "mp3" || extension === "wav" || extension === "ogg") return "audio";
    }
    return "unknown";
};

export const autoScaleFontSize = (text) => {
    if (text.scrollHeight <= text.offsetHeight) text.style.fontSize = 45 / 32 + "vw";
    while (text.scrollHeight > text.offsetHeight) {
        text.style.fontSize = (parseFloat(window.getComputedStyle(text).fontSize) / window.innerWidth) * 100 - 0.01 + "vw";
    }
};

const viewerInterface = (visibility, called) => {
    if (called) summaryInterface("hidden", 0);
    for (let i = 0; i < roundName.length; i++) {
        const dad = document.getElementById(roundName[i].toLowerCase() + "-interface");
        const child = dad.querySelectorAll("*");
        for (let i = 0; i < child.length; i++) {
            child[i].style.visibility = visibility;
        }
    }
};

const summaryInterface = (visibility, called) => {
    if (called) viewerInterface("hidden", 0);
    const dad = document.getElementById("summary-interface");
    const child = dad.querySelectorAll("*");
    for (let i = 0; i < child.length; i++) {
        child[i].style.visibility = visibility;
    }
};

window.addEventListener("resize", () => {
    autoScaleFontSize(document.getElementById("STR_question"));
    autoScaleFontSize(document.getElementById("OBS_question"));
    autoScaleFontSize(document.getElementById("FIN_question"));
    autoScaleFontSize(document.getElementById("SFI_question"));
});

//SERVER RESET
socket.on("serverRestarted", () => {
    window.location.reload();
});

//LẤY DỮ LIỆU TỪ ADMIN
socket.on("_sendAdminData", (adminData) => {
    for (let i = 1; i <= 4; i++) {
        allPlayerName[i - 1] = adminData.currentPlayerName[i - 1];
        allPlayerPoint[i - 1] = adminData.currentPlayerPoint[i - 1];
    }
    start.printPlayerData();
    finish.printPlayerData();
    subFinish.printPlayerData();
    document.getElementById("FIN_current-point").textContent = allPlayerPoint[Number(finish.currentPlayer) - 1];
});

socket.on("_blankSound", () => {
    audio.blankAudio.play();
});

socket.on("_roundChosen", (roundID) => {
    currentRoundID = roundID;
});

socket.on("_playIntro", (roundID) => {
    currentRoundID = roundID;
    const intro = document.getElementById("intro-video");
    intro.style.visibility = "visible";
    intro.onended = () => {
        document.getElementById("intro-video").style.visibility = "hidden";
    };
    if (roundID == "1") {
        intro.src = "/src/assets/Start/Start.mp4";
        document.getElementById("start-interface").style.visibility = "visible";
        document.getElementById("obstacle-interface").style.visibility = "hidden";
        document.getElementById("finish-interface").style.visibility = "hidden";
        document.getElementById("sub-finish-interface").style.visibility = "hidden";
    } else if (roundID == "2") {
        intro.src = "/src/assets/Obstacle/Obstacle.mp4";
        document.getElementById("start-interface").style.visibility = "hidden";
        document.getElementById("obstacle-interface").style.visibility = "visible";
        document.getElementById("finish-interface").style.visibility = "hidden";
        document.getElementById("sub-finish-interface").style.visibility = "hidden";
    } else if (roundID == "3") {
        intro.src = "/src/assets/Acceleration/Acceleration.mp4";
        document.getElementById("start-interface").style.visibility = "hidden";
        document.getElementById("obstacle-interface").style.visibility = "hidden";
        document.getElementById("finish-interface").style.visibility = "hidden";
        document.getElementById("sub-finish-interface").style.visibility = "hidden";
    } else if (roundID == "4") {
        intro.src = "/src/assets/Finish/Finish.mp4";
        document.getElementById("start-interface").style.visibility = "hidden";
        document.getElementById("obstacle-interface").style.visibility = "hidden";
        document.getElementById("finish-interface").style.visibility = "visible";
        document.getElementById("sub-finish-interface").style.visibility = "hidden";
    }
    intro.play();
});

socket.on("_startRound", () => {
    document.getElementById("intro-video").style.visibility = "hidden";
    startRoundAudio.pause();
    if (currentRoundID == "1") {
        startRoundAudio.src = audio.STR_startRoundAudio.src;
    } else if (currentRoundID == "2") {
        startRoundAudio.src = audio.OBS_startRoundAudio.src;
    } else if (currentRoundID == "3") {
        startRoundAudio.src = audio.ACC_startRoundAudio.src;
    } else if (currentRoundID == "4") {
        startRoundAudio.src = audio.FIN_startRoundAudio.src;
    }
    startRoundAudio.currentTime = 0;
    startRoundAudio.play();
});

socket.on("_playMedia", (mediaUrl) => {
    const mediaType = getMediaType(mediaUrl);
    if (mediaType == "audio") {
        questionAudio.pause();
        questionAudio.src = mediaUrl;
        questionAudio.currentTime = 0;
        questionAudio.play();
    } else if (mediaType == "video") {
        const media = document.getElementById("FIN_video");
        media.src = mediaUrl;
        if (media) {
            media.play();
            media.onended = () => {
                document.getElementById("FIN_video").src = "";
            };
        }
    }
});

socket.on("_closeMedia", () => {
    questionAudio.pause();
    const media = document.getElementById("FIN_video");
    if (media) {
        media.pause();
        document.getElementById("FIN_video").src = "";
    }
});

socket.on("_summarize", () => {
    summaryInterface("visible", 1);
    clearTimeout(showResult);
    clearInterval(repeat);
    document.getElementById("summary-name-label").textContent = "";
    document.getElementById("summary-point-label").textContent = "";
    const sortedList = [];
    for (let i = 1; i <= 4; i++) {
        const playerName = allPlayerName[i - 1];
        const playerPoint = allPlayerPoint[i - 1];
        sortedList.push({ name: playerName, point: playerPoint });
    }

    sortedList.sort((a, b) => {
        return a.point - b.point;
    });

    audio.summaryAudio.pause();
    audio.summaryAudio.currentTime = 0;
    audio.summaryAudio.play();
    const summaryName = document.getElementById("summary-name");
    summaryName.classList.remove("summary-name-move");
    void summaryName.offsetWidth;
    summaryName.classList.add("summary-name-move");

    const summaryPoint = document.getElementById("summary-point");
    summaryPoint.classList.remove("summary-point-move");
    void summaryPoint.offsetWidth;
    summaryPoint.classList.add("summary-point-move");

    const setNameAndPoint = (name, point) => {
        document.getElementById("summary-name-label").textContent = name;
        document.getElementById("summary-point-label").textContent = point;
    };

    showResult = setTimeout(() => {
        let count = 0;
        setNameAndPoint(sortedList[count].name, sortedList[count].point);
        repeat = setInterval(() => {
            count++;
            setNameAndPoint(sortedList[count].name, sortedList[count].point);
            if (count == 3) clearInterval(repeat);
        }, 3000);
    }, 1000);
});

socket.on("_finishRound", () => {
    document.getElementById("intro-video").pause();
    document.getElementById("intro-video").style.visibility = "hidden";
    viewerInterface("hidden", 1);
});

viewerInterface("hidden", 1);
start.handle();
obstacle.handle();
acceleration.handle();
finish.handle();
subFinish.handle();
