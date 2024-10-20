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
        main.socket.emit("hostEnterRoom");
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
