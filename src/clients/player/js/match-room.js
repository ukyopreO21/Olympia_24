import * as audio from "../../../modules/clients-side/audio.js";
import * as main from "./main.js";
import * as chat from "./chat-room.js";

const startRoundAudio = new Audio();
export const questionAudio = new Audio();
export var isAllowBlankAnswer;
export var masterVolume = 0.5;
const playingAudioList = {
    audioCounter: 3,
    0: audio.STR_loop1Audio,
    1: audio.STR_loop2Audio,
    2: audio.STR_loop3Audio,
    3: audio.STR_loop4Audio,
};

export const handle = () => {
    document.getElementById("current-point-" + main.playerNumber).style.color = "orange";
    window.allowBlankAnswer = allowBlankAnswer;
    window.updateFontSize = updateFontSize;
    document.getElementById("volume-slider").addEventListener("input", (event) => {
        updateMasterVolume(parseInt(event.target.value), 1);
    });

    main.socket.on("_blankSound", () => {
        pushAudioAndPlay(audio.blankAudio.cloneNode());
    });

    main.socket.on("_startRound", () => {
        pushAudioAndPlay(startRoundAudio);
        contestUI("on");
    });

    main.socket.on("_contestUI", () => {
        chat.offChatUI();
        contestUI("on");
    });

    main.socket.on("_playMedia", (mediaUrl) => {
        const mediaType = getMediaType(mediaUrl);
        if (mediaType == "audio") {
            questionAudio.pause();
            questionAudio.src = mediaUrl;
            questionAudio.currentTime = 0;
            questionAudio.play();
        } else if (mediaType == "video") {
            document.getElementById("media").innerHTML += "<video preload='auto' disablePictureInPicture controlsList='nodownload' src='" + mediaUrl + "'></video>";
            const media = document.querySelector("#media video");
            if (media) {
                media.play();
                media.onended = () => {
                    document.getElementById("media").innerHTML = "";
                };
            }
        }
    });

    main.socket.on("_closeMedia", () => {
        questionAudio.pause();
        const media = document.querySelector("#media video");
        if (media) {
            media.pause();
            document.getElementById("media").innerHTML = "";
        }
    });

    main.socket.on("_summarize", () => {
        pushAudioAndPlay(audio.summaryAudio);
    });

    main.socket.on("_finishRound", () => {
        defaultState();
        resetAnswerZone();
        contestUI("off");
        chat.ChatUI();
        document.getElementById("custom-status").innerHTML = "";
    });

    main.socket.on("_resetStatus", (roundID) => {
        if (roundID == 2) {
            for (let i = 0; i < 4; i++) document.getElementById("OBS_row-" + (i + 1)).style.color = "white";
            document.getElementById("OBS_print-signal").innerHTML = "";
        }
    });
};

export const roundUI = () => {
    defaultPlayerFunction();
    const parent = document.getElementById("custom-status");
    parent.innerHTML = "";

    if (main.currentRoundID == 1) {
        parent.innerHTML += '<div id="STR_player"></div><div id="STR_progress"></div><div id="STR_subject"></div>';
        document.getElementById("signal-button").innerHTML = "<i class='fa-solid fa-bell'></i>&nbsp&nbspGIÀNH QUYỀN TRẢ LỜI";
        startRoundAudio.src = audio.STR_startRoundAudio.src;
    } else if (main.currentRoundID == 2) {
        parent.innerHTML += '<div id="OBS_ACC_SFI_status"></div>';
        useAnswerInput("on");
        useSignalButton("on");
        document.getElementById("signal-button").innerHTML = "<i class='fa-solid fa-bell'></i>&nbsp&nbspTRẢ LỜI CHƯỚNG NGẠI VẬT";
        startRoundAudio.src = audio.OBS_startRoundAudio.src;
    } else if (main.currentRoundID == 3) {
        parent.innerHTML += '<div id="OBS_ACC_SFI_status"></div>';
        startRoundAudio.src = audio.ACC_startRoundAudio.src;
    } else if (main.currentRoundID == 4) {
        parent.innerHTML += '<div id="FIN_star"><img></div><div id="FIN_player"></div><div id="FIN_pack"></div><div id="FIN_question"></div>';
        document.getElementById("signal-button").innerHTML = "<i class='fa-solid fa-bell'></i>&nbsp&nbspGIÀNH QUYỀN TRẢ LỜI";
        startRoundAudio.src = audio.FIN_startRoundAudio.src;
    }
    Array.from(parent.getElementsByTagName("*")).forEach((element) => {
        element.style.visibility = "visible";
    });
};

