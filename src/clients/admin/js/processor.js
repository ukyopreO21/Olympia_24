import * as main from "./main.js";
import * as chat from "./chat.js";
import * as funcs from "./funcs.js";

const questionAudio = new Audio();

export const handle = () => {
    main.socket.on("serverRestarted", () => {
        alert("Server đã khởi động trở lại, vui lòng F5 để cập nhật lại tình trạng.");
        window.location.reload();
    });

    main.socket.on("_getPlayerData", () => {
        sendPlayerData();
    });

    main.socket.on("_sendReady", (data) => {
        const ele = document.querySelector(".player-data-" + data.playerNumber + " .player-name");
        if (data.ready) ele.style.color = "yellowgreen";
        else ele.style.color = "white";
    });

    main.socket.on("playerDataFromDatabase", (data) => {
        for (let i = 1; i <= 4; i++) {
            document.getElementById("player-name-" + i).value = data.playerName[i - 1];
            document.getElementById("player-point-" + i).value = data.playerPoint[i - 1];
        }
        funcs.sendPlayerData();
    });

    main.socket.on("_OBS_sendAnswer", (answerData) => {
        const answerLabel = "answer-" + answerData.playerNumber;
        document.getElementById(answerLabel).innerHTML = answerData.playerAnswer;
    });

    main.socket.on("getRoundID", () => {
        main.socket.emit("_getRoundID", Number(document.getElementById("rounds").value));
    });

    main.socket.on("getCurrentUI", () => {
        const roundID = Number(document.getElementById("rounds").value);
        const UIName = document.getElementById("interface-name").textContent;
        main.socket.emit("sendCurrentUI", { isChatBan: chat.isChatBan, roundID, UIName });
    });

    main.socket.on("_playMedia", (mediaUrl) => {
        const mediaType = funcs.getMediaType(mediaUrl);
        if (mediaType == "audio") {
            questionAudio.pause();
            questionAudio.src = mediaUrl;
            questionAudio.currentTime = 0;
            questionAudio.play();
        } else if (mediaType == "video") {
            document.getElementById("FIN_media").innerHTML += "<video preload='auto' disablePictureInPicture controlsList='nodownload' src='" + mediaUrl + "'></video>";
            const media = document.querySelector("#FIN_media video");
            if (media) {
                media.play();
                media.onended = () => {
                    document.getElementById("FIN_media").innerHTML = "";
                };
            }
        }
    });

    main.socket.on("_closeMedia", () => {
        questionAudio.pause();
        const media = document.querySelector("#FIN_media video");
        if (media) {
            media.pause();
            document.getElementById("FIN_media").innerHTML = "";
        }
    });
};
