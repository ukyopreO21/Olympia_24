import * as main from "./main.js";
import * as chat from "./chat-room.js";
import * as match from "./match-room.js";

export const logIn = () => {
    //Xử lý khi player đăng nhập
    main.socket.on("_playerEnterRoom", () => {
        // font size
        const fontSize = JSON.parse(sessionStorage.getItem("fontSize"));
        if (!fontSize) {
            match.updateFontSize(undefined, 1, 1);
        } else {
            match.updateFontSize(undefined, Number(fontSize).toFixed(1), 1);
        }

        //blank answer
        const isAllowBlankAnswer = JSON.parse(sessionStorage.getItem("allowBlankAnswer"));
        if (isAllowBlankAnswer == undefined) {
            match.updateAllowBlankAnswer(false, 1);
        } else {
            match.updateAllowBlankAnswer(isAllowBlankAnswer, 1);
        }

        //volume
        const volume = JSON.parse(sessionStorage.getItem("masterVolume"));
        if (!volume) {
            match.updateMasterVolume(50, 1);
        } else {
            match.updateMasterVolume(volume * 100, 1);
        }
    });

    main.socket.on("sendPlayersData", (data) => {
        document.getElementById("chat-room-player-" + main.playerNumber).style.color = "orange";
        for (let i = 1; i <= 4; i++) {
            //phòng chờ
            document.getElementById("chat-room-name-" + i).textContent = data.playerName[i - 1];
            document.getElementById("chat-room-point-" + i).textContent = data.playerPoint[i - 1];
            if (data.isReady[i - 1]) document.getElementById("chat-room-player-" + i).innerHTML += '<img class="ready" src="./Others/Ready.png"></img>';
            //trong phòng thi
            main.allPlayerName[i - 1] = data.playerName[i - 1];
            main.allPlayerPoint[i - 1] = data.playerPoint[i - 1];
            document.getElementById("name-" + i).textContent = main.allPlayerName[i - 1];
            document.getElementById("point-" + i).textContent = main.allPlayerPoint[i - 1];
        }
    });

    main.socket.on("_sendCurrentUI", (UIData) => {
        main.updateRoundID(UIData.roundID);
        document.getElementById("round-name").innerHTML = main.roundName[main.currentRoundID];
        document.getElementById("current-round").innerHTML = main.roundName[main.currentRoundID];
        if (UIData.UIName == "Phòng chat") {
            match.contestUI("off");
            chat.ChatUI();
        } else {
            chat.offChatUI();
            match.contestUI("on");
            match.roundUI();
        }
        if (UIData.isChatBan == false) document.getElementById("message-input").addEventListener("keypress", chat.sendText);
        else document.getElementById("message-input").removeEventListener("keypress", chat.sendText);
    });

    main.socket.on("sendChatLog", (chatLog) => {
        for (let i = 0; i < chatLog.length; i++) {
            chat.printChat(chatLog[i]);
        }
    });
};