export const contestUI = (state) => {
    if (state == "on") {
        const parentElement = document.getElementById("player-interface");
        const childElements = parentElement.getElementsByTagName("*");
        const Obstacle = document.getElementById("obstacle-interface");
        const Finish = document.getElementById("finish-interface");
        for (let i = 0; i < childElements.length; i++) {
            if (!Obstacle.contains(childElements[i]) && !Finish.contains(childElements[i])) childElements[i].style.visibility = "visible";
        }
    } else {
        const parentElement = document.getElementById("player-interface");
        const childElements = parentElement.getElementsByTagName("*");
        for (let i = 0; i < childElements.length; i++) {
            childElements[i].style.visibility = "hidden";
        }
    }
};

export const defaultState = () => {
    document.getElementById("media").innerHTML = "";
    document.getElementById("question-text").textContent = "";
    document.getElementById("time-left").textContent = "";
    defaultPlayerFunction();
    for (let i = 1; i <= 4; i++) {
        document.getElementById("answer-name-" + i).textContent = "";
        document.getElementById("answer-text-" + i).textContent = "";
    }
};

export const defaultPlayerFunction = () => {
    document.getElementById("answer-input").value = "";
    document.getElementById("answer-input").disabled = true;
    document.getElementById("answer").style.opacity = 0.5;
    document.getElementById("save-answer-text").style.color = "white";
    document.getElementById("save-answer-text").textContent = "";
    document.getElementById("save-answer").style.opacity = 0.5;
    document.getElementById("signal-button").disabled = true;
    document.getElementById("signal-button").style.opacity = 0.5;
    document.getElementById("signal-button").textContent = "";
    document.getElementById("signal-button").onmouseover = "";
    document.getElementById("signal-button").style.backgroundColor = "#FF6961";
    document.getElementById("signal-button").style.cursor = "default";
};

export const resetAnswerZone = () => {
    for (let i = 1; i <= 4; i++) {
        document.getElementById("answer-" + i).style.opacity = 1;
        document.getElementById("answer-name-" + i).textContent = "";
        document.getElementById("answer-text-" + i).textContent = "";
    }
};

export const useAnswerInput = (state) => {
    if (state == "on") {
        document.getElementById("answer").style.opacity = 1;
        document.getElementById("answer-input").disabled = false;
        document.getElementById("save-answer").style.opacity = 1;
    } else {
        document.getElementById("answer-input").value = "";
        document.getElementById("answer-input").disabled = true;
        document.getElementById("answer").style.opacity = 0.5;
        document.getElementById("save-answer").style.opacity = 0.5;
    }
};

export const useSignalButton = (state) => {
    if (state == "on") {
        document.getElementById("signal-button").disabled = false;
        document.getElementById("signal-button").style.opacity = 1;
        document.getElementById("signal-button").onmouseover = () => {
            document.getElementById("signal-button").style.backgroundColor = "orange";
            document.getElementById("signal-button").style.cursor = "pointer";
        };
        document.getElementById("signal-button").onmouseout = () => {
            document.getElementById("signal-button").style.backgroundColor = "#FF6961";
            document.getElementById("signal-button").style.cursor = "default";
        };
    } else {
        document.getElementById("signal-button").disabled = true;
        document.getElementById("signal-button").style.opacity = 0.5;
        document.getElementById("signal-button").onmouseover = "";
        document.getElementById("signal-button").style.borderColor = "orange";
        document.getElementById("signal-button").style.cursor = "default";
    }
};

