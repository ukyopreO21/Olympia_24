export const requestVersion = (socket) => {
    socket.emit("getVersion");

    socket.on("_getVersion", (appVersion) => {
        document.getElementById("current-version").textContent = appVersion;
    });
};
