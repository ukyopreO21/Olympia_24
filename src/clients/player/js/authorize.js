import * as main from "./main.js";

export const authorize = () => {
    main.socket.emit("playerEnterRoom", main.playerNumber);

    window.addEventListener("beforeunload", () => {
        if (main.signOutReason != "differentUserID") main.socket.emit("signOut", main.playerNumber);
        main.socket.emit("sendReady", { playerNumber: main.playerNumber, ready: false });
    });

    if (performance.getEntriesByType("navigation")[0].type === "back_forward") {
        sessionStorage.clear();
    }

    if (main.playerNumber != 1 && main.playerNumber != 2 && main.playerNumber != 3 && main.playerNumber != 4) {
        main.updateSignOutReason("playerNumberInvalid");
        sessionStorage.clear();
        window.location.replace("http://" + window.location.host);
    }

    main.socket.on("firstLogIn", () => {
        const userID = Math.floor(Date.now()) + Math.random().toString(36).substring(2, 8);
        sessionStorage.setItem("userID", userID);
        main.socket.emit("_firstLogIn", { playerNumber: main.playerNumber, userID });
        legitLogIn();
    });

    main.socket.on("checkLogIn", (data) => {
        if (data != sessionStorage.getItem("userID")) {
            main.updateSignOutReason("differentUserID");
            sessionStorage.clear();
            window.location.replace("http://" + window.location.host);
        } else {
            legitLogIn();
        }
    });
};

const legitLogIn = () => {
    main.socket.emit("legitLogIn", main.playerNumber);
};
