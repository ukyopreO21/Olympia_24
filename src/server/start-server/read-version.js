const fs = require("fs").promises;

const handle = (socket) => {
    socket.on("getVersion", async () => {
        socket.emit("_getVersion", await getAppVersion());
    });
};

const getAppVersion = async () => {
    try {
        const data = await fs.readFile("./package.json");
        const package = JSON.parse(data);
        return "v" + package.version;
    } catch (err) {
        console.error(err);
    }
};

module.exports = { handle, getAppVersion };
