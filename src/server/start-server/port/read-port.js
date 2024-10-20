const path = require("path");
const fs = require("fs").promises;

const port = async () => {
    try {
        const data = await fs.readFile(path.join(__dirname, "/port.txt"), { encoding: "utf-8" });
        const PORT = parseInt(data.trim(), 10);
        return PORT;
    } catch (err) {
        console.error(err);
    }
};

module.exports = port;
