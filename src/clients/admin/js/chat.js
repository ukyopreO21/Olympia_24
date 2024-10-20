import * as main from "./main.js";
export var isChatBan = false;

export const handle = () => {
    window.changeChatRules = changeChatRules;

    document.getElementById("chat-input").addEventListener("keyup", (event) => {
        if (event.key === "Enter" && document.getElementById("chat-input").value != "") {
            const username = "Host";
            const message = document.getElementById("chat-input").value;
            if (message == "/clear") {
                document.getElementById("chat-box").innerHTML = "";
            } else
                main.socket.emit("sendChat", {
                    username,
                    message,
                    playerNumber: "0",
                });
            document.getElementById("chat-input").value = "";
        }
    });

    document.getElementById("chat-input").addEventListener("paste", (event) => {
        const items = (event.clipboardData || event.originalEvent.clipboardData).items;
        for (let i = 0; i < items.length; i++) {
            if (items[i].type.indexOf("image") !== -1 || items[i].type.indexOf("video") !== -1 || items[i].type.indexOf("audio") !== -1) {
                const blob = items[i].getAsFile();
                const formData = new FormData();
                const username = "Host";
                const userData = JSON.stringify({ username: username, playerNumber: "0" });
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
    });

    main.socket.on("sendChatLog", (chatLog) => {
        for (let i = 0; i < chatLog.length; i++) {
            printChat(chatLog[i]);
        }
    });

    main.socket.on("_sendChat", (data) => {
        const checkScroll = scrollDown();
        const box = document.getElementById("chat-box");
        printChat(data);
        if (checkScroll) box.scrollTop = box.scrollHeight;
    });
};

const scrollDown = () => {
    const chatBox = document.getElementById("chat-box");
    return chatBox.scrollHeight - chatBox.scrollTop <= chatBox.clientHeight * 1.1;
};

const printChat = (data) => {
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

const changeChatRules = () => {
    if (isChatBan == false) {
        isChatBan = true;
        document.getElementById("chat-status").innerHTML = "Trạng thái: Đang tắt";
    } else {
        isChatBan = false;
        document.getElementById("chat-status").innerHTML = "Trạng thái: Đang bật";
    }
    main.socket.emit("changeChatRules", isChatBan);
};
