import * as main from "./main.js";
import * as match from "./match-room.js";

export const handle = () => {
    document.getElementById("message-input").addEventListener("keypress", sendText);
    document.getElementById("message-input").addEventListener("paste", sendMedia);
    document.getElementById("chat-room-volume-slider").addEventListener("input", () => updateMasterVolume(document.getElementById("chat-room-volume-slider").value, 1));
    document.getElementById("chat-room-volume-input").addEventListener("input", () => updateMasterVolume(document.getElementById("chat-room-volume-input").value, 1));
    document.getElementById("chat-room-blank-answer").addEventListener("click", () => updateAllowBlankAnswer(1));
    document.getElementById("chat-room-font-size-slider").addEventListener("input", () => updateFontSize(document.getElementById("chat-room-font-size-slider").value, 1));
    document.getElementById("chat-room-font-size-input").addEventListener("input", () => updateFontSize(document.getElementById("chat-room-font-size-input").value, 1));

    window.sendReady = sendReady;

    main.socket.on("_chatUI", () => {
        match.contestUI("off");
        ChatUI();
    });

    main.socket.on("_sendReady", (data) => {
        if (data.ready) document.getElementById("chat-room-player-" + data.playerNumber).innerHTML += '<img class="ready" src="/src/assets/Others/Ready.png"></img>';
        else {
            const ready = document.querySelector("#chat-room-player-" + data.playerNumber + " .ready");
            ready.parentNode.removeChild(ready);
        }
    });

    main.socket.on("_sendChat", (data) => {
        const checkScroll = scrollDown();
        const box = document.getElementById("chat-box");
        printChat(data);
        if (checkScroll) box.scrollTop = box.scrollHeight;
    });

    main.socket.on("_changeChatRules", (rule) => {
        const chatbotText = document.getElementById("messages");
        if (rule == false) {
            document.getElementById("message-input").addEventListener("keypress", sendText);
            chatbotText.innerHTML += '<li style="color: orange">[' + "Chatbot" + "]: " + "Server đã mở chat" + "</li>";
        } else {
            document.getElementById("message-input").removeEventListener("keypress", sendText);
            chatbotText.innerHTML += '<li style="color: orange">[' + "Chatbot" + "]: " + "Server đã tắt chat" + "</li>";
        }
    });
};

export const ChatUI = () => {
    const parentElement = document.getElementById("chat-interface");
    const childElements = parentElement.getElementsByTagName("*");

    for (let i = 0; i < childElements.length; i++) {
        childElements[i].style.visibility = "visible";
    }
};

export const offChatUI = () => {
    const parentElement = document.getElementById("chat-interface");
    const childElements = parentElement.getElementsByTagName("*");
    for (let i = 0; i < childElements.length; i++) {
        childElements[i].style.visibility = "hidden";
    }
};

const sendReady = () => {
    if (document.getElementById("ready-button").textContent == "SẴN SÀNG") {
        document.getElementById("ready-button").classList.add("active");
        main.socket.emit("sendReady", { playerNumber: main.playerNumber, ready: true });
        document.getElementById("ready-button").textContent = "HUỶ SẴN SÀNG";
    } else {
        document.getElementById("ready-button").classList.remove("active");
        main.socket.emit("sendReady", { playerNumber: main.playerNumber, ready: false });
        document.getElementById("ready-button").textContent = "SẴN SÀNG";
    }
};

//XỬ LÝ CHAT
export const printChat = (data) => {
    const box = document.getElementById("chat-box");
    let textColor;
    if (data.username == "Host") textColor = "#FE9D88";
    else textColor = "white";
    if (data.mediaType) {
        if (data.mediaType == "image") {
            box.innerHTML +=
                "<div> <span style='font-family: \"Chivo Mono\", monospace; color: cyan'>" +
                data.time +
                "</span> | <font color='orange'>" +
                data.username +
                "</font>:<br><img class='chat-media' src='" +
                data.mediaUrl +
                "'></div>";
        } else if (data.mediaType == "video") {
            box.innerHTML +=
                "<div> <span style='font-family: \"Chivo Mono\", monospace; color: cyan'>" +
                data.time +
                "</span> | <font color='orange'>" +
                data.username +
                "</font>:<br><video class='chat-media' controls src='" +
                data.mediaUrl +
                "'></video></div>";
        } else {
            //audio
            box.innerHTML +=
                "<div> <span style='font-family: \"Chivo Mono\", monospace; color: cyan'>" +
                data.time +
                "</span> | <font color='orange'>" +
                data.username +
                "</font>:<br><audio class='chat-media' controls src='" +
                data.mediaUrl +
                "'></audio></div>";
        }
    } else {
        box.innerHTML +=
            "<div> <span style='font-family: \"Chivo Mono\", monospace; color: cyan'>" +
            data.time +
            "</span> | <font color='orange'>" +
            data.username +
            "</font>: <font color='" +
            textColor +
            "'>" +
            data.message +
            "</font></div>";
    }
};

const sendText = (event) => {
    if (event.keyCode == 13 && document.getElementById("message-input").value != "") {
        const message = document.getElementById("message-input").value;
        if (message == "/clear") {
            document.getElementById("chat-box").innerHTML = "";
        } else
            main.socket.emit("sendChat", {
                username: "",
                message,
                playerNumber: main.playerNumber,
            });
        document.getElementById("message-input").value = "";
    }
};

const sendMedia = (event) => {
    const items = (event.clipboardData || event.originalEvent.clipboardData).items;
    for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf("image") !== -1 || items[i].type.indexOf("video") !== -1 || items[i].type.indexOf("audio") !== -1) {
            const blob = items[i].getAsFile();
            const formData = new FormData();
            // const username = String(document.getElementById("username").value).trim();
            const userData = JSON.stringify({ username: "", playerNumber: main.playerNumber });
            formData.append("media", blob);
            formData.append("userData", userData);
            fetch("/uploadMedia", {
                method: "POST",
                body: formData,
            }).catch((error) => {
                console.error("Error:", error);
            });
            return;
        }
    }
};

const scrollDown = () => {
    const chatBox = document.getElementById("chat-box");
    return chatBox.scrollHeight - chatBox.scrollTop <= chatBox.clientHeight * 1.1;
};

export const updateFontSize = (fontSize, flag) => {
    document.getElementById("chat-room-font-size-slider").value = fontSize;
    document.getElementById("chat-room-font-size-input").value = fontSize;
    document.getElementById("chat-room-demo-text").style.fontSize = fontSize + "vw";
    if (flag) match.updateFontSize(undefined, fontSize, 0);
};

export const updateAllowBlankAnswer = (flag) => {
    if (flag) match.allowBlankAnswer();
    else document.getElementById("chat-room-blank-answer").textContent = match.isAllowBlankAnswer ? "CÓ" : "KHÔNG";
};

export const updateMasterVolume = (value, flag) => {
    document.getElementById("chat-room-volume-slider").value = value;
    document.getElementById("chat-room-volume-input").value = value;
    if (flag) match.updateMasterVolume(value, 0);
};