export const updateFontSize = (button, fontSize, flag) => {
    const element = document.getElementById("question-text");
    let vw;
    if (button) {
        const style = window.getComputedStyle(element);
        const value = parseFloat(style.getPropertyValue("font-size"));
        vw = (value / window.innerWidth) * 100;
        vw = parseFloat(vw.toFixed(1));
        if (button.id == "up-font-size" && vw < 1.5) vw = parseFloat((vw + 0.1).toFixed(1));
        else if (button.id == "down-font-size" && vw > 0.5) vw = parseFloat((vw - 0.1).toFixed(1));
    } else vw = fontSize;
    element.style.fontSize = vw + "vw";
    sessionStorage.setItem("fontSize", JSON.stringify(vw));
    if (flag) chat.updateFontSize(vw, 0);
};

export const allowBlankAnswer = () => {
    isAllowBlankAnswer = !isAllowBlankAnswer;
    updateAllowBlankAnswer(undefined, 1);
};

export const getMediaType = (mediaUrl) => {
    if (mediaUrl) {
        let extension = mediaUrl.split(".").pop().toLowerCase();
        if (extension === "jpg" || extension === "jpeg" || extension === "png" || extension === "gif") return "image";
        else if (extension === "mp4" || extension === "avi" || extension === "mov" || extension === "wmv") return "video";
        else if (extension === "mp3" || extension === "wav" || extension === "ogg") return "audio";
    }
    return "unknown";
};

export const updateAllowBlankAnswer = (value, flag) => {
    if (value != undefined) isAllowBlankAnswer = value;
    sessionStorage.setItem("allowBlankAnswer", JSON.stringify(isAllowBlankAnswer));
    if (isAllowBlankAnswer) {
        document.getElementById("allow-blank-answer").innerHTML = "<i class='fa-solid fa-lightbulb'></i>&nbsp&nbspNộp đáp án rỗng: Có";
    } else {
        document.getElementById("allow-blank-answer").innerHTML = "<i class='fa-solid fa-lightbulb'></i>&nbsp&nbspNộp đáp án rỗng: Không";
    }
    if (flag) chat.updateAllowBlankAnswer(0);
};

const playAudio = (audio) => {
    audio.pause();
    audio.volume = masterVolume;
    audio.currentTime = 0;
    audio.play();
};

export const pushAudioAndPlay = (audio) => {
    const currentCounter = ++playingAudioList.audioCounter;
    playingAudioList[currentCounter] = audio;
    audio.addEventListener("ended", () => {
        delete playingAudioList[currentCounter];
    });
    playAudio(audio);
};

export const playStartLoop = (nextAudio, currentAudio) => {
    const volumeStep = 0.01;
    const interval = 5;
    playAudio(playingAudioList[nextAudio - 1]);
    if (currentAudio) {
        const fadeOutInterval = setInterval(() => {
            playingAudioList[currentAudio - 1].volume = Math.max(playingAudioList[currentAudio - 1].volume - volumeStep, 0);
            if (playingAudioList[currentAudio - 1].volume === 0) {
                playingAudioList[currentAudio - 1].pause();
                clearInterval(fadeOutInterval);
            }
        }, interval);
    }
};

export const stopAllStartLoop = () => {
    for (let i = 0; i < 4; i++) {
        playingAudioList[i].pause();
    }
};

export const updateMasterVolume = (value, flag) => {
    masterVolume = value / 100;
    for (let index in playingAudioList) {
        const nIndex = Number(index);
        if (!Number.isNaN(nIndex)) {
            playingAudioList[nIndex].volume = masterVolume;
        }
    }
    sessionStorage.setItem("masterVolume", JSON.stringify(masterVolume));
    document.getElementById("volume-slider").value = value;
    document.getElementById("volume-value").textContent = "Âm lượng: " + value + "%";
    if (flag) chat.updateMasterVolume(value, 0);
};
