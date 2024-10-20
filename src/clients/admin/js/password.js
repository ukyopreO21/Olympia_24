import * as main from "./main.js";

export const handle = () => {
    window.sendAdminPassword = sendAdminPassword;
    document.getElementById("password-input").addEventListener("keyup", (event) => {
        if (event.key === "Enter") sendAdminPassword();
    });
    autoCheckPassword();

    main.socket.on("_sendAdminPassword", (password) => {
        sessionStorage.setItem("adminPassword", JSON.stringify(password));
        document.getElementById("password-interface").style.display = "none";
        document.getElementById("database-interface").src = "/database/?url=" + password;
        main.socket.emit("hostEnterRoom");
    });

    main.socket.on("serverData", (data) => {
        document.getElementById("database-number").value = data.databaseChosen;
        for (let i = 1; i <= 4; i++) {
            document.getElementById("player-name-" + i).value = data.playerName[i - 1];
            document.getElementById("player-point-" + i).value = data.playerPoint[i - 1];
            document.getElementById("name-" + i).textContent = data.playerName[i - 1];
            if (data.isReady[i - 1]) document.getElementById("TS" + i).style.color = "yellowgreen";
        }
    });
};

const autoCheckPassword = () => {
    const adminPassword = JSON.parse(sessionStorage.getItem("adminPassword"));
    if (adminPassword != undefined) {
        main.socket.emit("sendAdminPassword", adminPassword);
    }
};

const sendAdminPassword = () => {
    main.socket.emit("sendAdminPassword", Number(document.getElementById("password-input").value));
};
